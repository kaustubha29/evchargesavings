import type { StateData } from "@/features/location/types";

export const NATIONAL_AVG: StateData = {
  code: "US", name: "United States", slug: "united-states",
  kwhCents: 18.3, gasDollar: 4.55, hasTOU: false, evFee: 138,
};

// evFee = EV-specific annual registration surcharge (the extra EVs pay on top of
// base registration that all vehicles pay). Source: NCSL "Special Registration
// Fees for Electric and Hybrid Vehicles", verified May 2026. Several states index
// to inflation — figures are best-available current estimates.
const RAW: Record<string, { name: string; kwh: number; gas: number; tou: boolean; ev: number }> = {
  AL:{name:"Alabama",kwh:16.18,gas:3.999,tou:false,ev:200},
  AK:{name:"Alaska",kwh:25.79,gas:5.719,tou:false,ev:0},
  AZ:{name:"Arizona",kwh:16.03,gas:5.239,tou:true,ev:0},
  AR:{name:"Arkansas",kwh:12.73,gas:3.999,tou:false,ev:200},
  CA:{name:"California",kwh:33.22,gas:6.078,tou:true,ev:118},
  CO:{name:"Colorado",kwh:16.79,gas:4.497,tou:true,ev:50},
  CT:{name:"Connecticut",kwh:30.77,gas:4.496,tou:true,ev:0},
  DE:{name:"Delaware",kwh:16.27,gas:4.537,tou:false,ev:0},
  DC:{name:"District of Columbia",kwh:23.97,gas:4.537,tou:false,ev:0},
  FL:{name:"Florida",kwh:15.8,gas:4.387,tou:false,ev:0},
  GA:{name:"Georgia",kwh:14.13,gas:4.217,tou:true,ev:239},
  HI:{name:"Hawaii",kwh:43.0,gas:5.719,tou:true,ev:50},
  ID:{name:"Idaho",kwh:12.63,gas:4.493,tou:false,ev:140},
  IL:{name:"Illinois",kwh:17.83,gas:4.486,tou:true,ev:100},
  IN:{name:"Indiana",kwh:16.06,gas:4.486,tou:false,ev:230},
  IA:{name:"Iowa",kwh:12.74,gas:4.486,tou:false,ev:130},
  KS:{name:"Kansas",kwh:15.11,gas:4.486,tou:false,ev:100},
  KY:{name:"Kentucky",kwh:13.42,gas:4.486,tou:false,ev:120},
  LA:{name:"Louisiana",kwh:12.87,gas:3.999,tou:false,ev:110},
  ME:{name:"Maine",kwh:32.17,gas:4.496,tou:true,ev:0},
  MD:{name:"Maryland",kwh:20.08,gas:4.537,tou:true,ev:125},
  MA:{name:"Massachusetts",kwh:30.46,gas:4.491,tou:true,ev:0},
  MI:{name:"Michigan",kwh:20.0,gas:4.486,tou:true,ev:267},
  MN:{name:"Minnesota",kwh:15.39,gas:4.136,tou:true,ev:75},
  MS:{name:"Mississippi",kwh:14.72,gas:3.999,tou:false,ev:150},
  MO:{name:"Missouri",kwh:12.17,gas:4.486,tou:false,ev:90},
  MT:{name:"Montana",kwh:13.33,gas:4.493,tou:false,ev:130},
  NE:{name:"Nebraska",kwh:11.79,gas:4.486,tou:false,ev:75},
  NV:{name:"Nevada",kwh:14.38,gas:5.239,tou:true,ev:0},
  NH:{name:"New Hampshire",kwh:26.52,gas:4.496,tou:true,ev:100},
  NJ:{name:"New Jersey",kwh:23.12,gas:4.537,tou:true,ev:270},
  NM:{name:"New Mexico",kwh:15.07,gas:3.999,tou:false,ev:0},
  NY:{name:"New York",kwh:29.99,gas:4.526,tou:true,ev:0},
  NC:{name:"North Carolina",kwh:14.64,gas:4.217,tou:true,ev:214.5},
  ND:{name:"North Dakota",kwh:11.64,gas:4.486,tou:false,ev:120},
  OH:{name:"Ohio",kwh:17.52,gas:4.871,tou:false,ev:200},
  OK:{name:"Oklahoma",kwh:12.89,gas:4.486,tou:false,ev:110},
  OR:{name:"Oregon",kwh:14.64,gas:5.239,tou:true,ev:115},
  PA:{name:"Pennsylvania",kwh:20.3,gas:4.537,tou:true,ev:250},
  RI:{name:"Rhode Island",kwh:29.45,gas:4.496,tou:true,ev:150},
  SC:{name:"South Carolina",kwh:16.15,gas:4.217,tou:false,ev:60},
  SD:{name:"South Dakota",kwh:13.24,gas:4.486,tou:false,ev:50},
  TN:{name:"Tennessee",kwh:12.82,gas:4.486,tou:false,ev:200},
  TX:{name:"Texas",kwh:15.41,gas:3.981,tou:true,ev:200},
  UT:{name:"Utah",kwh:13.33,gas:4.493,tou:true,ev:139},
  VT:{name:"Vermont",kwh:23.27,gas:4.496,tou:true,ev:89},
  VA:{name:"Virginia",kwh:15.96,gas:4.217,tou:true,ev:128},
  WA:{name:"Washington",kwh:14.11,gas:5.628,tou:true,ev:225},
  WV:{name:"West Virginia",kwh:14.41,gas:4.217,tou:false,ev:200},
  WI:{name:"Wisconsin",kwh:18.74,gas:4.486,tou:true,ev:175},
  WY:{name:"Wyoming",kwh:13.04,gas:4.493,tou:false,ev:200},
};

function toSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export const STATE_DATA: Record<string, StateData> = Object.fromEntries(
  Object.entries(RAW).map(([code, d]) => [
    code,
    { code, name: d.name, slug: toSlug(d.name), kwhCents: d.kwh, gasDollar: d.gas, hasTOU: d.tou, evFee: d.ev },
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
