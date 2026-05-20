import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { evRepository } from "@/features/ev-data/repository";
import { getStateBySlug } from "@/features/location/queries";
import { calculateSavings } from "@/features/calculations/savings";
import { getComparableGas, getComparableGasId } from "@/features/ev-data/data/comparable-gas";
import { chargePageMeta } from "@/features/content/seo";
import { enrichState } from "@/features/location/live-rates";
import { STATE_DATA, NATIONAL_AVG } from "@/features/location/data/states";
import { LeadCaptureBox } from "@/components/shared/LeadCaptureBox";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { fmt } from "@/lib/format";

export const revalidate = 604800;
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
  const ev     = evRepository.getBySlug(carSlug);
  const rawState = getStateBySlug(stateSlug);
  if (!ev || !rawState) return {};
  const { state } = await enrichState(rawState);

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
    openGraph: { title, description, url: `https://www.evchargesavings.com/cost-to-charge/${carSlug}/${stateSlug}` },
  };
}

export default async function CostToChargePage({ params }: Props) {
  const { carSlug, stateSlug } = await params;

  const ev       = evRepository.getBySlug(carSlug);
  const rawState = getStateBySlug(stateSlug);
  if (!ev || !rawState) return notFound();
  const { state, gasPeriod, elecPeriod } = await enrichState(rawState);

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

  // Editorial context flags
  const rateCategory = state.kwhCents < 13 ? "low" : state.kwhCents < 20 ? "moderate" : "high";
  const gasPriceHigh = state.gasDollar >= 4.0;
  const savingsStrong = savings.annualSavings > 1500;
  const savingsNegative = savings.annualSavings < 0;
  const isNACS = ev.connector === "NACS";
  const efficiencyGrade = ev.efficiency >= 4.0 ? "excellent" : ev.efficiency >= 3.2 ? "good" : "moderate";

  // National rate comparison (unique per state)
  const nationalAvgKwh = NATIONAL_AVG.kwhCents;
  const rateVsNationalPct = Math.abs(((state.kwhCents - nationalAvgKwh) / nationalAvgKwh) * 100).toFixed(0);
  const isAboveNational = state.kwhCents > nationalAvgKwh;
  // Miles per $1 of electricity vs gas (unique per state+EV combination)
  const milesPerDollarEV = (ev.efficiency / (state.kwhCents / 100)).toFixed(1);
  const milesPerDollarGas = (gas.mpg / state.gasDollar).toFixed(1);
  // Rate rank among states (1 = cheapest)
  const sortedRates = Object.values(STATE_DATA).map(s => s.kwhCents).sort((a, b) => a - b);
  const rateRank = sortedRates.findIndex(r => r >= state.kwhCents) + 1;
  const totalStates = sortedRates.length;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Cost to Charge ${ev.fullName} in ${state.name} (2026)`,
    description: chargePageMeta(ev, state, monthlyEV, savings.annualSavings).description,
    url: `https://www.evchargesavings.com/cost-to-charge/${carSlug}/${stateSlug}`,
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
            {/* Extractable answer block for AI citation */}
            <p className="text-sm text-ink-2 bg-cream-soft border border-line rounded-xl px-4 py-3 mb-5 max-w-xl leading-relaxed">
              <strong>Charging a {ev.name} in {state.name}:</strong>{" "}
              {(costPerMile * 100).toFixed(1)}¢ per mile ·{" "}
              {fmt.money2(fullChargeCost)} for a full {ev.battery} kWh charge ·{" "}
              {fmt.money0(savings.evAnnualCost)}/year at {ANNUAL_MILES.toLocaleString()} miles.
              Source: EIA {elecPeriod ?? "May 2026"} · EPA Fuel Economy Guide · DOE AFDC (state fees).
            </p>

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

            {state.evFee > 0 && (
              <p className="text-ink-mute text-xs mt-4 max-w-xl leading-relaxed">
                Note: {state.name} charges EVs a <b className="text-ink">{fmt.money0(state.evFee)}/year</b> registration surcharge that gas cars don&apos;t pay.
                Factoring it in, real net savings here are about <b className="text-forest">{fmt.money0(savings.annualSavings - state.evFee)}/year</b>.
                {" "}<a href="/how-we-calculate" className="text-forest hover:underline">How we calculate →</a>
              </p>
            )}
          </div>
        </section>

        {/* Section 1 — Charging breakdown */}
        <section className="py-12 border-b border-line">
          <div className="section-wrap">
            <h2 className="font-serif text-2xl font-medium tracking-tight mb-2">
              Charging breakdown
            </h2>
            <p className="text-ink-3 text-sm mb-6">
              Based on {state.name} avg {fmt.cents1(state.kwhCents)}/kWh · {ev.battery} kWh battery · {ev.efficiency} mi/kWh (EPA-rated)
              {state.hasTOU && state.touCents && (
                <span> · TOU off-peak as low as {fmt.cents1(state.touCents)}/kWh</span>
              )}
              {elecPeriod && (
                <span className="text-ink-mute"> · EIA residential avg · {elecPeriod}</span>
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
              Gas at {fmt.money2(state.gasDollar)}/gal · {gas.mpg} MPG (EPA-rated) · {MONTHLY_MILES.toLocaleString()} mi/month
              {gasPeriod && (
                <span className="text-ink-mute"> · EIA retail avg · {gasPeriod}</span>
              )}
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

        {/* Section 4 — Editorial context */}
        <section className="py-12 border-b border-line bg-paper">
          <div className="section-wrap max-w-3xl">
            <h2 className="font-serif text-2xl font-medium tracking-tight mb-6">
              Is the {ev.name} a good fit for {state.name}?
            </h2>
            <div className="space-y-4 text-ink-2 leading-relaxed">
              <p>
                {rateCategory === "low" && (
                  <>
                    {state.name} has one of the lower residential electricity rates in the country at{" "}
                    {fmt.cents1(state.kwhCents)}/kWh — charging the {ev.name} here costs less than in most states.
                    At {efficiencyGrade} efficiency ({ev.efficiency} mi/kWh EPA-rated), each dollar of electricity takes you{" "}
                    {(ev.efficiency / (state.kwhCents / 100)).toFixed(0)} miles.
                  </>
                )}
                {rateCategory === "moderate" && (
                  <>
                    {state.name}&apos;s electricity rate of {fmt.cents1(state.kwhCents)}/kWh sits near the national average.
                    The {ev.name}&apos;s {efficiencyGrade} efficiency of {ev.efficiency} mi/kWh means a full {ev.battery} kWh charge
                    costs {fmt.money2(fullChargeCost)} and gets you roughly {ev.range} miles — comparable to a tank of gas
                    in terms of range, but at a fraction of the cost.
                  </>
                )}
                {rateCategory === "high" && (
                  <>
                    Electricity in {state.name} runs {fmt.cents1(state.kwhCents)}/kWh — above the national average — which
                    raises the bar for EV savings compared to lower-rate states. Even so, the {ev.name}&apos;s{" "}
                    {efficiencyGrade} efficiency ({ev.efficiency} mi/kWh) keeps fuel costs lower than a comparable gas vehicle
                    in most driving scenarios.
                    {gasPriceHigh && <> {state.name}&apos;s gas prices (currently {fmt.money2(state.gasDollar)}/gal) further tip the balance in the EV&apos;s favor.</>}
                  </>
                )}
              </p>

              <p>
                {savingsStrong && !savingsNegative && (
                  <>
                    The {fmt.money0(savings.annualSavings)}/year savings on fuel is meaningfully above average for this pairing.
                    {gasPriceHigh
                      ? ` High gas prices in ${state.name} are a major driver — at ${fmt.money2(state.gasDollar)}/gal, every mile in the ${gas.name} costs significantly more than in the ${ev.name}.`
                      : ` This is driven by a combination of ${efficiencyGrade} EV efficiency and the relatively low cost of home charging at ${fmt.cents1(state.kwhCents)}/kWh.`
                    }
                  </>
                )}
                {!savingsStrong && !savingsNegative && (
                  <>
                    Savings of {fmt.money0(savings.annualSavings)}/year are meaningful but modest for this pairing.
                    {rateCategory === "high"
                      ? ` ${state.name}'s above-average electricity rates reduce the advantage versus gas. If your utility offers a time-of-use (TOU) plan, off-peak charging can significantly close the gap.`
                      : ` Lower local gas prices reduce the spread between the ${ev.name} and the ${gas.name} on pure fuel cost.`
                    }
                  </>
                )}
                {savingsNegative && (
                  <>
                    This combination shows higher EV fuel costs than the comparable gas vehicle — unusual but it can happen
                    when electricity rates are high, gas prices are low, and the gas vehicle is particularly fuel-efficient.
                    The gap may still close when you factor in lower EV maintenance costs, which AAA estimates at roughly
                    $900/year less than comparable gas vehicles.
                  </>
                )}
              </p>

              <p>
                {state.name}&apos;s {fmt.cents1(state.kwhCents)}/kWh electricity rate sits{" "}
                {isAboveNational ? `${rateVsNationalPct}% above` : `${rateVsNationalPct}% below`} the US residential
                average of {fmt.cents1(nationalAvgKwh)}/kWh, ranking {rateRank === 1 ? "1st cheapest" : rateRank <= 5 ? `${rateRank}nd–${rateRank}th cheapest` : rateRank >= totalStates - 4 ? `among the most expensive` : `${rateRank}th out of ${totalStates}`} among states.
                At that rate, the {ev.name}&apos;s {ev.efficiency} mi/kWh efficiency delivers{" "}
                <strong>{milesPerDollarEV} miles per $1</strong> of electricity —
                compared to {milesPerDollarGas} miles per $1 of gas for the {gas.name} at current {state.name} prices.
              </p>

              {ev.connector === "NACS" ? (
                <p>
                  The {ev.name} uses the NACS connector, which means access to the Tesla Supercharger network (over 17,000
                  locations in the US) in addition to Electrify America, ChargePoint, and EVgo. For road trips in {state.name},
                  Supercharger coverage is generally dense along major corridors, making range anxiety less of a concern for
                  most drivers.
                </p>
              ) : (
                <p>
                  The {ev.name} uses a CCS connector, which works with Electrify America, ChargePoint, EVgo, and most
                  third-party Level 2 networks. Public charging costs 2–4× more than home charging per kWh — plan
                  your {state.name} road trips around home charging where possible, and use public chargers as top-ups
                  rather than primary sources.
                </p>
              )}

              {state.hasTOU && (
                <p>
                  {state.name} utilities offer time-of-use pricing — charging overnight (typically 11 PM–7 AM) can
                  reduce your rate significantly below the {fmt.cents1(state.kwhCents)}/kWh state average shown here.
                  Some utilities offer EV-specific rate plans that drop off-peak rates even further. Check with your
                  local utility for the current rate schedule before assuming the default rate applies.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Section 5 — CTA */}
        <section className="py-16 border-b border-line">
          <div className="section-wrap max-w-2xl">
            <h2 className="font-serif text-2xl font-medium tracking-tight mb-2">
              Adjust for your driving pattern
            </h2>
            <p className="text-ink-3 text-sm mb-8">
              These numbers assume 12,000 mi/yr and 80% home charging. Change the miles, home split, or ZIP in the full calculator.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <a
                href={`/#calculator`}
                className="flex-1 flex items-center justify-center gap-2 bg-forest text-cream font-mono text-sm px-6 py-4 rounded-2xl hover:bg-forest/90 transition-colors text-center"
              >
                Open full calculator →
              </a>
              <a
                href={`/compare/${carSlug}-vs-${getComparableGasId(carSlug, ev.segment)}`}
                className="flex-1 flex items-center justify-center gap-2 bg-paper border border-line text-forest font-mono text-sm px-6 py-4 rounded-2xl hover:border-forest transition-colors text-center"
              >
                {ev.name} vs {gas.name} full comparison →
              </a>
            </div>
            <div className="border-t border-line pt-8">
              <p className="text-ink-mute text-xs font-mono uppercase tracking-widest mb-4">Also want charger setup guidance?</p>
              <LeadCaptureBox
                sourcePage={`/cost-to-charge/${carSlug}/${stateSlug}`}
                defaultIntent={["charger"]}
                heading="Get charger setup recommendations for your home"
                description={`See what Level 2 charger fits a ${ev.name} and get installer quotes in ${state.name}.`}
                submitLabel="Get recommendations"
              />
            </div>
          </div>
        </section>

        {/* Internal links — other states + compare */}
        <section className="py-10 bg-paper border-t border-line">
          <div className="section-wrap">
            <div className="flex flex-col sm:flex-row gap-10">

              {/* Other states for this EV */}
              <div className="flex-1">
                <h3 className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-4">
                  {ev.name} charging cost in other states
                </h3>
                <ul className="space-y-1.5 text-sm">
                  {TOP_STATE_SLUGS.filter((s) => s !== stateSlug).slice(0, 8).map((s) => {
                    const label = s.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
                    return (
                      <li key={s}>
                        <a href={`/cost-to-charge/${carSlug}/${s}`}
                          className="text-forest hover:underline">
                          {ev.name} in {label}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Compare + methodology */}
              <div className="flex-1">
                <h3 className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-4">
                  Go deeper
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href={`/compare/${carSlug}-vs-${getComparableGasId(carSlug, ev.segment)}`}
                      className="text-forest hover:underline">
                      {ev.name} vs {gas.name} — full comparison →
                    </a>
                  </li>
                  <li>
                    <a href={`/ev-cost/${stateSlug}`}
                      className="text-forest hover:underline">
                      All EVs in {state.name} →
                    </a>
                  </li>
                  <li>
                    <a href="/how-we-calculate"
                      className="text-ink-mute hover:text-forest hover:underline transition-colors">
                      How we calculate these numbers →
                    </a>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        </section>

        <SiteFooter />
      </main>
    </>
  );
}
