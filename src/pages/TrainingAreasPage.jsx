
import { trainingData } from "../data/trainingData";
import OutcomeTrainingSection from "../components/OutcomeTrainingSection";
import TrainingHeroSection from "../components/TrainingHeroSection";
import DeliverTrainingSection from "../components/DeliverTrainingSection";

const TrainingAreasPage = () => {
  const { outcomeSection, trainingSection, deliverSection } = trainingData;

  return (
    <main className="w-full">

     
      
      <TrainingHeroSection
        category={trainingSection.category}
        title={trainingSection.title}
        description={trainingSection.description}
        highlightedText={trainingSection.highlightedText}
        descriptionEnd={trainingSection.descriptionEnd}
      />
      
      <DeliverTrainingSection
        title={deliverSection.title}
        cards={deliverSection.cards}
      />
       <OutcomeTrainingSection 
        tag={outcomeSection.tag}
        title={outcomeSection.title}
      />

    </main>
  );
};

export default TrainingAreasPage;