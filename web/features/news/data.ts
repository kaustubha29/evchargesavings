export interface NewsSection {
  heading: string;
  body: string;
  list?: string[];
}

export interface NewsSource {
  label: string;
  url: string;
}

export interface NewsArticle {
  slug: string;
  title: string;
  hook: string;
  description: string;
  readTime: string;
  publishedAt: string;
  sections: NewsSection[];
  sources?: NewsSource[];
}

export const NEWS: NewsArticle[] = [
  {
    slug: "byd-self-driving-chip-what-us-ev-owners-should-know",
    title: "BYD's $1,770 Self-Driving Chip: What US EV Owners Should Know",
    hook: "China's largest EV maker just launched the world's most advanced automotive chip — and put it in entry-level cars for $1,770. Tesla FSD is $8,000. Here's the honest take for US owners.",
    description: "BYD unveiled a 4nm autonomous driving chip today, already in mass production and going into entry-level cars for ~$1,770. Here's what the price gap means, why it happened, and the one EV cost US owners can control right now.",
    readTime: "5 min read",
    publishedAt: "2026-05-28",
    sections: [
      {
        heading: "BYD built a chip the US said China couldn't",
        body: "Today BYD — the world's largest EV maker — unveiled the Xuanji A3, China's first 4-nanometer autonomous driving chip. It's already in mass production, supports L3 and L4 self-driving, and BYD is rolling it out on entry-level cars for about $1,770. In the US, Tesla's Full Self-Driving package starts at $8,000. That gap is real, and it deserves an honest look.",
      },
      {
        heading: "How BYD actually pulled this off",
        body: "This didn't happen overnight. BYD started its chip division in 2002 — before the first iPhone existed. While most automakers outsourced chips to NVIDIA, Qualcomm, and Mobileye, BYD was quietly building fabs. When the 2021 chip shortage paralyzed GM, Ford, and Volkswagen, BYD barely flinched. The numbers behind today's announcement are staggering.",
        list: [
          "$14.75 billion spent on semiconductor R&D",
          "7,000 chip engineers across four dedicated research campuses",
          "Five wafer fabrication plants — all owned by BYD",
          "2,000+ chip products covering vehicles and consumer electronics",
          "Only automaker on earth that designs, fabricates, and tests its own chips end-to-end",
        ],
      },
      {
        heading: "The price gap that should bother you",
        body: "BYD's Xuanji A3 delivers 700 TOPS of computing power per chip — 2,100 TOPS in a three-chip cluster — and is being deployed via BYD's DiPilot 300 system at roughly $1,770 USD. That puts self-driving on a $25,000 entry-level car. Compare that to the US market, where autonomous driving features remain a luxury add-on with luxury pricing.",
        list: [
          "Tesla Full Self-Driving: $8,000 in the US",
          "GM Super Cruise (select trims): $2,200+/yr subscription",
          "BYD DiPilot 300 (L3/L4 capable): ~$1,770 one-time on entry-level models",
          "That's a 4.5× price gap for roughly comparable autonomous driving capability",
        ],
      },
      {
        heading: "What this does NOT change for US EV owners right now",
        body: "BYD doesn't sell cars in the United States. With current tariffs on Chinese EVs sitting above 100%, that's unlikely to change in 2026. So today's chip announcement doesn't affect your driveway, your charging bill, or your car's feature set. What it does signal is medium-term competitive pressure: if trade barriers shift, US automakers will need to price self-driving features far more aggressively. That benefits buyers eventually — but not today.",
      },
      {
        heading: "The one EV cost you can already control",
        body: "Here's what stays true regardless of what BYD builds: home charging is the single biggest lever in your total EV cost of ownership, and it's entirely in your hands. The average American driving 15,000 miles a year spends about $437 charging at home — versus $1,750–$2,400 in gas at today's prices. On a Time-of-Use rate plan charging overnight, that home charging bill can drop below $250 annually. Chinese EV buyers may be getting self-driving for less. But American EV owners charging at home are already beating gas prices by a margin most people have never calculated for their specific car and state.",
        list: [
          "Average home charging cost: ~$437/yr at 16¢/kWh national average",
          "Off-peak TOU charging: as low as $190–$250/yr in many states",
          "Equivalent gas cost (28 MPG, $3.50/gal, 15k miles): ~$1,875/yr",
          "Annual fuel savings: $1,400–$1,600 for most home-charging EV owners",
        ],
      },
      {
        heading: "The bigger picture",
        body: "BYD's Xuanji A3 is the latest proof that China's EV industry has moved beyond copying and into genuine technology leadership. Nio has a 5nm chip, Xpeng has the Turing AI chip, Li Auto has the Mach M100 — China's EV makers are racing each other on silicon, not just price. US and European automakers still rely almost entirely on third-party chip suppliers. That's a structural efficiency gap that will take years to close. In the meantime, the difference between what Chinese EV buyers pay for self-driving and what Americans pay is real, measurable, and widening.",
      },
      {
        heading: "What to actually do with this",
        body: "If you own an EV today, nothing changes at your charger. Focus on what you control: your electricity rate, your charging schedule, and whether you're on a Time-of-Use plan. If you're shopping for an EV, watch how US automakers respond — pricing pressure on autonomy features is coming. And regardless of where the geopolitics land, the math on home charging savings is already working in your favor right now.",
      },
    ],
    sources: [
      { label: "Bloomberg — BYD Debuts China's Most Advanced Electric Car Chip", url: "https://www.bloomberg.com/news/articles/2026-05-28/byd-debuts-china-s-most-advanced-ev-chip-in-smart-driving-push" },
      { label: "CnEVPost — BYD unveils 4nm smart driving chip Xuanji A3", url: "https://cnevpost.com/2026/05/28/byd-unveils-4nm-smart-driving-chip-xuanji-a3/" },
      { label: "CarNewsChina — BYD released Xuanji A3 ADAS chip", url: "https://carnewschina.com/2026/05/28/byd-released-xuanji-a3-adas-chip-as-it-aims-at-accident-free-traffic/" },
    ],
  },
  {
    slug: "oregon-ev-rebates-shrinking-2026",
    title: "Oregon's EV Rebates Just Got Smaller — Here's What You'll Actually Get Now",
    hook: "Standard rebate for plug-in hybrids dropped 40%. Program ran out of money three years straight. Late summer reopening expected. Oregon's cheap electricity still makes EVs a strong bet — but the upfront picture changed.",
    description: "Oregon DEQ cut its Clean Vehicle Rebate amounts in May 2026 to stretch limited funds — the third year in a row the program exhausted its budget before the year ended. Here's the exact new amounts, who gets hit hardest, and what the real EV ownership math looks like in Oregon right now.",
    readTime: "5 min read",
    publishedAt: "2026-05-19",
    sections: [
      {
        heading: "What changed",
        body: "On May 18, 2026, Oregon DEQ's new rebate rules (Administrative Order DEQ-3-2026) took effect, cutting the Standard Rebate amounts for the first time since the program launched. The Standard Rebate — available to anyone buying or leasing a new qualified vehicle under $50,000, with no income limit — dropped from $2,500 to $2,000 for battery-electric vehicles (down 20%) and from $2,500 to $1,500 for plug-in hybrids (down 40%). The income-qualified Charge Ahead Rebate held steady for new BEVs at $7,500, added a new $5,000 option for new PHEVs that didn't previously exist, and cut the used-BEV rebate from $5,000 to $4,000 (or 30% of the vehicle price, whichever is less). These new rates go into effect when the program reopens — expected late summer 2026.",
        list: [
          "Standard BEV (new, under $50K, no income limit): $2,500 → $2,000",
          "Standard PHEV (new, under $50K, no income limit): $2,500 → $1,500",
          "Charge Ahead BEV (new, income $51K–$251K): $7,500 — unchanged",
          "Charge Ahead PHEV (new): $5,000 — NEW, previously unavailable",
          "Charge Ahead BEV (used): $5,000 → $4,000 (or 30% of price)",
          "Charge Ahead PHEV (used): $2,500 — NEW",
          "Program currently suspended — reopens late summer 2026",
        ],
      },
      {
        heading: "Why DEQ cut the amounts",
        body: "The Oregon Clean Vehicle Rebate Program is funded primarily by Oregon's Vehicle Privilege Tax — a tax on new vehicle sales — which has generated roughly $15 million per year for the program. Demand has outpaced that budget every year. The Standard Rebate ran out of funds on September 9, 2025 — about three and a half months into the fiscal year. The Charge Ahead Rebate was suspended December 5, 2025. This was the third consecutive year both programs exhausted funds before the year ended, each time faster than the year before. DEQ's options were: request more funding (a legislative process that takes time), shrink rebate amounts to serve more people per dollar, or let the program close early again. They chose to shrink amounts. 'Adjusting rebate amounts is the primary tool we have available to extend program availability,' said Erica Timm, the program's coordinator. Since 2018, Oregon has issued more than 42,000 rebates totaling over $138 million in savings — the demand is real, the budget is the binding constraint.",
        list: [
          "Vehicle Privilege Tax: ~$15M/year for the program",
          "2025: Standard ran out Sept 9, Charge Ahead ran out Dec 5 — 3rd straight year",
          "Goal of cuts: stretch same dollars across more applicants",
          "Reopening timeline: late summer 2026, exact date TBD",
        ],
      },
      {
        heading: "The part most coverage misses: Oregon's electricity is cheap",
        body: "The rebate cut is real — but it's the upfront picture, not the ongoing one. Oregon has some of the cheapest electricity in the country, thanks to the Columbia River hydropower system. Oregon residential electricity rates average around 10–11 cents per kWh, versus a national average closer to 16–17 cents. For an EV driver covering 13,500 miles per year, that difference in electricity cost alone is worth several hundred dollars annually compared to the average US driver. The rebate drops by $500 (BEV) or $1,000 (PHEV) — but over a 5-year ownership period, Oregon's below-average charging costs recover that gap multiple times over. The ongoing savings from cheap electricity are structural; the rebate cut is a one-time upfront reduction. If you're weighing an EV purchase in Oregon, the break-even math is still among the best in the country.",
        list: [
          "Oregon avg electricity: ~10–11 cents/kWh (national avg ~16–17 cents)",
          "Cheap hydro power = lower per-mile charging cost than most states",
          "Rebate cut = one-time upfront reduction, not an ongoing cost change",
          "5-year fuel savings in Oregon typically outpace the rebate reduction by a wide margin",
        ],
      },
      {
        heading: "Who this hits hardest",
        body: "The biggest dollar cut hits plug-in hybrid buyers using the Standard Rebate — $1,000 less per vehicle. PHEV buyers tend to be more price-sensitive and often use the state rebate as the deciding factor between a hybrid and a full BEV. For lower-income buyers who qualify for Charge Ahead, the impact is mixed: new BEV buyers are unchanged, new PHEV buyers actually gained a $5,000 option that didn't exist before, and used-BEV buyers lost $1,000. Middle-income buyers who earn too much for Charge Ahead but are buying on a budget are the group most squeezed — they face a smaller Standard Rebate with no income-based alternative. The program's waiting list (applications placed in queue when funding runs out) carries over to the reopening, meaning some buyers who applied during the suspension period will be paid at the old, higher rates — check the DEQ portal to confirm your rate if you're already in the queue.",
        list: [
          "Hardest hit: Standard PHEV buyers — $1,000 cut",
          "Mixed: Charge Ahead — new PHEV option added, used BEV trimmed",
          "Already in queue: your rate depends on when you applied — verify at evrebate.oregon.gov",
          "No income limit for Standard: the cut applies to all buyers in that tier",
        ],
      },
      {
        heading: "What to do now",
        body: "If you're considering a new EV purchase in Oregon, the practical guidance is: don't delay a purchase purely to wait for the program to reopen, unless your purchase is already otherwise timed for late summer. When the program does reopen, apply the same day — the funds go fast. Charge Ahead applicants in the $51,000–$251,000 income range should note the new PHEV option if a plug-in hybrid is on your list. For used-BEV buyers, $4,000 is still meaningful even if $5,000 was better. And regardless of the rebate amount: Oregon's electricity rate makes the ongoing cost of EV ownership genuinely favorable compared to most of the country — factor that into your break-even math, not just the sticker price.",
        list: [
          "Program closed now — reopens late summer 2026",
          "Apply immediately when it reopens — funds exhaust fast",
          "Check application status / rate lock: evrebate.oregon.gov",
          "Income $51K–$251K: Charge Ahead now covers PHEVs for the first time",
          "Run your Oregon-specific numbers at the calculator — hydro rates change the math",
        ],
      },
    ],
    sources: [
      { label: "OPB — Oregon's popular EV rebates are shrinking (May 14, 2026)", url: "https://www.opb.org/article/2026/05/14/oregon-ev-rebates-electric-vehicle-shrinking/" },
      { label: "Oregon DEQ — EV Rebates 2026 Adopted Rules (DEQ-3-2026)", url: "https://www.oregon.gov/deq/rulemaking/pages/evrebates2026.aspx" },
      { label: "Oregon Clean Vehicle Rebate Program portal", url: "https://evrebate.oregon.gov/" },
      { label: "KOIN — Oregon EV rebates: DEQ to suspend Charge Ahead program", url: "https://www.koin.com/news/oregon/electric-vehicle-rebates-for-low-to-moderate-income-oregonians-will-be-suspended/" },
      { label: "Go Electric Oregon — Incentives & Rebates", url: "https://goelectric.oregon.gov/incentives-rebates" },
      { label: "EV Charge Savings: Calculate your Oregon EV savings", url: "https://evchargesavings.com/#calculator" },
    ],
  },
  {
    slug: "house-130-federal-ev-fee-proposal-2026",
    title: "The House Wants EV Owners to Pay a $130 Federal Fee — Here's What It Would Actually Cost You",
    hook: "Proposed, not law. $130/year for EVs, $35 for plug-in hybrids, rising over time. It dents the savings math but doesn't erase it — and many EV owners already pay a state version.",
    description: "A House proposal in the new $580B surface transportation bill would add a $130 annual federal fee on EVs to backfill the Highway Trust Fund. Here's the real impact on EV-vs-gas savings — and the state-fee stacking question most coverage skips.",
    readTime: "5 min read",
    publishedAt: "2026-05-18",
    sections: [
      {
        heading: "What was actually proposed",
        body: "On May 18, 2026, the House Transportation and Infrastructure Committee released the BUILD America 250 Act — a roughly $580 billion, five-year surface transportation reauthorization bill. Tucked inside: a new federal annual fee on electric and plug-in hybrid vehicles. The headline number is $130 per year for a fully electric vehicle. Plug-in hybrids would pay $35. Conventional (non-plug-in) hybrids are exempt. The EV fee is structured to rise $5 every two years starting in 2029, capped at $150; the plug-in hybrid fee caps at $50. Critically: this is a proposal, not law. The bill is in committee negotiation. It exists because the current surface transportation authorization expires September 30, 2026, and lawmakers need a replacement — the EV fee is one financing piece inside a much larger bill that still has to pass both chambers.",
        list: [
          "EV: $130/year, +$5 every two years from 2029, max $150",
          "Plug-in hybrid: $35/year, max $50",
          "Conventional hybrid: exempt",
          "Bill name: BUILD America 250 Act (BA250)",
          "Part of a ~$580B 5-year surface transportation reauthorization bill",
          "Committee markup scheduled May 21, 2026 — status: PROPOSED, not law. Current authorization expires Sept 30, 2026",
        ],
      },
      {
        heading: "Why they're proposing it",
        body: "The Highway Trust Fund — which pays for road and bridge maintenance — is primarily funded by the federal gas tax of 18.4 cents per gallon. That tax hasn't increased since 1993 and isn't indexed to inflation, so its real value has eroded for three decades. EV drivers use the same roads but buy no gasoline, so they contribute nothing to the fund through fuel taxes. The proposal's framing is a 'user-pays' fairness argument: everyone who uses federal roads should help maintain them. Whether $130 is the right number is the political fight — for an average driver, the federal gas tax on a comparable gas car comes to roughly $90–$120 per year, so $130 is in the same ballpark but on the higher end of parity.",
      },
      {
        heading: "What $130 a year actually does to the savings math",
        body: "This is the number that matters for anyone weighing an EV. A typical EV saves roughly $800–$1,500 per year in fuel costs versus a comparable gas car, depending on your state's electricity rate and how many miles you drive. A $130 annual fee reduces that — it does not erase it. In a cheap-electricity state like Washington or a high-mileage household, the fee is a rounding error against $1,200+ in annual fuel savings. In an expensive-electricity state with low annual mileage, where savings might only be $600–$800, a $130 fee is a more meaningful 15–20% haircut on the benefit. The honest takeaway: for most drivers the EV cost case survives this fee comfortably; for marginal cases in high-rate states it tightens the break-even. Run your specific numbers rather than trusting a national average — the answer genuinely depends on your state and mileage.",
        list: [
          "Typical EV fuel savings: ~$800–$1,500/yr vs comparable gas car",
          "$130 fee = small dent for high-mileage or cheap-electricity drivers",
          "$130 fee = ~15–20% of the benefit for low-mileage drivers in expensive states",
          "Break-even year moves later by a fraction, not years",
        ],
      },
      {
        heading: "The part most coverage skips: you may already pay a state version",
        body: "National coverage is treating this as a brand-new cost on EV owners. For many, it isn't entirely new — it's potentially a second layer. According to the National Conference of State Legislatures, 41 states plus DC already charge their own annual EV registration fee, and several are well above the proposed federal figure. The range runs from about $50 (Hawaii, South Dakota) to $290 in New Jersey — which is scheduled to rise to $310 in 2027 and $340 in 2028. Other high states: Michigan $267, Pennsylvania $250, Washington $225, Indiana $221, North Carolina $214.50, Georgia $211, Texas $200 (plus a $400 first-time fee). The median is roughly $138 per year. The unanswered question in the proposal is stacking: does a $130 federal fee sit on top of these existing state fees, or would states adjust theirs down, or would the federal mechanism partially replace state collection? The bill text released so far does not cleanly resolve this. If you already pay a $290 New Jersey fee, a federal $130 on top is a combined $420/year unless reconciled — that scenario, not the $130 headline, is the real story. It's one of the biggest open items and worth watching as the bill moves.",
        list: [
          "41 states + DC already levy an annual EV fee — range $50 to $290, median ~$138/yr (NCSL, 2026)",
          "Highest: NJ $290 (→$340 by 2028), MI $267, PA $250, WA $225, IN $221, NC $214.50, GA $211, TX $200 (+$400 first-time)",
          "Open question: federal $130 stacks on state fees, offsets them, or replaces collection — bill text doesn't resolve it",
          "Worst case named in the bill so far: NJ $290 + federal $130 = $420/yr combined",
          "Check your state's current EV surcharge to know your real baseline",
        ],
      },
      {
        heading: "What happens next",
        body: "The House T&I Committee is scheduled to mark up the BUILD America 250 Act on May 21, 2026 — the next concrete step. After that, the bill has to pass the full House, get reconciled with whatever the Senate produces, and be signed — all before or around the September 30, 2026 authorization deadline, which itself can be extended by short-term patches. There is already opposition: Senate Democrats including Ron Wyden and Sheldon Whitehouse, along with environmental and EV-advocacy groups, argue a flat federal fee risks slowing EV adoption and is poorly calibrated against what gas drivers actually pay. Supporters counter that road funding is collapsing and EVs have had a free ride on maintenance costs. The number, the start date, the inflation escalator, and the state-stacking question are all still negotiable. Nothing about this changes the cost of owning an EV today — but if you're modeling a 5-year ownership cost, pencil in a plausible $100–$150/year federal fee as a scenario, not a certainty.",
        list: [
          "Committee markup: May 21, 2026 — must then pass full House, reconcile with Senate, be signed",
          "Opposition from Senate Democrats and EV-advocacy groups already public",
          "Fee amount, start date, escalator, and state stacking all still negotiable",
          "For 5-year cost modeling: treat ~$100–$150/yr as a scenario, not a fact",
        ],
      },
    ],
    sources: [
      { label: "Bloomberg — US House Unveiled Plan to Charge $130 Fee for Electric Vehicles", url: "https://www.bloomberg.com/news/articles/2026-05-18/us-house-unveiled-plan-to-charge-130-fee-for-electric-vehicles" },
      { label: "CNBC — House lawmakers propose $130 annual EV fee to pay for road repairs", url: "https://www.cnbc.com/2026/05/18/house-lawmakers-propose-130-annual-ev-fee-to-pay-for-road-repairs.html" },
      { label: "US News — US House Lawmakers Propose $130 Annual EV Fee", url: "https://www.usnews.com/news/top-news/articles/2026-05-18/us-house-lawmakers-propose-130-annual-ev-fee-to-pay-for-road-repairs" },
      { label: "The Detroit News — U.S. House proposes nationwide fee for EV drivers", url: "https://www.detroitnews.com/story/business/autos/2026/05/18/u-s-house-proposes-nationwide-fee-for-ev-drivers/90141291007/" },
      { label: "E&E News — Democrats on collision course over EV fees in highway bill", url: "https://www.eenews.net/articles/democrats-on-collision-course-over-ev-fees-in-highway-bill/" },
      { label: "NCSL — Special Registration Fees for Electric and Hybrid Vehicles", url: "https://www.ncsl.org/transportation/special-registration-fees-for-electric-and-hybrid-vehicles" },
      { label: "EV Charge Savings: EV vs Gas Savings by State", url: "https://evchargesavings.com/guides/ev-vs-gas-savings-usa" },
      { label: "EV Charge Savings: Calculate your real savings", url: "https://evchargesavings.com/#calculator" },
    ],
  },
  {
    slug: "home-ev-charger-tax-credit-ends-june-2026",
    title: "The Home EV Charger Tax Credit Ends June 30, 2026 — and Most People Won't Qualify",
    hook: "30% back, up to $1,000, on a home charger install. But there's a census-tract catch that disqualifies most suburban and urban homeowners — and the window closes June 30.",
    description: "The federal home EV charging equipment credit (Section 30C) terminates June 30, 2026 under the One Big Beautiful Bill. It's still claimable now — but a location requirement most coverage ignores means a large share of homeowners aren't eligible. Here's how to check before you spend.",
    readTime: "5 min read",
    publishedAt: "2026-05-18",
    sections: [
      {
        heading: "The deadline that's actually close",
        body: "The federal tax credit for home EV charging equipment — Section 30C, claimed on IRS Form 8911 — terminates for property placed in service after June 30, 2026. That is roughly six weeks away. The One Big Beautiful Bill (signed July 4, 2025) pulled the original 2032 sunset all the way forward to mid-2026. The credit itself is unchanged while it lasts: 30% of the cost of qualified charging equipment and installation, capped at $1,000 for property installed at an individual's primary residence. 'Placed in service' means the charger is installed and operational — not ordered, not paid for. If it isn't working by June 30, it doesn't count.",
        list: [
          "Credit: 30% of equipment + installation cost, max $1,000 for a home install",
          "Hard deadline: charger placed in service (installed and operational) by June 30, 2026",
          "Claimed on IRS Form 8911 with your return for the year it's placed in service",
          "Sunset moved from Dec 31, 2032 to June 30, 2026 by the OBBB (July 4, 2025)",
        ],
      },
      {
        heading: "The catch most coverage skips: the census tract",
        body: "Here is the part that gets left out of nearly every 'act now' article: since 2023, the home charger credit only applies if the charger is installed in an eligible census tract. Specifically, the location must be in either a low-income community census tract (as defined under the New Markets Tax Credit, IRC Section 45D) or a non-urban census tract. If your home address falls outside both categories — which is the case for a large share of suburban and urban homeowners — you do not qualify, regardless of the deadline. This requirement is real, it is on IRS.gov, and it is the single biggest reason people who file Form 8911 get denied. Check your address against the IRS eligible-census-tract guidance before you spend a dollar expecting the credit.",
        list: [
          "Eligible = low-income community tract (NMTC §45D) OR non-urban tract",
          "Outside both = not eligible, even though the credit technically still exists",
          "Verify your specific address via the IRS Section 30C census-tract FAQ and mapping references",
          "This is per-location, not per-person — a friend two ZIP codes over may qualify when you don't",
        ],
      },
      {
        heading: "What it's actually worth if you do qualify",
        body: "For homeowners in an eligible tract, the math is straightforward and meaningful. A typical Level 2 home charger runs $230–$700 for the unit, and a standard install (dedicated 240V circuit, short conduit run) is commonly $800–$1,500. On a combined $1,500–$2,200 project, the 30% credit hits the $1,000 cap quickly — so eligible buyers effectively get the maximum. That turns a $1,800 install into roughly an $800 net cost. It is a nonrefundable credit, meaning it reduces your tax liability but won't generate a refund beyond what you owe. If you've been putting off a home charger and you're in an eligible tract, the June 30 deadline genuinely changes the timing decision.",
        list: [
          "Hardware: ~$230–$700 (Grizzl-E, Autel, EVIQO, ChargePoint tier)",
          "Install: ~$800–$1,500 typical; more for panel upgrades or long runs",
          "30% credit caps at $1,000 — most full installs hit the cap",
          "Nonrefundable: offsets tax owed, doesn't pay out beyond liability",
        ],
      },
      {
        heading: "The bigger picture: what's left after the $7,500 died",
        body: "This deadline lands in a post-credit landscape. The federal new-EV credit (Section 30D, up to $7,500) and used-EV credit (Section 25E, up to $4,000) ended for vehicles acquired after September 30, 2025 — both eliminated by the same OBBB. The one notable replacement is the new car loan interest deduction: up to $10,000 per year of interest on a qualifying auto loan, deductible whether or not you itemize. It applies to new vehicles with final assembly in the United States, loans originated after December 31, 2024, for tax years 2025 through 2028, with a modified-AGI phase-out starting at $100,000 (single) / $200,000 (joint). Leases don't qualify; it must be a secured loan on the vehicle. It is not an EV-specific incentive — any qualifying US-assembled vehicle counts — but for EV buyers financing a US-built model, it's now the largest federal lever available.",
        list: [
          "§30D ($7,500 new) and §25E ($4,000 used) ended for vehicles acquired after Sept 30, 2025",
          "Car loan interest deduction: up to $10,000/yr, US-assembled new vehicles, loans after Dec 31, 2024",
          "Active tax years 2025–2028; MAGI phase-out $100K single / $200K joint",
          "Available even if you take the standard deduction; leases excluded",
        ],
      },
      {
        heading: "What to do in the next six weeks",
        body: "If a home charger is on your list, the sequence matters. First, confirm eligibility — there is no point rushing an install for a credit your address can't claim. If you are eligible, the installation lead time is the constraint: electricians book out, permits take time, and the charger must be operational by June 30, not merely purchased. Get quotes now if you intend to claim it. If you are not in an eligible tract, the deadline is irrelevant to you — buy the charger when it makes sense, not on a false clock. Either way, verify every figure here against IRS.gov before filing; credit terms have changed twice in under a year and your tax situation is specific to you.",
        list: [
          "1. Check your address against IRS Section 30C eligible-census-tract guidance",
          "2. If eligible: get electrician quotes now — operational-by-June-30 is the real constraint",
          "3. Keep all equipment and installation receipts for Form 8911",
          "4. If not eligible: ignore the deadline, buy on your own timeline",
          "5. Confirm current rules at IRS.gov — this is not tax advice",
        ],
      },
    ],
    sources: [
      { label: "IRS — Alternative Fuel Vehicle Refueling Property Credit for Individuals (§30C)", url: "https://www.irs.gov/credits-deductions/alternative-fuel-vehicle-refueling-property-credit-for-individuals" },
      { label: "IRS — Eligible Census Tracts FAQ for Section 30C", url: "https://www.irs.gov/credits-deductions/frequently-asked-questions-regarding-eligible-census-tracts-for-purposes-of-the-alternative-fuel-vehicle-refueling-property-credit-under-section-30c" },
      { label: "IRS — Instructions for Form 8911", url: "https://www.irs.gov/pub/irs-pdf/i8911.pdf" },
      { label: "IRS — OBBB FAQs (§25C, 25D, 25E, 30C, 30D, 45L, 45W, 179D)", url: "https://www.irs.gov/newsroom/faqs-for-modification-of-sections-25c-25d-25e-30c-30d-45l-45w-and-179d-under-public-law-119-21-139-stat-72-july-4-2025-commonly-known-as-the-one-big-beautiful-bill-obbb" },
      { label: "IRS — Guidance on the New Deduction for Car Loan Interest", url: "https://www.irs.gov/newsroom/treasury-irs-provide-guidance-on-the-new-deduction-for-car-loan-interest-under-the-one-big-beautiful-bill" },
      { label: "EV Charge Savings: The $7,500 EV Tax Credit Is Gone — What's Left", url: "https://evchargesavings.com/guides/ev-tax-credit-7500" },
      { label: "EV Charge Savings: Best Home EV Chargers 2026", url: "https://evchargesavings.com/guides/best-home-ev-chargers-2026" },
    ],
  },
  {
    slug: "self-driving-ev-2026-what-it-actually-means-for-owners",
    title: "Self-Driving in 2026: Where It Actually Stands — and What It Means If You Own an EV",
    hook: "Waymo is real. Tesla FSD is supervised, not autonomous. Most states still put liability on you. Here's what autonomy actually means for EV ownership cost, insurance, and the decision to buy at all.",
    description: "Self-driving coverage focuses on demos and milestones. Almost none of it covers what autonomy means for the person who owns or is considering buying an EV — insurance liability, FSD resale value, subscription math, and when robotaxis make personal ownership financially questionable.",
    readTime: "6 min read",
    publishedAt: "2026-05-18",
    sections: [
      {
        heading: "What's actually working right now",
        body: "Two self-driving technologies are operational at meaningful scale in 2026. Waymo's fully driverless robotaxi service runs in San Francisco, Los Angeles, Phoenix, and Austin — no safety driver, available to the public via app. It is Level 4 autonomy in geofenced areas and it works. Tesla's Full Self-Driving (Supervised) is available on all new Teslas and roughly 600,000 active vehicles — it handles highway and city driving but requires a licensed driver with hands on wheel and attention on road at all times. It is Level 2, not autonomous. The gap between those two products is significant and mostly absent from mainstream coverage.",
        list: [
          "Waymo: true driverless, Level 4, geofenced cities — SF, LA, Phoenix, Austin",
          "Tesla FSD Supervised: Level 2 — driver must be alert and ready to take over",
          "GM Cruise: suspended operations after 2023 incident, limited return in 2025",
          "Aurora: Level 4 commercial trucking autonomy on select Texas/Pennsylvania routes",
          "No consumer vehicle has achieved Level 3+ approval for public road use in the US",
        ],
      },
      {
        heading: "The insurance question nobody answers clearly",
        body: "When a Tesla on FSD hits another car, who pays? Right now: you do. Every US state still treats the human behind the wheel as the responsible party for Level 2 systems. Your insurance covers it, your rates go up, your record reflects it. Tesla's insurance product (available in some states) prices risk based on your actual FSD usage data — but even Tesla's own insurance doesn't shift liability off the driver for supervised autonomy. Level 3 (where the car is legally responsible under certain conditions) has been approved in Germany and Japan. In the US, Mercedes received limited Level 3 approval in Nevada and California in 2023, but only at speeds under 40 mph on mapped highways. The liability shift most people expect from self-driving hasn't happened yet.",
        list: [
          "Level 2 (Tesla FSD, GM Super Cruise): you are legally liable for any accident",
          "Level 3: car takes responsibility in defined conditions — not yet broadly available in US",
          "Level 4 (Waymo): manufacturer liability — but you're a passenger, not an owner",
          "Tesla insurance uses your FSD engagement data to price risk — check your state's availability",
          "Most standard auto policies cover Level 2 incidents — but expect underwriters to tighten this as technology advances",
        ],
      },
      {
        heading: "The FSD purchase vs subscription math",
        body: "Tesla offers FSD two ways: $8,000 outright purchase, or $99/month subscription. The subscription cancels anytime. The purchased version transfers with the car — sort of. FSD transfers to new owners on the same account, but Tesla has historically limited transferability and changed terms. If you're buying a used Tesla banking on retained FSD value, verify transfer eligibility before purchase. At $99/month, breakeven vs the $8,000 purchase is 81 months — nearly 7 years. For most drivers who aren't power users, the subscription wins unless you're confident you'll own the same car for 7+ years and FSD retains value through that period.",
        list: [
          "FSD purchase: $8,000 — transfers to new owner (verify current transfer terms before buying used)",
          "FSD subscription: $99/month — cancel anytime, doesn't affect resale",
          "Breakeven: ~81 months at $99/mo vs $8,000 purchase",
          "FSD capability does add resale value — roughly $2,000–$4,000 premium on used Teslas with FSD",
          "Non-Tesla ADAS (GM Super Cruise, Ford BlueCruise) is typically included in trim pricing, not a separate add-on",
        ],
      },
      {
        heading: "When robotaxis make personal EV ownership questionable",
        body: "Waymo's pricing runs $5–$15 per trip in its current markets — competitive with Uber for short trips, more expensive for commutes. For urban residents who drive under 8,000 miles/year and pay for parking, the math on Waymo vs ownership is genuinely close. A $45,000 EV financed at 7% for 5 years costs roughly $890/month before insurance, registration, and parking. At $12/trip average, that's 74 Waymo trips per month — about 2.5 per day — before ownership becomes cheaper. That tipping point doesn't apply to suburban or rural drivers, which is most of the country. But for a San Francisco or Phoenix resident who can already use Waymo daily, the case for EV ownership is weaker than it was three years ago.",
      },
      {
        heading: "What this means if you're deciding whether to buy an EV now",
        body: "For the vast majority of US drivers — anyone outside Waymo's service footprint, anyone who drives more than 10,000 miles per year, anyone in a suburban or rural area — none of this changes the buy decision. The EV ownership math on fuel savings is unaffected by autonomy. FSD or not, a Model Y still costs 4–8¢/mile to charge vs 20–35¢/mile for a comparable gas car. The self-driving feature is a comfort and convenience layer, not a cost variable for most owners. Where it becomes relevant: if you're choosing between Tesla and a comparable non-Tesla EV and weighing FSD, the subscription path ($99/mo) is lower-risk than banking the $8,000 purchase into a resale assumption.",
        list: [
          "Autonomy doesn't change fuel cost math — that's still EIA rates vs gas prices",
          "FSD as a subscription ($99/mo) is lower-risk than purchase if resale timeline is uncertain",
          "Waymo availability matters only if you're in SF, LA, Phoenix, or Austin and drive infrequently",
          "Insurance: no change for Level 2 owners — you're still liable",
          "Level 3 autonomy with real liability shift is likely 2–4 years away for US consumer vehicles",
        ],
      },
    ],
    sources: [
      { label: "Waymo — Service Areas", url: "https://waymo.com/waymoone/" },
      { label: "Tesla FSD — Pricing and Availability", url: "https://www.tesla.com/support/full-self-driving-subscriptions" },
      { label: "NHTSA — Automated Vehicles", url: "https://www.nhtsa.gov/technology-innovation/automated-vehicles-safety" },
      { label: "Mercedes Level 3 Approval (Nevada/California)", url: "https://www.nhtsa.gov/technology-innovation/automated-vehicles-safety" },
      { label: "EV Charge Savings: Calculate your EV fuel cost savings", url: "https://evchargesavings.com" },
    ],
  },
  {
    slug: "ev-utility-rate-programs-slash-charging-cost-2026",
    title: "The Utility Rate Plans That Make Home EV Charging Almost Free — And Most Owners Don't Know They Exist",
    hook: "Georgia Power: 6.6¢/kWh overnight. Duke Energy Florida: 3.5¢/kWh. SDG&E: 12¢/kWh. Your utility likely has a hidden EV rate — here's how to find it.",
    description: "Most EV owners pay their utility's standard residential rate. A viral Reddit post showed what's possible when you don't: an SDG&E customer charging an Audi Q4 55 e-tron at 13¢/kWh — 4.3¢/mile vs 34¢/mile for their gas car. These utility EV programs exist across the country — and most owners never enroll.",
    readTime: "5 min read",
    publishedAt: "2026-05-17",
    sections: [
      {
        heading: "The number that went viral",
        body: "A Reddit post this week stopped a lot of EV owners mid-scroll. u/ada586 — a 2025 Audi Q4 55 e-tron driver in San Diego — posted that they charge at 13¢/kWh through SDG&E's Power Your Drive program, while SDG&E's standard peak rate runs $0.50–$0.80/kWh. Their cost per mile: 4.3¢. Their Toyota 4Runner: 34¢/mile. That 7.9x gap isn't universal, but the underlying mechanism — a utility EV rate plan that most customers never enroll in — exists at dozens of utilities across the country.",
      },
      {
        heading: "Georgia Power: the cheapest overnight EV charging in the US",
        body: "Georgia Power's Overnight Advantage plan offers a super off-peak energy rate of ~2.2¢/kWh between 11pm and 7am. With fuel cost adders, the all-in rate runs approximately 6.6¢/kWh — making it the most affordable overnight EV charging of any major utility in the country. On-peak rates (7am–11pm) run ~29.8¢/kWh, so the plan requires actually charging overnight. On a Kia EV9 (99.8 kWh battery), a full charge overnight costs about $6.60 — vs $29.80 at peak rates on the same utility.",
        list: [
          "Rate: ~6.6¢/kWh overnight (11pm–7am)",
          "On-peak: ~29.8¢/kWh — schedule charging carefully",
          "Coverage: most of Georgia — Atlanta, Savannah, Augusta, Macon",
          "How to enroll: georgiapower.com → rate plans → Overnight Advantage",
        ],
      },
      {
        heading: "Duke Energy: 3.5¢/kWh in Florida",
        body: "Duke Energy's EV Overnight Advantage program runs across six states (FL, NC, SC, OH, IN, KY) with rates that vary by jurisdiction. Florida customers get the best deal: approximately 3.5–3.9¢/kWh during off-peak hours (midnight–6am most of the year). North Carolina customers pay around 5¢/kWh during discount hours. Duke also offers a ~$10/month bill credit for customers who charge off-peak — capped at $200/year and $1,000 over the life of the program. Indiana customers get a $50 quarterly credit ($400 total over two years) instead.",
        list: [
          "Florida off-peak: ~3.5–3.9¢/kWh (midnight–6am)",
          "North Carolina discount: ~5¢/kWh",
          "South Carolina discount: ~4¢/kWh",
          "~$10/mo bill credit for off-peak charging (most states); $50/quarter in Indiana",
          "Coverage: FL, NC, SC, OH, IN, KY",
        ],
      },
      {
        heading: "SDG&E: Power Your Drive and EV-TOU-5",
        body: "San Diego Gas & Electric offers two EV-specific options. Power Your Drive uses dynamic hourly pricing tied to grid conditions — rates as low as 13¢/kWh on mild nights, but can spike above 50¢/kWh during heat events. It works well for owners who can charge flexibly (or use smart charger scheduling). The EV-TOU-5 plan is simpler: a fixed super off-peak rate of ~12.4¢/kWh from midnight to 6am. Either plan is dramatically better than SDG&E's standard residential rates, which routinely exceed $0.50/kWh during afternoon and evening hours.",
        list: [
          "Power Your Drive: ~13¢/kWh on mild nights (dynamic — can spike)",
          "EV-TOU-5 fixed super off-peak: ~12.4¢/kWh (midnight–6am)",
          "Standard SDG&E peak: $0.50–$0.80/kWh",
          "Best for: owners with smart charger scheduling or flexible overnight routine",
        ],
      },
      {
        heading: "Austin Energy and other municipals",
        body: "Austin Energy — the city-owned utility serving Austin, TX — charges approximately 9¢/kWh during off-peak hours vs 14¢/kWh standard. Municipal utilities (city-owned) often have better EV rate structures than investor-owned utilities because they're not profit-driven. If you're served by a municipal or co-op utility, call and ask directly about EV rates — they frequently exist but aren't well publicized. Los Angeles DWP, Salt River Project (AZ), and CPS Energy (San Antonio) all have TOU plans that benefit overnight EV charging.",
        list: [
          "Austin Energy off-peak: ~9¢/kWh",
          "LA DWP, SRP (AZ), CPS Energy (SA): all have favorable TOU options",
          "Municipals and co-ops: often better rates than investor-owned utilities — call and ask",
        ],
      },
      {
        heading: "PG&E: better than peak, still expensive",
        body: "PG&E's EV2-A plan offers off-peak rates from midnight to 3pm — but at approximately 34¢/kWh, even the off-peak rate is high by national standards. Northern California electricity is expensive across the board. The math still works (34¢ off-peak vs $0.60+ on-peak), and overnight charging on EV2-A remains significantly cheaper than standard residential — but don't expect Georgia Power numbers in the Bay Area.",
        list: [
          "PG&E EV2-A off-peak (midnight–3pm): ~34¢/kWh",
          "Still much better than PG&E on-peak rates",
          "Bottom line: worthwhile to switch, but California rates remain structurally high",
        ],
      },
      {
        heading: "Pacific Power (Oregon): 2¢/kWh in winter",
        body: "Pacific Power's Schedule 29 TOU plan is one of the least-publicized EV rate deals in the country. Oregon customers who take a Pacific Power charger rebate are automatically enrolled — winter off-peak runs approximately 2.19¢/kWh, summer off-peak ~5¢/kWh. Portland General Electric (Portland metro) closed its residential TOU plan December 31, 2024, but still runs a Smart Charging program: allow PGE to briefly pause your charger during peak grid hours (overridable via app), earn $25/season ($50/year).",
        list: [
          "Pacific Power winter off-peak: ~2.19¢/kWh — rivals Duke Energy Florida",
          "Pacific Power summer off-peak: ~5¢/kWh",
          "Auto-enrolled when you take a Pacific Power EV charger rebate",
          "PGE (Portland metro) Smart Charging: $25/season ($50/yr) demand-response credit",
          "PGE residential TOU rate: no longer available (closed Dec 31, 2024)",
        ],
      },
      {
        heading: "How to find your utility's EV rate",
        body: "Most utilities don't proactively notify customers about EV rates when they purchase an EV. The standard move: call your utility's residential line and say 'I have an electric vehicle — do you have an EV-specific time-of-use rate plan?' Almost every major utility has one. You can also check the DOE's Alternative Fuels Data Center (afdc.energy.gov) or your state PUC's website. The enrollment process is usually a 5-minute online form or phone call — and the savings start on your next billing cycle.",
        list: [
          "Call your utility: ask specifically about 'EV time-of-use rate plan'",
          "afdc.energy.gov: utility program database by state",
          "Most plans require a smart meter (AMI) — utilities can install one free if you don't have one",
          "Pair with smart charger scheduling (Tesla app, ChargePoint, Emporia) to automate off-peak timing",
        ],
      },
    ],
    sources: [
      { label: "Reddit: u/ada586 — \"EV costs 7.9x less than my ICE in California\" (r/electricvehicles)", url: "https://www.reddit.com/r/electricvehicles/comments/1tfc41t/broken_record_ev_costs_79_times_less_than_my_ice/" },
      { label: "SDG&E Power Your Drive", url: "https://www.sdge.com/residential/electric-vehicles/power-your-drive/power-your-drive-ev-drivers" },
      { label: "Georgia Power Overnight Advantage", url: "https://www.georgiapower.com/residential/billing-and-rate-plans/pricing-and-rate-plans/plug-in-ev.html" },
      { label: "Duke Energy EV Overnight Advantage", url: "https://www.duke-energy.com/home/billing/ev-overnight-advantage" },
      { label: "PG&E EV Rate Plans", url: "https://www.pge.com/en/account/rate-plans/electric-vehicles.html" },
      { label: "Pacific Power Schedule 29 TOU (Oregon)", url: "https://www.pacificpower.net/savings-energy-choices/time-of-use/or-schedule29-pricing.html" },
      { label: "Portland General Electric Smart Charging", url: "https://portlandgeneral.com/energy-choices/electric-vehicles-charging/charging-your-ev/charging-your-ev-at-home" },
      { label: "DOE Alternative Fuels Data Center — Utility Programs", url: "https://afdc.energy.gov/laws/utilities" },
      { label: "EV Charge Savings: Complete Utility EV Rate Plans Guide", url: "https://evchargesavings.com/guides/ev-utility-rate-plans-guide" },
      { label: "EV Charge Savings: Understanding Time-of-Use Rates", url: "https://evchargesavings.com/guides/time-of-use-rates" },
    ],
  },
  {
    slug: "ionna-bmw-mini-charging-discount-2026",
    title: "BMW and Mini EV Owners Get 20% Off IONNA Fast Charging Through September",
    hook: "No subscription required. Just Plug & Charge or the My BMW app — $0.27–$0.32/kWh through September 30.",
    description: "IONNA is offering BMW and Mini EV drivers a 20% discount on all DC fast charging through September 30, 2026. Here's what that means per charge for the iX, i4, i5, and Mini Countryman E — and whether IONNA has coverage where you need it.",
    readTime: "3 min read",
    publishedAt: "2026-05-17",
    sections: [
      {
        heading: "The deal",
        body: "BMW of North America has partnered with IONNA — the charging network backed by BMW, GM, Honda, Hyundai-Kia, Mercedes-Benz, Stellantis, and Toyota — to offer BMW and Mini EV owners 20% off all charging through September 30, 2026. No subscription required. Initiate a session with Plug & Charge (automatic, no app needed) or the My BMW app and the discount applies to your final bill. IONNA's standard rates run $0.33–$0.39/kWh, so the discount puts BMW and Mini drivers at $0.27–$0.32/kWh.",
      },
      {
        heading: "Cost per charge by model",
        body: "Here's what a full charge costs at IONNA with the discount applied, using midpoint discounted rate of $0.29/kWh:",
        list: [
          "Mini Countryman E (65.2 kWh): ~$18.90 full charge (vs ~$23.60 at standard rate)",
          "BMW i4 (81 kWh): ~$23.50 full charge (vs ~$29.20 at standard rate)",
          "BMW i5 (84.3 kWh): ~$24.45 full charge (vs ~$30.35 at standard rate)",
          "BMW iX xDrive60 (113.4 kWh): ~$32.90 full charge (vs ~$40.90 at standard rate)",
        ],
      },
      {
        heading: "How IONNA compares to home charging",
        body: "Even with the 20% discount, IONNA rates are roughly 1.8–2x the US average home electricity rate of 16.5¢/kWh. A BMW i4 charged at home costs about $13.40 for a full charge — vs $23.50 at IONNA discounted. That's not a knock on the deal: public fast charging always costs more than home charging. The value is for road trips and situations where home charging isn't available, not as a replacement for your Level 2 setup.",
      },
      {
        heading: "IONNA's network footprint",
        body: "IONNA recently crossed 1,000 charging stalls across more than 100 stations in the US. The network is growing but remains far smaller than Electrify America (~900 stations) or the Tesla Supercharger network (17,000+ locations). Coverage is strongest in the Southeast, Midwest, and Mid-Atlantic — check the IONNA app before planning a road trip to confirm station availability along your route.",
      },
      {
        heading: "Who benefits most",
        body: "The discount is most valuable if you regularly road trip in a BMW or Mini EV and rely on public fast charging. At 4 full charges per month on an i4, the 20% discount saves roughly $23/month — or about $115 over the five-month window. iX owners with the larger 113.4 kWh battery save more per session: roughly $8 per full charge, adding up to $160+ over the summer if you're charging on the road regularly.",
      },
    ],
    sources: [
      { label: "InsideEVs — BMW and Mini EV Drivers Get A Sweet Discount At IONNA", url: "https://insideevs.com/news/795941/bmw-mini-ev-charging-discount-ionna/" },
      { label: "Cars.com — BMW, Mini EV Owners Now Get 20% Off Charging at IONNA", url: "https://www.cars.com/articles/bmw-mini-ev-owners-now-get-20-off-charging-at-growing-charging-network-524869/" },
    ],
  },
  {
    slug: "tesla-model-y-price-increase-may-2026",
    title: "Tesla Raises Model Y Prices for the First Time in Two Years",
    hook: "Premium and Performance trims up $500–$1,000. Base models unchanged. Ends two years of aggressive price cuts.",
    description: "Tesla raised Model Y prices on three trims on May 16, 2026 — the first increase since 2024. The moves are modest (under 2.5%) but signal a deliberate shift away from the margin-crushing discount strategy of the past two years.",
    readTime: "3 min read",
    publishedAt: "2026-05-16",
    sections: [
      {
        heading: "What changed",
        body: "Three Model Y trims went up in price effective May 16, 2026. The base RWD ($39,990) and base AWD ($41,990) were left untouched — Tesla deliberately protected the entry-level price points while raising margins on higher-trim configurations.",
        list: [
          "Model Y Premium RWD: $45,990 (+$1,000)",
          "Model Y Premium AWD: $49,990 (+$1,000)",
          "Model Y Performance AWD: $57,990 (+$500)",
          "Model Y RWD base: $39,990 (unchanged)",
          "Model Y AWD base: $41,990 (unchanged)",
        ],
      },
      {
        heading: "Why now",
        body: "Tesla's aggressive discounting from 2024–2025 drove automotive gross margins from above 25% in early 2023 to below 18% by mid-2025. The price cuts moved volume but at significant cost to profitability. These increases — modest at 0.9% to 2.2% — represent a directional shift: Tesla is prioritizing margin recovery over unit growth on its best-selling vehicle.",
      },
      {
        heading: "What it means for the break-even math",
        body: "The charging cost math doesn't change — electricity rates, efficiency, and fuel savings are identical before and after this announcement. A Model Y Premium AWD still costs roughly $14 to charge from empty at the US average electricity rate, and still saves $1,000–$1,400/year in fuel vs a comparable gas SUV depending on your state. What changes is the upfront premium. At $1,000 more, a buyer saving $1,200/year on fuel adds roughly one month to the break-even timeline — a minor adjustment, not a deal-breaker.",
      },
      {
        heading: "The bigger picture",
        body: "This is the first price increase on the Model Y since Tesla launched its aggressive cut strategy in January 2024. At that time, Tesla slashed prices by up to $13,000 to stimulate demand in a softening EV market. The reversal signals confidence that demand has stabilized enough at current price levels to begin recovering margin. It also sets a floor: buyers who were waiting for further cuts may find this is the new baseline.",
      },
      {
        heading: "Should you buy now?",
        body: "If you were already planning to buy a Model Y Premium or Performance trim, there's no advantage in waiting — prices moved up today and the direction has reversed. The base Model Y RWD at $39,990 remains the most accessible entry point and was not affected. Fuel savings calculations by state haven't changed: the running cost advantage of the Model Y over a comparable gas SUV is the same today as it was yesterday.",
      },
    ],
    sources: [
      { label: "Electrek — Tesla raises Model Y prices for first time in two years", url: "https://electrek.co/2026/05/16/tesla-tsla-raises-model-y-prices-first-time-two-years/" },
      { label: "Tesla Model Y configurator (tesla.com)", url: "https://www.tesla.com/modely" },
    ],
  },
  {
    slug: "q1-2026-ev-sales-after-tax-credit-ended",
    title: "Q1 2026 EV Sales: What the Numbers Mean After the Tax Credit Ended",
    hook: "Sales fell 7.8% vs Q4 2025 — a sharp improvement over Q4's 46% crash. The post-incentive correction may be stabilizing.",
    description: "Q1 2026 US EV sales dropped 7.8% quarter-over-quarter, according to Cox Automotive analysts. That's bad news framed as good news: it's a significant improvement over the 46% collapse in Q4 2025 that followed the elimination of federal EV tax credits in October.",
    readTime: "4 min read",
    publishedAt: "2026-05-16",
    sections: [
      {
        heading: "The numbers",
        body: "US EV sales fell 7.8% in Q1 2026 compared to Q4 2025, per Cox Automotive analysis citing InsideEVs data. In isolation that sounds like continued decline. In context, it's a significant deceleration from the 46% crash that hit Q4 2025 — suggesting the market is finding a new floor after the incentive shock.",
      },
      {
        heading: "Why Q4 2025 was so bad",
        body: "The federal §30D EV tax credit — worth up to $7,500 for new vehicles — was eliminated on October 1, 2025. Buyers who knew the deadline was coming front-loaded purchases into Q3 2025, pulling forward months of demand. When October hit, the well was dry and sticker prices felt suddenly higher. Q4 deliveries cratered. The 46% drop was partly a statistical hangover from an artificially inflated Q3, not purely a demand collapse.",
      },
      {
        heading: "What Q1 stabilization means",
        body: "A 7.8% sequential decline after a 46% crash suggests two things: the pull-forward effect has largely unwound, and a baseline of buyers who would purchase EVs regardless of federal incentives is reasserting itself. These are the buyers for whom fuel savings, home charging convenience, and running cost math — not the tax credit — drive the decision. That cohort appears larger than the post-October sales cliff implied.",
      },
      {
        heading: "The running cost math didn't change",
        body: "The elimination of federal credits raised the upfront cost of buying an EV. It didn't change the cost of driving one. A 28 MPG gas car at $3.20/gal costs roughly 11¢/mile in fuel. The average EV at 16.5¢/kWh electricity costs 3–5¢/mile depending on efficiency. That gap — $800–$1,400/year at 13,500 miles — remains intact. For buyers who keep vehicles 5+ years, the math still pencils out even without the credit.",
      },
      {
        heading: "State incentives are picking up some slack",
        body: "Several states maintain their own EV purchase incentives independent of the federal program. California, Colorado, New York, and others offer credits and rebates that partially offset the federal gap. Availability, amounts, and income caps vary — check your state's DMV or energy office for current programs. The patchwork nature of state incentives means the EV affordability picture varies significantly by geography.",
      },
      {
        heading: "What Q2 will tell us",
        body: "Q1 data covers January through March — months that historically see lower auto sales than spring. Q2 2026 will be the more telling quarter: spring buying season, no year-ago incentive distortion, and the first clean read on steady-state demand in a post-federal-credit market. If the Q1 stabilization holds or improves, the market has genuinely adjusted. If Q2 slides further, the underlying demand problem is larger than the incentive math suggests.",
      },
    ],
    sources: [
      { label: "InsideEVs — Q1 2026 US EV Sales", url: "https://insideevs.com/news/792992/q1-electric-car-sales-2026/" },
      { label: "Cox Automotive analyst commentary", url: "https://insideevs.com/news/792992/q1-electric-car-sales-2026/" },
    ],
  },
  {
    slug: "rivian-r2-configurator-live-2026",
    title: "Rivian R2 Configurator Is Live — Starting at $45,000",
    hook: "Performance trim hits $57,990, 330-mile range, 0-60 in 3.6 seconds. Configuration opened May 15.",
    description: "Rivian opened the R2 configurator on May 15, 2026, with four trims spanning $45,000–$57,990. The mid-size SUV began rolling off the Normal, Illinois line in April. Here's everything you need to know — including what it costs to charge.",
    readTime: "4 min read",
    publishedAt: "2026-05-16",
    sections: [
      {
        heading: "Four trims, one platform",
        body: "The R2 launches with four configurations. Performance ($57,990) delivers 656 hp, AWD, 330-mile EPA range, and 0-60 in 3.6 seconds — a figure that undercuts most gas SUVs in the same price range. Premium ($53,990) targets late-2026 delivery. Standard ($48,490) slots in for 2027, and a Standard smaller-battery variant comes in around $45,000 in late 2027.",
        list: [
          "Performance: $57,990 — AWD, 330 mi, 656 hp, 0-60 3.6s, 87.4 kWh",
          "Premium: $53,990 — late 2026 delivery",
          "Standard: $48,490 — 2027 delivery",
          "Standard (smaller battery): ~$45,000 — late 2027",
        ],
      },
      {
        heading: "Production already started",
        body: "Rivian began R2 production on April 22 at its Normal, Illinois factory — days after a tornado touched down near the facility. The company expects 20,000–25,000 deliveries in 2026, ramping from a slow start as the new platform stabilizes. The Normal plant has built every Rivian vehicle to date and now runs both R1 and R2 lines simultaneously.",
      },
      {
        heading: "What it costs to charge",
        body: "The Performance trim's 87.4 kWh battery and 330-mile range works out to roughly 3.8 miles per kWh — more efficient than the larger R1S (2.9 mi/kWh) and in line with the Model Y Long Range (3.9 mi/kWh). At the US average of 16.5¢/kWh, a full charge from empty costs about $14.40 — or roughly $0.043 per mile. At a DC fast charger (typically $0.40–$0.50/kWh), expect $35–$44 for a full charge. The R2 supports up to 150 kW DC fast charging, hitting 10-80% in about 29 minutes.",
      },
      {
        heading: "How it stacks up on fuel cost",
        body: "Compared to a 28 MPG gas SUV at $3.20/gal, the R2 Performance saves roughly $950–$1,100 per year in fuel at 13,500 miles annually (home charging). That gap widens in high-electricity-cost states like California (23¢/kWh) where the math still favors EV, and narrows in states with cheap gas. Use the state-by-state calculator at EVChargeSavings.com to see your exact numbers.",
      },
      {
        heading: "Rivian's broader 2026 lineup",
        body: "The R2 sits below the R1S and R1T in Rivian's lineup and targets mainstream buyers priced out of the $70,000+ R1 family. Rivian is also developing the R3 hatchback and R3X performance variant, though no production dates have been confirmed. The R2 configurator launched with delivery estimates that vary by trim — Performance reservations are binding $100 deposits convertible to orders.",
      },
    ],
    sources: [
      { label: "Rivian R2 configurator (rivian.com)", url: "https://rivian.com/r2" },
      { label: "Rivian April 2026 production announcement", url: "https://rivian.com/newsroom" },
    ],
  },
  {
    slug: "tesla-model-s-x-end-of-production-2026",
    title: "Tesla Ends Production of Model S and Model X After 14 Years",
    hook: "The last units rolled off the Fremont line on May 9. Fremont now pivots to Optimus robot production.",
    description: "Tesla built its last Model S on May 9, 2026, closing a 14-year run for the sedan that launched the modern EV era. The Model X follows after an 11-year production run. Fremont's freed capacity goes to Optimus humanoid robots.",
    readTime: "4 min read",
    publishedAt: "2026-05-16",
    sections: [
      {
        heading: "End of an era",
        body: "Tesla's Model S defined the premium EV segment when it launched in 2012. The Model X followed in 2015 with its signature falcon-wing doors. Together they gave Tesla a foothold in the $80,000+ luxury market and proved that EV range anxiety could be solved with a big enough battery. Combined production over both models exceeded 610,000 vehicles — a small number by industry standards, but culturally outsized.",
      },
      {
        heading: "Why now",
        body: "Sales had been shrinking for years. By 2025, combined S and X deliveries had dropped to roughly 30,000 units annually — a rounding error against Model Y volumes. The aging platforms, with interiors overhauled in 2021 and little changed since, struggled to justify the factory floor space as demand shifted toward Model 3 and Model Y. The decision reflects Tesla's strategic pivot: manufacturing space is now more valuable for Optimus than for vehicles few people are buying.",
      },
      {
        heading: "The 350 Signature Edition send-off",
        body: "Tesla marked the end with a Signature Edition run of 350 vehicles: 250 Model S Plaid and 100 Model X Plaid, priced at $159,420. The cars shipped in April and May 2026 and are already trading at premiums among collectors. Production allocation was first-come, first-served for existing reservation holders.",
      },
      {
        heading: "Fremont pivots to Optimus",
        body: "Tesla plans to begin Optimus humanoid robot production at Fremont in July or August 2026, targeting 5,000 units this year and scaling aggressively from there. Elon Musk has set a long-term price target of $20,000–$30,000 per robot, with public sales beginning as early as late 2027. The Fremont factory previously produced up to 600,000 vehicles per year across all models — the Model S/X lines likely freed 50,000–80,000 annual units of capacity.",
      },
      {
        heading: "What Tesla still makes",
        body: "Tesla's active production lineup is now Model 3, Model Y, Cybertruck, and Cybercab. The Cybercab (formerly Robotaxi) is a two-seat autonomous vehicle expected to enter limited public service in 2026. Tesla has not announced any replacements for the Model S or X segments.",
      },
    ],
    sources: [
      { label: "Tesla Q1 2026 production and delivery report", url: "https://ir.tesla.com" },
      { label: "Tesla Signature Edition announcement", url: "https://www.tesla.com" },
    ],
  },
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
  {
    slug: "california-1-billion-ev-truck-rebate-2026",
    title: "California Launches $1 Billion Rebate Program for Electric Commercial Trucks",
    hook: "Rebates of $7,500–$120,000 per vehicle now open for California fleets switching to electric semis, box trucks, and delivery vans.",
    description: "Governor Newsom announced the California Clean Fuel Reward program on May 13, 2026 — $250 million in rebates this year and $1 billion through 2030 for businesses replacing diesel commercial trucks with electric vehicles.",
    readTime: "3 min read",
    publishedAt: "2026-05-13",
    sections: [
      {
        heading: "What California Just Announced",
        body: "Governor Newsom announced the California Clean Fuel Reward (CCFR) program on May 13, 2026 — a rebate initiative funded through California's Low Carbon Fuel Standard (LCFS) program. It offers $250 million in rebates this year and more than $1 billion in total funding through 2030. Applications are open now at cleanfuelreward.com, with rebates available at authorized retailers starting June 26, 2026.",
      },
      {
        heading: "Who Qualifies and for How Much",
        body: "Public and private fleets across California are eligible. Rebate amounts range from $7,500 to $120,000 per vehicle depending on vehicle class. Eligible vehicles include:",
        list: [
          "Electric drayage trucks (port and freight corridor use)",
          "Electric semi-trucks",
          "Electric box trucks",
          "Electric delivery vans",
          "Other electric fleet commercial vehicles",
        ],
      },
      {
        heading: "How to Apply",
        body: "Applications are open now through cleanfuelreward.com. Starting June 26, 2026, rebates will also be available directly at authorized retailers — meaning fleet operators can apply the discount at point of purchase rather than waiting for reimbursement. Southern California Edison, a program administrator, called CCFR expected to become the largest utility-administered rebate for electric trucks in the country.",
      },
      {
        heading: "Why This Matters for EV Charging Infrastructure",
        body: "Commercial trucks are among the highest-mileage vehicles on the road. Electrifying them drives significant demand for high-power charging at ports, freight hubs, and distribution centers. As fleets deploy electric semis and delivery vehicles, charging corridors along California's freight routes expand — a ripple effect that also benefits passenger EV drivers using the same highway corridors.",
      },
      {
        heading: "State-Funded, Not Federally Dependent",
        body: "California's LCFS-funded model generates revenue from carbon credits and redirects it to EV adoption — a self-sustaining mechanism that doesn't depend on federal budget cycles or congressional approval. The $1 billion CCFR commitment gives fleet operators multi-year planning certainty to invest in electric vehicles and the charging infrastructure to support them.",
      },
      {
        heading: "What This Means for Consumer EV Owners",
        body: "The CCFR rebate targets commercial fleets, not personal vehicles. But the program accelerates heavy-duty charging infrastructure along freight corridors and near ports — improving charging availability over time for all drivers in those areas. California's sustained electrification investment also keeps upward pressure on EV manufacturing volumes, which historically pushes consumer prices down.",
      },
    ],
    sources: [
      { label: "Governor Newsom — Official Announcement, California Clean Fuel Reward Program", url: "https://www.gov.ca.gov/2026/05/13/governor-newsom-announces-californias-new-1-billion-rebate-program-for-electric-trucks-as-trump-cedes-global-clean-vehicle-market-to-china/" },
    ],
  },
  {
    slug: "california-200m-ev-rebate-first-time-buyers-2026",
    title: "California's $200M EV Rebate Is Point-of-Sale and First-Time Buyers Only",
    hook: "California's new ZEV rebate arrives at the dealership, not on your tax return — but only if you've never owned an EV.",
    description: "California is proposing a $200 million light-duty ZEV incentive program with a dollar-for-dollar automaker match, available at the point of sale exclusively for first-time EV buyers on new and used vehicles.",
    readTime: "3 min read",
    publishedAt: "2026-05-14",
    sections: [
      {
        heading: "California's $200M EV Rebate: The Basics",
        body: "California Governor Gavin Newsom has proposed a $200 million fund for a new light-duty zero-emission vehicle incentive program in the 2026-2027 state budget. Unlike the federal EV tax credit — which was claimed at tax time — California's new rebate would apply directly at the point of sale, reducing what you pay upfront at the dealership.",
      },
      {
        heading: "First-Time ZEV Buyers Only",
        body: "The program has one major restriction: it's exclusively for first-time ZEV buyers. If you already own or have previously owned an electric or plug-in hybrid vehicle, you're not eligible. The state's rationale is that limiting eligibility to newcomers maximizes the fund's reach, pulling in consumers who haven't yet made the switch to electric.",
      },
      {
        heading: "Automaker Dollar-for-Dollar Match",
        body: "Participating automakers will match the state's contribution dollar-for-dollar, potentially doubling the total incentive pool to $400 million or more. The per-vehicle rebate amounts and which manufacturers will participate are still being finalized as part of the 2026-2027 budget process.",
      },
      {
        heading: "New and Used Vehicles Both Qualify",
        body: "The program covers both the sale or lease of new light-duty passenger ZEVs and the purchase of used ZEVs. For budget-conscious shoppers, this is significant: a first-time EV buyer in the used market could receive the same point-of-sale discount as someone buying new — unlike past California programs that primarily favored new-vehicle purchases.",
      },
      {
        heading: "Context: Filling the Federal Gap",
        body: "The proposal comes after the federal EV tax credit was eliminated earlier this year. Newsom had initially pledged to backfill federal incentives with state funds, then walked that back citing budget constraints. The $200 million item in the 2026-2027 budget signals California is now finding room to partially restore support — specifically targeting buyers who have never gone electric.",
      },
      {
        heading: "What This Means If You're Considering an EV",
        body: "If you live in California and have never owned an EV or plug-in hybrid, this program — if the budget passes — could put significant money back in your pocket at signing, not months later at tax time. Monitor the California budget finalization in the coming months for the confirmed per-vehicle amount and participating automaker list.",
      },
    ],
    sources: [
      { label: "Governor Newsom's $200M ZEV Program — Governor of California", url: "https://www.gov.ca.gov/2026/02/09/what-theyre-saying-strong-support-for-governor-newsoms-200m-zev-program/" },
    ],
  },
  {
    slug: "tesla-supercharger-virtual-queue-pilot-2026",
    title: "Tesla Launches Supercharger Virtual Queue at 5 Congested US Stations",
    hook: "No more circling the lot — Tesla's app now holds your place in line at busy Superchargers.",
    description: "Tesla launched a virtual waitlist pilot at five high-traffic US Supercharger stations on May 11, 2026, letting drivers queue via the app instead of waiting physically. The move comes after opening 70% of its 80,000+ US stalls to non-Tesla vehicles drove 53 million sessions in Q1 2026.",
    readTime: "4 min read",
    publishedAt: "2026-05-15",
    sections: [
      {
        heading: "What Tesla launched",
        body: "On May 11, 2026, Tesla's charging team announced a virtual waitlist pilot at five of its most congested US Supercharger stations. Drivers who arrive at a full station can join the queue through the Tesla app. The app shows their position in line via a Live Activity notification — no physical waiting required. The pilot had been promised for Q2 2025 but launched a full year late.",
        list: [
          "Los Gatos, CA — Los Gatos Boulevard",
          "Mountain View, CA — El Monte Avenue",
          "San Francisco, CA — Lombard Street",
          "San Jose, CA — Saratoga Avenue",
          "Bronx, NY — East Gun Hill Road",
        ],
      },
      {
        heading: "Why congestion got this bad",
        body: "Tesla opened roughly 70% of its 80,000+ US Supercharging stalls to non-Tesla vehicles over the past two years. The result: 53 million charging sessions in Q1 2026 alone — a volume the physical infrastructure wasn't designed for at peak times. High-traffic urban stations in the Bay Area and New York have been the worst affected, with drivers occasionally blocking stalls or jumping queues.",
      },
      {
        heading: "Existing congestion fees still apply",
        body: "The virtual queue sits on top of pricing measures Tesla already has in place. A $1-per-minute congestion fee applies to drivers who charge past 90% state of charge at busy stations — the first 5 minutes are waived. Dynamic pricing has been expanded to 550 Supercharger stations across California, New Jersey, New York, Florida, and Illinois. The virtual queue doesn't change these fees; it just organizes who gets a stall next.",
      },
      {
        heading: "One catch: compliance is voluntary",
        body: "Tesla cannot technically enforce queue order — the system relies on drivers honoring their position. If someone ignores the queue and plugs in out of turn, the app has no mechanism to prevent it. Tesla has not said whether enforcement features are planned for the full rollout.",
      },
      {
        heading: "What this means for EV owners",
        body: "For non-Tesla EV owners who now have Supercharger access via NACS or an adapter, the virtual queue applies equally — you don't need to own a Tesla to use it. For any EV driver planning a route through one of these five pilot stations, the practical upshot is: check the app before you arrive, join the queue remotely if it's full, and don't drive to 90%+ if you're at a congested station and want to avoid the per-minute fee.",
      },
    ],
    sources: [
      { label: "Tesla Supercharger Virtual Queue Pilot — Electrek", url: "https://electrek.co/2026/05/12/tesla-supercharger-virtual-queue-pilot-5-locations/" },
    ],
  },
  {
    slug: "chevy-equinox-ev-2027-nacs-supercharger-access",
    title: "2027 Chevy Equinox EV Gets Built-In NACS Port — 17,000+ Superchargers, No Adapter Needed",
    hook: "GM's top-selling affordable EV adds native Tesla Supercharger access for 2027, keeping its $34,995 base price and 319-mile range.",
    description: "The 2027 Chevrolet Equinox EV adds a built-in NACS charging port, eliminating the need for an adapter to reach Tesla's 17,000+ US Supercharger stations. The update also includes an upgraded Bose sound system, while the starting price stays at $34,995 with 319 miles of EPA-estimated range.",
    readTime: "4 min read",
    publishedAt: "2026-05-21",
    sections: [
      {
        heading: "What's new for 2027",
        body: "Chevy quietly updated the Equinox EV for the 2027 model year with two meaningful additions: a native NACS (North American Charging Standard) port and an upgraded Bose premium audio system. The NACS port is the bigger deal for most drivers — it means the 2027 Equinox EV can plug directly into Tesla Superchargers without carrying an adapter. The Bose system replaces the standard six-speaker stereo and is included in the Active Safety Package 3, which now runs $3,955 (up from $3,355 on the 2026 model). Everything else stays the same: 319 miles of EPA-estimated range on front-wheel-drive trims, a 17.7-inch infotainment screen, 102 cubic feet of interior space, and a base price of $34,995.",
      },
      {
        heading: "Why NACS matters for charging costs",
        body: "Tesla's Supercharger network has over 17,000 charging stalls across the US, making it by far the largest DC fast-charging network in the country. Until recently, non-Tesla EV owners either needed an adapter or were limited to CCS networks like Electrify America and EVgo. With a built-in NACS port, 2027 Equinox EV owners can use Superchargers natively — no adapter to forget, no compatibility worries. Supercharger pricing has generally run $0.25–$0.35 per kWh at off-peak times, which is competitive with or cheaper than many third-party DC fast-charging networks. For drivers whose home utility doesn't offer a strong TOU rate or who do frequent road trips, this direct Supercharger access meaningfully expands affordable fast-charging options.",
      },
      {
        heading: "319 miles: what it means in practice",
        body: "The 319-mile EPA range on FWD trims (307 miles AWD) is class-competitive for an EV starting under $35,000. At highway speeds, real-world range typically runs 80–85% of EPA — roughly 255–271 miles of usable highway range before a significant charge stop. That's enough for most one-tank driving days without planning around charging. On a Level 2 home charger (typically 7–11 kW), the Equinox EV can add roughly 25–35 miles of range per hour overnight, meaning a typical 40-mile daily commute is fully recovered in about 90 minutes of Level 2 charging.",
      },
      {
        heading: "How it stacks up against competition",
        body: "The Equinox EV ranked third among all US EVs sold in 2025 and held fifth place in Q1 2026 — a strong position for a mainstream non-Tesla EV at its price point. Its nearest value competitors are the 2027 Chevy Bolt at $28,595 (shorter range, smaller interior) and the Ford Mustang Mach-E starting around $39,995. The Equinox EV's combination of 319-mile range, native NACS access, and sub-$35K pricing makes it one of the stronger value cases for buyers who want to avoid the Tesla ecosystem but still want full Supercharger access.",
        list: [
          "2027 Equinox EV LT FWD: $34,995 — 319 miles EPA, native NACS",
          "2027 Chevy Bolt: $28,595 — shorter range, CCS only",
          "Ford Mustang Mach-E: ~$39,995 — NACS standard on 2024+",
          "2026 Equinox EV inventory: $5,000 customer cash discount available now",
        ],
      },
      {
        heading: "If you're still on a 2026 — buy now",
        body: "GM is currently offering $5,000 customer cash on 2026 Equinox EV inventory, bringing the effective price to around $29,995 before any state incentives. The 2026 model uses a CCS port, so you'd still need a $35 NACS adapter for Supercharger access — but at $5,000 less upfront, many buyers will find that trade-off worthwhile. Once 2027 inventory arrives, that discount is likely to disappear. Buyers in states with additional EV incentives (California, Colorado, New York, New Jersey, and others) can stack those on top of the cash offer.",
      },
    ],
    sources: [
      { label: "2027 Chevy Equinox EV Updates — Electrek", url: "https://electrek.co/2026/05/20/chevy-equinox-ev-gains-few-big-updates-2027/" },
    ],
  },
  {
    slug: "rivian-r2-orders-open-june-9-2026",
    title: "Rivian R2 Orders Open June 9 — Full Specs, Pricing, and What It Costs to Charge",
    hook: "Order invites drop June 9. The R2 starts at $57,990 with 330 miles, 217 kW charging, and NACS — here's the full ownership cost picture.",
    description: "Rivian confirmed June 9 as the R2's official order and demo launch date. With EPA-rated 330-mile range, 217 kW peak DC charging, a native NACS port, and three trims from $57,990 to $48,490, the R2 is the most affordable Rivian yet — and one of the fastest-charging SUVs at its price point.",
    readTime: "5 min read",
    publishedAt: "2026-05-27",
    sections: [
      {
        heading: "What's happening June 9",
        body: "Rivian officially confirmed May 27 that June 9, 2026 is the R2's launch day. On that date: order invites go out by email (eligibility based on reservation date and proximity to a Rivian Space), public demo drives open for booking at Rivian Spaces nationwide, and first deliveries begin for Launch Package buyers. The R2 has been in production since April 2026 at Rivian's Normal, Illinois plant — production started days after a tornado hit the facility, a detail that says something about the urgency to ship. If you reserved early, expect your invite in the first wave. R1 owners get accelerated delivery priority but do not automatically go first.",
      },
      {
        heading: "Trims, pricing, and the $45K question",
        body: "Rivian revealed three R2 trims with staggered availability. The R2 Performance launches first at $57,990 — 656 hp, 609 lb-ft of torque, 0-60 in 3.6 seconds, up to 330 miles of EPA range. The R2 Premium AWD follows in late 2026 at $53,990 — 450 hp, 537 lb-ft, 0-60 in 4.6 seconds, also 330 miles. The R2 Standard RWD arrives in early 2027 at $48,490 — 350 hp, 355 lb-ft, 0-60 in 5.9 seconds, with slightly longer range at 345 miles. The $45,000 starting price Rivian announced in 2024 is real — but it applies to a later Standard configuration not yet on sale, expected late 2027. The Launch Package adds a tow package rated at 4,400 lbs, a special key fob, Launch Green paint option, and a lifetime subscription to Rivian's Autonomy+ driver-assistance feature.",
        list: [
          "R2 Performance: $57,990 — 656 hp, 330 mi, ships June 2026",
          "R2 Premium AWD: $53,990 — 450 hp, 330 mi, ships late 2026",
          "R2 Standard RWD: $48,490 — 350 hp, 345 mi, ships early 2027",
          "$45,000 base trim: not yet on sale — expected late 2027",
        ],
      },
      {
        heading: "217 kW charging and NACS — what that means in practice",
        body: "The R2 peaks at 217 kW DC fast charging with a native NACS port, putting it ahead of most mid-priced EVs in its class. At 217 kW, EPA testing puts the 10–80% charge time at 29 minutes. For context: Tesla Model Y Long Range peaks at 250 kW, Hyundai Ioniq 5 at 220 kW, and the Chevrolet Equinox EV at 150 kW. The native NACS port means direct access to Tesla's V4 Supercharger network (up to 500 kW stations, more than the R2 can accept, but future-proofed). No adapter needed, no separate app — plug in at any of the 17,000+ US Supercharger locations. For road trips on Rivian's own Adventure Network, the R2 uses the same CCS charging infrastructure Rivian has been building for R1 owners.",
      },
      {
        heading: "What home charging actually costs",
        body: "Most R2 owners will do 95%+ of their charging at home on a Level 2 charger. The R2's 75 kWh battery (estimated usable capacity based on range and efficiency) takes about 7–8 hours to fully charge on a 48A Level 2 charger — typically overnight. At the US average electricity rate of $0.17/kWh, a full charge costs roughly $12.75. Driving 13,500 miles per year (US average) costs approximately $650–$750 annually to fuel at home — compared to $2,200–$2,800 for a comparable midsize gas SUV at $3.50/gallon. Owners in states with time-of-use (TOU) utility rates who charge off-peak can drop that home charging cost further, to $400–$550/year in some states.",
      },
      {
        heading: "R2 vs R1S — is the upgrade worth $20K?",
        body: "The R1S starts at $75,900 — roughly $18,000 more than the R2 Performance. For that premium you get a larger battery (135 kWh), longer range (410 miles), more towing capacity (7,700 lbs), and a larger interior suited for 7 passengers. The R2 seats 5, tows 4,400 lbs, and carries 75 kWh. For most buyers who don't tow regularly or need 3-row seating, the R2 is the right choice. The charging speed difference is minimal (217 kW vs 220 kW on the R1S). The R2's smaller battery actually means faster fill-to-full times at home because you're moving fewer kWh.",
      },
      {
        heading: "Should you order on June 9?",
        body: "If you reserved an R2 and want the Launch Package perks (Autonomy+ lifetime subscription alone is worth several hundred dollars/year), ordering early is the right move. The R2 Performance at $57,990 doesn't qualify for the federal EV tax credit — the credit was eliminated in October 2025. However, several states (Colorado, California, New York, New Jersey, Massachusetts) still offer EV purchase incentives up to $5,000–$9,000 that stack on top of the purchase price. Check your state's incentive status before configuring — it can meaningfully change the net cost.",
      },
    ],
    sources: [
      { label: "Rivian R2 Launch Announcement — Electrek", url: "https://electrek.co/2026/05/27/rivian-r2-officially-launches-june-9-order-invites-first-deliveries-demo-drives/" },
      { label: "Rivian R2 EPA Specs (217 kW, 330 mi) — Electrek", url: "https://electrek.co/2026/04/06/rivian-r2-epa-numbers-out-217-kw-dc-charge-up-to-335mi-range-heat-pump/" },
      { label: "Rivian R2 Full Lineup and Pricing — Rivian Newsroom", url: "https://www.businesswire.com/news/home/20260311180295/en/Rivian-Introduces-R2-Lineup-Sharing-Full-Trims-and-Pricing" },
    ],
  },
];

export function getNewsBySlug(slug: string): NewsArticle | undefined {
  return NEWS.find((a) => a.slug === slug);
}
