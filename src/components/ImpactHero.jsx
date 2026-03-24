import WaveBg from "../assets/images/wave-bg.png";

const ImpactHero = () => {
  return (
    <section className="relative bg-[#0d1f35] py-24 px-6 overflow-hidden">
      {/* Background wave */}
      <img
        src={WaveBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
      />

      <div className="relative max-w-4xl mx-auto text-center">
        <p className="text-[var(--color-yellow)] text-xs font-bold uppercase tracking-widest mb-6">
          Impact Philosophy
        </p>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
          We prioritize outcomes that last —{" "}
          <span className="text-[var(--color-yellow)]">
            measured performance improvements
          </span>
          , operational readiness, and local capability that sustains services
          over time.
        </h1>
      </div>
    </section>
  );
};

export default ImpactHero;
