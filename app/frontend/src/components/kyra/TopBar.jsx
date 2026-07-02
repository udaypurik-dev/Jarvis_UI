import { useEffect, useState } from "react";
import { Cloud, MapPin, Radio, ShieldCheck, Wifi, RefreshCw } from "lucide-react";

export default function TopBar({ agentState = "idle", weather, locError, onRetryLocation }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  const dateStr = now.toDateString().toUpperCase();

  return (
    <header className="hud-panel px-5 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3" data-testid="topbar">
      <span className="corner corner-tl" />
      <span className="corner corner-tr" />
      <span className="corner corner-bl" />
      <span className="corner corner-br" />

      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="h-9 w-9 border border-[var(--kyra-red)] rotate-45 grid place-items-center">
            <div className="h-3 w-3 bg-[var(--kyra-red)] red-pulse" />
          </div>
        </div>
        <div className="leading-tight">
          <h1 className="font-hud text-lg tracking-[0.32em] text-white">J.A.R.V.I.S</h1>
          <p className="font-mono text-[0.6rem] tracking-[0.28em] uppercase text-zinc-500">
            Just A Rather Very Intelligent System
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 font-mono">
        <div className="text-4xl font-hud tracking-[0.25em] text-white" data-testid="hud-time">
          {hh}:{mm}<span className="text-[var(--kyra-red)] blink">:</span>{ss}
        </div>
        <div className="hidden md:block h-8 w-px bg-[var(--kyra-border)]" />
        <div className="hidden md:flex flex-col text-[0.62rem] tracking-[0.3em] uppercase text-zinc-500">
          <span>{dateStr}</span>
          <span>Local Time</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {weather ? (
          <div className="flex items-center gap-2 border border-[var(--kyra-border)] px-3 py-1.5" data-testid="weather-widget">
            <Cloud size={14} className="text-[var(--kyra-red)]" />
            <div className="leading-tight font-mono">
              <div className="text-[0.75rem] text-white">{Math.round(weather.temp)}°C · {weather.condition}</div>
              <div className="text-[0.58rem] tracking-[0.25em] uppercase text-zinc-500 flex items-center gap-1">
                <MapPin size={9} /> {weather.city} · {weather.coord}
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={onRetryLocation}
            className="flex items-center gap-2 border border-[var(--kyra-border)] px-3 py-1.5 hover:border-[var(--kyra-red)] transition"
            data-testid="request-location-btn"
          >
            <RefreshCw size={12} className="text-[var(--kyra-red)]" />
            <div className="leading-tight font-mono text-left">
              <div className="text-[0.72rem] text-white">
                {locError ? "Retry location" : "Locating..."}
              </div>
              <div className="text-[0.55rem] tracking-widest uppercase text-zinc-500">
                {locError ? "grant permission" : "browser geolocation"}
              </div>
            </div>
          </button>
        )}

        <div className="hidden sm:flex items-center gap-3 text-zinc-500">
          <StatusPill icon={Wifi} label="LINK" active />
          <StatusPill icon={Radio} label={agentState === "idle" ? "STDBY" : "LIVE"} active={agentState !== "idle"} />
          <StatusPill icon={ShieldCheck} label="SEC" active />
        </div>
      </div>
    </header>
  );
}

function StatusPill({ icon: Icon, label, active }) {
  return (
    <div className={`flex items-center gap-1.5 border px-2 py-1 font-hud text-[0.6rem] tracking-[0.3em] ${active ? "border-[var(--kyra-red)] text-[var(--kyra-red)]" : "border-[var(--kyra-border)] text-zinc-500"}`}>
      <Icon size={11} />
      {label}
    </div>
  );
}
