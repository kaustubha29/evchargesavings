import type { SavingsInputs, SavingsResult, PHEVCostInputs, PHEVCostResult } from "./types";

export function calculateSavings(inputs: SavingsInputs): SavingsResult {
  const { evEfficiency, gasMpg, annualMiles, homePct, homeRateKwh, publicRateKwh, gasPriceDollar, stateEvFee = 0 } = inputs;

  const homeKwh   = (annualMiles / evEfficiency) * (homePct / 100);
  const publicKwh = (annualMiles / evEfficiency) * (1 - homePct / 100);
  const annualKwh = homeKwh + publicKwh;

  const evAnnualCost  = (homeKwh * homeRateKwh / 100) + (publicKwh * publicRateKwh / 100);
  const gasAnnualCost = (annualMiles / gasMpg) * gasPriceDollar;
  const annualSavings = gasAnnualCost - evAnnualCost;
  const netAnnualSavings = annualSavings - stateEvFee;

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
    stateEvFee,
    netAnnualSavings,
    netMonthlySavings:  netAnnualSavings / 12,
    netFiveYearSavings: netAnnualSavings * 5,
  };
}

export function calculatePHEVCost(inputs: PHEVCostInputs): PHEVCostResult {
  const { evRange, mpge, mpgGas, annualMiles, homePct, homeRateKwh, publicRateKwh, gasPriceDollar } = inputs;

  const dailyMiles        = annualMiles / 365;
  const electricMiles     = Math.min(dailyMiles, evRange) * 365;
  const gasMiles          = Math.max(0, dailyMiles - evRange) * 365;
  const kwhPerMile        = 33.7 / mpge;
  const blendedRateKwh    = (homePct / 100) * homeRateKwh + (1 - homePct / 100) * publicRateKwh;
  const electricCost      = electricMiles * kwhPerMile * blendedRateKwh / 100;
  const gasCost           = gasMiles > 0 ? (gasMiles / mpgGas) * gasPriceDollar : 0;
  const electricPct       = annualMiles > 0 ? (electricMiles / annualMiles) * 100 : 100;

  return { electricCost, gasCost, totalCost: electricCost + gasCost, electricMiles, gasMiles, electricPct };
}
