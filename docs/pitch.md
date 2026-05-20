# EV Charge Savings — Site Pitch

Use the version that fits the context. All facts verified as of May 2026.

---

## One-liner

> The EV savings calculator that uses your actual car, your actual state, real 2026 rates, and the state registration fee competitors ignore — not national averages.

---

## Short — Reddit comment, social, DM

> [evchargesavings.com](https://evchargesavings.com) — pick your EV, pick the gas car (or PHEV) you're replacing, pick your state. Live EIA electricity and gas prices per state, and it nets out the state EV registration fee most calculators skip. Shows annual savings, 5-year savings, CO2 saved, home vs public charging split — plus break-even year on individual head-to-head compare pages. ~141 EVs, 190+ gas cars, 40 PHEVs, 50 states + DC. Free, no sign-up.

---

## Medium — mod pitch, press tip, partnership email

**EV Charge Savings** ([evchargesavings.com](https://evchargesavings.com)) is a free EV cost calculator built by a Kia EV9 owner who got tired of calculators using national average electricity rates.

What makes it different:
- **Exact matchup** — your exact EV against the exact gas car or PHEV you'd buy instead, not a segment average
- **PHEV comparison mode** — compare an EV against a plug-in hybrid; it splits annual miles into electric (within the PHEV's EV range) and gas portions and computes the *net* registration-fee change (you escape the PHEV surcharge, gain the BEV one)
- **Nets out the state EV registration fee** — 40 states charge a BEV surcharge (up to $270 NJ); most calculators ignore it. Toggle on by default, sourced from NCSL + DOE AFDC, all 50 states + DC
- **State-level EIA data** — 50-state electricity + gas prices, updated from EIA actuals
- **Home vs public charging split** — adjust what % you charge at home
- **Break-even year, annual savings, CO2 saved** — all on one screen
- **~141 EV models, 190+ gas cars, 40 PHEVs**, ZIP code detection
- Full methodology at [evchargesavings.com/how-we-calculate](https://evchargesavings.com/how-we-calculate)

**Head-to-head compare pages** — 320 EV-vs-gas + 64 EV-vs-PHEV pre-built pages with FAQPage rich-result schema, a personalized hero that hydrates from calculator state when you arrive from the homepage, and a full in-page calculator pre-loaded with the right vehicles. Example: [/compare/tesla-model-3-rwd-vs-toyota-camry](https://evchargesavings.com/compare/tesla-model-3-rwd-vs-toyota-camry).

**State EV purchase incentives** — 13 states with live programs ($750–$9,000) displayed inline on state cost pages and linked from the calculator banner when a user enters a qualifying state. Stacks on top of fuel savings shown in the calculator.

**Home Charger ROI calculator** — on the EV owner resource page: input daily miles and installation budget, get break-even in months after the §30C federal tax credit (30% of hardware, up to $1,000 — expires June 30, 2026). Includes public-session-avoided calculation and TOU rate savings.

**EV owner personalization** — `/ev-owner` has a car picker (type model → dropdown → select) that locks the entire page to the user's specific EV: charger picks, adapter recommendations, and ROI calculator all update. Selection persists in `localStorage` across sessions. Locked state shows a solid-green pill with the car name — can't be accidentally edited. Page has its own OG image ("You own an EV. Make it cheaper.") showing Level 2 payback, TOU rate reduction, and insurance savings.

Beyond the calculator: 118 guides across buying, charging, finance, and ownership — including EV charging network comparison, apartment renter charging strategies, and utility rate plans that cut charging cost to 3–13¢/kWh. **News updated daily** — policy, pricing, and infrastructure. Full state-by-state dataset published at [/research](https://evchargesavings.com/research).

Free. No sign-up. No ads obscuring results.

---

## Long — CleanTechnica tip, press kit, cold outreach

**EV Charge Savings** is a free EV total cost calculator and content hub built by a Kia EV9 owner in the Pacific Northwest.

**The calculator** lets users select a specific EV model (~141 options) against the specific gas car they're replacing (190+ options) — or against a plug-in hybrid (40 PHEVs) — enter their state, and get: annual fuel savings, break-even year, CO2 avoided, and a full home vs public charging cost breakdown. It pulls state-level EIA electricity rates and gas prices — not national averages — so the result is meaningfully different for someone in California (~$0.33/kWh) vs Louisiana (~$0.13/kWh).

**Two things competitors don't do:**
1. **State EV registration fee netted out.** 40 states charge EVs an annual surcharge gas cars don't pay (up to ~$270 in New Jersey, ~$138 national average). The calculator subtracts it by default — sourced from NCSL + DOE Alternative Fuels Data Center, all 50 states + DC, with a toggle for fuel-only.
2. **PHEV comparison.** Switching from a plug-in hybrid, not a pure gas car? The calculator splits annual miles into electric and gas portions by the PHEV's EPA electric range vs daily driving, and computes the *net* fee impact — you stop paying the PHEV surcharge but start paying the BEV one (35 states charge a PHEV surcharge too).

**Why it matters now:** The $7,500 federal EV tax credit was eliminated October 1, 2025. Buyers need more accurate cost tools than ever — the break-even math changed significantly without the credit. State-level programs (Colorado: up to $9,000, Massachusetts: up to $8,700) make the picture highly location-dependent.

**Content library:** 118 guides covering EV buying, financing, charging, installation, and ownership. News updated daily — policy changes, pricing moves, infrastructure. Recent additions include:
- Utility rate plan guide — Georgia Power customers charge for ~6.6¢/kWh overnight; Duke Energy Florida ~3.5¢/kWh
- Apartment renter charging guide — Right to Charge laws by state, DCFC cost strategies, workplace charging
- Charging network comparison — Supercharger vs Electrify America vs EVgo vs ChargePoint vs IONNA
- Most reliable EVs 2026 — brand reliability rankings, warranty comparison
- Best used EVs to buy 2026 — picks by budget, CPO guide, post-credit market

**State EV incentives:** 13 states with live purchase programs displayed on state cost pages — verified DOE AFDC data, stacked on fuel savings. Calculator shows inline banner when user's state has programs, linking to `#incentives` anchor. Note: Oregon Standard Rebate suspended Sept 9, 2025; Charge Ahead Rebate suspended Dec 5, 2025 — both on waitlist for spring 2026 reopening. Site reflects current suspension status.

**Home Charger ROI:** Interactive break-even calculator on the EV owner resource page. Inputs: daily miles, charger hardware cost, total install budget. Outputs: time saved per charge, public sessions avoided per month, TOU savings, §30C credit (30% up to $1,000, expires June 30 2026), and break-even months. Converts directly to Level 2 charger product affiliate section.

**Programmatic depth:** 750+ static pages — cost-to-charge by EV × state, EV-vs-EV comparisons, 320 EV-vs-gas + 64 EV-vs-PHEV head-to-head pages (FAQPage schema, personalized hero hydrates from calculator URL params), best-EVs-under-$X bands, per-state cost pages, per-utility rate pages.

**Transparency:** Full methodology published at [evchargesavings.com/how-we-calculate](https://evchargesavings.com/how-we-calculate); full state dataset at [/research](https://evchargesavings.com/research). Author is a named EV owner with first-hand road trip content — including 8hr+ family trips in the Kia EV9 using Electrify America.

Free. No sign-up. No paywall.

---

## Reddit outreach

### Rules
- Lead with the problem, not the site
- End with a discussion prompt — creates conversation, not traffic farming
- Never post the same copy across multiple subs same day
- Engage in the sub for a few days before posting if account is new

### Best title
> "Most EV savings calculators ignore your state's EV registration fee. Built one that doesn't."

Alternatives:
- "I got tired of EV calculators using national average electricity rates, so I built one that uses your state's actual prices"
- "Free tool: compare your exact EV vs gas car using your state electricity rates + EV registration fees"

### Post body
Most EV calculators I tried used national average electricity rates and a generic gas car comparison. Numbers felt disconnected from what I'd actually pay in [your state].

Built this as a Kia EV9 owner for my own use — figured others here might find it useful.

What's different:

- State-level EIA electricity + gas prices, not national averages
- Compare your exact EV vs the exact gas car or PHEV you'd actually buy instead
- 40 states charge annual EV registration surcharges — it nets that out by default (most calculators skip it entirely)
- PHEV mode splits miles into electric/gas based on the PHEV's range vs your daily driving

Free, no login, no ads blocking results.

Curious if the numbers line up with what you're actually seeing — evchargesavings.com

### Mod-ask message (strict subs — send before posting)
> "Built a free EV cost calculator that uses state-level electricity rates and nets out EV registration fees. Happy to disclose I built it — would this be welcome as a community resource?"

**Brand/model-specific subs** — swap in the relevant detail instead of expanding:
> "Built a free EV cost calculator with a dedicated [Model Y / Ioniq 6 / etc.] vs gas comparison page using your state's actual rates + registration fees. Happy to disclose I built it — would this be welcome here?"

### Target subs (in priority order)
1. r/electricvehicles — largest, general EV audience
2. r/electriccars — smaller, more engaged
3. r/teslamotors — use brand-specific mod-ask
4. r/KiaEV — author owns EV9, authentic angle
5. r/HyundaiIoniq — Ioniq 5/6 compare pages live
6. r/prius — PHEV mode is directly relevant (Prius Prime)
7. r/personalfinance — EV cost angle, not car angle

---

## Social proof (press / partnership tiers only)

- Organically cited 5× in a 541-upvote r/electricvehicles thread (unprompted, by other users)
- ~2,200 active users / ~5,800 page views in first month post-launch (growing — launch milestone, not a ceiling)

---

## Key facts to reference

| Fact | Detail |
|---|---|
| EV models | ~141 |
| Gas cars | 190+ |
| PHEVs | 40 |
| Guides | 118 across 9 categories |
| News articles | ~20, updated daily |
| States covered | 50 + DC |
| Net-of-fee savings | 40 states charge BEV surcharge (NJ ~$270, ~$138 avg); 35 charge PHEV surcharge — netted out by default |
| Fee data source | NCSL + DOE AFDC, verified May 2026 |
| Federal credit status | §30D + §25E eliminated Oct 1, 2025; §30C home charger credit (30% / $1K cap) expires June 30, 2026 |
| State incentives | 13 states — CO $750, MA $3,500, NY $2,000, IL $2,000, OR $2,500 (suspended — waitlist spring 2026), NJ $1,500+, WA $9K income-only, VT $2,500, TX $2,500, CT $1,000, ME $5,000, MD $3,000, RI $1,500 |
| Example rate spread | CA ~$0.33/kWh vs LA ~$0.13/kWh (state-level EIA) |
| Cheapest overnight rate | Duke Energy FL ~3.5¢/kWh |
| California SDG&E off-peak | ~12–13¢/kWh (Power Your Drive) |
| Author vehicle | Kia EV9, Pacific Northwest |
| Methodology page | /how-we-calculate · dataset: /research |
