"use client";
import { useEffect, useRef } from "react";
import { useCalculatorStore } from "@/store/calculator";
import { getStateData } from "@/features/location/queries";

export function buildShareUrl(store: {
  evSlug: string; gasId: string; comparisonType: "gas" | "phev"; phevId: string;
  annualMiles: number; homePct: number; homeRateKwh: number; publicRateKwh: number;
  gasPriceDollar: number; stateCode: string | null; includeStateEvFee: boolean;
}): string {
  const params = new URLSearchParams();
  params.set("ev", store.evSlug);
  if (store.comparisonType === "phev") {
    params.set("type", "phev");
    params.set("phev", store.phevId);
  } else {
    params.set("gas", store.gasId);
  }
  params.set("mi", String(store.annualMiles));
  params.set("home", String(store.homePct));
  if (store.stateCode) params.set("state", store.stateCode);
  params.set("kwh", store.homeRateKwh.toFixed(2));
  params.set("pub", store.publicRateKwh.toFixed(1));
  params.set("gal", store.gasPriceDollar.toFixed(3));
  params.set("fee", store.includeStateEvFee ? "1" : "0");
  return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
}

export function useShareableUrl(): { ratesFromUrlRef: React.MutableRefObject<boolean> } {
  const {
    setEvSlug, setGasId, setComparisonType, setPHEVId,
    setMiles, setHomePct, setHomeRate, setPublicRate, setGasPrice, setLocation, setIncludeStateEvFee,
  } = useCalculatorStore();
  const hydratedRef    = useRef(false);
  const ratesFromUrlRef = useRef(false);

  // One-time: hydrate store from URL params when landing on a shared link
  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;

    const params = new URLSearchParams(window.location.search);
    const hasAny = params.has("ev") || params.has("gas") || params.has("type")
      || params.has("phev") || params.has("mi") || params.has("home") || params.has("state");
    if (!hasAny) return;

    const ev    = params.get("ev");
    const gas   = params.get("gas");
    const type  = params.get("type") as "gas" | "phev" | null;
    const phev  = params.get("phev");
    const mi    = params.get("mi");
    const home  = params.get("home");
    const state = params.get("state");
    const fee   = params.get("fee");
    const kwh   = params.get("kwh");
    const pub   = params.get("pub");
    const gal   = params.get("gal");

    if (ev)   setEvSlug(ev);
    if (gas)  setGasId(gas);
    if (type === "gas" || type === "phev") setComparisonType(type);
    if (phev) setPHEVId(phev);
    if (mi)   setMiles(Number(mi));
    if (home) setHomePct(Number(home));
    if (state) setLocation(state, getStateData(state));
    // Restore exact rates — must come after setLocation which resets them to static defaults
    if (kwh || pub || gal) ratesFromUrlRef.current = true;
    if (kwh)  setHomeRate(Number(kwh));
    if (pub)  setPublicRate(Number(pub));
    if (gal)  setGasPrice(Number(gal));
    if (fee !== null) setIncludeStateEvFee(fee === "1");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ratesFromUrlRef };
}
