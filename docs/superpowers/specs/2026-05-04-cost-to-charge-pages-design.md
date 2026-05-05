# Programmatic SEO: Cost-to-Charge Pages

**Date:** 2026-05-04  
**Status:** Approved  
**Scope:** Phase 1 — 300 pages (top 20 EVs × top 15 states)

---

## Goal

Build programmatic SEO pages targeting high-intent queries like "Is Tesla Model Y cheaper than gas in Oregon?" Each page shows EV charging cost vs gas equivalent cost in a specific state — optimized for conversion to lead capture.

---

## Route

```
/cost-to-charge/[carSlug]/[stateSlug]
```

Example: `/cost-to-charge/tesla-model-y/oregon`

File: `web/app/cost-to-charge/[carSlug]/[stateSlug]/page.tsx`

### Why nested segments (not partial-segment folder)

Faster to ship, zero parsing complexity, trivially scales to 6,630 pages via ISR. URL keyword density is a minor ranking signal — content quality and internal linking matter more.

---

## Data Flow

All data is static — no new API calls or DB queries.

```
carSlug  → getBySlug(carSlug)     → EVModel    (features/ev-data/data/evs.ts)
stateSlug → getStateBySlug(slug)  → StateData  (features/location/data/states.ts)
EVModel + StateData → savings.ts  → cost figures
EVModel  → comparable-gas.ts map  → GasVehicle (features/ev-data/data/gas-vehicles.ts)
```

### New file: `features/ev-data/data/comparable-gas.ts`

Maps EV slug → gas vehicle ID. Falls back to segment if no direct match.

```ts
// Direct model matches (all top-20 EVs covered)
'tesla-model-y':      'toyota-rav4',
'tesla-model-3':      'toyota-camry',
'tesla-model-x':      'toyota-4runner',
'tesla-model-s':      'toyota-camry',
'chevrolet-bolt-ev':  'toyota-corolla',
'ford-mustang-mach-e':'toyota-rav4',
'rivian-r1t':         'ford-f150',
'rivian-r1s':         'toyota-4runner',
'kia-ev6':            'toyota-camry',
'hyundai-ioniq-5':    'toyota-rav4',
'hyundai-ioniq-6':    'toyota-camry',
'volkswagen-id4':     'toyota-rav4',
'audi-q4-e-tron':     'toyota-rav4',
'bmw-ix':             'toyota-4runner',
'lucid-air':          'toyota-camry',
'nissan-leaf':        'toyota-corolla',
'gmc-hummer-ev':      'ford-f150',
'cadillac-lyriq':     'toyota-4runner',
'mercedes-eqb':       'toyota-rav4',
'subaru-solterra':    'toyota-rav4',

// Segment fallbacks (for ISR combos outside top-20)
suv:    'toyota-rav4',
sedan:  'toyota-camry',
truck:  'ford-f150',
```

---

## Static Generation

### Phase 1 pre-built (generateStaticParams)

**Top 20 EVs** (by US sales volume):
tesla-model-y, tesla-model-3, tesla-model-x, tesla-model-s,
chevrolet-bolt-ev, ford-mustang-mach-e, rivian-r1t, rivian-r1s,
kia-ev6, hyundai-ioniq-5, hyundai-ioniq-6, volkswagen-id4,
audi-q4-e-tron, bmw-ix, lucid-air, nissan-leaf,
gmc-hummer-ev, cadillac-lyriq, mercedes-eqb, subaru-solterra

**Top 15 states** (by EV adoption):
california, texas, florida, washington, oregon, new-york,
colorado, arizona, georgia, virginia, new-jersey,
north-carolina, illinois, massachusetts, minnesota

= **300 pre-built pages** at deploy time.

### All other combos

```ts
export const dynamicParams = true
export const revalidate = 86400  // ISR: regenerate after 24h
```

Returns `notFound()` if carSlug or stateSlug not in data.

---

## Page Metadata

New function in `features/content/seo.ts`:

```ts
chargePageMeta(ev: EVModel, state: StateData, monthlyCost: number, savings: number)
```

Output example:
```
title:       "Cost to Charge Tesla Model Y in Oregon (2026)"
description: "Charging a Tesla Model Y in Oregon costs ~$38/mo.
              See how it compares to a Toyota RAV4 on gas — save $888/year."
```

---

## Page Structure

### Hero — above the fold

```
Cost to Charge a Tesla Model Y in Oregon

$38/month to charge at home
vs $112/month for a Toyota RAV4 on gas

→ You save $888/year by going electric
```

Computed from `savings.ts` using `state.kwhCents` + `state.gasDollar`.

### Section 1 — Charging breakdown

| | |
|---|---|
| Full charge (75 kWh battery) | $12.83 |
| Cost per mile | $0.038/mi |
| Monthly cost (1,000 mi) | $38 |

Rate: "Oregon avg 10.1¢/kWh"  
Conditional: if `state.hasTOU` → add note "TOU rate as low as X¢/kWh overnight"

### Section 2 — Gas comparison (conversion trigger)

| | Monthly | Annual |
|---|---|---|
| Tesla Model Y (electric) | $38 | $456 |
| Toyota RAV4 (gas) | $112 | $1,344 |
| **You save** | **$74** | **$888** |

Gas cost uses `state.gasDollar` and comparable vehicle's `mpg`.

### Section 3 — Variability callout (trust signal)

Two short bullets:
- Local rate variation (ZIP-level, utility differences)
- Public charging cost: "2–4× more expensive — $120–$160/mo at same mileage"

Keeps trust high by acknowledging downsides.

### Section 4 — CTA

Reuses existing `LeadCaptureBox` component with:
- Headline: "Get exact savings for your ZIP + charger setup for your home"
- Intent pre-set: `home_charger`

---

## Calculations

All figures computed server-side using existing utilities:

| Figure | Source |
|---|---|
| Full charge cost | `ev.battery * (state.kwhCents / 100)` |
| Cost per mile | `(state.kwhCents / 100) / ev.efficiency` |
| Monthly EV cost | `cost_per_mile * 1000` |
| Monthly gas cost | `(1000 / gasVehicle.mpg) * state.gasDollar` |
| Annual savings | `(monthly_gas - monthly_ev) * 12` |

Assumption: 1,000 miles/month baseline (stated on page).

---

## Sitemap

Add to `web/app/sitemap.ts`:

```ts
const TOP_EV_SLUGS = [
  'tesla-model-y', 'tesla-model-3', 'tesla-model-x', 'tesla-model-s',
  'chevrolet-bolt-ev', 'ford-mustang-mach-e', 'rivian-r1t', 'rivian-r1s',
  'kia-ev6', 'hyundai-ioniq-5', 'hyundai-ioniq-6', 'volkswagen-id4',
  'audi-q4-e-tron', 'bmw-ix', 'lucid-air', 'nissan-leaf',
  'gmc-hummer-ev', 'cadillac-lyriq', 'mercedes-eqb', 'subaru-solterra',
]

const TOP_STATE_SLUGS = [
  'california', 'texas', 'florida', 'washington', 'oregon', 'new-york',
  'colorado', 'arizona', 'georgia', 'virginia', 'new-jersey',
  'north-carolina', 'illinois', 'massachusetts', 'minnesota',
]

TOP_EV_SLUGS.flatMap(car =>
  TOP_STATE_SLUGS.map(state => ({
    url: `${base}/cost-to-charge/${car}/${state}`,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))
)
```

---

## Error Handling

- Invalid `carSlug` → `notFound()`
- Invalid `stateSlug` → `notFound()`
- No comparable gas match → fallback to segment default, then national average gas vehicle

---

## Files Changed

| Action | File |
|---|---|
| Create | `web/app/cost-to-charge/[carSlug]/[stateSlug]/page.tsx` |
| Create | `web/features/ev-data/data/comparable-gas.ts` |
| Modify | `web/app/sitemap.ts` |
| Modify | `web/features/content/seo.ts` |

---

## Out of Scope (Phase 1)

- Phase 2: `/cost-to-charge/tesla-model-y-in-oregon` canonical URL layer
- Phase 3: Expand to all 6,630 combos
- Interactive calculator on this page (existing `/ev-cost/[state]` handles that)
- Break-even timeline section
- CO2 comparison section
