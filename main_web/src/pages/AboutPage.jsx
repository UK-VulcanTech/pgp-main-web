import { Link } from "react-router-dom";
import { useAboutPage } from "../hooks/usePublicApi";

const ABOUT_FALLBACK = {
  page_eyebrow: "About PGP",
  page_title: "Strategy, operations, and execution for the programs that have to work.",
  page_lede:
    "Peak Global Partners is a full-service technology services company supporting complex initiatives — particularly public-private partnerships — where delivery requires strong governance, operational leadership, and integration across sectors.",
  page_image: "/images/topo-navy.webp",
  principles_section_eyebrow: "What makes us different",
  principles_section_title: "Five operating principles that shape every engagement.",
  principles: [
    { num: "01", title: "End-to-end execution", description: 'Strategy through sustainment — not "handoff delivery." We stay until the program runs.' },
    { num: "02", title: "Operations-first mindset", description: "We build systems that can be run, maintained, and measured — designed for the day after go-live." },
    { num: "03", title: "Technology as an enabler", description: "Platforms, monitoring, and integration that improve decisions and outcomes — not technology for its own sake." },
    { num: "04", title: "Capacity building embedded", description: "Skills transfer woven into the delivery model so local teams gain long-term independence." },
    { num: "05", title: "Accountable delivery", description: "Governance structures, clear reporting, and performance management that hold every party — including us — to the same standard." },
  ],
  whoweserve_image: "/images/infrastructure.webp",
  whoweserve_eyebrow: "Who we serve",
  whoweserve_title: "Public, private, and community partners — under one delivery model.",
  whoweserve_body:
    "We work with government entities, private operators, investors, and community stakeholders delivering programs in essential infrastructure and technology-enabled services.",
  who_bullets: [
    { text: "Government ministries and agencies — federal, regional, and municipal" },
    { text: "Private operators, utilities, and service providers" },
    { text: "Investors and blended-finance partners" },
    { text: "Local communities, institutions, and workforce development partners" },
  ],
  measure_section_eyebrow: "What we measure",
  measure_section_title: "Outcomes that last.",
  measure_section_lede: "",
  measure_cards: [
    { label: "Service performance", title: "Reliability & uptime", description: "Measured improvements in service continuity and reductions in downtime, losses, and inefficiency across the assets we touch." },
    { label: "Workforce capability", title: "Skills & certification", description: "People trained and certified through structured curricula, train-the-trainer pipelines, and competency measurement built into delivery." },
    { label: "Governance", title: "Reporting cadence established", description: "Investor-grade governance, audit-ready controls, and clear performance reporting cadence — operational from day one." },
  ],
  cta_heading: "See how we deliver these outcomes.",
  cta_body: "Our approach page walks through the operating model in detail — governance, readiness, technology, and capital alignment.",
  cta_primary_label: "View Approach",
  cta_primary_url: "/approach",
  cta_secondary_label: "View Solutions",
  cta_secondary_url: "/solutions",
};

export default function AboutPage() {
  const { data } = useAboutPage();
  const view = data || ABOUT_FALLBACK;

  return (
    <main id="main">
      <section className="page-header">
        <div className="page-header__bg">
          <img src={view.page_image} alt="" />
        </div>
        <div className="page-header__inner">
          <div className="page-header__eyebrow">{view.page_eyebrow}</div>
          <h1 className="page-header__title">{view.page_title}</h1>
          <p className="page-header__lede">{view.page_lede}</p>
        </div>
      </section>

      <section>
        <div className="container">
          <div style={{ marginBottom: "var(--space-12)", maxWidth: 760 }}>
            <div className="section-eyebrow">{view.principles_section_eyebrow}</div>
            <h2 className="section-title">{view.principles_section_title}</h2>
          </div>

          <div className="grid-3">
            {view.principles.map((p) => (
              <article key={p.num} className="pillar-card">
                <div className="num">{p.num}</div>
                <h3>{p.title}</h3>
                <p>{p.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="compact" style={{ background: "var(--color-surface-offset)" }}>
        <div className="container">
          <div className="feature-row">
            <div className="feature-row__image">
              <img src={view.whoweserve_image} alt="" />
            </div>
            <div className="feature-row__content">
              <div className="section-eyebrow">{view.whoweserve_eyebrow}</div>
              <h2>{view.whoweserve_title}</h2>
              <p>{view.whoweserve_body}</p>
              <ul role="list">
                {view.who_bullets.map((b, i) => (
                  <li key={i}>{b.text}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div style={{ marginBottom: "var(--space-10)", maxWidth: 780 }}>
            <div className="section-eyebrow">{view.measure_section_eyebrow}</div>
            <h2 className="section-title">{view.measure_section_title}</h2>
            {view.measure_section_lede && (
              <p className="section-lede">{view.measure_section_lede}</p>
            )}
          </div>

          <div className="audiences">
            {view.measure_cards.map((c) => (
              <div key={c.title} className="audience">
                <div className="label">{c.label}</div>
                <h3>{c.title}</h3>
                <p>{c.description}</p>
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
              <Link className="btn btn-primary" to={view.cta_primary_url || "/approach"}>
                {view.cta_primary_label} <span className="arrow" aria-hidden="true">→</span>
              </Link>
              <Link className="btn btn-secondary" to={view.cta_secondary_url || "/solutions"}>
                {view.cta_secondary_label}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
