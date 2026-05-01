export interface GuideSection {
  heading: string;
  body: string;
  list?: string[];
}

export interface Guide {
  slug: string;
  title: string;
  description: string;
  readTime: string;
  category: string;
  sections: GuideSection[];
}

export const GUIDES: Guide[] = [
  {
    slug: "is-ev-right-for-you",
    title: "Is an EV right for you?",
    description: "The 5 questions that determine whether an EV fits your life — apartment vs. home, commute length, access to public charging.",
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
    description: "Income limits, vehicle eligibility, and the new point-of-sale option. Avoid the mistakes that disqualify thousands of buyers.",
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
    description: "Panel capacity check, charger selection, permit requirements, installer vetting — everything before your Level 2 EVSE goes on the wall.",
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
    description: "How to use ABRP, picking the right charging stops, managing range anxiety, and why most people stop worrying after the first road trip.",
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
    description: "Plug-in hybrid, full hybrid, or battery electric — how each fits different driving patterns.",
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
    description: "How to slash your charging cost by 40–60% by shifting to off-peak electricity pricing. State-by-state program guide.",
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
    description: "What are the differences? Which cars use which? Why is NACS becoming the standard? Everything you need to know about EV charging plugs.",
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
    description: "Battery health, mileage expectations, warranty coverage, and the red flags to avoid. Used EV prices have stabilized — here's how to find a good deal.",
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
    description: "Will the battery fail? How fast does it degrade? Can you extend battery life? What does the warranty actually cover?",
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
    description: "Cold weather cuts EV range 20–40%. Here's how to minimize the hit and stay warm without losing efficiency.",
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
];

export function getGuideBySlug(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
