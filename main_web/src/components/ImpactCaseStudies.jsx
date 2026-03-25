const CaseStudyCard = ({ badge, title, quadrants }) => (
  <div className="bg-[#EDECEB] rounded-2xl p-8">
    <span className="inline-block bg-[var(--color-primary)] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-sm mb-4">
      {badge}
    </span>
    <h3 className="text-2xl font-bold text-[var(--color-primary)] mb-8">{title}</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {(quadrants || []).map((q, i) => (
        <div key={i} className="bg-[#F3F2F2] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-6 rounded-full bg-[var(--color-yellow)] flex items-center justify-center text-[var(--color-primary)] text-xs font-bold shrink-0">
              {i + 1}
            </span>
            <p className="text-sm font-bold text-[var(--color-primary)]">{q.label}</p>
          </div>
          <p className="text-xs text-[var(--color-grey)]">{q.body}</p>
        </div>
      ))}
    </div>
  </div>
);

export default function ImpactCaseStudies({ sectionTitle, caseStudies }) {
  const list = caseStudies || [];
  return (
    <section className="bg-white py-20 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--color-primary)] uppercase mb-10">{sectionTitle || ""}</h2>
        <div className="space-y-8">
          {list.map((cs, i) => (
            <CaseStudyCard key={i} badge={cs.badge} title={cs.title} quadrants={cs.quadrants} />
          ))}
        </div>
      </div>
    </section>
  );
}
