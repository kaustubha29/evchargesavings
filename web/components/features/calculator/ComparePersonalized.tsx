"use client";
import { useMemo } from "react";
import { useCalculatorStore, computeSavings, computePHEVCost } from "@/store/calculator";
import { fmt } from "@/lib/format";

interface Props {
  evEfficiency: number;
  evName: string;
  gasMpg: number;
  gasName: string;
  evMsrp: number;
  gasMsrp: number;
  phev?: { evRange: number; mpge: number; mpgGas: number };
}

export function ComparePersonalized({ evEfficiency, evName, gasMpg, gasName, evMsrp, gasMsrp, phev }: Props) {
  const store = useCalculatorStore();
  const { stateCode, stateData, annualMiles, homePct, homeRateKwh, publicRateKwh, gasPriceDollar, includeStateEvFee } = store;

  const savings = useMemo(
    () => computeSavings(evEfficiency, gasMpg, store),
    [evEfficiency, gasMpg, annualMiles, homePct, homeRateKwh, publicRateKwh, gasPriceDollar, stateData, includeStateEvFee]
  );

  const phevCost = useMemo(
    () => phev ? computePHEVCost(phev.evRange, phev.mpge, phev.mpgGas, store) : null,
    [phev, annualMiles, homePct, homeRateKwh, publicRateKwh, gasPriceDollar]
  );

  // Null for organic crawlers — static national avg hero shows instead
  if (!stateCode) return null;

  const locationLabel = stateData.name;
  const isPhev = !!(phev && phevCost);

  const annualFuelSavings = isPhev
    ? phevCost!.totalCost - savings.evAnnualCost
    : savings.annualSavings;

  const netFee = includeStateEvFee
    ? isPhev
      ? stateData.evFee - (stateData.phevFee ?? 0)
      : stateData.evFee
    : 0;

  const netSavings = annualFuelSavings - netFee;

  const breakEvenYrs = !isPhev && evMsrp > gasMsrp && netSavings > 0
    ? ((evMsrp - gasMsrp) / netSavings).toFixed(1)
    : null;

  const isPositive = netSavings > 0;

  const stats = [
    { label: isPhev ? "Annual driving cost savings" : "Annual fuel savings", val: fmt.money0(annualFuelSavings), accent: annualFuelSavings > 0 },
    {
      label: isPhev
        ? `Net (after ~${fmt.money0(netFee)} net EV fee)`
        : stateData.evFee > 0
          ? `Net (after ${fmt.money0(stateData.evFee)} ${stateData.name} EV fee)`
          : "Net savings",
      val: fmt.money0(netSavings),
      accent: false,
    },
    { label: "5-year net savings", val: fmt.money0(netSavings * 5), accent: false },
    ...(breakEvenYrs ? [{ label: "Break-even", val: `${breakEvenYrs} yrs`, accent: false }] : []),
  ];

  return (
    <section className="border-b border-line bg-good-bg/20 py-14">
      <div className="section-wrap">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-2 bg-good-bg text-good-fg font-mono text-xs px-3.5 py-1.5 rounded-full border border-good-fg/15">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
            Your estimate · {locationLabel}
          </span>
        </div>

        {/* Big savings number */}
        <div
          className="font-serif font-medium leading-none tracking-tight mb-2"
          style={{ fontSize: "clamp(48px,8vw,80px)", background: isPositive ? "linear-gradient(135deg,#1a4d36,#2ecc71)" : undefined, WebkitBackgroundClip: isPositive ? "text" : undefined, WebkitTextFillColor: isPositive ? "transparent" : undefined, color: isPositive ? undefined : "#c25234" }}
        >
          {fmt.money0(netSavings)}<span className="text-2xl font-sans font-normal text-ink-mute">/yr</span>
        </div>

        <p className="text-sm text-ink-mute mb-6">
          {isPositive ? `${evName} saves ` : `${gasName} is cheaper by `}
          {fmt.money0(Math.abs(netSavings))}/yr in {locationLabel} ·{" "}
          {fmt.cents1(homeRateKwh)}/kWh electricity · {fmt.money2(gasPriceDollar)}/gal gas · {homePct}% home charging · {annualMiles.toLocaleString()} mi/yr
        </p>

        {/* Stat cards */}
        <div className="flex flex-wrap gap-4">
          {stats.map((s) => (
            <div key={s.label} className={`rounded-xl px-4 py-3 text-sm border ${s.accent ? "bg-good-bg border-good-fg/20" : "bg-paper border-line"}`}>
              <div className={`font-serif text-lg font-medium ${s.accent ? "text-good-fg" : "text-forest"}`}>{s.val}</div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute">{s.label}</div>
            </div>
          ))}
        </div>

        {!isPhev && stateData.evFee === 0 && (
          <p className="text-xs text-ink-mute mt-3">{stateData.name} charges no EV registration surcharge — net savings equal fuel savings.</p>
        )}

        <p className="text-xs text-ink-mute/60 mt-4">National average comparison shown below · <a href="#calculator" className="hover:text-forest transition-colors">Adjust in calculator →</a></p>
      </div>
    </section>
  );
}
