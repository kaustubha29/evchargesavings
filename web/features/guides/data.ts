export interface GuideSection {
  heading: string;
  body: string;
  list?: string[];
}

export interface Guide {
  slug: string;
  title: string;
  hook?: string;
  description: string;
  readTime: string;
  category: string;
  sections: GuideSection[];
}

export const GUIDES: Guide[] = [
  {
    slug: "is-ev-right-for-you",
    title: "Is an EV right for you?",
    description: "5 questions to see whether an EV fits your commute, parking, and lifestyle.",
    readTime: "5 min read",
    category: "Buying",
    sections: [
      {
        heading: "The honest answer",
        body: "An EV is right for most people who park at home and drive under 250 miles a day. It's the wrong choice if you rent without charging access or regularly drive long stretches between charging deserts. Here's how to know which camp you're in.",
      },
      {
        heading: "1. Do you have somewhere to charge overnight?",
        body: "This is the single biggest factor. If you have a garage or dedicated parking spot, a Level 1 outlet (standard 120V) is enough for most commuters — you'll add 40–50 miles overnight. A Level 2 charger (240V) gets you a full charge every night regardless of range. If you park on the street or in a shared lot with no charging, you'll depend entirely on public chargers, which works but adds friction.",
      },
      {
        heading: "2. How far do you drive daily?",
        body: "The average American drives 37 miles a day. Every mainstream EV sold today — even the shortest-range options — covers that with room to spare. If your daily round trip is under 150 miles, almost any EV works. If you regularly drive 200+ miles between charges, focus on long-range models (300+ mile EPA range) like the Model Y Long Range, Ioniq 6, or Lucid Air.",
      },
      {
        heading: "3. What's your road trip situation?",
        body: "EVs handle road trips well if you plan around charging stops. Tesla owners have it easiest with the Supercharger network. NACS-equipped non-Tesla EVs now access Superchargers too. The real question isn't can you road trip — it's are you willing to plan 20-minute stops every 2–3 hours instead of 5-minute gas stops. Most EV owners stop noticing after the first few trips.",
      },
      {
        heading: "4. Total cost of ownership — not just sticker price",
        body: "EVs cost more upfront but significantly less to operate. Fuel costs typically drop 50–70%, and maintenance (no oil changes, fewer brake jobs due to regenerative braking) runs about $900/yr less on average per AAA. Factor in the $7,500 federal tax credit and many state rebates, and the true cost gap shrinks fast. Use the calculator on this page with your specific vehicle and state.",
      },
      {
        heading: "The bottom line",
        body: "You're a strong EV candidate if you have home charging, drive a predictable daily route, and will keep the car 5+ years. You should wait if you rent without charging access, need a vehicle for long rural trips with no charging infrastructure, or plan to sell within 2 years.",
        list: [
          "✓ Home charging access → strong yes",
          "✓ Under 150 miles/day → strong yes",
          "✓ Staying 5+ years → strong yes",
          "⚠ Street parking only → plan for public charging",
          "⚠ Frequent rural long-haul → check charger coverage first",
        ],
      },
    ],
  },
  {
    slug: "ev-tax-credit-7500",
    title: "How to claim the $7,500 EV tax credit",
    description: "Avoid the eligibility traps and get the full $7,500 EV credit.",
    readTime: "6 min read",
    category: "Finance",
    sections: [
      {
        heading: "What the credit actually is",
        body: "The Clean Vehicle Credit (IRC §30D) is a federal income tax credit of up to $7,500 for new EVs and $4,000 for used EVs. It's a non-refundable credit — meaning it reduces your tax liability dollar-for-dollar but you can't receive more than what you owe. As of 2024, you can also transfer the credit to the dealer at point of sale, effectively making it a discount even if your tax liability is lower.",
      },
      {
        heading: "Income limits",
        body: "Your modified adjusted gross income (MAGI) must be under the following limits. If you exceed these, you receive no credit — there's no phase-out.",
        list: [
          "Single filer: $150,000",
          "Head of household: $225,000",
          "Married filing jointly: $300,000",
          "Tip: use whichever year is lower — the year of purchase or the prior year",
        ],
      },
      {
        heading: "Vehicle eligibility",
        body: "Not every EV qualifies. Two tests must pass simultaneously.",
        list: [
          "MSRP cap: $55,000 for sedans/hatchbacks, $80,000 for SUVs, trucks, and vans",
          "Assembly: final assembly must be in North America (US, Canada, Mexico)",
          "Battery sourcing: increasing % of battery minerals and components must be sourced from North America or US allies — this is why some models only get $3,750",
          "Check eligibility at fueleconomy.gov before you shop",
        ],
      },
      {
        heading: "The point-of-sale option (since Jan 2024)",
        body: "This changed everything. You can now transfer the tax credit to your dealer, who applies it as a direct price reduction at signing. You don't need to wait until tax time. The dealer files for reimbursement from the IRS. You still need to meet the income limits, and the dealer needs to register with the IRS's Energy Credits Online portal — confirm this before signing.",
      },
      {
        heading: "Used EV credit",
        body: "Qualified used EVs purchased from a dealer get a credit of 30% of the sale price, up to $4,000. Income limits are lower: $75k single, $112.5k head of household, $150k joint. The vehicle must be at least 2 years old, under $25,000, and this must be the first time it's claimed on that specific VIN.",
      },
    ],
  },
  {
    slug: "home-charging-setup",
    title: "Home charging setup checklist",
    description: "A no-nonsense checklist for home EV charging, from panel to permit.",
    readTime: "7 min read",
    category: "Installation",
    sections: [
      {
        heading: "Step 1: Assess your electrical panel",
        body: "Before anything else, find your main breaker panel and check its total amperage — usually 100A, 150A, or 200A stamped on the main breaker. A Level 2 charger draws 30–50A continuously. If your panel is already near capacity (every slot filled, multiple 240V appliances), you may need a panel upgrade or a load management device. A licensed electrician can assess this in 15 minutes.",
      },
      {
        heading: "Step 2: Choose your EVSE",
        body: "For most homeowners, a 40A or 48A Level 2 charger is the sweet spot — that's 9–11 kW, enough to fully charge almost any EV overnight. Smart chargers (JuiceBox 40, Emporia, Wallbox) let you schedule charging during off-peak hours from an app. Basic chargers (Grizzl-E Classic) cost less and never need a firmware update.",
        list: [
          "Grizzl-E Classic 40A — $279, no-frills, outdoor-rated, Canadian made",
          "JuiceBox 40 — $399, Wi-Fi, TOU scheduling, utility rebate eligible",
          "Emporia Level 2 48A — $349, built-in energy monitoring",
          "Tesla Wall Connector Gen 3 — $449, best for Tesla/NACS vehicles",
        ],
      },
      {
        heading: "Step 3: Find a licensed electrician",
        body: "Get 3–5 quotes — prices vary 40–60% by region even for identical work. Ask specifically for EV charger installation experience. They should pull a permit (if they say a permit isn't needed, get a second opinion). Use Angi or Thumbtack to find vetted local electricians, or the lead form on this page.",
        list: [
          "Simple install (panel nearby, 50A available): $500–$900",
          "Typical install (20–60ft run, conduit): $900–$1,500",
          "Complex install (panel upgrade, trenching): $1,500–$3,000+",
        ],
      },
      {
        heading: "Step 4: Permits and inspection",
        body: "Most jurisdictions require a permit for a new 240V circuit. Your electrician should handle this — it's typically $150–$300 and takes 1–2 weeks for scheduling. After installation, an inspector verifies the work. This isn't optional; skipping permits can void your homeowner's insurance and create problems when selling.",
      },
      {
        heading: "Step 5: Enroll in a TOU rate plan",
        body: "Once your charger is installed, check if your utility offers Time-of-Use pricing. Off-peak electricity (typically 9pm–6am) can be 50–70% cheaper than daytime rates. In California, this alone can cut your charging cost from 30¢/kWh to under 12¢/kWh. Set your car or charger app to charge only during off-peak hours.",
      },
    ],
  },
  {
    slug: "road-trip-ev",
    title: "Road trip planning with an EV",
    description: "Plan charging stops, manage range, and road trip confidently in an EV.",
    readTime: "8 min read",
    category: "Driving",
    sections: [
      {
        heading: "It's different, not worse",
        body: "Road tripping in an EV means planning 20-minute charging stops instead of 5-minute gas stops. In exchange, you often stop at better places (Buc-ee's, Whole Foods, nice rest stops) and your car arrives pre-planned. Most EV owners report road trip anxiety disappears after their first successful trip.",
      },
      {
        heading: "Plan your route with ABRP",
        body: "A Better Route Planner (ABRP) is the gold standard for EV road trip planning. Connect it to your car's live data (via OBD adapter or direct API), enter your destination, and it calculates charging stops accounting for elevation, weather, speed, and your car's real-world efficiency. It's free for basic use, $3/month for live data integration.",
        list: [
          "Set your starting state of charge (usually 80–90% for a road trip start)",
          "Set arrival minimum at 10–15% to buffer for detours",
          "Enable weather adjustment for winter or high-temperature trips",
          "Check the 'alternatives' view — sometimes one longer stop beats two short ones",
        ],
      },
      {
        heading: "The 20–80 rule",
        body: "DC fast chargers slow dramatically above 80% state of charge — the last 20% can take as long as the first 80%. On road trips, charge to 80% and move on. Only charge to 100% at your final destination overnight. This isn't a limitation — it means you spend less time at chargers than you'd expect.",
      },
      {
        heading: "Vet your charging stops",
        body: "Before you arrive at a fast charger, check PlugShare for recent check-ins (last 24–48 hours). Out-of-order stalls are common, especially at older locations. If a station has multiple recent check-ins with no complaints, it's reliable. If the last check-in was a week ago with a problem report, find a backup.",
        list: [
          "Prefer stations with 6+ stalls — even if 1-2 are broken, you won't queue",
          "Tesla Superchargers have the best uptime of any network by a significant margin",
          "Electrify America is improving but still has reliability issues at some locations",
          "ChargePoint and EVgo tend to be reliable at well-maintained locations",
        ],
      },
      {
        heading: "Cold weather and real-world range",
        body: "Cold weather reduces EV range 20–40%. Preconditioning your battery while still plugged in (most cars do this automatically if you set a departure time) recovers most of that loss. In winter, plan charging stops 15–20% earlier than you would in summer. Highway speeds (75–80 mph) also reduce range 20–25% vs EPA ratings — factor both in.",
      },
    ],
  },
  {
    slug: "ev-vs-hybrid",
    title: "EV vs hybrid: which is right for you?",
    description: "Pick the right powertrain: hybrid, plug-in hybrid, or full EV.",
    readTime: "6 min read",
    category: "Buying",
    sections: [
      {
        heading: "Three very different vehicles",
        body: "The term 'hybrid' covers a spectrum. A traditional hybrid (like the Toyota RAV4 Hybrid) uses a gas engine with a small battery that captures braking energy — you never plug it in. A plug-in hybrid (PHEV, like the RAV4 Prime) has a larger battery you charge at home, giving 25–50 miles of electric range. A battery electric vehicle (BEV) runs solely on electricity with no gas engine at all.",
      },
      {
        heading: "When a plug-in hybrid (PHEV) makes more sense",
        body: "PHEVs shine if you have range anxiety you're not ready to overcome, take frequent long trips through charging deserts, or can't charge at home. You get EV efficiency for daily driving (most people's commutes fit within the electric range) with gas-engine backup for everything else. The downside: you're buying two powertrains, which means more complexity and higher maintenance long-term.",
        list: [
          "Commute under 40 miles/day + can charge at home → runs mostly electric",
          "Regular 400+ mile road trips with sparse charging → gas backup is genuinely useful",
          "Can't install home charging → PHEV offers more flexibility",
        ],
      },
      {
        heading: "When a full BEV makes more sense",
        body: "A full EV wins on operating cost, simplicity, and driving experience. No oil changes, no timing chains, regenerative braking extends brake life to 100k+ miles. The instant torque makes even budget EVs feel fast. If you have home charging and most of your driving is predictable, a BEV will cost you less over 5 years — often significantly less.",
        list: [
          "Home charging available → wake up to a full battery every day",
          "Mostly local/suburban driving → rarely need public fast charging",
          "Keeping 5+ years → operating savings compound significantly",
          "Want the simplest, most reliable drivetrain → BEV has fewer moving parts",
        ],
      },
      {
        heading: "Cost comparison over 5 years",
        body: "Assume $40,000 purchase price for comparison. A PHEV saves roughly $500–800/yr on fuel versus a pure gas car (depending on how often you charge). A BEV saves $1,000–1,500/yr. Over 5 years that's $2,500–4,000 for a PHEV vs $5,000–7,500 for a BEV, before accounting for maintenance differences. The federal tax credit applies to both, narrowing the upfront gap.",
      },
      {
        heading: "The verdict",
        body: "Choose a PHEV if you want insurance against range anxiety and your situation is genuinely uncertain. Choose a BEV if you have home charging and most of your driving is under 200 miles/day — you'll save more money, enjoy a simpler vehicle, and never miss the gas engine after the first week.",
      },
    ],
  },
  {
    slug: "time-of-use-rates",
    title: "Understanding time-of-use (TOU) rates",
    description: "Slash charging cost 40–60% by shifting to off-peak electricity.",
    readTime: "5 min read",
    category: "Savings",
    sections: [
      {
        heading: "What TOU pricing is",
        body: "Time-of-Use electricity rates charge different prices depending on when you use power. Peak hours (typically 4–9pm on weekdays) cost 2–4× more than off-peak hours (typically 9pm–6am and weekends). Utilities offer TOU because it encourages customers to shift consumption away from the hours when the grid is most stressed. EV owners benefit enormously because charging is flexible — your car doesn't care if it charges at midnight.",
      },
      {
        heading: "How much you can actually save",
        body: "At national average rates (16.2¢/kWh), charging a Model Y for a year of typical driving costs about $437 at home. On a good TOU plan charging at off-peak rates (as low as 7–12¢/kWh in some states), that drops to $190–280/yr. That's an extra $150–250 in savings just from when you charge, on top of the EV vs gas savings.",
        list: [
          "California (PG&E EV2-A): ~8¢/kWh off-peak vs 55¢ peak",
          "Texas (TXU EV Plan): ~6¢/kWh off-peak overnight",
          "Arizona (APS EV): ~5¢/kWh off-peak",
          "Most states: off-peak rates range from 7–14¢/kWh",
        ],
      },
      {
        heading: "How to find and enroll",
        body: "Search '[your utility name] time of use EV rate' — most major utilities have a dedicated EV rate. Enrollment is usually free and takes 5 minutes online. Your utility may send a new smart meter if needed (no cost to you). Some utilities offer bill protection guarantees while you trial TOU for the first 12 months.",
      },
      {
        heading: "Setting up scheduled charging",
        body: "Once enrolled, tell your car or charger to only charge during off-peak hours. Every major EV has this built in — look for 'Scheduled Charging' or 'Departure Time' in your car's app or settings. Smart chargers like JuiceBox, Emporia, and Wallbox also have built-in scheduling. Set the window to start charging at 9pm (or whenever your off-peak begins) and finish by 6am.",
        list: [
          "Tesla: Charging Settings → Schedule → set off-peak start/end",
          "Hyundai/Kia: MyHyundai or Kia Connect app → Charging → Schedule",
          "Ford: FordPass app → Charge Settings → Scheduled Charging",
          "Smart charger: set within the charger's own app",
        ],
      },
      {
        heading: "One catch: summer peak pricing",
        body: "In hot climates (California, Arizona, Texas), summer peak rates can be extreme — 45–60¢/kWh during afternoon hours. On TOU plans, avoid running high-draw appliances (dishwasher, dryer, AC) during peak hours in summer, not just your car charger. Pre-cool your home before 4pm if you're in a hot climate.",
      },
    ],
  },
  {
    slug: "ev-charging-connectors-explained",
    title: "EV charging connectors explained: NACS vs CCS vs CHAdeMO",
    description: "NACS, CCS, CHAdeMO — which plug your EV uses and why it matters.",
    readTime: "6 min read",
    category: "Charging",
    sections: [
      {
        heading: "Why three standards exist",
        body: "EVs arrived to market in the early 2010s without a unified connector standard. Europe went with CCS, Japan/Korea went with CHAdeMO, and the US had a mix. Tesla built proprietary Superchargers using their own connector (NACS). Now Tesla's connector is being adopted as the North American standard, and other networks are adding adapters or retrofitting.",
      },
      {
        heading: "NACS (North American Charging Standard) — the future",
        body: "Originally Tesla's proprietary standard, now adopted by Ford, GM, Rivian, and others. NACS is a compact design with two round male pins inside, designed for efficiency. All new Tesla Superchargers support NACS. Non-Tesla EVs now come with NACS ports or adapters. This is the standard you want if buying a new EV today.",
        list: [
          "Used by: Tesla, Ford, GM, Rivian, Lucid, and new adopters",
          "Home charging: Level 2 and DC fast use NACS",
          "Availability: Best for Supercharger access",
          "Lifespan: Highest rated for durability (over 500k cycles)",
        ],
      },
      {
        heading: "CCS (Combined Charging System) — the mainstream standard until 2024",
        body: "CCS combines a Type 2 AC connector with two additional DC pins underneath for fast charging. It's bulkier than NACS but was the standard across Hyundai, Kia, Volkswagen, BMW, and others until recently. Many public charging networks use CCS connectors.",
        list: [
          "Used by: Hyundai, Kia, Volkswagen, BMW, Mercedes (older models)",
          "DC Fast chargers: Electrify America, Electrify Canada use CCS",
          "Level 2 home charging: CCS Type 2 inlet for AC charging",
          "Transition: Many CCS networks adding NACS cables alongside existing ones",
        ],
      },
      {
        heading: "CHAdeMO — declining, mainly Japan/Korea",
        body: "CHAdeMO was championed by Nissan, Mitsubishi, and Kia. It uses a flat, rectangular plug. CHAdeMO supports DC fast charging but has lower power limits than CCS. Very few new EVs use CHAdeMO — it's mostly Nissan Leaf owners.",
        list: [
          "Used by: Nissan Leaf, Mitsubishi i-MiEV",
          "Finding chargers: Rapidly shrinking — less than 5% of US public network",
          "Future: Phasing out — very few new cars support it",
        ],
      },
      {
        heading: "Adapter strategy",
        body: "If you own a CCS or CHAdeMO vehicle and want to access Tesla Superchargers, buy a CCS-to-NACS or CHAdeMO-to-NACS adapter ($200–400). These are passive adapters that simply change the connector shape. They work but add an extra step — you plug in the adapter, then plug into the charger.",
      },
      {
        heading: "Buying advice for 2026",
        body: "Choose an EV with NACS if possible. If you're buying a used 2020–2023 model, check if it's CCS or NACS before purchase — if CCS, budget for an adapter if you want Supercharger access. All new home Level 2 chargers are NACS, so no future-proofing worries there.",
      },
    ],
  },
  {
    slug: "buying-used-ev",
    title: "Buying a used EV: what to check",
    description: "Check battery health, warranty, and red flags before buying a used EV.",
    readTime: "7 min read",
    category: "Buying",
    sections: [
      {
        heading: "Used EV prices are stabilizing",
        body: "Used EV prices spiked in 2021–2023 due to supply shortage. By 2026, the market has cooled and stabilized. You can now find good used EVs at near-historical lows. Certified pre-owned (CPO) vehicles typically come with extended battery warranty (8 years/100k miles is common).",
      },
      {
        heading: "Battery health: the main factor",
        body: "Battery degradation is the biggest concern for used EVs. Modern batteries degrade 2–5% per year under normal conditions (highway driving, varied temperatures, charging practices). An EV with 60k miles at age 4 years might be at 90–95% capacity. Most owners don't notice until 80% capacity or lower, and you can still road trip at 85% capacity.",
        list: [
          "Ask the dealer or owner for battery health report (most newer cars log this)",
          "Tesla: check battery percentage in 'Trip Planner' or app",
          "Other brands: request service history or degradation data from dealer",
          "Red flag: car older than 6 years with over 100k miles and no battery report",
        ],
      },
      {
        heading: "Mileage expectations",
        body: "EVs have fewer moving parts than gas cars — no oil changes, no transmission fluid, fewer brake jobs due to regen. A used EV with 80k miles is roughly equivalent to a gas car with 60k miles in terms of wear and tear. Brake pads and rotors on EVs last 2–3× longer than gas cars.",
      },
      {
        heading: "Warranty coverage to check",
        body: "Most manufacturers offer: 8-year/100k-mile battery warranty, 5-year/60k-mile powertrain, and 3-year/36k-mile comprehensive. Certified pre-owned vehicles often extend the battery warranty to 10 years/120k miles. Ask if the warranty transfers to the second owner.",
        list: [
          "Tesla: 8 yr / 120k mi on battery (2nd owner gets 5 yr / 80k mi)",
          "Hyundai/Kia: 10 yr / 100k mi on battery",
          "Ford: 8 yr / 100k mi on battery",
          "BMW/Mercedes: 8 yr / 100k mi on battery (varies by model)",
        ],
      },
      {
        heading: "Test drive focus areas",
        body: "Unlike gas cars, you're listening and feeling for different things. Quiet is normal — listen instead for any high-pitched whining (could be coolant pump) or clunking in the rear (suspension or loosened heat shield). Regenerative braking should feel smooth — not abrupt or delayed. Test the fast charger if possible.",
      },
      {
        heading: "Price: what to expect",
        body: "A 4-year-old EV with 50k miles should cost 50–65% of its original price. A 6-year-old EV with 80k miles around 35–50%. Base model used EVs (Nissan Leaf, Chevy Bolt, Hyundai Ioniq) can be found under $15k with warranty remaining.",
      },
      {
        heading: "Red flags to avoid",
        body: "Major accident history (look up Carfax), multiple owners in short timeframe, no service records, refusal to provide battery health data, and cosmetic issues (faded trim, interior wear beyond mileage).",
      },
    ],
  },
  {
    slug: "ev-battery-degradation",
    title: "EV battery degradation: what to expect over time",
    description: "How fast EV batteries age, what affects them, and how to preserve range.",
    readTime: "6 min read",
    category: "Ownership",
    sections: [
      {
        heading: "Modern EV batteries are very durable",
        body: "Lithium-ion battery degradation is a known, measured phenomenon. Modern EV batteries (2015+) degrade slower than phones because they operate in a narrower state of charge window and have active thermal management. Real-world data shows degradation of 2–5% per 100k miles, not per year.",
      },
      {
        heading: "Typical degradation rates by model",
        body: "Tesla Supercharger data shows Model Y/Model 3 at 10% degradation after 200k miles. Chevy Bolt degradation studies show similar rates. Most owners don't perceive range loss until 80% capacity or lower, and very few cars reach end-of-life before the car itself is 15+ years old.",
        list: [
          "Year 1: 1–2% (initial settling, normal)",
          "Years 2–5: 1–2% per year (typical use)",
          "Years 6–10: 0.5–1% per year (stabilizes)",
          "Long-term: most cars at 85–90% capacity after 10 years",
        ],
      },
      {
        heading: "What accelerates degradation?",
        body: "Battery chemistry likes consistent, moderate temperatures and charge levels. The worst practices are: constant DC fast charging (generates heat), consistently charging to 100% daily, leaving the car parked for months uncharged in hot climates, and towing (generates heat and stress on battery thermal management).",
        list: [
          "❌ Daily DC fast charging from 5% to 100%: accelerates degradation 2–3×",
          "❌ Parking in 110°F+ heat with full charge for weeks",
          "❌ Deep discharge cycles (under 5% battery) repeatedly",
          "✓ Charging to 80% most days, Level 2 charging",
          "✓ Keeping car in moderate temperature environment",
          "✓ Letting car sit at 50% charge if parked long-term",
        ],
      },
      {
        heading: "Can you extend battery life?",
        body: "Yes — small choices compound. Enable 'limit charge to 80%' in your car's app for daily use. Charge during cooler hours if possible. Use Level 2 charging most of the time, DC fast charging only for road trips. Precondition (warm up) the battery in winter before driving.",
        list: [
          "Use 'charge limit to 80%' feature for daily drives",
          "Charge overnight at Level 2 when possible",
          "Avoid DC fast charging unless road tripping",
          "Precondition battery 10 min before winter drives",
          "Avoid leaving car in extreme heat with full charge",
        ],
      },
      {
        heading: "Warranty coverage for battery degradation",
        body: "Almost all manufacturers cover battery degradation below 70–75% capacity. If your battery drops to 70% capacity before the warranty expires (typically 8 years / 100k miles), the manufacturer replaces it for free. This has never happened to a mainstream EV under real-world use.",
      },
      {
        heading: "What's battery life really?",
        body: "A car's engine wears out around 200k miles. EV batteries are designed to last 300k–500k miles — well beyond the car's usable life. The battery will degrade, but it won't suddenly fail. At 80% capacity, a 300-mile EV still does 240 miles between charges, which is plenty for most use cases.",
      },
    ],
  },
  {
    slug: "winter-driving-ev",
    title: "Winter driving with an EV: preconditioning, range, and charging",
    description: "Minimize cold-weather range loss with preconditioning and smart charging.",
    readTime: "6 min read",
    category: "Driving",
    sections: [
      {
        heading: "Cold weather range loss is real but manageable",
        body: "In freezing temperatures (below 32°F), EV range typically drops 20–40% compared to 70°F conditions. This isn't battery failure — it's physics. Cold batteries are less efficient, and cabin heating draws significant power. The good news: most drivers don't notice the loss on daily commutes, and the effect disappears once you precondition properly.",
      },
      {
        heading: "Preconditioning: the game changer",
        body: "Preconditioning warms the battery and cabin while the car is still plugged in, so you're not burning battery power. Nearly all modern EVs support this via their app or scheduled charging. Set a departure time 10–15 minutes before you leave, and the car automatically heats up while plugged in.",
        list: [
          "Tesla: Schedule Departure Time in app",
          "Hyundai/Kia: Schedule Charging or Trip Planner in app",
          "Ford/GM: Scheduled Charging → set desired departure temperature",
          "Effect: recovers 80–90% of winter range loss when done correctly",
        ],
      },
      {
        heading: "Realistic winter mileage expectations",
        body: "If your EV does 300 miles in 70°F conditions and you're not preconditioning, expect 180–240 miles in 32°F weather (40% loss). If you preheat while plugged in, expect 240–270 miles (10–20% loss). On highway driving (75 mph vs 55 mph) in cold, expect an additional 15–20% loss.",
      },
      {
        heading: "Charging in winter",
        body: "Cold batteries charge more slowly — what normally takes 6 hours might take 8 hours at 32°F. Fast chargers have built-in warmers, so DC fast charging works fine. Level 2 charging in cold is just slower, not harmful to the battery. Most modern EVs have battery heaters that activate before charging in cold.",
      },
      {
        heading: "Driving tips for cold weather",
        body: "Smooth acceleration, moderate speeds, and activated seat warmers (much more efficient than cabin heat) stretch range. Regen braking still works in winter but may be limited until the battery warms up. Avoid floor-it acceleration — it runs the battery heater harder and drains range faster.",
        list: [
          "Use seat and steering wheel warmers instead of high cabin heat",
          "Smooth acceleration, no hard launches",
          "Maintain 55–65 mph instead of 75 mph if range-constrained",
          "Precondition before every winter drive",
          "Plan road trip charging 20% earlier than you would in summer",
        ],
      },
      {
        heading: "Does cold damage the battery?",
        body: "No. EV batteries are designed to operate in freezing temperatures. Cold slows charging and drains range temporarily, but the battery itself isn't harmed. Repeated deep discharges in cold might stress the battery, but normal driving and proper preconditioning prevent this.",
      },
    ],
  },
  {
    slug: "best-home-ev-chargers-2026",
    title: "Best home EV chargers in 2026",
    description: "Compare the best Level 2 home chargers for price, features, and reliability.",
    readTime: "5 min read",
    category: "Installation",
    sections: [
      {
        heading: "What matters most in 2026",
        body: "A good home charger is reliable, easy to install, and supports the EV you own today. Smart features like scheduled charging, energy monitoring, and NACS compatibility matter more than ever. Pick a charger that fits your home, not just the lowest sticker price.",
      },
      {
        heading: "Top charger choices",
        body: "For most homeowners, a 40A Wi-Fi charger is the sweet spot. If you want the best long-term value, choose a brand with strong firmware support and good customer service. Cheap chargers can work, but they often lack reliable scheduling and weatherproofing.",
        list: [
          "JuiceBox 40 — best smart charger for utility-rate savings",
          "Emporia 48A — best monitoring and reliability",
          "Grizzl-E Classic — best budget charger with rugged build",
          "Tesla Wall Connector Gen 3 — best choice for NACS-equipped homes",
        ],
      },
      {
        heading: "Installation and cost",
        body: "Installation typically runs $500–$1,500 depending on panel capacity and cable length. A 40A charger usually needs a 60A circuit. Ask your electrician for a written quote that includes permit, wiring, and labor, not just the charger hardware.",
      },
      {
        heading: "Rebate-ready chargers",
        body: "Many state and utility rebates require a specific model or smart functionality. Choose a charger that qualifies for rebates in your area, then file the paperwork promptly. This can cut the installed cost by $200–$600.",
      },
    ],
  },
  {
    slug: "state-ev-charging-incentives",
    title: "EV charging incentives by state",
    description: "Find the best state and utility rebates for home EV charging and installation.",
    readTime: "6 min read",
    category: "Savings",
    sections: [
      {
        heading: "Why state incentives matter",
        body: "Federal tax credits are only part of the story. Many states and utilities offer rebates for Level 2 chargers, panel upgrades, and EV-ready home circuits. These incentives can reduce upfront cost by hundreds or even thousands of dollars.",
      },
      {
        heading: "Common incentive types",
        body: "The most common programs include direct charger rebates, reimbursement for electrician costs, and waivers for permit fees. Some utilities also offer discounted off-peak rates specifically for EV charging. Check your utility website before you install.",
        list: [
          "Direct charger rebate — $200–$600",
          "EVSE installation credit — $250–$1,000",
          "Time-of-use bill credit — up to $100/year",
          "Free smart charger program — select utilities only",
        ],
      },
      {
        heading: "How to claim the rebate",
        body: "Save receipts, installer invoices, and product specs. Many programs require pre-approval before installation, so don’t finalize your electrician until you confirm the rules. Submit paperwork right after installation to avoid missing deadlines.",
      },
      {
        heading: "States with the strongest programs",
 body: "California, New York, Massachusetts, Oregon, and Washington lead on charger rebates and low-cost EV rates. But many other states still offer useful incentives — even a $200 rebate is worth claiming.",
      },
    ],
  },
  {
    slug: "best-public-ev-charging-networks",
    title: "Best public EV charging networks ranked",
    description: "Compare public charger networks by coverage, reliability, and price.",
    readTime: "6 min read",
    category: "Charging",
    sections: [
      {
        heading: "Network performance today",
        body: "Not all public charging networks are equal. Some excel at reliability, others at coverage, and some at price. The best choice depends on whether you travel often, need urban charging, or want the simplest fast-charging experience.",
      },
      {
        heading: "Top networks to know",
        body: "Tesla Supercharger leads on uptime and speed for NACS vehicles. Electrify America has the widest fast-charger footprint for CCS cars. EVgo is strong in metro areas, while ChargePoint offers the best access to both Level 2 and fast chargers across brands.",
        list: [
          "Tesla Supercharger — best uptime and fastest for NACS",
          "Electrify America — best fast-charger coverage for CCS",
          "EVgo — strong urban fast charging and subscription options",
          "ChargePoint — best mix of Level 2 and DC fast chargers",
        ],
      },
      {
        heading: "How to use multiple networks",
        body: "Install the apps for the networks you're most likely to use, and save payment info ahead of time. Some networks require RFID cards or memberships for the lowest price, while others let you pay as a guest. A single backup app can save you from a long wait when one network station is down.",
      },
      {
        heading: "What to watch for",
        body: "Check charger status before you arrive. Favor stations with multiple stalls and recent check-ins. If a network is consistently expensive or unreliable in your area, plan around a different provider for your regular trips.",
      },
    ],
  },
  {
    slug: "ev-insurance-rates-explained",
    title: "EV insurance rates explained",
    hook: "Why EV premiums can surprise buyers, and the levers that actually lower them.",
    description: "What affects electric car insurance and how to lower your premium.",
    readTime: "6 min read",
    category: "Ownership",
    sections: [
      {
        heading: "Why EV insurance can be different",
        body: "Insurance for EVs often costs more because repair parts and battery replacements are expensive, but many companies now offer EV-specific discounts. Knowing the rate drivers and policy features can save you hundreds a year.",
      },
      {
        heading: "Key factors insurers look at",
        body: "Insurers price EV policies based on vehicle value, repair costs, theft risk, and driver profile. High-end EVs like Teslas tend to cost more to insure, while lower-cost mainstream EVs may be comparable to gas cars once you shop around.",
        list: [
          "Purchase price and repair costs",
          "Battery replacement risk and crashworthiness",
          "Your home charging setup and parking situation",
          "Your driving record, location, and credit score",
        ],
      },
      {
        heading: "Ways to lower your premium",
        body: "Bundle your auto policy with homeowners or renters insurance, ask for EV discounts, and compare companies that specialize in electric vehicles. Adding safety features and choosing a higher deductible can also reduce your cost.",
        list: [
          "Bundle auto + home/renters policies",
          "Ask about EV or green vehicle discounts",
          "Increase your deductible if you can afford it",
          "Keep comprehensive coverage if you park off-street",
        ],
      },
      {
        heading: "Shopping tips for EV owners",
        body: "Get quotes from at least three insurers, including ones known for EV coverage. Verify whether they cover battery damage and replacement, and ask how they handle repairs for aluminum bodies and advanced driver assistance systems.",
      },
    ],
  },
  {
    slug: "apartment-ev-charging",
    title: "EV charging if you live in an apartment",
    hook: "No garage? Build a charging routine that works before you buy.",
    description: "How renters and apartment dwellers can charge an EV without a private garage.",
    readTime: "6 min read",
    category: "Charging",
    sections: [
      {
        heading: "Start with your weekly routine",
        body: "Apartment EV ownership works best when charging fits places you already go: work, grocery stores, gyms, public garages, or fast chargers near weekly errands. Before buying, map three reliable chargers within your normal routine and check recent app reviews for uptime.",
      },
      {
        heading: "Ask your property manager the right way",
        body: "Don't start with a vague request for an EV charger. Ask whether the property has spare electrical capacity near your parking spot, whether they allow tenant-paid installation, and whether they have considered shared Level 2 charging. A clear plan is easier to approve than a general idea.",
        list: [
          "Ask for a written policy on EV charging",
          "Offer to use a licensed electrician and permitted work",
          "Suggest a shared charger if assigned parking is limited",
          "Check whether local right-to-charge laws apply",
        ],
      },
      {
        heading: "Use workplace charging if available",
        body: "Workplace Level 2 charging can replace home charging for many commuters. Even two or three sessions per week may cover most driving. The key is consistency: check pricing, parking time limits, and whether chargers fill up before you arrive.",
      },
      {
        heading: "When public fast charging is enough",
        body: "If you drive modest miles and have a reliable fast charger nearby, you can live without home charging. Expect higher fuel costs than home charging, but still often less than gasoline. Pick an EV with strong fast-charging performance if this will be your main plan.",
      },
      {
        heading: "When to wait",
        body: "Wait if the nearest reliable charger is inconvenient, your commute is long, or you would need fast charging several times per week. The EV itself may be ready; your charging situation might not be. Solving charging first prevents most buyer regret.",
      },
    ],
  },
  {
    slug: "level-1-vs-level-2-charging",
    title: "Level 1 vs Level 2 charging: what you actually need",
    hook: "A standard outlet may be enough, but Level 2 changes the whole ownership rhythm.",
    description: "Compare Level 1 and Level 2 EV charging speeds, costs, and daily use cases.",
    readTime: "5 min read",
    category: "Installation",
    sections: [
      {
        heading: "The simple difference",
        body: "Level 1 charging uses a standard 120V outlet. Level 2 uses a 240V circuit like a dryer or oven. Level 1 is cheap and slow; Level 2 costs more to install but makes the car feel effortless because it can recover a full day of driving in a few hours.",
      },
      {
        heading: "Level 1 is enough for many drivers",
        body: "A standard outlet usually adds 3-5 miles of range per hour. Overnight, that can be 30-50 miles. If your commute is short and you can plug in consistently, Level 1 may cover nearly all daily driving without an installation bill.",
        list: [
          "Best for short commutes",
          "Works with a normal outlet",
          "Lowest upfront cost",
          "Too slow for high-mileage households",
        ],
      },
      {
        heading: "Level 2 is the convenience upgrade",
        body: "Level 2 charging usually adds 20-35 miles of range per hour. It is the better choice for long commutes, multiple drivers, cold winters, or anyone who wants to start every morning with a predictable charge.",
      },
      {
        heading: "Cost difference",
        body: "Level 1 usually costs nothing if you already have a safe outlet. Level 2 installation often costs $500-$1,500 depending on panel capacity, distance from the panel, permits, and whether a new circuit is needed.",
      },
      {
        heading: "The verdict",
        body: "Try Level 1 first if your daily driving is low and you already have a good outlet. Install Level 2 if you drive more than 40 miles a day, have two EVs, need faster recovery, or want the least friction long term.",
      },
    ],
  },
  {
    slug: "ev-maintenance-costs",
    title: "EV maintenance costs: what changes and what does not",
    hook: "No oil changes, fewer brake jobs, but tires and software still matter.",
    description: "A practical guide to EV maintenance costs, service intervals, and surprises.",
    readTime: "6 min read",
    category: "Ownership",
    sections: [
      {
        heading: "What goes away",
        body: "EVs remove many gas-car maintenance items: oil changes, spark plugs, timing belts, exhaust systems, and many transmission services. That is why routine service is usually simpler and cheaper over time.",
      },
      {
        heading: "What still needs attention",
        body: "EVs still need tires, cabin air filters, brake fluid, wiper blades, coolant checks, and suspension work. The car is simpler, but it is not maintenance-free. Heavy EV batteries can also make tire rotation more important.",
        list: [
          "Rotate tires on schedule",
          "Replace cabin air filters",
          "Check brake fluid and coolant intervals",
          "Keep software updated",
          "Inspect suspension and alignment",
        ],
      },
      {
        heading: "Brake pads usually last longer",
        body: "Regenerative braking means the motor slows the car and recovers energy before the friction brakes do much work. Many EV owners go far longer between brake pad replacements, especially in city driving.",
      },
      {
        heading: "Tires can be the surprise cost",
        body: "EVs are quick and heavy, which can wear tires faster if you drive aggressively. Choose EV-rated or high-load tires where recommended, keep pressures correct, and rotate regularly to avoid uneven wear.",
      },
      {
        heading: "Budget expectation",
        body: "For most owners, annual maintenance is lower than a comparable gas car, but not zero. The biggest swing factors are tire choice, driving style, warranty coverage, and whether your model has expensive specialty parts.",
      },
    ],
  },
  {
    slug: "lease-vs-buy-ev",
    title: "Lease vs buy an EV: which saves more?",
    hook: "Leasing can dodge technology risk; buying usually wins if you keep the car.",
    description: "Compare EV leasing and buying based on tax credits, depreciation, mileage, and ownership plans.",
    readTime: "6 min read",
    category: "Finance",
    sections: [
      {
        heading: "Why EV leasing is popular",
        body: "EV technology changes quickly, and leasing can reduce the risk of owning an older battery, slower charging standard, or fast-depreciating model. It also lets shoppers access deals where the lessor passes tax-credit value into the lease payment.",
      },
      {
        heading: "When leasing makes sense",
        body: "Lease if you want the lowest monthly payment, drive predictable miles, and like changing cars every 2-3 years. Leasing is also attractive if you are unsure about charging, range, or which connector standard you want long term.",
        list: [
          "You drive within the lease mileage cap",
          "You want newer battery and charging tech sooner",
          "The lease includes strong incentive discounts",
          "You do not want resale-value risk",
        ],
      },
      {
        heading: "When buying makes sense",
        body: "Buying usually wins if you keep the car 5+ years, drive high miles, or want to customize your charging setup and ownership experience. EV operating savings compound the longer you keep the vehicle.",
      },
      {
        heading: "Watch depreciation",
        body: "Some EVs depreciate faster than gas cars, especially when new prices drop or incentives change. That hurts buyers who sell quickly, but it can help used-EV shoppers. If buying new, choose a model with strong demand, good charging access, and a healthy warranty.",
      },
      {
        heading: "The quick rule",
        body: "Lease if uncertainty is high. Buy if your use case is clear, home charging is solved, and you plan to keep the car. The right financial answer depends less on EV hype and more on how long you will actually own it.",
      },
    ],
  },
  {
    slug: "ev-charging-cost-per-mile",
    title: "EV charging cost per mile: 2026 guide",
    hook: "Turn cents per kWh into the number shoppers actually understand: cost per mile.",
    description: "Learn how to calculate EV charging cost per mile using electricity rates, efficiency, and charging mix.",
    readTime: "5 min read",
    category: "Savings",
    sections: [
      {
        heading: "The quick formula",
        body: "EV cost per mile is electricity price divided by efficiency. If electricity costs 16 cents per kWh and your EV gets 3.5 miles per kWh, your cost is about 4.6 cents per mile. A gas car at 28 MPG with $3.50 gas costs about 12.5 cents per mile.",
      },
      {
        heading: "Home charging vs public charging",
        body: "Most EV owners charge mostly at home, which is why EVs usually beat gas on operating cost. Public fast charging can cost two to three times more than home electricity, so your charging mix matters as much as the car's efficiency.",
        list: [
          "Mostly home charging: lowest cost per mile",
          "Mixed home and public charging: still often cheaper than gas",
          "Mostly DC fast charging: savings shrink quickly",
          "Time-of-use plans can lower overnight charging costs",
        ],
      },
      {
        heading: "Example: efficient EV vs SUV",
        body: "A 3.8 mi/kWh EV at 14 cents per kWh costs about 3.7 cents per mile. A 28 MPG SUV at $3.60 per gallon costs about 12.9 cents per mile. Over 15,000 miles, that difference is roughly $1,380 before maintenance savings.",
      },
      {
        heading: "What changes the number",
        body: "Efficiency, speed, weather, tire choice, and heater use all affect real-world EV cost per mile. Highway driving and winter weather usually raise energy use. City driving often improves EV efficiency because regenerative braking recovers energy.",
      },
      {
        heading: "Use your own rate",
        body: "The best estimate uses your utility rate, your EV model, your annual miles, and your home charging percentage. That is exactly what the EV Charge Savings calculator is built to compare.",
      },
    ],
  },
  {
    slug: "tesla-vs-gas-savings-calculator",
    title: "Tesla vs gas savings calculator: what changes the math?",
    hook: "Tesla savings look great on paper, but rates, mileage, and charging habits decide the real number.",
    description: "Compare Tesla fuel costs against gas cars and learn what drives the biggest savings.",
    readTime: "6 min read",
    category: "Savings",
    sections: [
      {
        heading: "Why Tesla savings vary so much",
        body: "A Tesla can save hundreds or thousands per year compared with a gas vehicle, but there is no single universal number. A Model 3 charged at home in a low-cost electricity state will look very different from a Model X that relies heavily on public fast charging.",
      },
      {
        heading: "The three inputs that matter most",
        body: "The biggest drivers are electricity rate, gas price, and annual miles. Efficiency matters too, but local energy prices usually move the savings estimate more than small differences between Tesla trims.",
        list: [
          "Your home electricity price",
          "Your gas vehicle's MPG",
          "Annual miles driven",
          "Percent charged at home vs public chargers",
        ],
      },
      {
        heading: "Model 3 and Model Y are the savings sweet spot",
        body: "Model 3 and Model Y tend to produce the strongest savings because they are efficient, common, and affordable relative to larger EVs. They also benefit from Tesla's charging ecosystem and mature route planning.",
      },
      {
        heading: "Supercharging changes the comparison",
        body: "Supercharging is convenient, especially on road trips, but it usually costs more than charging at home. A Tesla owner who charges at home 80-90% of the time will usually save more than one who uses fast charging as the main fuel source.",
      },
      {
        heading: "Run the comparison",
        body: "Use a Tesla vs your current gas car in the calculator, then adjust home charging percentage and annual miles. That will show whether the savings come from the vehicle, your local rates, or your driving pattern.",
      },
    ],
  },
  {
    slug: "ev-vs-gas-savings-usa",
    title: "EV vs gas savings in the USA",
    hook: "EV savings are national, but the best states have the biggest electricity-to-gas advantage.",
    description: "See how EV vs gas savings work across the United States and why state rates matter.",
    readTime: "6 min read",
    category: "Savings",
    sections: [
      {
        heading: "The national pattern",
        body: "Across the United States, EVs usually cost less to fuel than comparable gas vehicles because electric drivetrains are much more efficient. The exact savings depend on state electricity rates, local gas prices, and how often the vehicle charges at home.",
      },
      {
        heading: "Why state rates matter",
        body: "Two states can produce very different results for the same EV. A state with moderate electricity prices and high gasoline prices will usually show strong EV savings. A state with expensive electricity and cheap gas will still often favor EVs, but by a smaller margin.",
      },
      {
        heading: "Home charging is the advantage",
        body: "Home charging is the core reason EVs save money. Public fast charging is valuable for trips, but home electricity is usually cheaper and more predictable. Drivers who can charge overnight tend to get the best results.",
        list: [
          "Charge mostly at home for the strongest savings",
          "Use time-of-use plans where available",
          "Compare by cost per mile, not just annual totals",
          "Recheck the math if gas or utility prices change",
        ],
      },
      {
        heading: "Bigger vehicles save more dollars",
        body: "Replacing a low-MPG SUV or truck with an efficient EV often creates larger dollar savings than replacing a compact gas car. That is why EV trucks and crossovers can show dramatic fuel savings despite using more electricity than small EVs.",
      },
      {
        heading: "Use state pages for local intent",
        body: "For a better estimate, start with your state page and then select your EV and gas vehicle. Localized pages help show whether your state is above or below the national savings pattern.",
      },
    ],
  },
  {
    slug: "level-2-charger-cost-breakdown",
    title: "Level 2 charger cost breakdown",
    hook: "Hardware is only one piece. Wiring, permits, and panel capacity usually decide the real bill.",
    description: "Understand Level 2 EV charger hardware, installation, permit, and panel upgrade costs.",
    readTime: "6 min read",
    category: "Installation",
    sections: [
      {
        heading: "What you are paying for",
        body: "A Level 2 charger project has two main costs: the charger hardware and the electrical installation. Hardware can be a few hundred dollars, while installation varies based on panel capacity, distance, labor, conduit, permits, and whether the charger is plug-in or hardwired.",
      },
      {
        heading: "Typical installed cost",
        body: "Many homeowners land around $800-$1,500 installed. A simple job near the panel may cost less. A long wiring run, outdoor conduit, trenching, or an older electrical panel can raise the total quickly.",
      },
      {
        heading: "Plug-in vs hardwired",
        body: "Plug-in chargers use an outlet such as NEMA 14-50 and can be easier to replace later. Hardwired chargers are often cleaner, safer outdoors, and may support higher amperage. Your electrician can tell you which path fits your panel and local code.",
      },
      {
        heading: "Panel capacity is the big variable",
        body: "If your electrical panel has enough capacity, installation is usually straightforward. If not, you may need a panel upgrade, load management device, or lower-amperage charger. This is why quotes can vary widely for homes that look similar from the outside.",
      },
      {
        heading: "How to avoid overpaying",
        body: "Get multiple quotes, ask whether the permit is included, and confirm the amperage, breaker size, wire run, and charger mounting location. A clear written quote makes it easier to compare electricians fairly.",
      },
    ],
  },
  {
    slug: "most-affordable-evs-2026",
    title: "Most affordable EVs 2026",
    hook: "Budget doesn't mean compromise. These EVs deliver range, features, and long-term savings under $40K.",
    description: "Find the best affordable EVs in 2026 with real pricing, range, and total cost of ownership.",
    readTime: "5 min read",
    category: "Buying",
    sections: [
      {
        heading: "Affordable EVs that deliver real value",
        body: "The cheapest EVs aren't always the best deals. True value means reliable range, warranty, charging speed, and low operating costs. Here are the top budget-friendly picks that check every box in 2026.",
      },
      {
        heading: "Under $30,000 (after federal tax credit)",
        body: "The Chevy Bolt EV and Nissan Leaf remain the workhorses of affordable EV ownership. Both offer 200+ mile range, proven reliability, and lower insurance costs than luxury EVs. The Bolt EV especially stands out with fast charging and comfortable daily driving.",
        list: [
          "Chevy Bolt EV — $26,500 after credit, 259 mi range",
          "Nissan Leaf — $22,000 after credit, 149 mi range",
          "Both have large, established owner communities",
          "Insurance and maintenance costs stay low",
        ],
      },
      {
        heading: "$30,000–$40,000 range",
        body: "This sweet spot offers new technology, longer warranties, and faster charging. The Hyundai Ioniq 6, Kia EV6, and upcoming affordable Nissan models fit here. You gain DC fast charging, modern infotainment, and often better real-world efficiency.",
        list: [
          "Hyundai Ioniq 6 — 300+ mi range, great efficiency",
          "Kia EV6 — 310 mi range, quick charging speed",
          "VW ID.4 Standard — $34K after credit, spacious",
          "Better warranty and software support than Bolt",
        ],
      },
      {
        heading: "Don't forget the total cost of ownership",
        body: "Fuel and maintenance savings add up. An affordable EV costs $0.03–$0.04 per mile to charge at home, while gas cars cost $0.10–$0.14. Over 5 years and 75,000 miles, that's $5,000–$8,000 in fuel savings alone — often enough to recoup the purchase price difference.",
      },
      {
        heading: "Best strategy for budget buyers",
        body: "Use our calculator to compare your specific EV to your current gas vehicle in your state. Include fuel costs, available incentives, and expected maintenance. You'll often find that a slightly pricier EV with better efficiency and charging speed saves more money over time than the absolute cheapest option.",
      },
    ],
  },
  {
    slug: "ev-range-myths-debunked",
    title: "EV range myths debunked",
    hook: "Range anxiety is real, but the myths around it aren't. Modern EVs solve most real-world concerns.",
    description: "Separate fact from fiction about EV range, charging networks, and what real owners actually experience.",
    readTime: "6 min read",
    category: "Education",
    sections: [
      {
        heading: "Why range anxiety exists (and why it's usually overstated)",
        body: "Range anxiety comes from a real change: you can't stop at any gas station. But modern EV networks and home charging have solved most practical problems. The gap between perception and reality has shrunk dramatically since 2020.",
      },
      {
        heading: "Myth 1: You'll run out of charge unexpectedly",
        body: "Reality: Modern EVs show accurate range estimates and alert you well before battery depletion. Home charging means you start most days with a full battery. Even on road trips, planning a 20-minute charging stop every 200 miles is routine — not an emergency.",
        list: [
          "Real-world range matches EPA estimates within 5-10%",
          "Navigation apps show charging stations automatically",
          "Most daily driving starts with a full battery",
          "Degradation of 15-20% over 10 years is typical, not sudden",
        ],
      },
      {
        heading: "Myth 2: Cold weather makes EVs unusable",
        body: "Reality: Winter reduces range 20-40%, but this affects ice and cabin heating, not the battery itself. Most modern EV owners in cold states report that range rarely limits their daily driving. Preheating while plugged in recovers much of the loss.",
      },
      {
        heading: "Myth 3: DC fast charging ruins the battery",
        body: "Reality: Modern batteries manage charging speed automatically and slow down when hot. Using DC fast charging occasionally won't significantly impact long-term battery life. Frequent overnight home charging at lower speeds is still ideal, but occasional fast charging is safe.",
      },
      {
        heading: "Myth 4: Road trips are impossible",
        body: "Reality: Road trips take longer than gas cars (add 20 minutes per 200 miles for charging), but they're entirely feasible. Most experienced EV owners find the rhythm easy after the first trip. Tesla's Supercharger network and NACS expansion make cross-country drives increasingly common.",
        list: [
          "Plan routes using built-in navigation or PlugShare",
          "Typical road trip: 200 mi → 20 min charge stop",
          "Superchargers and NACS networks keep expanding",
          "Many gas-car drivers take the same breaks anyway",
        ],
      },
      {
        heading: "What real owners say",
        body: "The consensus from 5+ years of EV ownership data: 90% of driving is predictable and local, starting from a full battery. Range only becomes an issue on unplanned long drives or in locations with poor charging infrastructure. For typical drivers in typical regions, this almost never happens.",
      },
    ],
  },
];

export function getGuideBySlug(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
