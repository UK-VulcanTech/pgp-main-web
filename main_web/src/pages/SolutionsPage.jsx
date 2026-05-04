import { Link } from "react-router-dom";
import { SOLUTIONS } from "../data/solutions";

const ALL_ITEMS = [
  ...SOLUTIONS.slice(0, 8).map((s, i) => ({
    label: `${String(i + 1).padStart(2, "0")} / Sector`,
    title: s.title,
    desc: s.snapshot,
    to: `/solutions/${s.slug}`,
  })),
  {
    label: "09 / Capability",
    title: "Capital Access",
    desc:
      "Align funding relationships and delivery readiness to move projects from plan to execution.",
    to: "/solutions/capital-access",
  },
  {
    label: "10 / Capability",
    title: "Training & Skills Transfer",
    desc:
      "Build sustainable local capability through structured training and measurable skills transfer.",
    to: "/training",
  },
];

export default function SolutionsPage() {
  return (
    <main id="main">
      <section className="page-header">
        <div className="page-header__bg">
          <img src="/images/topo-navy.png" alt="" />
        </div>
        <div className="page-header__inner">
          <div className="page-header__eyebrow">Solutions</div>
          <h1 className="page-header__title">
            Integrated programs across critical infrastructure, public services,
            and technology.
          </h1>
          <p className="page-header__lede">
            PGP delivers integrated programs across the sectors that economies
            and communities rely on. Our sector teams pair execution discipline
            with operational leadership to create results that are measurable
            and locally sustainable.
          </p>
        </div>
      </section>

      <section>
        <div className="container">
          <div style={{ marginBottom: "var(--space-10)", maxWidth: 760 }}>
            <div className="section-eyebrow">Sectors & capabilities</div>
            <h2 className="section-title">Ten domains, one delivery model.</h2>
          </div>

          <div className="sector-grid">
            {ALL_ITEMS.map((item) => (
              <Link key={item.title} to={item.to} className="sector-card">
                <div className="sector-num">{item.label}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                <span className="sector-link">
                  View sector <span className="arrow" aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="container">
          <div className="cta-band__inner">
            <div>
              <h2>Want to discuss a program in your sector?</h2>
              <p>
                Our sector teams pair execution discipline with operational
                leadership — tell us what you're delivering.
              </p>
            </div>
            <div className="cta-band__actions">
              <Link className="btn btn-primary" to="/contact">
                Talk to Our Team <span className="arrow" aria-hidden="true">→</span>
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
