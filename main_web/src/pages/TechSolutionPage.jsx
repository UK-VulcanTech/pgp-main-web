import SolutionsHeroSection from "../components/SolutionsHeroSection";
import OverviewSection from "../components/OverviewSection";
import TechDomainsSection from "../components/TechDomainsSection";
import TechEnablementSection from "../components/TechEnablementSection";
import TechOutcomeSection from "../components/TechOutcomeSection";
import { PageError, PageSpinner } from "../components/PageLoad";
import { useTechnologyPage } from "../hooks/usePublicApi";

export default function TechSolutionPage() {
  const { data, isLoading, isError } = useTechnologyPage();

  if (isLoading) return <PageSpinner />;
  if (isError || !data) return <PageError />;

  const hero = data.hero || {};
  const overview = data.overview || {};

  return (
    <>
      <SolutionsHeroSection
        label={hero.label || ""}
        titleBlack1={hero.title_black_1 || ""}
        titleBlack2={hero.title_black_2 || ""}
        titleYellow={hero.title_yellow || ""}
      />
      <OverviewSection text={overview.text || ""} sidebarLabel={overview.sidebar_label || "Overview"} />
      <TechDomainsSection domainsHeading={data.domains_heading} domains={data.domains} />
      <TechEnablementSection enablementHeading={data.enablement_heading} enablementItems={data.enablement_items} />
      <TechOutcomeSection outcome={data.outcome} />
    </>
  );
}
