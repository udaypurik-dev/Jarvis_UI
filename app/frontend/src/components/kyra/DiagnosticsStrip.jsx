export default function DiagnosticsStrip({ weather }) {
  const items = weather
    ? [
        { k: "GPS", v: weather.coord },
        { k: "CITY", v: weather.city.toUpperCase() },
        { k: "TEMP", v: `${Math.round(weather.temp)}°C` },
        { k: "FEELS", v: `${Math.round(weather.feels)}°C` },
        { k: "COND", v: weather.condition.toUpperCase() },
        { k: "WIND", v: `${Math.round(weather.wind)} KM/H` },
        { k: "PRESSURE", v: `${Math.round(weather.pressure)} HPA` },
        { k: "HUMIDITY", v: `${Math.round(weather.humidity)} %` },
        { k: "ARC CORE", v: "STABLE · 3.14 TW" },
        { k: "REPULSOR", v: "OFFLINE" },
        { k: "TASKS", v: "17 QUEUED" },
      ]
    : [
        { k: "GPS", v: "AWAITING GRANT" },
        { k: "WEATHER", v: "AWAITING GEO" },
        { k: "ARC CORE", v: "STABLE · 3.14 TW" },
        { k: "REPULSOR", v: "OFFLINE" },
        { k: "TASKS", v: "17 QUEUED" },
      ];

  return (
    <div className="mt-5 hud-panel px-5 py-3 relative overflow-hidden" data-testid="diagnostics-strip">
      <span className="corner corner-tl" />
      <span className="corner corner-tr" />
      <span className="corner corner-bl" />
      <span className="corner corner-br" />

      <div className="flex overflow-hidden gap-10">
        <div className="flex gap-10 shrink-0 whitespace-nowrap" style={{ animation: "marquee 45s linear infinite" }}>
          {[...items, ...items].map((it, i) => (
            <div key={i} className="flex items-center gap-2 font-mono text-[0.62rem] tracking-[0.28em] uppercase">
              <span className="text-zinc-500">{it.k}</span>
              <span className="text-[var(--kyra-red)]">{it.v}</span>
              <span className="text-zinc-700">·</span>
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
  );
}
