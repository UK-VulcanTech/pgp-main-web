import { Link } from "react-router-dom";

const BLOCKS = [
  {
    num: "01",
    title: "Strategy & Program Design",
    items: [
      "Feasibility analysis and stakeholder alignment workshops",
      "Implementation roadmaps with phased milestones and decision gates",
      "Operating model design covering people, process, and technology",
      "Performance frameworks and success measures defined up front",
    ],
  },
  {
    num: "02",
    title: "Program Governance & PMO",
    items: [
      "Delivery governance, schedules, milestones, and reporting cadence",
      "Vendor oversight and performance management against contract",
      "Risk controls and issue resolution frameworks",
      "Investor-grade documentation and audit-ready records",
    ],
  },
  {
    num: "03",
    title: "Operational Readiness & Sustainment",
    items: [
      "Lifecycle O&M planning before go-live, not after",
      "Workforce enablement and transition planning embedded in delivery",
      "Standard operating procedures, runbooks, and training pathways",
      "Maintenance scheduling and supply-chain readiness for continuity",
    ],
  },
  {
    num: "04",
    title: "Technology Enablement",
    items: [
      "Digital platforms and dashboards for visibility and accountability",
      "Systems integration into real-world operations across sectors",
      "Data lifecycle planning and infrastructure modernization",
      "Cybersecurity-aligned operating models and recovery planning",
    ],
  },
  {
    num: "05",
    title: "Partnership & Capital Alignment",
    items: [
      "Support for partnership structuring and delivery readiness",
      "Reporting and accountability frameworks aligned to funders and stakeholders",
      "Capital strategy and project packaging for investability",
      "Performance frameworks linked to commercial milestones",
    ],
  },
];

export default function ApproachPage() {
  return (
    <main id="main">
      <section className="page-header">
        <div className="page-header__bg">
          <img src="/images/topo-navy.png" alt="" />
        </div>
        <div className="page-header__inner">
          <div className="page-header__eyebrow">Approach · How we deliver</div>
          <h1 className="page-header__title">
            Structure for multi-stakeholder delivery — without slowing the work
            down.
          </h1>
          <p className="page-header__lede">
            PGP brings structure to multi-stakeholder delivery — clarifying
            roles, aligning incentives, and implementing governance that
            supports transparent execution and long-term operations.
          </p>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="approach-stack">
            {BLOCKS.map((block) => (
              <div key={block.num} className="approach-block">
                <div className="approach-block__num">{block.num}</div>
                <div>
                  <h3>{block.title}</h3>
                  <ul>
                    {block.items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="container">
          <div className="cta-band__inner">
            <div>
              <h2>Want to see this applied to your program?</h2>
              <p>
                Tell us where you are — we'll map our delivery model to the
                operating reality of your initiative.
              </p>
            </div>
            <div className="cta-band__actions">
              <Link className="btn btn-primary" to="/contact">
                Talk to Our Team <span className="arrow" aria-hidden="true">→</span>
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
