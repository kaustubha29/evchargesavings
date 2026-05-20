"use client";
import { useMemo, useEffect, useRef, useState } from "react";

function gtagEvent(name: string, params: Record<string, string | number>) {
  if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
    (window as any).gtag("event", name, params);
  }
}
import { useRouter, usePathname } from "next/navigation";
import { useCalculatorStore, computeSavings, computeCO2, computePHEVCost } from "@/store/calculator";
import { evRepository, gasRepository, phevRepository } from "@/features/ev-data/repository";
import { stateFromZip, getStateData } from "@/features/location/queries";
import { getStateMaxIncentive } from "@/features/location/data/incentives";
import { fmt } from "@/lib/format";
import { FeelGoodFact } from "@/components/shared/FeelGoodFact";
import { StatCard } from "@/components/shared/StatCard";
import { VehicleCombobox } from "@/components/shared/VehicleCombobox";
import type { ComboOption } from "@/components/shared/VehicleCombobox";
import type { EVModelSummary, PHEVVehicle } from "@/features/ev-data/types";
import type { GasVehicle } from "@/features/ev-data/types";
import { useShareableUrl, buildShareUrl } from "@/hooks/useShareableUrl";

interface Props {
  evSummaries: EVModelSummary[];
  gasVehicles: GasVehicle[];
  phevVehicles: PHEVVehicle[];
  defaultEvSlug?: string;
  defaultGasId?: string;
  defaultPhevId?: string;
  defaultComparisonType?: "gas" | "phev";
  initialHomeRateKwh?: number;
  initialGasPriceDollar?: number;
}

export function CalculatorShell({ evSummaries, gasVehicles, phevVehicles, defaultEvSlug, defaultGasId, defaultPhevId, defaultComparisonType, initialHomeRateKwh, initialGasPriceDollar }: Props) {
  const store = useCalculatorStore();
  const {
    evSlug, gasId, comparisonType, phevId,
    annualMiles, homePct,
    homeRateKwh, publicRateKwh, gasPriceDollar,
    stateCode, stateData, city, zip,
    isDetecting, includeStateEvFee,
    setEvSlug, setGasId, setComparisonType, setPHEVId,
    setMiles, setHomePct,
    setHomeRate, setPublicRate, setGasPrice, setLocation, setZip,
    setIncludeStateEvFee,
  } = store;

  const router   = useRouter();
  const pathname = usePathname();

  const { ratesFromUrlRef } = useShareableUrl();
  const [zipError, setZipError] = useState(false);
  const [copied, setCopied] = useState(false);
  const resultDebounce  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const calcRef         = useRef<HTMLDivElement>(null);
  const resultsCardRef  = useRef<HTMLDivElement>(null);
  const calcViewedRef   = useRef(false);

  async function handleShare() {
    const url   = buildShareUrl(store);
    const title = `EV savings: ${fmt.money0(displayNetSavings)}/yr`;

    // Capture screenshot of results card
    let imageFile: File | null = null;
    if (resultsCardRef.current) {
      try {
        const { toPng } = await import("html-to-image");
        const dataUrl = await toPng(resultsCardRef.current, { cacheBust: true, pixelRatio: 2 });
        const blob = await (await fetch(dataUrl)).blob();
        imageFile = new File([blob], "ev-savings.png", { type: "image/png" });
      } catch { /* silent — capture failed */ }
    }

    // Mobile: native share sheet with URL + image
    if (imageFile && navigator.canShare?.({ files: [imageFile] })) {
      try { await navigator.share({ title, url, files: [imageFile] }); return; }
      catch { /* user cancelled */ }
    }

    // Desktop / fallback: copy URL first (while gesture is still active), then trigger download
    try { await navigator.clipboard.writeText(url); } catch { /* silent */ }
    if (imageFile) {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(imageFile);
      a.download = "ev-savings.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  }

  async function applyZip(zipValue: string) {
    const code = stateFromZip(zipValue.trim());
    if (!code) { setZipError(true); return; }
    setZipError(false);
    const info = getStateData(code);

    // Fetch city
    let cityName: string | null = null;
    if (zipValue.trim()) {
      try {
        const res = await fetch(`https://api.zippopotam.us/us/${zipValue.trim()}`, { signal: AbortSignal.timeout(2000) });
        if (res.ok) {
          const data = await res.json();
          cityName = data.places?.[0]?.['place name'] || null;
        }
      } catch {
        // Ignore errors
      }
    }

    setLocation(code, info, zipValue.trim(), cityName);
    // On state pages, navigate so the hero + URL reflect the new state
    if (pathname.startsWith("/ev-cost/")) {
      router.push(`/ev-cost/${info.slug}`);
    }
  }

  const ev   = useMemo(() => evRepository.getBySlug(evSlug) ?? evRepository.getAll()[0], [evSlug]);
  const gas  = useMemo(() => gasRepository.getById(gasId)  ?? gasRepository.getAll()[0], [gasId]);
  const phev = useMemo(() => phevRepository.getById(phevId) ?? phevRepository.getAll()[0], [phevId]);

  const savings = useMemo(
    () => computeSavings(ev.efficiency, gas.mpg, store),
    [ev.efficiency, gas.mpg, annualMiles, homePct, homeRateKwh, publicRateKwh, gasPriceDollar, stateData, includeStateEvFee]
  );

  const phevCost = useMemo(
    () => comparisonType === "phev" ? computePHEVCost(phev.evRange, phev.mpge, phev.mpgGas, store) : null,
    [comparisonType, phev, annualMiles, homePct, homeRateKwh, publicRateKwh, gasPriceDollar]
  );

  const comparisonAnnualCost = comparisonType === "phev" && phevCost ? phevCost.totalCost : savings.gasAnnualCost;
  const displayAnnualSavings = comparisonAnnualCost - savings.evAnnualCost;
  const statePHEVFee         = comparisonType === "phev" ? (stateData?.phevFee ?? 0) : 0;
  const netFeeCost           = (stateData?.evFee ?? 0) - statePHEVFee; // extra cost after switching (evFee - phevFee you escape)
  const displayNetSavings    = displayAnnualSavings - (includeStateEvFee ? netFeeCost : 0);
  const comparisonName       = comparisonType === "phev" ? phev.name : gas.name;

  const co2 = useMemo(
    () => computeCO2(annualMiles, gas.mpg, savings.annualKwh),
    [annualMiles, gas.mpg, savings.annualKwh]
  );

  useEffect(() => {
    if (defaultEvSlug) setEvSlug(defaultEvSlug);
    if (defaultComparisonType) setComparisonType(defaultComparisonType);
    if (defaultGasId) setGasId(defaultGasId);
    if (defaultPhevId) setPHEVId(defaultPhevId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Seed live national rates on first load (before location is detected)
  useEffect(() => {
    if (stateCode !== null) return;
    if (ratesFromUrlRef.current) return; // shared link — URL hydration already set rates
    if (initialHomeRateKwh !== undefined) {
      setHomeRate(initialHomeRateKwh);
      setPublicRate(+( initialHomeRateKwh * 2.5).toFixed(1));
    }
    if (initialGasPriceDollar !== undefined) setGasPrice(initialGasPriceDollar);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fire calculator_viewed once when calculator scrolls into view
  useEffect(() => {
    const el = calcRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !calcViewedRef.current) {
          calcViewedRef.current = true;
          gtagEvent("calculator_viewed", { state: stateCode ?? "unknown" });
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Track calculation result 1s after user stops interacting
  useEffect(() => {
    if (resultDebounce.current) clearTimeout(resultDebounce.current);
    resultDebounce.current = setTimeout(() => {
      gtagEvent("calculator_result", {
        ev: evSlug,
        gas: gasId,
        state: stateCode ?? "unknown",
        annual_savings: Math.round(savings.annualSavings),
      });
    }, 1000);
    return () => { if (resultDebounce.current) clearTimeout(resultDebounce.current); };
  }, [evSlug, gasId, stateCode, savings.annualSavings]);

  // Fetch live EIA rates whenever the detected state changes
  useEffect(() => {
    if (!stateCode) return;
    if (ratesFromUrlRef.current) return; // shared link — keep exact rates from URL
    let cancelled = false;
    fetch(`/api/rates?state=${stateCode}`)
      .then(r => r.ok ? r.json() : null)
      .then((data: { kwhCents: number; gasDollar: number } | null) => {
        if (cancelled || !data) return;
        setHomeRate(data.kwhCents);
        setPublicRate(+(data.kwhCents * 2.5).toFixed(1));
        setGasPrice(data.gasDollar);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateCode]);

  const locationLabel = isDetecting ? "Detecting…" : (stateCode ? (city ? `${city}, ${stateData.name}` : stateData.name) : "United States");

  const compareHref = useMemo(() => {
    const base = `/compare/${evSlug}-vs-${comparisonType === "phev" ? phevId : gasId}`;
    const p = new URLSearchParams();
    if (stateCode) p.set("state", stateCode);
    p.set("kwh", homeRateKwh.toFixed(2));
    p.set("pub", publicRateKwh.toFixed(1));
    p.set("gal", gasPriceDollar.toFixed(3));
    p.set("mi", String(annualMiles));
    p.set("home", String(homePct));
    p.set("fee", includeStateEvFee ? "1" : "0");
    if (comparisonType === "phev") {
      p.set("type", "phev");
      p.set("phev", phevId);
    } else {
      p.set("gas", gasId);
    }
    return `${base}?${p.toString()}`;
  }, [evSlug, gasId, phevId, comparisonType, stateCode, homeRateKwh, publicRateKwh, gasPriceDollar, annualMiles, homePct, includeStateEvFee]);

  // Build combobox options
  const evOptions = useMemo<ComboOption[]>(
    () => evSummaries.map((e) => ({ value: e.slug, label: e.fullName, group: e.brand })),
    [evSummaries]
  );
  const gasOptions = useMemo<ComboOption[]>(
    () => gasVehicles.map((g) => ({ value: g.id, label: g.name, group: g.type })),
    [gasVehicles]
  );
  const phevOptions = useMemo<ComboOption[]>(
    () => phevVehicles.map((p) => ({ value: p.id, label: p.name, group: p.type })),
    [phevVehicles]
  );

  return (
    <div id="calculator" ref={calcRef} className="space-y-3">

      {/* ── Vehicle selectors + location ── */}
      <div className="bg-paper border border-line rounded-3xl p-6 shadow-1">
        <h3 className="font-serif text-xl font-medium tracking-tight mb-5">Compare EV vs your current car</h3>
        <div className="grid sm:grid-cols-2 gap-4 mb-5">
          <div className="space-y-1.5">
            <span className="font-mono text-[11px] uppercase tracking-widest text-ink-mute">EV you're considering</span>
            <VehicleCombobox
              options={evOptions}
              value={evSlug}
              onChange={(v) => { setEvSlug(v); gtagEvent("calculator_ev_selected", { ev: v }); }}
              placeholder="Search EVs…"
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-widest text-ink-mute">Your current car</span>
              <div className="flex rounded-lg overflow-hidden border border-line text-[10px] font-mono">
                <button
                  type="button"
                  onClick={() => setComparisonType("gas")}
                  className={`px-2.5 py-1 transition-colors ${comparisonType === "gas" ? "bg-ink text-cream" : "bg-paper text-ink-mute hover:text-ink"}`}
                >Gas</button>
                <button
                  type="button"
                  onClick={() => setComparisonType("phev")}
                  className={`px-2.5 py-1 transition-colors border-l border-line ${comparisonType === "phev" ? "bg-ink text-cream" : "bg-paper text-ink-mute hover:text-ink"}`}
                >PHEV</button>
              </div>
            </div>
            {comparisonType === "gas" ? (
              <VehicleCombobox
                options={gasOptions}
                value={gasId}
                onChange={(v) => { setGasId(v); gtagEvent("calculator_gas_selected", { gas: v }); }}
                placeholder="Search cars…"
              />
            ) : (
              <VehicleCombobox
                options={phevOptions}
                value={phevId}
                onChange={(v) => { setPHEVId(v); gtagEvent("calculator_phev_selected", { phev: v }); }}
                placeholder="Search PHEVs…"
              />
            )}
          </div>
        </div>

        {/* Location row */}
        <div className="flex items-center gap-2 flex-wrap pt-4 border-t border-line">
          <span className="inline-flex items-center gap-2 bg-ink text-cream text-xs font-mono px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
            {locationLabel} · {fmt.cents1(stateData.kwhCents)}/kWh · {fmt.money2(stateData.gasDollar)}/gal
          </span>
          {stateData.hasTOU && (
            <a
              href="/guides/ev-utility-rate-plans-guide"
              className="bg-okay-bg text-okay-fg font-mono text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wide hover:bg-okay-fg hover:text-okay-bg transition-colors"
            >
              TOU rates available →
            </a>
          )}
          <form
            onSubmit={(e) => { e.preventDefault(); applyZip(zip || ""); }}
            className="flex items-center gap-1"
          >
            <input
              type="text"
              inputMode="numeric"
              enterKeyHint="go"
              maxLength={5}
              placeholder="ZIP code"
              value={zip || ""}
              onChange={(e) => { setZip(e.target.value); setZipError(false); }}
              className={`w-24 border rounded-lg px-2.5 py-1.5 font-mono text-xs bg-paper focus:outline-none focus:ring-1 focus:ring-forest ${zipError ? "border-rust text-rust placeholder:text-rust/50" : "border-line"}`}
            />
            <button type="submit" className="font-mono text-[10px] text-ink-mute hover:text-forest px-1">→</button>
          </form>
          {zipError && <span className="font-mono text-[10px] text-rust">ZIP not found</span>}
        </div>
        {stateCode && (() => {
          const incentive = getStateMaxIncentive(stateCode);
          if (!incentive) return null;
          return (
            <div className="mt-3 pt-3 border-t border-line flex items-center gap-2 text-xs text-good-fg">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald flex-shrink-0" />
              <span>
                <b>{stateData.name}</b> offers up to <b className="font-mono">${incentive.toLocaleString()}</b> in EV purchase incentives —{" "}
                <a href={`/ev-cost/${stateData.slug}#incentives`} className="underline hover:no-underline">see programs →</a>
              </span>
            </div>
          );
        })()}
      </div>

      {/* Hero savings card — full width */}
      <div ref={resultsCardRef} className="bg-paper border border-line rounded-3xl p-8 shadow-2 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-56 h-56 rounded-full bg-emerald opacity-10 -translate-y-16 translate-x-16 pointer-events-none" />

        {/* Verdict chip — big + animated */}
        {(() => {
          const s = includeStateEvFee ? displayNetSavings : displayAnnualSavings;
          const isGood = s > 800;
          const isOkay = s >= 300;
          const isPos  = s > 0;
          const negLabel = comparisonType === "phev" ? "PHEV is cheaper for this driving pattern" : "Gas is cheaper for this driving pattern";
          const [bg, border, fg, dot, label] =
            isGood ? ["bg-good-bg",  "border-good-fg/30", "text-good-fg", "bg-emerald",      "Yes — switching makes financial sense"] :
            isOkay ? ["bg-okay-bg",  "border-okay-fg/30", "text-okay-fg", "bg-[#c8902a]",    "Borderline — incentives could tip it"]  :
            isPos  ? ["bg-rust/8",   "border-rust/25",    "text-rust",    "bg-rust",          "Marginal savings — check total cost"]   :
                     ["bg-rust/8",   "border-rust/25",    "text-rust",    "bg-rust",          negLabel];
          return (
            <div className={`flex items-center gap-3 ${bg} ${fg} border ${border} rounded-2xl px-4 py-3 mb-5`}>
              <span className="relative flex-shrink-0">
                <span className={`absolute inset-0 rounded-full ${dot} opacity-30 animate-ping`} />
                <span className={`relative block w-3 h-3 rounded-full ${dot}`} />
              </span>
              <span className="font-serif text-lg font-medium leading-tight">{label}</span>
            </div>
          );
        })()}

        {/* Annual headline */}
        {(() => {
          const feeOn = includeStateEvFee && stateData.evFee > 0;
          const headlineAnnual  = feeOn ? displayNetSavings         : displayAnnualSavings;
          const headlineMonthly = headlineAnnual / 12;
          const headline5yr     = headlineAnnual * 5;
          return (
            <>
              <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
                Estimated annual savings · {locationLabel}
              </div>
              <div className="font-serif font-medium leading-none tracking-tight text-forest"
                style={{ fontSize: "clamp(52px,9vw,96px)", background:"linear-gradient(135deg,#1a4d36,#2ecc71)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                {fmt.money0(headlineAnnual)}
              </div>
              <div className="font-mono text-[11px] text-ink-mute mt-2 mb-5 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="text-ink font-medium">{fmt.money0(headlineMonthly)}/mo</span>
                <span>·</span>
                <span>{fmt.money0(headline5yr)} over 5 yrs</span>
                <span>·</span>
                <span>{feeOn ? "after state EV fee" : "fuel cost only"}, ±10%</span>
                <span>·</span>
                <a
                  href={compareHref}
                  className="inline-flex items-center font-mono text-[11px] bg-forest/10 text-forest px-2.5 py-0.5 rounded-full hover:bg-forest hover:text-cream transition-colors"
                >
                  full comparison →
                </a>
                <button type="button" onClick={handleShare} className="inline-flex items-center font-mono text-[11px] bg-emerald/15 text-forest px-2.5 py-0.5 rounded-full hover:bg-forest hover:text-cream transition-colors">
                  {copied ? "saved!" : "share →"}
                </button>
              </div>
            </>
          );
        })()}

        {/* Savings breakdown — registration fee delta */}
        {(stateData.evFee > 0 || statePHEVFee > 0) && (
          <div className="pt-4 border-t border-line">
            <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-3">Savings breakdown</div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-ink-mute">{comparisonType === "phev" ? "Annual energy savings" : "Annual fuel savings"}</span>
                <span className="font-mono font-medium text-ink">{fmt.money0(displayAnnualSavings)}</span>
              </div>
              {stateData.evFee > 0 && (
                <div className="flex justify-between">
                  <span className={includeStateEvFee ? "text-ink-mute" : "text-ink-mute line-through"}>
                    {stateData.name} EV registration fee
                  </span>
                  <span className={`font-mono font-medium ${includeStateEvFee ? "text-rust" : "text-ink-mute line-through"}`}>
                    −{fmt.money0(stateData.evFee)}
                  </span>
                </div>
              )}
              {comparisonType === "phev" && statePHEVFee > 0 && (
                <div className="flex justify-between">
                  <span className={includeStateEvFee ? "text-ink-mute" : "text-ink-mute line-through"}>
                    {stateData.name} PHEV fee you no longer pay
                  </span>
                  <span className={`font-mono font-medium ${includeStateEvFee ? "text-good-fg" : "text-ink-mute line-through"}`}>
                    +{fmt.money0(statePHEVFee)}
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-1.5 border-t border-line">
                <span className="text-ink font-medium">Net annual savings</span>
                <span className="font-mono font-medium text-forest">
                  {fmt.money0(includeStateEvFee ? displayNetSavings : displayAnnualSavings)}
                </span>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={includeStateEvFee}
              onClick={() => setIncludeStateEvFee(!includeStateEvFee)}
              className="flex items-center gap-2.5 mt-3 cursor-pointer select-none text-left group"
            >
              <span
                className={`relative inline-flex flex-shrink-0 h-4 w-7 items-center rounded-full transition-colors duration-200 ${
                  includeStateEvFee ? "bg-forest" : "bg-black/15"
                }`}
              >
                <span
                  className={`inline-block h-3 w-3 transform rounded-full bg-paper shadow-sm transition-transform duration-200 ${
                    includeStateEvFee ? "translate-x-3.5" : "translate-x-0.5"
                  }`}
                />
              </span>
              <span className="text-xs text-ink-mute group-hover:text-ink-2 transition-colors">
                Include {stateData.name}&apos;s registration fees
                {comparisonType === "phev" && statePHEVFee > 0
                  ? ` — ${fmt.money0(stateData.evFee)} EV fee minus ${fmt.money0(statePHEVFee)} PHEV fee you currently pay`
                  : ` — ${fmt.money0(stateData.evFee)} annual EV fee most owners pay on top of registration`}
              </span>
            </button>
          </div>
        )}

        {/* Fuel cost bars */}
        <div className="pt-4 border-t border-line">
          <div className="flex justify-between items-baseline mb-4 flex-wrap gap-1">
            <span className="font-mono text-[11px] uppercase tracking-widest text-ink-mute">{comparisonType === "phev" ? "Fuel & electricity cost" : "Cost of fuel"} · {annualMiles.toLocaleString()} mi/yr</span>
            <span className="font-mono text-[11px] text-ink-mute">{fmt.cents1(stateData.kwhCents)}/kWh · {fmt.money2(stateData.gasDollar)}/gal</span>
          </div>
          {[
            { label: comparisonName, color:"#c25234", val: comparisonAnnualCost, id:"comparison" },
            { label: ev.name,        color:"#34a960", val: savings.evAnnualCost, id:"ev"         },
          ].map((row) => {
            const max = Math.max(comparisonAnnualCost, savings.evAnnualCost, 1);
            return (
              <div key={row.id} className="mb-3 last:mb-0">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-ink-mute">{row.label}</span>
                  <span className="font-mono font-medium text-ink">{fmt.money0(row.val)}/yr</span>
                </div>
                <div className="h-3 bg-black/8 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${(row.val / max * 100).toFixed(1)}%`, background: row.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {comparisonType === "phev" && phevCost && (
          <div className="pt-3 border-t border-line text-xs text-ink-mute space-y-1 font-mono">
            <div className="flex justify-between">
              <span>{phev.name} — electric portion ({Math.round(phevCost.electricPct)}% of miles)</span>
              <span className="text-ink">{fmt.money0(phevCost.electricCost)}/yr</span>
            </div>
            <div className="flex justify-between">
              <span>{phev.name} — gas portion ({Math.round(100 - phevCost.electricPct)}% of miles)</span>
              <span className="text-ink">{fmt.money0(phevCost.gasCost)}/yr</span>
            </div>
            <div className="text-[10px] text-ink-mute/70 pt-1">
              At {Math.round(annualMiles / 365)} mi/day · {phev.evRange} mi EV range · {phev.mpgGas} MPG on gas
            </div>
            {phevCost.electricPct >= 100 && (() => {
              const evMpge = Math.round(ev.efficiency * 33.7);
              const evMoreEfficient = evMpge > phev.mpge;
              return (
                <div className="text-[10px] text-ink-mute/70 pt-1 leading-relaxed">
                  {evMoreEfficient
                    ? `The ${ev.name} (~${evMpge} MPGe) is more efficient than the ${phev.name} (${phev.mpge} MPGe) on electricity — PHEVs carry a gas engine and battery that adds weight and cuts range-per-kWh.`
                    : `The ${phev.name} (${phev.mpge} MPGe) is slightly more efficient electrically than the ${ev.name} (~${evMpge} MPGe). The cost difference here is driven by your rate and mileage.`
                  }
                </div>
              );
            })()}
          </div>
        )}

        <FeelGoodFact
          savings={displayAnnualSavings}
          co2Lbs={co2.savedLbs}
          gasAnnual={comparisonAnnualCost}
          evAnnual={savings.evAnnualCost}
          gasPriceDollar={gasPriceDollar}
          gasCostForGallons={comparisonType === "phev" && phevCost ? phevCost.gasCost : savings.gasAnnualCost}
          comparisonLabel={comparisonType === "phev" ? "PHEV" : "gas"}
        />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard accent label="Annual savings" value={fmt.money0(includeStateEvFee && stateData.evFee > 0 ? displayNetSavings : displayAnnualSavings)} sub={includeStateEvFee && stateData.evFee > 0 ? `after ${stateData.name} EV fee` : `${ev.name} vs ${comparisonName}`} />
        <StatCard label="5-year savings" value={fmt.money0((includeStateEvFee && stateData.evFee > 0 ? displayNetSavings : displayAnnualSavings) * 5)} />
        <StatCard label="CO₂ saved / yr" value={fmt.lbs(co2.savedLbs)} sub={`${co2.savedMetricTons.toFixed(1)} metric tons`} />
      </div>

      {/* Inputs panel */}
      <div className="bg-paper border border-line rounded-3xl p-7 shadow-1 space-y-6">
        <h3 className="font-serif text-xl font-medium tracking-tight">Fine-tune your estimate</h3>

        {/* Sliders */}
        {/* Daily miles */}
        <div>
          <div className="flex justify-between items-baseline mb-2">
            <span className="font-mono text-[11px] uppercase tracking-widest text-ink-mute">Daily miles</span>
            <div className="text-right">
              <span className="font-serif text-xl font-medium text-forest">{Math.round(annualMiles / 365)} mi/day</span>
              <span className="font-mono text-xs text-ink-mute ml-2">{annualMiles.toLocaleString()}/yr</span>
            </div>
          </div>
          <div className="relative">
            <input
              type="range" min={3} max={140} step={1} value={Math.round(annualMiles / 365)}
              onChange={(e) => setMiles(Number(e.target.value) * 365)}
              className="w-full accent-forest"
            />
            {comparisonType === "phev" && phev && phev.evRange >= 3 && phev.evRange <= 140 && (
              <div
                className="absolute top-0 bottom-0 flex flex-col items-center pointer-events-none"
                style={{ left: `${((phev.evRange - 3) / (140 - 3)) * 100}%` }}
              >
                <div className="w-0.5 h-4 bg-amber-500 opacity-80 mt-0.5 rounded-full" />
              </div>
            )}
          </div>
          {comparisonType === "phev" && phevCost && (
            <div className="flex items-center gap-1.5 mt-1.5 font-mono text-[10px]">
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${phevCost.electricPct >= 100 ? "bg-emerald" : "bg-amber-500"}`} />
              {phevCost.electricPct >= 100
                ? <span className="text-ink-mute">100% electric now · gas kicks in above <span className="text-ink">{phev.evRange} mi/day</span></span>
                : <span className="text-ink-mute"><span className="text-ink">{Math.round(phevCost.electricPct)}% electric</span> · gas kicks in at <span className="text-ink">{phev.evRange} mi/day</span></span>
              }
            </div>
          )}
        </div>

        {/* Charged at home */}
        <div>
          <div className="flex justify-between items-baseline mb-2">
            <span className="font-mono text-[11px] uppercase tracking-widest text-ink-mute">Charged at home</span>
            <span className="font-serif text-xl font-medium text-forest">{homePct}%</span>
          </div>
          <input
            type="range" min={0} max={100} step={5} value={homePct}
            onChange={(e) => setHomePct(Number(e.target.value))}
            className="w-full accent-forest"
          />
        </div>

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
