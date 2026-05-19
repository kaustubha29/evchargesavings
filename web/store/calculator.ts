"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { NATIONAL_AVG } from "@/features/location/data/states";
import { calculateSavings, calculatePHEVCost } from "@/features/calculations/savings";
import { calculateCO2 } from "@/features/calculations/co2";
import type { PHEVCostResult } from "@/features/calculations/types";
import type { StateData } from "@/features/location/types";
import type { SavingsResult } from "@/features/calculations/types";
import type { CO2Result } from "@/features/calculations/types";

interface CalculatorStore {
  // Inputs
  evSlug:         string;
  gasId:          string;
  comparisonType: "gas" | "phev";
  phevId:         string;
  annualMiles:    number;
  homePct:        number;
  homeRateKwh:    number;
  publicRateKwh:  number;
  gasPriceDollar: number;
  stateCode:      string | null;
  stateData:      StateData;
  includeStateEvFee: boolean;
  city:           string | null;
  zip:            string | null;
  isDetecting:    boolean;

  // Actions
  setEvSlug:            (slug: string) => void;
  setGasId:             (id: string) => void;
  setComparisonType:    (type: "gas" | "phev") => void;
  setPHEVId:            (id: string) => void;
  setMiles:        (miles: number) => void;
  setHomePct:      (pct: number) => void;
  setHomeRate:     (rate: number) => void;
  setPublicRate:   (rate: number) => void;
  setGasPrice:     (price: number) => void;
  setLocation:     (code: string, data: StateData, zip?: string | null, city?: string | null) => void;
  setZip:          (zip: string | null) => void;
  setDetecting:    (v: boolean) => void;
  setIncludeStateEvFee: (v: boolean) => void;
}

export const useCalculatorStore = create<CalculatorStore>()(
  persist(
    (set) => ({
      evSlug:         "tesla-model-y-long-range-awd",
      gasId:          "toyota-rav4",
      comparisonType: "gas",
      phevId:         "toyota-rav4-prime",
      annualMiles:    13500,
      homePct:        80,
      homeRateKwh:    NATIONAL_AVG.kwhCents,
      publicRateKwh:  45,
      gasPriceDollar: NATIONAL_AVG.gasDollar,
      stateCode:      null,
      stateData:      NATIONAL_AVG,
      includeStateEvFee: true,
      city:           null,
      zip:            null,
      isDetecting:    false,

      setEvSlug:         (evSlug)         => set({ evSlug }),
      setGasId:          (gasId)          => set({ gasId }),
      setComparisonType: (comparisonType) => set({ comparisonType }),
      setPHEVId:         (phevId)         => set({ phevId }),
      setMiles:     (annualMiles)    => set({ annualMiles }),
      setHomePct:   (homePct)   => set({ homePct }),
      setHomeRate:  (homeRateKwh)   => set({ homeRateKwh }),
      setPublicRate:(publicRateKwh) => set({ publicRateKwh }),
      setGasPrice:  (gasPriceDollar) => set({ gasPriceDollar }),
      setLocation: (stateCode, stateData, zip, city) =>
        set({ stateCode, stateData, zip, city, homeRateKwh: stateData.kwhCents, gasPriceDollar: stateData.gasDollar }),
      setZip: (zip) => set({ zip }),
      setDetecting: (isDetecting) => set({ isDetecting }),
      setIncludeStateEvFee: (includeStateEvFee) => set({ includeStateEvFee }),
    }),
    {
      name: "ecs-calc-v2",
      partialize: (s) => ({
        evSlug: s.evSlug, gasId: s.gasId,
        comparisonType: s.comparisonType, phevId: s.phevId,
        annualMiles: s.annualMiles, homePct: s.homePct,
        stateCode: s.stateCode, city: s.city, zip: s.zip,
        includeStateEvFee: s.includeStateEvFee,
      }),
    }
  )
);

// Derived selectors — computed outside store, called at component level
export function computeSavings(
  evEfficiency: number,
  gasMpg: number,
  store: Pick<CalculatorStore, "annualMiles"|"homePct"|"homeRateKwh"|"publicRateKwh"|"gasPriceDollar"|"stateData"|"includeStateEvFee">
): SavingsResult {
  return calculateSavings({
    evEfficiency,
    gasMpg,
    annualMiles:    store.annualMiles,
    homePct:        store.homePct,
    homeRateKwh:    store.homeRateKwh,
    publicRateKwh:  store.publicRateKwh,
    gasPriceDollar: store.gasPriceDollar,
    stateEvFee:     store.includeStateEvFee ? (store.stateData?.evFee ?? 0) : 0,
  });
}

export function computeCO2(annualMiles: number, gasMpg: number, annualKwh: number): CO2Result {
  return calculateCO2(annualMiles, gasMpg, annualKwh);
}

export function computePHEVCost(
  phevEvRange: number,
  phevMpge: number,
  phevMpgGas: number,
  store: Pick<CalculatorStore, "annualMiles"|"homePct"|"homeRateKwh"|"publicRateKwh"|"gasPriceDollar">
): PHEVCostResult {
  return calculatePHEVCost({
    evRange: phevEvRange,
    mpge: phevMpge,
    mpgGas: phevMpgGas,
    annualMiles:    store.annualMiles,
    homePct:        store.homePct,
    homeRateKwh:    store.homeRateKwh,
    publicRateKwh:  store.publicRateKwh,
    gasPriceDollar: store.gasPriceDollar,
  });
}
