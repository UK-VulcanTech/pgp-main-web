import { Link } from "react-router-dom";
import { TRAININGS } from "../data/training";
import { useTrainingList, useTrainingPage } from "../hooks/usePublicApi";

const TRAINING_PAGE_FALLBACK = {
  page_eyebrow: "Training & Skills Transfer",
  page_title: "Training programs that build sustainable capability.",
  page_lede:
    "PGP designs and delivers structured training and skills-transfer programs that strengthen institutional performance and build long-term local capacity — embedded into delivery models to ensure continuity after implementation.",
  page_image: "/images/training-session.webp",
  section_eyebrow: "Training Areas",
  section_title: "Five practice areas, one operating philosophy: capability that lasts.",
  cta_heading: "Need a training program built for your team?",
  cta_body:
    "Our programs are designed to embed in your delivery model — qualified teams, repeatable standards, measurable improvement.",
  cta_primary_label: "Explore Training Programs",
  cta_primary_url: "/contact",
  cta_secondary_label: "Our delivery model",
  cta_secondary_url: "/approach",
};

const TRAINING_LIST_FALLBACK = TRAININGS.map((t) => ({
  slug: t.slug,
  title: t.title,
  snapshot: t.snapshot,
}));

export default function TrainingPage() {
  const { data: page } = useTrainingPage();
  const { data: list } = useTrainingList();
  const view = page || TRAINING_PAGE_FALLBACK;
  const items = list || TRAINING_LIST_FALLBACK;

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
            {items.map((item) => (
              <Link
                key={item.slug}
                to={`/training/${item.slug}`}
                className="sector-card"
              >
                <div className="sector-num">Training</div>
                <h3>{item.title}</h3>
                <p>{item.snapshot}</p>
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
