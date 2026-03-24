import HeroSection from "../components/HeroSection";
import WhatPGPDelivers from "../components/WhatPGPDelivers";
import PPPSection from "../components/PPPSection";
import CTASection from "../components/CTASection";
import HowWeWork from "../components/HowWeWork";
import SolutionsSection from "../components/SolutionSection";

export default function Homepage() {
  return (
    <>
      <HeroSection />
      <WhatPGPDelivers />
      <PPPSection/>
      <SolutionsSection/>
      <HowWeWork/>
      <CTASection/>
    </>
  );
}
