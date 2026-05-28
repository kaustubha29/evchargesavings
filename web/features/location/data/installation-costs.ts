export type InstallCostData = {
  low: number;
  high: number;
  panelLow: number;
  panelHigh: number;
};

const HIGH: InstallCostData = { low: 1200, high: 3500, panelLow: 2800, panelHigh: 6500 };
const MED: InstallCostData  = { low: 900,  high: 2500, panelLow: 2400, panelHigh: 5500 };
const LOW: InstallCostData  = { low: 700,  high: 1800, panelLow: 2200, panelHigh: 4800 };

const TIER: Record<string, InstallCostData> = {
  CA: HIGH, NY: HIGH, WA: HIGH, MA: HIGH, CT: HIGH, HI: HIGH, AK: HIGH,
  NJ: HIGH, IL: HIGH, MD: HIGH, OR: HIGH, CO: HIGH, MN: HIGH, NH: HIGH,
  RI: HIGH, VT: HIGH, ME: HIGH,
  TX: MED, FL: MED, GA: MED, AZ: MED, VA: MED, PA: MED, NC: MED,
  MI: MED, WI: MED, UT: MED, NV: MED, ID: MED, MT: MED, DE: MED,
  DC: MED, NM: MED,
  AL: LOW, MS: LOW, AR: LOW, WV: LOW, SD: LOW, ND: LOW, IA: LOW,
  KS: LOW, KY: LOW, LA: LOW, MO: LOW, NE: LOW, OH: LOW, OK: LOW,
  SC: LOW, TN: LOW, WY: LOW, IN: LOW,
};

export function getInstallCost(stateCode: string): InstallCostData {
  return TIER[stateCode] ?? MED;
}
