import { useParams, Navigate } from "react-router-dom";
import { trainingAreasData } from "../data/trainingAreasData";
import TrainingHeroSection from "../components/TrainingHeroSection";
import DeliverTrainingSection from "../components/DeliverTrainingSection";
import OutcomeTrainingSection from "../components/OutcomeTrainingSection";

export default function TrainingDetailPage() {
  const { slug } = useParams();
  const data = trainingAreasData[slug];

  if (!data) return <Navigate to="/" replace />;

  return (
    <main className="w-full">
      <TrainingHeroSection
        category={data.category}
        title={data.title}
        description={data.description}
        highlightedText={data.highlightedText}
        descriptionEnd={data.descriptionEnd}
      />
      <DeliverTrainingSection
        title="WHAT WE DELIVER"
        cards={data.cards}
        showNumbers={slug === "police-forensics-training"}
      />
      <OutcomeTrainingSection tag={data.outcomeTag} title={data.outcomeTitle} />
    </main>
  );
}
