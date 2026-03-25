import fallbackImg from "../assets/images/measure-bg.png";
import CtaButtonLink from "./CtaButtonLink";

export default function OutcomeSection({ outcome }) {
  const o = outcome || {};
  const img = o.image || fallbackImg;
  const cta = o.cta || {};

  return (
    <section className="bg-[var(--color-secondary)] py-16 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
        <div className="text-center lg:text-left">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-primary)] mb-6">{o.heading || ""}</h2>
          <h3 className="text-lg md:text-xl font-semibold text-[var(--color-primary)] mb-4">{o.subheading || ""}</h3>
          <p className="text-[var(--color-grey)] text-sm md:text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
            {o.body || ""}
          </p>
          <div className="mt-8 flex justify-center lg:justify-start">
            {cta.label && (
              <CtaButtonLink
                href={cta.url}
                className="bg-[var(--color-primary)] text-white px-6 py-3 rounded-md text-sm md:text-base font-medium hover:opacity-90 transition inline-block"
              >
                {cta.label}
              </CtaButtonLink>
            )}
          </div>
        </div>
        <div className="flex justify-center lg:justify-end">
          <img src={img} alt="" className="w-full max-w-md md:max-w-lg lg:max-w-xl rounded-2xl object-cover" />
        </div>
      </div>
    </section>
  );
}
