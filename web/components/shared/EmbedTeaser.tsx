"use client";

import { useState, useMemo } from "react";

interface StateOption { name: string; slug: string; kwhCents: number; gasDollar: number }
interface EvOption { name: string; slug: string; efficiency: number; battery: number }

interface Props {
  states: StateOption[];
  evs: EvOption[];
  defaultStateSlug: string;
  defaultEvSlug: string;
}

const GAS_MPG = 28;
const ANNUAL_MILES = 13500;

function calcSavings(kwhCents: number, gasDollar: number, efficiency: number) {
  const evAnnual = (ANNUAL_MILES / efficiency) * (kwhCents / 100);
  const gasAnnual = (ANNUAL_MILES / GAS_MPG) * gasDollar;
  return Math.round(gasAnnual - evAnnual);
}

export function EmbedTeaser({ states, evs, defaultStateSlug, defaultEvSlug }: Props) {
  const [stateSlug, setStateSlug] = useState(defaultStateSlug);
  const [evSlug, setEvSlug] = useState(defaultEvSlug);

  const state = useMemo(() => states.find((s) => s.slug === stateSlug) ?? states[0], [states, stateSlug]);
  const ev = useMemo(() => evs.find((e) => e.slug === evSlug) ?? evs[0], [evs, evSlug]);

  const savings = useMemo(() => calcSavings(state.kwhCents, state.gasDollar, ev.efficiency), [state, ev]);
  const positive = savings > 0;

  const ctaUrl = `https://www.evchargesavings.com/ev-cost/${stateSlug}`;

  return (
    <div className="bg-paper min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-paper border border-line rounded-2xl overflow-hidden shadow-sm">

        {/* Header */}
        <div className="bg-ink px-5 py-4">
          <div className="font-mono text-[9px] uppercase tracking-widest text-emerald mb-1">EV Savings Estimate</div>
          <div className="font-serif text-xl font-medium text-cream leading-tight">
            How much will you save going electric?
          </div>
        </div>

        {/* Inputs */}
        <div className="px-5 py-4 border-b border-line space-y-3">
          <div>
            <label className="font-mono text-[9px] uppercase tracking-widest text-ink-mute block mb-1">Your state</label>
            <select
              value={stateSlug}
              onChange={(e) => setStateSlug(e.target.value)}
              className="w-full border border-line rounded-lg px-3 py-2 text-sm bg-paper text-ink focus:outline-none focus:border-forest"
            >
              {states.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="font-mono text-[9px] uppercase tracking-widest text-ink-mute block mb-1">EV you&rsquo;re considering</label>
            <select
              value={evSlug}
              onChange={(e) => setEvSlug(e.target.value)}
              className="w-full border border-line rounded-lg px-3 py-2 text-sm bg-paper text-ink focus:outline-none focus:border-forest"
            >
              {evs.map((e) => <option key={e.slug} value={e.slug}>{e.name}</option>)}
            </select>
          </div>
        </div>

        {/* Result */}
        <div className="px-5 py-5">
          <div className="font-mono text-[9px] uppercase tracking-widest text-ink-mute mb-1">
            Estimated annual fuel savings vs avg gas car
          </div>
          <div className={`font-serif text-4xl font-medium mb-1 ${positive ? "text-forest" : "text-rust"}`}>
            {positive ? "+" : ""}{savings < 0 ? "-" : ""}${Math.abs(savings).toLocaleString()}
            <span className="text-base font-sans font-normal text-ink-mute">/yr</span>
          </div>
          <p className="text-xs text-ink-mute leading-relaxed mb-5">
            Based on {state.kwhCents.toFixed(1)}¢/kWh electricity · ${state.gasDollar.toFixed(2)}/gal gas · {ANNUAL_MILES.toLocaleString()} miles/yr. Fuel only — before any state EV registration fee.
          </p>
          <a
            href={ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center px-4 py-3 rounded-xl text-sm font-semibold bg-forest text-white hover:bg-emerald transition-colors"
          >
            See full breakdown — free →
          </a>
        </div>

        {/* Attribution */}
        <div className="border-t border-line px-5 py-2.5 text-center">
          <a
            href="https://www.evchargesavings.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[9px] uppercase tracking-widest text-ink-mute hover:text-forest transition-colors"
          >
            Powered by EVChargeSavings.com
          </a>
        </div>
      </div>
    </div>
  );
}
