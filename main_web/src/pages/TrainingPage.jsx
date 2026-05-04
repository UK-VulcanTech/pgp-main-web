import { Link } from "react-router-dom";

const TRAINING_AREAS = [
  {
    slug: "skills-transfer",
    title: "Skills Transfer",
    desc:
      "Train-the-trainer programs, certification pathways, and competency measurement that builds repeatable local standards.",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M3 21v-1a7 7 0 0 1 14 0v1" />
        <path d="M16 3.5a4 4 0 0 1 0 7" />
      </svg>
    ),
  },
  {
    slug: "intelligence-training",
    title: "Intelligence Training",
    desc:
      "Programmatic capability building emphasizing governance, lawful process, and professional standards.",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" />
      </svg>
    ),
  },
  {
    slug: "technology-training",
    title: "Technology Training",
    desc:
      "Deployment operations, software alignment, and workforce readiness — integrated into broader infrastructure needs.",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="4" width="18" height="14" rx="2" />
        <path d="M8 21h8M12 18v3" />
      </svg>
    ),
  },
  {
    slug: "cybersecurity-training",
    title: "Cybersecurity Training",
    desc:
      "Role-based pathways for executives, operators, and IT/security teams — aligning governance, operations, and technology.",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    slug: "digital-workforce-training",
    title: "Digital Workforce Training",
    desc:
      "Governance, tailored curricula, comprehensive support, and a communications strategy that drives digital adoption and reduces change resistance.",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3 7h18M3 12h18M3 17h12" />
        <circle cx="19" cy="17" r="2.5" />
      </svg>
    ),
  },
];

export default function TrainingPage() {
  return (
    <main id="main">
      <section className="page-header">
        <div className="page-header__bg">
          <img src="/images/training-session.png" alt="" />
        </div>
        <div className="page-header__inner">
          <div className="page-header__eyebrow">Training & Skills Transfer</div>
          <h1 className="page-header__title">
            Training programs that build sustainable capability.
          </h1>
          <p className="page-header__lede">
            PGP designs and delivers structured training and skills-transfer
            programs that strengthen institutional performance and build
            long-term local capacity — embedded into delivery models to ensure
            continuity after implementation.
          </p>
        </div>
      </section>

      <section>
        <div className="container">
          <div style={{ marginBottom: "var(--space-10)", maxWidth: 760 }}>
            <div className="section-eyebrow">Training Areas</div>
            <h2 className="section-title">
              Five practice areas, one operating philosophy: capability that
              lasts.
            </h2>
          </div>

          <div className="sector-grid">
            {TRAINING_AREAS.map((item) => (
              <Link
                key={item.slug}
                to={`/training/${item.slug}`}
                className="sector-card"
              >
                <div className="sector-num">Training</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                <span className="sector-link">
                  View program <span className="arrow" aria-hidden="true">→</span>
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
              <h2>Need a training program built for your team?</h2>
              <p>
                Our programs are designed to embed in your delivery model —
                qualified teams, repeatable standards, measurable improvement.
              </p>
            </div>
            <div className="cta-band__actions">
              <Link className="btn btn-primary" to="/contact">
                Explore Training Programs{" "}
                <span className="arrow" aria-hidden="true">→</span>
              </Link>
              <Link className="btn btn-secondary" to="/approach">
                Our delivery model
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
