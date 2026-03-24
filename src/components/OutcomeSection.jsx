import MeasureImage from "../assets/images/measure-bg.png"; // your image

const OutcomesSection = () => {
  return (
    <section className="bg-[var(--color-secondary)] py-16 px-6 md:px-12 lg:px-20">
      
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
        
        {/* Left Content */}
        <div className="text-center lg:text-left">
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-primary)] mb-6">
            WHAT WE MEASURE
          </h2>

          <h3 className="text-lg md:text-xl font-semibold text-[var(--color-primary)] mb-4">
            Outcome Orientation
          </h3>

          <p className="text-[var(--color-grey)] text-sm md:text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
            We focus on outcomes such as improved service continuity, reliability, 
            operational readiness, capability development, and sustainable performance 
            over the asset lifecycle.
          </p>

          <div className="mt-8 flex justify-center lg:justify-start">
            <button className="bg-[var(--color-primary)] text-white px-6 py-3 rounded-md text-sm md:text-base font-medium hover:opacity-90 transition">
              VIEW SOLUTIONS
            </button>
          </div>

        </div>

        {/* Right Image */}
        <div className="flex justify-center lg:justify-end">
          <img 
            src={MeasureImage}
            alt="What we measure"
            className="w-full max-w-md md:max-w-lg lg:max-w-xl rounded-2xl object-cover"
          />
        </div>

      </div>

    </section>
  );
};

export default OutcomesSection;