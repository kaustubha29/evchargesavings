export interface SavingsInputs {
  evEfficiency: number;   // mi/kWh
  gasMpg: number;
  annualMiles: number;
  homePct: number;        // 0–100
  homeRateKwh: number;    // ¢/kWh
  publicRateKwh: number;  // ¢/kWh
  gasPriceDollar: number;
  stateEvFee?: number;    // annual EV-specific registration surcharge, $ (0 if excluded)
}

export interface SavingsResult {
  evAnnualCost: number;
  gasAnnualCost: number;
  annualSavings: number;        // fuel-only (gas fuel cost − EV charging cost)
  monthlySavings: number;       // fuel-only / 12
  fiveYearSavings: number;      // fuel-only × 5
  savingsPct: number;
  evCostPerMile: number;
  gasCostPerMile: number;
  homeKwh: number;
  publicKwh: number;
  annualKwh: number;
  stateEvFee: number;           // annual EV registration surcharge applied
  netAnnualSavings: number;     // annualSavings − stateEvFee
  netMonthlySavings: number;    // netAnnualSavings / 12
  netFiveYearSavings: number;   // netAnnualSavings × 5
}

export interface BreakEvenResult {
  years: number;
  months: number;
}

export interface PHEVCostInputs {
  evRange: number;
  mpge: number;
  mpgGas: number;
  annualMiles: number;
  homePct: number;
  homeRateKwh: number;
  publicRateKwh: number;
  gasPriceDollar: number;
}

export interface PHEVCostResult {
  electricCost: number;
  gasCost: number;
  totalCost: number;
  electricMiles: number;
  gasMiles: number;
  electricPct: number;
}

export interface CO2Result {
  savedLbs: number;
  savedMetricTons: number;
  treesEquivalent: number;
  flightsEquivalent: number;
}
