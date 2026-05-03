# EV Charge Savings

**[evchargesavings.com](https://www.evchargesavings.com)** — Free, independent EV savings calculator for all 50 US states + DC.

Pick your EV and current gas car, enter your ZIP, and see exactly how much you'd save on fuel — using live EIA electricity rates and AAA gas prices.

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 with custom design tokens |
| State | Zustand (`useCalculatorStore`) |
| Database | Supabase (lead capture) |
| Email | Resend (transactional) |
| Hosting | Vercel |
| Analytics | GA4 (`G-Y4V4NBZ0YY`) |

---

## Project structure

```
web/
├── app/
│   ├── layout.tsx              # Root layout, GA4, AdSense, Impact verification
│   ├── page.tsx                # Homepage — hero, calculator, top 25 guides (5×5), sections
│   ├── ev-cost/[state]/        # State pages (/ev-cost/california etc.)
│   ├── ev/[slug]/              # Individual EV detail pages
│   ├── compare/[comparison]/   # EV vs gas comparison pages (/compare/tesla-model-y-vs-toyota-rav4)
│   ├── guides/
│   │   ├── page.tsx            # Guides index — 80 guides grouped by category
│   │   └── [slug]/page.tsx     # Individual guide pages with affiliate sections
│   ├── networks/               # Charging network directory page
│   ├── privacy/                # Privacy policy
│   ├── terms/                  # Terms of service
│   ├── sitemap.ts              # Auto-generated sitemap (state + EV + compare + guide URLs)
│   └── robots.ts               # robots.txt
├── components/
│   ├── features/
│   │   ├── calculator/         # CalculatorShell — main interactive calculator
│   │   ├── location/           # ZIP → state detection, LocationDetector
│   │   └── networks/           # PublicChargingSection (PlugShare, ABRP)
│   └── shared/
│       ├── SavingsSlot.tsx           # Animated slot machine (hero right column)
│       ├── SavingsSlotBand.tsx       # Full-width slot band used across pages
│       ├── HomeChargerProducts.tsx   # Level 2 charger + adapter affiliate grid
│       ├── EVInsuranceCTA.tsx        # Insurance comparison affiliate section
│       ├── EVMarketplaceAffiliates.tsx  # Marketplace affiliate cards
│       ├── ChargingNetworkReferrals.tsx # ChargePoint + JuiceBox referral cards
│       ├── LeadCaptureBoxGate.tsx    # Email + ZIP form → installer quote flow
│       ├── StickySavingsBar.tsx      # Bottom sticky "get quotes" bar
│       ├── SiteFooter.tsx            # Site footer with guide links
│       └── StatCard.tsx
├── features/
│   ├── ev-data/                # EV models (130+), gas vehicles, efficiency data
│   ├── guides/
│   │   └── data.ts             # 80 guides across 8 categories (10 per category)
│   ├── calculations/           # savings, co2, break-even pure functions
│   ├── content/                # SEO metadata generators
│   └── location/               # ZIP → state map, state electricity/gas rates
├── store/
│   └── calculator.ts           # Zustand store, computeSavings, computeCO2
└── lib/
    └── format.ts               # fmt.money0, fmt.cents1, fmt.pct0, fmt.lbs
```

---

## Guides (80 total — 10 per category)

| Category | Count | Sample topics |
|---|---|---|
| Buying | 10 | Used vs new, families, towing, depreciation, test drive checklist |
| Finance | 10 | Federal tax credit, used EV credit, TCO, state rebates, business deduction |
| Installation | 10 | Level 2 setup, panel upgrade, smart charger, outdoor install, utility rebates |
| Driving | 10 | Hypermiling, highway efficiency, summer/winter, first week as owner |
| Savings | 10 | High-mileage savings, true cost vs gas, free charging, utility rate plans |
| Charging | 10 | How fast charging works, etiquette, overnight routine, DCFC vs L2 |
| Ownership | 10 | OTA updates, tire guide, service schedule, road trips, home value impact |
| Education | 10 | Battery chemistry, regen braking, V2G, NACS vs CCS, EV glossary |

All guides are static data in `web/features/guides/data.ts` — each with `slug`, `title`, `description`, `readTime`, `category`, and structured `sections[]`.

---

## Data sources

| Data | Source | Update frequency |
|---|---|---|
| State electricity rates | US EIA Form 826 | Annually (or when EIA publishes) |
| State gas prices | AAA monthly averages | Monthly |
| EV efficiency specs | EPA fueleconomy.gov | When new models added |
| ZIP → state mapping | USPS / public dataset (~950 entries) | Static |

---

## Environment variables

```env
SUPABASE_URL=                    # Supabase project URL
SUPABASE_SERVICE_ROLE_KEY=       # Supabase service role key (not anon)
RESEND_API_KEY=                  # Resend API key for transactional email
```

Set in Vercel → Project → Settings → Environment Variables.

---

## Monetization

### Live / integrated
| Stream | Status | Where |
|---|---|---|
| Google AdSense (`ca-pub-6904215876470010`) | Pending approval | Layout + ad slot divs in `page.tsx` |
| Amazon Associates — chargers + adapters | Active links | `HomeChargerProducts.tsx` |
| Lead gen — installer quotes | Capturing to Supabase | `LeadCaptureBoxGate.tsx` + `/api/lead` |
| Impact — affiliate verification | Meta tag live | `layout.tsx` |

### Affiliate programs to complete (URLs are placeholders until approved)
| Program | Platform | Replace in file |
|---|---|---|
| The Zebra (insurance) | Impact | `EVInsuranceCTA.tsx` |
| Insurify (insurance) | CJ Affiliate | `EVInsuranceCTA.tsx` |
| Jerry (insurance) | Impact | `EVInsuranceCTA.tsx` |
| ChargePoint (hardware) | CJ Affiliate | `ChargingNetworkReferrals.tsx` |
| JuiceBox / Enel X | Direct (partners@enelxway.com) | `ChargingNetworkReferrals.tsx` |

### Revenue model
1. **Display ads** — AdSense → Mediavine once 50K sessions/month
2. **Affiliate commissions** — charger hardware (~$40/sale), insurance leads ($20–50/lead)
3. **Installer lead gen** — connect ZIP + email leads to local electricians ($50–150/lead)
4. **Charging network hardware referrals** — ChargePoint, JuiceBox

---

## Remaining work

### Immediate (blocking revenue)
- [ ] Verify domain on Impact affiliate platform
- [ ] Get affiliate tracking URLs from Impact (The Zebra, Jerry) + CJ (Insurify, ChargePoint)
- [ ] Replace placeholder affiliate URLs in `EVInsuranceCTA.tsx` and `ChargingNetworkReferrals.tsx`

### Lead gen
- [ ] Email drip sequence — currently sends one confirmation email, then nothing
- [ ] Connect installer leads to a real platform (Thumbtack API, Angi, or direct broker)

### Nice to have
- [ ] More EV models (currently 130+; add new 2026 releases)
- [ ] Monthly rate update process (EIA + AAA data)
- [ ] OG images for state pages and guide pages (dynamic `opengraph-image.tsx`)
- [ ] A/B test hero headline variants
- [ ] Used EV marketplace affiliates (CarGurus, Cars.com, Carvana)

---

## Local development

```bash
cd web
npm install
npm run dev       # http://localhost:3000
```

## Deploy

Pushes to `main` auto-deploy via Vercel. No manual step needed.

---

## License

All rights reserved © 2026 EV Charge Savings.
