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
  return {
    state: {
      ...raw,
      gasDollar: gas.rates[raw.code] ?? raw.gasDollar,
      kwhCents:  elec.rates[raw.code] ?? raw.kwhCents,
    },
    gasPeriod:  gas.period,
    elecPeriod: elec.period,
  };
}
