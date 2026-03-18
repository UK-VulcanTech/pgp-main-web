import SolutionCard from "./ui/SolutionCard";
import { solutions } from "../data/Solutions";

const SolutionsSection = () => {
  return (
    <section className="bg-[#1E2F3F] py-24">
      
      {/* Container */}
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Title */}
        <h2 className="text-white text-4xl font-semibold tracking-wide mb-12">
          SOLUTIONS SNAPSHOT
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {solutions.map((item, i) => (
            <SolutionCard key={i} {...item} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default SolutionsSection;