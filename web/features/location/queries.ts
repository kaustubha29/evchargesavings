import { STATE_DATA, NATIONAL_AVG, ZIP_PREFIX } from "./data/states";
import type { StateData } from "./types";

export function getStateData(code: string): StateData {
  return STATE_DATA[code.toUpperCase()] ?? NATIONAL_AVG;
}

export function getAllStates(): StateData[] {
  return Object.values(STATE_DATA).sort((a, b) => a.name.localeCompare(b.name));
}

export function getStateBySlug(slug: string): StateData | undefined {
  return Object.values(STATE_DATA).find((s) => s.slug === slug);
}

export function stateFromZip(zip: string): string | null {
  if (!zip || zip.length < 3) return null;
  return ZIP_PREFIX[zip.slice(0, 3)] ?? null;
}

export function getCheapestStates(limit = 5): StateData[] {
  return getAllStates()
    .sort((a, b) => a.kwhCents - b.kwhCents)
    .slice(0, limit);
}

export function getMostExpensiveGasStates(limit = 5): StateData[] {
  return getAllStates()
    .sort((a, b) => b.gasDollar - a.gasDollar)
    .slice(0, limit);
}
