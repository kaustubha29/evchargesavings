#!/usr/bin/env node
// Refresh the hardcoded state rate fallbacks in web/features/location/data/states.ts
// from live EIA data. Mirrors the fetch logic in web/features/location/eia.ts so the
// static fallback and the runtime value come from the same series.
//
// Usage:
//   node scripts/refresh-baselines.mjs           # report only
//   node scripts/refresh-baselines.mjs --write   # rewrite states.ts RAW + NATIONAL_AVG
//
// Requires EIA_API_KEY (read from web/.env.local if not already in the environment).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const STATES_FILE = path.join(ROOT, "web/features/location/data/states.ts");
const ENV_FILE = path.join(ROOT, "web/.env.local");

const WRITE = process.argv.includes("--write");

function loadKey() {
  if (process.env.EIA_API_KEY) return process.env.EIA_API_KEY;
  if (!fs.existsSync(ENV_FILE)) return null;
  const line = fs
    .readFileSync(ENV_FILE, "utf8")
    .split(/\r?\n/)
    .find((l) => l.startsWith("EIA_API_KEY="));
  return line ? line.slice("EIA_API_KEY=".length).trim() : null;
}

const EIA_KEY = loadKey();
if (!EIA_KEY) {
  console.error("EIA_API_KEY not found in environment or web/.env.local");
  process.exit(1);
}

// Same PADD fallback map as web/features/location/eia.ts — EIA publishes weekly
// retail gas for only a handful of states; everyone else uses their sub-region.
const STATE_TO_PADD = {
  CT: "R1X", ME: "R1X", NH: "R1X", RI: "R1X", VT: "R1X",
  DC: "R1Y", DE: "R1Y", MD: "R1Y", NJ: "R1Y", PA: "R1Y",
  GA: "R1Z", NC: "R1Z", SC: "R1Z", VA: "R1Z", WV: "R1Z",
  IA: "R20", IL: "R20", IN: "R20", KS: "R20", KY: "R20",
  MI: "R20", MO: "R20", ND: "R20", NE: "R20", OK: "R20",
  SD: "R20", TN: "R20", WI: "R20",
  AL: "R30", AR: "R30", LA: "R30", MS: "R30", NM: "R30",
  ID: "R40", MT: "R40", UT: "R40", WY: "R40",
  AK: "R50", HI: "R50", AZ: "R5XCA", NV: "R5XCA", OR: "R5XCA",
};

async function fetchGas() {
  const url =
    `https://api.eia.gov/v2/petroleum/pri/gnd/data/` +
    `?api_key=${EIA_KEY}&frequency=weekly&data[0]=value` +
    `&facets[product][]=EPM0&facets[process][]=PTE` +
    `&sort[0][column]=period&sort[0][direction]=desc&length=500`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`gas HTTP ${res.status}`);
  const json = await res.json();

  const stateLevel = {};
  const paddLevel = {};
  let period = "";
  for (const row of json.response?.data ?? []) {
    if (typeof row.duoarea !== "string" || row.value == null) continue;
    if (!period && row.period) period = row.period;
    if (row.duoarea === "NUS") {
      if (!("US" in stateLevel)) stateLevel.US = parseFloat(row.value);
    } else if (/^S[A-Z]{2}$/.test(row.duoarea)) {
      const code = row.duoarea.slice(1);
      if (!(code in stateLevel)) stateLevel[code] = parseFloat(row.value);
    } else if (/^R/.test(row.duoarea)) {
      if (!(row.duoarea in paddLevel)) paddLevel[row.duoarea] = parseFloat(row.value);
    }
  }
  const rates = { ...stateLevel };
  for (const [state, padd] of Object.entries(STATE_TO_PADD)) {
    if (!(state in rates) && padd in paddLevel) rates[state] = paddLevel[padd];
  }
  return { rates, period };
}

async function fetchElec() {
  const url =
    `https://api.eia.gov/v2/electricity/retail-sales/data/` +
    `?api_key=${EIA_KEY}&frequency=monthly&data[0]=price` +
    `&facets[sectorid][]=RES` +
    `&sort[0][column]=period&sort[0][direction]=desc&length=200`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`elec HTTP ${res.status}`);
  const json = await res.json();

  const rates = {};
  let period = "";
  for (const row of json.response?.data ?? []) {
    const code = row.stateid;
    if (typeof code !== "string" || code.length !== 2) continue;
    if (!period && row.period) period = row.period;
    if (!(code in rates) && row.price != null) rates[code] = parseFloat(row.price);
  }
  return { rates, period };
}

const [gas, elec] = await Promise.all([fetchGas(), fetchElec()]);
console.log(`EIA gas period:         ${gas.period}  (${Object.keys(gas.rates).length} states)`);
console.log(`EIA electricity period: ${elec.period}  (${Object.keys(elec.rates).length} states)\n`);

const src = fs.readFileSync(STATES_FILE, "utf8");
const rawMatch = src.match(/const RAW: Record<[^>]+> = \{([\s\S]*?)\n\};/);
if (!rawMatch) {
  console.error("Could not locate RAW block in states.ts");
  process.exit(1);
}

const rowRe = /^(\s*)([A-Z]{2}):\{name:"([^"]+)",\s*kwh:([\d.]+),\s*gas:([\d.]+),\s*tou:(true|false),\s*ev:([\d.]+),\s*phev:([\d.]+)\},?\s*$/;
const CRLF = src.includes("\r\n");
const lines = rawMatch[1].split(/\r?\n/);

// First pass: parse every row so column widths can be computed before emitting.
const parsed = lines.map((line) => {
  const m = line.match(rowRe);
  if (!m) return { raw: line };
  const [, ind, code, name, kwhOld, gasOld, tou, ev, phev] = m;
  return { ind, code, name, kwhOld: +kwhOld, gasOld: +gasOld, tou, ev, phev };
});

const rows = parsed.filter((r) => r.code);
const nameW = Math.max(...rows.map((r) => `"${r.name}",`.length));
const evW = Math.max(...rows.map((r) => `${r.ev},`.length));

let out = [];
let changed = 0;
const deltas = [];
const newKwh = {};
const newGas = {};

for (const r of parsed) {
  if (!r.code) { out.push(r.raw); continue; }
  const kwh = elec.rates[r.code] != null ? +elec.rates[r.code].toFixed(2) : r.kwhOld;
  const gasV = gas.rates[r.code] != null ? +gas.rates[r.code].toFixed(3) : r.gasOld;
  newKwh[r.code] = kwh;
  newGas[r.code] = gasV;
  if (kwh !== r.kwhOld || gasV !== r.gasOld) {
    changed++;
    deltas.push({ code: r.code, kwhOld: r.kwhOld, kwh, gasOld: r.gasOld, gas: gasV });
  }
  const namePart = `"${r.name}",`.padEnd(nameW);
  const kwhPart = `kwh:${kwh},`.padEnd(9);
  const touPart = `tou:${r.tou},`.padEnd(11);
  const evPart = `ev:${r.ev},`.padEnd(evW + 3);
  out.push(`${r.ind}${r.code}:{name:${namePart}${kwhPart}gas:${gasV},${touPart}${evPart}phev:${r.phev}},`);
}

// Prefer EIA's own sales-weighted US figures. An unweighted mean of the 51
// state values skews high because Hawaii and California are extreme outliers.
const kwhVals = Object.values(newKwh);
const gasVals = Object.values(newGas);
const meanKwh = +(kwhVals.reduce((a, b) => a + b, 0) / kwhVals.length).toFixed(1);
const meanGas = +(gasVals.reduce((a, b) => a + b, 0) / gasVals.length).toFixed(2);
const natKwh = elec.rates.US != null ? +elec.rates.US.toFixed(1) : meanKwh;
const natGas = gas.rates.US != null ? +gas.rates.US.toFixed(2) : meanGas;

deltas.sort((a, b) => Math.abs(b.gas - b.gasOld) - Math.abs(a.gas - a.gasOld));
console.log(`States changed: ${changed}/${Object.keys(newKwh).length}`);
console.log("\nLargest gas moves:");
for (const d of deltas.slice(0, 10)) {
  console.log(
    `  ${d.code}  kwh ${String(d.kwhOld).padStart(6)} -> ${String(d.kwh).padEnd(6)}` +
    `  gas ${String(d.gasOld).padStart(6)} -> ${d.gas}`,
  );
}
console.log(`\nNATIONAL_AVG: kwhCents ${natKwh}  gasDollar ${natGas}`);

if (!WRITE) {
  console.log("\n(report only — re-run with --write to apply)");
  process.exit(0);
}

const stamp = new Date().toISOString().slice(0, 10);
let updated = src.replace(rawMatch[1], out.join(CRLF ? "\r\n" : "\n").replace(/,$/, ""));

updated = updated.replace(
  /kwhCents: [\d.]+, gasDollar: [\d.]+,/,
  `kwhCents: ${natKwh}, gasDollar: ${natGas},`,
);
updated = updated.replace(
  /export const RATES_UPDATED = "[^"]*";/,
  `export const RATES_UPDATED = "${stamp}";`,
);
updated = updated.replace(
  /export const RATES_GAS_PERIOD = "[^"]*";/,
  `export const RATES_GAS_PERIOD = "${gas.period}";`,
);
updated = updated.replace(
  /export const RATES_ELEC_PERIOD = "[^"]*";/,
  `export const RATES_ELEC_PERIOD = "${elec.period}";`,
);

fs.writeFileSync(STATES_FILE, updated, "utf8");
console.log(`\nWrote ${STATES_FILE}`);
console.log(`RATES_UPDATED = ${stamp}`);
