"use client";
import { useEffect, useState } from "react";

const SCENARIOS = [
  { station: "Shell · 2847 Main St",    gal: 12.4, price: 3.42, ev: 8.12 },
  { station: "Chevron · 1205 Oak Ave",  gal: 10.8, price: 3.65, ev: 7.22 },
  { station: "BP · I-95 Exit 42",       gal: 14.2, price: 3.38, ev: 9.48 },
  { station: "Exxon · 544 Park Blvd",   gal: 11.6, price: 3.71, ev: 7.74 },
  { station: "Valero · 3312 Elm Rd",    gal: 13.1, price: 3.55, ev: 8.76 },
];

const LINE_MS = 130;

function Row({ l, r, dim, bold, green, red }: { l: string; r: string; dim?: boolean; bold?: boolean; green?: boolean; red?: boolean }) {
  const cls = green
    ? "text-[#2a8a50] font-semibold"
    : red
    ? "text-[#b94020] font-bold"
    : bold
    ? "text-[#1a1814] font-bold"
    : dim
    ? "text-[#8a8270]"
    : "text-[#3d3a30]";
  return (
    <div className={`flex justify-between text-[11px] leading-relaxed ${cls}`}>
      <span>{l}</span>
      <span className="tabular-nums">{r}</span>
    </div>
  );
}

function Perf() {
  return (
    <div className="flex justify-around px-3 py-1.5">
      {Array.from({ length: 22 }).map((_, i) => (
        <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#d8d4c8]" />
      ))}
    </div>
  );
}

export function LiveReceipt() {
  const [si, setSi]           = useState(0);
  const [revealed, setRevealed] = useState(0);
  const [stamp, setStamp]     = useState(false);
  const [fading, setFading]   = useState(false);

  const sc   = SCENARIOS[si];
  const sub  = parseFloat((sc.gal * sc.price).toFixed(2));
  const tax  = parseFloat((sub * 0.075).toFixed(2));
  const tot  = parseFloat((sub + tax).toFixed(2));
  const over = parseFloat((tot - sc.ev).toFixed(2));

  const lines = [
    <div key="head" className="text-center text-[11px] font-bold tracking-widest uppercase text-[#3d3a30] pb-0.5">{sc.station}</div>,
    <div key="d1"   className="border-t border-dashed border-[#ccc9bb] my-0.5" />,
    <Row key="r1" l="Unleaded 87"           r={`${sc.gal} gal`} />,
    <Row key="r2" l={`@ $${sc.price}/gal`} r={`$${sub.toFixed(2)}`} dim />,
    <Row key="r3" l="State fuel tax"        r={`$${tax.toFixed(2)}`} dim />,
    <div key="d2"   className="border-t-2 border-[#bbb8aa] my-1" />,
    <Row key="tot" l="TOTAL"                r={`$${tot.toFixed(2)}`} bold />,
    <div key="sp"   className="pt-1" />,
    <Row key="ev"  l="⚡ Same miles, EV"    r={`$${sc.ev.toFixed(2)}`} green />,
    <Row key="ov"  l="You overpaid"         r={`$${over.toFixed(2)}`} red />,
  ];

  // Print lines one by one
  useEffect(() => {
    if (revealed >= lines.length) return;
    const t = setTimeout(() => setRevealed((r) => r + 1), revealed === 0 ? 400 : LINE_MS);
    return () => clearTimeout(t);
  }, [revealed, lines.length]);

  // Show stamp after last line
  useEffect(() => {
    if (revealed < lines.length) return;
    const t = setTimeout(() => setStamp(true), 300);
    return () => clearTimeout(t);
  }, [revealed, lines.length]);

  // Cycle after stamp
  useEffect(() => {
    if (!stamp) return;
    const t = setTimeout(() => {
      setFading(true);
      setTimeout(() => {
        setSi((i) => (i + 1) % SCENARIOS.length);
        setRevealed(0);
        setStamp(false);
        setFading(false);
      }, 650);
    }, 2400);
    return () => clearTimeout(t);
  }, [stamp]);

  return (
    <div className="bg-ink rounded-3xl overflow-hidden border border-white/10 shadow-2">
      {/* Accent line */}
      <div className="h-0.5 bg-gradient-to-r from-forest via-emerald to-forest" />

      {/* Header */}
      <div className="px-5 py-3.5 border-b border-white/8 flex items-center justify-between">
        <div className="font-mono text-[10px] uppercase tracking-widest text-cream/40">Your next fill-up</div>
        <div className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
      </div>

      {/* Receipt paper */}
      <div className="px-5 py-4">
        <div
          className="rounded-xl overflow-hidden"
          style={{
            background: "#f5f2ec",
            fontFamily: '"Courier New", Courier, monospace',
            opacity: fading ? 0 : 1,
            transition: "opacity 0.6s ease",
          }}
        >
          <Perf />
          <div className="px-5 py-4 space-y-1.5 min-h-[220px]">
            {lines.map((line, i) => (
              <div
                key={i}
                style={{
                  opacity:   i < revealed ? 1 : 0,
                  transform: i < revealed ? "translateY(0)" : "translateY(5px)",
                  transition: "opacity 0.18s ease, transform 0.18s ease",
                }}
              >
                {line}
              </div>
            ))}

            {stamp && (
              <div className="flex justify-center pt-3">
                <div
                  className="border-[3px] border-[#b94020] rounded px-6 py-1.5 text-[#b94020] font-black text-lg tracking-[.2em] uppercase"
                  style={{ animation: "stampIn 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards" }}
                >
                  OUCH.
                </div>
              </div>
            )}
          </div>
          <Perf />
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white/4 border-t border-white/8 px-5 py-3 flex items-center justify-between">
        <div className="font-mono text-[9px] text-cream/25">national avg · 13,500 mi/yr</div>
        <div className="font-mono text-[9px] text-emerald/60 flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-emerald animate-pulse inline-block" />
          live
        </div>
      </div>
    </div>
  );
}
