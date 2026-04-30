import type { StateData } from "@/features/location/types";

export const NATIONAL_AVG: StateData = {
  code: "US", name: "United States", slug: "united-states",
  kwhCents: 16.2, gasDollar: 3.42, hasTOU: false,
};

const RAW: Record<string, { name: string; kwh: number; gas: number; tou: boolean }> = {
  AL:{name:"Alabama",kwh:14.7,gas:3.05,tou:false},
  AK:{name:"Alaska",kwh:24.5,gas:3.85,tou:false},
  AZ:{name:"Arizona",kwh:14.2,gas:3.45,tou:true},
  AR:{name:"Arkansas",kwh:11.8,gas:2.95,tou:false},
  CA:{name:"California",kwh:30.2,gas:4.65,tou:true},
  CO:{name:"Colorado",kwh:14.8,gas:3.25,tou:true},
  CT:{name:"Connecticut",kwh:27.5,gas:3.35,tou:true},
  DE:{name:"Delaware",kwh:15.3,gas:3.20,tou:false},
  DC:{name:"District of Columbia",kwh:16.4,gas:3.55,tou:false},
  FL:{name:"Florida",kwh:14.9,gas:3.30,tou:false},
  GA:{name:"Georgia",kwh:14.1,gas:3.15,tou:true},
  HI:{name:"Hawaii",kwh:41.2,gas:4.85,tou:true},
  ID:{name:"Idaho",kwh:11.4,gas:3.55,tou:false},
  IL:{name:"Illinois",kwh:15.8,gas:3.50,tou:true},
  IN:{name:"Indiana",kwh:15.2,gas:3.20,tou:false},
  IA:{name:"Iowa",kwh:13.4,gas:3.10,tou:false},
  KS:{name:"Kansas",kwh:14.0,gas:3.05,tou:false},
  KY:{name:"Kentucky",kwh:12.5,gas:3.10,tou:false},
  LA:{name:"Louisiana",kwh:12.1,gas:2.95,tou:false},
  ME:{name:"Maine",kwh:25.4,gas:3.40,tou:true},
  MD:{name:"Maryland",kwh:17.6,gas:3.30,tou:true},
  MA:{name:"Massachusetts",kwh:30.8,gas:3.40,tou:true},
  MI:{name:"Michigan",kwh:18.4,gas:3.30,tou:true},
  MN:{name:"Minnesota",kwh:15.2,gas:3.20,tou:true},
  MS:{name:"Mississippi",kwh:13.8,gas:2.95,tou:false},
  MO:{name:"Missouri",kwh:12.6,gas:3.00,tou:false},
  MT:{name:"Montana",kwh:11.9,gas:3.40,tou:false},
  NE:{name:"Nebraska",kwh:11.5,gas:3.10,tou:false},
  NV:{name:"Nevada",kwh:15.1,gas:4.15,tou:true},
  NH:{name:"New Hampshire",kwh:23.2,gas:3.30,tou:true},
  NJ:{name:"New Jersey",kwh:18.4,gas:3.25,tou:true},
  NM:{name:"New Mexico",kwh:14.3,gas:3.20,tou:false},
  NY:{name:"New York",kwh:23.6,gas:3.50,tou:true},
  NC:{name:"North Carolina",kwh:13.6,gas:3.10,tou:true},
  ND:{name:"North Dakota",kwh:11.2,gas:3.20,tou:false},
  OH:{name:"Ohio",kwh:15.8,gas:3.20,tou:false},
  OK:{name:"Oklahoma",kwh:12.8,gas:2.95,tou:false},
  OR:{name:"Oregon",kwh:13.2,gas:3.95,tou:true},
  PA:{name:"Pennsylvania",kwh:18.2,gas:3.45,tou:true},
  RI:{name:"Rhode Island",kwh:28.4,gas:3.40,tou:true},
  SC:{name:"South Carolina",kwh:14.2,gas:3.05,tou:false},
  SD:{name:"South Dakota",kwh:12.8,gas:3.15,tou:false},
  TN:{name:"Tennessee",kwh:13.1,gas:3.05,tou:false},
  TX:{name:"Texas",kwh:14.8,gas:2.95,tou:true},
  UT:{name:"Utah",kwh:11.6,gas:3.50,tou:true},
  VT:{name:"Vermont",kwh:21.4,gas:3.35,tou:true},
  VA:{name:"Virginia",kwh:14.8,gas:3.20,tou:true},
  WA:{name:"Washington",kwh:11.8,gas:4.05,tou:true},
  WV:{name:"West Virginia",kwh:14.6,gas:3.20,tou:false},
  WI:{name:"Wisconsin",kwh:16.4,gas:3.20,tou:true},
  WY:{name:"Wyoming",kwh:11.7,gas:3.30,tou:false},
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
