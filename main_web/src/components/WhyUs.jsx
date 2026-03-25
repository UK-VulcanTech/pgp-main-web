export default function WhyUs({ differentiators }) {
  const d = differentiators || {};
  const allCards = d.cards || [];
  const gridCards = allCards.slice(0, 4);
  const bottomCard = allCards.length > 4 ? allCards[4] : null;

  return (
    <section className="bg-[var(--color-secondary)] py-20 px-6 md:px-12 lg:px-20 grid-bg">
      <div className="max-w-5xl mx-auto text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] tracking-wide">
          {d.section_title || ""}
        </h2>
      </div>

      <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-2">
        {gridCards.map((card, index) => (
          <div key={`${card.title}-${index}`} className="bg-[var(--color-secondary)] rounded-xl p-7 md:p-8 shadow-md">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-200 overflow-hidden shrink-0">
                {card.icon ? (
                  <img src={card.icon} alt="" className="w-5 h-5 object-contain" />
                ) : null}
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--color-primary)]">{card.title}</h3>
                <p className="text-[var(--color-grey)] mt-2 text-sm md:text-base">{card.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {bottomCard && (
        <div className="max-w-xl mx-auto mt-10">
          <div className="bg-[var(--color-secondary)] rounded-xl p-7 md:p-8 shadow-md">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-200 overflow-hidden shrink-0">
                {bottomCard.icon ? (
                  <img src={bottomCard.icon} alt="" className="w-5 h-5 object-contain" />
                ) : null}
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--color-primary)]">{bottomCard.title}</h3>
                <p className="text-[var(--color-grey)] mt-2 text-sm md:text-base">{bottomCard.text}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
