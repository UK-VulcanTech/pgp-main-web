import fallbackWave from "../assets/images/talk-bg.png";
import CtaButtonLink from "./CtaButtonLink";

export default function HowWeDeliver({ approach }) {
  const a = approach || {};
  const steps = a.steps || [];
  const wave = a.wave_image || fallbackWave;
  const bottomCta = a.bottom_cta || {};

  return (
    <section id="how-we-deliver" className="bg-[var(--color-secondary)]  pt-10 border-t border-[#2B2B2B33] ">
      <div className="text-center mb-4">
        <span className="inline-block bg-[var(--color-yellow)] text-[var(--color-primary)] px-5 py-2 rounded-full text-sm font-medium">
          {a.pill || ""}
        </span>
      </div>

      <h2 className="text-center text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-16">{a.heading || ""}</h2>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-y-16 gap-x-12">
        {steps.map((step, index) => (
          <div key={`${step.title}-${index}`} className="relative">
            <span className="absolute -top-6 -left-2 text-6xl md:text-7xl font-bold text-gray-200">
              {String(step.number ?? index + 1)}
            </span>
            <div className="relative pl-10">
              <h3 className="text-lg md:text-xl font-bold text-[var(--color-primary)] mb-4">{step.title}</h3>
              {step.description && (
                <p className="text-[var(--color-grey)] text-sm md:text-base leading-relaxed max-w-md">{step.description}</p>
              )}
              {step.bullets?.length > 0 && (
                <div className="mt-4 space-y-3">
                  {step.bullets.map((item, i) => (
                    <div
                      key={i}
                      className="bg-[#EDECEB] rounded-lg px-4 py-3 shadow-sm border-l-4 border-[var(--color-primary)]"
                    >
                      <p className="text-sm md:text-base text-[var(--color-primary)]">{item}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="relative mt-20 bg-[var(--color-primary)] py-16 px-6 overflow-hidden">
        <img src={wave} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none" />
        <div className="absolute inset-0 bg-[var(--color-primary)]/80" />
        <div className="relative text-center">
          {bottomCta.label && (
            <CtaButtonLink
              href={bottomCta.url}
              className="inline-block bg-[var(--color-yellow)] text-[var(--color-primary)] px-8 py-3 rounded-md font-semibold hover:opacity-90 transition"
            >
              {bottomCta.label}
            </CtaButtonLink>
          )}
        </div>
      </div>
    </section>
  );
}
