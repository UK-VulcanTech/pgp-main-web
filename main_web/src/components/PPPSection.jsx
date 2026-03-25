import GridSection from "./ui/GridSection";

export default function PPPSection({ ppp }) {
  const p = ppp || {};
  return (
    <GridSection>
      <div className="text-center ">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-wide text-primary">{p.heading || ""}</h2>
        <p className="mt-6 text-grey leading-relaxed max-w-3xl mx-auto">{p.body || ""}</p>
      </div>
    </GridSection>
  );
}
