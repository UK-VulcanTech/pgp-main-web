import {
  FaLightbulb,
  FaClipboardList,
  FaRocket,
  FaSyncAlt,
} from "react-icons/fa";

const HexIcon = ({ children }) => (
  <div
    className="relative flex items-center justify-center"
    style={{ width: 54, height: 54 }}
  >
    <div
      className="absolute inset-0 bg-primary"
      style={{
        clipPath:
          "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
      }}
    />
    <div
      className="absolute bg-white flex items-center justify-center text-primary"
      style={{
        width: 46,
        height: 46,
        clipPath:
          "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
      }}
    >
      {children}
    </div>
  </div>
);

const StepLabel = ({ number, title, desc }) => (
  <div className="relative" style={{ paddingRight: 10 }}>
    <span
      className="absolute text-[110px] font-black text-gray-200 leading-none select-none"
      style={{ right: -24, top: -18, zIndex: 0 }}
    >
      {number}
    </span>
    <h3
      className="relative font-bold text-gray-800 text-lg leading-tight"
      style={{ zIndex: 1 }}
    >
      {title}
    </h3>
    <p
      className="relative text-sm text-gray-500 mt-1 leading-relaxed"
      style={{ zIndex: 1 }}
    >
      {desc}
    </p>
  </div>
);

const HowWeWork = () => {
  return (
    <section className="bg-[#EFEFEF] py-20 relative overflow-hidden">
      {/* Title */}
      <div className="text-center mb-16">
        <h2 className="text-4xl font-black tracking-widest text-gray-800 uppercase">
          How We Work
        </h2>
      </div>

      {/* Desktop diagram */}
      <div
        className="hidden md:block relative mx-auto"
        style={{
          maxWidth: 1100,
          height: 480,
          paddingLeft: 20,
          paddingRight: 20,
        }}
      >
        {/* Wave SVG */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 1100 480"
          preserveAspectRatio="xMidYMid meet"
          fill="none"
        >
          {/* Gradient Definition */}
          <defs>
            <linearGradient
              id="curveGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#141F53" />
              <stop offset="100%" stopColor="#2D45B9" />
            </linearGradient>
          </defs>

          {/* Path */}
          <path
            d="M 0,280 
                C 150,340 300,340 400,260 
                C 500,180 650,180 750,260 
                C 850,340 1000,320 1100,220"
            stroke="url(#curveGradient)"
            strokeWidth="5"
            strokeDasharray="10 8"
            strokeLinecap="round"
          />
        </svg>

        {/* ── Step 1: Define ── icon at (88, 262), label ABOVE */}
        <div
          className="absolute"
          style={{ left: 88, top: 262, transform: "translate(-50%, -50%)" }}
        >
          <HexIcon>
            <FaLightbulb size={18} />
          </HexIcon>
        </div>
        <div className="absolute" style={{ left: 5, top: 72, width: 192 }}>
          <StepLabel
            number="1"
            title="Define"
            desc="Align stakeholders, scope, and success measures"
          />
        </div>

        {/* ── Step 2: Design ── icon at (375, 328), label BELOW */}
        <div
          className="absolute"
          style={{ left: 375, top: 328, transform: "translate(-50%, -50%)" }}
        >
          <HexIcon>
            <FaClipboardList size={18} />
          </HexIcon>
        </div>
        <div className="absolute" style={{ left: 302, top: 348, width: 185 }}>
          <StepLabel
            number="2"
            title="Design"
            desc="Build the roadmap, operating model, and delivery plan"
          />
        </div>

        {/* ── Step 3: Deliver ── icon at (688, 180), label ABOVE */}
        <div
          className="absolute"
          style={{ left: 688, top: 180, transform: "translate(-50%, -50%)" }}
        >
          <HexIcon>
            <FaRocket size={18} />
          </HexIcon>
        </div>
        <div className="absolute" style={{ left: 555, top: 14, width: 185 }}>
          <StepLabel
            number="3"
            title="Deliver"
            desc="Execute with governance, reporting, and performance controls"
          />
        </div>

        {/* ── Step 4: Sustain ── icon at (968, 280), label BELOW */}
        <div
          className="absolute"
          style={{ left: 968, top: 280, transform: "translate(-50%, -50%)" }}
        >
          <HexIcon>
            <FaSyncAlt size={18} />
          </HexIcon>
        </div>
        <div className="absolute" style={{ left: 852, top: 300, width: 200 }}>
          <StepLabel
            number="4"
            title="Sustain"
            desc="Transfer skills and establish lifecycle operations for continuity"
          />
        </div>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden max-w-sm mx-auto px-6 space-y-10 mt-4">
        {[
          {
            num: "1",
            title: "Define",
            desc: "Align stakeholders, scope, and success measures",
            icon: <FaLightbulb size={18} />,
          },
          {
            num: "2",
            title: "Design",
            desc: "Build the roadmap, operating model, and delivery plan",
            icon: <FaClipboardList size={18} />,
          },
          {
            num: "3",
            title: "Deliver",
            desc: "Execute with governance, reporting, and performance controls",
            icon: <FaRocket size={18} />,
          },
          {
            num: "4",
            title: "Sustain",
            desc: "Transfer skills and establish lifecycle operations for continuity",
            icon: <FaSyncAlt size={18} />,
          },
        ].map((step) => (
          <div key={step.num} className="flex items-start gap-4">
            <div className="shrink-0">
              <HexIcon>{step.icon}</HexIcon>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <h3 className="font-bold text-gray-800">{step.title}</h3>
                <span className="text-3xl font-black text-gray-200 leading-none">
                  {step.num}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowWeWork;
