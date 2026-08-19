import { cache } from "react";
import { fetchStateGasPrices, fetchStateElecRates } from "./eia";
import type { StateData } from "./types";

export const getLiveGasPrices = cache(fetchStateGasPrices);
export const getLiveElecRates = cache(fetchStateElecRates);

export interface EnrichedState {
  state: StateData;
  gasPeriod: string;
  elecPeriod: string;
}

export async function enrichState(raw: StateData): Promise<EnrichedState> {
  const [gas, elec] = await Promise.all([getLiveGasPrices(), getLiveElecRates()]);
  let gasDollar: number;
  let kwhCents: number;
  if (raw.code === "US") {
    const gv = Object.values(gas.rates);
    const ev = Object.values(elec.rates);
    gasDollar = gas.rates.US ?? (gv.length ? +(gv.reduce((a, b) => a + b, 0) / gv.length).toFixed(2) : raw.gasDollar);
    kwhCents  = elec.rates.US ?? (ev.length ? +(ev.reduce((a, b) => a + b, 0) / ev.length).toFixed(1) : raw.kwhCents);
  } else {
    gasDollar = gas.rates[raw.code] ?? raw.gasDollar;
    kwhCents  = elec.rates[raw.code] ?? raw.kwhCents;
  }
  return {
    state: { ...raw, gasDollar, kwhCents },
    gasPeriod:  gas.period,
    elecPeriod: elec.period,
  };
}
