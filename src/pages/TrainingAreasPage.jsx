import { Link } from "react-router-dom";
import SolutionsHeroSection from "../components/SolutionsHeroSection";
import OverviewSection from "../components/OverviewSection";

const trainingAreas = [
  {
    slug: "skills-transfer",
    title: "Skills Transfer",
    subtitle: "Train the Trainer + certification pathways",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" />
      </svg>
    ),
    featured: true,
  },
  {
    slug: "police-forensics-training",
    title: "Police Forensics Training",
    subtitle: "Courtroom-ready evidence practices and quality controls",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4M12 10a2 2 0 0 1 2 2c0 1.02.1 2.51.26 4" strokeLinecap="round" />
        <path d="M6 14c0-3.31 2.69-6 6-6s6 2.69 6 6c0 2.2-.24 3.96-.39 5" strokeLinecap="round" />
        <path d="M3 12c0-4.97 4.03-9 9-9s9 4.03 9 9c0 1.42-.33 2.77-.92 3.96" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    slug: "cybersecurity-training",
    title: "Cybersecurity Training",
    subtitle: "Role-based training pathways (executives, operators, IT/security teams)",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    slug: "intelligence-training",
    title: "Intelligence Training",
    subtitle: "Programmatic, governance-led capability building",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    slug: "technology-training",
    title: "Data Analysis Training",
    subtitle: "Quantifiable approaches to understanding and manage large data sets",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4.03 3-9 3S3 13.66 3 12" strokeLinecap="round" />
        <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function TrainingAreasPage() {
  return (
    <>
      <SolutionsHeroSection
        label="Our Solutions"
        titleBlack1="Training Programs That"
        titleBlack2="Build "
        titleYellow="Sustainable Capability"
      />

      <OverviewSection text="PGP designs and delivers structured training and skills transfer programs that strengthen institutional performance and build long-term local capacity embedded into delivery models to ensure continuity after implementation." />

      {/* Training Areas */}
      <section className="w-full bg-white py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">

          {/* Label + heading */}
          <p className="text-xs font-bold text-[var(--color-yellow)] tracking-widest uppercase mb-3">
            Core Capabilities
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-primary)] uppercase mb-10">
            Training Areas
          </h2>

          {/* Cards */}
          <div className="flex flex-col gap-4">
            {trainingAreas.map((area) => (
              <Link
                key={area.slug}
                to={`/training/${area.slug}`}
                className={`flex items-center gap-5 px-6 py-5 rounded-2xl border transition-all duration-200 group ${
                  area.featured
                    ? "bg-[var(--color-primary)] border-transparent"
                    : "bg-white border-gray-200 hover:border-[var(--color-yellow)] hover:shadow-sm"
                }`}
              >
                {/* Icon box */}
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                    area.featured
                      ? "bg-[var(--color-yellow)] text-[var(--color-primary)]"
                      : "bg-gray-100 text-[var(--color-primary)] group-hover:bg-[var(--color-yellow)]/20 transition-colors"
                  }`}
                >
                  {area.icon}
                </div>

                {/* Title */}
                <p
                  className={`text-sm md:text-base font-bold w-36 shrink-0 leading-snug ${
                    area.featured ? "text-white" : "text-[var(--color-primary)]"
                  }`}
                >
                  {area.title}
                </p>

                {/* Subtitle */}
                <p
                  className={`text-xs md:text-sm flex-1 leading-snug ${
                    area.featured ? "text-gray-300" : "text-[var(--color-grey)]"
                  }`}
                >
                  {area.subtitle}
                </p>

                {/* Arrow circle */}
                <div
                  className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-colors duration-200 ${
                    area.featured
                      ? "border-white/40 text-white"
                      : "border-gray-300 text-gray-400 group-hover:border-[var(--color-yellow)] group-hover:text-[var(--color-yellow)]"
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="mt-10 flex justify-center">
            <Link
              to="/training/skills-transfer"
              className="inline-flex items-center gap-2 bg-[var(--color-yellow)] text-[var(--color-primary)] font-bold text-sm px-8 py-4 rounded-full hover:opacity-90 transition-opacity"
            >
              Explore Training Programs
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

        </div>
      </section>
    </>
  );
}
