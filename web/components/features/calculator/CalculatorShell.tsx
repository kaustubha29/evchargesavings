"use client";
import { useMemo, useEffect } from "react";
import { useCalculatorStore, computeSavings, computeCO2 } from "@/store/calculator";
import { evRepository, gasRepository } from "@/features/ev-data/repository";
import { fmt } from "@/lib/format";
import { FeelGoodFact } from "@/components/shared/FeelGoodFact";
import { StatCard } from "@/components/shared/StatCard";
import type { EVModelSummary } from "@/features/ev-data/types";
import type { GasVehicle } from "@/features/ev-data/types";

interface Props {
  evSummaries: EVModelSummary[];
  gasVehicles: GasVehicle[];
  defaultEvSlug?: string;
  defaultGasId?: string;
}

export function CalculatorShell({ evSummaries, gasVehicles, defaultEvSlug, defaultGasId }: Props) {
  const store = useCalculatorStore();
  const {
    evSlug, gasId, annualMiles, homePct,
    homeRateKwh, publicRateKwh, gasPriceDollar,
    stateCode, stateData, isDetecting,
    setEvSlug, setGasId, setMiles, setHomePct,
    setHomeRate, setPublicRate, setGasPrice,
  } = store;

  const ev  = useMemo(() => evRepository.getBySlug(evSlug) ?? evRepository.getAll()[0], [evSlug]);
  const gas = useMemo(() => gasRepository.getById(gasId) ?? gasRepository.getAll()[0], [gasId]);

  const savings = useMemo(
    () => computeSavings(ev.efficiency, gas.mpg, store),
    [ev.efficiency, gas.mpg, annualMiles, homePct, homeRateKwh, publicRateKwh, gasPriceDollar]
  );

  const co2 = useMemo(
    () => computeCO2(annualMiles, gas.mpg, savings.annualKwh),
    [annualMiles, gas.mpg, savings.annualKwh]
  );

  useEffect(() => {
    if (defaultEvSlug) setEvSlug(defaultEvSlug);
    if (defaultGasId) setGasId(defaultGasId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const locationLabel = isDetecting ? "Detecting…" : (stateCode ? stateData.name : "United States");

  // Group EVs by brand for <optgroup>
  const brands = useMemo(() => [...new Set(evSummaries.map((e) => e.brand))], [evSummaries]);

  return (
    <div id="calculator" className="space-y-10">
      {/* Location pill */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="inline-flex items-center gap-2 bg-ink text-cream text-xs font-mono px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
          {locationLabel} · {fmt.cents1(stateData.kwhCents)}/kWh · {fmt.money2(stateData.gasDollar)}/gal
        </span>
        {stateData.hasTOU && (
          <span className="bg-okay-bg text-okay-fg font-mono text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wide">
            TOU rates available
          </span>
        )}
      </div>

      {/* Hero grid: saving card + meter */}
      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8 items-start">
        {/* Saving card */}
        <div className="bg-paper border border-line rounded-3xl p-8 shadow-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-56 h-56 rounded-full bg-emerald opacity-10 -translate-y-16 translate-x-16 pointer-events-none" />
          <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
            An EV would save you
          </div>
          <div className="font-serif font-medium leading-none tracking-tight text-forest"
            style={{ fontSize: "clamp(56px,10vw,108px)", background:"linear-gradient(135deg,#1a4d36,#2ecc71)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            {fmt.money0(savings.annualSavings)}
          </div>
          <div className="font-serif italic text-xl text-ink-2 mt-1 mb-4">
            per year, in <b className="not-italic text-forest">{locationLabel}</b>
          </div>
          <div className="flex gap-6 pt-4 border-t border-dashed border-line flex-wrap">
            {[
              { label:"Gas car / yr", val: fmt.money0(savings.gasAnnualCost) },
              { label:"EV / yr",      val: fmt.money0(savings.evAnnualCost) },
              { label:"Lower cost",   val: fmt.pct0(savings.savingsPct) },
            ].map((c) => (
              <div key={c.label} className="text-sm text-ink-mute">
                <b className="block font-serif text-xl font-medium text-ink mb-0.5">{c.val}</b>
                {c.label}
              </div>
            ))}
          </div>
          <FeelGoodFact savings={savings.annualSavings} co2Lbs={co2.savedLbs} gasAnnual={savings.gasAnnualCost} evAnnual={savings.evAnnualCost} />
        </div>

        {/* Fuel meter */}
        <div className="bg-ink text-cream rounded-3xl p-7 shadow-3 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none"
            style={{ background:"radial-gradient(circle at 20% 0%,rgba(52,169,96,.15),transparent 50%),radial-gradient(circle at 100% 100%,rgba(194,82,52,.1),transparent 50%)" }} />
          <div className="relative">
            <div className="flex justify-between items-baseline mb-5 flex-wrap gap-2">
              <span className="font-mono text-xs uppercase tracking-widest text-cream/50">Cost of fuel · {annualMiles.toLocaleString()} mi/yr</span>
              <span className="font-mono text-xs text-cream/40">in {locationLabel}</span>
            </div>
            {[
              { label:"Gas car", color:"#c25234", val: savings.gasAnnualCost, id:"gas" },
              { label:"EV",      color:"#34a960", val: savings.evAnnualCost,  id:"ev"  },
            ].map((row) => {
              const max = Math.max(savings.gasAnnualCost, savings.evAnnualCost, 1);
              return (
                <div key={row.id} className="mb-4">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-cream/60">{row.label}</span>
                    <span className="font-mono text-cream">{fmt.money0(row.val)}/yr</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${(row.val / max * 100).toFixed(1)}%`, background: row.color }}
                    />
                  </div>
                </div>
              );
            })}
            <div className="mt-5 pt-4 border-t border-white/10 font-mono text-xs text-cream/40">
              {fmt.cents1(stateData.kwhCents)}/kWh · {fmt.money2(stateData.gasDollar)}/gal
            </div>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard accent label="Annual savings" value={fmt.money0(savings.annualSavings)} sub={`${ev.name} vs ${gas.name}`} />
        <StatCard label="Monthly savings" value={fmt.money0(savings.monthlySavings)} />
        <StatCard label="5-year savings" value={fmt.money0(savings.fiveYearSavings)} />
        <StatCard label="CO₂ saved" value={fmt.lbs(co2.savedLbs)} sub={`${co2.savedMetricTons.toFixed(1)} metric tons / yr`} />
      </div>

      {/* Inputs panel */}
      <div className="bg-paper border border-line rounded-3xl p-7 shadow-1 space-y-6">
        <h3 className="font-serif text-xl font-medium tracking-tight">Customize your estimate</h3>

        {/* Vehicle selectors */}
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="space-y-1.5">
            <span className="font-mono text-[11px] uppercase tracking-widest text-ink-mute">Your EV</span>
            <select
              value={evSlug}
              onChange={(e) => setEvSlug(e.target.value)}
              className="w-full border border-line rounded-xl px-4 py-3 text-sm bg-paper font-sans appearance-none focus:outline-none focus:ring-2 focus:ring-emerald"
            >
              {brands.map((brand) => (
                <optgroup key={brand} label={brand}>
                  {evSummaries.filter((e) => e.brand === brand).map((e) => (
                    <option key={e.slug} value={e.slug}>{e.name}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>
          <label className="space-y-1.5">
            <span className="font-mono text-[11px] uppercase tracking-widest text-ink-mute">Your gas car</span>
            <select
              value={gasId}
              onChange={(e) => setGasId(e.target.value)}
              className="w-full border border-line rounded-xl px-4 py-3 text-sm bg-paper font-sans appearance-none focus:outline-none focus:ring-2 focus:ring-emerald"
            >
              {gasVehicles.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </label>
        </div>

        {/* Sliders */}
        {[
          { label:"Annual miles", value:annualMiles, min:1000, max:50000, step:500, fmt:(v:number)=>v.toLocaleString()+" mi", onChange:setMiles },
          { label:"Charged at home", value:homePct, min:0, max:100, step:5, fmt:(v:number)=>v+"%", onChange:setHomePct },
        ].map((s) => (
          <div key={s.label}>
            <div className="flex justify-between items-baseline mb-2">
              <span className="font-mono text-[11px] uppercase tracking-widest text-ink-mute">{s.label}</span>
              <span className="font-serif text-xl font-medium text-forest">{s.fmt(s.value)}</span>
            </div>
            <input
              type="range" min={s.min} max={s.max} step={s.step} value={s.value}
              onChange={(e) => s.onChange(Number(e.target.value))}
              className="w-full accent-forest"
            />
          </div>
        ))}

        {/* Rate inputs */}
        <div className="grid sm:grid-cols-3 gap-4 pt-2 border-t border-line-soft">
          {[
            { label:"Electricity (home)", val:homeRateKwh, suffix:"¢/kWh", set:setHomeRate },
            { label:"Electricity (public)", val:publicRateKwh, suffix:"¢/kWh", set:setPublicRate },
            { label:"Gas price", val:gasPriceDollar, suffix:"$/gal", set:setGasPrice },
          ].map((f) => (
            <label key={f.label} className="space-y-1.5">
              <span className="font-mono text-[10px] uppercase tracking-widest text-ink-mute">{f.label}</span>
              <div className="flex items-center border border-line rounded-xl overflow-hidden">
                <input
                  type="number" step="0.1" value={f.val}
                  onChange={(e) => f.set(Number(e.target.value))}
                  className="flex-1 px-3 py-2.5 text-sm bg-paper focus:outline-none"
                />
                <span className="px-3 text-ink-mute text-xs font-mono border-l border-line bg-cream-soft py-2.5">{f.suffix}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

    </div>
  );
}
