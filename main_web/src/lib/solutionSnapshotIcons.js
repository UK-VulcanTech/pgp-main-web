/**
 * Local fallbacks when CMS snapshot cards have no `image` / `hover_image` yet.
 * Matches legacy `Solutions.js` / seed order.
 */
import agriculture from "../assets/icons/agriculture.png";
import brightness from "../assets/icons/brightness-icon.png";
import capital from "../assets/icons/capital-icon.png";
import drop from "../assets/icons/drop-icon.png";
import energy from "../assets/icons/energy-icon.png";
import healthcare from "../assets/icons/healthcare.png";
import realEstate from "../assets/icons/real-estate.png";
import tech from "../assets/icons/tech.png";
import training from "../assets/icons/trainings-icon.png";
import transport from "../assets/icons/transport.png";
import waste from "../assets/icons/waste.png";
import energyHover from "../assets/icons/energyHover.png";
import brightnessHover from "../assets/icons/brightnessHover.png";
import dropHover from "../assets/icons/dropHover.png";
import wasteHover from "../assets/icons/wasteHover.png";
import transportHover from "../assets/icons/transportHover.png";
import agricultureHover from "../assets/icons/agricultureHOVER.png";
import techHover from "../assets/icons/techHover.png";
import healthcareHover from "../assets/icons/healthHover.png";
import realEstateHover from "../assets/icons/realEstateHover.png";
import trainingHover from "../assets/icons/trainingHover.png";
import capitalHover from "../assets/icons/capitalHover.png";

const FALLBACK_BY_TITLE = {
  "ENERGY INFRASTRUCTURE": { image: energy, hoverImage: energyHover },
  RENEWABLES: { image: brightness, hoverImage: brightnessHover },
  "WATER & SANITATION": { image: drop, hoverImage: dropHover },
  "WASTE & RECYCLING": { image: waste, hoverImage: wasteHover },
  TRANSPORTATION: { image: transport, hoverImage: transportHover },
  "AGRICULTURE & AGRIBUSINESS": { image: agriculture, hoverImage: agricultureHover },
  TECHNOLOGY: { image: tech, hoverImage: techHover },
  HEALTHCARE: { image: healthcare, hoverImage: healthcareHover },
  "REAL ESTATE": { image: realEstate, hoverImage: realEstateHover },
  "TRAINING & SKILLS TRANSFER": { image: training, hoverImage: trainingHover },
  "CAPITAL ACCESS": { image: capital, hoverImage: capitalHover },
};

export function getSnapshotIconFallback(title) {
  if (!title || typeof title !== "string") return null;
  const k = title.trim().toUpperCase();
  return FALLBACK_BY_TITLE[k] || null;
}
