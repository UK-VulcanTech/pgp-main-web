import { Link, Navigate, useParams } from "react-router-dom";
import { SOLUTIONS, SOLUTION_BY_SLUG } from "../data/Solutions";
import { useSolutionDetail } from "../hooks/usePublicApi";

function buildFallback(slug) {
  const sector = SOLUTION_BY_SLUG[slug];
  if (!sector) return null;
  return {
    slug: sector.slug,
    title: sector.title,
    snapshot: sector.snapshot,
    hero_image: sector.heroImage,
    hero_title: sector.heroTitle,
    hero_lede: sector.heroLede,
    overview_title: sector.overviewTitle,
    overview_lede: sector.overviewLede,
    outcome: sector.outcome,
    cta_label: sector.ctaLabel,
    deliver: sector.deliver.map((text) => ({ text })),
    adjacent: sector.adjacent
      .map((s) => SOLUTION_BY_SLUG[s])
      .filter(Boolean)
      .map((s) => ({
        slug: s.slug,
        title: s.title,
        snapshot: s.snapshot,
        hero_image: s.heroImage,
      })),
  };
}

export default function SolutionDetailPage() {
  const { slug } = useParams();
  const { data, isError } = useSolutionDetail(slug);
  const fallback = buildFallback(slug);

  // No fallback + API error → 404 to hub.
  if (!fallback && isError) return <Navigate to="/solutions" replace />;
  // Still loading and no fallback known: send to hub rather than a blank.
  if (!fallback && !data) return <Navigate to="/solutions" replace />;

  const sector = data || fallback;

  return (
    <main id="main">
      <section className="sector-hero">
        <div className="sector-hero__bg">
          <img src={sector.hero_image} alt="" />
        </div>
        <div className="sector-hero__inner">
          <div className="breadcrumb">
            <Link to="/solutions">Solutions</Link>
            <span>/</span>
            <span>{sector.title}</span>
          </div>
          <h1>{sector.hero_title}</h1>
          <p
            className="hero__lede"
            style={{
              color: "rgba(231,234,240,0.85)",
              marginTop: "var(--space-5)",
              maxWidth: 820,
            }}
          >
            {sector.hero_lede}
          </p>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="sector-body">
            <div>
              <div className="section-eyebrow">Overview</div>
              <h2>{sector.overview_title}</h2>
              <p className="section-lede">{sector.overview_lede}</p>

              <div className="outcome-band">
                <div className="label">Outcome focus</div>
                <p>{sector.outcome}</p>
              </div>

              <div style={{ marginTop: "var(--space-8)" }}>
                <Link className="btn btn-primary" to="/contact">
                  {sector.cta_label}{" "}
                  <span className="arrow" aria-hidden="true">→</span>
                </Link>
              </div>
            </div>

            <div className="sector-body__deliver">
              <h3>What we deliver</h3>
              <ul>
                {sector.deliver.map((d, i) => (
                  <li key={i}>{d.text}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {sector.adjacent && sector.adjacent.length > 0 && (
        <section
          className="compact"
          style={{ background: "var(--color-surface-offset)" }}
        >
          <div className="container">
            <div style={{ marginBottom: "var(--space-8)", maxWidth: 720 }}>
              <div className="section-eyebrow">Adjacent sectors</div>
              <h2
                className="section-title"
                style={{ fontSize: "var(--text-2xl)" }}
              >
                Programs we often deliver alongside this one.
              </h2>
            </div>
            <div className="sector-grid">
              {sector.adjacent.map((s) => (
                <Link
                  key={s.slug}
                  to={`/solutions/${s.slug}`}
                  className="sector-card"
                >
                  <div className="sector-num">Sector</div>
                  <h3>{s.title}</h3>
                  <p>{s.snapshot}</p>
                  <span className="sector-link">
                    View sector{" "}
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

export { SOLUTIONS };
