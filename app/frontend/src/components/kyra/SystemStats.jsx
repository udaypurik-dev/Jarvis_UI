import { useEffect, useState } from "react";
import { Cpu, HardDrive, Zap, Thermometer, Radar } from "lucide-react";

function useJitter(base, variance = 6) {
  const [v, setV] = useState(base);
  useEffect(() => {
    const id = setInterval(() => {
      setV(Math.max(2, Math.min(99, base + (Math.random() - 0.5) * variance * 2)));
    }, 1200);
    return () => clearInterval(id);
  }, [base, variance]);
  return v;
}

function Gauge({ label, value, unit, icon: Icon }) {
  const size = 96;
  const stroke = 5;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="flex items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,59,48,0.15)" strokeWidth={stroke} fill="none" />
          <circle
            cx={size / 2} cy={size / 2} r={r}
            stroke="#FF3B30" strokeWidth={stroke} fill="none"
            strokeDasharray={c} strokeDashoffset={offset}
            strokeLinecap="butt"
            style={{ transition: "stroke-dashoffset 1s ease", filter: "drop-shadow(0 0 4px rgba(255,59,48,0.6))" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Icon size={12} className="text-[var(--kyra-red)] mb-0.5" />
          <span className="font-hud text-lg text-white leading-none">{Math.round(value)}</span>
          <span className="font-mono text-[0.55rem] tracking-widest text-zinc-500 uppercase">{unit}</span>
        </div>
      </div>
      <div className="flex-1">
        <div className="font-hud text-[0.68rem] tracking-[0.3em] uppercase text-zinc-400">{label}</div>
        <div className="mt-1 h-1 bg-[rgba(255,59,48,0.1)] relative overflow-hidden">
          <div className="h-full bg-[var(--kyra-red)]" style={{ width: `${value}%`, transition: "width 800ms ease", boxShadow: "0 0 8px #FF3B30" }} />
        </div>
        <div className="mt-1 flex justify-between font-mono text-[0.55rem] tracking-widest text-zinc-500 uppercase">
          <span>min 00</span>
          <span>max 100</span>
        </div>
      </div>
    </div>
  );
}

export default function SystemStats() {
  const cpu = useJitter(42, 12);
  const ram = useJitter(63, 6);
  const power = useJitter(88, 4);
  const temp = useJitter(37, 3);

  return (
    <>
      <div className="hud-panel p-5 relative" data-testid="system-stats">
        <span className="corner corner-tl" />
        <span className="corner corner-tr" />
        <span className="corner corner-bl" />
        <span className="corner corner-br" />

        <div className="flex items-center justify-between mb-4">
          <h3 className="font-hud text-xs tracking-[0.35em] uppercase text-zinc-300">Diagnostics</h3>
          <span className="font-mono text-[0.6rem] tracking-widest text-[var(--kyra-red)]">● LIVE</span>
        </div>

        <div className="flex flex-col gap-5">
          <Gauge label="Processor" value={cpu} unit="CPU %" icon={Cpu} />
          <Gauge label="Memory" value={ram} unit="RAM %" icon={HardDrive} />
          <Gauge label="Power Core" value={power} unit="ARC %" icon={Zap} />
          <Gauge label="Core Temp" value={temp} unit="°C" icon={Thermometer} />
        </div>
      </div>

      <NetworkPanel />

      <SentryPanel />
    </>
  );
}

function NetworkPanel() {
  const ping = useJitter(12, 3);
  const uplink = useJitter(84, 8);
  return (
    <div className="hud-panel p-5 relative" data-testid="network-panel">
      <span className="corner corner-tl" />
      <span className="corner corner-tr" />
      <span className="corner corner-bl" />
      <span className="corner corner-br" />
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-hud text-xs tracking-[0.35em] uppercase text-zinc-300">Network</h3>
        <Radar size={12} className="text-[var(--kyra-red)]" />
      </div>
      <div className="grid grid-cols-2 gap-3 font-mono text-[0.7rem]">
        <div>
          <div className="text-zinc-500 uppercase tracking-widest text-[0.55rem]">Latency</div>
          <div className="text-white text-base font-hud">{Math.round(ping)}<span className="text-zinc-500 text-xs ml-1">ms</span></div>
        </div>
        <div>
          <div className="text-zinc-500 uppercase tracking-widest text-[0.55rem]">Uplink</div>
          <div className="text-white text-base font-hud">{Math.round(uplink)}<span className="text-zinc-500 text-xs ml-1">%</span></div>
        </div>
        <div className="col-span-2">
          <div className="text-zinc-500 uppercase tracking-widest text-[0.55rem]">Encrypted Channel</div>
          <div className="mt-1 flex gap-0.5 h-4 items-end">
            {Array.from({ length: 32 }).map((_, i) => (
              <div key={i} className="flex-1 bg-[var(--kyra-red)]"
                style={{ height: `${20 + ((i * 13) % 80)}%`, opacity: 0.35 + ((i * 7) % 65) / 100 }} />
            ))}
          </div>
          <div className="mt-1 font-mono text-[0.55rem] tracking-widest text-zinc-500 uppercase">
            AES-256 · HANDSHAKE OK · NODE 0xF14
          </div>
        </div>
      </div>
    </div>
  );
}

function SentryPanel() {
  return (
    <div className="hud-panel p-5 relative" data-testid="sentry-panel">
      <span className="corner corner-tl" />
      <span className="corner corner-tr" />
      <span className="corner corner-bl" />
      <span className="corner corner-br" />
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-hud text-xs tracking-[0.35em] uppercase text-zinc-300">Sentry</h3>
        <span className="font-mono text-[0.6rem] tracking-widest text-[var(--kyra-red)]">ARMED</span>
      </div>
      <div className="space-y-2 font-mono text-[0.65rem] text-zinc-400">
        <Row label="Perimeter" value="SECURE" ok />
        <Row label="Threats" value="0 / DAY" ok />
        <Row label="Auth attempts" value="14 · 0 FAIL" ok />
        <Row label="Firewall" value="MK-VII / ACTIVE" ok />
        <Row label="Last scan" value="00:00:07 AGO" ok />
      </div>
    </div>
  );
}

function Row({ label, value, ok }) {
  return (
    <div className="flex items-center justify-between border-b border-[var(--kyra-border)] pb-1.5">
      <span className="uppercase tracking-widest text-[0.55rem] text-zinc-500">{label}</span>
      <span className={`font-hud tracking-widest ${ok ? "text-[var(--kyra-red)]" : "text-zinc-400"}`}>{value}</span>
    </div>
  );
}
