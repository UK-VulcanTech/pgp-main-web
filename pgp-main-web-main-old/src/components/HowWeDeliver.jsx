import WaveBg from "../assets/images/talk-bg.png";

const steps = [
  {
    number: "1",
    title: "Overview",
    description:
      "PGP brings structure to multi-stakeholder delivery—clarifying roles, aligning incentives, and implementing governance that supports transparent execution and long-term operations.",
  },
  {
    number: "2",
    title: "Program Governance & PMO",
    items: [
      "Delivery governance, schedules, milestones, and reporting",
      "Vendor oversight and performance management",
      "Risk controls and issue resolution frameworks",
    ],
  },
  {
    number: "3",
    title: "Operational Readiness & Sustainment",
    items: [
      "Operating model design (people, process, technology)",
      "Lifecycle O&M planning",
      "Workforce enablement and transition planning",
    ],
  },
  {
    number: "4",
    title: "Technology Enablement",
    items: [
      "Digital platforms & dashboards for visibility & accountability",
      "Systems integration for real-world operations across sectors",
    ],
  },
  {
    number: "5",
    title: "Partnership & Capital Alignment",
    items: [
      "Support for partnership structuring and delivery readiness",
      "Reporting & accountability frameworks aligned to funders & stakeholders",
    ],
  },
];

const HowWeDeliver = () => {
  return (
    <section id="how-we-deliver" className="bg-[var(--color-secondary)]  pt-10 border-t border-[#2B2B2B33] ">

      {/* Top Label */}
      <div className="text-center mb-4">
        <span className="inline-block bg-[var(--color-yellow)] text-[var(--color-primary)] px-5 py-2 rounded-full text-sm font-medium">
          Our Approach
        </span>
      </div>

      {/* Title */}
      <h2 className="text-center text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-16">
        HOW WE DELIVER
      </h2>

      {/* Steps Grid */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-y-16 gap-x-12">

        {steps.map((step, index) => (
          <div key={index} className="relative">

            {/* Big Number */}
            <span className="absolute -top-6 -left-2 text-6xl md:text-7xl font-bold text-gray-200">
              {step.number}
            </span>

            {/* Content */}
            <div className="relative pl-10">

              <h3 className="text-lg md:text-xl font-bold text-[var(--color-primary)] mb-4">
                {step.title}
              </h3>

              {step.description && (
                <p className="text-[var(--color-grey)] text-sm md:text-base leading-relaxed max-w-md">
                  {step.description}
                </p>
              )}

              {step.items && (
                <div className="mt-4 space-y-3">
                  {step.items.map((item, i) => (
                    <div
                      key={i}
                      className="bg-[#EDECEB] rounded-lg px-4 py-3 shadow-sm border-l-4 border-[var(--color-primary)]"
                    >
                      <p className="text-sm md:text-base text-[var(--color-primary)]">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        ))}

      </div>

      {/* CTA Section with Wave */}
      <div className="relative mt-20 bg-[var(--color-primary)] py-16 px-6 overflow-hidden">

        {/* Wave Background */}
        <img
          src={WaveBg}
          alt="wave background"
          className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none"
        />

        {/* Optional overlay (for better contrast) */}
        <div className="absolute inset-0 bg-[var(--color-primary)]/80"></div>

        {/* Content */}
        <div className="relative text-center">
          <button className="bg-[var(--color-yellow)] text-[var(--color-primary)] px-8 py-3 rounded-md font-semibold hover:opacity-90 transition">
            TALK TO OUR TEAM
          </button>
        </div>

      </div>

    </section>
  );
};

export default HowWeDeliver;