export default function OutcomeTrainingSection({ tag, title }) {
  return (
    <section className="w-full bg-yellow-400 py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-sm md:text-base font-semibold text-slate-900 tracking-widest mb-6">
          — {tag} —
        </p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
          {title}
        </h1>
      </div>
    </section>
  );
}
