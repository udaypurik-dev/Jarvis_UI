import { useMemo } from "react";

/**
 * Dotted matrix orb — SVG grid of dots arranged on concentric rings.
 * Each dot pulses with its own delay to create a living, breathing matrix.
 */
export default function DottedOrb({ state = "idle" }) {
  const active = state !== "idle";
  const size = 380;
  const cx = size / 2;
  const cy = size / 2;

  const rings = useMemo(() => {
    const out = [];
    const ringCount = 14;
    for (let r = 1; r <= ringCount; r++) {
      const radius = 18 + r * 10;
      const count = Math.max(6, Math.floor(radius * 0.55));
      const dots = [];
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2 + (r % 2 ? 0 : Math.PI / count);
        dots.push({
          x: cx + Math.cos(a) * radius,
          y: cy + Math.sin(a) * radius,
          delay: ((i + r * 3) % count) / count,
          size: r > 10 ? 1.4 : r > 6 ? 1.7 : 2.1,
          intensity: 1 - r / (ringCount + 4),
        });
      }
      out.push({ radius, dots });
    }
    return out;
  }, [cx, cy]);

  return (
    <div className="relative" style={{ width: size, height: size }} data-testid="dotted-orb">
      {/* Outer sonar rings */}
      {active && (
        <>
          <div className="absolute inset-0 border border-[var(--kyra-red)] rounded-full opacity-0 sonar-ring" style={{ animationDelay: "0s" }} />
          <div className="absolute inset-0 border border-[var(--kyra-red)] rounded-full opacity-0 sonar-ring" style={{ animationDelay: "1s" }} />
          <div className="absolute inset-0 border border-[var(--kyra-red)] rounded-full opacity-0 sonar-ring" style={{ animationDelay: "2s" }} />
        </>
      )}

      {/* Radial glow */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(255, 59, 48, ${active ? 0.25 : 0.12}) 0%, rgba(255, 59, 48, 0.05) 40%, transparent 65%)`,
          filter: "blur(4px)",
        }}
      />

      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="relative">
        {/* Faint alignment ring */}
        <circle cx={cx} cy={cy} r={168} stroke="rgba(255,59,48,0.14)" strokeWidth="1" fill="none" strokeDasharray="2 4" />
        <circle cx={cx} cy={cy} r={90} stroke="rgba(255,59,48,0.22)" strokeWidth="1" fill="none" />
        <circle cx={cx} cy={cy} r={42} stroke="rgba(255,59,48,0.5)" strokeWidth="1" fill="none" />

        {/* Crosshairs */}
        <line x1={cx} y1={cy - 175} x2={cx} y2={cy - 155} stroke="rgba(255,59,48,0.6)" strokeWidth="1" />
        <line x1={cx} y1={cy + 175} x2={cx} y2={cy + 155} stroke="rgba(255,59,48,0.6)" strokeWidth="1" />
        <line x1={cx - 175} y1={cy} x2={cx - 155} y2={cy} stroke="rgba(255,59,48,0.6)" strokeWidth="1" />
        <line x1={cx + 175} y1={cy} x2={cx + 155} y2={cy} stroke="rgba(255,59,48,0.6)" strokeWidth="1" />

        {/* Dot matrix */}
        {rings.map((ring, ri) => (
          <g key={ri}>
            {ring.dots.map((d, di) => (
              <circle
                key={di}
                cx={d.x}
                cy={d.y}
                r={d.size}
                fill="#FF3B30"
                style={{
                  transformOrigin: `${d.x}px ${d.y}px`,
                  animation: `dotPulse ${active ? 1.6 : 3.2}s ease-in-out ${d.delay * (active ? 1.6 : 3.2)}s infinite`,
                  "--min": active ? 0.28 : 0.12,
                  opacity: d.intensity * (active ? 1 : 0.7),
                }}
              />
            ))}
          </g>
        ))}

        {/* Core reactor */}
        <g>
          <circle cx={cx} cy={cy} r={22} fill="rgba(255,59,48,0.15)" />
          <circle cx={cx} cy={cy} r={12} fill="rgba(255,59,48,0.35)" />
          <circle cx={cx} cy={cy} r={5} fill="#fff" style={{ filter: "drop-shadow(0 0 6px #FF3B30)" }} />
        </g>

        {/* Rotating labels */}
        <g style={{ transformOrigin: `${cx}px ${cy}px`, animation: "spin 40s linear infinite" }}>
          <text x={cx} y={cy - 152} textAnchor="middle" fill="rgba(255,59,48,0.7)" fontSize="9" fontFamily="JetBrains Mono" letterSpacing="4">
            NEURAL CORE // ACTIVE
          </text>
          <text x={cx} y={cy + 160} textAnchor="middle" fill="rgba(255,59,48,0.55)" fontSize="8" fontFamily="JetBrains Mono" letterSpacing="4">
            SYS.CORE 0x0A3F · MK-VII
          </text>
        </g>
      </svg>

      <style>{`@keyframes spin { from { transform: rotate(0); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
