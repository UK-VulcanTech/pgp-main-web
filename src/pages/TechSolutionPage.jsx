import SolutionsHeroSection from "../components/SolutionsHeroSection";
import OverviewSection from "../components/OverviewSection";
import TechDomainsSection from "../components/TechDomainsSection";
import TechEnablementSection from "../components/TechEnablementSection";
import TechOutcomeSection from "../components/TechOutcomeSection";

export default function TechSolutionPage() {
  return (
    <>
      <SolutionsHeroSection
        label="Our Solutions"
        titleBlack1="Technology That"
        titleBlack2="Enables "
        titleYellow="Real-World Operations"
      />
      <OverviewSection text="PGP delivers technology solutions that strengthen service delivery across infrastructure and public sector environments—built for deployment in challenging conditions & designed to scale." />
      <TechDomainsSection />
      <TechEnablementSection />
      <TechOutcomeSection />
    </>
  );
}
