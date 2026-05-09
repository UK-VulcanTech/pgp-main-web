import { Link, Navigate, useParams } from "react-router-dom";
import { TRAININGS, TRAINING_BY_SLUG } from "../data/training";
import { useTrainingDetail } from "../hooks/usePublicApi";

function buildFallback(slug) {
  const t = TRAINING_BY_SLUG[slug];
  if (!t) return null;
  return {
    slug: t.slug,
    title: t.title,
    snapshot: t.snapshot,
    hero_image: t.heroImage,
    hero_title: t.heroTitle,
    hero_lede: t.heroLede,
    overview_title: t.overviewTitle,
    overview_lede: t.overviewLede,
    outcome: t.outcome,
    cta_label: t.ctaLabel,
    deliver: t.deliver.map((text) => ({ text })),
    adjacent: t.adjacent
      .map((s) => TRAINING_BY_SLUG[s])
      .filter(Boolean)
      .map((s) => ({
        slug: s.slug,
        title: s.title,
        snapshot: s.snapshot,
      })),
    has_cyber_framework: !!t.framework,
    cf_section_eyebrow: t.framework ? "Cybersecurity Framework" : "",
    cf_section_title: t.framework?.title || "",
    cf_section_lede: t.framework?.lede || "",
    cf_phases: t.framework?.phases || [],
    cf_cards: t.framework?.cards
      ? t.framework.cards.map((c) => ({
          tag: c.tag,
          title: c.title,
          description: c.desc,
        }))
      : [],
    cf_foundation_tag: t.framework?.foundation?.tag || "",
    cf_foundation_title: t.framework?.foundation?.title || "",
    cf_foundation_desc: t.framework?.foundation?.desc || "",
  };
}

function CyberFramework({ t }) {
  if (!t.has_cyber_framework) return null;
  const phaseClassByTag = {
    Preparation: "prep",
    Prevention: "prevent",
    Detection: "detect",
    Response: "respond",
  };
  return (
    <section className="cyber-framework">
      <div className="cyber-framework__inner">
        <div className="section-eyebrow">{t.cf_section_eyebrow}</div>
        <h2>{t.cf_section_title}</h2>
        <p className="cyber-framework__lede">{t.cf_section_lede}</p>

        <div className="cf-phases">
          {t.cf_phases.map((p) => (
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
          {t.cf_cards.map((c, i) => (
            <article
              key={i}
              className="cf-card"
              data-phase={phaseClassByTag[c.tag] || "prep"}
            >
              <span className="cf-card__tag">{c.tag}</span>
              <div className="cf-card__title">{c.title}</div>
              <p className="cf-card__desc">{c.description}</p>
            </article>
          ))}
        </div>

        {t.cf_foundation_title && (
          <div className="cf-foundation">
            <span className="cf-foundation__tag">{t.cf_foundation_tag}</span>
            <div className="cf-foundation__title">{t.cf_foundation_title}</div>
            <p className="cf-foundation__desc">{t.cf_foundation_desc}</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default function TrainingDetailPage() {
  const { slug } = useParams();
  const { data, isError } = useTrainingDetail(slug);
  const fallback = buildFallback(slug);

  if (!fallback && isError) return <Navigate to="/training" replace />;
  if (!fallback && !data) return <Navigate to="/training" replace />;

  const t = data || fallback;

  return (
    <main id="main">
      <section className="sector-hero">
        <div className="sector-hero__bg">
          <img src={t.hero_image} alt="" />
        </div>
        <div className="sector-hero__inner">
          <div className="breadcrumb">
            <Link to="/training">Training & Skills Transfer</Link>
            <span>/</span>
            <span>{t.title}</span>
          </div>
          <h1>{t.hero_title}</h1>
          <p
            className="hero__lede"
            style={{
              color: "rgba(231,234,240,0.85)",
              marginTop: "var(--space-5)",
              maxWidth: 820,
            }}
          >
            {t.hero_lede}
          </p>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="sector-body">
            <div>
              <div className="section-eyebrow">Overview</div>
              <h2>{t.overview_title}</h2>
              <p className="section-lede">{t.overview_lede}</p>

              <div className="outcome-band">
                <div className="label">Outcome focus</div>
                <p>{t.outcome}</p>
              </div>

              <div style={{ marginTop: "var(--space-8)" }}>
                <Link className="btn btn-primary" to="/contact">
                  {t.cta_label}{" "}
                  <span className="arrow" aria-hidden="true">→</span>
                </Link>
              </div>
            </div>

            <div className="sector-body__deliver">
              <h3>What we deliver</h3>
              <ul>
                {t.deliver.map((d, i) => (
                  <li key={i}>{d.text}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <CyberFramework t={t} />

      {t.adjacent && t.adjacent.length > 0 && (
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
              {t.adjacent.map((a) => (
                <Link
                  key={a.slug}
                  to={`/training/${a.slug}`}
                  className="training-card"
                >
                  <h3>{a.title}</h3>
                  <p>{a.snapshot}</p>
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
