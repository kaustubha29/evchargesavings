import { type NextRequest, NextResponse } from "next/server";
import { fetchStateGasPrices, fetchStateElecRates } from "@/features/location/eia";
import { NATIONAL_AVG, STATE_DATA, RATES_UPDATED } from "@/features/location/data/states";

export const revalidate = 3600; // 1h server cache

export async function GET(req: NextRequest) {
  const state = req.nextUrl.searchParams.get("state") ?? "US";
  const [gas, elec] = await Promise.all([fetchStateGasPrices(), fetchStateElecRates()]);

  let kwhCents: number;
  let gasDollar: number;

  if (state === "US") {
    const ev = Object.values(elec.rates);
    const gv = Object.values(gas.rates);
    kwhCents  = elec.rates.US ?? (ev.length ? +(ev.reduce((a, b) => a + b, 0) / ev.length).toFixed(1) : NATIONAL_AVG.kwhCents);
    gasDollar = gas.rates.US ?? (gv.length ? +(gv.reduce((a, b) => a + b, 0) / gv.length).toFixed(2) : NATIONAL_AVG.gasDollar);
  } else {
    kwhCents  = elec.rates[state] ?? STATE_DATA[state]?.kwhCents ?? NATIONAL_AVG.kwhCents;
    gasDollar = gas.rates[state]  ?? STATE_DATA[state]?.gasDollar ?? NATIONAL_AVG.gasDollar;
  }

  return NextResponse.json(
    { state, kwhCents, gasDollar, gasPeriod: gas.period, elecPeriod: elec.period, ratesUpdated: RATES_UPDATED },
    { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200" } },
  );
}
