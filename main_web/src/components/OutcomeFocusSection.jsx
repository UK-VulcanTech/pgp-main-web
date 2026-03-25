import CtaButtonLink from "./CtaButtonLink";

export default function OutcomeFocusSection({ headline, ctaLabel, ctaHref = "/contact" }) {
  return (
    <div
      className="w-full px-6 py-10 sm:px-10 sm:py-14 md:px-16 md:py-16"
      style={{ backgroundColor: "#e6c00a" }}
    >
      <p
        className="font-bold uppercase tracking-widest mb-4 sm:mb-6"
        style={{ color: "#1a2233", fontSize: "clamp(10px, 1vw, 13px)" }}
      >
        Outcome Focus
      </p>
      <h2
        className="font-extrabold leading-tight mb-8 sm:mb-10 md:mb-12"
        style={{
          color: "#1a2233",
          fontSize: "clamp(22px, 4vw, 50px)",
          maxWidth: "820px",
        }}
      >
        {headline}
      </h2>
      {ctaLabel && (
        <CtaButtonLink
          href={ctaHref}
          className="inline-block font-bold text-sm sm:text-base rounded-full px-6 py-3 sm:px-8 sm:py-4 border-0 cursor-pointer transition-colors duration-300 hover:bg-gray-900"
          style={{ backgroundColor: "#1a2233", color: "#e6c00a" }}
        >
          {ctaLabel}
        </CtaButtonLink>
      )}
    </div>
  );
}
