const items = [
  {
    id: 1,
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <rect x="2" y="2" width="20" height="8" rx="2" />
        <rect x="2" y="14" width="20" height="8" rx="2" />
        <path d="M6 6h.01M6 18h.01" strokeLinecap="round" />
      </svg>
    ),
    label: "Infrastructure IT modernization and data lifecycle planning",
  },
  {
    id: 2,
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" strokeLinecap="round" />
        <path d="M7 9l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    label: "Platform and dashboard development for performance monitoring and accountability",
  },
  {
    id: 3,
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <circle cx="12" cy="5" r="2" />
        <circle cx="5" cy="19" r="2" />
        <circle cx="19" cy="19" r="2" />
        <path d="M12 7v4M12 11l-5 6M12 11l5 6" strokeLinecap="round" />
      </svg>
    ),
    label: "Systems integration into real-world operations (utilities, logistics, ports, agriculture, and more)",
  },
];

export default function TechEnablementSection() {
  return (
    <section className="w-full bg-[var(--color-secondary)] py-16 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-primary)] uppercase text-center mb-12">
          Additional Technology Enablement
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {items.map((item) => (
            <div key={item.id} className="flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 rounded-full border-2 border-gray-300 flex items-center justify-center text-[var(--color-primary)]">
                {item.icon}
              </div>
              <p className="text-sm md:text-base font-medium text-[var(--color-primary)] leading-snug">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
