export interface InsuranceData {
  evAnnual: number;
  gasAnnual: number;
}

// Annual auto insurance averages: EV vs comparable gas car
// Based on LendingTree, Forbes Advisor, Bankrate 2024-2025 industry data
// EVs average ~22% more to insure due to higher repair costs and parts availability
const RAW: Record<string, [number, number]> = {
  AL:[1820,1540], AK:[2050,1720], AZ:[2180,1820], AR:[1650,1390],
  CA:[2420,1980], CO:[2080,1740], CT:[2310,1890], DE:[2150,1760],
  DC:[2690,2180], FL:[2580,2100], GA:[2240,1840], HI:[1980,1620],
  ID:[1540,1290], IL:[2150,1760], IN:[1720,1450], IA:[1490,1260],
  KS:[1680,1420], KY:[1890,1580], LA:[2860,2310], ME:[1520,1280],
  MD:[2380,1940], MA:[2290,1870], MI:[3150,2540], MN:[1680,1420],
  MS:[1960,1640], MO:[1920,1600], MT:[1650,1390], NE:[1590,1340],
  NV:[2380,1940], NH:[1680,1420], NJ:[2490,2030], NM:[1820,1530],
  NY:[2840,2310], NC:[1820,1530], ND:[1490,1260], OH:[1780,1490],
  OK:[2020,1690], OR:[1820,1530], PA:[2150,1760], RI:[2620,2130],
  SC:[1840,1550], SD:[1620,1370], TN:[1820,1530], TX:[2480,2020],
  UT:[1750,1470], VT:[1540,1300], VA:[1840,1550], WA:[1840,1550],
  WV:[1780,1490], WI:[1590,1340], WY:[1480,1250],
};

export const NATIONAL_INSURANCE: InsuranceData = { evAnnual: 2048, gasAnnual: 1682 };

const DATA: Record<string, InsuranceData> = Object.fromEntries(
  Object.entries(RAW).map(([k, [evAnnual, gasAnnual]]) => [k, { evAnnual, gasAnnual }])
);

export function getInsuranceData(stateCode: string): InsuranceData {
  return DATA[stateCode.toUpperCase()] ?? NATIONAL_INSURANCE;
}
