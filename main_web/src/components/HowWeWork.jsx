import Curve from "../assets/icons/curve.svg";
import BulbIcon from "../assets/icons/bulb-charging.png";
import WebDesignIcon from "../assets/icons/web-design.png";
import RocketIcon from "../assets/icons/rocket-01.png";
import RefreshIcon from "../assets/icons/refresh-04.png";

const stepIcons = [BulbIcon, WebDesignIcon, RocketIcon, RefreshIcon];

const HexIcon = ({ src, alt }) => (
  <div
    className="flex items-center justify-center w-10 h-10 bg-white"
    style={{
      clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
      boxShadow: "0px 4px 4px 0px #3A5DB754",
    }}
  >
    <img src={src} alt={alt} className="w-5 h-5 object-contain" />
  </div>
);

const StepLabel = ({ number, title, desc, align = "left" }) => (
  <div
    className={`relative max-w-[180px] ${
      align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left"
    }`}
  >
    <span
      className="absolute text-[90px] md:text-[110px] font-black leading-none -top-5 -right-4 select-none"
      style={{
        background: "linear-gradient(180deg, rgba(0, 0, 0, 0.3) -37.71%, rgba(102, 102, 102, 0) 110.83%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      {number}
    </span>
    <h3 className="relative z-10 font-bold text-gray-800 text-base md:text-lg">{title}</h3>
    <p className="relative z-10 text-sm text-gray-500 mt-1">{desc}</p>
  </div>
);

const desktopLayout = [
  { stepIdx: 0, hexPos: "left-[10%] top-[65%]", labelPos: "left-[5%] top-[20%]", labelAlign: "left" },
  { stepIdx: 1, hexPos: "left-[35%] top-[75%]", labelPos: "left-[28%] top-[78%]", labelAlign: "left" },
  { stepIdx: 2, hexPos: "left-[65%] top-[35%]", labelPos: "left-[55%] top-[5%]", labelAlign: "left" },
  { stepIdx: 3, hexPos: "left-[90%] top-[65%]", labelPos: "left-[78%] top-[70%]", labelAlign: "right" },
];

export default function HowWeWork({ block }) {
  const b = block || {};
  const sectionTitle = b.title || "";
  const steps = (b.steps || []).slice(0, 4);
  const defaultSteps = [
    { title: "Define", description: "" },
    { title: "Design", description: "" },
    { title: "Deliver", description: "" },
    { title: "Sustain", description: "" },
  ];

  return (
    <section className="bg-[#EFEFEF] py-16 md:py-20">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl md:text-4xl font-black tracking-widest text-gray-800 uppercase">{sectionTitle}</h2>
      </div>

      <div className="hidden md:block relative mx-auto max-w-6xl aspect-[2.3/1]">
        <img src={Curve} alt="" className="absolute inset-0 w-full h-full object-contain opacity-80" />
        {desktopLayout.map(({ stepIdx, hexPos, labelPos, labelAlign }) => {
          const s = steps[stepIdx] || defaultSteps[stepIdx];
          const iconSrc = stepIcons[stepIdx];
          const num = String(stepIdx + 1);
          return (
            <div key={stepIdx}>
              <div className={`absolute ${hexPos} -translate-x-1/2 -translate-y-1/2`}>
                <HexIcon src={iconSrc} alt={s.title} />
              </div>
              <div className={`absolute ${labelPos}`}>
                <StepLabel number={num} title={s.title} desc={s.description} align={labelAlign} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="md:hidden flex flex-col gap-10 px-6">
        {(steps.length ? steps : defaultSteps).map((s, i) => (
          <StepLabel key={`${s.title}-${i}`} number={String(i + 1)} title={s.title} desc={s.description} />
        ))}
      </div>
    </section>
  );
}
