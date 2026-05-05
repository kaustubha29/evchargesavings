# Cost-to-Charge Programmatic SEO Pages — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build 300 pre-rendered programmatic SEO pages at `/cost-to-charge/[carSlug]/[stateSlug]` showing EV charging cost vs comparable gas car cost in a specific state, with lead capture CTA.

**Architecture:** Four new/modified files. `comparable-gas.ts` maps EV slug → comparable gas vehicle ID. `seo.ts` gets a new `chargePageMeta` function. The page route at `app/cost-to-charge/[carSlug]/[stateSlug]/page.tsx` pre-builds 300 combos (top-20 EVs × 15 states) and enables ISR for the rest. `sitemap.ts` gets the 300 URLs added.

**Tech Stack:** Next.js 16 App Router, TypeScript, Tailwind CSS, vitest for unit tests. All data is static — no new API calls.

---

## File Map

| Action | File | Responsibility |
|---|---|---|
| Create | `web/features/ev-data/data/comparable-gas.ts` | EV slug → gas vehicle ID map + lookup |
| Create | `web/features/ev-data/data/comparable-gas.test.ts` | Unit tests for comparable-gas |
| Create | `web/features/content/seo.test.ts` | Unit tests for chargePageMeta |
| Modify | `web/features/content/seo.ts` | Add `chargePageMeta()` function |
| Create | `web/app/cost-to-charge/[carSlug]/[stateSlug]/page.tsx` | Route + full page component |
| Modify | `web/app/sitemap.ts` | Add 300 cost-to-charge URLs |

---

## Task 1: comparable-gas.ts

Maps EV slug → comparable gas vehicle ID. Falls back to segment, then to `toyota-rav4`.

**Files:**
- Create: `web/features/ev-data/data/comparable-gas.ts`
- Create: `web/features/ev-data/data/comparable-gas.test.ts`

- [ ] **Step 1: Write the failing test**

Create `web/features/ev-data/data/comparable-gas.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { getComparableGasId, getComparableGas } from "./comparable-gas";
import { GAS_MODELS } from "./gas-vehicles";

describe("getComparableGasId", () => {
  it("returns direct match for Tesla Model Y slug", () => {
    expect(getComparableGasId("tesla-model-y-long-range-awd", "suv")).toBe("toyota-rav4");
  });

  it("returns direct match for Rivian R1T slug", () => {
    expect(getComparableGasId("rivian-r1t-dual-motor", "truck")).toBe("ford-f150");
  });

  it("falls back to segment map for unknown slug", () => {
    expect(getComparableGasId("some-unknown-ev", "truck")).toBe("ford-f150");
    expect(getComparableGasId("some-unknown-ev", "sedan")).toBe("toyota-camry");
    expect(getComparableGasId("some-unknown-ev", "suv")).toBe("toyota-rav4");
  });

  it("falls back to toyota-rav4 for unknown slug and unknown segment", () => {
    expect(getComparableGasId("unknown-ev", "unknown-segment")).toBe("toyota-rav4");
  });
});

describe("getComparableGas", () => {
  it("returns a GasVehicle with positive mpg", () => {
    const gas = getComparableGas("tesla-model-y-long-range-awd", "suv");
    expect(gas.mpg).toBeGreaterThan(0);
    expect(gas.id).toBe("toyota-rav4");
  });

  it("returned vehicle exists in GAS_MODELS", () => {
    const gas = getComparableGas("chevrolet-bolt-ev", "sedan");
    expect(GAS_MODELS.some((g) => g.id === gas.id)).toBe(true);
  });

  it("never returns undefined — unknown slug falls back to toyota-rav4", () => {
    const gas = getComparableGas("does-not-exist", "does-not-exist");
    expect(gas).toBeDefined();
    expect(gas.id).toBe("toyota-rav4");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```
cd c:\Projects\evchargesavings\web && npx vitest run features/ev-data/data/comparable-gas.test.ts
```

Expected: FAIL — "Cannot find module './comparable-gas'"

- [ ] **Step 3: Write the implementation**

Create `web/features/ev-data/data/comparable-gas.ts`:

```ts
import type { GasVehicle } from "../types";
import { GAS_MODELS } from "./gas-vehicles";

const DIRECT: Record<string, string> = {
  "tesla-model-y-rwd":                      "toyota-rav4",
  "tesla-model-y-long-range-rwd":           "toyota-rav4",
  "tesla-model-y-long-range-awd":           "toyota-rav4",
  "tesla-model-y-performance":              "toyota-rav4",
  "tesla-model-3-rwd":                      "toyota-camry",
  "tesla-model-3-long-range-rwd":           "toyota-camry",
  "tesla-model-3-long-range-awd":           "toyota-camry",
  "tesla-model-3-performance":              "toyota-camry",
  "tesla-model-x-dual-motor":               "ford-explorer",
  "tesla-model-x-plaid":                    "ford-explorer",
  "tesla-model-s-dual-motor":               "bmw-3",
  "tesla-model-s-plaid":                    "bmw-3",
  "tesla-cybertruck-awd":                   "ford-f150",
  "tesla-cybertruck-cyberbeast":            "ford-f150",
  "chevrolet-bolt-ev":                      "honda-civic",
  "chevrolet-equinox-ev-lt-fwd":            "chevy-equinox",
  "chevrolet-equinox-ev-2rs-awd":           "chevy-equinox",
  "chevrolet-blazer-ev-lt-fwd":             "ford-explorer",
  "chevrolet-blazer-ev-rs-awd":             "ford-explorer",
  "chevrolet-blazer-ev-ss-rwd":             "ford-explorer",
  "chevrolet-silverado-ev-work-truck":      "chevy-silverado",
  "chevrolet-silverado-ev-rst":             "chevy-silverado",
  "ford-mustang-mach-e-standard-rwd":       "toyota-rav4",
  "ford-mustang-mach-e-extended-rwd":       "toyota-rav4",
  "ford-mustang-mach-e-extended-awd":       "toyota-rav4",
  "ford-f-150-lightning-standard":          "ford-f150",
  "ford-f-150-lightning-extended":          "ford-f150",
  "rivian-r1t-dual-motor":                  "ford-f150",
  "rivian-r1t-quad-motor":                  "ford-f150",
  "rivian-r1t-performance":                 "ford-f150",
  "rivian-r1s-dual-motor":                  "ford-explorer",
  "rivian-r1s-quad-motor":                  "ford-explorer",
  "rivian-r2":                              "toyota-rav4",
  "kia-ev6-standard-range-rwd":             "honda-accord",
  "kia-ev6-long-range-rwd":                 "honda-accord",
  "kia-ev6-long-range-awd":                 "honda-accord",
  "kia-ev6-gt":                             "bmw-3",
  "kia-ev9-wind-rwd":                       "ford-explorer",
  "kia-ev9-gt-line-awd":                    "ford-explorer",
  "kia-ev3-standard-range":                 "honda-civic",
  "kia-niro-ev":                            "hyundai-tucson",
  "hyundai-ioniq-5-standard-range-rwd":     "toyota-rav4",
  "hyundai-ioniq-5-long-range-rwd":         "toyota-rav4",
  "hyundai-ioniq-5-long-range-awd":         "toyota-rav4",
  "hyundai-ioniq-5-n":                      "toyota-rav4",
  "hyundai-ioniq-6-long-range-rwd":         "toyota-camry",
  "hyundai-ioniq-6-long-range-awd":         "toyota-camry",
  "hyundai-ioniq-9-standard-awd":           "ford-explorer",
  "hyundai-kona-electric":                  "hyundai-tucson",
  "volkswagen-id4-standard-range-rwd":      "toyota-rav4",
  "volkswagen-id4-pro-rwd":                 "toyota-rav4",
  "volkswagen-id4-pro-s-awd":               "toyota-rav4",
  "volkswagen-idbuzz-awd":                  "ford-explorer",
  "volkswagen-id7-pro":                     "toyota-camry",
  "audi-q4-e-tron-40-rwd":                  "audi-q5",
  "audi-q4-sportback-e-tron-50-awd":        "audi-q5",
  "audi-q6-e-tron-quattro":                 "audi-q5",
  "audi-q8-e-tron-55-awd":                  "bmw-x5",
  "audi-q8-sportback-e-tron-55":            "bmw-x5",
  "audi-sq8-e-tron-awd":                    "bmw-x5",
  "audi-e-tron-gt-quattro":                 "bmw-3",
  "bmw-i4-edrive35":                        "bmw-3",
  "bmw-i4-edrive40":                        "bmw-3",
  "bmw-i4-m50":                             "bmw-3",
  "bmw-i5-edrive40":                        "bmw-3",
  "bmw-i5-m60-xdrive":                      "bmw-3",
  "bmw-i7-xdrive60":                        "mercedes-glc",
  "bmw-i7-m70-xdrive":                      "mercedes-glc",
  "bmw-ix-xdrive40":                        "bmw-x5",
  "bmw-ix-xdrive50":                        "bmw-x5",
  "bmw-ix-m60":                             "bmw-x5",
  "bmw-ix1-xdrive30":                       "hyundai-tucson",
  "bmw-ix2-xdrive30":                       "hyundai-tucson",
  "mercedes-benz-eqb-300-4matic":           "mercedes-glc",
  "mercedes-benz-eqe-350-sedan":            "mercedes-glc",
  "mercedes-benz-eqe-500-4matic-sedan":     "mercedes-glc",
  "mercedes-benz-eqs-450-sedan":            "bmw-x5",
  "mercedes-benz-eqs-580-4matic-sedan":     "bmw-x5",
  "mercedes-benz-eqs-suv-450":              "bmw-x5",
  "mercedes-benz-g-580-eq-technology":      "jeep-grand-cherokee",
  "cadillac-lyriq-rwd":                     "bmw-x5",
  "cadillac-lyriq-awd":                     "bmw-x5",
  "cadillac-escalade-iq":                   "jeep-grand-cherokee",
  "cadillac-optiq-rwd":                     "audi-q5",
  "cadillac-vistiq-awd":                    "bmw-x5",
  "nissan-leaf-s-plus":                     "honda-civic",
  "nissan-leaf-sv-plus":                    "honda-civic",
  "nissan-ariya-fwd":                       "hyundai-tucson",
  "nissan-ariya-e-4orce-awd":               "hyundai-tucson",
  "subaru-solterra-fwd":                    "subaru-forester",
  "subaru-solterra-awd":                    "subaru-forester",
  "lucid-air-pure-rwd":                     "bmw-3",
  "lucid-air-grand-touring":                "bmw-3",
  "lucid-air-sapphire":                     "bmw-3",
  "gmc-hummer-ev-pickup":                   "chevy-silverado",
  "ram-1500-rev":                           "ram-1500",
};

const BY_SEGMENT: Record<string, string> = {
  sedan:    "toyota-camry",
  suv:      "toyota-rav4",
  truck:    "ford-f150",
  crossover:"toyota-rav4",
  van:      "ford-explorer",
  sports:   "bmw-3",
};

export function getComparableGasId(evSlug: string, segment: string): string {
  return DIRECT[evSlug] ?? BY_SEGMENT[segment] ?? "toyota-rav4";
}

export function getComparableGas(evSlug: string, segment: string): GasVehicle {
  const id = getComparableGasId(evSlug, segment);
  return GAS_MODELS.find((g) => g.id === id) ?? GAS_MODELS.find((g) => g.id === "toyota-rav4")!;
}
```

- [ ] **Step 4: Run test to verify it passes**

```
cd c:\Projects\evchargesavings\web && npx vitest run features/ev-data/data/comparable-gas.test.ts
```

Expected: PASS — all 6 tests green

- [ ] **Step 5: Commit**

```
cd c:\Projects\evchargesavings && git add web/features/ev-data/data/comparable-gas.ts web/features/ev-data/data/comparable-gas.test.ts
git commit -m "feat: add comparable-gas lookup for cost-to-charge pages"
```

---

## Task 2: chargePageMeta in seo.ts

**Files:**
- Modify: `web/features/content/seo.ts`
- Create: `web/features/content/seo.test.ts`

- [ ] **Step 1: Write the failing test**

Create `web/features/content/seo.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { chargePageMeta } from "./seo";
import type { EVModel } from "../ev-data/types";
import type { StateData } from "../location/types";

const mockEv: EVModel = {
  id: "t-my-lr-awd",
  slug: "tesla-model-y-long-range-awd",
  brand: "Tesla",
  name: "Model Y Long Range AWD",
  fullName: "Tesla Model Y Long Range AWD",
  modelYear: 2026,
  battery: 75,
  efficiency: 3.6,
  range: 320,
  msrp: 50990,
  connector: "NACS",
  segment: "suv",
  federalTaxCredit: 7500,
};

const mockState: StateData = {
  code: "OR",
  name: "Oregon",
  slug: "oregon",
  kwhCents: 13.2,
  gasDollar: 3.95,
  hasTOU: true,
};

describe("chargePageMeta", () => {
  it("title includes EV full name, state name, and year", () => {
    const { title } = chargePageMeta(mockEv, mockState, 48, 1008);
    expect(title).toBe("Cost to Charge Tesla Model Y Long Range AWD in Oregon (2026)");
  });

  it("description includes monthly cost rounded to nearest dollar", () => {
    const { description } = chargePageMeta(mockEv, mockState, 48, 1008);
    expect(description).toContain("$48");
  });

  it("description includes state name", () => {
    const { description } = chargePageMeta(mockEv, mockState, 48, 1008);
    expect(description).toContain("Oregon");
  });

  it("description includes annual savings rounded to nearest dollar", () => {
    const { description } = chargePageMeta(mockEv, mockState, 48, 1008);
    expect(description).toContain("$1,008");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```
cd c:\Projects\evchargesavings\web && npx vitest run features/content/seo.test.ts
```

Expected: FAIL — "chargePageMeta is not a function" (or not exported)

- [ ] **Step 3: Add chargePageMeta to seo.ts**

Open `web/features/content/seo.ts` and append after the existing `comparePageMeta` function:

```ts
export function chargePageMeta(
  ev: EVModel,
  state: StateData,
  monthlyCost: number,
  annualSavings: number,
) {
  const title = `Cost to Charge ${ev.fullName} in ${state.name} (2026)`;
  const description =
    `Charging a ${ev.fullName} in ${state.name} costs ~$${Math.round(monthlyCost)}/mo. ` +
    `See how it compares to a comparable gas car — save $${Math.round(annualSavings).toLocaleString()}/year.`;
  return { title, description };
}
```

The final `seo.ts` will be:

```ts
import type { StateData } from "@/features/location/types";
import type { EVModel } from "@/features/ev-data/types";

export function statePageMeta(state: StateData) {
  const title = `EV Savings in ${state.name} (2026) — Real Electricity & Gas Rates`;
  const description =
    `Electricity costs ${state.kwhCents.toFixed(1)}¢/kWh and gas runs ` +
    `$${state.gasDollar.toFixed(2)}/gal in ${state.name}. ` +
    `Calculate exactly what you'd save switching to an EV.`;
  return { title, description };
}

export function evPageMeta(ev: EVModel) {
  const title = `${ev.fullName} Charging Cost (2026) | EV Savings Calculator`;
  const description =
    `The ${ev.fullName} gets ${ev.efficiency} mi/kWh EPA and has ${ev.range} mi range. ` +
    `See how much you'd save vs gas in your state.`;
  return { title, description };
}

export function comparePageMeta(evName: string, gasName: string) {
  const title = `${evName} vs ${gasName} — EV vs Gas Cost Comparison (2026)`;
  const description =
    `Side-by-side fuel cost comparison: ${evName} vs ${gasName}. ` +
    `See annual savings, break-even timeline, and CO₂ impact.`;
  return { title, description };
}

export function chargePageMeta(
  ev: EVModel,
  state: StateData,
  monthlyCost: number,
  annualSavings: number,
) {
  const title = `Cost to Charge ${ev.fullName} in ${state.name} (2026)`;
  const description =
    `Charging a ${ev.fullName} in ${state.name} costs ~$${Math.round(monthlyCost)}/mo. ` +
    `See how it compares to a comparable gas car — save $${Math.round(annualSavings).toLocaleString()}/year.`;
  return { title, description };
}
```

- [ ] **Step 4: Run test to verify it passes**

```
cd c:\Projects\evchargesavings\web && npx vitest run features/content/seo.test.ts
```

Expected: PASS — all 4 tests green

- [ ] **Step 5: Commit**

```
cd c:\Projects\evchargesavings && git add web/features/content/seo.ts web/features/content/seo.test.ts
git commit -m "feat: add chargePageMeta to seo.ts"
```

---

## Task 3: Create the page route

**Files:**
- Create: `web/app/cost-to-charge/[carSlug]/[stateSlug]/page.tsx`

- [ ] **Step 1: Create directory**

```
mkdir "c:\Projects\evchargesavings\web\app\cost-to-charge\[carSlug]\[stateSlug]"
```

- [ ] **Step 2: Create page.tsx**

Create `web/app/cost-to-charge/[carSlug]/[stateSlug]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { evRepository } from "@/features/ev-data/repository";
import { getStateBySlug } from "@/features/location/queries";
import { calculateSavings } from "@/features/calculations/savings";
import { getComparableGas } from "@/features/ev-data/data/comparable-gas";
import { chargePageMeta } from "@/features/content/seo";
import { LeadCaptureBox } from "@/components/shared/LeadCaptureBox";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { fmt } from "@/lib/format";

export const revalidate = 86400;
export const dynamicParams = true;

const TOP_EV_SLUGS = [
  "tesla-model-y-long-range-awd",
  "tesla-model-3-long-range-rwd",
  "tesla-model-x-dual-motor",
  "tesla-model-s-dual-motor",
  "chevrolet-bolt-ev",
  "ford-mustang-mach-e-standard-rwd",
  "rivian-r1t-dual-motor",
  "rivian-r1s-dual-motor",
  "kia-ev6-long-range-rwd",
  "hyundai-ioniq-5-long-range-rwd",
  "hyundai-ioniq-6-long-range-rwd",
  "volkswagen-id4-pro-rwd",
  "audi-q4-e-tron-40-rwd",
  "bmw-ix-xdrive40",
  "lucid-air-pure-rwd",
  "nissan-leaf-s-plus",
  "chevrolet-silverado-ev-work-truck",
  "cadillac-lyriq-rwd",
  "mercedes-benz-eqb-300-4matic",
  "subaru-solterra-fwd",
];

const TOP_STATE_SLUGS = [
  "california",
  "texas",
  "florida",
  "washington",
  "oregon",
  "new-york",
  "colorado",
  "arizona",
  "georgia",
  "virginia",
  "new-jersey",
  "north-carolina",
  "illinois",
  "massachusetts",
  "minnesota",
];

const MONTHLY_MILES = 1000;
const ANNUAL_MILES  = MONTHLY_MILES * 12;
const HOME_PCT      = 80;

interface Props {
  params: Promise<{ carSlug: string; stateSlug: string }>;
}

export function generateStaticParams() {
  return TOP_EV_SLUGS.flatMap((carSlug) =>
    TOP_STATE_SLUGS.map((stateSlug) => ({ carSlug, stateSlug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { carSlug, stateSlug } = await params;
  const ev    = evRepository.getBySlug(carSlug);
  const state = getStateBySlug(stateSlug);
  if (!ev || !state) return {};

  const gas     = getComparableGas(carSlug, ev.segment);
  const savings = calculateSavings({
    evEfficiency:   ev.efficiency,
    gasMpg:         gas.mpg,
    annualMiles:    ANNUAL_MILES,
    homePct:        HOME_PCT,
    homeRateKwh:    state.kwhCents,
    publicRateKwh:  state.kwhCents * 2.5,
    gasPriceDollar: state.gasDollar,
  });

  const { title, description } = chargePageMeta(
    ev,
    state,
    savings.evAnnualCost / 12,
    savings.annualSavings,
  );

  return {
    title,
    description,
    alternates: { canonical: `/cost-to-charge/${carSlug}/${stateSlug}` },
    openGraph: { title, description, url: `/cost-to-charge/${carSlug}/${stateSlug}` },
  };
}

export default async function CostToChargePage({ params }: Props) {
  const { carSlug, stateSlug } = await params;

  const ev    = evRepository.getBySlug(carSlug);
  const state = getStateBySlug(stateSlug);
  if (!ev || !state) notFound();

  const gas     = getComparableGas(carSlug, ev.segment);
  const savings = calculateSavings({
    evEfficiency:   ev.efficiency,
    gasMpg:         gas.mpg,
    annualMiles:    ANNUAL_MILES,
    homePct:        HOME_PCT,
    homeRateKwh:    state.kwhCents,
    publicRateKwh:  state.kwhCents * 2.5,
    gasPriceDollar: state.gasDollar,
  });

  const fullChargeCost = ev.battery * (state.kwhCents / 100);
  const costPerMile    = (state.kwhCents / 100) / ev.efficiency;
  const monthlyEV      = savings.evAnnualCost / 12;
  const monthlyGas     = savings.gasAnnualCost / 12;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Cost to Charge ${ev.fullName} in ${state.name} (2026)`,
    description: chargePageMeta(ev, state, monthlyEV, savings.annualSavings).description,
    url: `https://evchargesavings.com/cost-to-charge/${carSlug}/${stateSlug}`,
    mainEntity: {
      "@type": "Dataset",
      name: `${ev.fullName} Charging Cost in ${state.name} 2026`,
      variableMeasured: [
        { "@type": "PropertyValue", name: "Monthly EV cost",        value: fmt.money0(monthlyEV) },
        { "@type": "PropertyValue", name: "Monthly gas equivalent", value: fmt.money0(monthlyGas) },
        { "@type": "PropertyValue", name: "Annual savings",         value: fmt.money0(savings.annualSavings) },
        { "@type": "PropertyValue", name: "Electricity rate",       value: `${state.kwhCents}¢/kWh` },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main>
        {/* Hero */}
        <section className="bg-paper border-b border-line py-14 md:py-20">
          <div className="section-wrap">
            <div className="inline-flex items-center gap-2 bg-good-bg text-good-fg font-mono text-xs px-3.5 py-1.5 rounded-full border border-good-fg/15 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
              {state.name} · {fmt.cents1(state.kwhCents)}/kWh
            </div>
            <h1 className="font-serif text-4xl md:text-6xl font-medium tracking-tight text-ink mb-4 max-w-3xl leading-[1.05]">
              Cost to Charge{" "}
              <em className="italic text-forest">{ev.fullName}</em>{" "}
              in {state.name}
            </h1>
            <p className="text-ink-3 text-lg max-w-xl leading-relaxed mb-8">
              <b className="text-forest">{fmt.money0(monthlyEV)}/month</b> to charge at home —{" "}
              vs <b className="text-ink">{fmt.money0(monthlyGas)}/month</b> for a {gas.name} on gas.{" "}
              You save roughly <b className="text-forest">{fmt.money0(savings.annualSavings)}/year</b> by going electric.
            </p>

            {/* Key stat cards */}
            <div className="flex flex-wrap gap-4">
              {[
                { label: "Monthly EV cost",        val: fmt.money0(monthlyEV),                accent: true },
                { label: `Monthly ${gas.name}`,    val: fmt.money0(monthlyGas) },
                { label: "Annual savings",          val: fmt.money0(savings.annualSavings),    accent: true },
                { label: "5-year savings",          val: fmt.money0(savings.fiveYearSavings) },
              ].map((s) => (
                <div
                  key={s.label}
                  className={`rounded-xl px-4 py-3 text-sm border ${
                    s.accent
                      ? "bg-good-bg border-good-fg/20 text-good-fg"
                      : "bg-paper border-line"
                  }`}
                >
                  <div className={`font-serif text-lg font-medium ${s.accent ? "text-good-fg" : "text-forest"}`}>
                    {s.val}
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-widest opacity-60">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 1 — Charging breakdown */}
        <section className="py-12 border-b border-line">
          <div className="section-wrap">
            <h2 className="font-serif text-2xl font-medium tracking-tight mb-2">
              Charging breakdown
            </h2>
            <p className="text-ink-3 text-sm mb-6">
              Based on {state.name} avg {fmt.cents1(state.kwhCents)}/kWh · {ev.battery} kWh battery · {ev.efficiency} mi/kWh
              {state.hasTOU && state.touCents && (
                <span> · TOU off-peak as low as {fmt.cents1(state.touCents)}/kWh</span>
              )}
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <tbody>
                  {[
                    { label: "Full charge cost",             val: fmt.money2(fullChargeCost) },
                    { label: "Cost per mile",                val: `$${costPerMile.toFixed(3)}/mi` },
                    { label: `Monthly cost (${MONTHLY_MILES.toLocaleString()} mi)`, val: fmt.money0(monthlyEV) },
                    { label: "Annual cost (home 80% / public 20%)", val: fmt.money0(savings.evAnnualCost) },
                  ].map((row) => (
                    <tr key={row.label} className="border-b border-line-soft">
                      <td className="py-3 pr-6 text-ink-2">{row.label}</td>
                      <td className="py-3 text-right font-mono font-semibold text-forest">{row.val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Section 2 — Gas comparison */}
        <section className="py-12 bg-paper border-b border-line">
          <div className="section-wrap">
            <h2 className="font-serif text-2xl font-medium tracking-tight mb-2">
              vs {gas.name} on gas
            </h2>
            <p className="text-ink-3 text-sm mb-6">
              Gas at {fmt.money2(state.gasDollar)}/gal · {gas.mpg} MPG · {MONTHLY_MILES.toLocaleString()} mi/month
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-line">
                    <th className="text-left font-mono text-[10px] uppercase tracking-widest text-ink-mute py-2 pr-6">Vehicle</th>
                    <th className="text-right font-mono text-[10px] uppercase tracking-widest text-ink-mute py-2 pr-6">Monthly</th>
                    <th className="text-right font-mono text-[10px] uppercase tracking-widest text-ink-mute py-2">Annual</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-line-soft">
                    <td className="py-3 pr-6 text-ink-2">{ev.name} (electric)</td>
                    <td className="py-3 pr-6 text-right font-mono font-semibold text-forest">{fmt.money0(monthlyEV)}</td>
                    <td className="py-3 text-right font-mono font-semibold text-forest">{fmt.money0(savings.evAnnualCost)}</td>
                  </tr>
                  <tr className="border-b border-line-soft">
                    <td className="py-3 pr-6 text-ink-2">{gas.name} (gas)</td>
                    <td className="py-3 pr-6 text-right font-mono text-ink-mute">{fmt.money0(monthlyGas)}</td>
                    <td className="py-3 text-right font-mono text-ink-mute">{fmt.money0(savings.gasAnnualCost)}</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-6 font-semibold text-ink">You save</td>
                    <td className="py-3 pr-6 text-right font-mono font-bold text-good-fg">{fmt.money0(savings.monthlySavings)}</td>
                    <td className="py-3 text-right font-mono font-bold text-good-fg">{fmt.money0(savings.annualSavings)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Section 3 — Variability callout */}
        <section className="py-10 border-b border-line">
          <div className="section-wrap">
            <h2 className="font-serif text-xl font-medium tracking-tight mb-4">Your savings may vary</h2>
            <ul className="space-y-3 text-sm text-ink-2">
              <li className="flex gap-3">
                <span className="text-ink-mute mt-0.5">—</span>
                <span>
                  Electricity rates vary by utility and ZIP in {state.name}.
                  {state.hasTOU && state.touCents && (
                    <> Time-of-use plans let you charge off-peak for as little as {fmt.cents1(state.touCents)}/kWh.</>
                  )}
                  {state.hasTOU && !state.touCents && (
                    <> Time-of-use plans are available in {state.name} — off-peak rates can cut charging costs significantly.</>
                  )}
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-ink-mute mt-0.5">—</span>
                <span>
                  Public charging (EA, ChargePoint, EVgo) costs 2–4× more — roughly{" "}
                  {fmt.money0(monthlyEV * 2.5)}–{fmt.money0(monthlyEV * 4)}/month at the same mileage.
                  Charging primarily at home keeps costs low.
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* Section 4 — CTA */}
        <section className="py-16">
          <div className="section-wrap max-w-xl">
            <h2 className="font-serif text-2xl font-medium tracking-tight mb-2">
              Get exact savings for your ZIP
            </h2>
            <p className="text-ink-3 text-sm mb-6">
              Find out what home charging actually costs at your address and get charger setup recommendations.
            </p>
            <LeadCaptureBox
              sourcePage={`/cost-to-charge/${carSlug}/${stateSlug}`}
              defaultIntent={["charger"]}
              heading="Get exact savings + charger setup for your home"
              description={`See your real cost to charge a ${ev.name} in ${state.name} based on your ZIP code.`}
              submitLabel="Get my savings estimate"
            />
          </div>
        </section>

        <SiteFooter />
      </main>
    </>
  );
}
```

- [ ] **Step 3: Commit**

```
cd c:\Projects\evchargesavings && git add "web/app/cost-to-charge"
git commit -m "feat: add cost-to-charge/[carSlug]/[stateSlug] page route"
```

---

## Task 4: Update sitemap

**Files:**
- Modify: `web/app/sitemap.ts`

- [ ] **Step 1: Add the cost-to-charge URL block**

Open `web/app/sitemap.ts`. Add the two constant arrays and the `chargeUrls` generation after the existing imports. Insert the constants before the `export default function sitemap()` line, and add `...chargeUrls` to the return array.

The updated file:

```ts
import type { MetadataRoute } from "next";
import { getAllStates } from "@/features/location/queries";
import { evRepository, gasRepository } from "@/features/ev-data/repository";
import { GUIDES } from "@/features/guides/data";

const BASE = "https://www.evchargesavings.com";
const NOW = new Date().toISOString();

const REAL_GAS_IDS = [
  "toyota-rav4", "toyota-camry",
  "honda-cr-v", "honda-civic", "honda-accord",
  "ford-f150", "ford-explorer",
  "chevy-silverado", "chevy-equinox",
  "hyundai-tucson", "hyundai-elantra",
  "jeep-grand-cherokee", "jeep-wrangler",
  "subaru-outback", "subaru-forester",
  "bmw-x5", "bmw-3",
  "mercedes-glc",
  "audi-q5",
  "ram-1500",
];

const TOP_CHARGE_EV_SLUGS = [
  "tesla-model-y-long-range-awd",
  "tesla-model-3-long-range-rwd",
  "tesla-model-x-dual-motor",
  "tesla-model-s-dual-motor",
  "chevrolet-bolt-ev",
  "ford-mustang-mach-e-standard-rwd",
  "rivian-r1t-dual-motor",
  "rivian-r1s-dual-motor",
  "kia-ev6-long-range-rwd",
  "hyundai-ioniq-5-long-range-rwd",
  "hyundai-ioniq-6-long-range-rwd",
  "volkswagen-id4-pro-rwd",
  "audi-q4-e-tron-40-rwd",
  "bmw-ix-xdrive40",
  "lucid-air-pure-rwd",
  "nissan-leaf-s-plus",
  "chevrolet-silverado-ev-work-truck",
  "cadillac-lyriq-rwd",
  "mercedes-benz-eqb-300-4matic",
  "subaru-solterra-fwd",
];

const TOP_CHARGE_STATE_SLUGS = [
  "california",
  "texas",
  "florida",
  "washington",
  "oregon",
  "new-york",
  "colorado",
  "arizona",
  "georgia",
  "virginia",
  "new-jersey",
  "north-carolina",
  "illinois",
  "massachusetts",
  "minnesota",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const states = getAllStates();
  const evs = evRepository.getSummaries();
  const allEvs = evRepository.getAll();
  const gases = gasRepository.getAll();

  const realGasIds = REAL_GAS_IDS.filter((id) => gases.find((g) => g.id === id));

  const stateUrls = states.map((s) => ({
    url: `${BASE}/ev-cost/${s.slug}`,
    lastModified: NOW,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const evUrls = evs.map((e) => ({
    url: `${BASE}/ev/${e.slug}`,
    lastModified: NOW,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const compareUrls: MetadataRoute.Sitemap = [];
  for (const ev of allEvs) {
    for (const gasId of realGasIds) {
      compareUrls.push({
        url: `${BASE}/compare/${ev.slug}-vs-${gasId}`,
        lastModified: NOW,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      });
    }
  }

  const guideUrls = GUIDES.map((g) => ({
    url: `${BASE}/guides/${g.slug}`,
    lastModified: NOW,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  const chargeUrls: MetadataRoute.Sitemap = TOP_CHARGE_EV_SLUGS.flatMap((car) =>
    TOP_CHARGE_STATE_SLUGS.map((state) => ({
      url: `${BASE}/cost-to-charge/${car}/${state}`,
      lastModified: NOW,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))
  );

  return [
    { url: BASE,                        lastModified: NOW, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/guides`,            lastModified: NOW, changeFrequency: "weekly",  priority: 0.85 },
    { url: `${BASE}/ev-insurance`,      lastModified: NOW, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/privacy`,           lastModified: NOW, changeFrequency: "yearly",  priority: 0.2 },
    { url: `${BASE}/terms`,             lastModified: NOW, changeFrequency: "yearly",  priority: 0.2 },
    ...guideUrls,
    ...stateUrls,
    ...evUrls,
    ...compareUrls,
    ...chargeUrls,
  ];
}
```

- [ ] **Step 2: Commit**

```
cd c:\Projects\evchargesavings && git add web/app/sitemap.ts
git commit -m "feat: add cost-to-charge URLs to sitemap"
```

---

## Task 5: Build verification

- [ ] **Step 1: Run full test suite**

```
cd c:\Projects\evchargesavings\web && npx vitest run
```

Expected: All tests pass. Fix any failures before continuing.

- [ ] **Step 2: Run TypeScript check**

```
cd c:\Projects\evchargesavings\web && npx tsc --noEmit
```

Expected: No errors. If errors appear, fix them — common causes:
- Missing import in page.tsx (check all `@/` paths exist)
- `getComparableGas` called with wrong arg count
- `LeadCaptureBox` prop name mismatch (check actual props in `web/components/shared/LeadCaptureBox.tsx` lines 18–26)

- [ ] **Step 3: Run build**

```
cd c:\Projects\evchargesavings\web && npm run build
```

Expected: Build completes. Watch for:
- "Page not found" warnings on TOP_EV_SLUGS that don't exist in evs.ts — fix by removing that slug from the list
- Any runtime errors in generateStaticParams output

- [ ] **Step 4: Spot-check one page in dev server**

```
cd c:\Projects\evchargesavings\web && npm run dev
```

Navigate to `http://localhost:3000/cost-to-charge/tesla-model-y-long-range-awd/oregon` in browser.

Verify:
- Hero shows correct monthly EV cost (~$48), monthly gas cost (~$132), annual savings (~$1,008)
- Charging breakdown table has 4 rows with non-zero numbers
- Gas comparison table shows correct EV vs RAV4 numbers
- Variability callout mentions Oregon's TOU rates (Oregon has `hasTOU: true`)
- LeadCaptureBox renders at the bottom

- [ ] **Step 5: Commit any build fixes, then final commit**

```
cd c:\Projects\evchargesavings && git add -A
git commit -m "fix: build verification fixes for cost-to-charge pages"
```

(Only commit if there were actual fixes. Skip if Step 2–3 passed clean.)

---

## EV Slug Reference

These are the exact slugs generated by `slugify(fullName)` in `evs.ts`. Use these exact strings anywhere you need to reference EVs:

| Slug | Model |
|---|---|
| `tesla-model-y-long-range-awd` | Tesla Model Y Long Range AWD |
| `tesla-model-3-long-range-rwd` | Tesla Model 3 Long Range RWD |
| `tesla-model-x-dual-motor` | Tesla Model X Dual Motor |
| `tesla-model-s-dual-motor` | Tesla Model S Dual Motor |
| `chevrolet-bolt-ev` | Chevrolet Bolt EV |
| `ford-mustang-mach-e-standard-rwd` | Ford Mustang Mach-E Standard RWD |
| `rivian-r1t-dual-motor` | Rivian R1T Dual-Motor |
| `rivian-r1s-dual-motor` | Rivian R1S Dual-Motor |
| `kia-ev6-long-range-rwd` | Kia EV6 Long Range RWD |
| `hyundai-ioniq-5-long-range-rwd` | Hyundai Ioniq 5 Long Range RWD |
| `hyundai-ioniq-6-long-range-rwd` | Hyundai Ioniq 6 Long Range RWD |
| `volkswagen-id4-pro-rwd` | Volkswagen ID.4 Pro RWD |
| `audi-q4-e-tron-40-rwd` | Audi Q4 e-tron 40 RWD |
| `bmw-ix-xdrive40` | BMW iX xDrive40 |
| `lucid-air-pure-rwd` | Lucid Air Pure RWD |
| `nissan-leaf-s-plus` | Nissan Leaf S Plus |
| `chevrolet-silverado-ev-work-truck` | Chevrolet Silverado EV Work Truck |
| `cadillac-lyriq-rwd` | Cadillac Lyriq RWD |
| `mercedes-benz-eqb-300-4matic` | Mercedes-Benz EQB 300 4MATIC |
| `subaru-solterra-fwd` | Subaru Solterra FWD |
