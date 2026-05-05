const EIA_KEY = process.env.EIA_API_KEY;

type RateMap = Record<string, number>;
export interface EIAResult {
  rates: RateMap;
  period: string;
}

// EIA only collects weekly retail gas prices for 9 states; all others map to
// their PADD sub-region so every state still gets a live regional price.
const STATE_TO_PADD: Record<string, string> = {
  // PADD 1A — New England
  CT: "R1X", ME: "R1X", NH: "R1X", RI: "R1X", VT: "R1X",
  // PADD 1B — Central Atlantic
  DC: "R1Y", DE: "R1Y", MD: "R1Y", NJ: "R1Y", PA: "R1Y",
  // PADD 1C — Lower Atlantic
  GA: "R1Z", NC: "R1Z", SC: "R1Z", VA: "R1Z", WV: "R1Z",
  // PADD 2 — Midwest
  IA: "R20", IL: "R20", IN: "R20", KS: "R20", KY: "R20",
  MI: "R20", MO: "R20", ND: "R20", NE: "R20", OK: "R20",
  SD: "R20", TN: "R20", WI: "R20",
  // PADD 3 — Gulf Coast
  AL: "R30", AR: "R30", LA: "R30", MS: "R30", NM: "R30",
  // PADD 4 — Rocky Mountain
  ID: "R40", MT: "R40", UT: "R40", WY: "R40",
  // PADD 5 — West Coast (use R5XCA for non-CA states to avoid CA skew)
  AK: "R50", HI: "R50", AZ: "R5XCA", NV: "R5XCA", OR: "R5XCA",
};

function fmtGasPeriod(iso: string) {
  // "2026-04-27" → "Apr 27, 2026"
  const d = new Date(iso + "T12:00:00Z");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}

function fmtElecPeriod(iso: string) {
  // "2026-02" → "Feb 2026"
  const [y, m] = iso.split("-");
  const d = new Date(Date.UTC(Number(y), Number(m) - 1, 1));
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
}

export async function fetchStateGasPrices(): Promise<EIAResult> {
  if (!EIA_KEY) {
    console.warn("[EIA] EIA_API_KEY not set — using static gas prices");
    return { rates: {}, period: "" };
  }
  try {
    const url =
      `https://api.eia.gov/v2/petroleum/pri/gnd/data/` +
      `?api_key=${EIA_KEY}` +
      `&frequency=weekly` +
      `&data[0]=value` +
      `&facets[product][]=EPM0` +
      `&facets[process][]=PTE` +
      `&sort[0][column]=period` +
      `&sort[0][direction]=desc` +
      `&length=500`;
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();

    const stateLevel: RateMap = {};
    const paddLevel: RateMap = {};
    let latestPeriod = "";

    for (const row of json.response?.data ?? []) {
      if (typeof row.duoarea !== "string" || row.value == null) continue;
      if (!latestPeriod && row.period) latestPeriod = row.period;
      if (/^S[A-Z]{2}$/.test(row.duoarea)) {
        const code = row.duoarea.slice(1);
        if (!(code in stateLevel)) stateLevel[code] = parseFloat(row.value);
      } else if (/^R/.test(row.duoarea)) {
        const padd = row.duoarea;
        if (!(padd in paddLevel)) paddLevel[padd] = parseFloat(row.value);
      }
    }

    const rates: RateMap = { ...stateLevel };
    for (const [state, padd] of Object.entries(STATE_TO_PADD)) {
      if (!(state in rates) && padd in paddLevel) {
        rates[state] = paddLevel[padd];
      }
    }

    return { rates, period: latestPeriod ? fmtGasPeriod(latestPeriod) : "" };
  } catch (err) {
    console.warn("[EIA] Gas price fetch failed:", err);
    return { rates: {}, period: "" };
  }
}

export async function fetchStateElecRates(): Promise<EIAResult> {
  if (!EIA_KEY) {
    console.warn("[EIA] EIA_API_KEY not set — using static electricity rates");
    return { rates: {}, period: "" };
  }
  try {
    const url =
      `https://api.eia.gov/v2/electricity/retail-sales/data/` +
      `?api_key=${EIA_KEY}` +
      `&frequency=monthly` +
      `&data[0]=price` +
      `&facets[sectorid][]=RES` +
      `&sort[0][column]=period` +
      `&sort[0][direction]=desc` +
      `&length=200`;
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();

    const rates: RateMap = {};
    let latestPeriod = "";

    for (const row of json.response?.data ?? []) {
      const code = row.stateid;
      if (typeof code !== "string" || code.length !== 2) continue;
      if (!latestPeriod && row.period) latestPeriod = row.period;
      if (!(code in rates) && row.price != null) {
        rates[code] = parseFloat(row.price);
      }
    }

    return { rates, period: latestPeriod ? fmtElecPeriod(latestPeriod) : "" };
  } catch (err) {
    console.warn("[EIA] Electricity rate fetch failed:", err);
    return { rates: {}, period: "" };
  }
}
