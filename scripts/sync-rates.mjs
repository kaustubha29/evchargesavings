#!/usr/bin/env node
/**
 * scripts/sync-rates.mjs
 * Fetch TOU rate data from the NREL Utility Rate Database (URDB) for the
 * 15 utilities tracked in web/features/location/data/utilities.ts and print
 * a diff of what's changed vs the hardcoded values.
 *
 * Usage:
 *   OPENEI_API_KEY=<key> node scripts/sync-rates.mjs
 *
 * Free API key: https://openei.org/services/api/signup
 * URDB docs:    https://openei.org/services/doc/rest/util_rates
 * Lookup EIA IDs at: https://openei.org/apps/USURDB/
 */

const API_KEY = process.env.OPENEI_API_KEY ?? "DEMO_KEY";
const BASE = "https://api.openei.org/utility_rates";

// EIA utility IDs — cross-check at https://openei.org/apps/USURDB/ if a fetch returns nothing.
// Set eiaId to null to skip URDB lookup and rely on the name-search fallback only.
const UTILITIES = [
  { slug: "pge-california",                  eiaId: 14328, name: "Pacific Gas and Electric Co",       currentOff: 23,  currentOn: 54  },
  { slug: "sce-california",                  eiaId: 17609, name: "Southern California Edison Co",     currentOff: 26,  currentOn: 59  },
  { slug: "sdge-california",                 eiaId: 16577, name: "San Diego Gas & Electric Co",       currentOff: 13,  currentOn: 80  },
  { slug: "comed-illinois",                  eiaId: 3755,  name: "Commonwealth Edison Co",            currentOff: 10,  currentOn: 18  },
  { slug: "coned-new-york",                  eiaId: 4226,  name: "Consolidated Edison Co-NY Inc",     currentOff: 5,   currentOn: 28  },
  { slug: "dominion-virginia",               eiaId: 20173, name: "Virginia Electric & Power Co",      currentOff: 13,  currentOn: 30  },
  { slug: "duke-energy-north-carolina",           eiaId: 5416,  name: "Duke Energy Carolinas LLC",         currentOff: 7,   currentOn: 13  },
  { slug: "duke-energy-progress-north-carolina",  eiaId: 6001,  name: "Duke Energy Progress LLC",          currentOff: 7,   currentOn: 13  },
  { slug: "duke-energy-south-carolina",           eiaId: 5416,  name: "Duke Energy Carolinas LLC",         currentOff: 6,   currentOn: 22  },
  { slug: "duke-energy-progress-south-carolina",  eiaId: 6001,  name: "Duke Energy Progress LLC",          currentOff: 9,   currentOn: 29  },
  { slug: "fpl-florida",                     eiaId: 6452,  name: "Florida Power & Light Co",          currentOff: 9,   currentOn: 26  },
  { slug: "georgia-power",                   eiaId: 7140,  name: "Georgia Power Co",                  currentOff: 2,   currentOn: 30  },
  { slug: "portland-general-electric-oregon",eiaId: 14354, name: "Portland General Electric Co",      currentOff: 9,   currentOn: 44  },
  { slug: "puget-sound-energy-washington",   eiaId: 14860, name: "Puget Sound Energy Inc",            currentOff: 10,  currentOn: 23  },
  { slug: "xcel-energy-colorado",            eiaId: 15466, name: "Public Service Co of Colorado",     currentOff: 7,   currentOn: 21  },
  { slug: "eversource-massachusetts",        eiaId: 3263,  name: "NSTAR Electric",                    currentOff: 19,  currentOn: 38  },
  { slug: "national-grid-new-york",          eiaId: 13478, name: "Niagara Mohawk Power Corp",         currentOff: 7,   currentOn: 14  },
  { slug: "rocky-mountain-power-utah",       eiaId: 14915, name: "PacifiCorp",                        currentOff: 7,   currentOn: 32  },
];

/**
 * Fetch approved residential rate plans for a utility from URDB with full detail.
 * URDB listing endpoint returns stubs by default — `detail=full` is required to
 * get energyratestructure. `sector=Residential` filters out commercial plans.
 */
async function fetchRates(eiaId) {
  const url = new URL(BASE);
  url.searchParams.set("version", "8");
  url.searchParams.set("format", "json");
  url.searchParams.set("api_key", API_KEY);
  url.searchParams.set("eia", String(eiaId));
  url.searchParams.set("approved", "true");
  url.searchParams.set("sector", "Residential");
  url.searchParams.set("detail", "full");
  url.searchParams.set("limit", "100");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data.items ?? [];
}

/**
 * From a URDB rate plan, extract off-peak (overnight) and on-peak (afternoon)
 * energy rates in ¢/kWh using the weekday schedule matrix.
 *
 * Strategy:
 *  - Off-peak = rate for hour 2am in January (deep overnight, no-peak window)
 *  - On-peak  = rate for hour 6pm in July    (peak demand month + hour)
 *  - Also compute min/max across all periods as fallback
 *
 * Returns null if no energy rate structure is present.
 * Returns null if off == on (flat-rate plan, not a true TOU).
 */
function extractRates(plan) {
  const ers = plan.energyratestructure;
  const wds = plan.energyweekdayschedule;  // 12 months × 24 hours, value = period index

  if (!Array.isArray(ers) || ers.length === 0) return null;

  // Get first tier rate for a given period index
  const periodRate = (idx) => {
    const period = ers[idx];
    if (!Array.isArray(period)) return null;
    const tier = period.find(t => typeof t.rate === "number" && t.rate > 0);
    return tier ? Math.round(tier.rate * 100) : null;
  };

  let offRate = null;
  let onRate = null;

  if (Array.isArray(wds) && wds.length >= 12) {
    // January hour 2am → overnight off-peak
    const janSchedule = wds[0];
    if (Array.isArray(janSchedule) && janSchedule.length >= 24) {
      offRate = periodRate(janSchedule[2]);
    }
    // July (index 6) hour 18 (6pm) → peak
    const julSchedule = wds[6];
    if (Array.isArray(julSchedule) && julSchedule.length >= 24) {
      onRate = periodRate(julSchedule[18]);
    }
  }

  // Fallback: scan all periods for min/max
  const allRates = ers.flatMap(period =>
    Array.isArray(period)
      ? period.map(t => (typeof t.rate === "number" && t.rate > 0) ? Math.round(t.rate * 100) : null).filter(Boolean)
      : []
  );
  if (allRates.length === 0) return null;
  if (offRate === null) offRate = Math.min(...allRates);
  if (onRate === null) onRate = Math.max(...allRates);

  // Must have a meaningful spread to count as TOU (≥5¢)
  if (Math.abs(onRate - offRate) < 5) return null;

  return { off: offRate, on: onRate };
}

/**
 * Pick the most relevant TOU plan for a utility.
 * Preference: "EV" in name > "TOU"/"time-of-use" in name > any plan with real TOU spread.
 */
function pickBestPlan(plans) {
  const withRates = plans.filter(p => Array.isArray(p.energyratestructure) && p.energyratestructure.length > 0);
  if (withRates.length === 0) return null;

  const lbl = (p) => (p.name ?? "").toLowerCase();

  // Only consider plans that pass the TOU spread test
  const touPlans = withRates.filter(p => extractRates(p) !== null);
  if (touPlans.length === 0) return null;

  const evPlan = touPlans.find(p => lbl(p).includes("ev") || lbl(p).includes("electric vehicle"));
  if (evPlan) return evPlan;

  const touPlan = touPlans.find(p => lbl(p).includes("tou") || lbl(p).includes("time-of-use") || lbl(p).includes("time of use"));
  if (touPlan) return touPlan;

  return touPlans[0];
}

function diff(current, fetched) {
  if (!fetched) return null;
  const offDiff = Math.abs(fetched.off - current.off);
  const onDiff = Math.abs(fetched.on - current.on);
  return (offDiff > 1 || onDiff > 1) ? { off: fetched.off, on: fetched.on } : null;
}

// ─── main ────────────────────────────────────────────────────────────────────

const results = [];
let changed = 0;
let noData = 0;

console.log(`\nEV Charge Savings — Utility Rate Sync (URDB)\n${"─".repeat(60)}`);
if (API_KEY === "DEMO_KEY") {
  console.warn("\n⚠  OPENEI_API_KEY not set — using DEMO_KEY (rate-limited to ~30 req/hr).");
  console.warn("   Get a free key at https://openei.org/services/api/signup\n");
}

for (const u of UTILITIES) {
  process.stdout.write(`Fetching ${u.name}… `);
  try {
    const plans = await fetchRates(u.eiaId);
    const plan = pickBestPlan(plans);
    if (!plan) {
      console.log(`NO TOU PLAN FOUND (${plans.length} plans total)`);
      results.push({ ...u, fetched: null, changed: false });
      noData++;
      continue;
    }

    const fetched = extractRates(plan);
    const planLabel = plan.label ?? plan.name ?? "(unlabeled)";
    const d = diff({ off: u.currentOff, on: u.currentOn }, fetched);

    if (d) {
      const viewUrl = `https://openei.org/apps/IURDB/rate/view/${plan.label}`;
      console.log(`CHANGED ← was ${u.currentOff}¢/${u.currentOn}¢, now ${d.off}¢/${d.on}¢  [${planLabel}]`);
      console.log(`         Verify: ${viewUrl}`);
      changed++;
    } else if (fetched) {
      console.log(`OK  ${fetched.off}¢ off / ${fetched.on}¢ on  [${planLabel}]`);
    } else {
      console.log(`NO TOU SPREAD in best plan  [${planLabel}]`);
    }

    results.push({ ...u, fetched, planLabel, changed: !!d });
  } catch (err) {
    console.log(`ERROR: ${err.message}`);
    results.push({ ...u, fetched: null, changed: false, error: err.message });
    noData++;
  }
}

// ─── summary ─────────────────────────────────────────────────────────────────

console.log(`\n${"─".repeat(60)}`);
console.log(`${results.length} utilities checked  |  ${changed} changed  |  ${noData} no data\n`);

if (changed > 0) {
  console.log("SUGGESTED CHANGES to web/features/location/data/utilities.ts:\n");
  for (const r of results) {
    if (!r.changed || !r.fetched) continue;
    console.log(`  slug: "${r.slug}"`);
    console.log(`    offPeakCents: ${r.fetched.off},   // was ${r.currentOff}¢`);
    console.log(`    onPeakCents:  ${r.fetched.on},   // was ${r.currentOn}¢`);
    console.log(`    // from URDB plan: "${r.planLabel}"`);
    console.log();
  }
  console.log("⚠  Always verify against the utility's official rate schedule before updating.");
  console.log("   URDB data can lag by 6-12 months. Cross-check at the utility's rate page.");
}

if (noData > 0) {
  console.log("\nUtilities with no URDB data:");
  for (const r of results) {
    if (r.fetched === null) {
      console.log(`  ${r.name} (slug: ${r.slug})${r.error ? " — " + r.error : ""}`);
    }
  }
  console.log("\n  For these, update rates manually from the utility's rate schedule page.");
  console.log("  Verify EIA IDs at: https://openei.org/apps/USURDB/\n");
}
