import { FiArrowUpRight } from "react-icons/fi";

const SolutionCard = ({ title, desc, image,hoverImage }) => {
  return (
    <div
      className="
        group relative rounded-xl p-6 h-55
        border border-transparent
        bg-gradient-to-br from-[#1f2f3f] to-[#243647]
        text-white
        transition-all duration-300
        group-hover:border-white/20
        hover:shadow-[0_0_0_1px_rgba(234,199,0,0.1)]
        overflow-hidden
        cursor-pointer
      "
    >
      {/* Hover Gradient Overlay */}
      <div
        className="
          absolute inset-0 
          opacity-0 group-hover:opacity-100 
          transition-opacity duration-300
          pointer-events-none
          rounded-xl
          bg-[linear-gradient(135deg,rgba(234,199,0,0.05)_0%,rgba(234,199,0,0)_100%)]
        "
      />

      {/* Yellow bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-xl" />

      {/* Top Right Arrow */}
      <span
        className="
          absolute top-4 right-4 
          p-2 rounded-md
          text-white/30 group-hover:text-white
          transition-all duration-300
          group-hover:bg-[linear-gradient(225deg,rgba(234,199,0,0.1)_0%,rgba(234,199,0,0)_100%)]
          group-hover:text-yellow
        "
      >
        <FiArrowUpRight />
      </span>

      {/* Icon Box */}
      <div
        className="
    relative w-10 h-10 flex items-center justify-center 
    rounded-lg border border-white/20 
    mb-6 
    transition-all duration-300

    group-hover:border-yellow-400/50
    group-hover:bg-yellow-400/10
  "
      >
        {/* Default Image */}
        <img
          src={image}
          alt={title}
          className="
            w-5 h-5 object-contain 
            absolute 
            transition-opacity duration-300
            opacity-100 group-hover:opacity-0
          "
        />

        {/* Hover Image */}
        <img
          src={hoverImage}
          alt={title}
          className="
              w-5 h-5 object-contain 
              absolute 
              transition-opacity duration-300
              opacity-0 group-hover:opacity-100
            "
        />
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold tracking-wide leading-snug">
        {title}
      </h3>

      {/* Description */}
      <p className="text-xs text-white/50 mt-3 leading-relaxed">{desc}</p>
    </div>
  );
};

export default SolutionCard;
