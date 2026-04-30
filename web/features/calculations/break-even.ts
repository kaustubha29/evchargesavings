import type { BreakEvenResult } from "./types";

export function calculateBreakEven(
  evMsrp: number,
  gasMsrp: number,
  annualSavings: number,
  federalCredit = 0,
): BreakEvenResult | null {
  const costDelta = evMsrp - gasMsrp - federalCredit;
  if (annualSavings <= 0 || costDelta <= 0) return null;
  const years = costDelta / annualSavings;
  return { years, months: Math.round(years * 12) };
}
