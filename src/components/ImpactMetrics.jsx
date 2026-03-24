const metrics = [
  { stat: "99.9%",    label: "Service reliability improvements" },
  { stat: "100%",     label: "Operational readiness milestones achieved" },
  { stat: "80%",      label: "Reduction in downtime / loss / inefficiency" },
  { stat: "50,000+",  label: "Workforce trained / certified" },
  { stat: "100%",     label: "Program performance reporting and governance cadence established", wide: true },
];

const MetricCard = ({ stat, label, wide }) => (
  <div
    className={`bg-white border-t-4 border-[var(--color-yellow)] rounded-sm p-6 shadow-sm ${
      wide ? "col-span-1 md:col-span-2" : ""
    }`}
  >
    <p className="text-3xl md:text-4xl font-extrabold text-[var(--color-primary)]">
      {stat}
    </p>
    <p className="mt-2 text-sm text-[var(--color-grey)]">{label}</p>
  </div>
);

const ImpactMetrics = () => {
  return (
    <section className="bg-[var(--color-secondary)] py-20 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--color-primary)] uppercase tracking-wide">
            What We Measure
          </h2>
          <div className="mt-3 mx-auto w-16 h-1 bg-[var(--color-yellow)]" />
        </div>

        {/* Metric grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {metrics.map((m) => (
            <MetricCard key={m.label} {...m} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactMetrics;
