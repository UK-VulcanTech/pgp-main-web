import { Link } from "react-router-dom";
import { SOLUTIONS } from "../data/solutions";

const SNAPSHOT_ITEMS = [
  ...SOLUTIONS.slice(0, 8).map((s, i) => ({
    label: `${String(i + 1).padStart(2, "0")} / Sector`,
    title: s.title,
    desc: s.snapshot,
    to: `/solutions/${s.slug}`,
  })),
  {
    label: "09 / Capability",
    title: "Training & Skills Transfer",
    desc:
      "Build sustainable local capability through structured training and measurable skills transfer.",
    to: "/training",
  },
  {
    label: "10 / Capability",
    title: "Capital Access",
    desc:
      "Align funding relationships and delivery readiness to move projects from plan to execution.",
    to: "/solutions/capital-access",
  },
];

export default function Homepage() {
  return (
    <main id="main">
      <section className="hero">
        <div className="hero__bg">
          <img src="/images/hero-control-room.png" alt="" />
        </div>
        <div className="hero__inner">
          <div className="hero__eyebrow">Strategy · Operations · Execution</div>
          <h1 className="hero__title">
            Full-service technology services for{" "}
            <em>high-impact partnerships.</em>
          </h1>
          <p className="hero__lede">
            Peak Global Partners (PGP) leads complex, multi-stakeholder
            programs — from feasibility to delivery — combining governance,
            operational leadership, and technology integration to produce
            measurable, sustainable outcomes.
          </p>
          <div className="hero__actions">
            <Link className="btn btn-primary" to="/solutions">
              Explore Solutions <span className="arrow" aria-hidden="true">→</span>
            </Link>
            <Link className="btn btn-secondary btn-on-dark" to="/contact">
              Talk to Our Team
            </Link>
          </div>
          <div className="hero__meta">
            <div className="hero__meta-item">
              <div className="label">Mission Scope</div>
              <div className="value">Critical Infrastructure</div>
              <div className="desc">
                Energy, water, transport, healthcare, real estate
              </div>
            </div>
            <div className="hero__meta-item">
              <div className="label">Operating Model</div>
              <div className="value">Public-Private Partnerships</div>
              <div className="desc">
                Concept through sustainable operations
              </div>
            </div>
            <div className="hero__meta-item">
              <div className="label">Outcome Lens</div>
              <div className="value">Measurable · Bankable</div>
              <div className="desc">Locally maintainable for the long term</div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div
            className="reveal in"
            style={{ marginBottom: "var(--space-12)", maxWidth: 780 }}
          >
            <div className="section-eyebrow">What PGP Delivers</div>
            <h2 className="section-title">
              Three intersecting capabilities. One delivery model built for the
              long term.
            </h2>
            <p className="section-lede">
              PGP operates at the intersection of infrastructure, technology,
              capacity building, and capital access — helping public and private
              partners deliver resilient systems where execution actually
              matters.
            </p>
          </div>

          <div className="grid-3">
            <article className="pillar-card">
              <div className="num">01</div>
              <h3>Infrastructure & Essential Services</h3>
              <p>
                Modernize and operate the systems that communities and economies
                rely on — energy, water, transportation, healthcare, and the
                digital backbone underneath.
              </p>
              <Link className="pillar-link" to="/solutions">
                View sectors <span className="arrow" aria-hidden="true">→</span>
              </Link>
            </article>
            <article className="pillar-card">
              <div className="num">02</div>
              <h3>Technology Enablement</h3>
              <p>
                Deploy platforms, command capabilities, and integrated data
                systems that improve visibility, coordination, and performance
                across multi-agency and operator environments.
              </p>
              <Link className="pillar-link" to="/solutions/technology">
                Technology stack <span className="arrow" aria-hidden="true">→</span>
              </Link>
            </article>
            <article className="pillar-card">
              <div className="num">03</div>
              <h3>Capacity & Capital Alignment</h3>
              <p>
                Build local capability through structured skills transfer, and
                align funding pathways — public, private, and blended — to keep
                programs running long after initial delivery.
              </p>
              <Link className="pillar-link" to="/training">
                Training programs <span className="arrow" aria-hidden="true">→</span>
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="feature-row">
            <div className="feature-row__image">
              <img
                src="/images/satellite-earth.png"
                alt="Globe with connected infrastructure routes across continents"
              />
            </div>
            <div className="feature-row__content">
              <div className="section-eyebrow">
                Built for Public-Private Partnerships
              </div>
              <h2>Tight coordination is a feature, not an obstacle.</h2>
              <p>
                PGP specializes in initiatives that require coordination between
                government agencies, private operators, investors, and local
                communities. We provide the program structure, operational
                oversight, and execution discipline to move projects from
                concept to sustainable delivery.
              </p>
              <ul role="list">
                <li>End-to-end program governance and delivery oversight</li>
                <li>Bankable program structures and investor-grade reporting</li>
                <li>Local capacity building embedded into the operating model</li>
                <li>Lifecycle planning for operations and maintenance from day one</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="compact" style={{ background: "var(--color-surface-offset)" }}>
        <div className="container">
          <div style={{ marginBottom: "var(--space-10)", maxWidth: 760 }}>
            <div className="section-eyebrow">Solutions Snapshot</div>
            <h2 className="section-title" style={{ fontSize: "var(--text-2xl)" }}>
              Ten sector capabilities, integrated by a single delivery model.
            </h2>
          </div>

          <div className="sector-grid">
            {SNAPSHOT_ITEMS.map((item) => (
              <Link key={item.title} to={item.to} className="sector-card">
                <div className="sector-num">{item.label}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                <span className="sector-link">
                  Learn more <span className="arrow" aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div style={{ marginBottom: "var(--space-10)", maxWidth: 760 }}>
            <div className="section-eyebrow">How We Work</div>
            <h2 className="section-title">
              A four-phase delivery model — from alignment to long-term
              sustainment.
            </h2>
          </div>

          <div className="process-steps">
            {[
              ["01 / Define", "Define", "Align stakeholders, scope, and success measures. Clarify roles, incentives, and what good looks like."],
              ["02 / Design", "Design", "Build the roadmap, operating model, and delivery plan. Set the governance and reporting cadence."],
              ["03 / Deliver", "Deliver", "Execute with PMO governance, vendor oversight, performance management, and technology enablement."],
              ["04 / Sustain", "Sustain", "Transfer skills, establish lifecycle O&M, and hand off operations to local teams that can run them."],
            ].map(([num, title, desc]) => (
              <div key={num} className="process-step">
                <div className="process-step__num">{num}</div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="container">
          <div className="cta-band__inner">
            <div>
              <h2>Ready to deliver?</h2>
              <p>
                Let's discuss your partnership goals and the operating model
                needed to achieve them.
              </p>
            </div>
            <div className="cta-band__actions">
              <Link className="btn btn-primary" to="/contact">
                Contact PGP <span className="arrow" aria-hidden="true">→</span>
              </Link>
              <Link className="btn btn-secondary" to="/approach">
                How we deliver
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
