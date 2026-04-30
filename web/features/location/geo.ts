"use server";
import { stateFromZip, getStateData } from "./queries";
import type { StateData } from "./types";

export async function detectStateByIP(): Promise<{ stateCode: string; zip: string | null; data: StateData } | null> {
  try {
    const res = await fetch("https://ipapi.co/json/", {
      cache: "no-store",
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return null;
    const j = await res.json() as { country_code?: string; region_code?: string; postal?: string };
    if (j.country_code !== "US" || !j.region_code) return null;
    const stateCode = j.region_code;
    const zip = j.postal && /^\d{5}$/.test(j.postal) ? j.postal : null;
    return { stateCode, zip, data: getStateData(stateCode) };
  } catch {
    return null;
  }
}
