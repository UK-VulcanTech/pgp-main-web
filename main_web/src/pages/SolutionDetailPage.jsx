import { Link, Navigate, useParams } from "react-router-dom";
import { SOLUTIONS, SOLUTION_BY_SLUG } from "../data/solutions";

export default function SolutionDetailPage() {
  const { slug } = useParams();
  const sector = SOLUTION_BY_SLUG[slug];

  if (!sector) return <Navigate to="/solutions" replace />;

  const adjacentSectors = sector.adjacent
    .map((s) => SOLUTION_BY_SLUG[s])
    .filter(Boolean);

  return (
    <main id="main">
      <section className="sector-hero">
        <div className="sector-hero__bg">
          <img src={sector.heroImage} alt="" />
        </div>
        <div className="sector-hero__inner">
          <div className="breadcrumb">
            <Link to="/solutions">Solutions</Link>
            <span>/</span>
            <span>{sector.title}</span>
          </div>
          <h1>{sector.heroTitle}</h1>
          <p
            className="hero__lede"
            style={{
              color: "rgba(231,234,240,0.85)",
              marginTop: "var(--space-5)",
              maxWidth: 820,
            }}
          >
            {sector.heroLede}
          </p>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="sector-body">
            <div>
              <div className="section-eyebrow">Overview</div>
              <h2>{sector.overviewTitle}</h2>
              <p className="section-lede">{sector.overviewLede}</p>

              <div className="outcome-band">
                <div className="label">Outcome focus</div>
                <p>{sector.outcome}</p>
              </div>

              <div style={{ marginTop: "var(--space-8)" }}>
                <Link className="btn btn-primary" to="/contact">
                  {sector.ctaLabel}{" "}
                  <span className="arrow" aria-hidden="true">→</span>
                </Link>
              </div>
            </div>

            <div className="sector-body__deliver">
              <h3>What we deliver</h3>
              <ul>
                {sector.deliver.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {adjacentSectors.length > 0 && (
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
              {adjacentSectors.map((s) => (
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
