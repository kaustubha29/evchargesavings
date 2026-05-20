"use client";
import { useMemo } from "react";
import { useCalculatorStore, computeSavings, computePHEVCost, computeCO2 } from "@/store/calculator";
import { fmt } from "@/lib/format";

interface Props {
  // Static vehicle data (never changes with rates)
  evName: string;
  evRange: number;
  evEfficiency: number;
  evConnector: string;
  evMsrp: number;
  evFederalTaxCredit: number;
  compName: string;
  isPhev: boolean;
  gasMpg?: number;
  gasType?: string;
  gasMsrp?: number;
  phevEvRange?: number;
  phevMpge?: number;
  phevMpgGas?: number;
  phevType?: string;
  // National avg fallbacks (server-computed, shown to crawlers + organic users)
  nationalEvCost: number;
  nationalCompCost: number;
  nationalAnnualSavings: number;
  nationalNetSavings: number;
  nationalCo2Lbs: number;
  nationalBreakEvenYrs: number | null;
  nationalKwhCents: number;
  nationalGasDollar: number;
  nationalMiles: number;
  nationalHomePct: number;
  nationalEvFee: number;
  nationalPhevFee: number;
}

export function CompareHeroClient({
  evName, evRange, evEfficiency, evConnector, evMsrp, evFederalTaxCredit,
  compName, isPhev,
  gasMpg, gasType, gasMsrp,
  phevEvRange, phevMpge, phevMpgGas, phevType,
  nationalEvCost, nationalCompCost, nationalAnnualSavings, nationalNetSavings,
  nationalCo2Lbs, nationalBreakEvenYrs,
  nationalKwhCents, nationalGasDollar, nationalMiles, nationalHomePct,
  nationalEvFee, nationalPhevFee,
}: Props) {
  const store = useCalculatorStore();
  const { stateCode, stateData, annualMiles, homePct, homeRateKwh, publicRateKwh, gasPriceDollar, includeStateEvFee } = store;

  const savings = useMemo(
    () => computeSavings(evEfficiency, gasMpg ?? 30, store),
    [evEfficiency, gasMpg, annualMiles, homePct, homeRateKwh, publicRateKwh, gasPriceDollar, stateData]
  );

  const phevCost = useMemo(
    () => (isPhev && phevEvRange && phevMpge && phevMpgGas)
      ? computePHEVCost(phevEvRange, phevMpge, phevMpgGas, store)
      : null,
    [isPhev, phevEvRange, phevMpge, phevMpgGas, annualMiles, homePct, homeRateKwh, publicRateKwh, gasPriceDollar]
  );

  const co2 = useMemo(
    () => !isPhev ? computeCO2(annualMiles, gasMpg ?? 30, savings.annualKwh) : null,
    [isPhev, annualMiles, gasMpg, savings.annualKwh]
  );

  const isPersonalized = !!stateCode;

  // Costs
  const evCost   = isPersonalized ? savings.evAnnualCost : nationalEvCost;
  const compCost = isPersonalized
    ? (isPhev && phevCost ? phevCost.totalCost : savings.gasAnnualCost)
    : nationalCompCost;
  const miles       = isPersonalized ? annualMiles   : nationalMiles;
  const homePctDisp = isPersonalized ? homePct       : nationalHomePct;
  const kwhCents    = isPersonalized ? homeRateKwh   : nationalKwhCents;
  const gasDollar   = isPersonalized ? gasPriceDollar : nationalGasDollar;

  // Savings
  const annualSavings = isPersonalized ? compCost - evCost : nationalAnnualSavings;
  const isEvCheaper   = annualSavings > 0;

  // Net fee
  const evFee   = isPersonalized ? stateData.evFee         : nationalEvFee;
  const phevFee = isPersonalized ? (stateData.phevFee ?? 0) : nationalPhevFee;
  const netFee  = includeStateEvFee ? (isPhev ? evFee - phevFee : evFee) : 0;
  const netSavings = isPersonalized ? annualSavings - netFee : nationalNetSavings;

  // CO2
  let co2Lbs = nationalCo2Lbs;
  if (isPersonalized) {
    if (!isPhev && co2) {
      co2Lbs = co2.savedLbs;
    } else if (isPhev && phevCost && phevMpgGas) {
      const phevGasGallons = phevCost.gasMiles / phevMpgGas;
      co2Lbs = phevGasGallons * 19.6 - savings.annualKwh * 0.85;
    }
  }

  // Break-even
  let breakEvenYrs: number | null = nationalBreakEvenYrs;
  if (isPersonalized && !isPhev && evMsrp > (gasMsrp ?? 0) && netSavings > 0) {
    const yrs = (evMsrp - (gasMsrp ?? 0)) / netSavings;
    breakEvenYrs = yrs <= 15 ? yrs : null;
  } else if (isPersonalized) {
    breakEvenYrs = null;
  }

  // Labels
  const sourceLabel = isPersonalized ? stateData.name : null;
  const netFeeLabel = isPhev
    ? `~${fmt.money0(Math.abs(netFee))} net EV fee`
    : isPersonalized
      ? `${fmt.money0(evFee)} ${stateData.name} EV fee`
      : `~$${nationalEvFee} EV fee`;

  return (
    <>
      {/* Intro paragraph */}
      <p className="text-ink-3 text-lg max-w-xl leading-relaxed mb-8">
        {isEvCheaper
          ? <>The {evName} saves <b className="text-forest">{fmt.money0(annualSavings)}/yr</b> in {isPhev ? "driving costs" : "fuel"} compared to the {compName} at {miles.toLocaleString()} miles{sourceLabel ? ` in ${sourceLabel}` : " nationally"}.</>
          : <>At current rates, the {compName} costs less to {isPhev ? "run" : "fuel"} than the {evName} by {fmt.money0(-annualSavings)}/yr{sourceLabel ? ` in ${sourceLabel}` : " nationally"}.</>
        }
      </p>
      {isEvCheaper && (
        <p className="text-ink-mute text-sm max-w-xl leading-relaxed -mt-5 mb-8">
          {isPhev
            ? <>Factoring the {sourceLabel ?? "national average"} EV fee (${evFee}) minus the PHEV surcharge you escape (${phevFee}), net savings are about <b className="text-forest">{fmt.money0(netSavings)}/yr</b>. <a href="#calculator" className="text-forest hover:underline">Adjust below →</a></>
            : <>Most states charge EVs an annual registration fee ($50–$270{isPersonalized ? `, ${fmt.money0(evFee)} in ${stateData.name}` : ", ~$138 national average"}). Net savings are about <b className="text-forest">{fmt.money0(netSavings)}/yr</b>. <a href="#calculator" className="text-forest hover:underline">Adjust below →</a></>
          }
        </p>
      )}

      {/* Side-by-side vehicle cards */}
      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        {/* EV card */}
        <div className="bg-good-bg border border-good-fg/20 rounded-2xl p-6">
          <div className="font-mono text-[10px] uppercase tracking-widest text-good-fg/70 mb-2">Electric</div>
          <div className="font-serif text-xl font-medium text-ink mb-4">{evName}</div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-ink-mute">Annual fuel cost</span>
              <b className="font-mono text-good-fg">{fmt.money0(evCost)}</b>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-mute">Cost per mile</span>
              <b className="font-mono">{((evCost / miles) * 100).toFixed(1)}¢</b>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-mute">EPA range</span>
              <b className="font-mono">{evRange} mi</b>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-mute">Efficiency</span>
              <b className="font-mono">{evEfficiency} mi/kWh</b>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-mute">Connector</span>
              <b className="font-mono">{evConnector}</b>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-mute">Starting MSRP</span>
              <b className="font-mono">{fmt.money0(evMsrp)}</b>
            </div>
            <div className="flex justify-between text-ink-mute/60">
              <span>Federal tax credit</span>
              <b className="font-mono text-rust text-xs">
                Expired Oct 2025{evFederalTaxCredit > 0 ? ` (was −${fmt.money0(evFederalTaxCredit)})` : ""}
              </b>
            </div>
          </div>
        </div>

        {/* Comparison vehicle card */}
        <div className="bg-paper border border-line rounded-2xl p-6">
          <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-2">
            {isPhev ? "Plug-in Hybrid" : "Gas"}
          </div>
          <div className="font-serif text-xl font-medium text-ink mb-4">{compName}</div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-ink-mute">Annual {isPhev ? "driving" : "fuel"} cost</span>
              <b className="font-mono text-rust">{fmt.money0(compCost)}</b>
            </div>
            {isPhev ? (
              <>
                <div className="flex justify-between">
                  <span className="text-ink-mute">EV range</span>
                  <b className="font-mono">{phevEvRange} mi</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-mute">Efficiency (electric)</span>
                  <b className="font-mono">{phevMpge} MPGe</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-mute">Fuel economy (gas)</span>
                  <b className="font-mono">{phevMpgGas} MPG</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-mute">Segment</span>
                  <b className="font-mono">{phevType}</b>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between">
                  <span className="text-ink-mute">Cost per mile</span>
                  <b className="font-mono">{((compCost / miles) * 100).toFixed(1)}¢</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-mute">Fuel economy</span>
                  <b className="font-mono">{gasMpg} MPG</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-mute">Segment</span>
                  <b className="font-mono">{gasType}</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-mute">Starting MSRP</span>
                  <b className="font-mono">{fmt.money0(gasMsrp ?? 30000)}</b>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Summary stats */}
      <div className="flex flex-wrap gap-6">
        {[
          { label: `Annual ${isPhev ? "driving cost" : "fuel"} savings`, val: fmt.money0(annualSavings), accent: isEvCheaper },
          { label: `Net (after ${netFeeLabel})`, val: fmt.money0(netSavings), accent: false },
          { label: "5-year net savings", val: fmt.money0(netSavings * 5), accent: false },
          { label: "CO₂ saved / yr", val: fmt.lbs(co2Lbs), accent: false },
          ...(breakEvenYrs !== null ? [{ label: "Break-even point", val: `${breakEvenYrs.toFixed(1)} yrs`, accent: false }] : []),
        ].map((s) => (
          <div key={s.label} className={`rounded-xl px-4 py-3 text-sm border ${s.accent ? "bg-good-bg border-good-fg/20" : "bg-paper border-line"}`}>
            <div className={`font-serif text-lg font-medium ${s.accent ? "text-good-fg" : "text-forest"}`}>{s.val}</div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Rates attribution + customize CTA */}
      <div className="mt-5 pt-4 border-t border-line flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-ink-mute">
          {isEvCheaper
            ? <>{sourceLabel ? `${sourceLabel} rates` : "National avg"} — <span className="text-forest font-medium">{evName} wins on fuel cost.</span></>
            : <><span className="text-rust font-medium">{compName} cheaper</span> at {sourceLabel ?? "national avg"} rates.</>
          }
          {" "}{fmt.cents1(kwhCents)}/kWh · {fmt.money2(gasDollar)}/gal · {homePctDisp}% home · {miles.toLocaleString()} mi/yr ·{" "}
          <a href="/how-we-calculate" className="hover:text-forest transition-colors">methodology →</a>
        </p>
        <a href="#calculator" className="flex-shrink-0 inline-flex items-center gap-1.5 text-xs font-mono bg-forest text-cream px-3.5 py-2 rounded-lg hover:bg-forest/80 transition-colors">
          Customize with your rates →
        </a>
      </div>
    </>
  );
}
