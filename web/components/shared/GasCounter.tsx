"use client";
import { useEffect, useState } from "react";

const GAS_PER_MS  = 1641 / 365 / 24 / 3600 / 1000;
const EV_PER_MS   =  741 / 365 / 24 / 3600 / 1000;

export function GasCounter() {
  const [ms, setMs] = useState(0);

  useEffect(() => {
    const t0 = Date.now();
    const id = setInterval(() => setMs(Date.now() - t0), 50);
    return () => clearInterval(id);
  }, []);

  const gas = ms * GAS_PER_MS;
  const ev  = ms * EV_PER_MS;

  const fmt = (n: number) => {
    const d = Math.floor(n);
    const c = Math.floor((n % 1) * 100).toString().padStart(2, "0");
    const t = Math.floor((n * 1000) % 10);
    return { d, c, t };
  };

  const g = fmt(gas);
  const e = fmt(ev);

  return (
    <div className="bg-ink rounded-3xl border border-white/8 overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-5 pb-3 border-b border-white/8">
        <div className="font-mono text-[9px] uppercase tracking-widest text-cream/30">
          fuel cost · running since page load
        </div>
      </div>

      {/* Gas row */}
      <div className="px-6 py-5 border-b border-white/8">
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#e07050]">⛽ Gas (RAV4)</span>
          <span className="font-mono text-[9px] text-cream/25">$1,641 / yr avg</span>
        </div>
        <div className="flex items-end gap-0.5">
          <span className="font-mono text-lg text-[#e07050]/60 mb-1">$</span>
          <span
            className="font-mono font-bold text-[#ffaa66] tabular-nums"
            style={{ fontSize: "clamp(36px, 6vw, 56px)", lineHeight: 1, letterSpacing: "-0.02em" }}
          >
            {g.d.toString().padStart(2, "0")}.{g.c}
          </span>
          <span className="font-mono text-xl text-[#ffaa66]/40 mb-1">{g.t}</span>
        </div>
      </div>

      {/* EV row */}
      <div className="px-6 py-5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-mono text-[10px] uppercase tracking-widest text-emerald">⚡ Electric (Model Y)</span>
          <span className="font-mono text-[9px] text-cream/25">$741 / yr avg</span>
        </div>
        <div className="flex items-end gap-0.5">
          <span className="font-mono text-lg text-emerald/50 mb-1">$</span>
          <span
            className="font-mono font-bold text-emerald tabular-nums"
            style={{ fontSize: "clamp(36px, 6vw, 56px)", lineHeight: 1, letterSpacing: "-0.02em" }}
          >
            {e.d.toString().padStart(2, "0")}.{e.c}
          </span>
          <span className="font-mono text-xl text-emerald/40 mb-1">{e.t}</span>
        </div>
      </div>

      {/* Footer note */}
      <div className="px-6 pb-4">
        <div className="font-mono text-[9px] text-cream/20 text-center">
          national avg · 13,500 mi/yr · 80% home charging
        </div>
      </div>
    </div>
  );
}
