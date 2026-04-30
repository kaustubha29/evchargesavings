# EV Charge Savings

**evchargesavings.com** — Free, independent EV cost calculator for all 50 US states.

Compare the real cost of charging an EV at home vs public networks vs gasoline using live EIA electricity rates and AAA gas prices for your zip code.

## What's inside

- `index.html` — the entire site. Single file, no build step.

## Features

- **Zip-based geolocation** — IP detection on first load, 950-entry zip→state map, 30-day localStorage cache
- **30+ EV models + 23 gas cars** — real EPA specs (battery, efficiency, range)
- **All 50 states + DC** — EIA residential electricity rates + AAA monthly gas averages
- **Sliders** for miles/year and home/public charging split
- **TOU rate support** — off-peak/peak fields + off-peak usage slider
- **6 charging networks** — ranked by annual cost for your usage, with ratings, connectors, station counts
- **Live stat cards** — annual savings, monthly, 5-year, CO2 saved
- **Sticky save bar** — keeps your savings number visible as you scroll
- **Lead capture** — installer quote form (wire to Formspree or a Vercel function)
- **Ad slots** — AdSense placeholders ready to uncomment after approval
- **GA4 ready** — replace `G-XXXXXXXXXX` after setup

## Before going live

- [ ] Register `evchargesavings.com` on Porkbun (~$12/yr)
- [ ] Replace `G-XXXXXXXXXX` with your GA4 measurement ID
- [ ] Replace `ca-pub-XXXXXXXXXXXXXXXX` with your AdSense publisher ID (after approval)
- [ ] Wire lead form to Formspree endpoint or `/api/leads` Vercel function
- [ ] Add `/privacy` and `/terms` pages (required for AdSense)

## Deploy to Vercel

```bash
npm i -g vercel
vercel --prod
```

Then in Vercel dashboard: **Settings → Domains → Add → evchargesavings.com**

## Data sources

- **Electricity rates**: US EIA Form 826, Nov 2025 residential averages
- **Gas prices**: AAA monthly state averages (update monthly)
- **EV specs**: EPA fueleconomy.gov, 2024–2026 model years
- **Network rates**: Tesla, Electrify America, ChargePoint, EVgo public pricing pages

## Revenue model

1. Display ads (Google AdSense → Mediavine at 50K sessions/mo)
2. Affiliate commissions — charger hardware, EV insurance, used EV marketplaces
3. EVSE installer lead generation — pre-qualified zip+email leads
4. EV dealer referrals
5. Premium PDF savings report ($4.99, Stripe)

Target: **$10,000/mo within 9 months**.

## License

All rights reserved © 2026 EV Charge Savings.
