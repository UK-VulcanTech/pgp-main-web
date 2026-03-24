import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import AboutHero from "../components/AboutHero";
import WhyUs from "../components/WhyUs";
import WhoWeServe from "../components/WhoWeServe";
import OutcomeSection from "../components/OutcomeSection";
import HowWeDeliver from "../components/HowWeDeliver";

export default function AboutPage() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }, [hash]);

  return (
    <>
      <AboutHero />
      <WhyUs />
      <WhoWeServe />
      <OutcomeSection />
      <HowWeDeliver />
    </>
  );
}
