import { useParams } from "react-router-dom";
import axios from "axios";
import TrainingHeroSection from "../components/TrainingHeroSection";
import DeliverTrainingSection from "../components/DeliverTrainingSection";
import OutcomeTrainingSection from "../components/OutcomeTrainingSection";
import { PageError, PageSpinner } from "../components/PageLoad";
import { useTrainingDetail } from "../hooks/usePublicApi";

export default function TrainingDetailPage() {
  const { slug } = useParams();
  const { data, isLoading, isError, error } = useTrainingDetail(slug);

  if (isLoading) return <PageSpinner />;
  if (isError || !data) {
    const notFound = axios.isAxiosError(error) && error.response?.status === 404;
    return (
      <PageError message={notFound ? "Training program not found." : "Content could not be loaded."} />
    );
  }

  const showNumbers = data.display_style === "numbered";
  const cards = (data.cards || []).map((c) => ({
    id: c.id,
    icon: c.icon,
    title: c.title,
    subtitle: c.subtitle,
  }));

  return (
    <main className="w-full">
      <TrainingHeroSection
        category={data.category || ""}
        title={data.title || ""}
        description={data.description || ""}
        highlightedText={data.highlighted_text || ""}
        descriptionEnd={data.description_end || ""}
      />
      <DeliverTrainingSection
        title={data.deliver_section_title || "WHAT WE DELIVER"}
        cards={cards}
        showNumbers={showNumbers}
      />
      <OutcomeTrainingSection tag={data.outcome_tag || ""} title={data.outcome_title || ""} />
    </main>
  );
}
