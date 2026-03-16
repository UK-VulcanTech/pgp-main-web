import heroBg from "../assets/images/hero-bg.png";

export default function HeroSection() {
  return (
    <section className="w-full min-h-screen flex flex-col lg:flex-row bg-[#F3F2F2] overflow-hidden">

      {/* LEFT — Text Content */}
      <div className="w-full lg:w-[52%] flex items-center px-10 sm:px-16 xl:px-20 py-16 lg:py-0">
        <div className="w-full max-w-130">

          {/* Label */}
          <p className="text-[10px] font-semibold tracking-[0.28em] uppercase text-gray-400 mb-4">
            Peak Global Partners
          </p>

          {/* Heading */}
          <h1
            className="font-black text-[#1B2A3B] uppercase leading-[1.06]"
            style={{ fontSize: "clamp(2.4rem, 4vw, 3.6rem)" }}
          >
            Full-Service<br />
            Technology<br />
            Services For<br />
            High&#8209;Impact<br />
            Partnerships
          </h1>

          {/* Paragraph */}
          <p className="mt-6 text-[0.88rem] text-[#555555] leading-[1.8] max-w-100">
            Peak Global Partners (PGP) leads complex, multi-stakeholder
            programs—from feasibility to delivery—combining governance,
            operational leadership, and technology integration to produce
            measurable, sustainable outcomes.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              className="px-7 py-3.25 bg-[#0d1f35] text-white text-[10px] font-bold tracking-[0.22em] uppercase hover:bg-[#1a3c5e] transition-colors duration-200 whitespace-nowrap"
            >
              Explore Solutions
            </button>
            <button
              className="px-7 py-3.25 border border-[#0d1f35] text-[#0d1f35] text-[10px] font-bold tracking-[0.22em] uppercase hover:bg-[#0d1f35] hover:text-white transition-colors duration-200 whitespace-nowrap"
            >
              Talk to Our Team
            </button>
          </div>

        </div>
      </div>

      {/* RIGHT — Hero Image flush to edge */}
      <div className="w-full lg:w-[48%] h-72 sm:h-96 lg:h-auto lg:min-h-screen">
        <img
          src={heroBg}
          alt="Peak Global Partners"
          className="w-full h-full object-cover object-center"
        />
      </div>

    </section>
  );
}
