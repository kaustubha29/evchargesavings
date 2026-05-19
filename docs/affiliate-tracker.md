# EVChargeSavings — Affiliate & Partner Tracker

_Last updated: 2026-05-18_

## Status Key
✅ Live | 📧 Applied/Emailed | ⏳ To do | ❌ Rejected/Dead

---

## Active / In Progress

| Partner | Category | Payout | Network | Status |
|---|---|---|---|---|
| **Amazon Associates** | Accessories | 1–5% | Direct | ✅ Live + Creator Connections campaigns activated 2026-05-18 (content URLs submitted; EVIQO 10% CPA) |
| **Lectron EV** | Charger + adapters | 5–10% | Awin | ✅ Live — Level 2 + 2 adapters on ev-owner page |
| **The Zebra** | Insurance | $20/applicant | Direct (Fritz) | ✅ Deal confirmed — UTM link nudge to Fritz scheduled 2026-05-19 |
| **FlexOffers** | Network | Varies | Direct | ❌ Rejected — "does not meet current needs" |
| **Awin** | Network | Varies | Direct | ✅ Approved — Lectron live |
| **PartnerStack** | Network (B2B SaaS) | Varies | Direct | ✅ Applied — low priority, wrong vertical |
| **EverQuote** | Insurance | $8–20/lead | Direct | 📧 Emailed partners@everquote.com |
| **Jerry** | Insurance | — | Direct | 📧 Applied via jerry.ai/affiliate form |
| **Modernize** | Charger install | — | Direct | 📧 Emailed — awaiting response |
| **AutoWeb** | EV leads | — | Direct | 📧 Contact form submitted |
| **Autel EV Charger** | Charger hardware | 10% | Direct | 📧 Applied |
| **Carvana** | Used EVs | $2/action | Direct | 📧 Applied via partner form |

---

## To Do — High Priority

| Partner | Category | Payout | Network | Notes |
|---|---|---|---|---|
| **EnergySage** | Solar leads | $9.60/lead | Direct | FlexOffers dead — apply direct at energysage.com/partner |
| **Octopus Energy** | Utility / EV rates | $50/customer | Awin #67000 | 📧 Applied via Awin — awaiting approval |
| **Lenz Charging** | Charger hardware | 7% | Awin #108258 | 📧 Applied via Awin — awaiting approval |
| **Root Insurance** | Insurance | $15/lead | Awin/ShareASale | Usage-based = perfect EV fit. Apply via Awin. |
| **ATG Epower** | Charger + solar | 8% | Awin #107407 | ❌ Merchant not found — bad data, skip |
| **LightStream** | Auto loans | $60/funded loan | Impact | ❌ EVs excluded — only classics/specialty/older models. Dead end. |
| **Edmunds** | Auto leads | $10/new+used lead, $3.50/trade-in | CJ #1429390 | 📧 Followed up 2026-05-18 — pburrows@edmunds.com + edmunds@partnercentric.com |
| **OhmConnect** | Demand response | $20–40/signup | FlexOffers | ❌ Sovrn denied. Revisit via FlexOffers once approved. |
| **Emporia** | Charger hardware | Commission | Direct | ✅ Cade Brodbeck (VP BizDev) replied — call requested, calendar link sent |
| **Grizzl-E** | Charger hardware | — | — | ❌ No affiliate program exists |
| **Qmerit** | Charger install | $50–300/lead est. | Direct | 📧 Emailed info@qmerit.com — 2026-05-15 |
| **Sunrun** | Solar install | $50–150/lead est. | Direct | affiliates.ai.sunrun.com — direct pitch needed. |
| **EVANNEX** | Tesla accessories | ~5–10% | Rakuten | ⏳ Skip for now |

---

## To Do — Medium Priority

| Partner | Category | Payout | Network | Notes |
|---|---|---|---|---|
| **Insurify** | Insurance | $15/lead | CJ #5380944 | 📧 Followed up 2026-05-18 — strategicpartnerships@insurify.com |
| **CarGurus** | Auto leads | $3–4/lead | — | ❌ Dead end — not on CJ, publishers URL 404. Low CPL anyway, skip. |
| **The Zebra (Awin)** | Insurance | ~$2–3 CPL | Awin #21804 | Low CPL. Skip until traffic scales. |

---

## Rejected / Dead

| Partner | Reason |
|---|---|
| **Lemonade Auto** | Rejected — "not the right fit at this time" |
| **TrueCar** | No affiliate program — removed from CJ and FlexOffers |
| **HomeAdvisor** | Rejected — "category too small" |
| **Angi** | Rejected |
| **Impact Marketplace** | Rejected — traffic too low. Apply to brands directly instead. |
| **Metromile** | Dead — acquired by Lemonade 2022 |
| **SPAN affiliate** | Doesn't exist — B2B installer program only |
| **Ezoic** | Requires 250k MAU — not eligible |
| **JuiceBox / Enel X Way** | Company closed Oct 2024 |

---

## Analytics — Pending Setup

| Task | What | Where | Notes |
|---|---|---|---|
| **Microsoft Clarity** | Session recordings | clarity.microsoft.com | ✅ Live — project `wrvthpzoke` in layout.tsx |
| **Embeddable calculator widget** | Backlink acquisition | — | ✅ Live — /embed + /embed-demo (teaser + full modes, "Powered by" backlink) |
| **GA4 outbound_click custom dims** | See which affiliate links get clicked | analytics.google.com | ✅ Registered 2026-05-18 (link_domain / link_url / link_text, event-scoped). NOT retroactive — revisit ~2026-05-25 with a week of data: Explore → dim link_domain, metric Event count, filter event_name=outbound_click. Read affiliate CTR by domain (amzn vs awin vs cargurus). |
| **GA4 AI referrer exploration** | Track chatgpt/perplexity/gemini referrals | analytics.google.com | ⏳ Explore → Blank → Rows: session source/medium, filter: source contains chatgpt OR perplexity OR claude OR gemini. Save as "AI Traffic" |

---

## Live product pricing (roadmap)
Hardcoded prices removed 2026-05-18 — were stale (EVIQO $199 vs real $419) and violated Amazon Associates Operating Agreement (displayed prices must come from PA-API, refreshed ≤24h). Cards now say "Check price on Amazon →". To restore live prices:
- **Amazon PA-API 5.0** — the real fix. Gated: need 3 qualifying sales within 180 days of Associate approval (had 1 as of 2026-05-16). Revisit after more sales. Then server-fetch + ISR cache ≤24h. Data files still hold the old `price` strings for an easy swap.
- **Awin product feed** — free for approved merchants (Lectron). Can drive live Lectron charger/adapter prices NOW without the Amazon sales gate. Lower priority but available.
- **Keepa API** — paid, no sales gate; only if live Amazon prices wanted before PA-API eligibility.

## Next Actions (in order)
1. Apply Octopus Energy via Awin (already on platform, $50/customer, 2 min)
2. Apply Lenz Charging via Awin (#108258, 7%, charger hardware)
3. Apply ATG Epower via Awin (#107407, 8%, charger + solar)
4. Apply Root Insurance via Awin
5. Send OhmConnect pitch (already drafted)
6. Create CJ account → apply Edmunds
7. Create ShareASale account → apply Grizzl-E
8. Apply EVANNEX via Rakuten
9. Apply LightStream via Impact (direct, not marketplace)
