import type { StateData } from "@/features/location/types";
import type { EVModel } from "@/features/ev-data/types";

export function statePageMeta(state: StateData) {
  const title = `EV Savings in ${state.name} (2026) — Real Electricity & Gas Rates`;
  const description =
    `Electricity costs ${state.kwhCents.toFixed(1)}¢/kWh and gas runs ` +
    `$${state.gasDollar.toFixed(2)}/gal in ${state.name}. ` +
    `Calculate exactly what you'd save switching to an EV.`;
  return { title, description };
}

export function evPageMeta(ev: EVModel) {
  const title = `${ev.fullName} Charging Cost (2026) | EV Savings Calculator`;
  const description =
    `The ${ev.fullName} gets ${ev.efficiency} mi/kWh EPA and has ${ev.range} mi range. ` +
    `See how much you'd save vs gas in your state.`;
  return { title, description };
}

export function comparePageMeta(evName: string, gasName: string) {
  const title = `${evName} vs ${gasName} — EV vs Gas Cost Comparison (2026)`;
  const description =
    `Side-by-side fuel cost comparison: ${evName} vs ${gasName}. ` +
    `See annual savings, break-even timeline, and CO₂ impact.`;
  return { title, description };
}
