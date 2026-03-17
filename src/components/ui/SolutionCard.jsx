const SolutionCard = ({ title, desc, icon: Icon }) => {
  return (
    <div
      className="
        group relative rounded-xl p-6 h-55
        border border-white/10
        bg-gradient-to-br from-[#1f2f3f] to-[#243647]
        text-white
        transition-all duration-300
        hover:border-white/20
        overflow-hidden
        cursor-pointer
      "
    >
      {/* Yellow bottom accent on hover */}
      <div className="absolute bottom-0 left-0 right-0 h-0.75 bg-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-xl" />

      {/* Top Right Arrow */}
      <span className="absolute top-4 right-4 text-white/30 group-hover:text-white/60 transition-colors duration-300">
        ↗
      </span>

      {/* Icon Box */}
      <div className="w-10 h-10 flex items-center justify-center rounded-lg border border-white/20 group-hover:border-yellow-400/50 mb-6 text-white/70 group-hover:text-yellow-400 transition-all duration-300">
        {Icon && <Icon size={18} />}
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold tracking-wide leading-snug">
        {title}
      </h3>

      {/* Description */}
      <p className="text-xs text-white/50 mt-3 leading-relaxed">
        {desc}
      </p>
    </div>
  );
};

export default SolutionCard;
