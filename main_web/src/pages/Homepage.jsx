import { Link } from "react-router-dom";
import { SOLUTIONS } from "../data/Solutions";
import { useHomePage, useSolutionList } from "../hooks/usePublicApi";

const HOME_FALLBACK = {
  hero_eyebrow: "Strategy · Operations · Execution",
  hero_title_lead: "Full-service technology services for",
  hero_title_em: "high-impact partnerships.",
  hero_lede:
    "Peak Global Partners (PGP) leads complex, multi-stakeholder programs — from feasibility to delivery — combining governance, operational leadership, and technology integration to produce measurable, sustainable outcomes.",
  hero_image: "/images/hero-control-room.webp",
  hero_cta_primary_label: "Explore Solutions",
  hero_cta_primary_url: "/solutions",
  hero_cta_secondary_label: "Talk to Our Team",
  hero_cta_secondary_url: "/contact",
  hero_meta: [
    { label: "Mission Scope", value: "Critical Infrastructure", desc: "Energy, water, transport, healthcare, real estate" },
    { label: "Operating Model", value: "Public-Private Partnerships", desc: "Concept through sustainable operations" },
    { label: "Outcome Lens", value: "Measurable · Bankable", desc: "Locally maintainable for the long term" },
  ],
  pillars_section_eyebrow: "What PGP Delivers",
  pillars_section_title: "Three intersecting capabilities. One delivery model built for the long term.",
  pillars_section_lede:
    "PGP operates at the intersection of infrastructure, technology, capacity building, and capital access — helping public and private partners deliver resilient systems where execution actually matters.",
  pillars: [
    { num: "01", title: "Infrastructure & Essential Services", description: "Modernize and operate the systems that communities and economies rely on — energy, water, transportation, healthcare, and the digital backbone underneath.", link_label: "View sectors", link_url: "/solutions" },
    { num: "02", title: "Technology Enablement", description: "Deploy platforms, command capabilities, and integrated data systems that improve visibility, coordination, and performance across multi-agency and operator environments.", link_label: "Technology stack", link_url: "/solutions/technology" },
    { num: "03", title: "Capacity & Capital Alignment", description: "Build local capability through structured skills transfer, and align funding pathways — public, private, and blended — to keep programs running long after initial delivery.", link_label: "Training programs", link_url: "/training" },
  ],
  ppp_image: "/images/satellite-earth.webp",
  ppp_eyebrow: "Built for Public-Private Partnerships",
  ppp_title: "Tight coordination is a feature, not an obstacle.",
  ppp_body:
    "PGP specializes in initiatives that require coordination between government agencies, private operators, investors, and local communities. We provide the program structure, operational oversight, and execution discipline to move projects from concept to sustainable delivery.",
  ppp_bullets: [
    { text: "End-to-end program governance and delivery oversight" },
    { text: "Bankable program structures and investor-grade reporting" },
    { text: "Local capacity building embedded into the operating model" },
    { text: "Lifecycle planning for operations and maintenance from day one" },
  ],
  snapshot_section_eyebrow: "Solutions Snapshot",
  snapshot_section_title: "Ten sector capabilities, integrated by a single delivery model.",
  howwework_section_eyebrow: "How We Work",
  howwework_section_title: "A four-phase delivery model — from alignment to long-term sustainment.",
  process_steps: [
    { num: "01 / Define", title: "Define", description: "Align stakeholders, scope, and success measures. Clarify roles, incentives, and what good looks like." },
    { num: "02 / Design", title: "Design", description: "Build the roadmap, operating model, and delivery plan. Set the governance and reporting cadence." },
    { num: "03 / Deliver", title: "Deliver", description: "Execute with PMO governance, vendor oversight, performance management, and technology enablement." },
    { num: "04 / Sustain", title: "Sustain", description: "Transfer skills, establish lifecycle O&M, and hand off operations to local teams that can run them." },
  ],
  cta_heading: "Ready to deliver?",
  cta_body: "Let's discuss your partnership goals and the operating model needed to achieve them.",
  cta_primary_label: "Contact PGP",
  cta_primary_url: "/contact",
  cta_secondary_label: "How we deliver",
  cta_secondary_url: "/approach",
};

const SOLUTIONS_FALLBACK = SOLUTIONS.map((s) => ({
  slug: s.slug,
  title: s.title,
  snapshot: s.snapshot,
}));

export default function Homepage() {
  const { data: home } = useHomePage();
  const { data: solutionsList } = useSolutionList();
  const view = home || HOME_FALLBACK;
  const sectors = solutionsList || SOLUTIONS_FALLBACK;

  return (
    <main id="main">
      <section className="hero">
        <div className="hero__bg">
          <img src={view.hero_image} alt="" />
        </div>
        <div className="hero__inner">
          <div className="hero__eyebrow">{view.hero_eyebrow}</div>
          <h1 className="hero__title">
            {view.hero_title_lead} <em>{view.hero_title_em}</em>
          </h1>
          <p className="hero__lede">{view.hero_lede}</p>
          <div className="hero__actions">
            <Link className="btn btn-primary" to={view.hero_cta_primary_url || "/solutions"}>
              {view.hero_cta_primary_label} <span className="arrow" aria-hidden="true">→</span>
            </Link>
            <Link className="btn btn-secondary btn-on-dark" to={view.hero_cta_secondary_url || "/contact"}>
              {view.hero_cta_secondary_label}
            </Link>
          </div>
          <div className="hero__meta">
            {view.hero_meta.map((m) => (
              <div key={m.label} className="hero__meta-item">
                <div className="label">{m.label}</div>
                <div className="value">{m.value}</div>
                <div className="desc">{m.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="reveal in" style={{ marginBottom: "var(--space-12)", maxWidth: 780 }}>
            <div className="section-eyebrow">{view.pillars_section_eyebrow}</div>
            <h2 className="section-title">{view.pillars_section_title}</h2>
            <p className="section-lede">{view.pillars_section_lede}</p>
          </div>

          <div className="grid-3">
            {view.pillars.map((p) => (
              <article key={p.num} className="pillar-card">
                <div className="num">{p.num}</div>
                <h3>{p.title}</h3>
                <p>{p.description}</p>
                {p.link_label && (
                  <Link className="pillar-link" to={p.link_url || "#"}>
                    {p.link_label} <span className="arrow" aria-hidden="true">→</span>
                  </Link>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="feature-row">
            <div className="feature-row__image">
              <img src={view.ppp_image} alt="" />
            </div>
            <div className="feature-row__content">
              <div className="section-eyebrow">{view.ppp_eyebrow}</div>
              <h2>{view.ppp_title}</h2>
              <p>{view.ppp_body}</p>
              <ul role="list">
                {view.ppp_bullets.map((b, i) => (
                  <li key={i}>{b.text}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="compact" style={{ background: "var(--color-surface-offset)" }}>
        <div className="container">
          <div style={{ marginBottom: "var(--space-10)", maxWidth: 760 }}>
            <div className="section-eyebrow">{view.snapshot_section_eyebrow}</div>
            <h2 className="section-title" style={{ fontSize: "var(--text-2xl)" }}>
              {view.snapshot_section_title}
            </h2>
          </div>

          <div className="sector-grid">
            {sectors.map((s, i) => (
              <Link key={s.slug} to={`/solutions/${s.slug}`} className="sector-card">
                <div className="sector-num">{`${String(i + 1).padStart(2, "0")} / Sector`}</div>
                <h3>{s.title}</h3>
                <p>{s.snapshot}</p>
                <span className="sector-link">
                  Learn more <span className="arrow" aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
            <Link to="/training" className="sector-card">
              <div className="sector-num">{`${String(sectors.length + 1).padStart(2, "0")} / Capability`}</div>
              <h3>Training & Skills Transfer</h3>
              <p>Build sustainable local capability through structured training and measurable skills transfer.</p>
              <span className="sector-link">
                Learn more <span className="arrow" aria-hidden="true">→</span>
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div style={{ marginBottom: "var(--space-10)", maxWidth: 760 }}>
            <div className="section-eyebrow">{view.howwework_section_eyebrow}</div>
            <h2 className="section-title">{view.howwework_section_title}</h2>
          </div>

          <div className="process-steps">
            {view.process_steps.map((s) => (
              <div key={s.num} className="process-step">
                <div className="process-step__num">{s.num}</div>
                <h3>{s.title}</h3>
                <p>{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="container">
          <div className="cta-band__inner">
            <div>
              <h2>{view.cta_heading}</h2>
              <p>{view.cta_body}</p>
            </div>
            <div className="cta-band__actions">
              <Link className="btn btn-primary" to={view.cta_primary_url || "/contact"}>
                {view.cta_primary_label} <span className="arrow" aria-hidden="true">→</span>
              </Link>
              <Link className="btn btn-secondary" to={view.cta_secondary_url || "/approach"}>
                {view.cta_secondary_label}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
