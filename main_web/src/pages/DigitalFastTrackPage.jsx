import { Link } from "react-router-dom";
import { useDigitalFastTrackPage } from "../hooks/usePublicApi";

const DFT_FALLBACK = {
  page_eyebrow: "Programs · Digital Fast Track",
  page_title: "365 days to lay the foundation of national digital infrastructure.",
  page_lede:
    "Digital Fast Track (DFT) is PGP's accelerated, end-to-end transformation program for governments and large institutions. Anchored by a sovereign data center, DFT delivers the infrastructure, cybersecurity, e-services, and workforce capability needed to modernize service delivery — within a one-year timeline.",
  page_image: "/images/digital-fast-track-hero.webp",
  page_cta_primary_label: "Discuss a Fast Track Program",
  page_cta_primary_url: "/contact",
  page_cta_secondary_label: "How we deliver",
  page_cta_secondary_url: "/approach",
  why_section_eyebrow: "Why a fast track",
  why_section_title: "A digital economy projected in trillions — and a window that's narrowing.",
  why_section_lede:
    "National digital transformation is no longer a multi-year aspiration. Citizens, investors, and economies expect modern services now. Digital Fast Track is built for that reality: a single coordinated program that delivers the platform, the protections, and the people in parallel — instead of waiting on sequential procurements that lose momentum between phases.",
  metrics: [
    { num: "365", label: "Days to operating foundation" },
    { num: "4", label: "Pillars delivered in parallel" },
    { num: "1", label: "Sovereign infrastructure footprint" },
    { num: "100%", label: "Local capability transfer plan" },
    { num: "24/7", label: "Cybersecurity operations from go-live" },
  ],
  pillars_section_eyebrow: "DFT program components",
  pillars_section_title: "Four pillars. One delivery program.",
  pillars_section_lede:
    "Every Digital Fast Track engagement spans the same four delivery pillars — adapted to national priorities and sequenced to produce visible value within the first year.",
  pillars: [
    {
      num: "01",
      title: "Modular data center",
      blurb: "A sovereign, modular data center installed as the cornerstone of national digital infrastructure — equipped with current technologies and a private cloud management suite that supports provisioning, fulfillment, and billing of infrastructure-as-a-service.",
      points: [
        { text: "Modular, expandable footprint sized to national load" },
        { text: "Private cloud orchestration and IaaS service catalog" },
        { text: "Power, cooling, and physical-security design" },
        { text: "Operations runbooks and local operator training" },
      ],
    },
    {
      num: "02",
      title: "Cybersecurity operations",
      blurb: "A sustainable security framework anchored by a Security Operations Center (SOC) and a national CSIRT — inventorying, monitoring, and protecting the IT estate from day one, with the governance to keep it operating long after launch.",
      points: [
        { text: "SOC stand-up: people, process, and technology stack" },
        { text: "National CSIRT charter, playbooks, and reporting cadence" },
        { text: "Asset inventory, vulnerability management, and PKI" },
        { text: "Risk governance aligned to international standards" },
      ],
    },
    {
      num: "03",
      title: "Digital services platform",
      blurb: "An electronic payment and digital services platform that puts modern e-government and citizen-facing services into operation quickly — including mobile money, bank cards, and electronic funds transfer rails — alongside scalable services like digital health and e-tax.",
      points: [
        { text: "Electronic payment management platform" },
        { text: "Digital identity and citizen-service rails" },
        { text: "Sector-ready modules (health, tax, social benefits)" },
        { text: "Integration into existing ministry and operator systems" },
      ],
    },
    {
      num: "04",
      title: "Digital workforce training",
      blurb: "Theoretical and practical training that elevates digital and cybersecurity skills across the workforce — combined with a local pool of trained professionals to ensure knowledge transfer and operational continuity well past program close.",
      points: [
        { text: "Role-based curricula tied to the new operating model" },
        { text: "In-country trainers and certification pathways" },
        { text: "Helpdesk, knowledge base, and on-floor support" },
        { text: "Inclusive pathways for youth and women in digital roles" },
      ],
    },
  ],
  timeline_section_eyebrow: "DFT program timeline",
  timeline_section_title: "365 days to a working digital foundation.",
  timeline_section_lede:
    "A single coordinated program plan — sequenced so that infrastructure, security, services, and workforce capability all reach operational maturity in the same year.",
  timeline: [
    { num: "Days 1–60 / Mobilize", title: "Mobilize", description: "Stakeholder alignment, governance setup, baseline assessments, master program plan, and procurement of long-lead items." },
    { num: "Days 60–180 / Build", title: "Build", description: "Modular data center installation, SOC and CSIRT stand-up, cybersecurity controls deployed, and digital services platform configured." },
    { num: "Days 180–300 / Activate", title: "Activate", description: "First e-services live, payment rails switched on, workforce training in delivery, helpdesk and knowledge base operational." },
    { num: "Days 300–365 / Sustain", title: "Sustain", description: "Full handover to local operators, certification of trained workforce, performance reporting cadence in place, and roadmap for year-two scale." },
  ],
  outcomes_image: "/images/satellite-earth.webp",
  outcomes_eyebrow: "DFT outcomes",
  outcomes_title: "What success looks like at day 365.",
  outcomes_body:
    "A Digital Fast Track engagement is judged on whether the country has a working digital foundation operating sustainably — not on whether the program was busy.",
  outcome_bullets: [
    { text: "Sovereign data center operational, with local team running day-to-day" },
    { text: "SOC and CSIRT detecting, triaging, and responding to incidents on national scope" },
    { text: "First wave of citizen e-services live, with measurable adoption" },
    { text: "Trained workforce certified across operations, security, and digital services" },
    { text: "Reporting cadence in place for funders, regulators, and stakeholders" },
    { text: "Year-two scale roadmap aligned to national digital strategy" },
  ],
  cta_heading: "Ready to fast-track?",
  cta_body:
    "Tell us where your country or institution is in its digital roadmap — we'll map the DFT model to your priorities and timeline.",
  cta_primary_label: "Request a Briefing",
  cta_primary_url: "/contact",
  cta_secondary_label: "Workforce training",
  cta_secondary_url: "/training/digital-workforce-training",
};

export default function DigitalFastTrackPage() {
  const { data } = useDigitalFastTrackPage();
  const view = data || DFT_FALLBACK;

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
          <div className="hero__actions" style={{ marginTop: "var(--space-7)" }}>
            <Link className="btn btn-primary" to={view.page_cta_primary_url || "/contact"}>
              {view.page_cta_primary_label} <span className="arrow" aria-hidden="true">→</span>
            </Link>
            <Link className="btn btn-primary btn-on-dark" to={view.page_cta_secondary_url || "/approach"}>
              {view.page_cta_secondary_label}
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div style={{ marginBottom: "var(--space-10)", maxWidth: 820 }}>
            <div className="section-eyebrow">{view.why_section_eyebrow}</div>
            <h2 className="section-title">{view.why_section_title}</h2>
            <p className="section-lede">{view.why_section_lede}</p>
          </div>

          <div className="metric-grid">
            {view.metrics.map((m) => (
              <div key={m.label} className="metric">
                <div className="metric__num">{m.num}</div>
                <div className="metric__label">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "var(--color-surface-offset)" }}>
        <div className="container">
          <div style={{ marginBottom: "var(--space-10)", maxWidth: 760 }}>
            <div className="section-eyebrow">{view.pillars_section_eyebrow}</div>
            <h2 className="section-title">{view.pillars_section_title}</h2>
            <p className="section-lede">{view.pillars_section_lede}</p>
          </div>

          <div className="grid-2">
            {view.pillars.map((p) => (
              <article key={p.num} className="pillar-card">
                <div className="num">{p.num}</div>
                <h3>{p.title}</h3>
                <p>{p.blurb}</p>
                <ul
                  role="list"
                  style={{
                    marginTop: "var(--space-4)",
                    color: "var(--color-text-muted)",
                    fontSize: "var(--text-sm)",
                  }}
                >
                  {p.points.map((pt, i) => (
                    <li key={i}>{pt.text}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div style={{ marginBottom: "var(--space-10)", maxWidth: 760 }}>
            <div className="section-eyebrow">{view.timeline_section_eyebrow}</div>
            <h2 className="section-title">{view.timeline_section_title}</h2>
            <p className="section-lede">{view.timeline_section_lede}</p>
          </div>

          <div className="process-steps">
            {view.timeline.map((t) => (
              <div key={t.num} className="process-step">
                <div className="process-step__num">{t.num}</div>
                <h3>{t.title}</h3>
                <p>{t.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "var(--color-surface-offset)" }}>
        <div className="container">
          <div className="feature-row">
            <div className="feature-row__image">
              <img src={view.outcomes_image} alt="" />
            </div>
            <div className="feature-row__content">
              <div className="section-eyebrow">{view.outcomes_eyebrow}</div>
              <h2>{view.outcomes_title}</h2>
              <p>{view.outcomes_body}</p>
              <ul role="list">
                {view.outcome_bullets.map((b, i) => (
                  <li key={i}>{b.text}</li>
                ))}
              </ul>
            </div>
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
              <Link className="btn btn-secondary" to={view.cta_secondary_url || "/training/digital-workforce-training"}>
                {view.cta_secondary_label}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
