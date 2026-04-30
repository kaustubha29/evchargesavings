import type { SavingsInputs, SavingsResult } from "./types";

export function calculateSavings(inputs: SavingsInputs): SavingsResult {
  const { evEfficiency, gasMpg, annualMiles, homePct, homeRateKwh, publicRateKwh, gasPriceDollar } = inputs;

  const homeKwh   = (annualMiles / evEfficiency) * (homePct / 100);
  const publicKwh = (annualMiles / evEfficiency) * (1 - homePct / 100);
  const annualKwh = homeKwh + publicKwh;

  const evAnnualCost  = (homeKwh * homeRateKwh / 100) + (publicKwh * publicRateKwh / 100);
  const gasAnnualCost = (annualMiles / gasMpg) * gasPriceDollar;
  const annualSavings = gasAnnualCost - evAnnualCost;

  return {
    evAnnualCost,
    gasAnnualCost,
    annualSavings,
    monthlySavings:  annualSavings / 12,
    fiveYearSavings: annualSavings * 5,
    savingsPct: gasAnnualCost > 0 ? (annualSavings / gasAnnualCost) * 100 : 0,
    evCostPerMile:  evAnnualCost  / Math.max(annualMiles, 1),
    gasCostPerMile: gasAnnualCost / Math.max(annualMiles, 1),
    homeKwh,
    publicKwh,
    annualKwh,
  };
}
