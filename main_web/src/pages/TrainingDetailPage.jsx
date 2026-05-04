import { Link, Navigate, useParams } from "react-router-dom";
import { TRAININGS, TRAINING_BY_SLUG } from "../data/training";

function CyberFramework({ framework }) {
  if (!framework) return null;
  const phaseClassByTag = {
    Preparation: "prep",
    Prevention: "prevent",
    Detection: "detect",
    Response: "respond",
  };
  return (
    <section className="cyber-framework">
      <div className="cyber-framework__inner">
        <div className="section-eyebrow">Cybersecurity Framework</div>
        <h2>{framework.title}</h2>
        <p className="cyber-framework__lede">{framework.lede}</p>

        <div className="cf-phases">
          {framework.phases.map((p) => (
            <div
              key={p.label}
              className={`cf-phase cf-phase--${phaseClassByTag[p.label] || "prep"}`}
            >
              <span className="cf-phase__num">{p.num}</span>
              {p.label}
            </div>
          ))}
        </div>

        <div className="cf-grid">
          {framework.cards.map((c) => (
            <article
              key={c.title}
              className="cf-card"
              data-phase={phaseClassByTag[c.tag] || "prep"}
            >
              <span className="cf-card__tag">{c.tag}</span>
              <div className="cf-card__title">{c.title}</div>
              <p className="cf-card__desc">{c.desc}</p>
            </article>
          ))}
        </div>

        {framework.foundation && (
          <div className="cf-foundation">
            <span className="cf-foundation__tag">{framework.foundation.tag}</span>
            <div className="cf-foundation__title">
              {framework.foundation.title}
            </div>
            <p className="cf-foundation__desc">{framework.foundation.desc}</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default function TrainingDetailPage() {
  const { slug } = useParams();
  const training = TRAINING_BY_SLUG[slug];

  if (!training) return <Navigate to="/training" replace />;

  const adjacent = training.adjacent
    .map((s) => TRAINING_BY_SLUG[s])
    .filter(Boolean);

  return (
    <main id="main">
      <section className="sector-hero">
        <div className="sector-hero__bg">
          <img src={training.heroImage} alt="" />
        </div>
        <div className="sector-hero__inner">
          <div className="breadcrumb">
            <Link to="/training">Training & Skills Transfer</Link>
            <span>/</span>
            <span>{training.title}</span>
          </div>
          <h1>{training.heroTitle}</h1>
          <p
            className="hero__lede"
            style={{
              color: "rgba(231,234,240,0.85)",
              marginTop: "var(--space-5)",
              maxWidth: 820,
            }}
          >
            {training.heroLede}
          </p>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="sector-body">
            <div>
              <div className="section-eyebrow">Overview</div>
              <h2>{training.overviewTitle}</h2>
              <p className="section-lede">{training.overviewLede}</p>

              <div className="outcome-band">
                <div className="label">Outcome focus</div>
                <p>{training.outcome}</p>
              </div>

              <div style={{ marginTop: "var(--space-8)" }}>
                <Link className="btn btn-primary" to="/contact">
                  {training.ctaLabel}{" "}
                  <span className="arrow" aria-hidden="true">→</span>
                </Link>
              </div>
            </div>

            <div className="sector-body__deliver">
              <h3>What we deliver</h3>
              <ul>
                {training.deliver.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <CyberFramework framework={training.framework} />

      {adjacent.length > 0 && (
        <section
          className="compact"
          style={{ background: "var(--color-surface-offset)" }}
        >
          <div className="container">
            <div style={{ marginBottom: "var(--space-8)", maxWidth: 720 }}>
              <div className="section-eyebrow">More training programs</div>
              <h2
                className="section-title"
                style={{ fontSize: "var(--text-2xl)" }}
              >
                Other practice areas in the training portfolio.
              </h2>
            </div>
            <div className="training-grid">
              {adjacent.map((t) => (
                <Link
                  key={t.slug}
                  to={`/training/${t.slug}`}
                  className="training-card"
                >
                  <h3>{t.title}</h3>
                  <p>{t.snapshot}</p>
                  <span className="arrow-link">
                    View program{" "}
                    <span className="arrow" aria-hidden="true">→</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

export { TRAININGS };
