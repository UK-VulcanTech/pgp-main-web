import { iconForEnablementKey } from "../lib/techSectionIcons";

export default function TechEnablementSection({ enablementHeading, enablementItems }) {
  const items = enablementItems || [];
  return (
    <section className="w-full bg-[var(--color-secondary)] py-16 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-primary)] uppercase text-center mb-12">
          {enablementHeading || ""}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <div key={`${item.label}-${index}`} className="flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 rounded-full border-2 border-gray-300 flex items-center justify-center text-[var(--color-primary)]">
                {iconForEnablementKey(item.icon_key, index)}
              </div>
              <p className="text-sm md:text-base font-medium text-[var(--color-primary)] leading-snug">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
