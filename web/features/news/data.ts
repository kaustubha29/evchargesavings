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
  {
    slug: "us-dc-fast-charging-72000-ports-may-2026",
    title: "America's DC Fast-Charging Network Hits 72,514 Ports — Up 30% in One Year",
    hook: "72,514 DC fast-charging ports, 30% year-over-year growth, and NACS now at 52% of new deployments.",
    description: "US public DC fast-charging infrastructure reached 72,514 ports across 15,417 locations as of May 2026 — a 30% increase year-over-year. Tesla holds 51% market share, while high-power 350–400 kW chargers now dominate new deployments.",
    readTime: "4 min read",
    publishedAt: "2026-05-10",
    sections: [
      {
        heading: "The numbers at a glance",
        body: "America's public DC fast-charging network reached 72,514 ports across 15,417 locations as of May 1, 2026. That's a 30% increase year-over-year — roughly one in four DC fast-charging ports operating today didn't exist 12 months ago. April 2026 alone added over 1,100 new stalls. Average station size grew from 4.6 ports to 5.5, reflecting a shift toward larger, more capable charging hubs rather than small two-stall installations.",
      },
      {
        heading: "Who owns what",
        body: "Tesla Superchargers continue to dominate with 37,229 ports — 51.3% of the national DC fast-charging market. The gap between Tesla and non-Tesla networks remains wide but is narrowing as Electrify America, EVgo, and ChargePoint all expanded significantly in Q1 2026.",
        list: [
          "Tesla Supercharger: 37,229 ports (51.3%)",
          "Electrify America: 5,593 ports (7.7%)",
          "EVgo: 5,175 ports (7.1%)",
          "ChargePoint: 4,767 ports (6.6%)",
          "Blink: 2,011 ports (2.8%)",
          "Ionna: 1,064 ports (1.5%)",
        ],
      },
      {
        heading: "NACS becomes the universal standard",
        body: "NACS (SAE J3400) — the connector originally developed by Tesla — now represents 52% of new DC fast-charging port deployments, reaching 40,000 total NACS-capable public ports as of May 10, 2026. Every major automaker has committed to NACS, meaning new EVs rolling off the line this year natively plug into both Tesla Superchargers and third-party networks without an adapter. CCS1 ports remain in operation but are no longer being installed as the primary connector at new sites.",
      },
      {
        heading: "Power is going up fast",
        body: "High-power chargers delivering 250 kW or more now represent 67% of new DC fast-charging deployments. Non-Tesla networks are increasingly installing 350–400 kW hardware — the same output class as Tesla Supercharger V4 and Walmart's new stations. For compatible vehicles, that translates to 150–200 miles of range added in under 20 minutes. Average DC fast-charging price held steady at $0.53/kWh through Q1 2026.",
      },
      {
        heading: "How much are people using it",
        body: "Q1 2026 saw nearly 38 million DC fast-charging sessions — up 15% year-over-year. Despite strong growth in sessions, average utilization across the network actually dipped slightly to 15.6%, meaning most chargers aren't crowded. Network reliability improved to 93.5% nationally, up from roughly 78% in 2022 when charger reliability was a major consumer concern.",
      },
      {
        heading: "What this means for range anxiety",
        body: "The data increasingly undermines the 'nowhere to charge' narrative. A 30% year-over-year expansion in DC fast ports, combined with near-universal NACS adoption and 67% of new installs at 250+ kW, means the public charging experience in 2026 is fundamentally different from 2022. The remaining friction points are geographic gaps in rural areas, app-based payment requirements at some networks, and peak-hour wait times at high-traffic corridors — not absolute scarcity.",
      },
    ],
  },
  {
    slug: "electricity-rates-rising-ev-charging-costs-2026",
    title: "US Electricity Rates Up 5.4% in 2026 — What It Means for Your EV Charging Bill",
    hook: "National average hit 18.05¢/kWh — California utilities are restructuring EV billing entirely.",
    description: "US residential electricity prices averaged 18.05 cents per kWh in early 2026, a 5.4% year-over-year increase. California's PG&E, SCE, and SDG&E are restructuring EV rate plans — here's how to minimize the impact on your charging costs.",
    readTime: "4 min read",
    publishedAt: "2026-05-08",
    sections: [
      {
        heading: "The headline numbers",
        body: "US residential electricity averaged 18.05¢/kWh in early 2026, up 5.4% from early 2025. The EIA projects residential costs could increase an additional 13–18% by end of 2026 as grid infrastructure investments, natural gas prices, data center demand growth, and rising EV adoption collectively push rates higher. For an EV averaging 3.5 miles per kWh, every one-cent increase in the per-kWh rate adds roughly $0.003 per mile to operating costs.",
      },
      {
        heading: "States seeing the biggest jumps",
        body: "Rates are rising unevenly. California (+8.9%), Rhode Island (+8.4%), and Maine (+8.1%) are the hardest hit. States with regulated utilities and significant grid modernization programs are seeing the largest increases. By contrast, states with abundant hydropower — Washington, Oregon — have held rates relatively stable and remain among the cheapest places in the country to charge an EV.",
        list: [
          "California: +8.9% YoY",
          "Rhode Island: +8.4% YoY",
          "Maine: +8.1% YoY",
          "Washington state: still among lowest rates nationally",
          "Oregon: stable rates, significant hydro generation",
        ],
      },
      {
        heading: "California utility restructuring: what changed",
        body: "California's three major investor-owned utilities all changed their rate structures in 2025–2026 in ways that directly affect EV owners. PG&E (effective March 2026) replaced per-kWh charges with a flat Base Services Charge of roughly $24/month while lowering per-kWh usage rates by $0.05–0.07. High-mileage EV owners who charge large volumes may benefit from the lower per-kWh rate offsetting the fixed charge — but the math varies significantly by household. SCE implemented a 12.9% average bill increase in October 2025 and is proposing annual increases through 2028. SDG&E began phasing out EV-specific discount rates in 2025, with full phase-out scheduled for January 1, 2032.",
      },
      {
        heading: "Time-of-use rates remain the biggest lever",
        body: "Despite rising baseline rates, time-of-use (TOU) off-peak charging still offers 40–60% savings over peak-hour charging in most markets. Many utilities outside California offer dedicated EV overnight rates as low as $0.08–$0.12/kWh — roughly half the national average. Maximizing this discount requires scheduling home charging between roughly 11 PM and 7 AM, which the vast majority of modern EVs and smart chargers can handle automatically.",
      },
      {
        heading: "Recalculating EV vs. gas at current rates",
        body: "At 18.05¢/kWh, a 3.5 miles/kWh EV costs about 5.2 cents per mile on home charging at the national average rate. At $3.25/gallon with a 30 MPG gas car, the gas equivalent is 10.8 cents per mile — still more than double. Even in California at the highest rates, the EV cost advantage remains meaningful. The concern is trajectory: if rates rise another 13–18% by year-end as EIA projects, the margin compresses further in high-cost states.",
      },
      {
        heading: "What EV owners should do now",
        body: "Review your current utility rate plan — especially if you're in California, where all three major IOUs have restructured their offerings. Check whether your utility offers a dedicated EV rate tier and compare it against standard TOU plans. If you have solar, evaluate whether a combined solar+EV+battery plan (like SCE's TOU-D-PRIME) changes your optimal charging window. For most EV owners outside California, the best action remains simple: confirm overnight charging is scheduled and you're on a TOU plan.",
      },
    ],
  },
  {
    slug: "ev-tax-credit-eliminated-loan-deduction-2026",
    title: "The $7,500 EV Tax Credit Is Gone — Here's the New Deduction That Replaced It",
    hook: "Section 30D expired Sep 30, 2025. A $10,000/year loan interest deduction now applies — but only if you finance.",
    description: "The One Big Beautiful Bill Act (Public Law 119-21) eliminated the $7,500 federal EV tax credit effective September 30, 2025. It was replaced by an annual auto loan interest deduction of up to $10,000 for US-assembled EVs, active through December 31, 2028.",
    readTime: "4 min read",
    publishedAt: "2026-05-07",
    sections: [
      {
        heading: "The short version",
        body: "The Inflation Reduction Act's $7,500 new-EV tax credit (Section 30D) and $4,000 used-EV credit are gone. They expired September 30, 2025 when President Trump signed the One Big Beautiful Bill Act (Public Law 119-21) on July 4, 2025. The bill replaced point-of-sale incentives with a new annual deduction on auto loan interest — a fundamentally different structure that benefits financed purchases spread over the loan term rather than rewarding the purchase event itself.",
      },
      {
        heading: "The new deduction: up to $10,000/year on loan interest",
        body: "Starting with loans originated on or after January 1, 2025, buyers can deduct up to $10,000 per year in interest paid on qualifying EV loans through December 31, 2028. Income limits apply: the full deduction is available up to $100,000 MAGI for single filers and $200,000 MAGI for joint filers, phasing out completely at $150,000 and $250,000 respectively. Unlike the old credit, there is no MSRP cap — making luxury EVs that were previously excluded now fully eligible.",
        list: [
          "Deduct up to $10,000/year in EV loan interest",
          "Active for loans originated Jan 1, 2025 – Dec 31, 2028",
          "Full deduction: up to $100K MAGI (single) / $200K (joint)",
          "Phases out at $150K (single) / $250K (joint)",
          "No MSRP cap — all price points eligible",
          "Leases do not qualify",
        ],
      },
      {
        heading: "Which vehicles qualify",
        body: "The vehicle must be assembled in the United States. The IRS uses VIN origin as the test: qualifying vehicles have a VIN starting with 1, 4, 5, or 7. Vehicles assembled in Canada or Mexico do not qualify even if sold by US automakers. Popular examples that qualify under this test include the Kia EV6 (assembled in West Point, Georgia), the Tesla Model Y (Fremont, CA and Austin, TX), and the Chevrolet Equinox EV (Spring Hill, TN). Buyers should verify their specific trim's assembly location before assuming eligibility.",
      },
      {
        heading: "Cash buyers get nothing",
        body: "This is the starkest difference from the old credit. Section 30D rewarded the purchase event regardless of how you paid. The new deduction only benefits buyers who finance their EV and pay loan interest. On a $45,000 EV financed at 7% over 60 months, total interest is roughly $8,400 — deducting that over 5 years could be worth $1,700–$2,500 in actual tax savings depending on your bracket. The old $7,500 credit hit entirely in year one. For buyers who planned to pay cash, the federal incentive landscape is now effectively zero.",
      },
      {
        heading: "The home charger credit: expiring June 30",
        body: "The 30% home EV charger credit (Section 30C) — capped at $1,000 for hardware and installation — is still available but only through June 30, 2026, and now only for homes in qualifying census tracts: low-income areas or non-urban communities. If you're outside a qualifying tract, this credit no longer applies. The deadline is real — homeowners planning a Level 2 charger install should act before the end of June if they're in an eligible area.",
      },
      {
        heading: "What EV shoppers should do now",
        body: "Verify your vehicle's VIN assembly location. Confirm you'll be financing (not paying cash). Check income limits. Price-shop across models without the old MSRP ceiling distorting comparisons. And if you want the home charger credit, move before June 30. State-level incentives are increasingly filling the gap left by the eliminated federal credit — California, Colorado, New York, and several other states offer rebates or credits that don't require federal eligibility.",
      },
    ],
  },
  {
    slug: "kia-ev6-2026-pricing-under-40000",
    title: "Kia EV6 2026 Starts at $37,900 — The Cheapest It's Ever Been",
    hook: "Full trim pricing announced May 4: base Light SR RWD at $37,900, Plug & Charge now standard across all trims.",
    description: "Kia announced 2026 EV6 pricing on May 4, with the base Light SR RWD starting at $37,900 ($39,445 with destination) — the lowest entry point in the model's history. All trims gain dual-voltage charging cables and Plug & Charge capability as standard equipment.",
    readTime: "3 min read",
    publishedAt: "2026-05-04",
    sections: [
      {
        heading: "What Kia announced",
        body: "Kia released official 2026 EV6 pricing on May 4, 2026. The base trim — Light SR RWD — starts at $37,900 plus $1,545 destination, for an all-in price of $39,445. That's the lowest entry point for the EV6 since it launched. The pricing move is a direct response to the loss of the federal EV tax credit: with no $7,500 credit to absorb, Kia has structurally reduced the MSRP to keep the effective price competitive.",
      },
      {
        heading: "Full 2026 trim pricing",
        body: "Pricing spans from the entry-level Light SR to the performance GT-Line AWD:",
        list: [
          "Light SR RWD: $37,900 ($39,445 with destination)",
          "Light LR RWD: $41,200",
          "Light LR AWD: $45,200",
          "Wind RWD: $44,800",
          "Wind AWD: $48,800",
          "GT-Line RWD: $48,700",
          "GT-Line AWD: $53,000",
        ],
      },
      {
        heading: "What's new as standard equipment",
        body: "Every 2026 EV6 trim includes a dual-voltage charging cable (Level 1 and Level 2 compatible) as standard — no longer an optional add-on. Kia also added Plug & Charge technology across all trims: the vehicle automatically authenticates and initiates billing at compatible stations without requiring an app or payment card. DC fast-charger adapters are included as standard in ZEV states only. Two new exterior colors arrive: Wolf Gray and Glacier White Pearl.",
      },
      {
        heading: "Why the EV6 qualifies for the new loan deduction",
        body: "The 2026 EV6 is manufactured at Kia's plant in West Point, Georgia — meaning its VIN starts with a US-origin digit, qualifying it for the new annual auto loan interest deduction under the One Big Beautiful Bill Act. Buyers who finance their EV6 can deduct up to $10,000/year in loan interest through 2028, subject to income limits. For a buyer financing $42,000 at 7%, this could represent meaningful annual tax savings.",
      },
      {
        heading: "The competitive picture",
        body: "With federal incentives gone, the EV price war is intensifying. The 2026 EV6 at $39,445 all-in now competes directly with the Chevrolet Equinox EV (starts around $35,000) and undercuts the Ford Mustang Mach-E base trim. Hyundai Ioniq 5 pricing for 2026 has not yet been formally announced, but the EV6 and Ioniq 5 share underpinnings and Hyundai is expected to respond with similar adjustments. For buyers comparing all-electric crossovers under $45,000, the 2026 EV6 is now among the strongest value propositions without requiring any federal credit math.",
      },
    ],
  },
  {
    slug: "tesla-roadster-2026-reveal",
    title: "Tesla Roadster Reveal Is Coming — Musk Confirms 'In a Month or So' After Nine Years",
    hook: "Nine years after the 2017 prototype, Musk says the production Roadster reveal is 'imminent' and 'very different.'",
    description: "Tesla CEO Elon Musk confirmed on the Q1 2026 earnings call (April 22) that the long-delayed Roadster reveal is imminent — described as a 'banger next-level' reveal with a production vehicle 'very different' from the 2017 prototype. Base price: $200,000.",
    readTime: "3 min read",
    publishedAt: "2026-04-22",
    sections: [
      {
        heading: "What Musk said",
        body: "On Tesla's Q1 2026 earnings call on April 22, 2026, CEO Elon Musk described the Roadster reveal as imminent — 'in a month or so' — and called it a 'banger next-level' event. He specifically noted the production vehicle will be 'very different than what we've shown previously,' signaling substantial changes from the 2017 prototype that first previewed the car. The reveal has been teased repeatedly since 2023 without materializing, but the earnings call context gives this the strongest institutional backing yet.",
      },
      {
        heading: "Nine years in the making",
        body: "Tesla first unveiled the second-generation Roadster in November 2017, targeting 2020 production. It never arrived. Each subsequent year brought promises and delays. February 2026 brought fresh trademark filings featuring a noticeably different silhouette — sleeker and lower than the 2017 design — suggesting the vehicle has been significantly re-engineered over the past nine years. The $50,000 Founders Series reservation deposits placed in 2017 have been held without delivery for nearly a decade.",
      },
      {
        heading: "Known specs — subject to change",
        body: "The 2017 prototype specs Musk has repeatedly cited: 0–60 mph in under 1.9 seconds (with more recent claims suggesting under 1 second), 620-mile range, 200 kWh battery pack, 250+ mph top speed. An optional 'SpaceX package' was described as adding approximately 10 cold-air rocket thrusters for additional acceleration. Given that Musk says the production vehicle is 'very different,' these numbers should be treated as directional until the official reveal.",
        list: [
          "Target 0–60 mph: under 1.9 seconds (possibly under 1 second)",
          "Range target: 620 miles",
          "Battery: ~200 kWh",
          "Top speed: 250+ mph",
          "Optional SpaceX thruster package",
        ],
      },
      {
        heading: "Pricing and reservations",
        body: "Base Roadster pricing remains at $200,000. The Founders Series — the first 1,000 production units — is priced at $250,000, with $50,000 reservation deposits required at time of booking. Those reservation holders have been waiting since 2017. Tesla has not formally opened new general reservations for the post-Founders trims, and the production timeline remains a target of 2027–2028 based on current manufacturing readiness.",
      },
      {
        heading: "Why this matters beyond the halo effect",
        body: "The Roadster is not a mass-market vehicle at $200,000. Its significance is what it signals about Tesla's technology generation: battery energy density capable of 620 miles, charging architecture, motor efficiency, and structural innovations that will eventually flow into Model 3, Model Y, and the next-generation vehicles. A credible 200 kWh pack at acceptable weight would represent a significant step beyond Tesla's current production batteries. The reveal — whenever it happens — will set the benchmark that every other automaker's next EV program will be measured against.",
      },
    ],
  },
  {
    slug: "blink-emobi-plug-and-charge-56000-ports-may-2026",
    title: "Blink Activates Plug-and-Charge Across 56,000 EV Ports Through Emobi Partnership",
    hook: "No more app fumbling: Blink's entire US network is going tap-to-charge in 2026.",
    description: "Blink Charging announced a partnership with Emobi to roll out plug-and-charge functionality to its 56,000 EV ports in May 2026, eliminating apps, RFID cards, and credit card swipes for drivers.",
    readTime: "3 min read",
    publishedAt: "2026-05-12",
    sections: [
      {
        heading: "What Just Happened",
        body: "On May 7, 2026, Blink Charging confirmed it's deploying plug-and-charge technology across its roughly 56,000 EV charging ports in partnership with Emobi. The feature lets drivers plug in their vehicle and have the charging session start, authenticate, and bill automatically — no app, no membership card, no tapping a credit card reader required. It's the same frictionless experience Tesla owners have enjoyed at Superchargers for years, now extended to one of the largest third-party charging networks in the US.",
      },
      {
        heading: "Why This Matters for Your Wallet",
        body: "Plug-and-charge isn't just a convenience upgrade — it directly affects what you pay. Drivers without the right app or membership often get hit with higher 'guest' or pay-as-you-go pricing at Blink stations. Automatic authentication tied to your vehicle means consistent member-rate pricing every time you plug in, and it removes the friction that pushes some drivers to abandon public charging for pricier alternatives.",
      },
      {
        heading: "How It Compares to Gas",
        body: "One of the longest-standing complaints about public EV charging is that paying can be harder than pumping gas. With plug-and-charge live across Blink's network, the EV refueling experience becomes faster than gas: you don't even have to take out your wallet or phone. Combined with home charging — where most EV drivers already do 80%+ of their fueling at residential electricity rates — the public charging gap with gas stations continues to narrow.",
      },
      {
        heading: "The Bigger Plug-and-Charge Picture",
        body: "Blink joins a growing list of networks adopting the ISO 15118 plug-and-charge standard. The rollout matters because the US public charging market has been fragmented for years, with each network requiring its own app or RFID card. Key benefits of standardized plug-and-charge include:",
        list: [
          "Automatic billing to a payment method on file — no swiping or tapping",
          "Vehicle identity verified through the charging cable itself",
          "Eliminates the need to download multiple charging apps",
          "Reduces failed sessions caused by payment authorization errors",
          "Works across networks that support the same standard",
        ],
      },
      {
        heading: "Context: A Busy Quarter for Charging",
        body: "The Blink-Emobi rollout lands during a strong build-out period for US charging. According to InsideEVs reporting on Q1 2026 data, the US added over 3,000 new DC fast charging plugs in the first quarter alone, even as EV sales growth has slowed. Networks like EVgo have also been pushing NACS expansion. Blink activating plug-and-charge across its existing 56,000-port footprint is a software-side win that complements all the new hardware coming online.",
      },
      {
        heading: "What EV Drivers Should Do",
        body: "If you regularly use Blink stations, watch for the plug-and-charge activation prompt in your Blink account and confirm your vehicle is compatible — most 2022-and-newer EVs support the ISO 15118 standard. Once enabled, you can stop juggling apps at the kiosk. For shoppers comparing EVs to a new gas car, the trend is clear: the inconveniences that defined early public charging are being engineered out, one network at a time.",
      },
    ],
  },
  {
    slug: "duracell-driivz-ev-fast-charging-network-may-2026",
    title: "Duracell Launches Branded EV Fast-Charging Network Powered by Driivz",
    hook: "The iconic battery brand is entering the DC fast-charging game with a new US network launch.",
    description: "Duracell announced a partnership with Driivz on May 11, 2026 to launch its own EV fast-charging network, bringing a trusted consumer brand into a crowded charging market.",
    readTime: "3 min read",
    publishedAt: "2026-05-13",
    sections: [
      {
        heading: "A Familiar Battery Brand Plugs Into EV Charging",
        body: "Duracell — the household name behind billions of AA batteries — is officially entering the EV fast-charging business. On May 11, 2026, the company confirmed it has tapped charging software platform Driivz to power a new Duracell-branded DC fast-charger network across the United States. For EV drivers, it means another major option is joining a market currently dominated by Tesla, Electrify America, EVgo, and ChargePoint.",
      },
      {
        heading: "Why Driivz Is the Behind-the-Scenes Pick",
        body: "Driivz, owned by Vontier, runs the back-end software for some of the largest charging operators in the world. It handles the unglamorous but critical pieces of running a charging network, including:",
        list: [
          "Payment processing and driver billing",
          "Real-time station monitoring and uptime management",
          "Energy and load management to control electricity costs",
          "Plug-and-charge authentication for seamless sessions",
          "Roaming agreements with other charging networks",
        ],
      },
      {
        heading: "What It Could Mean for Charging Costs",
        body: "More networks generally means more price competition, which is welcome news for EV owners watching public DC fast-charging rates climb. Public fast charging in the US now typically runs $0.40 to $0.60 per kWh — often two to three times what drivers pay at home. A new entrant with strong brand recognition could pressure incumbents on pricing, membership fees, and idle penalties, especially if Duracell pursues retail-partner locations the way Walmart and others have.",
      },
      {
        heading: "Brand Trust Is the Real Weapon",
        body: "One of the biggest complaints about public charging is reliability — broken screens, failed payments, and offline stalls. Duracell isn't building hardware from scratch; it's licensing its trusted name to a network run on proven Driivz software. For shoppers comparing an EV to a gas car, brand familiarity at the charger may ease range-anxiety concerns, much like seeing a recognizable gas station logo off the highway.",
      },
      {
        heading: "How It Fits Into the May 2026 Charging Boom",
        body: "Duracell's launch lands in a busy month for US charging news. Blink announced on May 7 that its 56,000 ports will gain plug-and-charge functionality through Emobi, and the broader US DC fast-charging count crossed 72,000 ports this month. Greenlane also expanded high-power charging along major freight corridors. The trend is clear: charging infrastructure is scaling fast, and competition is heating up.",
      },
      {
        heading: "What EV Owners Should Watch Next",
        body: "Duracell hasn't yet released specifics on charger locations, pricing tiers, or rollout timing. Key questions for cost-conscious drivers will be whether Duracell offers a subscription discount (similar to EVgo Rewards or Electrify America Pass+), whether it supports NACS plugs for Tesla and newer Ford, GM, and Rivian EVs, and how its per-kWh pricing compares to home charging, which still averages around $0.16 per kWh nationally.",
      },
    ],
  },
];

export function getNewsBySlug(slug: string): NewsArticle | undefined {
  return NEWS.find((a) => a.slug === slug);
}
