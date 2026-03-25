import fallbackWave from "../assets/images/wave-bg.png";

export default function AboutHero({ hero }) {
  const h = hero || {};
  const wave = h.wave_image || fallbackWave;

  return (
    <section className="relative bg-[#F3F2F2] py-24 px-6 overflow-hidden">
      <img
        src={wave}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none"
      />
      <div className="relative max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#1F2D3D] tracking-wide uppercase">{h.title || ""}</h1>
        <p className="mt-8 text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">{h.intro || ""}</p>
      </div>
    </section>
  );
}
