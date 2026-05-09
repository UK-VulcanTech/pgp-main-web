import { Link } from "react-router-dom";
import { SOLUTIONS } from "../data/Solutions";
import { useSolutionList, useSolutionsPage } from "../hooks/usePublicApi";

const SOLUTIONS_PAGE_FALLBACK = {
  page_eyebrow: "Solutions",
  page_title: "Integrated programs across critical infrastructure, public services, and technology.",
  page_lede:
    "PGP delivers integrated programs across the sectors that economies and communities rely on. Our sector teams pair execution discipline with operational leadership to create results that are measurable and locally sustainable.",
  page_image: "/images/topo-navy.webp",
  section_eyebrow: "Sectors & capabilities",
  section_title: "Ten domains, one delivery model.",
  cta_heading: "Want to discuss a program in your sector?",
  cta_body:
    "Our sector teams pair execution discipline with operational leadership — tell us what you're delivering.",
  cta_primary_label: "Talk to Our Team",
  cta_primary_url: "/contact",
  cta_secondary_label: "How we deliver",
  cta_secondary_url: "/approach",
};

const SOLUTIONS_LIST_FALLBACK = SOLUTIONS.map((s) => ({
  slug: s.slug,
  title: s.title,
  snapshot: s.snapshot,
}));

export default function SolutionsPage() {
  const { data: page } = useSolutionsPage();
  const { data: list } = useSolutionList();
  const view = page || SOLUTIONS_PAGE_FALLBACK;
  const sectors = list || SOLUTIONS_LIST_FALLBACK;

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
          <div style={{ marginBottom: "var(--space-10)", maxWidth: 760 }}>
            <div className="section-eyebrow">{view.section_eyebrow}</div>
            <h2 className="section-title">{view.section_title}</h2>
          </div>

          <div className="sector-grid">
            {sectors.map((s, i) => (
              <Link key={s.slug} to={`/solutions/${s.slug}`} className="sector-card">
                <div className="sector-num">{`${String(i + 1).padStart(2, "0")} / Sector`}</div>
                <h3>{s.title}</h3>
                <p>{s.snapshot}</p>
                <span className="sector-link">
                  View sector <span className="arrow" aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
            <Link to="/training" className="sector-card">
              <div className="sector-num">{`${String(sectors.length + 1).padStart(2, "0")} / Capability`}</div>
              <h3>Training & Skills Transfer</h3>
              <p>Build sustainable local capability through structured training and measurable skills transfer.</p>
              <span className="sector-link">
                View sector <span className="arrow" aria-hidden="true">→</span>
              </span>
            </Link>
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
