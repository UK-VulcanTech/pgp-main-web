const domains = [
  {
    id: 1,
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" strokeLinecap="round" />
        <path d="M7 8h3M7 11h5" strokeLinecap="round" />
      </svg>
    ),
    title: "Software Integration",
    description: "Structured project management frameworks and supporting digital infrastructure to enable coordinated solutions.",
  },
  {
    id: 2,
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M3 3v18h18" strokeLinecap="round" />
        <path d="M7 16l4-5 4 3 4-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Data Analysis Tools",
    description: "Platforms and dashboards that convert operational data into actionable visibility and reporting.",
  },
  {
    id: 3,
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" strokeLinecap="round" />
      </svg>
    ),
    title: "Communication",
    description: "Integrated communication systems that support coordination across agencies and operational environments.",
  },
  {
    id: 4,
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <rect x="2" y="2" width="20" height="8" rx="2" />
        <rect x="2" y="14" width="20" height="8" rx="2" />
        <path d="M6 6h.01M6 18h.01" strokeLinecap="round" />
      </svg>
    ),
    title: "Data Centers",
    description: "Planning and execution support for reliable, scalable data center initiatives.",
  },
  {
    id: 5,
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" strokeLinecap="round" />
        <circle cx="12" cy="10" r="3" />
        <path d="M6 10h3M15 10h3" strokeLinecap="round" />
      </svg>
    ),
    title: "Command Centers",
    description: "Integrated command centers that unify real-time data, communications, and decision support tools to improve situational awareness, coordination, and operational response across multi-agency and critical infrastructure environments.",
    wide: true,
  },
];

export default function TechDomainsSection() {
  return (
    <section className="w-full bg-[var(--color-primary)] py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-white uppercase mb-10">
          Core Technology Domains
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {domains.map((d) => (
            <div
              key={d.id}
              className={`bg-[#1e3048] rounded-xl p-6 border border-white/10 hover:border-[var(--color-yellow)]/40 transition-colors duration-200 ${d.wide ? "sm:col-span-2" : ""}`}
            >
              <div className="w-10 h-10 rounded-lg bg-[var(--color-yellow)]/10 text-[var(--color-yellow)] flex items-center justify-center mb-4">
                {d.icon}
              </div>
              <h3 className="text-sm md:text-base font-semibold text-white mb-2">{d.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{d.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
