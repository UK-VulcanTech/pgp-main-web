import fallbackBg from "../assets/images/cta-bg.png";
import CtaButtonLink from "./CtaButtonLink";

const btnClass =
  "inline-block px-8 py-3 font-semibold uppercase tracking-wide transition duration-300 bg-yellow text-primary hover:opacity-90";

export default function CTASection({ cta }) {
  const c = cta || {};
  const bg = c.background_image || fallbackBg;

  return (
    <section className="relative bg-[#1E2F3F] py-28 overflow-hidden">
      <img
        src={bg}
        alt=""
        className="absolute inset-0 w-full h-100 object-contain opacity-60 rotate-[10.1deg] scale-150"
      />
      <div className="relative z-10 px-6 max-w-4xl mx-auto text-center text-white">
        <h2 className="text-4xl md:text-5xl font-semibold tracking-wide">{c.heading || ""}</h2>
        <p className="mt-6 text-lg text-gray-300 max-w-4xl mx-auto">{c.body || ""}</p>
        <div className="mt-10">
          {c.button?.label && (
            <CtaButtonLink href={c.button?.url} className={btnClass}>
              {c.button.label}
            </CtaButtonLink>
          )}
        </div>
      </div>
    </section>
  );
}
