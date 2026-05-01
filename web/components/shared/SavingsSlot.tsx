"use client";
import { useEffect, useState } from "react";

const COMBOS = [
  { ev: "Model Y LR",       state: "California",  saving: "$1,847" },
  { ev: "Ioniq 6 SE",       state: "Texas",       saving: "$1,203" },
  { ev: "F-150 Lightning",  state: "New York",    saving: "$1,654" },
  { ev: "Kia EV6 Wind",     state: "Florida",     saving: "$891"   },
  { ev: "Chevy Equinox EV", state: "Washington",  saving: "$1,312" },
  { ev: "VW ID.4 Pro",      state: "Colorado",    saving: "$1,141" },
  { ev: "Model 3 LR AWD",   state: "Illinois",    saving: "$1,089" },
  { ev: "Lucid Air GT",     state: "Arizona",     saving: "$1,490" },
];

const FACTS = [
  "EVs have ~20 moving parts vs 2,000+ in a gas engine",
  "The avg EV owner spends $900 less on fuel every year",
  "90% of EV charging happens at home — overnight",
  "Brake pads last 2× longer thanks to regenerative braking",
  "EVs retain ~80% of battery capacity after 200,000 miles",
  "Electricity prices are 3× more stable than gasoline",
  "The Model Y is the world's best-selling car — any kind",
  "A full charge costs less than a large pizza in most states",
];

// Rolling phase: 5 × 30ms = 150ms of visible name flips, then settled for 700ms
const ROLL_STEPS   = 5;
const ROLL_STEP_MS = 30;
const SETTLE_MS    = 700;

function Reel({ value, rolling, delay, accent }: { value: string; rolling: boolean; delay: number; accent?: boolean }) {
  return (
    <div className={`flex-1 min-w-0 h-9 rounded-xl overflow-hidden flex items-center justify-center ${accent ? "bg-emerald/10 border border-emerald/30" : "bg-white/8 border border-white/12"}`}>
      <div
        className={`px-2 text-center w-full truncate ${accent ? "font-serif text-base font-semibold" : "font-mono text-[11px] text-cream/80"}`}
        style={{
          // Use longhand-only to avoid shorthand/transitionDelay conflict warning
          transitionProperty:       rolling ? "none"     : "filter, opacity, transform",
          transitionDuration:       rolling ? "0ms"      : "130ms",
          transitionTimingFunction: rolling ? "linear"   : "ease-out",
          transitionDelay:          rolling ? "0ms"      : `${delay}ms`,
          filter:    rolling ? "blur(2px)"        : "blur(0)",
          opacity:   rolling ? 0.6                : 1,
          transform: rolling ? "translateY(-4px)" : "translateY(0)",
          ...(accent && !rolling ? {
            background: "linear-gradient(135deg, #2ecc71, #1a9e52)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          } : {}),
        }}
      >
        {value}
      </div>
    </div>
  );
}

export function SavingsSlot() {
  const [idx,      setIdx]      = useState(0);
  const [factIdx,  setFactIdx]  = useState(0);
  const [rolling,  setRolling]  = useState(true); // start rolling immediately on mount
  const [factFade, setFactFade] = useState(true);

  useEffect(() => {
    let rollTimer: ReturnType<typeof setInterval> | null = null;
    let phaseTimer: ReturnType<typeof setTimeout> | null = null;

    function startRolling() {
      setRolling(true);
      let count = 0;
      rollTimer = setInterval(() => {
        setIdx((i) => (i + 1) % COMBOS.length);
        count++;
        if (count >= ROLL_STEPS) {
          clearInterval(rollTimer!);
          rollTimer = null;
          setRolling(false);
          phaseTimer = setTimeout(startRolling, SETTLE_MS);
        }
      }, ROLL_STEP_MS);
    }

    startRolling();

    return () => {
      if (rollTimer)  clearInterval(rollTimer);
      if (phaseTimer) clearTimeout(phaseTimer);
    };
  }, []);

  // Facts cycle independently, slower
  useEffect(() => {
    const id = setInterval(() => {
      setFactFade(false);
      setTimeout(() => {
        setFactIdx((i) => (i + 1) % FACTS.length);
        setFactFade(true);
      }, 400);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const { ev, state, saving } = COMBOS[idx];

  return (
    <div className="bg-ink rounded-3xl overflow-hidden border border-white/10 shadow-2">
      {/* Accent line */}
      <div className="h-0.5 bg-gradient-to-r from-forest via-emerald to-forest" />

      {/* Header */}
      <div className="px-5 py-3.5 border-b border-white/8 flex items-center justify-between">
        <div className="font-mono text-[10px] uppercase tracking-widest text-cream/40">
          EV savings · real examples
        </div>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full transition-all duration-200"
              style={{
                background: rolling ? "#c6912a" : "rgba(46,204,113,0.5)",
                transitionDelay: rolling ? `${i * 50}ms` : "0ms",
                boxShadow: rolling ? "0 0 6px #c6912a" : "none",
              }}
            />
          ))}
        </div>
      </div>

      {/* Reel labels */}
      <div className="flex gap-2 px-5 pt-4 pb-2">
        {["EV model", "State", "Saves / yr"].map((l) => (
          <div key={l} className="flex-1 text-center font-mono text-[11px] uppercase tracking-wider text-cream/50">
            {l}
          </div>
        ))}
      </div>

      {/* Reels */}
      <div className="flex gap-2 px-5 pb-4">
        <Reel value={ev}     rolling={rolling} delay={0}   />
        <Reel value={state}  rolling={rolling} delay={60}  />
        <Reel value={saving} rolling={rolling} delay={120} accent />
      </div>

      {/* EV fact strip */}
      <div className="border-t border-white/8 px-5 py-3.5 flex items-center gap-2.5">
        <span className="text-emerald text-sm flex-shrink-0">⚡</span>
        <p
          className="font-mono text-[12px] text-cream/60 leading-snug transition-all duration-300 line-clamp-2"
          style={{ opacity: factFade ? 1 : 0, transform: factFade ? "translateY(0)" : "translateY(3px)" }}
        >
          {FACTS[factIdx]}
        </p>
      </div>

      {/* Footer */}
      <div className="bg-white/4 border-t border-white/8 px-5 py-3 flex items-center justify-between">
        <div className="font-mono text-[9px] text-cream/25">vs equivalent gas car · 13,500 mi/yr</div>
        <div className="flex items-center gap-1.5 font-mono text-[9px] text-emerald/70">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
          live
        </div>
      </div>
    </div>
  );
}
