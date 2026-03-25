import { useHomePage } from "../hooks/usePublicApi";
import { PageError, PageSpinner } from "../components/PageLoad";
import HeroSection from "../components/HeroSection";
import WhatPGPDelivers from "../components/WhatPGPDelivers";
import PPPSection from "../components/PPPSection";
import CTASection from "../components/CTASection";
import HowWeWork from "../components/HowWeWork";
import SolutionsSection from "../components/SolutionSection";

export default function Homepage() {
  const { data, isLoading, isError } = useHomePage();

  if (isLoading) return <PageSpinner />;
  if (isError || !data) return <PageError />;

  return (
    <>
      <HeroSection hero={data.hero} />
      <WhatPGPDelivers block={data.what_deliver} />
      <PPPSection ppp={data.ppp} />
      <SolutionsSection snapshot={data.solutions_snapshot} />
      <HowWeWork block={data.how_we_work} />
      <CTASection cta={data.cta} />
    </>
  );
}
