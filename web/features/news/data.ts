export interface NewsSection {
  heading: string;
  body: string;
  list?: string[];
}

export interface NewsArticle {
  slug: string;
  title: string;
  hook: string;
  description: string;
  readTime: string;
  publishedAt: string;
  sections: NewsSection[];
}

export const NEWS: NewsArticle[] = [
  {
    slug: "walmart-ev-charging-network-2026",
    title: "Walmart Is Building One of America's Biggest EV Charging Networks",
    hook: "36 stations live, 312 stalls, 400 kW chargers — and 200+ permits in the pipeline.",
    description: "Walmart now operates 36 DC fast-charging stations with 312 stalls across 10 states, using 400 kW ABB and Alpitronic hardware. Here's what EV owners need to know about locations, pricing, and access.",
    readTime: "4 min read",
    publishedAt: "2026-05-11",
    sections: [
      {
        heading: "The short version",
        body: "Walmart is building and operating its own branded DC fast-charging network — not leasing space to ChargePoint or Electrify America, but running the hardware itself. As of May 2026: 36 active stations, 312 charging stalls, across 10 US states. Another 124 locations are listed as coming soon, roughly 200 permits are in process, and the long-term target is thousands of locations by 2030. If even 10% of Walmart's 5,200+ stores get chargers, it would rank Walmart among the top public charging networks in the country.",
      },
      {
        heading: "The hardware: 400 kW, dual connector, high uptime",
        body: "Every Walmart charger delivers up to 400 kW — matching Tesla Supercharger V4 output and surpassing most third-party DC fast chargers currently deployed. Each stall supports both NACS (SAE J3400) and CCS1 connectors, so every EV on sale today can plug in without an adapter. Hardware comes from two suppliers: ABB (the A400 all-in-one unit) and Alpitronic (the HYC400). Both units can split power between two vehicles simultaneously at 200 kW each. ABB claims 99% uptime — a meaningful stat given that reliability has historically been the weak point of non-Tesla public chargers.",
        list: [
          "400 kW max output per stall",
          "200 kW per vehicle when two charge simultaneously",
          "NACS + CCS1 ports on every stall",
          "Hardware: ABB A400 or Alpitronic HYC400",
          "99% uptime claimed (ABB)",
        ],
      },
      {
        heading: "Where the chargers are now",
        body: "Active stations are concentrated in the Sun Belt and Southeast. Texas leads with the most locations, followed by Arizona. The April 2026 Phoenix rollout added nine Walmart locations (Mesa, Tempe, Apache Junction, Queen Creek) with 38 chargers. Other states with live stations include Florida, Colorado, Georgia, Oklahoma, Alabama, Arkansas, New Jersey, and South Carolina. Walmart's geographic footprint is a major asset: roughly 90% of Americans live within 10 miles of a Walmart or Sam's Club.",
      },
      {
        heading: "How to pay — and the app requirement",
        body: "Accessing a Walmart charger requires the Walmart smartphone app. There are no standalone credit card readers at most stations — you scan a QR code, select your connector, and confirm payment in-app. The exception is a pilot in California where card terminals are present, likely due to California's requirement that public chargers accept payment without an app. Walmart Plus members get a 10% discount on charging as part of an ongoing pilot. Pricing runs approximately $0.48 per kWh at most locations — competitive with Electrify America and EVgo, and cheaper than per-minute pricing networks.",
        list: [
          "Walmart app required to start a charge (most locations)",
          "California pilot locations have credit card readers",
          "~$0.48/kWh at most stations",
          "10% discount for Walmart Plus members (pilot)",
        ],
      },
      {
        heading: "Why this matters for EV owners",
        body: "Walmart's footprint is different from dedicated charging networks. Stops align with grocery runs and errands rather than highway corridors — which is exactly where Level 2 charging has traditionally dominated and DC fast charging has been sparse. A 400 kW charger during a 30-minute Walmart run adds 150–200 miles of range to most EVs, turning an errand into an efficient top-up. The app-only friction is a real drawback for now, but Walmart's scale and capital — combined with a reported 4% store-visit lift from nearby chargers — makes this a program with strong business incentive to continue expanding.",
      },
      {
        heading: "What's coming next",
        body: "The pipeline is active: 124 locations are listed as coming soon and approximately 200 permits are currently in process, targeting 350+ total stations in the near term. Walmart has not published a detailed state-by-state expansion map, but permit filings suggest continued focus on Texas, the Southwest, Southeast, and Mid-Atlantic. The infrastructure is also designed for future battery storage integration, which could reduce grid demand charges and lower per-kWh costs over time.",
      },
    ],
  },
];

export function getNewsBySlug(slug: string): NewsArticle | undefined {
  return NEWS.find((a) => a.slug === slug);
}
