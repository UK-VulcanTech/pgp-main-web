export default function TechOutcomeSection() {
  return (
    <section className="w-full bg-[var(--color-primary)] py-16 md:py-24 px-4 sm:px-6 lg:px-8 text-center">
      <div className="max-w-3xl mx-auto">
        <p className="text-xs font-bold text-[var(--color-yellow)] tracking-widest uppercase mb-6">
          — Outcome Focus —
        </p>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight mb-10">
          Resilient digital infrastructure, dependable operations, and decision-ready data.
        </h2>
        <button className="inline-flex items-center gap-2 bg-[var(--color-yellow)] text-[var(--color-primary)] font-bold text-sm sm:text-base px-8 py-4 rounded-full hover:opacity-90 transition-opacity">
          Build Technology for Operational Performance
          <span>→</span>
        </button>
      </div>
    </section>
  );
}
