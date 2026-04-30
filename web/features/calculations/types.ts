export interface SavingsInputs {
  evEfficiency: number;   // mi/kWh
  gasMpg: number;
  annualMiles: number;
  homePct: number;        // 0–100
  homeRateKwh: number;    // ¢/kWh
  publicRateKwh: number;  // ¢/kWh
  gasPriceDollar: number;
}

export interface SavingsResult {
  evAnnualCost: number;
  gasAnnualCost: number;
  annualSavings: number;
  monthlySavings: number;
  fiveYearSavings: number;
  savingsPct: number;
  evCostPerMile: number;
  gasCostPerMile: number;
  homeKwh: number;
  publicKwh: number;
  annualKwh: number;
}

export interface BreakEvenResult {
  years: number;
  months: number;
}

export interface CO2Result {
  savedLbs: number;
  savedMetricTons: number;
  treesEquivalent: number;
  flightsEquivalent: number;
}
