const GridSection = ({
  children,
  className = "",
  containerClass = "",
  gridSize = 40,
  bgColor = "#EDECEB",
  lineColor = "rgba(43,43,43,0.1)",
  lineWidth = 1,
  paddingY = "py-24",
}) => {
  return (
    <section
      className={`${paddingY} ${className}`}
      style={{
        backgroundColor: bgColor,
        backgroundImage: `
          linear-gradient(to right, ${lineColor} ${lineWidth}px, transparent ${lineWidth}px),
          linear-gradient(to bottom, ${lineColor} ${lineWidth}px, transparent ${lineWidth}px)
        `,
        backgroundSize: `${gridSize}px ${gridSize}px`,
        backgroundPosition: "0 0",
      }}
    >
      <div className={`px-6 max-w-5xl mx-auto ${containerClass}`}>
        {children}
      </div>
    </section>
  );
};

export default GridSection;