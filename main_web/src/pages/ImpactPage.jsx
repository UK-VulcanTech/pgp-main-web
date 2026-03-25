import { useImpactPage } from "../hooks/usePublicApi";
import { PageError, PageSpinner } from "../components/PageLoad";
import ImpactHero from "../components/ImpactHero";
import ImpactMetrics from "../components/ImpactMetrics";
import ImpactCaseStudies from "../components/ImpactCaseStudies";

export default function ImpactPage() {
  const { data, isLoading, isError } = useImpactPage();

  if (isLoading) return <PageSpinner />;
  if (isError || !data) return <PageError />;

  return (
    <>
      <ImpactHero hero={data.hero} />
      <ImpactMetrics metricsSectionTitle={data.metrics_section_title} metrics={data.metrics} />
      <ImpactCaseStudies sectionTitle={data.case_studies_section_title} caseStudies={data.case_studies} />
    </>
  );
}
