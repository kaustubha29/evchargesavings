"use client";
import { useState, useMemo } from "react";
import { useOwnerStore } from "@/store/owner";
import { useCalculatorStore } from "@/store/calculator";
import { UTILITIES } from "@/features/location/data/utilities";
import { STATE_DATA } from "@/features/location/data/states";
import { EV_MODELS } from "@/features/ev-data/data/evs";

const ANNUAL_MILES = 13500;

export function TouRateSection() {
  const { brand, model } = useOwnerStore();
  const { stateCode, zip } = useCalculatorStore();

  const [selectedUtilitySlug, setSelectedUtilitySlug] = useState("");

  const stateUtilities = useMemo(
    () => UTILITIES.filter(u => u.stateCode === (stateCode ?? "") && u.offPeakCents),
    [stateCode]
  );

  const utility = useMemo(() => {
    if (stateUtilities.length === 1) return stateUtilities[0];
    if (selectedUtilitySlug) return stateUtilities.find(u => u.slug === selectedUtilitySlug) ?? null;
    // Auto-select by ZIP prefix when user hasn't manually chosen
    if (zip) {
      const prefix = zip.slice(0, 3);
      const matched = stateUtilities.find(u => u.zipPrefixes?.includes(prefix));
      if (matched) return matched;
    }
    return null;
  }, [stateUtilities, selectedUtilitySlug, zip]);

  const stateData = useMemo(() => STATE_DATA[stateCode ?? ""] ?? null, [stateCode]);

  const carModel = useMemo(() => {
    if (!brand || !model) return null;
    return EV_MODELS.find(m => m.brand === brand && m.name === model) ?? null;
  }, [brand, model]);

  const savings = useMemo(() => {
    if (!utility?.offPeakCents || !stateData?.kwhCents) return null;
    const efficiencyMilesPerKwh = carModel?.efficiency ?? 3.5;
    const annualKwh = ANNUAL_MILES / efficiencyMilesPerKwh;
    const standardCost = (annualKwh * stateData.kwhCents) / 100;
    const offPeakCost = (annualKwh * utility.offPeakCents) / 100;
    const saving = standardCost - offPeakCost;
    return {
      annualKwh: Math.round(annualKwh),
      standardCost: Math.round(standardCost),
      offPeakCost: Math.round(offPeakCost),
      saving: Math.round(saving),
    };
  }, [utility, stateData, carModel]);

  return (
    <section className="border-b border-line py-12 bg-paper" id="tou-rates">
      <div className="section-wrap">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left — always has heading + description + state-specific content */}
          <div>
            <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-2">Electricity rates</div>
            <h2 className="font-serif text-3xl font-medium tracking-tight text-ink mb-3">
              Are you on the right rate plan?
            </h2>
            <p className="text-ink-3 text-base leading-relaxed mb-5">
              Time-of-use rates cut overnight charging costs 30–70%. Most EV owners never switch — and leave real money on the table.
            </p>

            {!stateCode ? (
              <p className="text-sm text-ink-mute">
                <a href="#owner-car-picker" className="text-forest hover:underline">Enter your ZIP ↑</a>{" "}
                in the car selector above to see rates for your area.
              </p>
            ) : stateUtilities.length === 0 ? (
              <p className="text-sm text-ink-mute">
                No TOU plan data for your area yet.{" "}
                <a href="/guides/time-of-use-rates" className="text-forest hover:underline">
                  Learn how to find your utility&apos;s EV rate →
                </a>
              </p>
            ) : stateUtilities.length > 1 ? (
              <div>
                <label className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-2 block">Your utility</label>
                <div className="flex flex-wrap gap-2">
                  {stateUtilities.map(u => (
                    <button
                      key={u.slug}
                      type="button"
                      onClick={() => setSelectedUtilitySlug(u.slug)}
                      className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all ${
                        utility?.slug === u.slug
                          ? "bg-forest text-white shadow-sm"
                          : "bg-cream-soft border border-line text-ink-2 hover:border-forest/40 hover:text-forest"
                      }`}
                    >
                      {u.shortName}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-ink-2">
                Utility: <span className="font-medium text-ink">{stateUtilities[0]?.shortName}</span>
              </p>
            )}

            <a href="/guides/time-of-use-rates" className="mt-5 block font-mono text-[11px] text-ink-mute hover:text-forest transition-colors">
              How TOU rates work →
            </a>
          </div>

          {/* Right — savings card */}
          <div>
            {savings && savings.saving > 0 && utility ? (
                <div className="bg-white border border-line/80 border-t-[3px] border-t-forest/70 rounded-2xl p-6 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)]">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute">
                      Estimated annual savings{carModel ? ` — ${carModel.brand} ${carModel.name.split(" ").slice(0, 2).join(" ")}` : ""}
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="font-mono text-[10px] uppercase tracking-widest text-forest">{utility.touProgram}</div>
                      <a href={`/utility/${utility.slug}`} className="font-mono text-[9px] text-ink-mute hover:text-forest transition-colors">
                        {utility.shortName} · rate details →
                      </a>
                    </div>
                  </div>
                  <div className="font-mono text-5xl font-medium text-forest mb-1">
                    ${savings.saving}
                  </div>
                  <div className="flex items-center gap-3 mb-5">
                    <p className="text-xs text-ink-mute">
                      vs. standard rate · {savings.annualKwh.toLocaleString()} kWh/yr · {ANNUAL_MILES.toLocaleString()} mi/yr
                    </p>
                    <span className="shrink-0 font-mono text-[10px] text-ink-mute/60">{utility.offPeakCents}¢ off-peak · {utility.onPeakCents}¢ peak</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-ink-mute">Standard rate</span>
                      <span className="font-mono text-ink">${savings.standardCost}/yr</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-ink-mute">With TOU off-peak</span>
                      <span className="font-mono text-forest">${savings.offPeakCost}/yr</span>
                    </div>
                    <div className="h-px bg-line my-1" />
                    <div className="flex items-center justify-between text-sm font-medium">
                      <span className="text-ink">Annual saving</span>
                      <span className="font-mono text-forest">${savings.saving}</span>
                    </div>
                  </div>
                  <a
                    href={utility.ratePageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-semibold bg-forest text-white hover:bg-emerald transition-colors"
                  >
                    Enroll in {utility.touProgram} →
                  </a>
                </div>
              ) : stateCode && utility ? (
                <div className="bg-cream-soft border border-line rounded-2xl p-6">
                  <p className="text-sm text-ink-2">
                    {!carModel
                      ? "Select your car above to see personalized savings."
                      : "Standard rate data unavailable for this state — check the utility's rate page directly."}
                  </p>
                </div>
              ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
