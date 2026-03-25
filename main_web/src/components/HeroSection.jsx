import fallbackHeroBg from "../assets/images/hero-bg.png";
import CtaButtonLink from "./CtaButtonLink";

export default function HeroSection({ hero }) {
  const h = hero || {};
  const bg = h.background_image || fallbackHeroBg;

  return (
    <section className="w-full lg:min-h-[calc(100vh-64px)] flex flex-col lg:flex-row bg-secondary overflow-hidden">
      <div className="w-full lg:w-[52%] flex items-start px-6 sm:px-10 lg:px-12 pt-14 lg:pt-14 pb-8 lg:pb-0">
        <div className="w-full max-w-130 pl-14">
          <p className="text-[10px] font-regular tracking-[0.28em] uppercase text-gray-400 mb-4">
            {h.eyebrow || ""}
          </p>

          <h1
            className="font-black text-primary uppercase leading-[1.06] whitespace-pre-line"
            style={{ fontSize: "clamp(2.4rem, 4vw, 3.6rem)" }}
          >
            {h.h1 || ""}
          </h1>

          <p className="mt-6 text-[0.88rem] text-[#555555] leading-[1.8] max-w-100">{h.body || ""}</p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            {h.cta_primary?.label && (
              <CtaButtonLink
                href={h.cta_primary?.url}
                className="px-7 py-3.25 bg-[#0d1f35] text-white text-[10px] font-bold tracking-[0.22em] uppercase hover:bg-[#1a3c5e] transition-colors duration-200 whitespace-nowrap text-center inline-block"
              >
                {h.cta_primary.label}
              </CtaButtonLink>
            )}
            {h.cta_secondary?.label && (
              <CtaButtonLink
                href={h.cta_secondary?.url}
                className="px-7 py-3.25 border border-[#0d1f35] text-[#0d1f35] text-[10px] font-bold tracking-[0.22em] uppercase hover:bg-[#0d1f35] hover:text-white transition-colors duration-200 whitespace-nowrap text-center inline-block"
              >
                {h.cta_secondary.label}
              </CtaButtonLink>
            )}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[48%] h-72 sm:h-96 lg:h-auto lg:min-h-screen">
        <img src={bg} alt="" className="w-full h-full object-cover object-center" />
      </div>
    </section>
  );
}
