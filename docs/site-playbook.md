# Site Build Playbook

Reusable blueprint distilled from evchargesavings.com. Use this to stand up a new content/calculator site with SEO, analytics, monetization, and content automation wired in. Each section: **what**, **why**, **how**, **where it lives**.

---

## 1. Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 16 (App Router) | RSC + `generateStaticParams` for programmatic SEO |
| UI | React 19, Tailwind 3 | `clsx` + `tailwind-merge` for class composition |
| State | Zustand 5 | Calculator inputs; lightweight, no boilerplate |
| Drawer/sheets | `vaul` | Mobile bottom-sheet |
| Lang | TypeScript 5 | Vercel runs `tsc` on build — **always `npm run build` before push** |
| Tests | Vitest 4 | (Installed; no CI test step yet — gap) |
| Host | Vercel | Auto-deploy on push to `main` |

`web/` is the Next app. `scripts/` holds the news bot. `docs/` holds trackers/pitch/this playbook.

---

## 2. Analytics (all in `web/app/layout.tsx`)

**Google Analytics 4** — `next/script` `afterInteractive`, two scripts (gtag loader + init with `gtag('config','G-XXXX')`).

**Outbound link tracking** — inline script: global click listener on `a[target="_blank"]`, fires `gtag('event','outbound_click', {link_url, link_domain, link_text})`. Lets you measure affiliate click-through in GA4. Free, no library.

**Microsoft Clarity** — session recordings + heatmaps. Snippet placed in `<head>` (not body) so site verifier finds it in static HTML. Project ID is the `"+i;` arg in the IIFE.

**Vercel Analytics + Speed Insights** — `<Analytics />` + `<SpeedInsights />` from `@vercel/analytics/next` and `@vercel/speed-insights/next`, rendered at end of `<body>`. Zero-config on Vercel.

GA4 setup task: build an Explore report filtering source contains chatgpt/perplexity/claude/gemini to track AI-referral traffic.

---

## 3. SEO

**IndexNow** (instant Bing/Yandex crawl ping):
- Generate a 32-char key. Host it at `https://host/<key>.txt` (file content = the key) in `web/public/`.
- Declare in `layout.tsx` metadata `other: { "indexnow-key": "<key>" }`.
- API route `web/app/api/indexnow/route.ts` — POSTs `{host,key,keyLocation,urlList}` to `https://api.indexnow.org/IndexNow`. Optional `INDEXNOW_SECRET` header gate. Has a `buildDefaultUrls()` fallback (static + top programmatic paths) so a bare POST re-pings the important pages.
- After shipping new pages: POST the new URLs (PowerShell `Invoke-WebRequest` or hit the route). 200 = accepted.

**Sitemap** — `web/app/sitemap.ts` exports `MetadataRoute.Sitemap`. Build URL arrays from the data repositories (states × EVs, guides, news, comparison pairs, price bands) and spread into one return array. Every programmatic route family gets its own loop. Add new route families here the moment they ship.

**Metadata + OG** — root `metadata` with title template `%s | Brand`, `metadataBase`, openGraph, twitter card. Per-route `generateMetadata` with `alternates.canonical`. Dynamic OG images via route `opengraph-image` handlers per template (ev/state/guide/news).

**Programmatic SEO pattern** — route `[param]/page.tsx`: `generateStaticParams()` returns the pre-built set; `dynamicParams = true` to allow on-demand long-tail (false to 404 anything off-list). Repository layer (`features/*/repository.ts`) is the single source for data + slug helpers.

**Verification meta tags** live in `layout.tsx` `metadata.other` / `<head>`: AdSense (`google-adsense-account`), IndexNow, FlexOffers (`fo-verify`), Impact (`impact-site-verification`).

`robots.txt` + `robots: { index:false }` only on `/embed` (intentional noindex).

---

## 4. Monetization

**AdSense** — async `adsbygoogle.js?client=ca-pub-XXXX` script in body + `google-adsense-account` meta for verification.

**Affiliate networks** (apply, then place links):
- **Amazon Associates** — tag in every link. **Creator Connections**: brands run boosted-rate campaigns; you must submit a content-URL (a page featuring the product) in each campaign dashboard to activate. Link format: `amazon.com/dp/<ASIN>?...&campaignId=...&tag=<tag>&linkId=...`. Watch campaign expiry dates.
- **Awin** — apply per-merchant. Link format: `awin1.com/cread.php?awinmid=<mid>&awinaffid=<aff>&ued=<encoded-dest>`. Usually higher CPL than Amazon for the same product (5–10% vs 3–4.5%) — prefer Awin where both exist; reserve Amazon for products the merchant doesn't list on Awin.
- **CJ / Impact / FlexOffers** — network verification meta tag required; apply to brands inside the network. Lead-gen (insurance, auto leads) pays per-lead, not per-sale.
- Keep a `docs/affiliate-tracker.md` (status table: ✅ live / 📧 applied / ⏳ todo / ❌ dead) so you stop re-chasing dead programs.

**Lead capture** — form (name/email/phone/zip/intent) → fan-out to affiliate lead networks + persist to **Supabase** + send confirmation via **Resend**. This is the highest-value monetization for in-market traffic; build it early.

Product cards: keep price/desc accurate — verify current prices, don't carry stale numbers from the old product when swapping links. Affiliate links need `rel="sponsored"` (and `noopener noreferrer` for `target="_blank"`).

---

## 5. Content automation (news bot)

`.github/workflows/daily-news.yml` — cron (`0 12 */3 * *`, every 3 days) + `workflow_dispatch`. Steps:
1. checkout, setup-node
2. `npm install` in `scripts/`
3. `node publish-news.js` with `ANTHROPIC_API_KEY` secret — generates an article, appends to `web/features/news/data.ts`, sets step outputs `published` / `slug`
4. if `published==true`: git config bot identity, add the data file, commit, `pull --rebase`, push

Push triggers Vercel redeploy → new article live. Optionally chain an IndexNow ping. Keep generation scoped to a topic allow-list to stay on-brand.

---

## 6. Utility rate data and sync

**What:** 15 utilities in `web/features/location/data/utilities.ts` with hardcoded TOU off-peak/on-peak rates, verified against each utility's official rate schedule.

**Why hardcoded:** Utility rate schedules change infrequently (1–2x/year) and URDB often lags 6–12 months. Hardcoded values are always verified correct; URDB is used as a change-detection signal only.

**Sync script:** `scripts/sync-rates.mjs` — runs against the NREL Utility Rate Database to flag rate changes.

```bash
OPENEI_API_KEY=<free key from openei.org/services/api/signup> node scripts/sync-rates.mjs
```

Output: comparison table (current vs URDB), suggested changes block if any utility drifted >1¢. Run quarterly. When URDB and the utility's own rate page disagree, trust the rate page.

**EIA IDs:** Each entry has the EIA utility ID. Look them up or verify at: https://openei.org/apps/USURDB/

**Adding a utility:**
1. Add entry to `UTILITIES` array in `utilities.ts` (slug, name, stateCode, TOU program, rates, windows)
2. Add matching entry to `sync-rates.mjs` UTILITIES array with EIA ID
3. Add to `STATE_DATA` `hasTOU: true` if the state isn't already flagged
4. Run build, test `TouRateSection` with a ZIP in that state

---

## 7. Data layer pattern

- `features/<domain>/data/*.ts` — raw typed records (EVs, gas cars, state rates).
- `features/<domain>/repository.ts` — query helpers (`getBySlug`, `getUnder`, `getSummaries`), slug generation. Pages + sitemap + metadata all read the repo, never the raw data directly. One slug function, used everywhere, prevents URL drift.
- State/region data: store real source values (EIA rates, gas prices) with a hardcoded fallback + short server cache when pulling from a live API.

---

## 8. New-site checklist

- [ ] Next 16 + TS + Tailwind scaffold; `npm run build` green
- [ ] Vercel project, custom domain, `<Analytics/>`+`<SpeedInsights/>`
- [ ] GA4 property + gtag + outbound-click script
- [ ] Microsoft Clarity project + head snippet
- [ ] IndexNow key file in `public/` + meta + `/api/indexnow` route
- [ ] `sitemap.ts` + `robots` + metadata template + OG image handlers
- [ ] Repository/data layer + slug helper before any programmatic route
- [ ] AdSense account + verification meta
- [ ] `docs/affiliate-tracker.md`; apply to Amazon/Awin/CJ early (approvals lag)
- [ ] Lead form → Supabase + Resend + lead networks
- [ ] News bot workflow + `ANTHROPIC_API_KEY` repo secret
- [ ] `docs/pitch.md` (short/medium/long copy) for outreach
- [ ] Pre-push gate: build locally; never push on red TS

---

## 9. Gotchas learned

- Vercel type-checks on build → local `npm run build` is mandatory before push.
- `Guide` vs `NewsArticle` types differ (news has `sources`, guides don't) — check the type before adding fields.
- Don't recommend dead products/programs — re-verify vendors (companies fold; programs exclude categories).
- When swapping an affiliate link, also fix the price/description — the new product is often a different tier.
- Creator Connections earn $0 until the content-URL is submitted per campaign — activation is a manual dashboard step, not just a link swap.
- Slugs come from the slugify of the full name — never hand-type a slug in sitemap/IndexNow; derive it from the repo.
