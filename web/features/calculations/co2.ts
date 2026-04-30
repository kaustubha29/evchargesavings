import type { CO2Result } from "./types";

const GAS_LBS_PER_GALLON = 19.6;
const GRID_LBS_PER_KWH   = 0.85;
const TREE_LBS_PER_YEAR  = 48;
const FLIGHT_LBS_NYC_LA  = 1100;

export function calculateCO2(annualMiles: number, gasMpg: number, annualKwh: number): CO2Result {
  const gasLbs   = (annualMiles / gasMpg) * GAS_LBS_PER_GALLON;
  const evLbs    = annualKwh * GRID_LBS_PER_KWH;
  const savedLbs = gasLbs - evLbs;
  return {
    savedLbs,
    savedMetricTons:   savedLbs / 2204,
    treesEquivalent:   Math.round(savedLbs / TREE_LBS_PER_YEAR),
    flightsEquivalent: savedLbs / FLIGHT_LBS_NYC_LA,
  };
}
