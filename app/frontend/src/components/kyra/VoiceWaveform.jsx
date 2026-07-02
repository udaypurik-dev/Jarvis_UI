import { useEffect, useState } from "react";
import { Mic, MicOff, Volume2 } from "lucide-react";

const BAR_COUNT = 48;

export default function VoiceWaveform({ active, muted, onMicToggle, onMute, state }) {
  const [bars, setBars] = useState(() => Array.from({ length: BAR_COUNT }, () => 0.2 + Math.random() * 0.4));

  useEffect(() => {
    const id = setInterval(() => {
      setBars((prev) =>
        prev.map((_, i) => {
          if (!active) return 0.1 + Math.random() * 0.12;
          const t = Date.now() / 220;
          const wave = Math.sin(i * 0.35 + t) * 0.4 + Math.sin(i * 0.11 + t * 1.7) * 0.35;
          return Math.max(0.08, Math.min(1, 0.55 + wave + (Math.random() - 0.5) * 0.15));
        })
      );
    }, 80);
    return () => clearInterval(id);
  }, [active]);

  const label =
    state === "listening" ? "listening..." :
    state === "thinking" ? "processing..." :
    state === "speaking" ? "speaking..." : "tap mic";

  return (
    <div className="w-full flex flex-col items-center" data-testid="voice-waveform">
      <div className="w-full flex items-end justify-center gap-[3px] h-16">
        {bars.map((h, i) => (
          <span
            key={i}
            className="w-1.5 bg-[var(--kyra-red)]"
            style={{
              height: `${h * 100}%`,
              opacity: 0.35 + h * 0.65,
              boxShadow: active ? "0 0 6px rgba(255,59,48,0.7)" : "none",
              transition: "height 90ms ease",
            }}
          />
        ))}
      </div>

      <div className="mt-5 flex items-center gap-4">
        <button
          onClick={onMute}
          className={`hud-btn ${muted ? "!border-[var(--kyra-red)] !text-[var(--kyra-red)]" : ""}`}
          data-testid="mute-toggle-btn"
        >
          {muted ? <MicOff size={13} /> : <Volume2 size={13} />}
          {muted ? "muted" : "audio on"}
        </button>

        <button
          onClick={onMicToggle}
          className="relative h-20 w-20 rounded-full border-2 border-[var(--kyra-red)] flex items-center justify-center hover:scale-105 transition-transform group"
          data-testid="mic-toggle-btn"
          title="Tap to talk"
        >
          <span className={`absolute inset-0 rounded-full ${state === "listening" ? "red-pulse" : ""}`} />
          <span className="absolute inset-1 rounded-full bg-[var(--kyra-red)]/10 group-hover:bg-[var(--kyra-red)]/20 transition" />
          <Mic size={26} className="text-[var(--kyra-red)] relative z-10" />

          <svg className="absolute -inset-3" viewBox="0 0 100 100" style={{ animation: "spinCW 12s linear infinite" }}>
            <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,59,48,0.5)" strokeWidth="0.6" strokeDasharray="2 4" />
          </svg>
        </button>

        <div className="hud-btn !cursor-default select-none">
          <span className={`h-1.5 w-1.5 ${active ? "bg-[var(--kyra-red)] red-pulse" : "bg-zinc-600"}`} />
          {label}
        </div>
      </div>

      <style>{`@keyframes spinCW { from { transform: rotate(0);} to { transform: rotate(360deg);} }`}</style>
    </div>
  );
}
