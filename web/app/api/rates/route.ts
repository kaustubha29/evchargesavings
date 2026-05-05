import { type NextRequest, NextResponse } from "next/server";
import { fetchStateGasPrices, fetchStateElecRates } from "@/features/location/eia";

export const revalidate = 3600;

export async function GET(req: NextRequest) {
  const state = req.nextUrl.searchParams.get("state") ?? "US";
  const [gas, elec] = await Promise.all([fetchStateGasPrices(), fetchStateElecRates()]);

  let kwhCents: number;
  let gasDollar: number;

  if (state === "US") {
    const ev = Object.values(elec.rates);
    const gv = Object.values(gas.rates);
    kwhCents  = ev.length ? +(ev.reduce((a, b) => a + b, 0) / ev.length).toFixed(1) : 16.2;
    gasDollar = gv.length ? +(gv.reduce((a, b) => a + b, 0) / gv.length).toFixed(2) : 3.42;
  } else {
    kwhCents  = elec.rates[state] ?? 16.2;
    gasDollar = gas.rates[state]  ?? 3.42;
  }

  return NextResponse.json(
    { state, kwhCents, gasDollar, gasPeriod: gas.period, elecPeriod: elec.period },
    { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } },
  );
}
