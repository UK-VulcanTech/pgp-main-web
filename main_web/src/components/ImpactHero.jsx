import WaveBg from "../assets/images/wave-bg.png";

function HeadlineParts({ headline, highlight }) {
  if (!headline) return null;
  if (!highlight || !headline.includes(highlight)) {
    return <>{headline}</>;
  }
  const [before, ...rest] = headline.split(highlight);
  const after = rest.join(highlight);
  return (
    <>
      {before}
      <span className="text-[var(--color-yellow)]">{highlight}</span>
      {after}
    </>
  );
}

export default function ImpactHero({ hero }) {
  const h = hero || {};
  return (
    <section className="relative bg-[#0d1f35] py-24 px-6 overflow-hidden">
      <img src={WaveBg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none" />
      <div className="relative max-w-4xl mx-auto text-center">
        <p className="text-[var(--color-yellow)] text-xs font-bold uppercase tracking-widest mb-6">{h.eyebrow || ""}</p>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
          <HeadlineParts headline={h.headline} highlight={h.headline_highlight} />
        </h1>
      </div>
    </section>
  );
}
