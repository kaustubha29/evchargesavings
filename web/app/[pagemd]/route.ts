import { NextRequest, NextResponse } from "next/server";

const MD: Record<string, string> = {
  "about.md": `# About EV Charge Savings

Built by an EV owner, for people still deciding.

I got a Kia EV9, went through two years of confusion figuring out charging, costs, and real-world ownership — then built this so the next person doesn't have to start from scratch.

## Author

Engineering leader in the Pacific Northwest. Kia EV9 owner. Influenced four coworkers and friends to buy one. Helped each of them set up Level 2 charging, navigate connector compatibility, and understand what their electricity rate actually meant for monthly costs.

## How This Started

When I got my EV9 I had no idea what to expect from home charging — Level 1 vs Level 2, different connector types, whether a standard outlet would work, what the electricity bill impact would look like. Most online advice was written for Tesla owners. Owning a non-Tesla EV is a different experience.

True story: I spent two hours the day I got my EV9 puzzling over why the included charger was so slow (adding about 4 miles per hour). It was a Level 1 brick plugged into a standard 120V outlet. Had to schedule an electrician the next week for a proper Level 2 install.

## What the Site Does

A calculator that estimates fuel savings using live government data — actual state electricity rates from the EIA updated monthly, actual gas prices from the EIA updated weekly. A driver in California paying 30¢/kWh has completely different savings math than one in Wyoming paying 11¢.

## Data Sources

- **EIA — Electricity rates**: U.S. Energy Information Administration residential electricity rates by state, published monthly.
- **EIA — Gas prices**: EIA retail gasoline prices by PADD region and state, published weekly.
- **EPA — Vehicle efficiency**: MPG and miles-per-kWh ratings from EPA's fueleconomy.gov dataset.
- **MSRP data**: Compiled from manufacturer websites and Edmunds, updated periodically.

## What the Calculator Includes (and Doesn't)

Estimates fuel costs only. Does not include purchase price, insurance, maintenance, financing, or depreciation. The break-even tool adds EV purchase premium and estimates how many years of fuel savings pay it back.

## Editorial Independence

Independent. No automaker, utility, or charging network funds or influences it. Revenue: affiliate commissions on home charger links, Google AdSense, referral fees for electrician quotes. None affect calculator results or guide content.

## Contact

[Contact page](https://www.evchargesavings.com/contact) or hello@evchargesavings.com
`,

  "how-we-calculate.md": `# How We Calculate EV Savings

Every number on this site comes from official government data and documented formulas.

## Annual EV Charging Cost

\`\`\`
annual_kwh = (miles_per_year / miles_per_kwh) * real_world_factor
annual_cost = annual_kwh * electricity_rate_cents / 100
\`\`\`

- **miles_per_year**: User input, default 13,500
- **miles_per_kwh**: From EPA fueleconomy.gov dataset (combined cycle)
- **real_world_factor**: 0.85 (EVs are ~85% as efficient in real-world vs EPA test)
- **electricity_rate_cents**: EIA residential rate for user's state (cents/kWh), updated monthly

## Annual Gas Fuel Cost

\`\`\`
annual_gallons = miles_per_year / mpg * real_world_factor
annual_cost = annual_gallons * gas_price
\`\`\`

- **mpg**: From EPA fueleconomy.gov (combined cycle)
- **real_world_factor**: 0.85
- **gas_price**: EIA retail price for user's state or PADD region, updated weekly

## Annual Savings

\`\`\`
annual_savings = gas_annual_cost - ev_annual_cost
\`\`\`

If negative, the EV costs more to fuel than the gas car.

## Break-Even Calculation

\`\`\`
premium = ev_msrp - gas_msrp
break_even_years = premium / annual_savings
\`\`\`

Only calculated when annual_savings > 0.

## Data Sources

- [EIA Electricity API](https://www.eia.gov/electricity/): Residential rates by state, Series ID ELEC.PRICE.{STATE}-RES.M, published monthly
- [EIA Gasoline Prices](https://www.eia.gov/petroleum/gasprices/): Weekly retail prices by PADD region, state-level when available
- [EPA fueleconomy.gov](https://www.fueleconomy.gov/feg/download.shtml): Annual dataset, combined-cycle MPG and MPGe for all vehicles

## Caveats

- EPA combined ratings are ~10–30% optimistic vs real-world highway driving
- Public charging (DCFC) costs 2–4× more than home charging; calculator assumes 80% home charging
- Gas prices fluctuate weekly; saved figures may differ from current actuals
- Does not account for: purchase price differences, insurance, maintenance, depreciation, financing
`,

  "ev-owner.md": `# EV Owner Resource Guide

Already own an EV? Here's what most owners figure out the hard way.

## 3 Things That Move the Needle Most

### 1. Upgrade to Level 2
Level 1 (standard outlet) adds 4–5 miles per hour. Fine for low mileage, painful for anything else. A Level 2 install runs $500–$1,500 total and fully charges most EVs overnight. One-time cost, permanent fix.

### 2. Switch to a TOU Electricity Rate
Most utilities offer time-of-use plans with overnight rates 30–60% below standard. Set your car to charge after 9 PM and your effective per-mile cost drops significantly — often the single biggest lever after the initial purchase.

### 3. Review Your EV Insurance
EV insurance costs vary dramatically by insurer. Some penalize for high replacement part costs, others actively offer EV discounts. Most owners who shop after year one find meaningful savings. It takes 10 minutes.

## Home Charging Levels

**Level 1 (120V standard outlet)**
- Speed: 4–5 miles of range per hour
- Equipment: included brick charger
- Best for: under 30 miles/day, plug-in hybrids
- Cost: $0 additional hardware

**Level 2 (240V dedicated circuit)**
- Speed: 20–35 miles of range per hour
- Equipment: EVSE unit ($300–$800) + electrician install ($200–$700)
- Best for: most EV owners, daily drivers
- Total cost: $500–$1,500 installed

**DC Fast Charging (public)**
- Speed: 100–350 miles per hour (varies by vehicle max charge rate)
- Cost: $0.30–$0.60/kWh or per-minute pricing
- Best for: road trips, emergencies

## Connector Types (2024+)

**NACS (North American Charging Standard)**
- Required on all new US EVs from 2025 (SAE J3400)
- Native on: all Teslas, Ford (2024+), GM (2024+), Rivian (2024+), Honda (2025+), and most new models
- Access: Tesla Supercharger network natively

**J1772 (AC charging)**
- Still on many 2022–2023 non-Tesla EVs
- Universal AC charging standard — works at all Level 2 public chargers
- DCFC uses CCS1 on these vehicles

## Public Charging Networks

- **Tesla Supercharger**: Largest network (~17,000 US stations). Open to all NACS vehicles.
- **ChargePoint**: Largest third-party network (~40,000 ports). Level 2 and DCFC.
- **Electrify America**: VW-funded, DCFC focus, highway corridors.
- **Blink**: Level 2 heavy, urban locations.
- **EVgo**: DCFC urban locations.

## Links

- [EV Insurance comparison](https://www.evchargesavings.com/ev-insurance)
- [Home charging setup guide](https://www.evchargesavings.com/guides/home-charging-setup)
- [Time-of-use rates explained](https://www.evchargesavings.com/guides/time-of-use-rates)
- [Best home EV chargers 2026](https://www.evchargesavings.com/guides/best-home-ev-chargers-2026)
`,

  "ev-insurance.md": `# EV vs Gas Insurance Costs

EVs cost 15–22% more to insure than comparable gas cars on average. Here's why and what you can do about it.

## Why EV Insurance Costs More

**Higher repair costs**
EV body panels, sensors, and battery packs cost significantly more to repair after a collision. Insurers price in that risk.

**Specialized labor**
Not all shops can work on EVs. Fewer qualified technicians means longer repair times and higher rental car costs insurers absorb.

**Higher vehicle value**
EVs carry higher sticker prices than comparable gas cars. Comprehensive and collision coverage scales with vehicle value.

**Battery replacement risk**
A totaled EV often means a $10,000–$20,000 battery replacement. Insurers factor that into premiums.

## What Affects Your Rate

- **Insurer**: Rates vary 30–50% between insurers for the same EV — shopping matters
- **State**: State insurance regulations cap and floor rates differently
- **Driving history**: Same as any car
- **Annual mileage**: Lower mileage = lower rates; EV owners often drive less than average
- **Garaging**: Home charging setup can affect theft and weather risk ratings
- **Vehicle model**: Model Y and Model 3 have higher repair frequencies than less common EVs

## How to Reduce EV Insurance Costs

1. **Shop annually** — EV-specialized insurers (PURE, Chubb, some regional carriers) can beat major insurers by 15–25%
2. **Increase deductibles** — Moving from $500 to $1,000 deductible often saves 10–15% annually
3. **Bundle home + auto** — Standard advice, still valid
4. **Ask about EV discounts** — Some insurers (Farmers, GEICO) now offer explicit EV discounts
5. **Usage-based insurance** — If you drive fewer miles than average (common for EV + hybrid households), pay-per-mile programs save money

## Impact on Total EV Savings

At the national average 18% insurance premium for EVs, a driver paying $1,200/year for gas car insurance would pay ~$1,416 for equivalent EV coverage — a $216/year difference. For most EV owners saving $900–$1,800/year on fuel, insurance is a meaningful but not decisive factor.

## More

- [EV insurance page with state data](https://www.evchargesavings.com/ev-insurance)
- [EV total cost of ownership](https://www.evchargesavings.com/guides/ev-total-cost-ownership)
`,
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ pagemd: string }> }
) {
  const { pagemd } = await params;
  const content = MD[pagemd];
  if (!content) {
    return new NextResponse("Not found", { status: 404 });
  }
  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
