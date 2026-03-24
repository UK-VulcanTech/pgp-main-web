import { useParams } from "react-router-dom";
import { solutionsData } from "../data/solutionsData";
import SolutionsHeroSection from "../components/SolutionsHeroSection";
import OverviewSection from "../components/OverviewSection";
import WhatWeDeliver from "../components/WhatWeDeliver";
import OutcomeFocusSection from "../components/OutcomeFocusSection";

export default function SolutionPage() {
  const { slug } = useParams();
  const data = solutionsData[slug];

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-xl">
        Solution not found.
      </div>
    );
  }

  return (
    <>
      <SolutionsHeroSection
        label={data.heroLabel}
        titleBlack1={data.heroTitleBlack1}
        titleYellow={data.heroTitleYellow}
        titleBlack2={data.heroTitleBlack2}
      />
      <OverviewSection text={data.overviewText} />
      <WhatWeDeliver items={data.deliverItems} />
      <OutcomeFocusSection headline={data.outcomeHeadline} ctaLabel={data.outcomeCta} />
    </>
  );
}
