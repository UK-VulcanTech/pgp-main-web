export default function SolutionsHeroSection({ label, titleBlack1, titleBlack2, titleYellow }) {
  return (
    <section className="relative w-full overflow-hidden" style={{ backgroundColor: "#f3f4f6" }}>

      {/* ── Layer 1: Grid background ───────────────────────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(180,180,180,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(180,180,180,0.25) 1px, transparent 1px)",
          backgroundSize: "60px 60px", /* ← grid cell size */
        }}
      />

      {/* ── Layer 2: Decorative blurred ellipse ───────────────────────── */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "907px",
          height: "499px",
          top: "50%",
          transform: "translate(-50%, -50%)",
          left: "50%",
          borderRadius: "50%",
          background: "radial-gradient(ellipse at center, rgba(255,255,255,0.45) 0%, transparent 70%)",
          filter: "blur(40px)",
          zIndex: 1,
        }}
      />

      {/* ── Layer 3: Content ──────────────────────────────────────────── */}
      <div
        className="relative z-10 flex items-center justify-center"
        style={{
          minHeight: "60vh",          /* ← hero section height */
          paddingTop: "30px",          /* ← top padding (navbar offset) */
          paddingBottom: "80px",       /* ← bottom padding */
          paddingLeft: "24px",
          paddingRight: "24px",
        }}
      >
        <div className="w-full max-w-5xl text-center"> {/* ← max-w-5xl = max content width */}

          {/* Label row */}
          <div
            className="flex items-center justify-center"
            style={{ gap: "12px", marginBottom: "48px" }} /* ← marginBottom = label → heading gap */
          >
            <div style={{ height: "3px", width: "36px", backgroundColor: "#facc15" }} />  
            <span
              className="font-semibold uppercase"
              style={{ color: "#1a2233", fontSize: "13px", letterSpacing: "0.2em" }}  /* ← label font size */
            >
              {label}
            </span>
          </div>

          {/* Main heading */}
          <h1
            className="font-black uppercase leading-none tracking-tight"
            style={{
              color: "#1a2233",
              fontSize: "clamp(36px, 7vw, 96px)", /* ← clamp(min, fluid, max) */
            }}
          >
            <span>{titleBlack1}</span>
            <br />
            <span>{titleBlack2}</span>
            <span style={{ color: "#facc15" }}>{titleYellow}</span>
          </h1>

        </div>
      </div>
    </section>
  );
}
