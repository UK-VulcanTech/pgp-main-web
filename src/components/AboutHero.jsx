import WaveBg from "../assets/images/wave-bg.png"; // export from Figma

const AboutHero = () => {
  return (
    <section className="relative bg-[#F3F2F2] py-24 px-6 overflow-hidden">
      {/* BACKGROUND PATTERN */}
      <img
        src={WaveBg}
        alt="background pattern"
        className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none"
      />

      {/* CONTENT */}
      <div className="relative max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#1F2D3D] tracking-wide uppercase">
          About Us
        </h1>

        <p className="mt-8 text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
          Peak Global Partners is a full-service technology services company
          supporting complex initiatives— particularly public-private
          partnerships where delivery requires strong governance, operational
          leadership, and integration across sectors
        </p>
      </div>
    </section>
  );
};

export default AboutHero;
