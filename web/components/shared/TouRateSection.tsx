"use client";
import { useState, useMemo } from "react";
import { useOwnerStore } from "@/store/owner";
import { UTILITIES } from "@/features/location/data/utilities";
import { STATE_DATA } from "@/features/location/data/states";
import { EV_MODELS } from "@/features/ev-data/data/evs";

// States that have at least one utility with TOU data
const TOU_STATE_CODES = [...new Set(UTILITIES.filter(u => u.offPeakCents).map(u => u.stateCode))].sort();

const ANNUAL_MILES = 13500;

export function TouRateSection() {
  const { brand, model } = useOwnerStore();
  const [selectedState, setSelectedState] = useState("");
  const [selectedUtilitySlug, setSelectedUtilitySlug] = useState("");

  const stateUtilities = useMemo(
    () => UTILITIES.filter(u => u.stateCode === selectedState && u.offPeakCents),
    [selectedState]
  );

  // Auto-select if only one utility in state
  const utility = useMemo(() => {
    if (stateUtilities.length === 1) return stateUtilities[0];
    return stateUtilities.find(u => u.slug === selectedUtilitySlug) ?? null;
  }, [stateUtilities, selectedUtilitySlug]);

  const stateData = useMemo(() => STATE_DATA[selectedState] ?? null, [selectedState]);

  const carModel = useMemo(() => {
    if (!brand || !model) return null;
    return EV_MODELS.find(m => m.brand === brand && m.name === model) ?? null;
  }, [brand, model]);

  // Savings calc
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
      offPeakCents: utility.offPeakCents,
      standardCents: stateData.kwhCents,
    };
  }, [utility, stateData, carModel]);

  const touStates = TOU_STATE_CODES.map(code => {
    const s = STATE_DATA[code];
    return { code, name: s?.name ?? code };
  });

  return (
    <section className="border-b border-line py-12 bg-paper" id="tou-rates">
      <div className="section-wrap">
        <div className="mb-6">
          <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-2">Electricity rates</div>
          <h2 className="font-serif text-3xl font-medium tracking-tight text-ink mb-2">
            Are you on the right rate plan?
          </h2>
          <p className="text-ink-3 text-base max-w-xl">
            Time-of-use rates cut overnight charging costs 30–70%. Most EV owners never switch — and leave real money on the table.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Left — selectors */}
          <div className="flex flex-col gap-4">
            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-1.5 block">Your state</label>
              <select
                value={selectedState}
                onChange={e => { setSelectedState(e.target.value); setSelectedUtilitySlug(""); }}
                className="w-full border border-line rounded-xl px-4 py-3 text-sm bg-paper outline-none focus:border-forest focus:ring-2 focus:ring-forest/20"
              >
                <option value="">Select your state…</option>
                {touStates.map(s => (
                  <option key={s.code} value={s.code}>{s.name}</option>
                ))}
              </select>
            </div>

            {stateUtilities.length > 1 && (
              <div>
                <label className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-1.5 block">Your utility</label>
                <select
                  value={selectedUtilitySlug}
                  onChange={e => setSelectedUtilitySlug(e.target.value)}
                  className="w-full border border-line rounded-xl px-4 py-3 text-sm bg-paper outline-none focus:border-forest focus:ring-2 focus:ring-forest/20"
                >
                  <option value="">Select your utility…</option>
                  {stateUtilities.map(u => (
                    <option key={u.slug} value={u.slug}>{u.shortName}</option>
                  ))}
                </select>
              </div>
            )}

            {utility && (
              <div className="bg-cream-soft border border-line rounded-2xl p-5">
                <div className="font-mono text-[10px] uppercase tracking-widest text-forest mb-1">{utility.touProgram}</div>
                <div className="font-medium text-ink text-sm mb-2">{utility.shortName}</div>
                <div className="flex gap-4 mb-3">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-0.5">Off-peak</div>
                    <div className="font-mono text-xl font-medium text-forest">{utility.offPeakCents}¢</div>
                  </div>
                  <div className="w-px bg-line" />
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-0.5">On-peak</div>
                    <div className="font-mono text-xl font-medium text-rust">{utility.onPeakCents}¢</div>
                  </div>
                  <div className="w-px bg-line" />
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-0.5">Best window</div>
                    <div className="text-xs text-ink-2 mt-1 leading-snug max-w-[120px]">{utility.offPeakWindow}</div>
                  </div>
                </div>
                <a
                  href={`/utility/${utility.slug}`}
                  className="inline-flex items-center font-mono text-[11px] text-forest hover:underline"
                >
                  Full rate details &amp; enrollment →
                </a>
              </div>
            )}

            {!selectedState && (
              <p className="text-xs text-ink-mute">
                TOU plans are available in CA, CO, FL, GA, IL, MA, NC, NY, OR, UT, VA, and WA. Other states may have programs not listed here.
              </p>
            )}
          </div>

          {/* Right — savings */}
          <div>
            {savings && savings.saving > 0 ? (
              <div className="bg-white border border-line/80 border-t-[3px] border-t-forest/70 rounded-2xl p-6 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)]">
                <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-3">
                  Estimated annual savings{carModel ? ` — ${carModel.brand} ${carModel.name.split(" ").slice(0,2).join(" ")}` : ""}
                </div>
                <div className="font-mono text-5xl font-medium text-forest mb-1">
                  ${savings.saving}
                </div>
                <p className="text-xs text-ink-mute mb-5">
                  vs. standard {savings.standardCents.toFixed(1)}¢/kWh rate · {savings.annualKwh.toLocaleString()} kWh/yr · {ANNUAL_MILES.toLocaleString()} mi/yr
                </p>
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
                {utility && (
                  <a
                    href={utility.ratePageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-semibold bg-forest text-white hover:bg-emerald transition-colors"
                  >
                    Enroll in {utility.touProgram} →
                  </a>
                )}
              </div>
            ) : selectedState && utility ? (
              <div className="bg-cream-soft border border-line rounded-2xl p-6">
                <p className="text-sm text-ink-2">
                  {!carModel
                    ? "Select your car above to see personalized savings."
                    : "Standard rate data unavailable for this state — check the utility's rate page directly."}
                </p>
              </div>
            ) : (
              <div className="bg-cream-soft border border-line rounded-2xl p-6 flex flex-col gap-3">
                <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute">How it works</div>
                {[
                  "TOU rates charge less per kWh overnight when grid demand is low.",
                  "Most utilities offer EV-specific plans — often 30–70% cheaper than peak.",
                  "Enrollment is free and takes 5 minutes on your utility's website.",
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="font-mono text-[11px] text-forest mt-0.5">{String(i + 1).padStart(2, "0")}</span>
                    <p className="text-sm text-ink-2">{tip}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
