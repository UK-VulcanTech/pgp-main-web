export default function DeliverTrainingSection({ title, cards }) {
  return (
    <section className="w-full bg-gray-100 py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900">
            {title}
          </h2>
          <div className="h-1 w-16 bg-yellow-400"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
          {cards.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="text-3xl md:text-4xl mb-4">{card.icon}</div>
              <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2">
                {card.title}
              </h3>
              {card.subtitle && (
                <p className="text-sm md:text-base text-gray-600">
                  {card.subtitle}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
