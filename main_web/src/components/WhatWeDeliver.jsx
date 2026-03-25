import { useState, useEffect } from "react";

export default function WhatWeDeliver({ items }) {
  const [visible, setVisible] = useState([]);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    setVisible([]);
    items.forEach((_, i) => {
      setTimeout(() => {
        setVisible((prev) => [...prev, i]);
      }, 200 + i * 150);
    });
  }, [items]);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10 sm:px-8 sm:py-16"
      style={{ background: "linear-gradient(135deg, #1a2233 0%, #1e2a3a 50%, #16202e 100%)" }}
    >
      <div className="w-full max-w-3xl">
        {/* Title */}
        <h1
          className="font-extrabold uppercase tracking-widest mb-8 sm:mb-12"
          style={{ color: "#e8edf5", fontSize: "clamp(28px, 4vw, 52px)" }}
        >
          WHAT WE{" "}
          <span style={{ color: "#facc15" }}>DELIVER</span>
        </h1>

        {/* Items */}
        <div className="flex flex-col">
          {items.map((item, i) => {
            const isHovered = hovered === i;
            return (
              <div
                key={item.id}
                className={`flex flex-row items-stretch gap-4 sm:gap-6 cursor-pointer transition-all duration-500 ${
                  visible.includes(i) ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-5"
                }`}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Circle + connector */}
                <div className="flex flex-col items-center shrink-0 w-10 sm:w-12">
                  <div
                    className="flex items-center justify-center rounded-full w-9 h-9 sm:w-11 sm:h-11 shrink-0 border-2 transition-all duration-300"
                    style={{
                      borderColor: isHovered ? "#facc15" : "#475569",
                      boxShadow: isHovered ? "0 0 14px rgba(250,204,21,0.35)" : "none",
                    }}
                  >
                    <span
                      className="font-bold text-xs sm:text-sm tracking-wide transition-colors duration-300"
                      style={{ color: isHovered ? "#facc15" : "#64748b" }}
                    >
                      {item.id}
                    </span>
                  </div>
                  {i < items.length - 1 && (
                    <div
                      className="w-px flex-1 my-1 transition-all duration-300"
                      style={{
                        background: isHovered
                          ? "linear-gradient(to bottom, #facc15, #2a3a50)"
                          : "linear-gradient(to bottom, #3a4a5e, #2a3a50)",
                      }}
                    />
                  )}
                </div>

                {/* Text */}
                <div
                  className="flex-1 flex items-center mb-3 sm:mb-5 rounded-xl px-3 py-2 sm:px-5 sm:py-3 transition-all duration-300"
                  style={{ background: isHovered ? "rgba(255,255,255,0.06)" : "transparent" }}
                >
                  <p
                    className="leading-snug m-0 text-sm sm:text-base font-semibold transition-colors duration-300"
                    style={{ color: isHovered ? "#facc15" : "#64748b" }}
                  >
                    {item.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
