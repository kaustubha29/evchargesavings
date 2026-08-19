"use client";
import { useState, useMemo } from "react";
import { useOwnerStore } from "@/store/owner";
import { evRepository } from "@/features/ev-data/repository";

const DEFAULT_MI_PER_KWH = 3.5;
const L1_MPH = 4.5;
const L2_MPH = 25;
const L1_OVERNIGHT_MI = L1_MPH * 8;
const PUBLIC_SESSION_MI = 80;
const PUBLIC_SESSION_COST = 15;
const TOU_DELTA_PER_KWH = 0.07;
// The federal §30C credit (30% of cost, capped at $1,000) terminated for property
// placed in service after June 30, 2026, so it is no longer part of the ROI math.
const SEC_30C_EXPIRED = "June 30, 2026";

function lookupEfficiency(brand: string, year: number): number {
  const models = evRepository.getByBrand(brand);
  if (!models.length) return DEFAULT_MI_PER_KWH;
  const sameYear = models.filter((m) => m.modelYear === year);
  if (sameYear.length) {
    return sameYear.reduce((s, m) => s + m.efficiency, 0) / sameYear.length;
  }
  const earlier = models
    .filter((m) => m.modelYear <= year)
    .sort((a, b) => b.modelYear - a.modelYear);
  if (earlier.length) return earlier[0].efficiency;
  return models.reduce((s, m) => s + m.efficiency, 0) / models.length;
}

function deriveHardwareCost(totalCost: number) {
  return Math.min(Math.round(totalCost * 0.55), 700);
}

function Slider({
  label, value, min, max, step, format, onChange,
}: {
  label: string; value: number; min: number; max: number;
  step: number; format: (v: number) => string; onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-2">
        <span className="font-mono text-[11px] uppercase tracking-widest text-ink-mute">{label}</span>
        <span className="font-mono text-base font-semibold text-ink">{format(value)}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
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

function Stat({ label, value, sub, accent }: {
  label: string; value: string; sub?: string; accent?: boolean;
}) {
  return (
    <div className={`rounded-xl border px-4 py-3 ${accent ? "border-forest/30 bg-forest/5" : "border-line bg-paper"}`}>
      <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-1">{label}</div>
      <div className={`font-serif text-xl font-medium leading-snug ${accent ? "text-forest" : "text-ink"}`}>{value}</div>
      {sub && <div className="font-mono text-[10px] text-ink-mute mt-0.5 leading-snug">{sub}</div>}
    </div>
  );
}

export function HomeChargerROI() {
  const { brand, year, model, slug } = useOwnerStore();
  const [milesPerDay, setMilesPerDay] = useState(40);
  const [totalCost, setTotalCost] = useState(900);

  const miPerKwh = useMemo(() => {
    if (slug) {
      const ev = evRepository.getBySlug(slug);
      if (ev) return ev.efficiency;
    }
    if (brand && year) return lookupEfficiency(brand, year);
    return DEFAULT_MI_PER_KWH;
  }, [brand, year, slug]);

  const r = useMemo(() => {
    const hardwareCost = deriveHardwareCost(totalCost);
    const l1HrsNeeded = milesPerDay / L1_MPH;
    const l2HrsNeeded = milesPerDay / L2_MPH;
    const hrsSavedPerNight = Math.max(0, l1HrsNeeded - l2HrsNeeded);
    const dailyDeficit = Math.max(0, milesPerDay - L1_OVERNIGHT_MI);
    const sessionsPerMonth = dailyDeficit > 0 ? (dailyDeficit * 30) / PUBLIC_SESSION_MI : 0;
    const publicSavingsPerMonth = sessionsPerMonth * PUBLIC_SESSION_COST;
    const monthlyKwh = (milesPerDay * 30) / miPerKwh;
    const touSavings = monthlyKwh * TOU_DELTA_PER_KWH;
    const monthlySavings = publicSavingsPerMonth + touSavings;
    const netCost = totalCost;
    const breakEvenMonths = monthlySavings > 1 ? Math.round(netCost / monthlySavings) : null;
    return {
      hrsSavedPerNight, sessionsPerMonth, publicSavingsPerMonth,
      touSavings, monthlySavings, netCost, breakEvenMonths,
      monthlyKwh, hardwareCost,
    };
  }, [milesPerDay, totalCost, miPerKwh]);

  const efficiencyLabel = brand
    ? `${miPerKwh.toFixed(1)} mi/kWh — ${year ? `${year} ` : ""}${brand}${model ? ` ${model}` : ""}`
    : `${DEFAULT_MI_PER_KWH} mi/kWh — national avg`;

  return (
    <section className="bg-cream-soft border-b border-line py-10" id="charger-roi">
      <div className="section-wrap">
        <div className="md:grid md:grid-cols-[1fr_1fr] md:gap-10 md:items-start">

          {/* LEFT — inputs */}
          <div>
            <div className="font-mono text-[11px] uppercase tracking-widest text-forest mb-2">
              Level 2 ROI calculator
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-medium tracking-tight text-ink mb-4">
              When does a home charger pay off?
            </h2>

            {/* §30C — expired, no longer in the math */}
            <div className="rounded-xl border border-line bg-paper px-4 py-2.5 mb-4 flex items-start gap-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-ink-mute shrink-0 mt-0.5">§30C</span>
              <p className="text-xs text-ink-2 leading-relaxed">
                The federal home charger tax credit <strong>expired {SEC_30C_EXPIRED}</strong>. These figures assume you pay
                the full installed cost. Check your utility and state — many still offer charger rebates of $250–$1,000.
              </p>
            </div>

            {/* Efficiency badge */}
            <div className="rounded-xl border border-line bg-paper px-3 py-2 mb-4 flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-ink-mute shrink-0">Efficiency</span>
              <span className="font-mono text-xs text-ink font-semibold truncate">{efficiencyLabel}</span>
              {!brand && (
                <a href="#owner-car-picker" className="ml-auto font-mono text-[10px] text-forest hover:underline uppercase tracking-widest shrink-0">
                  Set car ↑
                </a>
              )}
            </div>

            {/* Sliders */}
            <div className="space-y-4">
              <Slider
                label={`Daily miles · ${(milesPerDay * 365).toLocaleString()} mi/yr`}
                value={milesPerDay} min={10} max={120} step={5}
                format={(v) => `${v} mi / day`}
                onChange={setMilesPerDay}
              />
              <Slider
                label="Total investment (charger + install)"
                value={totalCost} min={300} max={2000} step={100}
                format={(v) => `$${v.toLocaleString()}`}
                onChange={setTotalCost}
              />
              <p className="font-mono text-[10px] text-ink-mute/60">
                Hardware is roughly ${r.hardwareCost} of the ${totalCost.toLocaleString()} total; the rest is labor and permits.
              </p>
            </div>
          </div>

          {/* RIGHT — results */}
          <div className="mt-6 md:mt-0 space-y-2.5">
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
                label="Total monthly savings"
                value={`$${Math.round(r.monthlySavings)} / mo`}
                sub="public sessions + TOU gap"
                accent
              />
            </div>

            <div className={`rounded-2xl border p-5 ${
              r.breakEvenMonths && r.breakEvenMonths <= 48
                ? "border-forest/30 bg-forest/5"
                : "border-line bg-paper"
            }`}>
              <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-1.5">Break-even on installed cost</div>
              {r.breakEvenMonths ? (
                <div className="flex items-center gap-4 mb-2">
                  <div className="font-serif text-4xl font-medium text-forest leading-none shrink-0">
                    {r.breakEvenMonths} <span className="text-2xl text-ink-mute font-normal">months</span>
                  </div>
                  <div className="font-mono text-[10px] text-ink-mute leading-relaxed border-l border-line pl-4">
                    <div>Installed cost ${Math.round(r.netCost).toLocaleString()}</div>
                    <div>Monthly savings ${Math.round(r.monthlySavings)}</div>
                  </div>
                </div>
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
            <p className="font-mono text-[10px] text-ink-mute/40 leading-relaxed">
              Estimates use {brand && model ? `${year} ${brand} ${model} data` : "national averages"} ({miPerKwh.toFixed(1)} mi/kWh),
              $0.07/kWh TOU gap, $15/public session avg. No federal charger credit is applied — §30C expired {SEC_30C_EXPIRED}.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
