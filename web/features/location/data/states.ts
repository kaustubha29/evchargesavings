import type { StateData } from "@/features/location/types";

// Rate provenance. These are refreshed together by `node scripts/refresh-baselines.mjs --write`,
// which pulls the same EIA series the runtime uses (features/location/eia.ts) so the static
// fallback below and the live value can never drift apart by more than one refresh cycle.
//
// RATES_UPDATED      — date we last ran the refresh
// RATES_GAS_PERIOD   — EIA weekly retail gasoline period the fallbacks came from
// RATES_ELEC_PERIOD  — EIA monthly residential electricity period the fallbacks came from
export const RATES_UPDATED = "2026-08-19";
export const RATES_GAS_PERIOD = "2026-08-17";
export const RATES_ELEC_PERIOD = "2026-05";

export const NATIONAL_AVG: StateData = {
  code: "US", name: "United States", slug: "united-states",
  kwhCents: 18.4, gasDollar: 4.18, hasTOU: false, evFee: 138, phevFee: 56,
};

// evFee  = BEV-specific annual registration surcharge (extra EVs pay on top of
//          base registration). Source: NCSL "Special Registration Fees for
//          Electric and Hybrid Vehicles", verified May 2026. Several states
//          index to inflation — figures are best-available current estimates.
//
// phevFee = PHEV-specific annual surcharge (extra PHEVs pay; usually 0–75% of
//           evFee since PHEVs still pay gas tax). $0 where state charges no
//           PHEV surcharge. Sources: NCSL table + DOE Alternative Fuels Data
//           Center (AFDC) + state statutes where noted. Updated May 2026.
//           Used to compute net registration fee impact when user switches
//           from PHEV → BEV: netFeeCost = evFee − phevFee.
const RAW: Record<string, { name: string; kwh: number; gas: number; tou: boolean; ev: number; phev: number }> = {
  AL:{name:"Alabama",             kwh:16.77,gas:3.726,tou:false, ev:200,  phev:103},
  AK:{name:"Alaska",              kwh:28.23,gas:5.213,tou:false, ev:0,    phev:0},
  AZ:{name:"Arizona",             kwh:15.23,gas:4.807,tou:true,  ev:0,    phev:0},
  AR:{name:"Arkansas",            kwh:14.36,gas:3.726,tou:false, ev:200,  phev:100},
  CA:{name:"California",          kwh:33.25,gas:5.509,tou:true,  ev:118,  phev:0},
  CO:{name:"Colorado",            kwh:16.16,gas:4.413,tou:true,  ev:50,   phev:11},
  CT:{name:"Connecticut",         kwh:27.37,gas:4.085,tou:true,  ev:0,    phev:0},
  DE:{name:"Delaware",            kwh:19.38,gas:4.159,tou:false, ev:0,    phev:0},
  DC:{name:"District of Columbia",kwh:25.4,gas:4.159,tou:false, ev:0,    phev:0},
  FL:{name:"Florida",             kwh:15.17,gas:3.874,tou:false, ev:0,    phev:0},
  GA:{name:"Georgia",             kwh:15.84,gas:3.842,tou:true,  ev:239,  phev:0},
  HI:{name:"Hawaii",              kwh:52,  gas:5.213,tou:true,  ev:50,   phev:50},
  ID:{name:"Idaho",               kwh:12.35,gas:4.426,tou:false, ev:140,  phev:75},
  IL:{name:"Illinois",            kwh:23.85,gas:4.027,tou:true,  ev:100,  phev:0},
  IN:{name:"Indiana",             kwh:18.15,gas:4.027,tou:false, ev:230,  phev:77},
  IA:{name:"Iowa",                kwh:14.14,gas:4.027,tou:false, ev:130,  phev:65},
  KS:{name:"Kansas",              kwh:15.13,gas:4.027,tou:false, ev:100,  phev:100},
  KY:{name:"Kentucky",            kwh:14.98,gas:4.027,tou:false, ev:120,  phev:126},
  LA:{name:"Louisiana",           kwh:14.15,gas:3.726,tou:false, ev:110,  phev:60},
  ME:{name:"Maine",               kwh:28.63,gas:4.085,tou:true,  ev:0,    phev:0},
  MD:{name:"Maryland",            kwh:21.77,gas:4.159,tou:true,  ev:125,  phev:100},
  MA:{name:"Massachusetts",       kwh:28.82,gas:4.123,tou:true,  ev:0,    phev:0},
  MI:{name:"Michigan",            kwh:22.01,gas:4.027,tou:true,  ev:267,  phev:50},
  MN:{name:"Minnesota",           kwh:16.95,gas:4.013,tou:true,  ev:75,   phev:75},
  MS:{name:"Mississippi",         kwh:16.16,gas:3.726,tou:false, ev:150,  phev:75},
  MO:{name:"Missouri",            kwh:13.68,gas:4.027,tou:false, ev:90,   phev:53},
  MT:{name:"Montana",             kwh:14.67,gas:4.426,tou:false, ev:130,  phev:70},
  NE:{name:"Nebraska",            kwh:13.59,gas:4.027,tou:false, ev:75,   phev:75},
  NV:{name:"Nevada",              kwh:13.6,gas:4.807,tou:true,  ev:0,    phev:0},
  NH:{name:"New Hampshire",       kwh:27.33,gas:4.085,tou:true,  ev:100,  phev:50},
  NJ:{name:"New Jersey",          kwh:23.27,gas:4.159,tou:true,  ev:270,  phev:0},
  NM:{name:"New Mexico",          kwh:14.12,gas:3.726,tou:false, ev:0,    phev:0},
  NY:{name:"New York",            kwh:29.93,gas:4.168,tou:true,  ev:0,    phev:0},
  NC:{name:"North Carolina",      kwh:15.09,gas:3.842,tou:true,  ev:214.5,phev:107},
  ND:{name:"North Dakota",        kwh:13.61,gas:4.027,tou:false, ev:120,  phev:50},
  OH:{name:"Ohio",                kwh:19.52,gas:4.281,tou:false, ev:200,  phev:150},
  OK:{name:"Oklahoma",            kwh:13.38,gas:4.027,tou:false, ev:110,  phev:82},
  OR:{name:"Oregon",              kwh:16.27,gas:4.807,tou:true,  ev:115,  phev:35},
  PA:{name:"Pennsylvania",        kwh:21.55,gas:4.159,tou:true,  ev:250,  phev:50},
  RI:{name:"Rhode Island",        kwh:29.46,gas:4.085,tou:true,  ev:150,  phev:100},
  SC:{name:"South Carolina",      kwh:16.18,gas:3.842,tou:true,  ev:60,   phev:60},
  SD:{name:"South Dakota",        kwh:15.73,gas:4.027,tou:false, ev:50,   phev:50},
  TN:{name:"Tennessee",           kwh:14.47,gas:4.027,tou:false, ev:200,  phev:100},
  TX:{name:"Texas",               kwh:16.44,gas:3.726,tou:true,  ev:200,  phev:0},
  UT:{name:"Utah",                kwh:12.96,gas:4.426,tou:true,  ev:139,  phev:62},
  VT:{name:"Vermont",             kwh:24.89,gas:4.085,tou:true,  ev:89,   phev:45},
  VA:{name:"Virginia",            kwh:17.61,gas:3.842,tou:true,  ev:128,  phev:64},
  WA:{name:"Washington",          kwh:14.95,gas:5.213,tou:true,  ev:225,  phev:225},
  WV:{name:"West Virginia",       kwh:16.8,gas:3.842,tou:false, ev:200,  phev:100},
  WI:{name:"Wisconsin",           kwh:19.74,gas:4.027,tou:true,  ev:175,  phev:75},
  WY:{name:"Wyoming",             kwh:14.8,gas:4.426,tou:false, ev:200,  phev:200}
};

function toSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export const STATE_DATA: Record<string, StateData> = Object.fromEntries(
  Object.entries(RAW).map(([code, d]) => [
    code,
    { code, name: d.name, slug: toSlug(d.name), kwhCents: d.kwh, gasDollar: d.gas, hasTOU: d.tou, evFee: d.ev, phevFee: d.phev },
  ])
);

// ZIP prefix → state code
const ZIP_RANGES: Record<string, [string, string][]> = {
  AL:[["350","369"]], AK:[["995","999"]], AZ:[["850","865"]], AR:[["716","729"]],
  CA:[["900","966"]], CO:[["800","816"]], CT:[["060","069"]], DE:[["197","199"]],
  DC:[["200","205"],["569","569"]], FL:[["320","349"]], GA:[["300","319"],["398","399"]],
  HI:[["967","968"]], ID:[["832","838"]], IL:[["600","629"]], IN:[["460","479"]],
  IA:[["500","528"]], KS:[["660","679"]], KY:[["400","427"]], LA:[["700","714"]],
  ME:[["039","049"]], MD:[["206","219"]], MA:[["010","027"],["055","055"]],
  MI:[["480","499"]], MN:[["550","567"]], MS:[["386","397"]], MO:[["630","658"]],
  MT:[["590","599"]], NE:[["680","693"]], NV:[["889","898"]], NH:[["030","038"]],
  NJ:[["070","089"]], NM:[["870","884"]], NY:[["005","005"],["100","149"]],
  NC:[["270","289"]], ND:[["580","588"]], OH:[["430","459"]], OK:[["730","749"]],
  OR:[["970","979"]], PA:[["150","196"]], RI:[["028","029"]], SC:[["290","299"]],
  SD:[["570","577"]], TN:[["370","385"]], TX:[["750","799"],["885","885"]],
  UT:[["840","847"]], VT:[["050","054"],["056","059"]], VA:[["220","246"]],
  WA:[["980","994"]], WV:[["247","268"]], WI:[["530","549"]], WY:[["820","831"]],
};

export const ZIP_PREFIX: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  for (const [state, ranges] of Object.entries(ZIP_RANGES)) {
    for (const [lo, hi] of ranges) {
      const a = parseInt(lo, 10), b = parseInt(hi, 10);
      for (let i = a; i <= b; i++) map[String(i).padStart(3, "0")] = state;
    }
  }
  return map;
})();
