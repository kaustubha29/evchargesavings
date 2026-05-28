"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { VehicleCombobox, type ComboOption } from "@/components/shared/VehicleCombobox";
import type { EVModel, EVModelSummary } from "@/features/ev-data/types";
import type { StateData } from "@/features/location/types";
import { fmt } from "@/lib/format";
import { DC_KW, chargeTime } from "@/features/ev-data/data/dc-kw";
import { ZERO_TO_60 } from "@/features/ev-data/data/performance";
import { getStateMaxIncentive } from "@/features/location/data/incentives";
import { useCalculatorStore } from "@/store/calculator";

const DEFAULT_EV1 = "tesla-model-y-long-range-awd";
const DEFAULT_EV2 = "hyundai-ioniq-5-long-range-rwd";
const PUBLIC_MULTIPLIER = 2.5;
const LOC_KEY = "ecs-loc-v1";
const LOC_TTL = 30 * 86400 * 1000;

function gtagEvent(name: string, params: Record<string, string | number>) {
  if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
    (window as any).gtag("event", name, params);
  }
}

const SEG_GRAD: Record<string, [string, string]> = {
  suv:       ["#14532d", "#052e16"],
  sedan:     ["#1e3a5f", "#0c1f3d"],
  truck:     ["#451a03", "#1c0700"],
  sports:    ["#4c0519", "#1f0010"],
  crossover: ["#0c4a6e", "#082f4f"],
  van:       ["#3b0764", "#1a0340"],
};

function calcAnnualCost(ev: EVModel, kwhRate: number, miles: number, homePct: number): number {
  const annualKwh = miles / ev.efficiency;
  const home = annualKwh * (homePct / 100) * kwhRate;
  const pub = annualKwh * ((100 - homePct) / 100) * kwhRate * PUBLIC_MULTIPLIER;
  return home + pub;
}

function segmentLabel(s: string): string {
  const m: Record<string, string> = { suv: "SUV", sedan: "Sedan", truck: "Truck", van: "Van", sports: "Sports", crossover: "Crossover" };
  return m[s] ?? s;
}

function networkInfo(connector: string): { label: string; sub: string; color: string } {
  if (connector === "NACS") return { label: "Tesla Supercharger", sub: "Largest & most reliable US network", color: "text-emerald" };
  if (connector === "CCS")  return { label: "EA · EVgo · ChargePoint", sub: "Open CCS standard", color: "text-forest" };
  return { label: connector, sub: "Limited US coverage", color: "text-ink-3" };
}

function makePickNote(pick: EVModel, other: EVModel, tcoDiff: number, annualDiff: number, pickCheaper: boolean): string {
  if (tcoDiff < 500) return "Too close to call on total cost — compare range and road trip capability below.";
  if (pickCheaper && annualDiff >= 200) return `${fmt.money0(annualDiff)}/yr cheaper to charge — ${fmt.money0(tcoDiff)} less over 5 years.`;
  return `${fmt.money0(tcoDiff)} less over 5 years when you factor in purchase price and charging cost.`;
}

function SegmentSilhouette({ segment }: { segment: string }) {
  const cls = "absolute bottom-0 right-0 h-full w-auto opacity-[0.11] select-none pointer-events-none";
  switch (segment) {
    case "suv": return (
      <svg className={cls} viewBox="0 0 120 56" fill="white">
        <path d="M 4,46 C 4,38 8,34 14,32 L 20,26 L 26,10 L 70,8 L 88,8 L 96,12 L 102,24 C 108,32 112,38 116,46 L 103,46 Q 101,37 94,37 Q 87,37 85,46 L 35,46 Q 33,37 26,37 Q 19,37 17,46 Z"/>
        <circle cx="26" cy="46" r="9"/><circle cx="94" cy="46" r="9"/>
      </svg>
    );
    case "truck": return (
      <svg className={cls} viewBox="0 0 126 56" fill="white">
        <path d="M 4,46 C 4,38 8,34 14,32 L 20,26 L 26,10 L 58,8 L 70,10 L 74,18 L 74,30 L 118,30 L 120,36 L 122,46 L 109,46 Q 107,37 100,37 Q 93,37 91,46 L 35,46 Q 33,37 26,37 Q 19,37 17,46 Z"/>
        <circle cx="26" cy="46" r="9"/><circle cx="100" cy="46" r="9"/>
      </svg>
    );
    case "van": return (
      <svg className={cls} viewBox="0 0 120 56" fill="white">
        <path d="M 6,46 C 6,40 8,36 12,34 L 14,24 L 18,10 L 22,8 L 92,8 L 100,12 L 106,26 C 108,34 112,40 114,46 L 105,46 Q 103,37 96,37 Q 89,37 87,46 L 35,46 Q 33,37 26,37 Q 19,37 17,46 Z"/>
        <circle cx="26" cy="46" r="9"/><circle cx="96" cy="46" r="9"/>
      </svg>
    );
    case "sports": return (
      <svg className={cls} viewBox="0 0 120 56" fill="white">
        <path d="M 4,46 C 4,44 6,42 10,40 L 28,34 L 38,16 L 68,12 L 88,22 L 104,38 C 108,40 112,43 114,46 L 101,46 Q 99,37 92,37 Q 85,37 83,46 L 39,46 Q 37,37 30,37 Q 23,37 21,46 Z"/>
        <circle cx="30" cy="46" r="9"/><circle cx="92" cy="46" r="9"/>
      </svg>
    );
    case "crossover": return (
      <svg className={cls} viewBox="0 0 120 56" fill="white">
        <path d="M 4,46 C 4,40 8,36 12,34 L 22,28 L 28,12 L 68,10 L 88,12 L 98,22 L 110,34 C 113,38 114,42 116,46 L 101,46 Q 99,37 92,37 Q 85,37 83,46 L 37,46 Q 35,37 28,37 Q 21,37 19,46 Z"/>
        <circle cx="28" cy="46" r="9"/><circle cx="92" cy="46" r="9"/>
      </svg>
    );
    default: return (
      <svg className={cls} viewBox="0 0 120 56" fill="white">
        <path d="M 4,46 C 4,40 8,36 12,34 L 24,28 L 32,12 L 70,10 L 84,14 L 96,22 L 108,32 C 112,36 114,42 116,46 L 101,46 Q 99,37 92,37 Q 85,37 83,46 L 37,46 Q 35,37 28,37 Q 21,37 19,46 Z"/>
        <circle cx="28" cy="46" r="9"/><circle cx="92" cy="46" r="9"/>
      </svg>
    );
  }
}

function CardHeader({ ev }: { ev: EVModel }) {
  const [from, to] = SEG_GRAD[ev.segment] ?? SEG_GRAD.sedan;
  return (
    <div
      className="h-20 rounded-t-2xl flex items-end justify-between px-5 pb-4 relative overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      <SegmentSilhouette segment={ev.segment} />
      <div className="relative">
        <div className="font-mono text-[9px] uppercase tracking-widest text-white/40">{ev.modelYear} · {segmentLabel(ev.segment)}</div>
        <div className="font-serif text-base font-medium text-white leading-tight">{ev.brand}</div>
      </div>
      <div className="relative font-mono text-[10px] text-white/50 text-right">
        <div className="text-white/30 text-[9px]">from</div>
        <div>{fmt.money0(ev.msrp)}</div>
      </div>
    </div>
  );
}

function StatChip({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="bg-paper border border-line rounded-xl p-3.5">
      <div className="font-mono text-[9px] uppercase tracking-widest text-ink-mute mb-1.5">{label}</div>
      <div className="font-serif text-xl font-medium text-ink leading-none">{value}</div>
      {note && <div className="text-[10px] text-ink-mute mt-1.5 leading-tight">{note}</div>}
    </div>
  );
}

function WinnerBadge({ label = "Winner" }: { label?: string }) {
  return (
    <span className="font-mono text-[9px] uppercase tracking-widest text-forest bg-forest/10 border border-forest/20 rounded-full px-2 py-0.5 whitespace-nowrap">
      {label}
    </span>
  );
}

interface Props {
  evSummaries: EVModelSummary[];
  allEvs: EVModel[];
  states: StateData[];
  nationalAvg: StateData;
  defaultEv1Slug?: string;
  defaultEv2Slug?: string;
}

export function EVComparatorTool({ evSummaries, allEvs, states, nationalAvg, defaultEv1Slug, defaultEv2Slug }: Props) {
  const [ev1Slug, setEv1Slug] = useState(defaultEv1Slug ?? DEFAULT_EV1);
  const [ev2Slug, setEv2Slug] = useState(defaultEv2Slug ?? DEFAULT_EV2);
  const [stateCode, setStateCode] = useState("US");
  const [miles, setMiles] = useState(15000);
  const [homePct, setHomePct] = useState(80);
  const [copied, setCopied] = useState(false);
  const [detectedCity, setDetectedCity] = useState<string | null>(null);
  const [detectedZip, setDetectedZip] = useState<string | null>(null);
  const [detecting, setDetecting] = useState(false);
  const calcStore = useCalculatorStore();

  // URL param hydration
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const p1 = p.get("ev1"); if (p1) setEv1Slug(p1);
    const p2 = p.get("ev2"); if (p2) setEv2Slug(p2);
    const st = p.get("state"); if (st) setStateCode(st);
    const mi = p.get("miles"); if (mi) setMiles(Number(mi));
    const ho = p.get("home"); if (ho) setHomePct(Number(ho));
  }, []);

  // IP geolocation auto-detect — skip if state already in URL
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("state")) return;
    try {
      const raw = localStorage.getItem(LOC_KEY);
      if (raw) {
        const c = JSON.parse(raw) as { code: string; zip?: string; city?: string; ts: number };
        if (Date.now() - c.ts < LOC_TTL && c.code) {
          setStateCode(c.code);
          setDetectedZip(c.zip ?? null);
          setDetectedCity(c.city ?? null);
          return;
        }
      }
    } catch { /* ignore */ }

    setDetecting(true);
    fetch("https://ipapi.co/json/", { cache: "no-store", signal: AbortSignal.timeout(5000) })
      .then((r) => r.json())
      .then(async (j: { country_code?: string; region_code?: string; postal?: string }) => {
        if (j.country_code !== "US" || !j.region_code) return;
        const code = j.region_code;
        const zip = j.postal && /^\d{5}$/.test(j.postal) ? j.postal : null;
        setStateCode(code);
        setDetectedZip(zip);
        let city: string | null = null;
        if (zip) {
          try {
            const r2 = await fetch(`https://api.zippopotam.us/us/${zip}`, { signal: AbortSignal.timeout(2000) });
            if (r2.ok) {
              const d = await r2.json();
              city = d.places?.[0]?.["place name"] ?? null;
            }
          } catch { /* ignore */ }
        }
        setDetectedCity(city);
        try { localStorage.setItem(LOC_KEY, JSON.stringify({ code, zip, city, ts: Date.now() })); } catch { /* ignore */ }
      })
      .catch(() => { /* silent fallback */ })
      .finally(() => setDetecting(false));
  }, []);

  const ev1 = allEvs.find((e) => e.slug === ev1Slug) ?? null;
  const ev2 = allEvs.find((e) => e.slug === ev2Slug) ?? null;

  const stateData = states.find((s) => s.code === stateCode) ?? nationalAvg;
  const kwhRate = stateData.kwhCents / 100;

  const ev1Cost = ev1 ? calcAnnualCost(ev1, kwhRate, miles, homePct) : null;
  const ev2Cost = ev2 ? calcAnnualCost(ev2, kwhRate, miles, homePct) : null;

  const annualDiff = ev1Cost !== null && ev2Cost !== null ? Math.abs(ev1Cost - ev2Cost) : 0;
  const ev1CheaperToCharge = ev1Cost !== null && ev2Cost !== null && ev1Cost <= ev2Cost;
  const hasResults = !!(ev1 && ev2 && ev1Cost !== null && ev2Cost !== null);

  const ev1DcKw = ev1 ? (DC_KW[ev1.id] ?? null) : null;
  const ev2DcKw = ev2 ? (DC_KW[ev2.id] ?? null) : null;
  const ev1Mins = ev1 && ev1DcKw ? chargeTime(ev1.battery, ev1DcKw) : null;
  const ev2Mins = ev2 && ev2DcKw ? chargeTime(ev2.battery, ev2DcKw) : null;
  const ev1ZeroSix = ev1 ? (ZERO_TO_60[ev1.id] ?? null) : null;
  const ev2ZeroSix = ev2 ? (ZERO_TO_60[ev2.id] ?? null) : null;
  const hasDcData = ev1DcKw !== null || ev2DcKw !== null;
  const bothDcData = ev1DcKw !== null && ev2DcKw !== null;
  const ev1FasterDC = bothDcData && ev1DcKw! > ev2DcKw!;
  const ev2FasterDC = bothDcData && ev2DcKw! > ev1DcKw!;

  const ev1Tco5 = ev1 && ev1Cost !== null ? ev1.msrp + ev1Cost * 5 : null;
  const ev2Tco5 = ev2 && ev2Cost !== null ? ev2.msrp + ev2Cost * 5 : null;
  const ev1WinsTco = ev1Tco5 !== null && ev2Tco5 !== null && ev1Tco5 <= ev2Tco5;
  const tcoDiff = ev1Tco5 !== null && ev2Tco5 !== null ? Math.abs(ev1Tco5 - ev2Tco5) : 0;

  const ourPick = hasResults && ev1 && ev2 ? (ev1WinsTco ? ev1 : ev2) : null;
  const pickOther = hasResults && ev1 && ev2 ? (ev1WinsTco ? ev2 : ev1) : null;
  const pickCheaperToCharge = ourPick === (ev1CheaperToCharge ? ev1 : ev2);
  const pickNote = ourPick && pickOther ? makePickNote(ourPick, pickOther, tcoDiff, annualDiff, pickCheaperToCharge) : "";

  const msrpDiff = ev1 && ev2 ? Math.abs(ev1.msrp - ev2.msrp) : 0;
  const pricierEv = ev1 && ev2 ? (ev1.msrp >= ev2.msrp ? ev1 : ev2) : null;
  const pricierCost = pricierEv && ev1Cost !== null && ev2Cost !== null ? (pricierEv === ev1 ? ev1Cost : ev2Cost) : null;
  const cheaperMsrpCost = pricierEv && ev1Cost !== null && ev2Cost !== null ? (pricierEv === ev1 ? ev2Cost : ev1Cost) : null;
  const annualSavingsFromPricier = pricierCost !== null && cheaperMsrpCost !== null ? cheaperMsrpCost - pricierCost : 0;
  const breakEvenYears = annualSavingsFromPricier > 50 && msrpDiff > 0 ? msrpDiff / annualSavingsFromPricier : null;

  const stateMaxIncentive = getStateMaxIncentive(stateData.code);

  // Sync ourPick to calculator store so post-tool sections (buy, charger, networks) use the right EV
  useEffect(() => {
    if (ourPick) calcStore.setEvSlug(ourPick.slug);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ourPick?.slug]);

  // GA4: fire when a valid comparison is rendered
  useEffect(() => {
    if (!ev1 || !ev2 || ev1Cost === null || ev2Cost === null) return;
    gtagEvent("comparator_result_viewed", {
      ev1: ev1.slug,
      ev2: ev2.slug,
      state: stateCode,
      winner: ourPick?.slug ?? "",
      tco_diff: Math.round(tcoDiff),
      annual_diff: Math.round(annualDiff),
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ev1Slug, ev2Slug, stateCode]);

  const evOptions = useMemo<ComboOption[]>(
    () => evSummaries.map((e) => ({ value: e.slug, label: e.fullName, group: e.brand })),
    [evSummaries]
  );

  const copyLink = useCallback(() => {
    const p = new URLSearchParams({ ev1: ev1Slug, ev2: ev2Slug, state: stateCode, miles: String(miles), home: String(homePct) });
    navigator.clipboard.writeText(`${window.location.origin}/ev-compare?${p.toString()}`).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    gtagEvent("comparator_share_clicked", { ev1: ev1Slug, ev2: ev2Slug, state: stateCode });
  }, [ev1Slug, ev2Slug, stateCode, miles, homePct]);

  const tableRows = hasResults && ev1 && ev2 && ev1Cost !== null && ev2Cost !== null ? [
    { label: "Annual charging cost", v1: fmt.money0(ev1Cost),                      v2: fmt.money0(ev2Cost),                      n1: ev1Cost,              n2: ev2Cost,              lowerWins: true  },
    { label: "Cost per mile",        v1: `${((ev1Cost/miles)*100).toFixed(1)}¢`,   v2: `${((ev2Cost/miles)*100).toFixed(1)}¢`,   n1: ev1Cost/miles,        n2: ev2Cost/miles,        lowerWins: true  },
    { label: "5-year charging",      v1: fmt.money0(ev1Cost*5),                    v2: fmt.money0(ev2Cost*5),                    n1: ev1Cost*5,            n2: ev2Cost*5,            lowerWins: true  },
    { label: "EPA range",            v1: `${ev1.range} mi`,                        v2: `${ev2.range} mi`,                        n1: ev1.range,            n2: ev2.range,            lowerWins: false },
    { label: "0–60 mph",             v1: ev1ZeroSix ? `${ev1ZeroSix}s` : "—",      v2: ev2ZeroSix ? `${ev2ZeroSix}s` : "—",      n1: ev1ZeroSix ?? 99,     n2: ev2ZeroSix ?? 99,     lowerWins: true  },
    { label: "DC fast charge",       v1: ev1DcKw ? `${ev1DcKw} kW` : "—",         v2: ev2DcKw ? `${ev2DcKw} kW` : "—",         n1: ev1DcKw ?? 0,         n2: ev2DcKw ?? 0,         lowerWins: false },
    { label: "10–80% charge time",   v1: ev1Mins ? `~${ev1Mins} min` : "—",        v2: ev2Mins ? `~${ev2Mins} min` : "—",        n1: ev1Mins ?? 9999,      n2: ev2Mins ?? 9999,      lowerWins: true  },
    { label: "Battery",              v1: `${ev1.battery} kWh`,                     v2: `${ev2.battery} kWh`,                     n1: ev1.battery,          n2: ev2.battery,          lowerWins: false },
    { label: "Efficiency",           v1: `${ev1.efficiency} mi/kWh`,               v2: `${ev2.efficiency} mi/kWh`,               n1: ev1.efficiency,       n2: ev2.efficiency,       lowerWins: false },
    { label: "Connector",            v1: ev1.connector,                             v2: ev2.connector,                             n1: 0,                    n2: 0,                    lowerWins: false },
    { label: "Starting MSRP",        v1: fmt.money0(ev1.msrp),                     v2: fmt.money0(ev2.msrp),                     n1: ev1.msrp,             n2: ev2.msrp,             lowerWins: true  },
    { label: "5-year TCO (est.)",    v1: ev1Tco5 ? fmt.money0(ev1Tco5) : "—",      v2: ev2Tco5 ? fmt.money0(ev2Tco5) : "—",      n1: ev1Tco5 ?? 0,         n2: ev2Tco5 ?? 0,         lowerWins: true  },
  ] : [];

  return (
    <div className="space-y-5">

      {/* Controls */}
      <div className="bg-cream-soft border border-line rounded-2xl p-5">
        <div className="relative grid sm:grid-cols-[1fr_auto_1fr] gap-3 items-end mb-5">
          <div>
            <label className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-2 block">First EV</label>
            <VehicleCombobox options={evOptions} value={ev1Slug} onChange={(v) => { setEv1Slug(v); const e = allEvs.find(x => x.slug === v); gtagEvent("comparator_ev1_selected", { ev: v, brand: e?.brand ?? "", segment: e?.segment ?? "" }); }} placeholder="Search EVs…" id="ev1" />
          </div>
          <div className="flex items-center justify-center pb-1">
            <div className="w-9 h-9 rounded-full bg-ink text-cream font-serif text-sm font-medium flex items-center justify-center flex-shrink-0 shadow-sm">vs</div>
          </div>
          <div>
            <label className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-2 block">Second EV</label>
            <VehicleCombobox options={evOptions} value={ev2Slug} onChange={(v) => { setEv2Slug(v); const e = allEvs.find(x => x.slug === v); gtagEvent("comparator_ev2_selected", { ev: v, brand: e?.brand ?? "", segment: e?.segment ?? "" }); }} placeholder="Search EVs…" id="ev2" />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <label className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-1.5 block">State</label>
            <select
              value={stateCode}
              onChange={(e) => { setStateCode(e.target.value); gtagEvent("comparator_state_changed", { state: e.target.value }); }}
              className="w-full border border-line rounded-lg px-2.5 py-1.5 font-mono text-xs bg-paper focus:outline-none focus:ring-1 focus:ring-forest"
            >
              <option value="US">National avg ({nationalAvg.kwhCents}¢/kWh)</option>
              {states.map((s) => <option key={s.code} value={s.code}>{s.name} ({s.kwhCents}¢/kWh)</option>)}
            </select>
          </div>
          <div>
            <label className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-1.5 block">Miles / year</label>
            <input
              type="number" min={1000} max={50000} step={1000} value={miles}
              onChange={(e) => setMiles(Math.max(1000, Math.min(50000, Number(e.target.value))))}
              className="w-full border border-line rounded-lg px-2.5 py-1.5 font-mono text-xs bg-paper focus:outline-none focus:ring-1 focus:ring-forest"
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-1.5 block">
              Home charging — <span className="text-forest">{homePct}%</span>
            </label>
            <input type="range" min={0} max={100} step={5} value={homePct}
              onChange={(e) => setHomePct(Number(e.target.value))} className="w-full accent-forest" />
            <div className="flex justify-between font-mono text-[9px] text-ink-mute mt-0.5">
              <span>All public</span><span>All home</span>
            </div>
          </div>
        </div>
      </div>

      {/* Location banner */}
      {(detecting || detectedCity || detectedZip) && (
        <div className="bg-cream-soft border border-line rounded-xl px-4 py-3 flex items-start gap-3">
          <span className={`w-2 h-2 rounded-full mt-0.5 flex-shrink-0 ${detecting ? "bg-amber-400 animate-pulse" : "bg-emerald"}`} />
          {detecting ? (
            <span className="font-mono text-xs text-ink-mute">Detecting your location…</span>
          ) : (
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
                <span className="font-mono text-xs text-ink">
                  {detectedCity ? `${detectedCity}, ` : ""}{stateData.name} · {stateData.kwhCents}¢/kWh · ${stateData.gasDollar.toFixed(2)}/gal
                </span>
                {stateData.hasTOU && (
                  <a href={`/ev-cost/${stateData.slug}`} className="font-mono text-[10px] text-forest hover:underline">TOU rates available →</a>
                )}
                {detectedZip && <span className="font-mono text-[10px] text-ink-mute">{detectedZip}</span>}
              </div>
              {stateMaxIncentive > 0 && (
                <a href={`/ev-cost/${stateData.slug}`} className="block font-mono text-[10px] text-forest hover:underline">
                  {stateData.name} offers up to {fmt.money0(stateMaxIncentive)} in EV purchase incentives — see programs →
                </a>
              )}
            </div>
          )}
        </div>
      )}

      {hasResults && ev1 && ev2 && ev1Cost !== null && ev2Cost !== null && ourPick && (
        <>
          {/* Our Pick */}
          <div className="bg-ink rounded-2xl p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="inline-flex items-center gap-1.5 bg-emerald/20 border border-emerald/30 rounded-full px-2.5 py-1 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
                <span className="font-mono text-[9px] uppercase tracking-widest text-emerald">Our pick</span>
              </div>
              <div className="font-serif text-xl font-medium text-cream">{ourPick.fullName}</div>
              <p className="text-cream/60 text-sm mt-1.5 leading-relaxed max-w-md">{pickNote}</p>
            </div>
            {tcoDiff >= 500 && (
              <div className="flex-shrink-0 bg-emerald/10 border border-emerald/20 rounded-2xl px-5 py-4 text-center">
                <div className="font-serif text-2xl font-medium text-emerald">{fmt.money0(tcoDiff)}</div>
                <div className="font-mono text-[9px] uppercase tracking-widest text-cream/40 mt-0.5">5-yr cost advantage</div>
              </div>
            )}
          </div>

          {/* Quick stat chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatChip
              label="Annual charging"
              value={fmt.money0(annualDiff) + "/yr"}
              note={annualDiff < 20 ? "Virtually tied" : `${ev1CheaperToCharge ? ev1.name : ev2.name} saves more`}
            />
            <StatChip
              label="Range difference"
              value={`${Math.abs(ev1.range - ev2.range)} mi`}
              note={ev1.range === ev2.range ? "Identical range" : `${ev1.range > ev2.range ? ev1.name : ev2.name} goes farther`}
            />
            {bothDcData ? (
              <StatChip
                label="Fastest charge"
                value={`${Math.max(ev1DcKw!, ev2DcKw!)} kW`}
                note={ev1DcKw === ev2DcKw ? "Same speed" : `${ev1DcKw! >= ev2DcKw! ? ev1.name : ev2.name}`}
              />
            ) : (
              <StatChip
                label="Price difference"
                value={fmt.money0(msrpDiff)}
                note={msrpDiff === 0 ? "Same MSRP" : `${ev1.msrp <= ev2.msrp ? ev1.name : ev2.name} costs less`}
              />
            )}
            <StatChip
              label="Price difference"
              value={fmt.money0(msrpDiff)}
              note={msrpDiff === 0 ? "Same MSRP" : `${ev1.msrp <= ev2.msrp ? ev1.name : ev2.name} costs less`}
            />
          </div>

          {/* Side-by-side EV cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            {(
              [
                { ev: ev1, cost: ev1Cost, dcKw: ev1DcKw, mins: ev1Mins, zeroSix: ev1ZeroSix, slot: "ev1" },
                { ev: ev2, cost: ev2Cost, dcKw: ev2DcKw, mins: ev2Mins, zeroSix: ev2ZeroSix, slot: "ev2" },
              ] as { ev: EVModel; cost: number; dcKw: number | null; mins: number | null; zeroSix: number | null; slot: string }[]
            ).map(({ ev, cost, dcKw, mins, zeroSix, slot }) => {
              const net = networkInfo(ev.connector);
              const isOurPick = ev === ourPick;
              return (
                <div key={slot} className={`rounded-2xl border overflow-hidden ${isOurPick ? "border-forest/40" : "border-line"}`}>
                  <CardHeader ev={ev} />
                  <div className={`p-5 ${isOurPick ? "bg-forest/5" : "bg-paper"}`}>
                    <div className="flex items-start justify-between gap-2 mb-4">
                      <div className="font-serif text-base font-medium text-ink leading-snug">{ev.fullName}</div>
                      {isOurPick && <WinnerBadge label="Our pick" />}
                    </div>
                    <div className="space-y-2.5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-ink-mute">Annual charging</span>
                        <b className={`font-mono ${isOurPick && annualDiff >= 20 ? "text-forest" : ""}`}>{fmt.money0(cost)}</b>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-ink-mute">Cost per mile</span>
                        <b className="font-mono">{((cost / miles) * 100).toFixed(1)}¢</b>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-ink-mute">5-year charging</span>
                        <b className="font-mono">{fmt.money0(cost * 5)}</b>
                      </div>
                      <div className="border-t border-line/50 pt-2.5 space-y-2">
                        {(
                          [
                            ["Range", `${ev.range} mi`],
                            ["Battery", `${ev.battery} kWh`],
                            ["Efficiency", `${ev.efficiency} mi/kWh`],
                            zeroSix ? ["0–60 mph", `${zeroSix}s`] : null,
                            dcKw ? ["DC fast charge", `${dcKw} kW`] : null,
                            mins ? ["10–80% time", `~${mins} min`] : null,
                            ["MSRP", fmt.money0(ev.msrp)],
                          ] as (string[] | null)[]
                        ).filter((x): x is string[] => x !== null).map(([k, v]) => (
                          <div key={k} className="flex justify-between">
                            <span className="text-ink-mute">{k}</span>
                            <span className={`font-mono text-xs ${k === "Effective price" ? "font-semibold text-ink" : "text-ink-3"}`}>{v}</span>
                          </div>
                        ))}
                      </div>
                      <div className="pt-2.5 border-t border-line/50">
                        <div className="font-mono text-[9px] uppercase tracking-widest text-ink-mute mb-1">Charging network</div>
                        <div className={`font-mono text-xs font-medium ${net.color}`}>{net.label}</div>
                        {net.sub && <div className="text-[10px] text-ink-mute mt-0.5">{net.sub}</div>}
                      </div>
                      <div className="pt-2 flex gap-2">
                        <a
                          href={`/ev/${ev.slug}`}
                          className="flex-1 text-center font-mono text-[10px] uppercase tracking-widest border border-line rounded-lg px-3 py-2 hover:border-forest hover:text-forest transition-colors text-ink-mute"
                        >
                          Explore {ev.name} →
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Road trip section */}
          {hasDcData && (
            <div className="border border-line rounded-2xl overflow-hidden">
              <div className="bg-ink px-5 py-3 border-b border-white/10">
                <div className="font-mono text-[10px] uppercase tracking-widest text-cream/60">Road trip capability</div>
              </div>
              <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-line">
                {(
                  [
                    { ev: ev1, dcKw: ev1DcKw, mins: ev1Mins, fasterDC: ev1FasterDC, slot: "ev1" },
                    { ev: ev2, dcKw: ev2DcKw, mins: ev2Mins, fasterDC: ev2FasterDC, slot: "ev2" },
                  ] as { ev: EVModel; dcKw: number | null; mins: number | null; fasterDC: boolean; slot: string }[]
                ).map(({ ev, dcKw, mins, fasterDC, slot }) => {
                  const net = networkInfo(ev.connector);
                  return (
                    <div key={slot} className="p-5">
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute">{ev.name}</div>
                        {fasterDC && <WinnerBadge label="Faster charging" />}
                      </div>
                      {dcKw ? (
                        <>
                          <div className="font-serif text-3xl font-medium text-ink mb-0.5">{dcKw} kW</div>
                          <div className="font-mono text-[10px] text-ink-mute mb-4">Peak DC fast charge</div>
                          {mins && (
                            <div className="bg-cream-soft rounded-xl p-3 mb-4">
                              <div className="font-mono text-[10px] text-ink-mute mb-0.5">10–80% charge time</div>
                              <div className="font-serif text-xl font-medium text-ink">~{mins} min</div>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-ink-mute text-sm mb-4 italic">DC charge data unavailable</div>
                      )}
                      <div>
                        <div className="font-mono text-[9px] uppercase tracking-widest text-ink-mute mb-1">Charging network</div>
                        <div className={`font-mono text-sm font-medium ${net.color}`}>{net.label}</div>
                        {net.sub && <div className="text-[10px] text-ink-mute mt-0.5">{net.sub}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 5-year TCO section */}
          {ev1Tco5 !== null && ev2Tco5 !== null && (
            <div className="bg-cream-soft border border-line rounded-2xl p-5">
              <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-4">5-year cost estimate</div>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                {(
                  [
                    { ev: ev1, cost: ev1Cost, tco: ev1Tco5!, wins: ev1WinsTco, slot: "ev1" },
                    { ev: ev2, cost: ev2Cost, tco: ev2Tco5!, wins: !ev1WinsTco, slot: "ev2" },
                  ] as { ev: EVModel; cost: number; tco: number; wins: boolean; slot: string }[]
                ).map(({ ev, cost, tco, wins, slot }) => (
                  <div key={slot} className={`rounded-xl p-4 border ${wins ? "bg-good-bg border-good-fg/20" : "bg-paper border-line"}`}>
                    <div className="text-xs text-ink-mute mb-3">{ev.name}</div>
                    <div className="space-y-1.5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-ink-mute">MSRP</span>
                        <span className="font-mono">{fmt.money0(ev.msrp)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-ink-mute">5-yr charging</span>
                        <span className="font-mono">{fmt.money0(cost * 5)}</span>
                      </div>
                      <div className="flex justify-between pt-1.5 border-t border-line/60">
                        <span className="font-medium text-ink">5-yr total</span>
                        <span className={`font-mono font-semibold ${wins ? "text-good-fg" : "text-ink"}`}>{fmt.money0(tco)}</span>
                      </div>
                    </div>
                    {wins && <div className="mt-3"><WinnerBadge label="Better value" /></div>}
                  </div>
                ))}
              </div>
              {breakEvenYears !== null && breakEvenYears > 0 && breakEvenYears < 20 && (
                <div className="border-t border-line pt-4 text-sm text-ink-mute">
                  The <strong className="text-ink">{pricierEv?.name}</strong> costs {fmt.money0(msrpDiff)} more upfront.
                  {annualSavingsFromPricier > 0
                    ? <> The price premium pays off in <strong className="text-forest">{breakEvenYears.toFixed(1)} years</strong> at this charging rate.</>
                    : <> The lower-priced EV also costs less to charge — the premium doesn&apos;t pay off on charging alone.</>
                  }
                </div>
              )}
              <p className="font-mono text-[10px] text-ink-mute mt-3">
                Estimate · excludes depreciation, maintenance, insurance · {miles.toLocaleString()} mi/yr · {stateData.kwhCents}¢/kWh
              </p>
            </div>
          )}

          {/* Full comparison table */}
          <div className="border border-line rounded-2xl overflow-hidden">
            <div className="bg-cream-soft px-5 py-3 border-b border-line font-mono text-[10px] uppercase tracking-widest text-ink-mute">Full comparison</div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line bg-paper">
                  <th className="text-left px-5 py-2.5 font-mono text-[10px] uppercase tracking-widest text-ink-mute font-normal">Metric</th>
                  <th className="text-right px-4 py-2.5 font-mono text-[10px] uppercase tracking-widest text-ink-mute font-normal">{ev1.name}</th>
                  <th className="text-right px-5 py-2.5 font-mono text-[10px] uppercase tracking-widest text-ink-mute font-normal">{ev2.name}</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, i) => {
                  const bothHave = row.v1 !== "—" && row.v1 !== "None" && row.v2 !== "—" && row.v2 !== "None";
                  const tied = bothHave && Math.abs(row.n1 - row.n2) < 0.01;
                  const v1Wins = bothHave && !tied && (row.lowerWins ? row.n1 < row.n2 : row.n1 > row.n2);
                  const v2Wins = bothHave && !tied && !v1Wins;
                  return (
                    <tr key={row.label} className={`border-b border-line last:border-0 ${i % 2 === 0 ? "bg-cream-soft/40" : "bg-paper"}`}>
                      <td className="px-5 py-3 text-ink-mute">{row.label}</td>
                      <td className={`px-4 py-3 text-right font-mono text-xs ${v1Wins ? "text-forest font-semibold" : "text-ink-3"}`}>{row.v1}{v1Wins && " ✓"}</td>
                      <td className={`px-5 py-3 text-right font-mono text-xs ${v2Wins ? "text-forest font-semibold" : "text-ink-3"}`}>{row.v2}{v2Wins && " ✓"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Assumptions + share */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-mono text-[10px] text-ink-mute">
              {stateData.name} · {stateData.kwhCents}¢/kWh home · ~{(stateData.kwhCents * PUBLIC_MULTIPLIER).toFixed(0)}¢/kWh public · {miles.toLocaleString()} mi/yr · {homePct}% home
            </p>
            <button onClick={copyLink} className="font-mono text-[10px] uppercase tracking-widest border border-line rounded-lg px-3 py-1.5 hover:border-forest hover:text-forest transition-colors text-ink-mute">
              {copied ? "Copied ✓" : "Copy link →"}
            </button>
          </div>

        </>
      )}
    </div>
  );
}
