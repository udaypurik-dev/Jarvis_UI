import { useEffect, useState } from "react";

const LINES = [
  "> INITIALIZING J.A.R.V.I.S OS · MK-VII ...",
  "> Loading neural cortex modules ....... OK",
  "> Handshake with arc core .............. OK",
  "> Voice interface online ............... OK",
  "> Ready.",
];

export default function BootOverlay() {
  const [visible, setVisible] = useState(LINES.map(() => false));

  useEffect(() => {
    LINES.forEach((_, i) => {
      setTimeout(() => {
        setVisible((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, 200 + i * 280);
    });
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 bg-[#050505] flex items-center justify-center"
      data-testid="boot-overlay"
      style={{ animation: "fadeOut 0.5s ease 1.4s forwards" }}
    >
      <div className="font-mono text-[0.8rem] leading-relaxed tracking-wide text-[var(--kyra-red)]">
        {LINES.map((line, i) => (
          <div
            key={i}
            style={{
              opacity: visible[i] ? 1 : 0,
              transition: "opacity 0.2s ease",
            }}
          >
            {line}
          </div>
        ))}
      </div>
      <style>{`@keyframes fadeOut { to { opacity: 0; pointer-events: none; } }`}</style>
    </div>
  );
}