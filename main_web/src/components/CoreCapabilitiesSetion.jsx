import { Users, Fingerprint, ShieldCheck, Lightbulb, Database, ArrowRight } from "lucide-react";

const coreCapabilities = [
  {
    id: 1,
    icon: Users,
    title: "Skills Transfer",
    description: "Train-the-Trainer + certification pathways",
    highlighted: true,
  },
  {
    id: 2,
    icon: Fingerprint,
    title: "Police Forensics Training",
    description: "Courtroom-ready evidence practices and quality controls",
    highlighted: false,
  },
  {
    id: 3,
    icon: ShieldCheck,
    title: "Cybersecurity Training",
    description: "Role-based training pathways (executives, operators, IT/security teams)",
    highlighted: false,
  },
  {
    id: 4,
    icon: Lightbulb,
    title: "Intelligence Training",
    description: "Programmatic, governance-led capability building",
    highlighted: false,
  },
  {
    id: 5,
    icon: Database,
    title: "Data Analysis Training",
    description: "Quantifiable approaches to understanding and manage large data sets",
    highlighted: false,
  },
];

export default function CoreCapabilities() {
  return (
    <div className="w-full min-h-screen bg-[#f0f0f0] px-4 py-10 sm:px-8 sm:py-14 md:px-16">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Barlow:wght@400;500;600;700;800&display=swap');
        .font-barlow-condensed { font-family: 'Barlow Condensed', sans-serif; }
        .font-barlow { font-family: 'Barlow', sans-serif; }
        .training-card:hover .arrow-btn { border-color: #e6c00a; color: #e6c00a; }
        .training-card-light:hover { box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
      `}</style>

      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <p className="font-barlow font-700 uppercase tracking-widest text-xs sm:text-sm mb-2"
            style={{ color: "#e6c00a" }}>
            Core Capabilities
          </p>
          <h2 className="font-barlow-condensed font-black uppercase text-3xl sm:text-4xl md:text-5xl tracking-tight"
            style={{ color: "#1a2233" }}>
            Training Areas
          </h2>
        </div>

        {/* Cards */}
        <div className="flex flex-col gap-4">
          {coreCapabilities.map((item) => {
            const Icon = item.icon;
            return item.highlighted ? (
              /* Highlighted card — dark navy */
              <div
                key={item.id}
                className="training-card flex items-center gap-4 sm:gap-6 rounded-2xl px-5 py-5 sm:px-7 sm:py-6 cursor-pointer transition-all duration-300"
                style={{ backgroundColor: "#1a2233" }}
              >
                {/* Icon box */}
                <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: "#e6c00a" }}>
                  <Icon size={22} color="#1a2233" strokeWidth={2} />
                </div>

                {/* Title */}
                <div className="flex-shrink-0 w-28 sm:w-36">
                  <p className="font-barlow font-bold text-sm sm:text-base leading-snug"
                    style={{ color: "#ffffff" }}>
                    {item.title}
                  </p>
                </div>

                {/* Description */}
                <p className="font-barlow text-sm sm:text-base flex-1 hidden sm:block"
                  style={{ color: "#8899aa" }}>
                  {item.description}
                </p>

                {/* Arrow */}
                <div className="arrow-btn flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ml-auto"
                  style={{ borderColor: "#e6c00a", color: "#e6c00a" }}>
                  <ArrowRight size={16} strokeWidth={2.5} />
                </div>
              </div>
            ) : (
              /* Default card — light */
              <div
                key={item.id}
                className="training-card training-card-light flex items-center gap-4 sm:gap-6 rounded-2xl px-5 py-5 sm:px-7 sm:py-6 cursor-pointer transition-all duration-300"
                style={{ backgroundColor: "#ffffff" }}
              >
                {/* Icon box */}
                <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: "#f0f0f0" }}>
                  <Icon size={22} color="#1a2233" strokeWidth={1.5} />
                </div>

                {/* Title */}
                <div className="flex-shrink-0 w-28 sm:w-36">
                  <p className="font-barlow font-bold text-sm sm:text-base leading-snug"
                    style={{ color: "#1a2233" }}>
                    {item.title}
                  </p>
                </div>

                {/* Description */}
                <p className="font-barlow text-sm sm:text-base flex-1 hidden sm:block"
                  style={{ color: "#9aabb8" }}>
                  {item.description}
                </p>

                {/* Arrow */}
                <div className="arrow-btn flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ml-auto"
                  style={{ borderColor: "#d0d8e0", color: "#9aabb8" }}>
                  <ArrowRight size={16} strokeWidth={2} />
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="flex justify-center mt-10 sm:mt-14">
          <button
            className="font-barlow font-bold text-sm sm:text-base flex items-center gap-3 rounded-full px-7 py-4 sm:px-9 sm:py-5 transition-all duration-300 hover:brightness-110 active:scale-95 cursor-pointer border-0"
            style={{ backgroundColor: "#e6c00a", color: "#1a2233" }}
          >
            Explore Training Programs
            <ArrowRight size={18} strokeWidth={2.5} />
          </button>
        </div>

      </div>
    </div>
  );
}