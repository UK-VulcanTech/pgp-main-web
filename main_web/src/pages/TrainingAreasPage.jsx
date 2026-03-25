import { Link } from "react-router-dom";
import SolutionsHeroSection from "../components/SolutionsHeroSection";
import OverviewSection from "../components/OverviewSection";
import { PageError, PageSpinner } from "../components/PageLoad";
import { TrainingHubIcon } from "../lib/trainingHubIcons";
import { useTrainingHub } from "../hooks/usePublicApi";

export default function TrainingAreasPage() {
  const { data, isLoading, isError } = useTrainingHub();

  if (isLoading) return <PageSpinner />;
  if (isError || !data) return <PageError />;

  const areas = Array.isArray(data) ? data : [];
  const ctaSlug = areas.find((a) => a.featured)?.slug || areas[0]?.slug;

  return (
    <>
      <SolutionsHeroSection
        label="Our Solutions"
        titleBlack1="Training Programs That"
        titleBlack2="Build "
        titleYellow="Sustainable Capability"
      />
      <OverviewSection text="PGP designs and delivers structured training and skills transfer programs that strengthen institutional performance and build long-term local capacity embedded into delivery models to ensure continuity after implementation." />

      <section className="w-full bg-white py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold text-[var(--color-yellow)] tracking-widest uppercase mb-3">Core Capabilities</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-primary)] uppercase mb-10">Training Areas</h2>
          <div className="flex flex-col gap-4">
            {areas.map((area) => (
              <Link
                key={area.slug}
                to={`/training/${area.slug}`}
                className={`flex items-center gap-5 px-6 py-5 rounded-2xl border transition-all duration-200 group ${area.featured
                    ? "bg-[var(--color-primary)] border-transparent"
                    : "bg-white border-gray-200 hover:border-[var(--color-yellow)] hover:shadow-sm"
                  }`}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${area.featured
                      ? "bg-[var(--color-yellow)] text-[var(--color-primary)]"
                      : "bg-gray-100 text-[var(--color-primary)] group-hover:bg-[var(--color-yellow)]/20 transition-colors"
                    }`}
                >
                  <TrainingHubIcon slug={area.slug} />
                </div>
                <p
                  className={`text-sm md:text-base font-bold w-36 shrink-0 leading-snug ${area.featured ? "text-white" : "text-[var(--color-primary)]"
                    }`}
                >
                  {area.title}
                </p>
                <p
                  className={`text-xs md:text-sm flex-1 leading-snug ${area.featured ? "text-gray-300" : "text-[var(--color-grey)]"
                    }`}
                >
                  {area.subtitle}
                </p>
                <div
                  className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-colors duration-200 ${area.featured
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
          {ctaSlug && (
            <div className="mt-10 flex justify-center">
              <Link
                to={`/training/${ctaSlug}`}
                className="inline-flex items-center gap-2 bg-[var(--color-yellow)] text-[var(--color-primary)] font-bold text-sm px-8 py-4 rounded-full hover:opacity-90 transition-opacity"
              >
                Explore Training Programs
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
