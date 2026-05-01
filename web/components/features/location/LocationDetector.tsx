"use client";
import { useEffect } from "react";
import { useCalculatorStore } from "@/store/calculator";
import { stateFromZip, getStateData } from "@/features/location/queries";

const STORAGE_KEY = "ecs-loc-v1";
const TTL_MS = 30 * 86400 * 1000;

interface Props {
  forceState?: string; // 2-letter state code to pre-set location
}

export function LocationDetector({ forceState }: Props) {
  const { setLocation, setZip, setDetecting } = useCalculatorStore();

  async function setLocationWithCity(code: string, data: any, zip: string | null) {
    let city: string | null = null;
    if (zip) {
      try {
        const res = await fetch(`http://api.zippopotam.us/us/${zip}`, { signal: AbortSignal.timeout(2000) });
        if (res.ok) {
          const data = await res.json();
          city = data.places?.[0]?.['place name'] || null;
        }
      } catch {
        // Ignore errors
      }
    }
    setLocation(code, data, zip, city);
  }

  useEffect(() => {
    if (forceState) {
      const data = getStateData(forceState);
      setLocation(forceState, data, null, null);
      setZip(null);
      return;
    }
    // 1. Try localStorage cache
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const cached = JSON.parse(raw) as { code: string; zip?: string; ts: number };
        if (Date.now() - cached.ts < TTL_MS && cached.code) {
          const data = getStateData(cached.code);
          setLocationWithCity(cached.code, data, cached.zip ?? null);
          return;
        }
      }
    } catch { /* ignore */ }

    // 2. IP geolocation — 5 s hard timeout so isDetecting never stays true forever
    setDetecting(true);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    fetch("https://ipapi.co/json/", { cache: "no-store", signal: controller.signal })
      .then((r) => r.json())
      .then((j: { country_code?: string; region_code?: string; postal?: string }) => {
        if (j.country_code !== "US" || !j.region_code) return;
        const code = j.region_code;
        const zip  = j.postal && /^\d{5}$/.test(j.postal) ? j.postal : undefined;
        const data = getStateData(code);
        setLocationWithCity(code, data, zip ?? null);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ code, zip, ts: Date.now() }));
        } catch { /* ignore */ }
      })
      .catch(() => { /* silent — aborted or network error, fall back to national avg */ })
      .finally(() => { clearTimeout(timer); setDetecting(false); });
  }, [setLocation, setDetecting]);

  return null;
}
