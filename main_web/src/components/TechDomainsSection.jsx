import { iconForDomainKey } from "../lib/techSectionIcons";

export default function TechDomainsSection({ domainsHeading, domains }) {
  const list = domains || [];
  return (
    <section className="w-full bg-[var(--color-primary)] py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-white uppercase mb-10">{domainsHeading || ""}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {list.map((d, idx) => (
            <div
              key={`${d.title}-${idx}`}
              className={`bg-[#1e3048] rounded-xl p-6 border border-white/10 hover:border-[var(--color-yellow)]/40 transition-colors duration-200 ${d.wide ? "sm:col-span-2" : ""}`}
            >
              <div className="w-10 h-10 rounded-lg bg-[var(--color-yellow)]/10 text-[var(--color-yellow)] flex items-center justify-center mb-4">
                {iconForDomainKey(d.icon_key)}
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
