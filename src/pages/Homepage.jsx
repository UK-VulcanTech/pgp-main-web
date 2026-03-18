import NavBar from "../components/ui/NavBar";
import HeroSection from "../components/HeroSection";
import WhatPGPDelivers from "../components/WhatPGPDelivers";
import Footer from "../components/ui/Footer";
import PPPSection from "../components/PPPSection";
import CTASection from "../components/CTASection";
import HowWeWork from "../components/HowWeWork";
import SolutionsSection from "../components/SolutionSection";

export default function Homepage() {
  return (
    <>
      <NavBar />
      <HeroSection />
      <WhatPGPDelivers />
      <PPPSection/>
      <SolutionsSection/>
      <HowWeWork/>
      <CTASection/>
      <Footer />
    </>
  );
}
