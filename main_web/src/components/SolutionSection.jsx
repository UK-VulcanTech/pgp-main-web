import SolutionCard from "./ui/SolutionCard";
import { getSnapshotIconFallback } from "../lib/solutionSnapshotIcons";

export default function SolutionsSection({ snapshot }) {
  const s = snapshot || {};
  const cards = s.cards || [];

  return (
    <section className="bg-[#1E2F3F] py-24 px-6">
      <div className="max-w-full mx-auto px-20">
        <h2 className="text-white text-4xl font-semibold tracking-wide mb-12">{s.title || ""}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((item, i) => {
            const fb = getSnapshotIconFallback(item.title);
            return (
              <SolutionCard
                key={`${item.title}-${i}`}
                title={item.title}
                desc={item.description}
                image={item.image || fb?.image}
                hoverImage={item.hover_image || fb?.hoverImage}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
