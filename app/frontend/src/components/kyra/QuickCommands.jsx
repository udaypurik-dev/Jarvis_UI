import { Camera, Music, Lock, Sparkles, Search, Rocket, Moon, PhoneCall } from "lucide-react";

const COMMANDS = [
  { id: "scan", label: "Scan Room", icon: Camera, hint: "Environ // LIDAR" },
  { id: "music", label: "Play Music", icon: Music, hint: "AC/DC · WORKSHOP" },
  { id: "lock", label: "Lockdown", icon: Lock, hint: "Perimeter // ARM" },
  { id: "analyze", label: "Analyze", icon: Sparkles, hint: "Deep Neural" },
  { id: "search", label: "Recon", icon: Search, hint: "Search // Global" },
  { id: "deploy", label: "Deploy Suit", icon: Rocket, hint: "MK-VII · READY" },
  { id: "call", label: "Call", icon: PhoneCall, hint: "Contact // Rhodes" },
  { id: "sleep", label: "Standby", icon: Moon, hint: "Agent // Sleep" },
];

export default function QuickCommands({ onFire }) {
  return (
    <div className="hud-panel p-5 relative" data-testid="quick-commands">
      <span className="corner corner-tl" />
      <span className="corner corner-tr" />
      <span className="corner corner-bl" />
      <span className="corner corner-br" />

      <div className="flex items-center justify-between mb-4">
        <h3 className="font-hud text-xs tracking-[0.35em] uppercase text-zinc-300">Rapid Commands</h3>
        <span className="font-mono text-[0.6rem] tracking-widest text-zinc-500">08 / 64 SLOTS</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {COMMANDS.map((c) => (
          <button
            key={c.id}
            onClick={() => onFire?.(c.id)}
            data-testid={`command-${c.id}-btn`}
            className="group relative border border-[var(--kyra-border)] hover:border-[var(--kyra-red)] p-3 text-left transition-colors bg-[rgba(255,59,48,0.02)] hover:bg-[rgba(255,59,48,0.08)]"
          >
            {/* Corner brackets on hover */}
            <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[var(--kyra-red)] opacity-0 group-hover:opacity-100 transition" />
            <span className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[var(--kyra-red)] opacity-0 group-hover:opacity-100 transition" />
            <span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[var(--kyra-red)] opacity-0 group-hover:opacity-100 transition" />
            <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[var(--kyra-red)] opacity-0 group-hover:opacity-100 transition" />

            <c.icon size={16} className="text-[var(--kyra-red)] mb-2 transition-transform group-hover:scale-110" />
            <div className="font-hud text-[0.72rem] tracking-[0.2em] uppercase text-white">{c.label}</div>
            <div className="font-mono text-[0.55rem] tracking-widest text-zinc-500 uppercase mt-0.5">{c.hint}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
