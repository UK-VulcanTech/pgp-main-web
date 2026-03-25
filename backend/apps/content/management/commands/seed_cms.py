import json
import os
import subprocess
import tempfile
from pathlib import Path

from django.core.files import File
from django.core.management.base import BaseCommand
from django.db import transaction

from apps.content.models import (
    AboutApproachStep,
    AboutDifferentiatorCard,
    AboutPage,
    CaseStudy,
    CaseStudyQuadrant,
    ContactPage,
    ContactSectorOption,
    FooterLink,
    HomeHowStep,
    HomePage,
    HomePillar,
    ImpactMetric,
    ImpactPage,
    SiteSettings,
    Solution,
    SolutionDeliverable,
    SolutionSnapshotCard,
    TechnologyDomain,
    TechnologyEnablementItem,
    TechnologyPage,
    TrainingArea,
    TrainingCard,
    TrainingNavItem,
)


def _repo_root() -> Path:
    return Path(__file__).resolve().parents[5]


# Matches legacy marketing `Solutions.js` order (default + hover PNGs under src/assets/icons).
_SNAPSHOT_ICON_FILES = [
    ("energy-icon.png", "energyHover.png"),
    ("brightness-icon.png", "brightnessHover.png"),
    ("drop-icon.png", "dropHover.png"),
    ("waste.png", "wasteHover.png"),
    ("transport.png", "transportHover.png"),
    ("agriculture.png", "agricultureHOVER.png"),
    ("tech.png", "techHover.png"),
    ("healthcare.png", "healthHover.png"),
    ("real-estate.png", "realEstateHover.png"),
    ("trainings-icon.png", "trainingHover.png"),
    ("capital-icon.png", "capitalHover.png"),
]


def _icons_base_dir() -> Path:
    root = _repo_root()
    for sub in ("pgp-main-web-main-old", "main_web"):
        d = root / sub / "src" / "assets" / "icons"
        if d.is_dir():
            return d
    return root / "main_web" / "src" / "assets" / "icons"


def _load_js_object(relative_src_path: str, export_name: str) -> dict:
    """Parse a simple `export const Name = { ... };` file via Node (same repo as frontend)."""
    js_path = _repo_root() / "src" / "data" / relative_src_path
    if not js_path.is_file():
        return {}
    raw = js_path.read_text(encoding="utf-8")
    cjs = raw.replace(f"export const {export_name} =", "module.exports =", 1)
    with tempfile.NamedTemporaryFile(
        mode="w", suffix=".cjs", delete=False, encoding="utf-8"
    ) as tmp:
        tmp.write(cjs)
        tmp_path = tmp.name
    try:
        proc = subprocess.run(
            [
                "node",
                "-e",
                "console.log(JSON.stringify(require(process.argv[1])))",
                tmp_path,
            ],
            capture_output=True,
            text=True,
            timeout=30,
        )
        if proc.returncode != 0:
            raise RuntimeError(proc.stderr or proc.stdout)
        return json.loads(proc.stdout)
    finally:
        try:
            os.unlink(tmp_path)
        except OSError:
            pass


# Nav order matches `src/components/ui/NavBar.jsx` (Technology injected in public API, not stored as Solution).
NAV = [
    ("energy-infrastructure", "Energy Infrastructure", "Optimizing grid reliability", 1, 0),
    ("renewables", "Renewables", "Scalable green power", 1, 1),
    ("agriculture", "Agriculture", "Modernizing food chains", 1, 2),
    ("healthcare", "Healthcare", "Strengthening care access", 1, 4),
    ("waste-recycling", "Waste & Recycling", "Modern environmental systems", 2, 0),
    ("water-sanitation", "Water & Sanitation", "Sustainable lifecycle services", 2, 1),
    ("transportation", "Transportation", "Enhancing global mobility", 2, 2),
    ("real-estate", "Real Estate", "High-impact asset development", 2, 3),
    ("capital-access", "Capital Access", "Connecting funding to execution", 2, 4),
]


class Command(BaseCommand):
    help = "Populate CMS tables from frontend src/data/*.js (requires Node.js) plus static page defaults."

    def add_arguments(self, parser):
        parser.add_argument(
            "--force",
            action="store_true",
            help="Clear content tables and re-seed (destructive).",
        )

    def handle(self, *args, **options):
        force = options["force"]
        if force:
            self._truncate_content()
        elif Solution.objects.exists():
            self.stdout.write(self.style.WARNING("Already seeded. Use --force to replace."))
            return

        sol_js = _load_js_object("solutionsData.js", "solutionsData")
        train_js = _load_js_object("trainingAreasData.js", "trainingAreasData") or {}
        if not sol_js:
            self.stdout.write(
                self.style.ERROR(
                    "Could not load solutionsData.js (Node missing or path wrong). "
                    "Install Node or run from repo root."
                )
            )
            return

        with transaction.atomic():
            self._seed_site_footer()
            self._seed_home_about_contact_impact_tech()
            self._seed_solutions(sol_js)
            self._seed_training(train_js)
            self._seed_training_nav()

        self.stdout.write(self.style.SUCCESS("CMS seed complete."))

    def _truncate_content(self):
        models = [
            SolutionDeliverable,
            Solution,
            TrainingCard,
            TrainingArea,
            TrainingNavItem,
            CaseStudyQuadrant,
            CaseStudy,
            ImpactMetric,
            TechnologyEnablementItem,
            TechnologyDomain,
            HomePillar,
            HomeHowStep,
            SolutionSnapshotCard,
            AboutDifferentiatorCard,
            AboutApproachStep,
            ContactSectorOption,
            FooterLink,
        ]
        for m in models:
            m.objects.all().delete()
        for singleton in (
            HomePage,
            AboutPage,
            ContactPage,
            ImpactPage,
            TechnologyPage,
            SiteSettings,
        ):
            singleton.objects.all().delete()

    def _seed_site_footer(self):
        s = SiteSettings.load()
        s.meta_title = "Peak Global Partners"
        s.meta_description = "Full-service technology services for high-impact partnerships."
        s.footer_tagline = "Building systems that last"
        s.footer_company_line1 = "Peak Global"
        s.footer_company_line2 = "Partners"
        s.footer_address = "724 W. Lancaster Ave Suite 210\nWayne, PA 19087"
        s.footer_email = "info@peakgobalpartner.com"
        s.footer_phone = "610-602-4200"
        s.copyright_line = "© 2026 Peak Global Partners. All Rights Reserved."
        s.save()
        for cat, rows in [
            (
                FooterLink.Category.QUICK,
                [
                    ("Home", "/"),
                    ("Our Solutions", "/#solutions"),
                    ("Capabilities", "/about"),
                    ("Partnership Model", "/about#how-we-deliver"),
                    ("Contact Us", "/contact"),
                ],
            ),
            (
                FooterLink.Category.SECTOR,
                [
                    ("Energy & Water", "/solutions/energy-infrastructure"),
                    ("Infrastructure & Waste", "/solutions/waste-recycling"),
                    ("Healthcare & Real Estate", "/solutions/healthcare"),
                    ("Technology & Digital", "/solutions/technology"),
                ],
            ),
            (
                FooterLink.Category.LEGAL,
                [
                    ("Privacy Policy", "/privacy"),
                    ("Terms of Use", "/terms"),
                    ("Legal", "/legal"),
                    ("Site Map", "/sitemap"),
                ],
            ),
        ]:
            for i, (label, url) in enumerate(rows):
                FooterLink.objects.create(category=cat, label=label, url=url, sort_order=i)

    def _seed_home_about_contact_impact_tech(self):
        h = HomePage.load()
        h.hero_eyebrow = "Peak Global Partners"
        h.hero_h1 = (
            "Full-Service\nTechnology\nServices For\nHigh‑Impact\nPartnerships"
        )
        h.hero_body = (
            "Peak Global Partners (PGP) leads complex, multi-stakeholder programs—from "
            "feasibility to delivery—combining governance, operational leadership, and "
            "technology integration to produce measurable, sustainable outcomes."
        )
        h.hero_cta_primary_label = "Explore Solutions"
        h.hero_cta_primary_url = "/solutions/energy-infrastructure"
        h.hero_cta_secondary_label = "Talk to Our Team"
        h.hero_cta_secondary_url = "/contact"
        h.what_deliver_title = "What PGP Delivers"
        h.ppp_heading = "BUILT FOR PUBLIC-PRIVATE PARTNERSHIPS"
        h.ppp_body = (
            "PGP specializes in initiatives that require tight coordination between "
            "government agencies, private operators, investors, and local communities. "
            "We provide the program structure, operational oversight, and execution "
            "discipline to move projects from concept to sustainable delivery."
        )
        h.solutions_snapshot_title = "SOLUTIONS SNAPSHOT"
        h.how_we_work_title = "How We Work"
        h.cta_heading = "READY TO DELIVER"
        h.cta_body = (
            "Let's discuss your partnership goals and the operating model needed to achieve them."
        )
        h.cta_button_label = "CONTACT PGP"
        h.cta_button_url = "/contact"
        h.save()
        pillars = [
            (
                "INFRASTRUCTURE + ESSENTIAL SERVICES",
                "Modernize and operate systems that communities and economies rely on.",
            ),
            (
                "TECHNOLOGY ENABLEMENT",
                "Deploy platforms and command capabilities that improve visibility, coordination, & performance.",
            ),
            (
                "CAPACITY + CAPITAL ALIGNMENT",
                "Build local capability and align funding pathways to long-term sustainment.",
            ),
        ]
        for i, (t, d) in enumerate(pillars):
            HomePillar.objects.create(home=h, sort_order=i, title=t, description=d)
        steps = [
            ("Define", "Align stakeholders, scope, and success measures"),
            ("Design", "Build the roadmap, operating model, and delivery plan"),
            ("Deliver", "Execute with governance, reporting, and performance controls"),
            ("Sustain", "Transfer skills and establish lifecycle operations for continuity"),
        ]
        for i, (t, d) in enumerate(steps):
            HomeHowStep.objects.create(home=h, sort_order=i, title=t, description=d)
        snapshots = [
            (
                "ENERGY INFRASTRUCTURE",
                "Modernize and operate energy systems to improve reliability, resilience, and long term performance.",
            ),
            (
                "RENEWABLES",
                "Deliver scalable renewable programs with disciplined execution and operational readiness.",
            ),
            (
                "WATER & SANITATION",
                "Strengthen water access and sanitation services through lifecycle-focused delivery and operations.",
            ),
            (
                "WASTE & RECYCLING",
                "Build modern waste systems that improve public health, efficiency, and environmental outcomes.",
            ),
            (
                "TRANSPORTATION",
                "Deliver roads and port operations improvements that increase throughput and mobility.",
            ),
            (
                "AGRICULTURE & AGRIBUSINESS",
                "Enable food security and market readiness through value-chain modernization and best practices.",
            ),
            (
                "TECHNOLOGY",
                "Deploy solutions, data centers, and command centers that improve visibility, coordination, and performance.",
            ),
            (
                "HEALTHCARE",
                "Build clinics and operational foundations that expand access and strengthen continuity of care.",
            ),
            (
                "REAL ESTATE",
                "Develop major asset classes with disciplined execution and operations-ready delivery.",
            ),
            (
                "TRAINING & SKILLS TRANSFER",
                "Build sustainable local capability through structured training and measurable skills transfer.",
            ),
            (
                "CAPITAL ACCESS",
                "Align funding relationships and delivery readiness to move projects from plan to execution.",
            ),
        ]
        icon_dir = _icons_base_dir()
        for i, (t, d) in enumerate(snapshots):
            card = SolutionSnapshotCard(home=h, sort_order=i, title=t, description=d)
            if i < len(_SNAPSHOT_ICON_FILES):
                base_name, hover_name = _SNAPSHOT_ICON_FILES[i]
                ip = icon_dir / base_name
                hp = icon_dir / hover_name
                if ip.is_file():
                    with open(ip, "rb") as f:
                        card.image.save(base_name, File(f), save=False)
                if hp.is_file():
                    with open(hp, "rb") as f:
                        card.hover_image.save(hover_name, File(f), save=False)
            card.save()

        a = AboutPage.load()
        a.hero_title = "About Us"
        a.hero_intro = (
            "Peak Global Partners is a full-service technology services company supporting "
            "complex initiatives— particularly public-private partnerships where delivery "
            "requires strong governance, operational leadership, and integration across sectors"
        )
        a.differentiators_section_title = "WHAT MAKES US DIFFERENT"
        a.who_heading = "WHO WE SERVE"
        a.who_body = (
            "We work with government entities, private operators, investors, and community "
            "stakeholders delivering programs in essential infrastructure and technology-enabled services."
        )
        a.outcome_heading = "WHAT WE MEASURE"
        a.outcome_subheading = "Outcome Orientation"
        a.outcome_body = (
            "We focus on outcomes such as improved service continuity, reliability, "
            "operational readiness, capability development, and sustainable performance "
            "over the asset lifecycle."
        )
        a.outcome_cta_label = "VIEW SOLUTIONS"
        a.outcome_cta_url = "/solutions/energy-infrastructure"
        a.approach_pill = "Our Approach"
        a.approach_heading = "HOW WE DELIVER"
        a.approach_bottom_cta_label = "TALK TO OUR TEAM"
        a.approach_bottom_cta_url = "/contact"
        a.save()
        cards = [
            (
                "End-To-End Execution",
                "Strategy through sustainment—Not “handoff delivery”",
            ),
            (
                "Operations-First Mindset",
                "We build systems that can be run, maintained, and measured",
            ),
            (
                "Accountable Delivery",
                "Governance structures, clear reporting, and performance management",
            ),
            (
                "Capacity Building Embedded",
                "Skills transfer that creates long-term independence",
            ),
            (
                "Technology As An Enabler",
                "Platforms, monitoring, and integration to improve decisions and outcomes",
            ),
        ]
        for i, (t, txt) in enumerate(cards):
            AboutDifferentiatorCard.objects.create(
                about=a, sort_order=i, title=t, text=txt
            )
        approach = [
            (
                "1",
                "Overview",
                "PGP brings structure to multi-stakeholder delivery—clarifying roles, aligning incentives, and implementing governance that supports transparent execution and long-term operations.",
                [],
            ),
            (
                "2",
                "Program Governance & PMO",
                "",
                [
                    "Delivery governance, schedules, milestones, and reporting",
                    "Vendor oversight and performance management",
                    "Risk controls and issue resolution frameworks",
                ],
            ),
            (
                "3",
                "Operational Readiness & Sustainment",
                "",
                [
                    "Operating model design (people, process, technology)",
                    "Lifecycle O&M planning",
                    "Workforce enablement and transition planning",
                ],
            ),
            (
                "4",
                "Technology Enablement",
                "",
                [
                    "Digital platforms & dashboards for visibility & accountability",
                    "Systems integration for real-world operations across sectors",
                ],
            ),
            (
                "5",
                "Partnership & Capital Alignment",
                "",
                [
                    "Support for partnership structuring and delivery readiness",
                    "Reporting & accountability frameworks aligned to funders & stakeholders",
                ],
            ),
        ]
        for i, (num, title, desc, bullets) in enumerate(approach):
            AboutApproachStep.objects.create(
                about=a,
                sort_order=i,
                number=num,
                title=title,
                description=desc,
                bullets=bullets,
            )

        c = ContactPage.load()
        c.headline_gold = "Let's Build"
        c.headline_dark = "What lasts."
        c.intro = (
            "Whether you're structuring a partnership, delivering an infrastructure program, "
            "or modernizing operations with technology, PGP can help bring clarity, "
            "governance, and execution to your initiative."
        )
        c.submit_label = "Request a Consultation"
        c.save()
        for i, (lab, val) in enumerate(
            [
                ("Infrastructure", "infrastructure"),
                ("Technology", "technology"),
                ("Energy", "energy"),
            ]
        ):
            ContactSectorOption.objects.create(
                contact=c, sort_order=i, label=lab, value=val
            )

        ip = ImpactPage.load()
        ip.hero_eyebrow = "Impact Philosophy"
        ip.headline = (
            "We prioritize outcomes that last — measured performance improvements, "
            "operational readiness, and local capability that sustains services over time."
        )
        ip.headline_highlight = "measured performance improvements"
        ip.metrics_section_title = "What We Measure"
        ip.case_studies_section_title = "Case Studies"
        ip.save()
        metrics = [
            ("99.9%", "Service reliability improvements", False),
            ("100%", "Operational readiness milestones achieved", False),
            ("80%", "Reduction in downtime / loss / inefficiency", False),
            ("50,000+", "Workforce trained / certified", False),
            (
                "100%",
                "Program performance reporting and governance cadence established",
                True,
            ),
        ]
        for i, (st, lb, w) in enumerate(metrics):
            ImpactMetric.objects.create(
                impact=ip, sort_order=i, stat=st, label=lb, wide=w
            )
        quads = [
            ("Challenge", "Enter details for challenge..."),
            ("PGP Approach", "Enter details for pgp approach..."),
            ("Outcomes", "Enter details for outcomes..."),
            ("Next Steps", "Enter details for next steps..."),
        ]
        for cs_i in range(2):
            cs = CaseStudy.objects.create(
                impact=ip,
                sort_order=cs_i,
                badge=f"CASE STUDY {cs_i + 1}",
                title="[Case Study Placeholder Title]",
            )
            for q_i, (ql, qb) in enumerate(quads):
                CaseStudyQuadrant.objects.create(
                    case_study=cs, sort_order=q_i, label=ql, body=qb
                )

        t = TechnologyPage.load()
        t.hero_label = "Our Solutions"
        t.title_black_1 = "Technology That"
        t.title_black_2 = "Enables "
        t.title_yellow = "Real-World Operations"
        t.overview_text = (
            "PGP delivers technology solutions that strengthen service delivery across "
            "infrastructure and public sector environments—built for deployment in "
            "challenging conditions & designed to scale."
        )
        t.domains_heading = "Core Technology Domains"
        t.enablement_heading = "Additional Technology Enablement"
        t.outcome_eyebrow = "— Outcome Focus —"
        t.outcome_headline = (
            "Resilient digital infrastructure, dependable operations, and decision-ready data."
        )
        t.outcome_cta_label = "Build Technology for Operational Performance"
        t.outcome_cta_url = "/contact"
        t.save()
        domains = [
            (
                "Software Integration",
                "Structured project management frameworks and supporting digital infrastructure to enable coordinated solutions.",
                False,
                "software",
            ),
            (
                "Data Analysis Tools",
                "Platforms and dashboards that convert operational data into actionable visibility and reporting.",
                False,
                "chart",
            ),
            (
                "Communication",
                "Integrated communication systems that support coordination across agencies and operational environments.",
                False,
                "comm",
            ),
            (
                "Data Centers",
                "Planning and execution support for reliable, scalable data center initiatives.",
                False,
                "dc",
            ),
            (
                "Command Centers",
                "Integrated command centers that unify real-time data, communications, and decision support tools to improve situational awareness, coordination, and operational response across multi-agency and critical infrastructure environments.",
                True,
                "cmd",
            ),
        ]
        for i, (title, desc, wide, ik) in enumerate(domains):
            TechnologyDomain.objects.create(
                tech_page=t,
                sort_order=i,
                title=title,
                description=desc,
                wide=wide,
                icon_key=ik,
            )
        enable = [
            "Infrastructure IT modernization and data lifecycle planning",
            "Platform and dashboard development for performance monitoring and accountability",
            "Systems integration into real-world operations (utilities, logistics, ports, agriculture, and more)",
        ]
        for i, lab in enumerate(enable):
            TechnologyEnablementItem.objects.create(
                tech_page=t, sort_order=i, label=lab, icon_key=f"e{i}"
            )

    def _seed_solutions(self, sol_js: dict):
        nav_by_slug = {row[0]: row for row in NAV}
        for slug, data in sol_js.items():
            nav = nav_by_slug.get(slug)
            col, order = (1, 0)
            ntitle, nsub = "", ""
            if nav:
                _, ntitle, nsub, col, order = nav
            s = Solution.objects.create(
                slug=slug,
                is_published=True,
                nav_title=ntitle,
                nav_subtitle=nsub,
                nav_column=col,
                nav_order=order,
                hero_label=data.get("heroLabel", ""),
                title_black_1=data.get("heroTitleBlack1", ""),
                title_black_2=data.get("heroTitleBlack2", ""),
                title_yellow=data.get("heroTitleYellow", ""),
                overview_text=data.get("overviewText", ""),
                outcome_headline=data.get("outcomeHeadline", ""),
                outcome_cta=data.get("outcomeCta", ""),
                outcome_cta_url="/contact",
            )
            for i, d in enumerate(data.get("deliverItems", [])):
                SolutionDeliverable.objects.create(
                    solution=s,
                    sort_order=i,
                    code=str(d.get("id", "")),
                    text=d.get("text", ""),
                )

    def _seed_training(self, train_js: dict):
        hub_meta = [
            ("skills-transfer", True, 0, "Train the Trainer + certification pathways"),
            ("police-forensics-training", False, 1, "Courtroom-ready evidence practices and quality controls"),
            ("cybersecurity-training", False, 2, "Role-based training pathways (executives, operators, IT/security teams)"),
            ("intelligence-training", False, 3, "Programmatic, governance-led capability building"),
            ("technology-training", False, 4, "Quantifiable approaches to understanding and manage large data sets"),
        ]
        hub_titles = {
            "skills-transfer": "Skills Transfer",
            "technology-training": "Data Analysis Training",
        }
        for slug, featured, ord_, sub in hub_meta:
            data = train_js.get(slug) or {}
            title = hub_titles.get(slug) or data.get("title", slug.replace("-", " ").title())
            display = "numbered" if slug == "police-forensics-training" else "emoji"
            t = TrainingArea.objects.create(
                slug=slug,
                is_published=True,
                featured=featured,
                hub_subtitle=sub,
                hub_order=ord_,
                category=data.get("category", ""),
                title=title,
                description_start=data.get("description", ""),
                highlighted_text=data.get("highlightedText", ""),
                description_end=data.get("descriptionEnd", ""),
                deliver_section_title="WHAT WE DELIVER",
                display_style=display,
                outcome_tag=data.get("outcomeTag", ""),
                outcome_title=data.get("outcomeTitle", ""),
            )
            for i, c in enumerate(data.get("cards", [])):
                TrainingCard.objects.create(
                    training=t,
                    sort_order=i,
                    icon_emoji=c.get("icon", ""),
                    title=c.get("title", ""),
                    subtitle=c.get("subtitle", ""),
                )

    def _seed_training_nav(self):
        items = [
            ("Skills Transfer", "Knowledge sharing programs", "/training/skills-transfer"),
            ("Technology Training", "Digital skills development", "/training/technology-training"),
            ("Police Forensics Training", "Crime investigation techniques", "/training/police-forensics-training"),
            ("Intelligence Training", "Strategic intelligence skills", "/training/intelligence-training"),
            ("Cybersecurity Training", "Cyber threat defense", "/training/cybersecurity-training"),
        ]
        for i, (title, sub, path) in enumerate(items):
            TrainingNavItem.objects.create(
                sort_order=i, title=title, subtitle=sub, path=path
            )
