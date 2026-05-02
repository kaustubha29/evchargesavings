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
| Analytics | — (GA4 pending setup) |

---

## Project structure

```
web/
├── app/
│   ├── layout.tsx              # Root layout, AdSense, Impact verification
│   ├── page.tsx                # Homepage (hero, calculator, all sections)
│   ├── ev-cost/[state]/        # State pages (/ev-cost/california etc.)
│   ├── guides/[slug]/          # Guide pages — 22 comprehensive guides
│   └── api/lead/route.ts       # Lead capture API (Supabase + Resend)
├── components/
│   ├── features/
│   │   ├── calculator/         # CalculatorShell — main interactive calculator
│   │   ├── ev-data/            # EV + gas vehicle repository + types
│   │   ├── location/           # ZIP → state detection, LocationDetector
│   │   └── networks/           # PublicChargingSection (PlugShare, ABRP)
│   └── shared/
│       ├── SavingsSlot.tsx     # Animated slot machine (hero right column)
│       ├── HomeChargerProducts.tsx   # Level 2 charger + adapter affiliate grid
│       ├── EVInsuranceCTA.tsx        # Insurance comparison affiliate section
│       ├── ChargingNetworkReferrals.tsx  # ChargePoint + JuiceBox referral cards
│       ├── LeadCaptureBox.tsx  # Email + ZIP form → installer quote flow
│       ├── StickySavingsBar.tsx
│       ├── StatCard.tsx
│       ├── FeelGoodFact.tsx
│       └── SiteFooter.tsx
├── features/
│   ├── ev-data/                # EV models, gas vehicles, efficiency data (130+ EVs)
│   ├── guides/                 # 22 guides covering EV buying, charging, savings, myths
│   └── location/               # ZIP→state map, state electricity/gas rates
├── store/
│   └── calculator.ts           # Zustand store, computeSavings, computeCO2
└── lib/
    └── format.ts               # fmt.money0, fmt.cents1, fmt.pct0, fmt.lbs
```

### Latest guides added (May 2026)
- **Most Affordable EVs 2026** — Budget EV recommendations under $40K with TCO focus
- **EV Range Myths Debunked** — Addresses range anxiety with real-world facts and myths
- **22 total guides** covering: buying decisions, charging setup, tax credits, road trips, winter driving, used EVs, maintenance costs, lease vs buy, apartment charging, and more

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
| Google AdSense | Pending approval | Layout + ad slot divs in page.tsx |
| Amazon Associates — chargers + adapters | Active links | `HomeChargerProducts.tsx` |
| Lead gen — installer quotes | Capturing to Supabase | `LeadCaptureBox.tsx` + `/api/lead` |

### Affiliate programs to complete (URLs are placeholders until approved)
| Program | Platform | Replace in file |
|---|---|---|
| The Zebra (insurance) | Impact | `EVInsuranceCTA.tsx` line 11 |
| Insurify (insurance) | CJ Affiliate | `EVInsuranceCTA.tsx` line 18 |
| Jerry (insurance) | Impact | `EVInsuranceCTA.tsx` line 25 |
| ChargePoint (hardware) | CJ Affiliate | `ChargingNetworkReferrals.tsx` line 13 |
| JuiceBox / Enel X | Direct (email partners@enelxway.com) | `ChargingNetworkReferrals.tsx` line 24 |

### Revenue model
1. **Display ads** — AdSense → Mediavine once 50K sessions/month
2. **Affiliate commissions** — charger hardware (~$40/sale), insurance leads ($20–50/lead)
3. **Installer lead gen** — connect ZIP + email leads to local electricians ($50–150/lead)
4. **Charging network hardware referrals** — ChargePoint, JuiceBox

---

## Remaining work

### Immediate (blocking revenue)
- [ ] Fix bare domain DNS: add A record `@` → `76.76.21.21` in domain registrar
- [ ] Verify domain on Impact affiliate platform
- [ ] Get affiliate tracking URLs from Impact (The Zebra, Jerry) + CJ (Insurify, ChargePoint)
- [ ] Replace placeholder URLs in `EVInsuranceCTA.tsx` and `ChargingNetworkReferrals.tsx`
- [ ] Set up GA4 and add measurement ID to layout

### SEO / content
- [ ] Add `sitemap.xml` — Next.js `app/sitemap.ts` covering state + guide pages
- [ ] Add `/privacy` and `/terms` pages (required for AdSense approval)
- [ ] OG images for state pages (dynamic `opengraph-image.tsx`)
- [ ] Expand guide content — more long-tail articles for organic search

### Lead gen
- [ ] Email drip sequence — currently sends one confirmation email, then nothing
- [ ] Connect installer leads to a real platform (Thumbtack API, Angi, or direct broker)

### Nice to have
- [ ] More EV models (currently 130+; add new 2026 releases)
- [ ] Monthly rate update process (EIA + AAA data)
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
