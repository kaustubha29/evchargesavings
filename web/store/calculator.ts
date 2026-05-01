"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { NATIONAL_AVG } from "@/features/location/data/states";
import { calculateSavings } from "@/features/calculations/savings";
import { calculateCO2 } from "@/features/calculations/co2";
import type { StateData } from "@/features/location/types";
import type { SavingsResult } from "@/features/calculations/types";
import type { CO2Result } from "@/features/calculations/types";

interface CalculatorStore {
  // Inputs
  evSlug:         string;
  gasId:          string;
  annualMiles:    number;
  homePct:        number;
  homeRateKwh:    number;
  publicRateKwh:  number;
  gasPriceDollar: number;
  stateCode:      string | null;
  stateData:      StateData;
  city:           string | null;
  zip:            string | null;
  isDetecting:    boolean;

  // Actions
  setEvSlug:       (slug: string) => void;
  setGasId:        (id: string) => void;
  setMiles:        (miles: number) => void;
  setHomePct:      (pct: number) => void;
  setHomeRate:     (rate: number) => void;
  setPublicRate:   (rate: number) => void;
  setGasPrice:     (price: number) => void;
  setLocation:     (code: string, data: StateData, zip?: string | null, city?: string | null) => void;
  setZip:          (zip: string | null) => void;
  setDetecting:    (v: boolean) => void;
}

export const useCalculatorStore = create<CalculatorStore>()(
  persist(
    (set) => ({
      evSlug:         "t-my-lr-awd",
      gasId:          "toyota-rav4",
      annualMiles:    13500,
      homePct:        80,
      homeRateKwh:    NATIONAL_AVG.kwhCents,
      publicRateKwh:  45,
      gasPriceDollar: NATIONAL_AVG.gasDollar,
      stateCode:      null,
      stateData:      NATIONAL_AVG,
      city:           null,
      zip:            null,
      isDetecting:    false,

      setEvSlug:    (evSlug)    => set({ evSlug }),
      setGasId:     (gasId)     => set({ gasId }),
      setMiles:     (annualMiles)    => set({ annualMiles }),
      setHomePct:   (homePct)   => set({ homePct }),
      setHomeRate:  (homeRateKwh)   => set({ homeRateKwh }),
      setPublicRate:(publicRateKwh) => set({ publicRateKwh }),
      setGasPrice:  (gasPriceDollar) => set({ gasPriceDollar }),
      setLocation: (stateCode, stateData, zip, city) =>
        set({ stateCode, stateData, zip, city, homeRateKwh: stateData.kwhCents, gasPriceDollar: stateData.gasDollar }),
      setZip: (zip) => set({ zip }),
      setDetecting: (isDetecting) => set({ isDetecting }),
    }),
    {
      name: "ecs-calc-v1",
      partialize: (s) => ({
        evSlug: s.evSlug, gasId: s.gasId,
        annualMiles: s.annualMiles, homePct: s.homePct,
        stateCode: s.stateCode, city: s.city, zip: s.zip,
      }),
    }
  )
);

// Derived selectors — computed outside store, called at component level
export function computeSavings(
  evEfficiency: number,
  gasMpg: number,
  store: Pick<CalculatorStore, "annualMiles"|"homePct"|"homeRateKwh"|"publicRateKwh"|"gasPriceDollar">
): SavingsResult {
  return calculateSavings({
    evEfficiency,
    gasMpg,
    annualMiles:    store.annualMiles,
    homePct:        store.homePct,
    homeRateKwh:    store.homeRateKwh,
    publicRateKwh:  store.publicRateKwh,
    gasPriceDollar: store.gasPriceDollar,
  });
}

export function computeCO2(annualMiles: number, gasMpg: number, annualKwh: number): CO2Result {
  return calculateCO2(annualMiles, gasMpg, annualKwh);
}
