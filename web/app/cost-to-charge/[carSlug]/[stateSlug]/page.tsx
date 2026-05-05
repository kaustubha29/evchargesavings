import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { evRepository } from "@/features/ev-data/repository";
import { getStateBySlug } from "@/features/location/queries";
import { calculateSavings } from "@/features/calculations/savings";
import { getComparableGas, getComparableGasId } from "@/features/ev-data/data/comparable-gas";
import { chargePageMeta } from "@/features/content/seo";
import { enrichState } from "@/features/location/live-rates";
import { LeadCaptureBox } from "@/components/shared/LeadCaptureBox";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { fmt } from "@/lib/format";

export const revalidate = 86400;
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

        {/* Section 4 — CTA */}
        <section className="py-16">
          <div className="section-wrap max-w-xl">
            <h2 className="font-serif text-2xl font-medium tracking-tight mb-2">
              Get exact savings for your ZIP
            </h2>
            <p className="text-ink-3 text-sm mb-6">
              Find out what home charging actually costs at your address and get charger setup recommendations.
            </p>
            <LeadCaptureBox
              sourcePage={`/cost-to-charge/${carSlug}/${stateSlug}`}
              defaultIntent={["charger"]}
              heading="Get exact savings + charger setup for your home"
              description={`See your real cost to charge a ${ev.name} in ${state.name} based on your ZIP code.`}
              submitLabel="Get my savings estimate"
            />
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
