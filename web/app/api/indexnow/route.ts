import { NextRequest, NextResponse } from "next/server";

const KEY      = "ccd656076fbc461f9a711d00e5945297";
const HOST     = "www.evchargesavings.com";
const BASE     = `https://${HOST}`;
const KEY_LOC  = `${BASE}/${KEY}.txt`;

const STATIC_PATHS = [
  "/",
  "/about",
  "/contact",
  "/ev-owner",
  "/guides",
  "/ev-insurance",
  "/how-we-calculate",
  "/privacy",
  "/terms",
];

const TOP_EV_SLUGS = [
  "tesla-model-y-long-range-awd",
  "tesla-model-3-long-range-rwd",
  "chevrolet-bolt-ev",
  "kia-ev6-long-range-rwd",
  "hyundai-ioniq-5-long-range-rwd",
];

const TOP_STATE_SLUGS = [
  "california",
  "texas",
  "florida",
  "washington",
  "oregon",
  "new-york",
  "colorado",
  "arizona",
  "georgia",
  "virginia",
  "new-jersey",
  "north-carolina",
  "illinois",
  "massachusetts",
  "minnesota",
];

const TOP_GUIDE_SLUGS = [
  "walmart-ev-charging-network-2026",
  "is-ev-right-for-you",
  "ev-tax-credit-7500",
  "home-charging-setup",
  "time-of-use-rates",
  "ev-vs-hybrid",
  "best-home-ev-chargers-2026",
  "ev-charging-cost-per-mile",
  "ev-vs-gas-savings-usa",
  "ev-total-cost-ownership",
  "state-ev-charging-incentives",
  "tesla-vs-gas-savings-calculator",
  "most-affordable-evs-2026",
  "ev-maintenance-costs",
  "buying-used-ev",
  "level-2-charger-cost-breakdown",
];

function buildDefaultUrls(): string[] {
  const urls: string[] = STATIC_PATHS.map((p) => `${BASE}${p}`);
  for (const state of TOP_STATE_SLUGS) {
    urls.push(`${BASE}/ev-cost/${state}`);
  }
  for (const guide of TOP_GUIDE_SLUGS) {
    urls.push(`${BASE}/guides/${guide}`);
  }
  for (const ev of TOP_EV_SLUGS) {
    for (const state of TOP_STATE_SLUGS) {
      urls.push(`${BASE}/cost-to-charge/${ev}/${state}`);
    }
  }
  return urls;
}

export async function POST(req: NextRequest) {
  const secret = process.env.INDEXNOW_SECRET;
  if (secret && req.headers.get("x-indexnow-secret") !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const urls: string[] = Array.isArray(body.urls)
    ? body.urls
    : buildDefaultUrls();

  const res = await fetch("https://api.indexnow.org/IndexNow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: KEY_LOC,
      urlList: urls,
    }),
  });

  return NextResponse.json({ status: res.status, urls: urls.length });
}
