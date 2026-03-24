export default function TrainingHeroSection({ category, title, description, highlightedText, descriptionEnd }) {
  return (
    <section className="w-full bg-slate-800 py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <p className="text-xs md:text-sm font-semibold text-yellow-400 tracking-widest mb-4">
          — {category} —
        </p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
          {title}
        </h2>
        <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
          {description}
          <span className="text-yellow-400 font-semibold">{highlightedText}</span>
          {descriptionEnd}
        </p>
      </div>
    </section>
  );
}
