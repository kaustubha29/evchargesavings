import type { Metadata } from "next";
import { getAllStates } from "@/features/location/queries";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { StickySavingsBar } from "@/components/shared/StickySavingsBar";

const BASE = "https://www.evchargesavings.com";
const UPDATED = "May 2026";
const EIA_SOURCE = "U.S. Energy Information Administration (EIA) Form EIA-861, residential electricity rates, May 2026 actuals.";

export const metadata: Metadata = {
  title: "EV Charging Cost by State — 2026 Data | EVChargeSavings Research",
  description:
    "2026 EV charging cost data for all 50 US states. Residential electricity rates from EIA, annual home charging cost for a Tesla Model Y, and cost-per-mile by state. Free to cite with attribution.",
  alternates: { canonical: "/research" },
  openGraph: {
    title: "EV Charging Cost by State — 2026 Data",
    description: "50-state residential electricity rates and annual EV charging costs. Source: EIA May 2026 actuals.",
    url: "/research",
    type: "website",
  },
};

// Model Y LR AWD: 75kWh battery, 3.6 mi/kWh efficiency, 13,500 mi/yr typical
const MODEL_Y_KWH_PER_YEAR = 13500 / 3.6;

function annualCost(kwhCents: number) {
  return Math.round((MODEL_Y_KWH_PER_YEAR * kwhCents) / 100);
}

function costPerMile(kwhCents: number) {
  return ((kwhCents / 100) / 3.6).toFixed(3);
}

export default function ResearchPage() {
  const states = getAllStates();

  const cheapest = [...states].sort((a, b) => a.kwhCents - b.kwhCents).slice(0, 5);
  const mostExpensive = [...states].sort((a, b) => b.kwhCents - a.kwhCents).slice(0, 5);
  const nationalAvgKwh = Math.round(states.reduce((s, st) => s + st.kwhCents, 0) / states.length) / 100;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "2026 EV Charging Cost by State",
    description: "Residential electricity rates and annual home EV charging costs for all 50 US states, updated May 2026. Based on EIA Form EIA-861 residential rate data.",
    url: `${BASE}/research`,
    creator: { "@type": "Organization", name: "EV Charge Savings", url: BASE },
    dateModified: "2026-05-01",
    temporalCoverage: "2026",
    spatialCoverage: "United States",
    license: "https://creativecommons.org/licenses/by/4.0/",
    isBasedOn: "https://www.eia.gov/electricity/data/browser/",
    variableMeasured: [
      { "@type": "PropertyValue", name: "Residential electricity rate", unitText: "cents per kWh" },
      { "@type": "PropertyValue", name: "Annual EV charging cost (Tesla Model Y LR AWD)", unitText: "USD" },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <StickySavingsBar />
      <main className="bg-paper min-h-screen">

        {/* Hero */}
        <div className="bg-ink text-cream">
          <div className="section-wrap py-14 max-w-4xl">
            <div className="font-mono text-[10px] uppercase tracking-widest text-emerald mb-4">Research & Data</div>
            <h1 className="font-serif text-4xl md:text-5xl font-medium tracking-tight mb-4" style={{ lineHeight: 1.1 }}>
              EV Charging Cost by State — 2026
            </h1>
            <p className="text-cream/70 text-lg leading-relaxed max-w-2xl mb-6">
              Residential electricity rates and annual home EV charging costs for all 50 US states.
              Updated {UPDATED} using EIA actuals. Free to cite with attribution.
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              <a
                href="#data-table"
                className="px-4 py-2 rounded-xl bg-forest text-white border border-forest hover:bg-emerald transition-all font-medium"
              >
                Jump to data table ↓
              </a>
              <a
                href="#media"
                className="px-4 py-2 rounded-xl bg-transparent text-cream/80 border border-white/20 hover:border-white/50 transition-all font-medium"
              >
                Media inquiries
              </a>
            </div>
          </div>
        </div>

        <div className="section-wrap py-12 max-w-4xl">

          {/* Key findings */}
          <section className="mb-12">
            <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-5">Key findings — {UPDATED}</div>
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-cream-soft border border-line rounded-2xl p-5">
                <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-1">National average</div>
                <div className="font-serif text-3xl font-medium text-ink">{nationalAvgKwh.toFixed(2)}¢</div>
                <div className="text-xs text-ink-3 mt-1">per kWh, residential</div>
              </div>
              <div className="bg-cream-soft border border-line rounded-2xl p-5">
                <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-1">Cheapest state</div>
                <div className="font-serif text-3xl font-medium text-forest">{(cheapest[0].kwhCents / 100).toFixed(2)}¢</div>
                <div className="text-xs text-ink-3 mt-1">{cheapest[0].name} per kWh</div>
              </div>
              <div className="bg-cream-soft border border-line rounded-2xl p-5">
                <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-1">Most expensive</div>
                <div className="font-serif text-3xl font-medium text-rust">{(mostExpensive[0].kwhCents / 100).toFixed(2)}¢</div>
                <div className="text-xs text-ink-3 mt-1">{mostExpensive[0].name} per kWh</div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-3">5 cheapest states to charge</div>
                <div className="space-y-2">
                  {cheapest.map((s, i) => (
                    <div key={s.code} className="flex items-center justify-between py-2 border-b border-line-soft">
                      <span className="text-sm text-ink">{i + 1}. {s.name}</span>
                      <span className="font-mono text-sm text-forest font-medium">{(s.kwhCents / 100).toFixed(2)}¢/kWh</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-3">5 most expensive states</div>
                <div className="space-y-2">
                  {mostExpensive.map((s, i) => (
                    <div key={s.code} className="flex items-center justify-between py-2 border-b border-line-soft">
                      <span className="text-sm text-ink">{i + 1}. {s.name}</span>
                      <span className="font-mono text-sm text-rust font-medium">{(s.kwhCents / 100).toFixed(2)}¢/kWh</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Methodology note */}
          <section className="bg-cream-soft border border-line rounded-2xl p-6 mb-12">
            <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-3">Annual cost methodology</div>
            <p className="text-sm text-ink-3 leading-relaxed mb-2">
              Annual charging cost assumes a <strong className="text-ink">Tesla Model Y Long Range AWD</strong> (75 kWh battery, 3.6 mi/kWh EPA efficiency)
              driven <strong className="text-ink">13,500 miles/year</strong> (US average) charged 100% at home.
              Real-world cost varies by driving pattern, home vs public charging mix, and time-of-use rate enrollment.
            </p>
            <p className="text-sm text-ink-3 leading-relaxed">
              Formula: <span className="font-mono text-xs bg-cream-soft border border-line text-forest px-2 py-0.5 rounded">
                (13,500 ÷ 3.6) × (rate ÷ 100)
              </span>
            </p>
          </section>

          {/* Full data table */}
          <section id="data-table" className="mb-12">
            <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-5">
              All 50 states + DC — {UPDATED} EIA rates + NCSL EV registration fees
            </div>
            <div className="overflow-x-auto rounded-2xl border border-line">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-cream-soft border-b border-line">
                    <th className="text-left px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-ink-mute">State</th>
                    <th className="text-right px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-ink-mute">¢/kWh</th>
                    <th className="text-right px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-ink-mute">¢/mile</th>
                    <th className="text-right px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-ink-mute">Annual cost*</th>
                    <th className="text-right px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-ink-mute">Gas price</th>
                    <th className="text-right px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-ink-mute">EV reg. fee/yr†</th>
                  </tr>
                </thead>
                <tbody>
                  {states.map((s, i) => (
                    <tr key={s.code} className={`border-b border-line-soft hover:bg-cream-soft/50 transition-colors ${i % 2 === 0 ? "" : "bg-cream-soft/30"}`}>
                      <td className="px-4 py-2.5 font-medium text-ink">
                        <a href={`/ev-cost/${s.slug}`} className="hover:text-forest transition-colors">
                          {s.name}
                        </a>
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono text-sm text-ink-2">{(s.kwhCents / 100).toFixed(2)}¢</td>
                      <td className="px-4 py-2.5 text-right font-mono text-sm text-ink-2">{costPerMile(s.kwhCents)}¢</td>
                      <td className="px-4 py-2.5 text-right font-mono text-sm font-medium text-forest">${annualCost(s.kwhCents).toLocaleString()}</td>
                      <td className="px-4 py-2.5 text-right font-mono text-sm text-ink-3">${s.gasDollar.toFixed(2)}/gal</td>
                      <td className="px-4 py-2.5 text-right font-mono text-sm text-ink-2">{s.evFee > 0 ? `$${s.evFee}` : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-ink-mute mt-3">
              * Annual cost based on Tesla Model Y LR AWD, 13,500 mi/yr, 100% home charging.{" "}
              † Annual EV-specific registration surcharge (the fee EVs pay on top of base registration that all vehicles pay). Source: NCSL, verified May 2026 — several states index to inflation, confirm with your DMV.
            </p>
          </section>

          {/* Data sources */}
          <section className="mb-12">
            <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-5">Data sources</div>
            <div className="space-y-3">
              {[
                {
                  name: "EIA Form EIA-861 — Residential Electricity Rates",
                  url: "https://www.eia.gov/electricity/data/browser/",
                  note: "State-level residential electricity rates. Updated monthly. May 2026 actuals used in this dataset.",
                },
                {
                  name: "EIA Weekly Retail Gasoline Prices",
                  url: "https://www.eia.gov/petroleum/gasdiesel/",
                  note: "State-level regular unleaded gasoline prices. Updated weekly.",
                },
                {
                  name: "EPA Fuel Economy Data",
                  url: "https://www.fueleconomy.gov/feg/download.shtml",
                  note: "EPA-tested MPGe and kWh/100mi efficiency ratings for 130+ EV models.",
                },
                {
                  name: "NCSL — Special Registration Fees for Electric & Hybrid Vehicles",
                  url: "https://www.ncsl.org/transportation/special-registration-fees-for-electric-and-hybrid-vehicles",
                  note: "Annual state EV registration surcharge for all 50 states + DC. Verified May 2026. 41 states + DC charge a fee, ranging $50–$290 (median ~$138); several index to inflation.",
                },
              ].map((s) => (
                <div key={s.url} className="flex gap-4 py-3 border-b border-line-soft last:border-0">
                  <div>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="font-medium text-forest hover:underline text-sm">
                      {s.name}
                    </a>
                    <p className="text-ink-3 text-sm mt-0.5">{s.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Citation */}
          <section className="bg-cream-soft border border-line rounded-2xl p-6 mb-12">
            <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-3">How to cite this data</div>
            <p className="text-sm text-ink-3 leading-relaxed mb-3">
              Free to use with attribution. Suggested citation:
            </p>
            <div className="bg-ink text-cream rounded-xl px-5 py-4 font-mono text-xs leading-relaxed">
              EVChargeSavings. &ldquo;EV Charging Cost &amp; Registration Fees by State — 2026.&rdquo; {UPDATED}. evchargesavings.com/research. Source data: U.S. Energy Information Administration; National Conference of State Legislatures.
            </div>
          </section>

          {/* Embed widget */}
          <section id="embed" className="bg-cream-soft border border-line rounded-2xl p-6 mb-12">
            <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-3">Embed the calculator</div>
            <p className="text-sm text-ink-3 leading-relaxed mb-4 max-w-2xl">
              Free to embed on any site — blog posts, utility EV resources pages, dealership websites. Add a state param to pre-select your readers&rsquo; location. No API key, no account.
            </p>
            <a
              href="/embed-demo"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-forest text-white border border-forest hover:bg-emerald hover:border-emerald transition-all"
            >
              Get the embed code →
            </a>
            <p className="text-xs text-ink-mute mt-3">
              Live preview, state/EV pre-load options, and copy-paste snippets are on the{" "}
              <a href="/embed-demo" className="text-forest hover:underline">embed page</a>. Attribution link included automatically. For custom integrations or white-label options, email{" "}
              <a href="mailto:media@evchargesavings.com" className="text-forest hover:underline">media@evchargesavings.com</a>.
            </p>
          </section>

          {/* Media contact */}
          <section id="media" className="border border-forest/30 bg-forest/5 rounded-2xl p-6 mb-12">
            <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-3">Media & research inquiries</div>
            <p className="text-sm text-ink-3 leading-relaxed mb-4">
              Need state-specific data, custom queries, or a quote for an article? We respond within 24 hours.
            </p>
            <a
              href="mailto:media@evchargesavings.com"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-forest text-white border border-forest hover:bg-emerald transition-all"
            >
              media@evchargesavings.com →
            </a>
            <p className="text-xs text-ink-mute mt-3">
              Data is updated quarterly. Sign up below to receive the next update.
            </p>
          </section>

          {/* Calculator CTA */}
          <div className="bg-ink text-cream rounded-3xl p-8">
            <div className="font-mono text-[10px] uppercase tracking-widest text-emerald mb-3">Free calculator</div>
            <h3 className="font-serif text-2xl font-medium mb-2">Run the numbers for any EV + state</h3>
            <p className="text-cream/60 text-sm leading-relaxed mb-6 max-w-lg">
              Pick your EV and current gas car, choose your state — get annual fuel savings using this same EIA rate data.
            </p>
            <a
              href="/#calculator"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-forest text-white border border-forest hover:bg-emerald hover:border-emerald transition-all"
            >
              Open calculator →
            </a>
          </div>

        </div>
      </main>
      <SiteFooter />
    </>
  );
}
