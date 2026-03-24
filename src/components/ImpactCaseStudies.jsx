const quadrants = [
  { number: 1, label: "Challenge",    placeholder: "Enter details for challenge..." },
  { number: 2, label: "PGP Approach", placeholder: "Enter details for pgp approach..." },
  { number: 3, label: "Outcomes",     placeholder: "Enter details for outcomes..." },
  { number: 4, label: "Next Steps",   placeholder: "Enter details for next steps..." },
];

const caseStudies = [
  { badge: "CASE STUDY 1", title: "[Case Study Placeholder Title]" },
  { badge: "CASE STUDY 2", title: "[Case Study Placeholder Title]" },
];

const CaseStudyCard = ({ badge, title }) => (
  <div className="bg-[#EDECEB] rounded-2xl p-8">
    {/* Badge */}
    <span className="inline-block bg-[var(--color-primary)] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-sm mb-4">
      {badge}
    </span>

    {/* Title */}
    <h3 className="text-2xl font-bold text-[var(--color-primary)] mb-8">
      {title}
    </h3>

    {/* 2×2 quadrant grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {quadrants.map(({ number, label, placeholder }) => (
        <div key={number} className="bg-[#F3F2F2] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-6 rounded-full bg-[var(--color-yellow)] flex items-center justify-center text-[var(--color-primary)] text-xs font-bold shrink-0">
              {number}
            </span>
            <p className="text-sm font-bold text-[var(--color-primary)]">{label}</p>
          </div>
          <p className="text-xs text-[var(--color-grey)] italic">{placeholder}</p>
        </div>
      ))}
    </div>
  </div>
);

const ImpactCaseStudies = () => {
  return (
    <section className="bg-white py-20 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--color-primary)] uppercase mb-10">
          Case Studies
        </h2>

        <div className="space-y-8">
          {caseStudies.map((cs) => (
            <CaseStudyCard key={cs.badge} {...cs} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactCaseStudies;
