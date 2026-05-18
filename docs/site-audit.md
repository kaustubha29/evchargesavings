# EV Charge Savings — Site Deep Audit

> Generated May 17, 2026 via full repo read. Reflects production state at that date.

---

## Quick Stats

| Metric | Count |
|---|---|
| EV models | 141 |
| Gas cars for comparison | 111 |
| Guides | 118 across 9 categories |
| News articles | 19 (auto-gen, growing) |
| Utility pages | 231 |
| Pre-built static pages | 700+ |
| App routes | 20 |
| API routes | 3 |

---

## Routes

| Route | Type | Notes |
|---|---|---|
| `/` | Root | Homepage — calculator, guides grid, sticky CTA |
| `/ev/[slug]` | Dynamic | 141 EV detail pages (generateStaticParams) |
| `/ev-cost/[state]` | Dynamic | 51 state calculator pages |
| `/cost-to-charge/[carSlug]/[stateSlug]` | Dynamic 2D | 300 prebuilt (20 EVs × 15 top states), dynamicParams=true for long-tail |
| `/compare/[comparison]` | Dynamic | 200 prebuilt (20 EVs × 10 gas cars) |
| `/guides/[slug]` | Dynamic | All 118 guides (generateStaticParams) |
| `/guides` | Index | Category grid |
| `/news/[slug]` | Dynamic | Auto-generated news (generateStaticParams from NEWS array) |
| `/news` | Index | Latest-first news listing |
| `/utility/[slug]` | Dynamic | 231 utility EV rate plan pages |
| `/ev-owner` | Static | Already-own-EV hub |
| `/ev-insurance` | Static | Insurance comparison CTA + widget |
| `/how-we-calculate` | Static | Methodology transparency |
| `/about` | Static | Author bio + Person schema |
| `/embed` | Static | Embeddable calculator (noindex) |
| `/embed-demo` | Static | Embed demo (noindex) |
| `/contact` | Static | Contact form |
| `/privacy` | Static | Privacy policy |
| `/terms` | Static | Terms of service |
| `/research` | Static | Research/data page |

---

## API Routes

### `POST /api/lead`
Lead capture → 7 affiliate networks in parallel.
- Input: name, email, phone, zip, sourcePage, intent[], isOwner
- Side effects (async via `after()`):
  1. Supabase insert → leads table
  2. Zippopotam.us → resolve ZIP to city
  3. Resend → user confirmation + owner notification emails
  4. Parallel network submissions: Modernize, HomeAdvisor, AutoWeb, EverQuote, QuoteWizard, MediaAlpha, The Zebra
  5. Supabase update → store network payout results
- Graceful fallback on any failure — returns 200 regardless

### `GET /api/rates`
Live electricity + gas rates per state.
- Query: `?state=CA` (or US for national average)
- Source: EIA API, 1h server cache, hardcoded fallback if EIA fails
- Returns: `{ state, kwhCents, gasDollar, gasPeriod, elecPeriod }`

### `POST /api/indexnow`
Ping Microsoft IndexNow for fast crawl of new/updated URLs.
- Builds ~300 top URLs if no `urls` param provided
- Optional auth: `x-indexnow-secret` header

---

## Feature Modules

| Module | Purpose |
|---|---|
| `ev-data/` | 141 EVs + 111 gas cars — efficiency, range, MSRP, tax credit status |
| `location/` | 50-state EIA rates, ZIP→state map (951 entries), 231 utilities with TOU info |
| `guides/` | 118 static guides in 9 categories — Buying, Finance, Charging, Installation, Savings, Ownership, Driving, Education, Policy |
| `news/` | NewsArticle array, auto-populated by daily-news.yml cron |
| `calculations/` | Pure functions: calculateSavings(), calculateCO2(), calculateBreakEven() |
| `insurance/` | State-by-state EV vs gas insurance cost deltas (~22% EV premium average) |
| `charging/` | Network recommender — ChargePoint, JuiceBox, PlugShare, ABRP referrals |
| `content/` | SEO title/description generators per route type |
| `recommendations/` | Directory exists, currently unused |

---

## Zustand Store (`calculator.ts`)

Persisted to localStorage as `ecs-calc-v2`.

**State:** evSlug, gasId, annualMiles, homePct, homeRateKwh, publicRateKwh, gasPriceDollar, stateCode, stateData, city, zip, isDetecting

**Derived:** computeSavings() → annualSavings, gasAnnualCost, evAnnualCost, savingsPct, breakEvenYear / computeCO2() → lbsCO2Saved, treeEquivalent

---

## Automation

**`.github/workflows/daily-news.yml`**
- Trigger: cron every 3 days at noon UTC + manual dispatch
- Runs `scripts/publish-news.js` — calls Claude API + web search
- Commits to `web/features/news/data.ts` if new article published
- Pings IndexNow after commit
- Env: `ANTHROPIC_API_KEY` from GitHub Secrets

---

## Monetization

- **Google AdSense:** ca-pub-6904215876470010
- **Lead gen:** 7 affiliate networks (charger + EV marketplace + insurance)
- **Affiliate sections:** HomeChargerProducts, EVMarketplaceAffiliates, EVInsuranceCTA, ChargingNetworkReferrals

---

## SEO

- Metadata + OG images per route (dynamic image generation for ev, state, guide, news routes)
- Schema: NewsArticle, Person, FAQPage, Dataset, WebPage JSON-LD
- Sitemap + robots.txt
- IndexNow integration (key: `ccd656076fbc461f9a711d00e5945297`)
- Canonical URLs on all pages

---

## Known Issues & Gaps

| Issue | Severity | Notes |
|---|---|---|
| No error.tsx / error boundaries | Medium | Network failures (geolocation, EIA API) degrade silently |
| `/api/lead` has no rate limiting | Medium | IP abuse possible — add via Vercel KV or middleware |
| No CI test step | Low | vitest installed, 2 test files exist, but not run in Actions |
| `/features/recommendations/` unused | Low | Placeholder directory, no implementation |
| Compare route: IDs vs slugs naming | Low | Works but confusing — `TOP_EV_SLUGS` actually contains IDs |
| Supabase schema undocumented | Low | Leads table columns not documented in repo |

---

## Data Freshness

| Data | Source | Update cadence |
|---|---|---|
| EV models + pricing | EPA fueleconomy.gov + manual MSRP | Manual per new model |
| State electricity rates | EIA API (live) | Real-time, 1h cache |
| State gas prices | AAA weekly (live) | Real-time, 1h cache |
| Guides | Editorial (manual) | As needed |
| News | Claude AI + web search (auto) | Every 3 days via cron |
| Insurance cost deltas | Industry surveys (LendingTree, Forbes) | ~6 months |
| Utility TOU programs | Manual from utility websites | As needed |

---

## Production Readiness Summary

**Green:** Core calculator, static content, dynamic routes, lead capture, news automation, live rates, analytics, SEO, affiliate sections

**Yellow:** Error handling (graceful degradation but no explicit boundaries), test coverage (minimal), rate limiting on lead API

**Not built:** Recommendations feature, real-time Supabase news (uses file-based approach instead)
