import Curve from "../assets/icons/curve.svg";
import BulbIcon from "../assets/icons/bulb-charging.png";
import WebDesignIcon from "../assets/icons/web-design.png";
import RocketIcon from "../assets/icons/rocket-01.png";
import RefreshIcon from "../assets/icons/refresh-04.png";

const HexIcon = ({ src, alt }) => (
  <div
    className="flex items-center justify-center w-10 h-10 bg-white"
    style={{
      clipPath:
        "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
      boxShadow: "0px 4px 4px 0px #3A5DB754",
    }}
  >
    <img src={src} alt={alt} className="w-5 h-5 object-contain" />
  </div>
);

const StepLabel = ({ number, title, desc, align = "left" }) => (
  <div
    className={`relative max-w-[180px] ${
      align === "center"
        ? "text-center"
        : align === "right"
        ? "text-right"
        : "text-left"
    }`}
  >
    <span
      className="absolute text-[90px] md:text-[110px] font-black leading-none -top-5 -right-4 select-none"
      style={{
        background:
          "linear-gradient(180deg, rgba(0, 0, 0, 0.3) -37.71%, rgba(102, 102, 102, 0) 110.83%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      {number}
    </span>
    <h3 className="relative z-10 font-bold text-gray-800 text-base md:text-lg">
      {title}
    </h3>
    <p className="relative z-10 text-sm text-gray-500 mt-1">{desc}</p>
  </div>
);

const HowWeWork = () => {
  return (
    <section className="bg-[#EFEFEF] py-16 md:py-20">
      {/* Title */}
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl md:text-4xl font-black tracking-widest text-gray-800 uppercase">
          How We Work
        </h2>
      </div>

      {/* Desktop */}
      <div className="hidden md:block relative mx-auto max-w-6xl aspect-[2.3/1]">
        {/* Curve */}
        <img
          src={Curve}
          alt="curve"
          className="absolute inset-0 w-full h-full object-contain opacity-80"
        />

        {/* STEP 1 */}
        <div className="absolute left-[10%] top-[65%] -translate-x-1/2 -translate-y-1/2">
          <HexIcon src={BulbIcon} alt="Define" />
        </div>
        <div className="absolute left-[5%] top-[20%]">
          <StepLabel
            number="1"
            title="Define"
            desc="Align stakeholders, scope, and success measures"
          />
        </div>

        {/* STEP 2 */}
        <div className="absolute left-[35%] top-[75%] -translate-x-1/2 -translate-y-1/2">
          <HexIcon src={WebDesignIcon} alt="Design" />
        </div>
        <div className="absolute left-[28%] top-[78%]">
          <StepLabel
            number="2"
            title="Design"
            desc="Build the roadmap, operating model, and delivery plan"
          />
        </div>

        {/* STEP 3 */}
        <div className="absolute left-[65%] top-[35%] -translate-x-1/2 -translate-y-1/2">
          <HexIcon src={RocketIcon} alt="Deliver" />
        </div>
        <div className="absolute left-[55%] top-[5%]">
          <StepLabel
            number="3"
            title="Deliver"
            desc="Execute with governance, reporting, and performance controls"
          />
        </div>

        {/* STEP 4 */}
        <div className="absolute left-[90%] top-[65%] -translate-x-1/2 -translate-y-1/2">
          <HexIcon src={RefreshIcon} alt="Sustain" />
        </div>
        <div className="absolute left-[78%] top-[70%]">
          <StepLabel
            number="4"
            title="Sustain"
            desc="Transfer skills and establish lifecycle operations for continuity"
          />
        </div>
      </div>

      {/* Mobile (clean stacked version) */}
      <div className="md:hidden flex flex-col gap-10 px-6">
        <StepLabel
          number="1"
          title="Define"
          desc="Align stakeholders, scope, and success measures"
        />
        <StepLabel
          number="2"
          title="Design"
          desc="Build the roadmap, operating model, and delivery plan"
        />
        <StepLabel
          number="3"
          title="Deliver"
          desc="Execute with governance, reporting, and performance controls"
        />
        <StepLabel
          number="4"
          title="Sustain"
          desc="Transfer skills and establish lifecycle operations for continuity"
        />
      </div>
    </section>
  );
};

export default HowWeWork;