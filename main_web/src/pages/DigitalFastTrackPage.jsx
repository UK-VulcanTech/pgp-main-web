import { Link } from "react-router-dom";

const METRICS = [
  ["365", "Days to operating foundation"],
  ["4", "Pillars delivered in parallel"],
  ["1", "Sovereign infrastructure footprint"],
  ["100%", "Local capability transfer plan"],
  ["24/7", "Cybersecurity operations from go-live"],
];

const PILLARS = [
  {
    num: "01",
    title: "Modular data center",
    blurb:
      "A sovereign, modular data center installed as the cornerstone of national digital infrastructure — equipped with current technologies and a private cloud management suite that supports provisioning, fulfillment, and billing of infrastructure-as-a-service.",
    points: [
      "Modular, expandable footprint sized to national load",
      "Private cloud orchestration and IaaS service catalog",
      "Power, cooling, and physical-security design",
      "Operations runbooks and local operator training",
    ],
  },
  {
    num: "02",
    title: "Cybersecurity operations",
    blurb:
      "A sustainable security framework anchored by a Security Operations Center (SOC) and a national CSIRT — inventorying, monitoring, and protecting the IT estate from day one, with the governance to keep it operating long after launch.",
    points: [
      "SOC stand-up: people, process, and technology stack",
      "National CSIRT charter, playbooks, and reporting cadence",
      "Asset inventory, vulnerability management, and PKI",
      "Risk governance aligned to international standards",
    ],
  },
  {
    num: "03",
    title: "Digital services platform",
    blurb:
      "An electronic payment and digital services platform that puts modern e-government and citizen-facing services into operation quickly — including mobile money, bank cards, and electronic funds transfer rails — alongside scalable services like digital health and e-tax.",
    points: [
      "Electronic payment management platform",
      "Digital identity and citizen-service rails",
      "Sector-ready modules (health, tax, social benefits)",
      "Integration into existing ministry and operator systems",
    ],
  },
  {
    num: "04",
    title: "Digital workforce training",
    blurb:
      "Theoretical and practical training that elevates digital and cybersecurity skills across the workforce — combined with a local pool of trained professionals to ensure knowledge transfer and operational continuity well past program close.",
    points: [
      "Role-based curricula tied to the new operating model",
      "In-country trainers and certification pathways",
      "Helpdesk, knowledge base, and on-floor support",
      "Inclusive pathways for youth and women in digital roles",
    ],
  },
];

const TIMELINE = [
  ["Days 1–60 / Mobilize", "Mobilize", "Stakeholder alignment, governance setup, baseline assessments, master program plan, and procurement of long-lead items."],
  ["Days 60–180 / Build", "Build", "Modular data center installation, SOC and CSIRT stand-up, cybersecurity controls deployed, and digital services platform configured."],
  ["Days 180–300 / Activate", "Activate", "First e-services live, payment rails switched on, workforce training in delivery, helpdesk and knowledge base operational."],
  ["Days 300–365 / Sustain", "Sustain", "Full handover to local operators, certification of trained workforce, performance reporting cadence in place, and roadmap for year-two scale."],
];

export default function DigitalFastTrackPage() {
  return (
    <main id="main">
      <section className="page-header">
        <div className="page-header__bg">
          <img src="/images/digital-fast-track-hero.png" alt="" />
        </div>
        <div className="page-header__inner">
          <div className="page-header__eyebrow">Programs · Digital Fast Track</div>
          <h1 className="page-header__title">
            365 days to lay the foundation of national digital infrastructure.
          </h1>
          <p className="page-header__lede">
            Digital Fast Track (DFT) is PGP's accelerated, end-to-end
            transformation program for governments and large institutions.
            Anchored by a sovereign data center, DFT delivers the
            infrastructure, cybersecurity, e-services, and workforce capability
            needed to modernize service delivery — within a one-year timeline.
          </p>
          <div className="hero__actions" style={{ marginTop: "var(--space-7)" }}>
            <Link className="btn btn-primary" to="/contact">
              Discuss a Fast Track Program{" "}
              <span className="arrow" aria-hidden="true">→</span>
            </Link>
            <Link className="btn btn-secondary btn-on-dark" to="/approach">
              How we deliver
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div style={{ marginBottom: "var(--space-10)", maxWidth: 820 }}>
            <div className="section-eyebrow">Why a fast track</div>
            <h2 className="section-title">
              A digital economy projected in trillions — and a window that's
              narrowing.
            </h2>
            <p className="section-lede">
              National digital transformation is no longer a multi-year
              aspiration. Citizens, investors, and economies expect modern
              services now. Digital Fast Track is built for that reality: a
              single coordinated program that delivers the platform, the
              protections, and the people in parallel — instead of waiting on
              sequential procurements that lose momentum between phases.
            </p>
          </div>

          <div className="metric-grid">
            {METRICS.map(([num, label]) => (
              <div key={label} className="metric">
                <div className="metric__num">{num}</div>
                <div className="metric__label">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "var(--color-surface-offset)" }}>
        <div className="container">
          <div style={{ marginBottom: "var(--space-10)", maxWidth: 760 }}>
            <div className="section-eyebrow">DFT program components</div>
            <h2 className="section-title">Four pillars. One delivery program.</h2>
            <p className="section-lede">
              Every Digital Fast Track engagement spans the same four delivery
              pillars — adapted to national priorities and sequenced to produce
              visible value within the first year.
            </p>
          </div>

          <div className="grid-2">
            {PILLARS.map((p) => (
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
                  {p.points.map((pt) => (
                    <li key={pt}>{pt}</li>
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
            <div className="section-eyebrow">DFT program timeline</div>
            <h2 className="section-title">
              365 days to a working digital foundation.
            </h2>
            <p className="section-lede">
              A single coordinated program plan — sequenced so that
              infrastructure, security, services, and workforce capability all
              reach operational maturity in the same year.
            </p>
          </div>

          <div className="process-steps">
            {TIMELINE.map(([num, title, desc]) => (
              <div key={num} className="process-step">
                <div className="process-step__num">{num}</div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "var(--color-surface-offset)" }}>
        <div className="container">
          <div className="feature-row">
            <div className="feature-row__image">
              <img
                src="/images/satellite-earth.png"
                alt="Globe with connected infrastructure routes"
              />
            </div>
            <div className="feature-row__content">
              <div className="section-eyebrow">DFT outcomes</div>
              <h2>What success looks like at day 365.</h2>
              <p>
                A Digital Fast Track engagement is judged on whether the country
                has a working digital foundation operating sustainably — not on
                whether the program was busy.
              </p>
              <ul role="list">
                <li>
                  Sovereign data center operational, with local team running
                  day-to-day
                </li>
                <li>
                  SOC and CSIRT detecting, triaging, and responding to incidents
                  on national scope
                </li>
                <li>
                  First wave of citizen e-services live, with measurable
                  adoption
                </li>
                <li>
                  Trained workforce certified across operations, security, and
                  digital services
                </li>
                <li>
                  Reporting cadence in place for funders, regulators, and
                  stakeholders
                </li>
                <li>
                  Year-two scale roadmap aligned to national digital strategy
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="container">
          <div className="cta-band__inner">
            <div>
              <h2>Ready to fast-track?</h2>
              <p>
                Tell us where your country or institution is in its digital
                roadmap — we'll map the DFT model to your priorities and
                timeline.
              </p>
            </div>
            <div className="cta-band__actions">
              <Link className="btn btn-primary" to="/contact">
                Request a Briefing <span className="arrow" aria-hidden="true">→</span>
              </Link>
              <Link
                className="btn btn-secondary"
                to="/training/digital-workforce-training"
              >
                Workforce training
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
