export default function DeliverTrainingSection({ title, cards, showNumbers = false }) {
  const sectionBg = showNumbers ? "bg-[var(--color-primary)]" : "bg-[var(--color-secondary)]";
  const cardBg    = showNumbers ? "bg-[#1e3048] border-white/10 hover:border-[var(--color-yellow)]/40" : "bg-white border-gray-200 hover:shadow-md";
  const titleColor = showNumbers ? "text-white" : "text-[var(--color-primary)]";
  const textColor  = showNumbers ? "text-white" : "text-[var(--color-primary)]";
  const subColor   = showNumbers ? "text-gray-400" : "text-[var(--color-grey)]";

  return (
    <section className={`w-full ${sectionBg} py-16 md:py-24 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <div className="flex items-center gap-4 mb-12">
          <h2 className={`text-3xl sm:text-4xl font-bold ${titleColor}`}>
            {title}
          </h2>
          <div className="h-1 w-16 bg-[var(--color-yellow)] shrink-0" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {cards.map((card, index) => {
            const isLastOdd = cards.length % 2 !== 0 && index === cards.length - 1;

            return (
              <div
                key={card.id}
                className={`rounded-xl p-5 md:p-6 border transition-colors duration-200 ${cardBg} ${isLastOdd ? "sm:col-span-2" : ""} ${showNumbers ? "flex items-start gap-4" : "flex flex-col"}`}
              >
                {showNumbers ? (
                  /* Police Forensics: numbered circle left, text right */
                  <>
                    <div className="w-8 h-8 rounded-full bg-[var(--color-yellow)] flex items-center justify-center shrink-0">
                      <span className="text-[var(--color-primary)] text-sm font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <h3 className={`text-sm md:text-base font-semibold leading-snug mb-1 ${textColor}`}>
                        {card.title}
                      </h3>
                      {card.subtitle && (
                        <p className={`text-xs leading-relaxed ${subColor}`}>{card.subtitle}</p>
                      )}
                    </div>
                  </>
                ) : (
                  /* Other screens: icon box on top, text below */
                  <>
                    <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center mb-4 text-xl shrink-0">
                      {typeof card.icon === "string" ? <span aria-hidden>{card.icon}</span> : card.icon}
                    </div>
                    <h3 className={`text-sm md:text-base font-semibold leading-snug mb-1 ${textColor}`}>
                      {card.title}
                    </h3>
                    {card.subtitle && (
                      <p className={`text-xs leading-relaxed ${subColor}`}>{card.subtitle}</p>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
