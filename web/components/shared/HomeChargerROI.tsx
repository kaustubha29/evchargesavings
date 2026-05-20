"use client";
import { useState, useMemo } from "react";

const L1_MPH = 4.5;
const L2_MPH = 25;
const MI_PER_KWH = 3.5;
const L1_OVERNIGHT_MI = L1_MPH * 8;
const PUBLIC_SESSION_MI = 80;
const PUBLIC_SESSION_COST = 15;
const TOU_DELTA_PER_KWH = 0.07;
const TAX_CREDIT_RATE = 0.30;
const TAX_CREDIT_CAP = 1000;
const SEC_30C_EXPIRES = "June 30, 2026";

function deriveHardwareCost(totalCost: number) {
  // ~55% of install budget is typically hardware, capped at $700
  return Math.min(Math.round(totalCost * 0.55), 700);
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-2">
        <span className="font-mono text-[11px] uppercase tracking-widest text-ink-mute">{label}</span>
        <span className="font-mono text-base font-semibold text-ink">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
      <div className="flex justify-between mt-1">
        <span className="font-mono text-[9px] text-ink-mute/50">{format(min)}</span>
        <span className="font-mono text-[9px] text-ink-mute/50">{format(max)}</span>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div className={`rounded-2xl border px-5 py-4 ${accent ? "border-forest/30 bg-forest/5" : "border-line bg-paper"}`}>
      <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-1">{label}</div>
      <div className={`font-serif text-xl font-medium leading-snug ${accent ? "text-forest" : "text-ink"}`}>{value}</div>
      {sub && <div className="font-mono text-[10px] text-ink-mute mt-0.5 leading-snug">{sub}</div>}
    </div>
  );
}

export function HomeChargerROI() {
  const [milesPerDay, setMilesPerDay] = useState(40);
  const [totalCost, setTotalCost] = useState(900);

  const r = useMemo(() => {
    const hardwareCost = deriveHardwareCost(totalCost);

    const l1HrsNeeded = milesPerDay / L1_MPH;
    const l2HrsNeeded = milesPerDay / L2_MPH;
    const hrsSavedPerNight = Math.max(0, l1HrsNeeded - l2HrsNeeded);

    const dailyDeficit = Math.max(0, milesPerDay - L1_OVERNIGHT_MI);
    const sessionsPerMonth = dailyDeficit > 0 ? (dailyDeficit * 30) / PUBLIC_SESSION_MI : 0;
    const publicSavingsPerMonth = sessionsPerMonth * PUBLIC_SESSION_COST;

    const monthlyKwh = (milesPerDay * 30) / MI_PER_KWH;
    const touSavings = monthlyKwh * TOU_DELTA_PER_KWH;

    const monthlySavings = publicSavingsPerMonth + touSavings;
    const taxCredit = Math.min(hardwareCost * TAX_CREDIT_RATE, TAX_CREDIT_CAP);
    const netCost = Math.max(0, totalCost - taxCredit);
    const breakEvenMonths = monthlySavings > 1 ? Math.round(netCost / monthlySavings) : null;

    return {
      hrsSavedPerNight,
      sessionsPerMonth,
      publicSavingsPerMonth,
      touSavings,
      monthlySavings,
      taxCredit,
      netCost,
      breakEvenMonths,
      monthlyKwh,
      hardwareCost,
    };
  }, [milesPerDay, totalCost]);

  return (
    <section className="bg-cream-soft border-b border-line py-14" id="charger-roi">
      <div className="section-wrap">
        <div className="md:grid md:grid-cols-[1fr_1fr] md:gap-12 md:items-start">

          {/* LEFT — inputs */}
          <div>
            <div className="font-mono text-[11px] uppercase tracking-widest text-forest mb-3">
              Level 2 ROI calculator
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight text-ink mb-3">
              When does a home charger pay off?
            </h2>
            <p className="text-sm text-ink-3 leading-relaxed mb-6">
              Level 1 (standard outlet) adds ~4.5 miles per hour. Above ~36 mi/day it forces public charging trips.
              Dial in your numbers to see the break-even.
            </p>

            {/* §30C urgency */}
            <div className="rounded-2xl border border-okay-fg/20 bg-okay-bg px-5 py-4 mb-6">
              <div className="font-mono text-[11px] uppercase tracking-widest text-okay-fg mb-1">
                Federal §30C credit — expires {SEC_30C_EXPIRES}
              </div>
              <p className="text-xs text-ink-2 leading-relaxed">
                30% of charger hardware cost (up to $1,000). Estimated at ~$
                {Math.round(r.taxCredit)} for your current inputs — already factored into break-even below.
              </p>
            </div>

            {/* Sliders */}
            <div className="space-y-6">
              <Slider
                label="Daily miles driven"
                value={milesPerDay}
                min={10}
                max={120}
                step={5}
                format={(v) => `${v} mi / day`}
                onChange={setMilesPerDay}
              />
              <Slider
                label="Total investment (charger + install)"
                value={totalCost}
                min={300}
                max={2000}
                step={100}
                format={(v) => `$${v.toLocaleString()}`}
                onChange={setTotalCost}
              />
              <p className="font-mono text-[10px] text-ink-mute/70">
                §30C credit estimated on hardware portion (~$
                {r.hardwareCost} of $
                {totalCost.toLocaleString()} total).
                Confirm with a tax professional.
              </p>
            </div>
          </div>

          {/* RIGHT — results */}
          <div className="mt-10 md:mt-0 space-y-3">

            {/* Stat grid */}
            <div className="grid grid-cols-2 gap-3">
              <Stat
                label="Time saved / night"
                value={r.hrsSavedPerNight < 0.5 ? "< 30 min" : `${r.hrsSavedPerNight.toFixed(1)} hrs`}
                sub="vs Level 1"
              />
              <Stat
                label="Public sessions avoided"
                value={r.sessionsPerMonth < 0.5 ? "None needed" : `${r.sessionsPerMonth.toFixed(1)} / mo`}
                sub={r.sessionsPerMonth >= 0.5
                  ? `saves ~$${Math.round(r.publicSavingsPerMonth)}/mo`
                  : "L1 keeps up here"}
              />
              <Stat
                label="TOU rate savings"
                value={`$${Math.round(r.touSavings)} / mo`}
                sub={`${Math.round(r.monthlyKwh)} kWh × $0.07 gap`}
              />
              <Stat
                label="§30C tax credit"
                value={`$${Math.round(r.taxCredit)}`}
                sub={`expires ${SEC_30C_EXPIRES}`}
                accent
              />
            </div>

            {/* Break-even callout */}
            <div className={`rounded-2xl border p-5 ${
              r.breakEvenMonths && r.breakEvenMonths <= 48
                ? "border-forest/30 bg-forest/5"
                : "border-line bg-paper"
            }`}>
              <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-1.5">Break-even after §30C credit</div>
              {r.breakEvenMonths ? (
                <>
                  <div className="font-serif text-4xl font-medium text-forest leading-none mb-2">
                    {r.breakEvenMonths} <span className="text-2xl text-ink-mute font-normal">months</span>
                  </div>
                  <div className="font-mono text-[10px] text-ink-mute">
                    Net cost ${Math.round(r.netCost).toLocaleString()} · Monthly savings ${Math.round(r.monthlySavings)}
                  </div>
                </>
              ) : (
                <p className="text-sm text-ink-mute">
                  Increase daily miles or reduce installation cost to see break-even.
                </p>
              )}
              <a
                href="#charger-gear"
                className="mt-4 inline-flex items-center justify-center w-full px-5 py-3 rounded-xl font-mono text-[11px] uppercase tracking-widest bg-forest text-white hover:bg-emerald transition-colors"
              >
                Shop Level 2 chargers →
              </a>
            </div>

          </div>
        </div>

        <p className="mt-8 font-mono text-[10px] text-ink-mute/50">
          Estimates use national averages (3.5 mi/kWh, $0.07/kWh TOU gap, $15/public session avg).
          §30C eligibility subject to IRS rules.
        </p>
      </div>
    </section>
  );
}
