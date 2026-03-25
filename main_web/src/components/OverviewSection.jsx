export default function OverviewSection({ text, sidebarLabel = "Overview" }) {
  return (
    <section style={{ backgroundColor: "#f3f4f6" }} className="py-14 sm:py-18 md:py-24 lg:py-28">
      <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">
        <div className="grid gap-10 md:grid-cols-12 md:items-start">
          <div className="md:col-span-3 flex items-center gap-4">
            <div className="h-0.75 w-10 shrink-0" style={{ backgroundColor: "#facc15" }} />
            <h2
              className="font-extrabold uppercase tracking-widest"
              style={{ color: "#1a2233", fontSize: "clamp(16px, 1.6vw, 24px)" }}
            >
              {sidebarLabel}
            </h2>
          </div>
          <div className="md:col-span-9">
            <p
              className="font-medium leading-relaxed"
              style={{ color: "#1a2233", fontSize: "clamp(15px, 1.4vw, 20px)" }}
            >
              {text}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
