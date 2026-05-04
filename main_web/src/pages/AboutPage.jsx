import { Link } from "react-router-dom";

const PRINCIPLES = [
  ["01", "End-to-end execution", "Strategy through sustainment — not \"handoff delivery.\" We stay until the program runs."],
  ["02", "Operations-first mindset", "We build systems that can be run, maintained, and measured — designed for the day after go-live."],
  ["03", "Technology as an enabler", "Platforms, monitoring, and integration that improve decisions and outcomes — not technology for its own sake."],
  ["04", "Capacity building embedded", "Skills transfer woven into the delivery model so local teams gain long-term independence."],
  ["05", "Accountable delivery", "Governance structures, clear reporting, and performance management that hold every party — including us — to the same standard."],
];

export default function AboutPage() {
  return (
    <main id="main">
      <section className="page-header">
        <div className="page-header__bg">
          <img src="/images/topo-navy.png" alt="" />
        </div>
        <div className="page-header__inner">
          <div className="page-header__eyebrow">About PGP</div>
          <h1 className="page-header__title">
            Strategy, operations, and execution for the programs that have to
            work.
          </h1>
          <p className="page-header__lede">
            Peak Global Partners is a full-service technology services company
            supporting complex initiatives — particularly public-private
            partnerships — where delivery requires strong governance,
            operational leadership, and integration across sectors.
          </p>
        </div>
      </section>

      <section>
        <div className="container">
          <div style={{ marginBottom: "var(--space-12)", maxWidth: 760 }}>
            <div className="section-eyebrow">What makes us different</div>
            <h2 className="section-title">
              Five operating principles that shape every engagement.
            </h2>
          </div>

          <div className="grid-3">
            {PRINCIPLES.map(([num, title, desc]) => (
              <article key={num} className="pillar-card">
                <div className="num">{num}</div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="compact"
        style={{ background: "var(--color-surface-offset)" }}
      >
        <div className="container">
          <div className="feature-row">
            <div className="feature-row__image">
              <img
                src="/images/infrastructure.png"
                alt="Modern infrastructure with people, systems, and digital overlay"
              />
            </div>
            <div className="feature-row__content">
              <div className="section-eyebrow">Who we serve</div>
              <h2>
                Public, private, and community partners — under one delivery
                model.
              </h2>
              <p>
                We work with government entities, private operators, investors,
                and community stakeholders delivering programs in essential
                infrastructure and technology-enabled services.
              </p>
              <ul role="list">
                <li>
                  Government ministries and agencies — federal, regional, and
                  municipal
                </li>
                <li>Private operators, utilities, and service providers</li>
                <li>Investors and blended-finance partners</li>
                <li>
                  Local communities, institutions, and workforce development
                  partners
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div style={{ marginBottom: "var(--space-10)", maxWidth: 780 }}>
            <div className="section-eyebrow">What we measure</div>
            <h2 className="section-title">
              Outcomes that last after the consultants leave.
            </h2>
            <p className="section-lede">
              We focus on outcomes such as improved service continuity,
              reliability, operational readiness, capability development, and
              sustainable performance over the asset lifecycle.
            </p>
          </div>

          <div className="audiences">
            <div className="audience">
              <div className="label">Service performance</div>
              <h3>Reliability & uptime</h3>
              <p>
                Measured improvements in service continuity and reductions in
                downtime, losses, and inefficiency across the assets we touch.
              </p>
            </div>
            <div className="audience">
              <div className="label">Workforce capability</div>
              <h3>Skills & certification</h3>
              <p>
                People trained and certified through structured curricula,
                train-the-trainer pipelines, and competency measurement built
                into delivery.
              </p>
            </div>
            <div className="audience">
              <div className="label">Governance</div>
              <h3>Reporting cadence established</h3>
              <p>
                Investor-grade governance, audit-ready controls, and clear
                performance reporting cadence — operational from day one.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="container">
          <div className="cta-band__inner">
            <div>
              <h2>See how we deliver these outcomes.</h2>
              <p>
                Our approach page walks through the operating model in detail —
                governance, readiness, technology, and capital alignment.
              </p>
            </div>
            <div className="cta-band__actions">
              <Link className="btn btn-primary" to="/approach">
                View Approach <span className="arrow" aria-hidden="true">→</span>
              </Link>
              <Link className="btn btn-secondary" to="/solutions">
                View Solutions
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
