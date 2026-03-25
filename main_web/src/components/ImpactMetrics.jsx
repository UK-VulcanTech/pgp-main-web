const MetricCard = ({ stat, label, wide }) => (
  <div
    className={`bg-white border-t-4 border-[var(--color-yellow)] rounded-sm p-6 shadow-sm ${
      wide ? "col-span-1 md:col-span-2" : ""
    }`}
  >
    <p className="text-3xl md:text-4xl font-extrabold text-[var(--color-primary)]">{stat}</p>
    <p className="mt-2 text-sm text-[var(--color-grey)]">{label}</p>
  </div>
);

export default function ImpactMetrics({ metricsSectionTitle, metrics }) {
  const list = metrics || [];
  return (
    <section className="bg-[var(--color-secondary)] py-20 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--color-primary)] uppercase tracking-wide">
            {metricsSectionTitle || ""}
          </h2>
          <div className="mt-3 mx-auto w-16 h-1 bg-[var(--color-yellow)]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {list.map((m) => (
            <MetricCard key={m.label} stat={m.stat} label={m.label} wide={m.wide} />
          ))}
        </div>
      </div>
    </section>
  );
}
