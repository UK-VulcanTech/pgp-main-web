import { Link } from "react-router-dom";
import { useApproachPage } from "../hooks/usePublicApi";

const APPROACH_FALLBACK = {
  page_eyebrow: "Approach · How we deliver",
  page_title: "Structure for multi-stakeholder delivery — without slowing the work down.",
  page_lede:
    "PGP brings structure to multi-stakeholder delivery — clarifying roles, aligning incentives, and implementing governance that supports transparent execution and long-term operations.",
  page_image: "/images/topo-navy.webp",
  blocks: [
    {
      num: "01",
      title: "Strategy & Program Design",
      bullets: [
        { text: "Feasibility analysis and stakeholder alignment workshops" },
        { text: "Implementation roadmaps with phased milestones and decision gates" },
        { text: "Operating model design covering people, process, and technology" },
        { text: "Performance frameworks and success measures defined up front" },
      ],
    },
    {
      num: "02",
      title: "Program Governance & PMO",
      bullets: [
        { text: "Delivery governance, schedules, milestones, and reporting cadence" },
        { text: "Vendor oversight and performance management against contract" },
        { text: "Risk controls and issue resolution frameworks" },
        { text: "Investor-grade documentation and audit-ready records" },
      ],
    },
    {
      num: "03",
      title: "Operational Readiness & Sustainment",
      bullets: [
        { text: "Lifecycle O&M planning before go-live, not after" },
        { text: "Workforce enablement and transition planning embedded in delivery" },
        { text: "Standard operating procedures, runbooks, and training pathways" },
        { text: "Maintenance scheduling and supply-chain readiness for continuity" },
      ],
    },
    {
      num: "04",
      title: "Technology Enablement",
      bullets: [
        { text: "Digital platforms and dashboards for visibility and accountability" },
        { text: "Systems integration into real-world operations across sectors" },
        { text: "Data lifecycle planning and infrastructure modernization" },
        { text: "Cybersecurity-aligned operating models and recovery planning" },
      ],
    },
    {
      num: "05",
      title: "Partnership & Capital Alignment",
      bullets: [
        { text: "Support for partnership structuring and delivery readiness" },
        { text: "Reporting and accountability frameworks aligned to funders and stakeholders" },
        { text: "Capital strategy and project packaging for investability" },
        { text: "Performance frameworks linked to commercial milestones" },
      ],
    },
  ],
  cta_heading: "Want to see this applied to your program?",
  cta_body:
    "Tell us where you are — we'll map our delivery model to the operating reality of your initiative.",
  cta_primary_label: "Talk to Our Team",
  cta_primary_url: "/contact",
  cta_secondary_label: "View Solutions",
  cta_secondary_url: "/solutions",
};

export default function ApproachPage() {
  const { data } = useApproachPage();
  const view = data || APPROACH_FALLBACK;

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
          <div className="approach-stack">
            {view.blocks.map((block) => (
              <div key={block.num} className="approach-block">
                <div className="approach-block__num">{block.num}</div>
                <div>
                  <h3>{block.title}</h3>
                  <ul>
                    {block.bullets.map((b, i) => (
                      <li key={i}>{b.text}</li>
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
              <h2>{view.cta_heading}</h2>
              <p>{view.cta_body}</p>
            </div>
            <div className="cta-band__actions">
              <Link className="btn btn-primary" to={view.cta_primary_url || "/contact"}>
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
