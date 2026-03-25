import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAboutPage } from "../hooks/usePublicApi";
import { PageError, PageSpinner } from "../components/PageLoad";
import AboutHero from "../components/AboutHero";
import WhyUs from "../components/WhyUs";
import WhoWeServe from "../components/WhoWeServe";
import OutcomeSection from "../components/OutcomeSection";
import HowWeDeliver from "../components/HowWeDeliver";

export default function AboutPage() {
  const { hash } = useLocation();
  const { data, isLoading, isError } = useAboutPage();

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }, [hash]);

  if (isLoading) return <PageSpinner />;
  if (isError || !data) return <PageError />;

  return (
    <>
      <AboutHero hero={data.hero} />
      <WhyUs differentiators={data.differentiators} />
      <WhoWeServe who={data.who_we_serve} />
      <OutcomeSection outcome={data.outcome} />
      <HowWeDeliver approach={data.approach} />
    </>
  );
}
