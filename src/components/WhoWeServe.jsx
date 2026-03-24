import GridSection from "./ui/GridSection";

const WhoWeServe = () => {
  return (
    <GridSection>
      <div className="text-center ">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-wide text-primary">
          WHO WE SERVE
        </h2>

        <p className="mt-6 text-grey leading-relaxed max-w-3xl mx-auto">
          We work with government entities, private operators, investors, and
          community stakeholders delivering programs in essential infrastructure
          and technology-enabled services.
        </p>
      </div>
    </GridSection>
  );
};

export default WhoWeServe;
