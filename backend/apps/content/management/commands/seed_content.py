"""
Idempotent content seed for the new design.

Populates every singleton page + 9 solutions + 5 training areas + the
Digital Fast Track page with the same copy that ships in the React
frontend's hardcoded fallback. Re-running wipes the inline child rows for
each page and re-creates them, so it's safe to invoke after schema bumps.

Usage:
    python manage.py seed_content
"""
from django.core.management.base import BaseCommand
from django.db import transaction

from apps.content.models import (
    AboutMeasureCard,
    AboutPage,
    AboutPrinciple,
    AboutWhoBullet,
    ApproachBlock,
    ApproachBlockBullet,
    ApproachPage,
    ContactPage,
    ContactSector,
    CyberCard,
    CyberPhase,
    DftMetric,
    DftOutcomeBullet,
    DftPillar,
    DftPillarPoint,
    DftTimeline,
    DigitalFastTrackPage,
    HomeHeroMeta,
    HomePPPBullet,
    HomePage,
    HomePillar,
    HomeProcessStep,
    SiteSettings,
    Solution,
    SolutionAdjacency,
    SolutionDeliverable,
    SolutionsPage,
    TrainingAdjacency,
    TrainingArea,
    TrainingDeliverable,
    TrainingPage,
)


# ---------- Solutions data ----------------------------------------------------

SOLUTIONS = [
    {
        "slug": "energy-infrastructure",
        "title": "Energy Infrastructure",
        "snapshot": "Modernize and operate energy systems to improve reliability, resilience, and long-term performance.",
        "hero_image_url": "/images/energy-aerial.webp",
        "hero_title": "Energy infrastructure for reliable growth.",
        "hero_lede": "PGP supports the development, modernization, and operational performance of energy infrastructure — aligning stakeholders and delivering end-to-end execution that improves reliability and long-term maintainability.",
        "overview_title": "Beyond construction — into the operating reality.",
        "overview_lede": "Reliable power is a system: generation, transmission, distribution, monitoring, and the people who keep it running. We work across that whole stack, helping owners and operators close the gap between capital deployment and steady-state performance.",
        "outcome": "Improved reliability, reduced downtime, and stronger long-term operating performance.",
        "cta_label": "Discuss an Energy Program",
        "deliver": [
            "Program planning, feasibility support, and implementation governance",
            "Grid modernization and resilience initiatives",
            "Operational frameworks for utilities and operators",
            "Technology integration for visibility, monitoring, and reporting",
            "Workforce development to support sustained operations",
        ],
        "adjacent": ["renewables", "water-sanitation", "technology"],
    },
    {
        "slug": "renewables",
        "title": "Renewables",
        "snapshot": "Deliver scalable renewable programs with disciplined execution and operational readiness.",
        "hero_image_url": "/images/energy-aerial.webp",
        "hero_title": "Renewable programs built to scale.",
        "hero_lede": "PGP enables renewable energy programs — from early-stage planning through operational readiness — combining execution discipline with performance-driven operating models.",
        "overview_title": "Predictable deployment, durable performance.",
        "overview_lede": "Renewable buildouts succeed when interconnection, community engagement, operations, and capital all move in lockstep. We bring the program structure that makes that possible across portfolios — not just single sites.",
        "outcome": "Predictable deployment and durable operating performance.",
        "cta_label": "Explore Renewable Delivery Support",
        "deliver": [
            "Portfolio strategy and site/program readiness coordination",
            "Delivery oversight across multi-stakeholder execution",
            "Operational readiness planning and performance monitoring approaches",
            "Integration planning with broader infrastructure systems",
            "Community engagement models and local skills transfer",
        ],
        "adjacent": ["energy-infrastructure", "capital-access", "technology"],
    },
    {
        "slug": "water-sanitation",
        "title": "Water & Sanitation",
        "snapshot": "Strengthen water access and sanitation services through lifecycle-focused delivery and operations.",
        "hero_image_url": "/images/water-facility.webp",
        "hero_title": "Water and sanitation systems that improve access and reliability.",
        "hero_lede": "PGP improves water and sanitation infrastructure across industrial, municipal, and residential needs — focused on lifecycle operations and service continuity, not just construction.",
        "overview_title": "Built to operate — not just to commission.",
        "overview_lede": "The hardest part of a water program isn't the build; it's keeping non-revenue water down, treatment compliant, and operators trained year after year. That's where our delivery model lives.",
        "outcome": "Safer access, stronger reliability, and improved system performance over time.",
        "cta_label": "Improve Water Service Delivery",
        "deliver": [
            "Water infrastructure improvement programs (distribution, treatment, service reliability)",
            "Non-revenue water reduction support (metering and performance monitoring approaches)",
            "Operational readiness and workforce training for utilities and operators",
            "Technology enablement for monitoring and service management",
            "Sanitation program planning and implementation governance",
        ],
        "adjacent": ["waste-recycling", "energy-infrastructure", "healthcare"],
    },
    {
        "slug": "waste-recycling",
        "title": "Waste & Recycling",
        "snapshot": "Build modern waste systems that improve public health, efficiency, and environmental outcomes.",
        "hero_image_url": "/images/waste-recovery.webp",
        "hero_title": "Modern waste systems with sustainable operations.",
        "hero_lede": "PGP supports modern waste management and recycling programs that improve public health and environmental outcomes — while strengthening municipal efficiency and accountability.",
        "overview_title": "Cleaner communities, accountable services.",
        "overview_lede": "Effective waste programs combine route optimization, behavior change, transparent reporting, and the right facility design. We coordinate all of it — and hold service providers to performance standards that stick.",
        "outcome": "Cleaner communities, improved diversion rates, and accountable service delivery.",
        "cta_label": "Build a Waste & Recycling Program",
        "deliver": [
            "System design support across collection, transfer, sorting, recycling, and disposal",
            "Operational governance and performance management for service providers",
            "Community engagement and behavior-change program coordination",
            "Feasibility support for diversion and recycling initiatives",
            "Data-driven service optimization and reporting approaches",
        ],
        "adjacent": ["water-sanitation", "transportation", "real-estate"],
    },
    {
        "slug": "technology",
        "title": "Technology",
        "snapshot": "Deploy solutions, data centers, and command centers that improve visibility, coordination, and performance.",
        "hero_image_url": "/images/datacenter-hall.webp",
        "hero_title": "Technology that enables real-world operations.",
        "hero_lede": "PGP delivers technology solutions that strengthen service delivery across infrastructure and public-sector environments — built for deployment in challenging conditions and designed to scale.",
        "overview_title": "Resilient digital infrastructure. Decision-ready data.",
        "overview_lede": "Our core technology domains span data centers, integrated command centers, software integration, communications, and data analysis tools — combined into operating environments that hold up under real-world conditions and grow with the program.",
        "outcome": "Resilient digital infrastructure, dependable operations, and decision-ready data.",
        "cta_label": "Build Technology for Operational Performance",
        "deliver": [
            "Data Centers — planning and execution support for reliable, scalable initiatives",
            "Command Centers — integrated centers unifying real-time data, communications, and decision-support tools",
            "Software Integration — structured project frameworks and digital infrastructure for coordinated solutions",
            "Communications — integrated systems supporting coordination across agencies and operations",
            "Data Analysis Tools — platforms and dashboards that turn operational data into action",
            "Infrastructure IT modernization, data lifecycle planning, and systems integration into real-world ops",
        ],
        "adjacent": ["energy-infrastructure", "transportation", "real-estate"],
    },
    {
        "slug": "transportation",
        "title": "Transportation",
        "snapshot": "Deliver roads and port operations improvements that increase throughput and mobility.",
        "hero_image_url": "/images/port-dawn.webp",
        "hero_title": "Transportation infrastructure and operations that unlock growth.",
        "hero_lede": "PGP supports transportation programs that improve mobility and throughput — delivering governance, operational frameworks, and technology enablement for long-term performance.",
        "overview_title": "Mobility and throughput, designed to last.",
        "overview_lede": "Whether you're modernizing a port, scaling a road program, or coordinating logistics across multiple agencies, the discipline is the same: clear governance, integrated operations, and the technology that keeps performance visible.",
        "outcome": "Improved mobility, increased throughput, and stronger operational performance.",
        "cta_label": "Modernize Transportation Operations",
        "deliver": [
            "Road development: program governance, delivery coordination, and maintenance planning models",
            "Port operations: performance management, process modernization, and throughput visibility",
            "Logistics coordination support and stakeholder integration across agencies and operators",
        ],
        "adjacent": ["technology", "energy-infrastructure", "real-estate"],
    },
    {
        "slug": "healthcare",
        "title": "Healthcare",
        "snapshot": "Build clinics and operational foundations that expand access and strengthen continuity of care.",
        "hero_image_url": "/images/clinic-aerial.webp",
        "hero_title": "Healthcare infrastructure that expands access.",
        "hero_lede": "PGP advances healthcare access by delivering clinic infrastructure programs and the operational foundations needed to keep facilities functional, staffed, and supplied.",
        "overview_title": "Buildings are the easy part.",
        "overview_lede": "We focus on what determines whether a clinic actually delivers care: workflows, staffing models, supply chains, equipment, and the technology that ties them together — built for the day after ribbon-cutting.",
        "outcome": "Expanded access, stronger continuity of care, and improved service delivery capacity.",
        "cta_label": "Improve Health Access",
        "deliver": [
            "Clinic delivery support and program governance",
            "Operational readiness planning (workflows, staffing models, equipment planning support)",
            "Supply chain coordination approaches and facility performance monitoring",
            "Technology enablement for patient access and service management where appropriate",
        ],
        "adjacent": ["water-sanitation", "real-estate", "technology"],
    },
    {
        "slug": "real-estate",
        "title": "Real Estate",
        "snapshot": "Develop major asset classes with disciplined execution and operations-ready delivery.",
        "hero_image_url": "/images/real-estate-aerial.webp",
        "hero_title": "Real estate development across major asset classes.",
        "hero_lede": "PGP develops real estate across all major asset classes — combining disciplined execution, stakeholder coordination, and technology-enabled operations to support long-term value.",
        "overview_title": "Bankable developments, on time, built to operate.",
        "overview_lede": "From residential and commercial to hospitality, mixed-use, and community assets — we bring the program governance, operating-model design, and technology enablement that turn build-outs into performing portfolios.",
        "outcome": "Bankable developments, on-time execution, and assets designed for long-term performance.",
        "cta_label": "Discuss a Real Estate Development",
        "deliver": [
            "Development strategy and end-to-end execution oversight",
            "Program governance across residential, commercial, industrial, mixed-use, hospitality, and community assets",
            "Operating model development for asset management and facility operations",
            "Smart-building concepts and data-driven performance reporting enablement",
        ],
        "adjacent": ["technology", "transportation", "capital-access"],
    },
    {
        "slug": "capital-access",
        "title": "Capital Access",
        "snapshot": "Align funding relationships and delivery readiness to move projects from plan to execution.",
        "hero_image_url": "/images/infrastructure.webp",
        "hero_title": "Capital access that accelerates delivery.",
        "hero_lede": "PGP helps partners establish and expand funding relationships required to deliver infrastructure and technology programs — bridging strategy with finance so projects are structured for execution and sustainment.",
        "overview_title": "Funding that's aligned to delivery.",
        "overview_lede": "We work where capital strategy and delivery meet — packaging programs for investability, structuring partnerships for performance, and putting the governance in place that institutional and sovereign funders expect.",
        "outcome": "Stronger funding pathways, improved project readiness, and aligned stakeholder commitments.",
        "cta_label": "Align Capital to Execution",
        "deliver": [
            "Establishing and expanding relationships with funding partners",
            "Capital strategy and project packaging to support investability and delivery readiness",
            "Support for partnership commercial alignment and performance frameworks",
            "Governance, reporting, and accountability structures aligned to stakeholder expectations",
        ],
        "adjacent": ["energy-infrastructure", "real-estate", "renewables"],
    },
]


# ---------- Training data -----------------------------------------------------

TRAININGS = [
    {
        "slug": "skills-transfer",
        "title": "Skills Transfer",
        "snapshot": "Train-the-trainer programs, certification pathways, and competency measurement that builds repeatable local standards.",
        "hero_image_url": "/images/training-session.webp",
        "hero_title": "Skills transfer that's measurable and repeatable.",
        "hero_lede": "PGP delivers skills transfer that is measurable and repeatable — building local teams that can operate programs independently through structured curricula, assessments, and train-the-trainer models.",
        "overview_title": "Capability that runs after we leave.",
        "overview_lede": "We design curricula, assessments, and certification pathways that match the operating reality of your program — then transfer ownership through trained internal trainers, so the capability compounds rather than fades.",
        "outcome": "Qualified teams, repeatable standards, and measurable competency improvement.",
        "cta_label": "Discuss a Skills Transfer Program",
        "deliver": [
            "Workforce development strategy and train-the-trainer program design",
            "Curriculum development, certification pathways, and competency measurement",
            "Operational coaching to adopt international best practices",
            "Technology-supported training systems (learning platforms, assessments, simulation where appropriate)",
        ],
        "adjacent": ["intelligence-training", "technology-training", "digital-workforce-training"],
        "has_cyber_framework": False,
    },
    {
        "slug": "intelligence-training",
        "title": "Intelligence Training",
        "snapshot": "Programmatic capability building emphasizing governance, lawful process, and professional standards.",
        "hero_image_url": "/images/training-session.webp",
        "hero_title": "Intelligence training at the programmatic level.",
        "hero_lede": "PGP supports intelligence training at a programmatic and institutional level, emphasizing governance, lawful process, and professional standards to build accountable operating models and sustainable training pipelines.",
        "overview_title": "Professionalized capability with clear accountability.",
        "overview_lede": "Our work focuses on the operating layer — frameworks, oversight, and standards — that turns ad-hoc training into a sustainable institutional capability. Built around lawful process, audit-ready records, and measurable performance.",
        "outcome": "Professionalized capability development with clear governance and accountability.",
        "cta_label": "Discuss an Intelligence Training Program",
        "deliver": [
            "Program governance, curriculum frameworks, and assessment models",
            "Standards development (policy-aligned procedures and quality control)",
            "Risk management and oversight mechanisms",
            "Technology enablement for secure learning, recordkeeping, and performance tracking",
        ],
        "adjacent": ["skills-transfer", "cybersecurity-training", "digital-workforce-training"],
        "has_cyber_framework": False,
    },
    {
        "slug": "technology-training",
        "title": "Technology Training",
        "snapshot": "Deployment operations, software alignment, and workforce readiness — integrated into broader infrastructure needs.",
        "hero_image_url": "/images/datacenter-hall.webp",
        "hero_title": "Technology training that meets operations where they are.",
        "hero_lede": "PGP supports technology training initiatives focused on deployment operations, software alignment, and workforce readiness — integrated into broader infrastructure and operational needs such as data center management, SOPs, and monitoring.",
        "overview_title": "Compliant operations, sustainable training pipelines.",
        "overview_lede": "We build training around the actual systems people will run — integrated into SOPs, maintenance schedules, and the data workflows that govern day-to-day operations.",
        "outcome": "Compliant operations with sustainable training pipelines.",
        "cta_label": "Discuss a Technology Training Program",
        "deliver": [
            "Training program design and certification pathways",
            "Operational frameworks and planning standards",
            "Regulatory coordination support where applicable",
            "Integration planning for maintenance, scheduling, and data workflows",
        ],
        "adjacent": ["skills-transfer", "digital-workforce-training", "intelligence-training"],
        "has_cyber_framework": False,
    },
    {
        "slug": "cybersecurity-training",
        "title": "Cybersecurity Training",
        "snapshot": "Role-based pathways for executives, operators, and IT/security teams — aligning governance, operations, and technology.",
        "hero_image_url": "/images/datacenter-hall.webp",
        "hero_title": "Cybersecurity training across the whole operating stack.",
        "hero_lede": "PGP strengthens cybersecurity for governments, enterprises, and critical infrastructure by aligning governance, operations, and technology — so organizations can reduce risk, improve visibility, and respond faster to threats without disrupting essential services.",
        "overview_title": "Reduced risk. Faster response. Sustained locally.",
        "overview_lede": "Our programs cover executives, operators, and IT/security teams — combining strategy, SOC readiness, incident response preparedness, and identity/data protection into role-based pathways your organization can sustain.",
        "outcome": "Reduced cyber risk, improved situational awareness, faster detection and response, stronger operational continuity, and accountable security performance that can be sustained locally over time.",
        "cta_label": "Discuss a Cybersecurity Program",
        "deliver": [
            "Cybersecurity strategy & governance: security roadmaps, policy/SOP development, and cybersecurity-aligned operating models",
            "Security operations readiness: monitoring workflows, escalation paths, and SOC stand-up support (people/process/technology)",
            "Incident response preparedness: playbooks, communications protocols, tabletop exercises, and after-action improvement plans",
            "Risk reduction programs: vulnerability and patch governance, secure configuration baselines, and remediation tracking",
            "Identity & data protection: access governance, privileged access practices, data handling standards, and recovery planning",
        ],
        "adjacent": ["technology-training", "digital-workforce-training", "skills-transfer"],
        "has_cyber_framework": True,
        "cf_section_eyebrow": "Cybersecurity Framework",
        "cf_section_title": "A four-phase lifecycle — from preparation to response.",
        "cf_section_lede": "PGP cybersecurity programs are built around a continuous lifecycle that aligns governance, operations, and technology. Each phase strengthens the next, so resilience compounds rather than fades.",
        "cf_phases": [
            ("01", "Preparation"),
            ("02", "Prevention"),
            ("03", "Detection"),
            ("04", "Response"),
        ],
        "cf_cards": [
            ("Preparation", "Cybersecurity Academy", "Role-based training and certification pathways that build the workforce required to operate the program."),
            ("Prevention", "Public Key Infrastructure", "Identity, certificate, and trust services that protect data, communications, and digital workflows by design."),
            ("Detection", "Security Operations Center", "24/7 monitoring, threat detection, and triage with measurable SLAs and clear escalation paths."),
            ("Response", "CSIRT & Incident Response", "Playbooks, tabletop exercises, and a trained CSIRT that contains incidents and restores operations quickly."),
            ("Preparation", "Digital Community Centers", "Inclusive workforce pipelines that equip youth and women with practical digital and security skills."),
            ("Prevention", "Homologation Laboratory", "Independent testing and certification of devices, software, and systems before they enter the trust boundary."),
            ("Detection", "Continuous Monitoring", "Telemetry, vulnerability tracking, and posture assessment that surface risk before it becomes incident."),
            ("Response", "Forensics Laboratory", "Evidence handling, digital forensics, and after-action analysis that turn each incident into improved defense."),
        ],
        "cf_foundation_tag": "Foundation",
        "cf_foundation_title": "Legal & Regulatory Framework",
        "cf_foundation_desc": "Every layer is anchored in a clear legal and regulatory baseline — lawful process, accountable governance, and audit-ready records.",
    },
    {
        "slug": "digital-workforce-training",
        "title": "Digital Workforce Training",
        "snapshot": "Governance, tailored curricula, comprehensive support, and a communications strategy that drives digital adoption and reduces change resistance.",
        "hero_image_url": "/images/training-session.webp",
        "hero_title": "Digital workforce training that powers transformation.",
        "hero_lede": "PGP partners with governments and enterprises to deliver digital transformation through a structured approach to governance, training, and ongoing support — equipping teams with the skills to fully utilize new digital systems and sustain the benefits long after rollout.",
        "overview_title": "Governance, capability, support — the system that makes digital adoption stick.",
        "overview_lede": "Digital transformation succeeds when people, process, and technology move together. Our framework manages change end-to-end — a clear governance structure aligned to strategic objectives, tailored curricula matched to the workforce, robust user support during and after go-live, and a communications strategy that reduces resistance and drives adoption.",
        "outcome": "Workforce ready to operate new digital systems on day one — with the governance, support, and communications discipline that turns adoption into sustained performance.",
        "cta_label": "Discuss a Digital Workforce Program",
        "deliver": [
            "Robust governance structure — clear oversight aligned to your strategic objectives, with measurable success criteria from day one",
            "Tailored training programs — role-based curricula matched to the systems and workflows your teams will run",
            "Comprehensive user support — helpdesk, knowledge base, and floor-walking support during launch and steady-state",
            "Effective communication strategy — stakeholder communications plan that drives engagement and reduces change resistance",
            "Equipping youth and women with world-class digital and cybersecurity skills — inclusive workforce development pathways tied to real employment outcomes",
        ],
        "adjacent": ["skills-transfer", "technology-training", "cybersecurity-training"],
        "has_cyber_framework": False,
    },
]


class Command(BaseCommand):
    help = "Seed the CMS with content matching the new design."

    @transaction.atomic
    def handle(self, *args, **opts):
        self._seed_site()
        self._seed_home()
        self._seed_about()
        self._seed_approach()
        self._seed_contact()
        self._seed_solutions_page()
        self._seed_training_page()
        self._seed_dft()
        self._seed_solutions()
        self._seed_trainings()
        self.stdout.write(self.style.SUCCESS("Seed complete."))

    # ---- per-section helpers --------------------------------------------------

    def _seed_site(self):
        s = SiteSettings.load()
        s.meta_title = "Peak Global Partners"
        s.meta_description = (
            "Peak Global Partners (PGP) leads complex, multi-stakeholder programs — "
            "from feasibility to delivery — combining governance, operational leadership, "
            "and technology integration."
        )
        s.footer_tagline = (
            "Building systems that last. A full-service technology services partner for "
            "complex, multi-stakeholder initiatives — from strategy through sustainable operations."
        )
        s.footer_address = "724 W. Lancaster Ave, Suite 210\nWayne, PA 19087"
        s.footer_phone = "610-602-4200"
        s.footer_email = "info@peakglobalpartners.com"
        s.copyright_line = "Peak Global Partners, LLC · All rights reserved"
        s.save()

    def _seed_home(self):
        h = HomePage.load()
        h.hero_eyebrow = "Strategy · Operations · Execution"
        h.hero_title_lead = "Full-service technology services for"
        h.hero_title_em = "high-impact partnerships."
        h.hero_lede = (
            "Peak Global Partners (PGP) leads complex, multi-stakeholder programs — "
            "from feasibility to delivery — combining governance, operational leadership, "
            "and technology integration to produce measurable, sustainable outcomes."
        )
        h.hero_image_url = "/images/hero-control-room.webp"
        h.ppp_image_url = "/images/satellite-earth.webp"
        h.hero_cta_primary_label = "Explore Solutions"
        h.hero_cta_primary_url = "/solutions"
        h.hero_cta_secondary_label = "Talk to Our Team"
        h.hero_cta_secondary_url = "/contact"
        h.pillars_section_eyebrow = "What PGP Delivers"
        h.pillars_section_title = "Three intersecting capabilities. One delivery model built for the long term."
        h.pillars_section_lede = (
            "PGP operates at the intersection of infrastructure, technology, capacity "
            "building, and capital access — helping public and private partners deliver "
            "resilient systems where execution actually matters."
        )
        h.ppp_eyebrow = "Built for Public-Private Partnerships"
        h.ppp_title = "Tight coordination is a feature, not an obstacle."
        h.ppp_body = (
            "PGP specializes in initiatives that require coordination between government "
            "agencies, private operators, investors, and local communities. We provide the "
            "program structure, operational oversight, and execution discipline to move "
            "projects from concept to sustainable delivery."
        )
        h.snapshot_section_eyebrow = "Solutions Snapshot"
        h.snapshot_section_title = "Ten sector capabilities, integrated by a single delivery model."
        h.howwework_section_eyebrow = "How We Work"
        h.howwework_section_title = "A four-phase delivery model — from alignment to long-term sustainment."
        h.cta_heading = "Ready to deliver?"
        h.cta_body = "Let's discuss your partnership goals and the operating model needed to achieve them."
        h.cta_primary_label = "Contact PGP"
        h.cta_primary_url = "/contact"
        h.cta_secondary_label = "How we deliver"
        h.cta_secondary_url = "/approach"
        h.save()

        h.hero_meta.all().delete()
        for i, (label, value, desc) in enumerate([
            ("Mission Scope", "Critical Infrastructure", "Energy, water, transport, healthcare, real estate"),
            ("Operating Model", "Public-Private Partnerships", "Concept through sustainable operations"),
            ("Outcome Lens", "Measurable · Bankable", "Locally maintainable for the long term"),
        ]):
            HomeHeroMeta.objects.create(page=h, sort_order=i, label=label, value=value, desc=desc)

        h.pillars.all().delete()
        for i, (num, title, desc, ll, lu) in enumerate([
            ("01", "Infrastructure & Essential Services",
             "Modernize and operate the systems that communities and economies rely on — energy, water, transportation, healthcare, and the digital backbone underneath.",
             "View sectors", "/solutions"),
            ("02", "Technology Enablement",
             "Deploy platforms, command capabilities, and integrated data systems that improve visibility, coordination, and performance across multi-agency and operator environments.",
             "Technology stack", "/solutions/technology"),
            ("03", "Capacity & Capital Alignment",
             "Build local capability through structured skills transfer, and align funding pathways — public, private, and blended — to keep programs running long after initial delivery.",
             "Training programs", "/training"),
        ]):
            HomePillar.objects.create(
                page=h, sort_order=i, num=num, title=title,
                description=desc, link_label=ll, link_url=lu,
            )

        h.ppp_bullets.all().delete()
        for i, t in enumerate([
            "End-to-end program governance and delivery oversight",
            "Bankable program structures and investor-grade reporting",
            "Local capacity building embedded into the operating model",
            "Lifecycle planning for operations and maintenance from day one",
        ]):
            HomePPPBullet.objects.create(page=h, sort_order=i, text=t)

        h.process_steps.all().delete()
        for i, (num, title, desc) in enumerate([
            ("01 / Define", "Define", "Align stakeholders, scope, and success measures. Clarify roles, incentives, and what good looks like."),
            ("02 / Design", "Design", "Build the roadmap, operating model, and delivery plan. Set the governance and reporting cadence."),
            ("03 / Deliver", "Deliver", "Execute with PMO governance, vendor oversight, performance management, and technology enablement."),
            ("04 / Sustain", "Sustain", "Transfer skills, establish lifecycle O&M, and hand off operations to local teams that can run them."),
        ]):
            HomeProcessStep.objects.create(page=h, sort_order=i, num=num, title=title, description=desc)

    def _seed_about(self):
        a = AboutPage.load()
        a.page_eyebrow = "About PGP"
        a.page_title = "Strategy, operations, and execution for the programs that have to work."
        a.page_lede = (
            "Peak Global Partners is a full-service technology services company supporting "
            "complex initiatives — particularly public-private partnerships — where delivery "
            "requires strong governance, operational leadership, and integration across sectors."
        )
        a.page_image_url = "/images/topo-navy.webp"
        a.whoweserve_image_url = "/images/infrastructure.webp"
        a.principles_section_eyebrow = "What makes us different"
        a.principles_section_title = "Five operating principles that shape every engagement."
        a.whoweserve_eyebrow = "Who we serve"
        a.whoweserve_title = "Public, private, and community partners — under one delivery model."
        a.whoweserve_body = (
            "We work with government entities, private operators, investors, and community "
            "stakeholders delivering programs in essential infrastructure and technology-enabled services."
        )
        a.measure_section_eyebrow = "What we measure"
        a.measure_section_title = "Outcomes that last after the consultants leave."
        a.measure_section_lede = (
            "We focus on outcomes such as improved service continuity, reliability, "
            "operational readiness, capability development, and sustainable performance "
            "over the asset lifecycle."
        )
        a.cta_heading = "See how we deliver these outcomes."
        a.cta_body = (
            "Our approach page walks through the operating model in detail — governance, "
            "readiness, technology, and capital alignment."
        )
        a.cta_primary_label = "View Approach"
        a.cta_primary_url = "/approach"
        a.cta_secondary_label = "View Solutions"
        a.cta_secondary_url = "/solutions"
        a.save()

        a.principles.all().delete()
        for i, (num, title, desc) in enumerate([
            ("01", "End-to-end execution", 'Strategy through sustainment — not "handoff delivery." We stay until the program runs.'),
            ("02", "Operations-first mindset", "We build systems that can be run, maintained, and measured — designed for the day after go-live."),
            ("03", "Technology as an enabler", "Platforms, monitoring, and integration that improve decisions and outcomes — not technology for its own sake."),
            ("04", "Capacity building embedded", "Skills transfer woven into the delivery model so local teams gain long-term independence."),
            ("05", "Accountable delivery", "Governance structures, clear reporting, and performance management that hold every party — including us — to the same standard."),
        ]):
            AboutPrinciple.objects.create(page=a, sort_order=i, num=num, title=title, description=desc)

        a.who_bullets.all().delete()
        for i, t in enumerate([
            "Government ministries and agencies — federal, regional, and municipal",
            "Private operators, utilities, and service providers",
            "Investors and blended-finance partners",
            "Local communities, institutions, and workforce development partners",
        ]):
            AboutWhoBullet.objects.create(page=a, sort_order=i, text=t)

        a.measure_cards.all().delete()
        for i, (label, title, desc) in enumerate([
            ("Service performance", "Reliability & uptime",
             "Measured improvements in service continuity and reductions in downtime, losses, and inefficiency across the assets we touch."),
            ("Workforce capability", "Skills & certification",
             "People trained and certified through structured curricula, train-the-trainer pipelines, and competency measurement built into delivery."),
            ("Governance", "Reporting cadence established",
             "Investor-grade governance, audit-ready controls, and clear performance reporting cadence — operational from day one."),
        ]):
            AboutMeasureCard.objects.create(page=a, sort_order=i, label=label, title=title, description=desc)

    def _seed_approach(self):
        ap = ApproachPage.load()
        ap.page_eyebrow = "Approach · How we deliver"
        ap.page_title = "Structure for multi-stakeholder delivery — without slowing the work down."
        ap.page_lede = (
            "PGP brings structure to multi-stakeholder delivery — clarifying roles, aligning "
            "incentives, and implementing governance that supports transparent execution and "
            "long-term operations."
        )
        ap.page_image_url = "/images/topo-navy.webp"
        ap.cta_heading = "Want to see this applied to your program?"
        ap.cta_body = "Tell us where you are — we'll map our delivery model to the operating reality of your initiative."
        ap.cta_primary_label = "Talk to Our Team"
        ap.cta_primary_url = "/contact"
        ap.cta_secondary_label = "View Solutions"
        ap.cta_secondary_url = "/solutions"
        ap.save()

        ap.blocks.all().delete()
        blocks_data = [
            ("01", "Strategy & Program Design", [
                "Feasibility analysis and stakeholder alignment workshops",
                "Implementation roadmaps with phased milestones and decision gates",
                "Operating model design covering people, process, and technology",
                "Performance frameworks and success measures defined up front",
            ]),
            ("02", "Program Governance & PMO", [
                "Delivery governance, schedules, milestones, and reporting cadence",
                "Vendor oversight and performance management against contract",
                "Risk controls and issue resolution frameworks",
                "Investor-grade documentation and audit-ready records",
            ]),
            ("03", "Operational Readiness & Sustainment", [
                "Lifecycle O&M planning before go-live, not after",
                "Workforce enablement and transition planning embedded in delivery",
                "Standard operating procedures, runbooks, and training pathways",
                "Maintenance scheduling and supply-chain readiness for continuity",
            ]),
            ("04", "Technology Enablement", [
                "Digital platforms and dashboards for visibility and accountability",
                "Systems integration into real-world operations across sectors",
                "Data lifecycle planning and infrastructure modernization",
                "Cybersecurity-aligned operating models and recovery planning",
            ]),
            ("05", "Partnership & Capital Alignment", [
                "Support for partnership structuring and delivery readiness",
                "Reporting and accountability frameworks aligned to funders and stakeholders",
                "Capital strategy and project packaging for investability",
                "Performance frameworks linked to commercial milestones",
            ]),
        ]
        for i, (num, title, bullets) in enumerate(blocks_data):
            block = ApproachBlock.objects.create(page=ap, sort_order=i, num=num, title=title)
            for j, t in enumerate(bullets):
                ApproachBlockBullet.objects.create(block=block, sort_order=j, text=t)

    def _seed_contact(self):
        c = ContactPage.load()
        c.page_eyebrow = "Contact PGP"
        c.page_title = "Let's build what lasts."
        c.page_lede = (
            "Whether you're structuring a partnership, delivering an infrastructure program, "
            "or modernizing operations with technology, PGP can help bring clarity, "
            "governance, and execution to your initiative."
        )
        c.page_image_url = "/images/topo-navy.webp"
        c.hq_label = "Headquarters"
        c.hq_address = "724 W. Lancaster Ave, Suite 210\nWayne, PA 19087"
        c.phone_label = "Phone"
        c.phone_number = "610-602-4200"
        c.email_label = "Email"
        c.email_address = "info@peakglobalpartners.com"
        c.next_steps_label = "Next steps"
        c.next_steps_text = (
            "We review your inquiry within two business days. If aligned, we schedule a "
            "30-minute scoping call, then come back with how PGP would approach the work."
        )
        c.save()

        c.sectors.all().delete()
        for i, label in enumerate([
            "Energy Infrastructure",
            "Renewables",
            "Water & Sanitation",
            "Waste Management & Recycling",
            "Technology (Data Centers, Command Centers, Software)",
            "Transportation (Roads, Ports)",
            "Healthcare",
            "Real Estate",
            "Capital Access",
            "Training & Skills Transfer",
            "Multiple sectors / Cross-sector",
        ]):
            ContactSector.objects.create(page=c, sort_order=i, label=label)

    def _seed_solutions_page(self):
        sp = SolutionsPage.load()
        sp.page_eyebrow = "Solutions"
        sp.page_title = "Integrated programs across critical infrastructure, public services, and technology."
        sp.page_lede = (
            "PGP delivers integrated programs across the sectors that economies and "
            "communities rely on. Our sector teams pair execution discipline with "
            "operational leadership to create results that are measurable and locally sustainable."
        )
        sp.page_image_url = "/images/topo-navy.webp"
        sp.section_eyebrow = "Sectors & capabilities"
        sp.section_title = "Ten domains, one delivery model."
        sp.cta_heading = "Want to discuss a program in your sector?"
        sp.cta_body = "Our sector teams pair execution discipline with operational leadership — tell us what you're delivering."
        sp.cta_primary_label = "Talk to Our Team"
        sp.cta_primary_url = "/contact"
        sp.cta_secondary_label = "How we deliver"
        sp.cta_secondary_url = "/approach"
        sp.save()

    def _seed_training_page(self):
        tp = TrainingPage.load()
        tp.page_eyebrow = "Training & Skills Transfer"
        tp.page_title = "Training programs that build sustainable capability."
        tp.page_lede = (
            "PGP designs and delivers structured training and skills-transfer programs that "
            "strengthen institutional performance and build long-term local capacity — embedded "
            "into delivery models to ensure continuity after implementation."
        )
        tp.page_image_url = "/images/training-session.webp"
        tp.section_eyebrow = "Training Areas"
        tp.section_title = "Five practice areas, one operating philosophy: capability that lasts."
        tp.cta_heading = "Need a training program built for your team?"
        tp.cta_body = (
            "Our programs are designed to embed in your delivery model — qualified teams, "
            "repeatable standards, measurable improvement."
        )
        tp.cta_primary_label = "Explore Training Programs"
        tp.cta_primary_url = "/contact"
        tp.cta_secondary_label = "Our delivery model"
        tp.cta_secondary_url = "/approach"
        tp.save()

    def _seed_dft(self):
        d = DigitalFastTrackPage.load()
        d.page_eyebrow = "Programs · Digital Fast Track"
        d.page_title = "365 days to lay the foundation of national digital infrastructure."
        d.page_lede = (
            "Digital Fast Track (DFT) is PGP's accelerated, end-to-end transformation program "
            "for governments and large institutions. Anchored by a sovereign data center, DFT "
            "delivers the infrastructure, cybersecurity, e-services, and workforce capability "
            "needed to modernize service delivery — within a one-year timeline."
        )
        d.page_image_url = "/images/digital-fast-track-hero.webp"
        d.outcomes_image_url = "/images/satellite-earth.webp"
        d.page_cta_primary_label = "Discuss a Fast Track Program"
        d.page_cta_primary_url = "/contact"
        d.page_cta_secondary_label = "How we deliver"
        d.page_cta_secondary_url = "/approach"
        d.why_section_eyebrow = "Why a fast track"
        d.why_section_title = "A digital economy projected in trillions — and a window that's narrowing."
        d.why_section_lede = (
            "National digital transformation is no longer a multi-year aspiration. Citizens, "
            "investors, and economies expect modern services now. Digital Fast Track is built "
            "for that reality: a single coordinated program that delivers the platform, the "
            "protections, and the people in parallel — instead of waiting on sequential "
            "procurements that lose momentum between phases."
        )
        d.pillars_section_eyebrow = "DFT program components"
        d.pillars_section_title = "Four pillars. One delivery program."
        d.pillars_section_lede = (
            "Every Digital Fast Track engagement spans the same four delivery pillars — adapted "
            "to national priorities and sequenced to produce visible value within the first year."
        )
        d.timeline_section_eyebrow = "DFT program timeline"
        d.timeline_section_title = "365 days to a working digital foundation."
        d.timeline_section_lede = (
            "A single coordinated program plan — sequenced so that infrastructure, security, "
            "services, and workforce capability all reach operational maturity in the same year."
        )
        d.outcomes_eyebrow = "DFT outcomes"
        d.outcomes_title = "What success looks like at day 365."
        d.outcomes_body = (
            "A Digital Fast Track engagement is judged on whether the country has a working "
            "digital foundation operating sustainably — not on whether the program was busy."
        )
        d.cta_heading = "Ready to fast-track?"
        d.cta_body = (
            "Tell us where your country or institution is in its digital roadmap — we'll map "
            "the DFT model to your priorities and timeline."
        )
        d.cta_primary_label = "Request a Briefing"
        d.cta_primary_url = "/contact"
        d.cta_secondary_label = "Workforce training"
        d.cta_secondary_url = "/training/digital-workforce-training"
        d.save()

        d.metrics.all().delete()
        for i, (num, label) in enumerate([
            ("365", "Days to operating foundation"),
            ("4", "Pillars delivered in parallel"),
            ("1", "Sovereign infrastructure footprint"),
            ("100%", "Local capability transfer plan"),
            ("24/7", "Cybersecurity operations from go-live"),
        ]):
            DftMetric.objects.create(page=d, sort_order=i, num=num, label=label)

        d.pillars.all().delete()
        pillars_data = [
            ("01", "Modular data center",
             "A sovereign, modular data center installed as the cornerstone of national digital infrastructure — equipped with current technologies and a private cloud management suite that supports provisioning, fulfillment, and billing of infrastructure-as-a-service.",
             ["Modular, expandable footprint sized to national load",
              "Private cloud orchestration and IaaS service catalog",
              "Power, cooling, and physical-security design",
              "Operations runbooks and local operator training"]),
            ("02", "Cybersecurity operations",
             "A sustainable security framework anchored by a Security Operations Center (SOC) and a national CSIRT — inventorying, monitoring, and protecting the IT estate from day one, with the governance to keep it operating long after launch.",
             ["SOC stand-up: people, process, and technology stack",
              "National CSIRT charter, playbooks, and reporting cadence",
              "Asset inventory, vulnerability management, and PKI",
              "Risk governance aligned to international standards"]),
            ("03", "Digital services platform",
             "An electronic payment and digital services platform that puts modern e-government and citizen-facing services into operation quickly — including mobile money, bank cards, and electronic funds transfer rails — alongside scalable services like digital health and e-tax.",
             ["Electronic payment management platform",
              "Digital identity and citizen-service rails",
              "Sector-ready modules (health, tax, social benefits)",
              "Integration into existing ministry and operator systems"]),
            ("04", "Digital workforce training",
             "Theoretical and practical training that elevates digital and cybersecurity skills across the workforce — combined with a local pool of trained professionals to ensure knowledge transfer and operational continuity well past program close.",
             ["Role-based curricula tied to the new operating model",
              "In-country trainers and certification pathways",
              "Helpdesk, knowledge base, and on-floor support",
              "Inclusive pathways for youth and women in digital roles"]),
        ]
        for i, (num, title, blurb, points) in enumerate(pillars_data):
            pillar = DftPillar.objects.create(page=d, sort_order=i, num=num, title=title, blurb=blurb)
            for j, t in enumerate(points):
                DftPillarPoint.objects.create(pillar=pillar, sort_order=j, text=t)

        d.timeline.all().delete()
        for i, (num, title, desc) in enumerate([
            ("Days 1–60 / Mobilize", "Mobilize", "Stakeholder alignment, governance setup, baseline assessments, master program plan, and procurement of long-lead items."),
            ("Days 60–180 / Build", "Build", "Modular data center installation, SOC and CSIRT stand-up, cybersecurity controls deployed, and digital services platform configured."),
            ("Days 180–300 / Activate", "Activate", "First e-services live, payment rails switched on, workforce training in delivery, helpdesk and knowledge base operational."),
            ("Days 300–365 / Sustain", "Sustain", "Full handover to local operators, certification of trained workforce, performance reporting cadence in place, and roadmap for year-two scale."),
        ]):
            DftTimeline.objects.create(page=d, sort_order=i, num=num, title=title, description=desc)

        d.outcome_bullets.all().delete()
        for i, t in enumerate([
            "Sovereign data center operational, with local team running day-to-day",
            "SOC and CSIRT detecting, triaging, and responding to incidents on national scope",
            "First wave of citizen e-services live, with measurable adoption",
            "Trained workforce certified across operations, security, and digital services",
            "Reporting cadence in place for funders, regulators, and stakeholders",
            "Year-two scale roadmap aligned to national digital strategy",
        ]):
            DftOutcomeBullet.objects.create(page=d, sort_order=i, text=t)

    # ---- Solutions / Trainings ------------------------------------------------

    def _seed_solutions(self):
        SolutionAdjacency.objects.all().delete()
        SolutionDeliverable.objects.all().delete()
        for i, data in enumerate(SOLUTIONS):
            sol, _ = Solution.objects.update_or_create(
                slug=data["slug"],
                defaults={
                    "title": data["title"],
                    "snapshot": data["snapshot"],
                    "hero_image_url": data["hero_image_url"],
                    "hero_title": data["hero_title"],
                    "hero_lede": data["hero_lede"],
                    "overview_title": data["overview_title"],
                    "overview_lede": data["overview_lede"],
                    "outcome": data["outcome"],
                    "cta_label": data["cta_label"],
                    "sort_order": i,
                    "is_published": True,
                },
            )
            for j, text in enumerate(data["deliver"]):
                SolutionDeliverable.objects.create(solution=sol, sort_order=j, text=text)

        for data in SOLUTIONS:
            from_sol = Solution.objects.get(slug=data["slug"])
            for j, slug in enumerate(data["adjacent"]):
                to_sol = Solution.objects.filter(slug=slug).first()
                if to_sol:
                    SolutionAdjacency.objects.create(
                        from_solution=from_sol, to_solution=to_sol, sort_order=j
                    )

    def _seed_trainings(self):
        TrainingAdjacency.objects.all().delete()
        TrainingDeliverable.objects.all().delete()
        CyberPhase.objects.all().delete()
        CyberCard.objects.all().delete()
        for i, data in enumerate(TRAININGS):
            t, _ = TrainingArea.objects.update_or_create(
                slug=data["slug"],
                defaults={
                    "title": data["title"],
                    "snapshot": data["snapshot"],
                    "hero_image_url": data["hero_image_url"],
                    "hero_title": data["hero_title"],
                    "hero_lede": data["hero_lede"],
                    "overview_title": data["overview_title"],
                    "overview_lede": data["overview_lede"],
                    "outcome": data["outcome"],
                    "cta_label": data["cta_label"],
                    "sort_order": i,
                    "is_published": True,
                    "has_cyber_framework": data.get("has_cyber_framework", False),
                    "cf_section_eyebrow": data.get("cf_section_eyebrow", ""),
                    "cf_section_title": data.get("cf_section_title", ""),
                    "cf_section_lede": data.get("cf_section_lede", ""),
                    "cf_foundation_tag": data.get("cf_foundation_tag", ""),
                    "cf_foundation_title": data.get("cf_foundation_title", ""),
                    "cf_foundation_desc": data.get("cf_foundation_desc", ""),
                },
            )
            for j, text in enumerate(data["deliver"]):
                TrainingDeliverable.objects.create(training=t, sort_order=j, text=text)
            if data.get("has_cyber_framework"):
                for j, (num, label) in enumerate(data.get("cf_phases", [])):
                    CyberPhase.objects.create(training=t, sort_order=j, num=num, label=label)
                for j, (tag, title, desc) in enumerate(data.get("cf_cards", [])):
                    CyberCard.objects.create(
                        training=t, sort_order=j, tag=tag, title=title, description=desc
                    )

        for data in TRAININGS:
            from_t = TrainingArea.objects.get(slug=data["slug"])
            for j, slug in enumerate(data["adjacent"]):
                to_t = TrainingArea.objects.filter(slug=slug).first()
                if to_t:
                    TrainingAdjacency.objects.create(
                        from_training=from_t, to_training=to_t, sort_order=j
                    )
