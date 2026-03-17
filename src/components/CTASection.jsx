import bannerBg from "../assets/images/cta-bg.png";
import Button from "./ui/Button";

const CTASection = () => {
  return (
    <section className="relative bg-[#1E2F3F] py-28 overflow-hidden">
      
      {/* Background Image */}
      <img
        src={bannerBg}
        alt="background"
        className="absolute inset-0 w-full h-100 object-contain opacity-60 rotate-[10.1deg] scale-150"
      />

      {/* Content */}
      <div className="relative z-10 px-6 max-w-4xl mx-auto text-center text-white">
        
        <h2 className="text-4xl md:text-5xl font-semibold tracking-wide">
          READY TO DELIVER
        </h2>

        <p className="mt-6 text-lg text-gray-300 max-w-4xl mx-auto">
          Let’s discuss your partnership goals and the operating model needed
          to achieve them.
        </p>

        <div className="mt-10">
          <Button>
            CONTACT PGP
          </Button>
        </div>

      </div>
    </section>
  );
};

export default CTASection;