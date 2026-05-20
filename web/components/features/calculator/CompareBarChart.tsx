"use client";
import { useMemo } from "react";
import { useCalculatorStore, computeSavings, computePHEVCost } from "@/store/calculator";
import { fmt } from "@/lib/format";

interface Props {
  evName: string;
  compName: string;
  isPhev: boolean;
  evEfficiency: number;
  gasMpg: number;
  phev?: { evRange: number; mpge: number; mpgGas: number };
  // National avg fallbacks (server-computed, used when no user state)
  nationalEvCost: number;
  nationalCompCost: number;
  nationalKwhCents: number;
  nationalGasDollar: number;
  nationalMiles: number;
  nationalHomePct: number;
}

export function CompareBarChart({
  evName, compName, isPhev, evEfficiency, gasMpg, phev,
  nationalEvCost, nationalCompCost, nationalKwhCents, nationalGasDollar, nationalMiles, nationalHomePct,
}: Props) {
  const store = useCalculatorStore();
  const { stateCode, stateData, annualMiles, homePct, homeRateKwh, publicRateKwh, gasPriceDollar } = store;

  const savings = useMemo(
    () => computeSavings(evEfficiency, gasMpg, store),
    [evEfficiency, gasMpg, annualMiles, homePct, homeRateKwh, publicRateKwh, gasPriceDollar, stateData]
  );

  const phevCost = useMemo(
    () => phev ? computePHEVCost(phev.evRange, phev.mpge, phev.mpgGas, store) : null,
    [phev, annualMiles, homePct, homeRateKwh, publicRateKwh, gasPriceDollar]
  );

  const isPersonalized = !!stateCode;
  const evCost   = isPersonalized ? savings.evAnnualCost : nationalEvCost;
  const compCost = isPersonalized
    ? (isPhev && phevCost ? phevCost.totalCost : savings.gasAnnualCost)
    : nationalCompCost;
  const miles    = isPersonalized ? annualMiles : nationalMiles;
  const homePctDisplay = isPersonalized ? homePct : nationalHomePct;
  const kwhLabel = isPersonalized ? fmt.cents1(homeRateKwh) : fmt.cents1(nationalKwhCents);
  const gasLabel = isPersonalized ? fmt.money2(gasPriceDollar) : fmt.money2(nationalGasDollar);
  const sourceLabel = isPersonalized ? stateData.name : "National avg";
  const max = Math.max(evCost, compCost, 1);

  return (
    <section className="py-12 bg-ink text-cream">
      <div className="section-wrap">
        <div className="font-mono text-xs uppercase tracking-widest text-cream/50 mb-6">
          Annual {isPhev ? "driving" : "fuel"} cost at {miles.toLocaleString()} miles
        </div>
        {[
          { label: compName, val: compCost, color: "#c25234" },
          { label: evName,   val: evCost,   color: "#34a960" },
        ].map((row) => (
          <div key={row.label} className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-cream/70">{row.label}</span>
              <span className="font-mono text-cream">{fmt.money0(row.val)}/yr</span>
            </div>
            <div className="h-4 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${(row.val / max * 100).toFixed(1)}%`, background: row.color }}
              />
            </div>
          </div>
        ))}
        <div className="mt-6 pt-4 border-t border-white/10 font-mono text-xs text-cream/40">
          {sourceLabel} · {kwhLabel}/kWh · {gasLabel}/gal · {homePctDisplay}% home charging
          {isPhev && ` · ${Math.round(miles / 365)} mi/day avg`}
        </div>
      </div>
    </section>
  );
}
