export default function WhatPGPDelivers({ block }) {
  const b = block || {};
  const items = b.pillars || [];

  return (
    <section className="bg-[#F3F2F2] px-12 py-16 md:py-20 ">
      <div className="max-w-full mx-auto px-8 sm:px-14 ">
        <h2 className="text-xl md:text-4xl xl:text-5xl font-bold text-[#0d1f35] uppercase tracking-tight mb-14">
          {b.title || ""}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3">
          {items.map((item, index) => (
            <div
              key={`${item.title}-${index}`}
              className={`py-4 md:py-0 ${
                index !== items.length - 1
                  ? "border-b md:border-b-0 md:border-r border-gray-300 md:pr-12"
                  : ""
              } ${index !== 0 ? "md:pl-12" : ""}`}
            >
              <h3 className="text-2xl font-bold text-[#0d1f35] uppercase tracking-[0.12em] leading-snug mb-4">
                {item.title}
              </h3>
              <p className="text-[#666] text-lg font-regular leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
