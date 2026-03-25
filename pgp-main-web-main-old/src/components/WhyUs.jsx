import IconExecution from "../assets/icons/CheckCircleIcon.png";
import IconOperations from "../assets/icons/settings.png";
import IconDelivery from "../assets/icons/security-check.png";
import IconCapacity from "../assets/icons/idea.png";
import IconTech from "../assets/icons/user-multiple.png";

const cards = [
  {
    icon: IconExecution,
    title: "End-To-End Execution",
    text: "Strategy through sustainment—Not “handoff delivery”",
  },
  {
    icon: IconOperations,
    title: "Operations-First Mindset",
    text: "We build systems that can be run, maintained, and measured",
  },
  {
    icon: IconDelivery,
    title: "Accountable Delivery",
    text: "Governance structures, clear reporting, and performance management",
  },
  {
    icon: IconCapacity,
    title: "Capacity Building Embedded",
    text: "Skills transfer that creates long-term independence",
  },
];

const ValueProposition = () => {
  return (
    <section className="bg-[var(--color-secondary)] py-20 px-6 md:px-12 lg:px-20 grid-bg">

      {/* Title */}
      <div className="max-w-5xl mx-auto text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] tracking-wide">
          WHAT MAKES US DIFFERENT
        </h2>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-2">
        
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-[var(--color-secondary)] rounded-xl p-7 md:p-8 shadow-md"
          >
            <div className="flex items-start gap-4">

              {/* Icon */}
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-200">
                <img
                  src={card.icon}
                  alt={card.title}
                  className="w-5 h-5 object-contain"
                />
              </div>

              {/* Content */}
              <div>
                <h3 className="text-lg font-bold text-[var(--color-primary)]">
                  {card.title}
                </h3>
                <p className="text-[var(--color-grey)] mt-2 text-sm md:text-base">
                  {card.text}
                </p>
              </div>

            </div>
          </div>
        ))}

      </div>

      {/* Bottom Card */}
      <div className="max-w-xl mx-auto mt-10">
        <div className="bg-[var(--color-secondary)] rounded-xl p-7 md:p-8 shadow-md">
          <div className="flex items-start gap-4">

            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-200">
              <img
                src={IconTech}
                alt="Technology"
                className="w-5 h-5 object-contain"
              />
            </div>

            <div>
              <h3 className="text-lg font-bold text-[var(--color-primary)]">
                Technology As An Enabler
              </h3>
              <p className="text-[var(--color-grey)] mt-2 text-sm md:text-base">
                Platforms, monitoring, and integration to improve decisions and outcomes
              </p>
            </div>

          </div>
        </div>
      </div>

    </section>
  );
};

export default ValueProposition;