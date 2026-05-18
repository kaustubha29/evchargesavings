import type { Metadata } from "next";
import { SiteFooter } from "@/components/shared/SiteFooter";

export const metadata: Metadata = {
  title: "How We Calculate EV Savings — Methodology & Data Sources",
  description:
    "Transparent breakdown of how evchargesavings.com calculates EV charging cost, gas fuel cost, the state EV registration fee, and net annual savings. Data: EIA electricity rates, EIA gas prices, EPA efficiency ratings, NCSL state EV fees.",
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
    <div className="bg-cream-soft border border-line rounded-xl px-5 py-4 mb-4">
      <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-2">{label}</div>
      <div className="font-mono text-sm text-forest leading-relaxed">{formula}</div>
      {note && <div className="font-mono text-[11px] text-ink-mute mt-2">{note}</div>}
    </div>
  );
}

function Source({ name, url, desc }: { name: string; url: string; desc: string }) {
  return (
    <div className="flex gap-4 px-5 py-4 border-b border-line-soft last:border-0">
      <div className="flex-1">
        <a href={url} target="_blank" rel="noopener noreferrer"
          className="font-medium text-forest hover:underline text-sm">
          {name}
        </a>
        <p className="text-ink-3 text-sm mt-1.5 leading-relaxed">{desc}</p>
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
                "Core comparison is fuel cost: EV electricity vs gas. We then subtract your state's annual EV registration fee to show net savings.",
                "Net savings = gas fuel cost − EV charging cost − state EV registration fee. Toggle the fee off in the calculator for fuel-only.",
                "Still excluded: insurance, maintenance, depreciation, and the proposed (not law) federal $130 EV fee.",
                "Data: EPA efficiency ratings, EIA electricity rates (monthly), EIA gas prices (weekly), NCSL state EV fees (verified May 2026).",
                "Default: 13,500 miles/year (US average) · 80% home charging · 20% public (blended estimate).",
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
            <Source
              name="NCSL — Special Registration Fees for Electric & Hybrid Vehicles"
              url="https://www.ncsl.org/transportation/special-registration-fees-for-electric-and-hybrid-vehicles"
              desc="Annual state EV registration surcharge for all 50 states + DC. Verified May 2026, cross-checked against state DMV/DOT and the DOE Alternative Fuels Data Center. Several states index the fee to inflation."
            />
          </div>
          <p className="text-ink-mute text-xs font-mono mt-4">
            All rates are cached for 24 hours via ISR and refreshed automatically. If EIA is unavailable, we fall back to the most recent static values. Note: EIA publishes weekly gas prices (~1 week lag) but monthly residential electricity rates ~3 months in arrears — so the electricity period shown is always the latest data EIA has released, not a stale value on our end.
          </p>
          <p className="text-sm text-ink-3 mt-5">
            See the full state-by-state dataset — electricity rates, charging cost, and EV registration fees for all 50 states + DC —{" "}
            <a href="/research" className="text-forest font-medium hover:underline">on our research &amp; data page →</a>
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
            note="Default: 80% home charging at state residential rate, 20% public at 2.5× state rate (blended estimate based on national averages — actual public rates vary by network and charger type). 13,500 miles/year (US average) on the calculator and state pages; 12,000 miles/year on cost-to-charge pages."
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
            note="Example: 13,500 mi ÷ 30 MPG × $3.45/gal = $1,553/year"
          />
        </Section>

        {/* Savings */}
        <Section title="Savings calculation">
          <Formula
            label="Annual fuel savings"
            formula="annual_fuel_savings = annual_gas_cost − annual_ev_cost"
          />
          <Formula
            label="Net annual savings"
            formula="net_annual_savings = annual_fuel_savings − state_ev_registration_fee"
            note="Most states charge EVs an annual registration surcharge that gas cars don't pay. We subtract it by default; you can toggle it off in the calculator."
          />
          <Formula
            label="5-year savings"
            formula="five_year_savings = net_annual_savings × 5"
            note="Does not account for electricity or gas price changes over time, or scheduled state fee increases."
          />
          <Formula
            label="Fuel-cost break-even (purchase price only)"
            formula={`break_even_years = (ev_msrp − gas_msrp) / annual_fuel_savings`}
            note="Only shown when the EV costs more upfront and saves on fuel. This is a fuel-cost break-even — it uses fuel savings before the state EV fee, and does not include incentives, depreciation, financing, insurance, or maintenance. For a full total cost of ownership comparison, those factors must be added separately."
          />
        </Section>

        {/* State EV fees */}
        <Section title="State EV registration fees">
          <p className="text-ink-2 text-sm leading-relaxed mb-4">
            41 states plus DC charge electric vehicles an annual registration surcharge — a fee gas cars don&apos;t pay, meant to recover the gas tax EV drivers never contribute. It ranges from $50 (Hawaii, South Dakota) to about $270 in New Jersey (which rises on a fixed schedule toward $290 by 2028), with a median around $138/year. We subtract this from fuel savings by default because it&apos;s a real recurring cost most EV owners pay; the calculator lets you toggle it off to see fuel-only savings.
          </p>
          <p className="text-ink-2 text-sm leading-relaxed mb-4">
            This is the EV-specific surcharge only — not base registration, which every vehicle pays regardless of fuel type and therefore cancels out in an EV-vs-gas comparison. Figures are sourced from the National Conference of State Legislatures and verified May 2026. Several states index the fee to inflation or have scheduled increases, so confirm your state&apos;s current amount with your DMV before relying on it.
          </p>
          <p className="text-ink-2 text-sm leading-relaxed">
            A proposed federal $130 annual EV fee (House surface transportation bill, May 2026) is <b className="text-ink">not</b> included in any calculation — it is a proposal, not law, and including it would make our numbers inaccurate. We cover it separately in our news section.
          </p>
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

        <section className="py-14 bg-forest/5 border-t border-line">
          <div className="section-wrap max-w-xl text-center">
            <div className="font-mono text-[11px] uppercase tracking-widest text-forest mb-3">Free calculator</div>
            <h2 className="font-serif text-2xl font-medium tracking-tight text-ink mb-3">Try the calculator yourself</h2>
            <p className="text-ink-3 text-sm mb-6">Pick your EV, your current gas car, and your ZIP — live EIA rates, instant result.</p>
            <a href="/#calculator" className="inline-flex items-center gap-2 bg-forest text-cream font-mono text-sm px-6 py-3 rounded-full hover:bg-forest/90 transition-colors">
              Open the calculator →
            </a>
          </div>
        </section>
        <SiteFooter />
      </main>
    </>
  );
}
