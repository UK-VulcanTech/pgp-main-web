export default function OutcomeTrainingSection({ tag, title }) {
  return (
    <section className="w-full bg-[var(--color-yellow)] py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-xs font-bold text-black tracking-widest uppercase mb-4">
          — {tag} —
        </p>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-black leading-snug">
          {title}
        </h1>
      </div>
    </section>
  );
}
