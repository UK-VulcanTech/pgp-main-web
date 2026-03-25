import GridSection from "./ui/GridSection";

export default function WhoWeServe({ who }) {
  const w = who || {};
  return (
    <GridSection>
      <div className="text-center ">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-wide text-primary">{w.heading || ""}</h2>
        <p className="mt-6 text-grey leading-relaxed max-w-3xl mx-auto">{w.body || ""}</p>
      </div>
    </GridSection>
  );
}
