export const fmt = {
  money0: (v: number) => "$" + Math.round(v).toLocaleString(),
  money2: (v: number) => "$" + v.toFixed(2),
  cents1: (v: number) => v.toFixed(1) + "¢",
  pct0:   (v: number) => Math.round(v) + "%",
  kWh:    (v: number) => Math.round(v).toLocaleString() + " kWh",
  lbs:    (v: number) => Math.round(v).toLocaleString() + " lbs",
};
