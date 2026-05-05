import type { Metadata } from "next";
import { SiteFooter } from "@/components/shared/SiteFooter";

export const metadata: Metadata = {
  title: "How We Calculate EV Savings — Methodology & Data Sources",
  description:
    "Transparent breakdown of how evchargesavings.com calculates EV charging costs, gas fuel costs, and annual savings. Data sources: EIA electricity rates, EIA gas prices, EPA efficiency ratings.",
  alternates: { canonical: "/how-we-calculate" },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="py-10 border-b border-line">
      <div className="section-wrap max-w-3xl">
        <h2 className="font-serif text-2xl font-medium tracking-tight text-ink mb-6">{title}</h2>
        {children}
      </div>
    </section>
  );
}

function Formula({ label, formula, note }: { label: string; formula: string; note?: string }) {
  return (
    <div className="bg-ink text-cream rounded-xl px-5 py-4 mb-4">
      <div className="font-mono text-[10px] uppercase tracking-widest text-cream/40 mb-2">{label}</div>
      <div className="font-mono text-sm text-emerald leading-relaxed">{formula}</div>
      {note && <div className="font-mono text-[11px] text-cream/40 mt-2">{note}</div>}
    </div>
  );
}

function Source({ name, url, desc }: { name: string; url: string; desc: string }) {
  return (
    <div className="flex gap-4 py-3 border-b border-line-soft last:border-0">
      <div className="flex-1">
        <a href={url} target="_blank" rel="noopener noreferrer"
          className="font-medium text-forest hover:underline text-sm">
          {name}
        </a>
        <p className="text-ink-3 text-sm mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

export default function HowWeCalculatePage() {
  return (
    <>
      <main>
        {/* Hero */}
        <section className="bg-paper border-b border-line py-14">
          <div className="section-wrap max-w-3xl">
            <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-4">
              Methodology
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-medium tracking-tight text-ink mb-4">
              How we calculate EV savings
            </h1>
            <p className="text-ink-3 text-lg leading-relaxed">
              Every number on this site comes from official government data and documented formulas.
              Here's exactly what we use, where it comes from, and where we make assumptions.
            </p>
          </div>
        </section>

        {/* TL;DR */}
        <section className="bg-ink text-cream py-8 border-b border-white/10">
          <div className="section-wrap max-w-3xl">
            <div className="font-mono text-[11px] uppercase tracking-widest text-emerald mb-4">TL;DR</div>
            <ul className="space-y-2 text-sm text-cream/80 font-mono">
              {[
                "We compare fuel cost only — EV electricity vs gas. Not insurance, maintenance, or depreciation.",
                "Data: EPA efficiency ratings, EIA electricity rates (monthly), EIA gas prices (weekly).",
                "Default: 15,000 miles/year · 80% home charging · 20% public (blended estimate).",
                "Estimates may vary from real-world results by ±10% depending on driving and charging behavior.",
              ].map((line) => (
                <li key={line} className="flex gap-2">
                  <span className="text-emerald flex-shrink-0">·</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Data Sources */}
        <Section title="Data sources">
          <div className="space-y-0 border border-line rounded-xl divide-y divide-line overflow-hidden">
            <Source
              name="EIA Electricity Retail Sales (monthly)"
              url="https://www.eia.gov/electricity/data/browser/"
              desc="Residential electricity rates by state in cents/kWh. Updated monthly. We use the most recent published period. All 50 states + DC covered."
            />
            <Source
              name="EIA Petroleum Retail Prices (weekly)"
              url="https://www.eia.gov/petroleum/gasdiesel/"
              desc="Retail gasoline prices (all grades, all formulations) by state. Updated weekly. 9 states report directly to EIA; remaining states use their PADD sub-regional price (PADD 1A–1C, 2, 3, 4, 5)."
            />
            <Source
              name="EPA Fuel Economy Guide"
              url="https://www.fueleconomy.gov/"
              desc="Combined city/highway MPG for gas vehicles. Combined mi/kWh and battery capacity for EVs. EPA-rated figures are standardized lab-cycle estimates and may differ from real-world driving by ±10–30% depending on conditions, climate, and driving style."
            />
          </div>
          <p className="text-ink-mute text-xs font-mono mt-4">
            All rates are cached for 24 hours via ISR and refreshed automatically. If EIA is unavailable, we fall back to the most recent static values.
          </p>
        </Section>

        {/* EV charging cost */}
        <Section title="EV charging cost">
          <p className="text-ink-3 text-sm mb-6 leading-relaxed">
            We calculate what it costs to power an EV for a given number of miles,
            split between home charging and public charging.
          </p>
          <Formula
            label="Cost per mile (electric)"
            formula="cost_per_mile = electricity_rate_$/kWh / ev_efficiency_mi_per_kwh"
            note="Example: $0.165/kWh ÷ 4.0 mi/kWh = $0.041/mile. All rates are in $/kWh throughout."
          />
          <Formula
            label="Annual EV fuel cost"
            formula={`annual_ev_cost = annual_miles × [\n  (home_pct / 100) × home_rate_$/kWh\n  + (1 − home_pct / 100) × public_rate_$/kWh\n] / ev_efficiency_mi_per_kwh`}
            note="Default: 80% home charging at state residential rate, 20% public at 2.5× state rate (blended estimate based on national averages — actual public rates vary by network and charger type). 15,000 miles/year on state pages; 12,000 miles/year on cost-to-charge pages."
          />
          <Formula
            label="Full charge cost"
            formula="full_charge_cost = battery_kwh × (home_rate_cents / 100)"
            note="Example: 75 kWh × $0.165/kWh = $12.38 to fully charge"
          />
        </Section>

        {/* Gas fuel cost */}
        <Section title="Gas fuel cost">
          <p className="text-ink-3 text-sm mb-6 leading-relaxed">
            Gas cost is calculated from the EPA combined MPG rating and the current state gas price.
          </p>
          <Formula
            label="Annual gas fuel cost"
            formula="annual_gas_cost = (annual_miles / gas_mpg) × gas_price_per_gallon"
            note="Example: 15,000 mi ÷ 30 MPG × $3.45/gal = $1,725/year"
          />
        </Section>

        {/* Savings */}
        <Section title="Savings calculation">
          <Formula
            label="Annual savings"
            formula="annual_savings = annual_gas_cost − annual_ev_cost"
          />
          <Formula
            label="5-year savings"
            formula="five_year_savings = annual_savings × 5"
            note="Does not account for electricity or gas price changes over time."
          />
          <Formula
            label="Fuel-cost break-even (purchase price only)"
            formula={`break_even_years = (ev_msrp − gas_msrp) / annual_savings`}
            note="Only shown when EV costs more upfront and saves on fuel. This is a fuel-cost break-even only — it does not include incentives, depreciation, financing, insurance, or maintenance differences. For a full total cost of ownership comparison, those factors must be added separately."
          />
        </Section>

        {/* Assumptions */}
        <Section title="Assumptions and limitations">
          <ul className="space-y-4 text-sm text-ink-2">
            {[
              {
                label: "Energy efficiency comparison, not drivetrain parity",
                body: "MPG and mi/kWh are energy efficiency ratings only. This is a fuel-cost model — it does not imply equivalent performance, range behavior, or cost-of-ownership parity between gas and electric drivetrains.",
              },
              {
                label: "Charging efficiency loss not modeled",
                body: "Real-world charging loses 10–15% to heat and AC/DC conversion. Our cost-per-mile figures use EPA rated efficiency, which does not include charger losses. Actual cost is slightly higher.",
              },
              {
                label: "No winter degradation",
                body: "Cold weather reduces EV range and efficiency by 15–30%. Our figures use all-season EPA ratings. If you drive in a cold climate, your real charging costs will be higher in winter.",
              },
              {
                label: "Flat electricity rate",
                body: "We use the state average residential rate. Time-of-use (TOU) plans can reduce home charging cost to 60–75% of the average. States with available TOU rates are noted on relevant pages.",
              },
              {
                label: "Regional gas prices for 41 states",
                body: "EIA publishes weekly state-level gas prices for 9 states. For the remaining states, we use EIA regional averages — accuracy is typically ±$0.10–0.30/gallon.",
              },
              {
                label: "Gas comparison vehicle is representative, not exact",
                body: "We pair each EV with a comparable gas vehicle by segment (e.g., Tesla Model Y → Toyota RAV4). The gas price reflects the EPA combined MPG for that vehicle. Your actual gas car may differ.",
              },
              {
                label: "No maintenance or insurance difference",
                body: "EVs typically cost less to maintain (no oil changes, fewer brake jobs) but may cost more to insure. These factors are not included in our fuel-cost comparison.",
              },
            ].map((item) => (
              <li key={item.label} className="flex gap-4">
                <span className="text-ink-mute mt-0.5 flex-shrink-0">—</span>
                <span>
                  <b className="text-ink">{item.label}.</b>{" "}
                  {item.body}
                </span>
              </li>
            ))}
          </ul>
        </Section>

        {/* Questions */}
        <section className="py-10">
          <div className="section-wrap max-w-3xl">
            <p className="text-ink-3 text-sm">
              See something wrong or have a question about the methodology?{" "}
              <a href="mailto:hello@evchargesavings.com" className="text-forest hover:underline">
                hello@evchargesavings.com
              </a>
            </p>
          </div>
        </section>

        <SiteFooter />
      </main>
    </>
  );
}
