# EV Insurance Guides Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 3 insurance-focused guide entries to `web/features/guides/data.ts`, automatically rendering at `/guides/[slug]` with the existing `EVInsuranceCTA` affiliate block.

**Architecture:** All content is data — zero new files, zero new routes. Three `Guide` objects appended to the `GUIDES` array in `data.ts`. Category `"Ownership"` already maps to `EVInsuranceCTA` in `AffiliateSection`. The guides index and slug pages render them automatically.

**Tech Stack:** TypeScript, Next.js App Router (static generation via `generateStaticParams`), no new dependencies.

---

### Task 1: Add Guide 1 — "How to shop for EV insurance"

**Files:**
- Modify: `web/features/guides/data.ts:3325` (insert before closing `];`)

- [ ] **Step 1: Open `web/features/guides/data.ts` and locate the closing `];` of the `GUIDES` array at line 3326. Insert the following entry immediately before it (after the last `},`):**

```typescript
  {
    slug: "how-to-shop-ev-insurance",
    title: "How to shop for EV insurance (and actually save money)",
    hook: "Most EV owners overpay for insurance because they skip one step: getting a baseline quote before switching.",
    description: "A step-by-step comparison guide covering what to tell insurers, which carriers price EVs fairly, and what coverage EV owners actually need.",
    readTime: "6 min read",
    category: "Ownership",
    sections: [
      {
        heading: "Start with your current insurer",
        body: "Before shopping anywhere, call your existing insurer and get an exact quote for your EV. This is your baseline. Switching blind — going straight to a comparison site without knowing your current rate — means you can't tell a good deal from an average one. Your insurer may also offer a loyalty discount that makes staying competitive. Know the number first.",
      },
      {
        heading: "What to tell your insurer",
        body: "EV-specific inputs move the rate more than most drivers realize. Be ready to provide: annual mileage (EVs driven under 7,500 miles/yr often qualify for low-mileage discounts), where you charge overnight (home charging in a locked garage reduces comprehensive risk), and whether your EV has advanced driver-assistance systems (ADAS). ADAS features like automatic emergency braking can reduce collision premiums 5–15% depending on the carrier.",
        list: [
          "Annual mileage — low-mileage discounts start around 7,500 miles/yr",
          "Primary overnight charging location — garage vs. street matters",
          "ADAS features — automatic emergency braking, lane-keep assist",
          "VIN number — insurers need exact trim to price battery replacement risk",
        ],
      },
      {
        heading: "Which carriers are EV-friendly",
        body: "Not every insurer has caught up to EV claims data. Carriers that write a lot of EV policies have better actuarial models and tend to price more competitively. Progressive and GEICO consistently rank among the lowest-rate carriers for popular EVs like the Model Y and Ioniq 6. Tesla Insurance (available in 12+ states) uses real-time driving data and prices well for careful drivers. Nationwide offers an OEM parts guarantee important for EV battery components. Avoid carriers with thin EV books — they price in uncertainty.",
        list: [
          "Progressive — strong EV pricing, widely available",
          "GEICO — competitive base rates, straightforward bundling",
          "Tesla Insurance — usage-based, low rates for safe drivers, Tesla vehicles only",
          "Nationwide — OEM parts guarantee covers battery and charging components",
          "Avoid: small regional carriers with no stated EV claims experience",
        ],
      },
      {
        heading: "What coverage EV owners actually need",
        body: "Standard liability + comprehensive + collision covers the basics, but EV owners should look at three additional items. Gap coverage matters more for EVs because they depreciate faster in the first two years — if your EV is totaled, gap coverage pays the difference between the insurance payout and what you still owe. Battery and charging equipment coverage is offered by some carriers and covers the charging cord and home EVSE unit. OEM parts clauses ensure battery replacements use manufacturer parts, not aftermarket — critical given how much battery cost varies.",
        list: [
          "Gap coverage — especially important in years 1–2 of EV ownership",
          "Battery/charging equipment rider — covers home EVSE unit (worth ~$500–$1,500)",
          "OEM parts clause — ensures manufacturer battery cells, not aftermarket",
        ],
      },
      {
        heading: "Red flags in EV policies",
        body: "Read the exclusions section before signing. Common EV-specific exclusions that catch owners off guard: battery degradation is almost never covered (that's a warranty issue, not insurance), some policies exclude damage from third-party charging stations citing 'electrical surge' exclusions, and software-related damage (rare but real) is excluded by most carriers. Also check whether your policy covers a rental car if your EV is in a repair shop — EV repairs take longer on average, so rental duration limits matter more.",
        list: [
          "Battery degradation — excluded everywhere, covered by manufacturer warranty instead",
          "Third-party charger damage — check for 'electrical surge' exclusions",
          "Rental duration cap — EV repairs average 18 days vs 12 for gas; make sure rental coverage matches",
        ],
      },
      {
        heading: "The comparison checklist",
        body: "When you have quotes side-by-side, compare these six items — not just the annual premium. A quote that looks $200 cheaper can be worse value once you check deductibles and exclusions.",
        list: [
          "Annual premium (apples-to-apples: same deductibles, same liability limits)",
          "Collision deductible — $500 vs $1,000 changes premium $200–$400/yr",
          "OEM vs aftermarket parts policy",
          "Rental reimbursement limit (days + daily dollar cap)",
          "Gap coverage included or add-on cost",
          "Bundling discount if you add home/renters insurance",
        ],
      },
    ],
  },
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd web && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Verify the guide renders at the correct URL**

```bash
cd web && npx next build 2>&1 | grep -E "how-to-shop|error|Error"
```

Expected: `/guides/how-to-shop-ev-insurance` appears in the static routes output, no errors.

- [ ] **Step 4: Commit**

```bash
git add web/features/guides/data.ts
git commit -m "feat: add how-to-shop-ev-insurance guide"
```

---

### Task 2: Add Guide 2 — "EV insurance myths"

**Files:**
- Modify: `web/features/guides/data.ts` (insert after Guide 1 entry, before closing `];`)

- [ ] **Step 1: After the Guide 1 object (after its closing `},`), insert the following entry:**

```typescript
  {
    slug: "ev-insurance-myths",
    title: "5 EV insurance myths that cost drivers money",
    hook: "Believing any of these five myths will either leave you underinsured or make you overpay for years.",
    description: "Common misconceptions about EV insurance — and what's actually true — that cause owners to overpay or be underinsured.",
    readTime: "4 min read",
    category: "Ownership",
    sections: [
      {
        heading: "Myth 1: My existing insurer covers my EV the same way",
        body: "Reality: coverage terms for EVs vary significantly even within the same insurer's policies. A policy written for a gas car may not include charging equipment coverage, may use aftermarket battery parts, or may have electrical surge exclusions that apply to charging incidents. When you switch to an EV, call your insurer explicitly, confirm it's re-underwritten for your new vehicle, and ask for the EV-specific exclusions list. Don't assume a policy transfer is equivalent coverage.",
        list: [
          "Ask: does this policy cover my home EVSE charging unit?",
          "Ask: does collision coverage use OEM or aftermarket battery components?",
          "Ask: are there electrical surge exclusions that could affect charging damage claims?",
        ],
      },
      {
        heading: "Myth 2: EV insurance always costs more",
        body: "Reality: on average, EVs cost 15–22% more to insure than comparable gas cars — but that average hides enormous variation. Some carriers with strong EV claims books price popular models (Model Y, Ioniq 6, Bolt) at or below gas car equivalents. Tesla Insurance, available in 12+ states, uses real-time safety scores and prices well for careful drivers. If you've only gotten one quote, you may be paying the 'uninformed driver' premium. Shopping 3+ carriers is how you find the outliers.",
      },
      {
        heading: "Myth 3: Full coverage is overkill for an older EV",
        body: "Reality: the logic that works for gas cars — drop to liability-only once the car is worth less than ~10× your annual premium — breaks for EVs. A 5-year-old EV with 60,000 miles might be valued at $18,000, but its battery pack could cost $12,000–$18,000 to replace. If you're in an at-fault collision that totals the car, liability-only leaves you paying out of pocket for a battery that costs nearly as much as the car. Run the numbers on battery replacement cost specifically, not just vehicle market value.",
        list: [
          "Model Y battery replacement: ~$13,000–$16,000",
          "Chevy Bolt battery replacement: ~$16,000 (pre-2023 recall models)",
          "Nissan Leaf battery replacement: ~$8,500–$10,000",
          "Rule: if battery replacement cost > $8,000, keep comprehensive + collision",
        ],
      },
      {
        heading: "Myth 4: Bundling home and auto isn't worth switching insurers",
        body: "Reality: the multi-policy discount typically runs $150–$300/yr for home + auto. If your current insurer doesn't write both, or if you've never asked about the bundle rate explicitly, you're likely leaving money on the table. The friction of switching is real — about 90 minutes of paperwork — but a $250/yr saving compounds quickly. The best time to bundle is when you're already shopping EV insurance quotes, since you're already in the process.",
      },
      {
        heading: "Myth 5: EV-specific insurance products are a gimmick",
        body: "Reality: Tesla Insurance and Rivian Insurance are real products with meaningful differences from standard auto policies. Tesla Insurance uses a real-time Safety Score based on your actual driving — hard braking, aggressive cornering, following distance — and adjusts monthly premiums accordingly. Safe Tesla drivers in available states report 20–40% lower premiums than standard carriers. Rivian Insurance (available in select states) covers the vehicle, charging equipment, and roadside EV-specific assistance in one policy. These aren't gimmicks — they're vertically integrated products optimized for owners who stay within the ecosystem.",
        list: [
          "Tesla Insurance: Safety Score-based pricing, adjusts monthly, available in 12+ states",
          "Rivian Insurance: bundled EVSE coverage + roadside, select states",
          "Both require the manufacturer's app and data sharing — privacy tradeoff to consider",
        ],
      },
    ],
  },
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd web && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add web/features/guides/data.ts
git commit -m "feat: add ev-insurance-myths guide"
```

---

### Task 3: Add Guide 3 — "EV insurance by state"

**Files:**
- Modify: `web/features/guides/data.ts` (insert after Guide 2 entry, before closing `];`)

- [ ] **Step 1: After the Guide 2 object (after its closing `},`), insert the following entry:**

```typescript
  {
    slug: "ev-insurance-by-state",
    title: "EV insurance costs by state: where you pay the most (and least)",
    hook: "Michigan EV owners pay more than twice what Wyoming drivers pay. Your zip code matters as much as your driving record.",
    description: "State-level EV insurance cost data, why rates vary so much by location, and how to use your state's data when shopping for coverage.",
    readTime: "5 min read",
    category: "Ownership",
    sections: [
      {
        heading: "Why your state matters as much as your driving record",
        body: "Auto insurance is regulated state-by-state, and state law determines what insurers can and cannot use to set rates. Beyond regulation, four structural factors drive EV insurance costs at the state level: density of EV-certified repair shops (fewer shops = longer repair times = higher rental costs passed through to premiums), average cost of collision repairs in local labor markets, weather-related comprehensive claims (hail, flood, ice), and litigation rates — states with more auto injury lawsuits have systematically higher premiums across all vehicles.",
      },
      {
        heading: "Most expensive states for EV insurance",
        body: "Michigan tops every list at an average of $3,150/yr for EV owners — more than double the national EV average of $2,048. Michigan's no-fault insurance law requires unlimited lifetime medical benefits, which drives up every policy in the state regardless of vehicle type. Louisiana ($2,860/yr) and New York ($2,840/yr) follow, both driven by high litigation rates and dense urban repair markets. Florida ($2,580/yr) adds hurricane and flood exposure on top of litigation costs. Rhode Island ($2,620/yr) is the most expensive New England state, driven by high labor costs and a disproportionately large share of uninsured drivers.",
        list: [
          "Michigan: $3,150/yr EV avg (no-fault unlimited medical mandate)",
          "Louisiana: $2,860/yr (highest litigation rate in the US)",
          "New York: $2,840/yr (dense urban market, high repair labor costs)",
          "DC: $2,690/yr (urban density, high theft rates)",
          "Rhode Island: $2,620/yr (high uninsured driver rate)",
          "Florida: $2,580/yr (weather exposure + litigation)",
        ],
      },
      {
        heading: "Cheapest states for EV insurance",
        body: "Wyoming ($1,480/yr), North Dakota ($1,490/yr), and Iowa ($1,490/yr) consistently post the lowest EV insurance rates. All three share the same structural advantages: low population density means fewer accidents per mile driven, low labor costs reduce repair bills, minimal traffic litigation, and no major weather catastrophe exposure beyond hail (which is manageable with comprehensive coverage). Maine ($1,520/yr) and Idaho ($1,540/yr) follow for similar reasons. Vermont ($1,540/yr) is the cheapest New England state and one of the few cold-weather states that stays cheap — largely due to low uninsured driver rates and a strong no-fault regulatory environment.",
        list: [
          "Wyoming: $1,480/yr EV avg",
          "North Dakota: $1,490/yr",
          "Iowa: $1,490/yr",
          "Maine: $1,520/yr",
          "Idaho: $1,540/yr",
          "Vermont: $1,540/yr",
        ],
      },
      {
        heading: "What drives your rate beyond the state average",
        body: "State averages are a starting point — your actual rate is set at the ZIP code level. Urban ZIP codes within cheap states can exceed the state average by 30–50%. A driver in Des Moines, Iowa pays significantly more than a driver in rural Dubuque County, even though both are 'Iowa.' Factors that move your individual rate within a state: urban vs. rural (accident frequency, theft rates), ZIP code claims history (even if you've never filed a claim), distance to nearest EV-certified repair facility, and local medical cost index (what hospitals charge affects bodily injury payouts).",
        list: [
          "Urban ZIP codes typically run 20–50% above the state average",
          "Distance to nearest EV repair shop affects rental duration assumptions",
          "Your specific ZIP's claims history affects base rate before your driving record applies",
        ],
      },
      {
        heading: "How to use state data when shopping",
        body: "State averages tell you whether you're being overcharged relative to your market — not whether a specific quote is competitive. If Michigan quotes are clustering around $3,200 and you get one at $2,600, that's worth investigating (it may be a thin policy). If Iowa quotes are all coming in at $1,900 when the state average is $1,490, you have room to push back or shop harder. Use the interactive insurance cost calculator at /ev-insurance to see your state's EV vs gas insurance comparison, then use that baseline when you call carriers for quotes.",
        list: [
          "Get 3+ quotes before deciding — EV rate variance across carriers is 20–40% in most states",
          "Use /ev-insurance to see your state's EV vs gas insurance delta before calling carriers",
          "If your quotes exceed the state average by more than 15%, ask each insurer what's driving the difference",
        ],
      },
    ],
  },
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd web && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Verify all three guides appear in static build**

```bash
cd web && npx next build 2>&1 | grep -E "ev-insurance|guides"
```

Expected output includes:
```
/guides/how-to-shop-ev-insurance
/guides/ev-insurance-myths
/guides/ev-insurance-by-state
```

- [ ] **Step 4: Fix the `defaultIntent` bug on `/ev-insurance` page while here**

In `web/app/ev-insurance/page.tsx:120`, change:
```tsx
          defaultIntent={["ev"]}
```
to:
```tsx
          defaultIntent={["insurance"]}
```

- [ ] **Step 5: Commit**

```bash
git add web/features/guides/data.ts web/app/ev-insurance/page.tsx
git commit -m "feat: add ev-insurance-by-state guide, fix ev-insurance defaultIntent"
```

---

### Task 4: Smoke-test all three guides

**Files:** read-only verification

- [ ] **Step 1: Start dev server and verify each guide loads**

```bash
cd web && npx next dev
```

Visit and confirm each page loads without console errors:
- `http://localhost:3000/guides/how-to-shop-ev-insurance`
- `http://localhost:3000/guides/ev-insurance-myths`
- `http://localhost:3000/guides/ev-insurance-by-state`
- `http://localhost:3000/guides` (confirm all three appear in Ownership category)

- [ ] **Step 2: Confirm `EVInsuranceCTA` renders on each guide**

On each guide page, scroll to the bottom affiliate section. Confirm the EV Insurance CTA block is present (not blank, not a different affiliate block).

- [ ] **Step 3: Confirm no TypeScript errors in final state**

```bash
cd web && npx tsc --noEmit
```

Expected: no errors.
