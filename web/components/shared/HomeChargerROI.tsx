"use client";
import { useState, useMemo } from "react";

const L1_MPH = 4.5;        // Level 1: 120 V, ~12 A → ~4–5 mi/hr
const L2_MPH = 25;         // Level 2: 240 V, 40 A → ~20–30 mi/hr (conservative)
const MI_PER_KWH = 3.5;    // national avg EV efficiency
const L1_OVERNIGHT_MI = L1_MPH * 8;     // 8-hr overnight window = 36 mi
const PUBLIC_SESSION_MI = 80;            // avg public charge adds ~80 mi
const PUBLIC_SESSION_COST = 15;          // avg public L2 session cost
const TOU_DELTA_PER_KWH = 0.07;         // typical TOU off-peak vs standard rate gap
const TAX_CREDIT_RATE = 0.30;
const TAX_CREDIT_CAP = 1000;
const SEC_30C_EXPIRES = "June 30, 2026";

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
      <div className="flex justify-between mb-1.5">
        <span className="font-mono text-[11px] uppercase tracking-widest text-ink-mute">{label}</span>
        <span className="font-mono text-sm font-medium text-ink">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full accent-forest cursor-pointer"
      />
      <div className="flex justify-between mt-1">
        <span className="font-mono text-[9px] text-ink-mute/60">{format(min)}</span>
        <span className="font-mono text-[9px] text-ink-mute/60">{format(max)}</span>
      </div>
    </div>
  );
}

function StatBox({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-2xl border p-5 ${highlight ? "border-forest/40 bg-forest/5" : "border-line bg-paper"}`}>
      <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-1">{label}</div>
      <div className={`font-serif text-2xl font-medium ${highlight ? "text-forest" : "text-ink"}`}>{value}</div>
      {sub && <div className="font-mono text-[10px] text-ink-mute mt-0.5">{sub}</div>}
    </div>
  );
}

export function HomeChargerROI() {
  const [milesPerDay, setMilesPerDay] = useState(40);
  const [totalCost, setTotalCost] = useState(900);
  const [chargerCost, setChargerCost] = useState(500);

  const r = useMemo(() => {
    // Time saved per night
    const l1HrsNeeded = milesPerDay / L1_MPH;
    const l2HrsNeeded = milesPerDay / L2_MPH;
    const hrsSavedPerNight = Math.max(0, l1HrsNeeded - l2HrsNeeded);

    // Public charging avoided: L1 can only restore L1_OVERNIGHT_MI per night.
    // Miles above that require public charging. Average session = 80 mi.
    const dailyDeficit = Math.max(0, milesPerDay - L1_OVERNIGHT_MI);
    const sessionsPerMonth = dailyDeficit > 0
      ? (dailyDeficit * 30) / PUBLIC_SESSION_MI
      : 0;
    const publicSavingsPerMonth = sessionsPerMonth * PUBLIC_SESSION_COST;

    // TOU savings: smart L2 schedules off-peak; L1 often charges at random times
    const monthlyKwh = (milesPerDay * 30) / MI_PER_KWH;
    const touSavings = monthlyKwh * TOU_DELTA_PER_KWH;

    const monthlySavings = publicSavingsPerMonth + touSavings;

    // §30C federal tax credit: 30% of equipment (charger only), up to $1,000
    const taxCredit = Math.min(chargerCost * TAX_CREDIT_RATE, TAX_CREDIT_CAP);
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
    };
  }, [milesPerDay, totalCost, chargerCost]);

  return (
    <section className="bg-paper border-b border-line py-14" id="charger-roi">
      <div className="section-wrap max-w-3xl">

        {/* Header */}
        <div className="mb-8">
          <div className="font-mono text-[11px] uppercase tracking-widest text-forest mb-3">Level 2 ROI calculator</div>
          <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight text-ink mb-3">
            When does a home charger pay off?
          </h2>
          <p className="text-ink-3 leading-relaxed text-sm max-w-xl">
            Level 1 (standard outlet) adds ~4.5 miles per hour — fine for low mileage. Above ~36 miles/day it forces public charging trips.
            Dial in your numbers to see the break-even.
          </p>
        </div>

        {/* §30C urgency banner */}
        <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 flex gap-3 items-start">
          <span className="mt-0.5 text-amber-600 flex-shrink-0">⚡</span>
          <div>
            <div className="font-mono text-[11px] uppercase tracking-widest text-amber-700 mb-0.5">Federal tax credit — act before {SEC_30C_EXPIRES}</div>
            <p className="text-xs text-amber-900 leading-relaxed">
              Section §30C covers 30% of charger hardware cost (up to $1,000). It expires {SEC_30C_EXPIRES}.
              Install now and the credit offsets most of the charger cost.
            </p>
          </div>
        </div>

        {/* Inputs */}
        <div className="bg-cream-soft rounded-2xl border border-line p-6 mb-8 space-y-6">
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
            label="Charger hardware cost"
            value={chargerCost}
            min={200}
            max={1000}
            step={50}
            format={(v) => `$${v}`}
            onChange={setChargerCost}
          />
          <Slider
            label="Total installed cost (charger + electrician)"
            value={totalCost}
            min={300}
            max={2000}
            step={100}
            format={(v) => `$${v.toLocaleString()}`}
            onChange={setTotalCost}
          />
        </div>

        {/* Results grid */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <StatBox
            label="Time saved per night"
            value={r.hrsSavedPerNight < 0.5 ? "< 30 min" : `${r.hrsSavedPerNight.toFixed(1)} hrs`}
            sub="vs Level 1 overnight charge"
          />
          <StatBox
            label="Public charging avoided"
            value={r.sessionsPerMonth < 0.5 ? "None needed" : `${r.sessionsPerMonth.toFixed(1)} sessions / mo`}
            sub={r.sessionsPerMonth >= 0.5
              ? `saves ~$${Math.round(r.publicSavingsPerMonth)}/mo`
              : "Level 1 keeps up at this mileage"}
          />
          <StatBox
            label="TOU rate savings"
            value={`$${Math.round(r.touSavings)} / mo`}
            sub={`${Math.round(r.monthlyKwh)} kWh/mo × $0.07 off-peak gap`}
          />
          <StatBox
            label="Federal §30C credit"
            value={`$${Math.round(r.taxCredit)}`}
            sub={`30% of $${chargerCost} charger cost · expires ${SEC_30C_EXPIRES}`}
            highlight
          />
        </div>

        {/* Break-even callout */}
        <div className={`rounded-2xl border p-6 flex flex-col sm:flex-row sm:items-center gap-4 ${
          r.breakEvenMonths && r.breakEvenMonths <= 36
            ? "border-forest/40 bg-forest/5"
            : "border-line bg-paper"
        }`}>
          <div className="flex-1">
            <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-1">Break-even</div>
            {r.breakEvenMonths ? (
              <>
                <div className="font-serif text-3xl font-medium text-forest">
                  {r.breakEvenMonths} months
                </div>
                <div className="text-xs text-ink-mute mt-1">
                  Net cost after §30C credit: <span className="font-mono text-ink">${Math.round(r.netCost).toLocaleString()}</span>
                  {" · "}
                  Monthly savings: <span className="font-mono text-ink">${Math.round(r.monthlySavings)}</span>
                </div>
              </>
            ) : (
              <div className="text-sm text-ink-mute">
                Increase daily miles or reduce installation cost to see break-even.
              </div>
            )}
          </div>
          <a
            href="#charger-gear"
            className="flex-shrink-0 inline-flex items-center justify-center px-5 py-3 rounded-xl font-mono text-[11px] uppercase tracking-widest bg-forest text-white hover:bg-emerald transition-colors"
          >
            Shop Level 2 chargers →
          </a>
        </div>

        <p className="mt-5 text-xs text-ink-mute/60 leading-relaxed">
          Estimates use national averages (3.5 mi/kWh efficiency, $0.07/kWh TOU gap, $15/public session).
          §30C credit eligibility subject to IRS rules — confirm with a tax professional.
        </p>
      </div>
    </section>
  );
}
