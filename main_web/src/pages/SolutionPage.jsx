import { useParams } from "react-router-dom";
import axios from "axios";
import SolutionsHeroSection from "../components/SolutionsHeroSection";
import OverviewSection from "../components/OverviewSection";
import WhatWeDeliver from "../components/WhatWeDeliver";
import OutcomeFocusSection from "../components/OutcomeFocusSection";
import { PageError, PageSpinner } from "../components/PageLoad";
import { useSolutionDetail } from "../hooks/usePublicApi";

export default function SolutionPage() {
  const { slug } = useParams();
  const { data, isLoading, isError, error } = useSolutionDetail(slug);

  if (isLoading) return <PageSpinner />;
  if (isError || !data) {
    const notFound = axios.isAxiosError(error) && error.response?.status === 404;
    return <PageError message={notFound ? "Solution not found." : "Content could not be loaded."} />;
  }

  const deliverItems = (data.deliver_items || []).map((d) => ({
    id: d.id,
    text: d.text,
  }));

  return (
    <>
      <SolutionsHeroSection
        label={data.hero_label || ""}
        titleBlack1={data.hero_title_black_1 || ""}
        titleYellow={data.hero_title_yellow || ""}
        titleBlack2={data.hero_title_black_2 || ""}
      />
      <OverviewSection text={data.overview_text || ""} />
      <WhatWeDeliver items={deliverItems} />
      <OutcomeFocusSection
        headline={data.outcome_headline || ""}
        ctaLabel={data.outcome_cta || ""}
        ctaHref={data.outcome_cta_url || "/contact"}
      />
    </>
  );
}
