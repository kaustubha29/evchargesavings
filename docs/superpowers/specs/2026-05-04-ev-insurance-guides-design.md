# EV Insurance Guides — Design Spec

**Date:** 2026-05-04
**Status:** Approved

## Goal

Add 3 insurance-focused guide entries to the existing guides system. Each funnels to EverQuote via the `EVInsuranceCTA` affiliate block. No new routes, no new components — all content lives in `web/features/guides/data.ts`.

## Implementation

**Approach:** All 3 guides as entries in `GUIDES` array, category `"Ownership"`.

- Category `"Ownership"` already maps to `EVInsuranceCTA` in `AffiliateSection` (in `web/app/guides/[slug]/page.tsx:38`)
- Guides appear automatically in the index at `/guides` and render at `/guides/[slug]`
- `EVInsuranceCTA` at the bottom routes the `"insurance"` intent to EverQuote

## Guides

### Guide 1 — How to shop for EV insurance

- **slug:** `how-to-shop-ev-insurance`
- **title:** "How to shop for EV insurance (and actually save money)"
- **readTime:** 6 min read
- **category:** Ownership
- **description:** A step-by-step comparison guide covering what to tell insurers, which carriers price EVs fairly, and what coverage EV owners actually need.

Sections:
1. **Start with your current insurer** — get a baseline quote first; switching blind loses leverage
2. **What to tell your insurer** — EV-specific fields that affect rate (annual mileage, charging location, ADAS features)
3. **Which carriers are EV-friendly** — Progressive, GEICO, Tesla Insurance, Nationwide; what makes them competitive
4. **What coverage EV owners actually need** — gap coverage, battery/charging equipment coverage, OEM parts clauses
5. **Red flags in EV policies** — exclusions to watch: battery degradation, third-party charger damage, software updates
6. **The comparison checklist** — actionable list for comparing quotes side-by-side

### Guide 2 — EV insurance myths

- **slug:** `ev-insurance-myths`
- **title:** "5 EV insurance myths that cost drivers money"
- **readTime:** 4 min read
- **category:** Ownership
- **description:** Common misconceptions about EV insurance — and what's actually true — that cause owners to overpay or be underinsured.

Sections:
1. **Myth: My existing insurer covers my EV the same way** — reality: EV-specific endorsements vary widely
2. **Myth: EV insurance always costs more** — reality: some carriers price EVs at or below gas car rates
3. **Myth: Full coverage is overkill for an older EV** — reality: battery replacement risk changes the math vs. a gas car
4. **Myth: Bundling home + auto isn't worth switching insurers** — reality: $150–$300/yr typical saving
5. **Myth: EV-specific insurance products are a gimmick** — reality: what Tesla Insurance and Rivian Insurance actually cover differently

### Guide 3 — EV insurance by state

- **slug:** `ev-insurance-by-state`
- **title:** "EV insurance costs by state: where you pay the most (and least)"
- **readTime:** 5 min read
- **category:** Ownership
- **description:** State-level EV insurance cost data, why rates vary so much by location, and how to use your state's data when shopping for coverage.

Sections:
1. **Why state matters so much** — regulation, repair cost density, weather claims, litigation rates
2. **Most expensive states** — MI, FL, LA, NY, NJ with data points and why each is high
3. **Cheapest states** — ME, VT, NH, ID, IA with data points
4. **What drives your state's rate beyond the average** — ZIP code, urban vs. rural, local repair shop density
5. **How to use state data when shopping** — directs to `/ev-insurance` InsuranceCostWidget for interactive state comparison

## Data source

Insurance figures come from `web/features/insurance/data.ts` (already used by `InsuranceCostWidget`). Guide 3 references the same data; no new data source needed.

## No new files

- No new routes
- No new components
- No schema changes
- Single file change: `web/features/guides/data.ts` (3 new entries appended to `GUIDES` array)
