import type { StateData } from "@/features/location/types";

export const NATIONAL_AVG: StateData = {
  code: "US", name: "United States", slug: "united-states",
  kwhCents: 18.3, gasDollar: 4.55, hasTOU: false,
};

const RAW: Record<string, { name: string; kwh: number; gas: number; tou: boolean }> = {
  AL:{name:"Alabama",kwh:16.18,gas:3.999,tou:false},
  AK:{name:"Alaska",kwh:25.79,gas:5.719,tou:false},
  AZ:{name:"Arizona",kwh:16.03,gas:5.239,tou:true},
  AR:{name:"Arkansas",kwh:12.73,gas:3.999,tou:false},
  CA:{name:"California",kwh:33.22,gas:6.078,tou:true},
  CO:{name:"Colorado",kwh:16.79,gas:4.497,tou:true},
  CT:{name:"Connecticut",kwh:30.77,gas:4.496,tou:true},
  DE:{name:"Delaware",kwh:16.27,gas:4.537,tou:false},
  DC:{name:"District of Columbia",kwh:23.97,gas:4.537,tou:false},
  FL:{name:"Florida",kwh:15.8,gas:4.387,tou:false},
  GA:{name:"Georgia",kwh:14.13,gas:4.217,tou:true},
  HI:{name:"Hawaii",kwh:43.0,gas:5.719,tou:true},
  ID:{name:"Idaho",kwh:12.63,gas:4.493,tou:false},
  IL:{name:"Illinois",kwh:17.83,gas:4.486,tou:true},
  IN:{name:"Indiana",kwh:16.06,gas:4.486,tou:false},
  IA:{name:"Iowa",kwh:12.74,gas:4.486,tou:false},
  KS:{name:"Kansas",kwh:15.11,gas:4.486,tou:false},
  KY:{name:"Kentucky",kwh:13.42,gas:4.486,tou:false},
  LA:{name:"Louisiana",kwh:12.87,gas:3.999,tou:false},
  ME:{name:"Maine",kwh:32.17,gas:4.496,tou:true},
  MD:{name:"Maryland",kwh:20.08,gas:4.537,tou:true},
  MA:{name:"Massachusetts",kwh:30.46,gas:4.491,tou:true},
  MI:{name:"Michigan",kwh:20.0,gas:4.486,tou:true},
  MN:{name:"Minnesota",kwh:15.39,gas:4.136,tou:true},
  MS:{name:"Mississippi",kwh:14.72,gas:3.999,tou:false},
  MO:{name:"Missouri",kwh:12.17,gas:4.486,tou:false},
  MT:{name:"Montana",kwh:13.33,gas:4.493,tou:false},
  NE:{name:"Nebraska",kwh:11.79,gas:4.486,tou:false},
  NV:{name:"Nevada",kwh:14.38,gas:5.239,tou:true},
  NH:{name:"New Hampshire",kwh:26.52,gas:4.496,tou:true},
  NJ:{name:"New Jersey",kwh:23.12,gas:4.537,tou:true},
  NM:{name:"New Mexico",kwh:15.07,gas:3.999,tou:false},
  NY:{name:"New York",kwh:29.99,gas:4.526,tou:true},
  NC:{name:"North Carolina",kwh:14.64,gas:4.217,tou:true},
  ND:{name:"North Dakota",kwh:11.64,gas:4.486,tou:false},
  OH:{name:"Ohio",kwh:17.52,gas:4.871,tou:false},
  OK:{name:"Oklahoma",kwh:12.89,gas:4.486,tou:false},
  OR:{name:"Oregon",kwh:14.64,gas:5.239,tou:true},
  PA:{name:"Pennsylvania",kwh:20.3,gas:4.537,tou:true},
  RI:{name:"Rhode Island",kwh:29.45,gas:4.496,tou:true},
  SC:{name:"South Carolina",kwh:16.15,gas:4.217,tou:false},
  SD:{name:"South Dakota",kwh:13.24,gas:4.486,tou:false},
  TN:{name:"Tennessee",kwh:12.82,gas:4.486,tou:false},
  TX:{name:"Texas",kwh:15.41,gas:3.981,tou:true},
  UT:{name:"Utah",kwh:13.33,gas:4.493,tou:true},
  VT:{name:"Vermont",kwh:23.27,gas:4.496,tou:true},
  VA:{name:"Virginia",kwh:15.96,gas:4.217,tou:true},
  WA:{name:"Washington",kwh:14.11,gas:5.628,tou:true},
  WV:{name:"West Virginia",kwh:14.41,gas:4.217,tou:false},
  WI:{name:"Wisconsin",kwh:18.74,gas:4.486,tou:true},
  WY:{name:"Wyoming",kwh:13.04,gas:4.493,tou:false},
};

function toSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export const STATE_DATA: Record<string, StateData> = Object.fromEntries(
  Object.entries(RAW).map(([code, d]) => [
    code,
    { code, name: d.name, slug: toSlug(d.name), kwhCents: d.kwh, gasDollar: d.gas, hasTOU: d.tou },
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
