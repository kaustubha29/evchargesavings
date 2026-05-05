import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllStates, getStateBySlug } from "@/features/location/queries";
import { enrichState } from "@/features/location/live-rates";
import { evRepository, gasRepository } from "@/features/ev-data/repository";
import { calculateSavings } from "@/features/calculations/savings";
import { calculateCO2 } from "@/features/calculations/co2";
import { statePageMeta } from "@/features/content/seo";
import { CalculatorShell } from "@/components/features/calculator/CalculatorShell";
import { LocationDetector } from "@/components/features/location/LocationDetector";
import { StateSelector } from "@/components/features/location/StateSelector";
import { EVMarketplaceAffiliates } from "@/components/shared/EVMarketplaceAffiliates";
import { SavingsSlotBand } from "@/components/shared/SavingsSlotBand";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { fmt } from "@/lib/format";

interface Props {
  params: Promise<{ state: string }>;
}

export function generateStaticParams() {
  return getAllStates().map((s) => ({ state: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: stateSlug } = await params;
  const stateData = getStateBySlug(stateSlug);
  if (!stateData) return {};
  const { title, description } = statePageMeta(stateData);
  return {
    title,
    description,
    alternates: { canonical: `/ev-cost/${stateSlug}` },
    openGraph: {
      title,
      description,
      url: `/ev-cost/${stateSlug}`,
      images: [
        {
          url: `/ev-cost/${stateSlug}/opengraph-image.png`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
  };
}

const DEFAULT_MILES = 15000;
const DEFAULT_HOME_PCT = 80;

export default async function StateCalculatorPage({ params }: Props) {
  const { state: stateSlug } = await params;
  const rawStateData = getStateBySlug(stateSlug);
  if (!rawStateData) notFound();
  const { state: stateData, gasPeriod, elecPeriod } = await enrichState(rawStateData);

  const evSummaries = evRepository.getSummaries();
  const gasVehicles = gasRepository.getAll();

  // Pre-compute example: Model Y LR vs Toyota RAV4 for structured data / hero text
  const modelY = evRepository.getBySlug("t-my-lr-awd") ?? evRepository.getAll()[0];
  const rav4   = gasRepository.getById("toyota-rav4") ?? gasVehicles[0];

  const exSavings = calculateSavings({
    evEfficiency:   modelY.efficiency,
    gasMpg:         rav4.mpg,
    annualMiles:    DEFAULT_MILES,
    homePct:        DEFAULT_HOME_PCT,
    homeRateKwh:    stateData.kwhCents,
    publicRateKwh:  stateData.kwhCents * 2.5,
    gasPriceDollar: stateData.gasDollar,
  });
  const exCo2 = calculateCO2(DEFAULT_MILES, rav4.mpg, exSavings.annualKwh);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `EV Savings Calculator — ${stateData.name}`,
    description: statePageMeta(stateData).description,
    url: `https://evchargesavings.com/ev-cost/${stateData.slug}`,
    mainEntity: {
      "@type": "Dataset",
      name: `${stateData.name} EV Cost Data 2026`,
      description: `Electricity rate ${stateData.kwhCents}¢/kWh, gas $${stateData.gasDollar}/gal`,
      variableMeasured: [
        { "@type": "PropertyValue", name: "Electricity rate", value: `${stateData.kwhCents}¢/kWh` },
        { "@type": "PropertyValue", name: "Gas price",        value: `$${stateData.gasDollar}/gal` },
        { "@type": "PropertyValue", name: "Example annual EV savings (Model Y vs RAV4)", value: fmt.money0(exSavings.annualSavings) },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LocationDetector forceState={stateData.code} />

      <main>
        {/* State hero */}
        <section className="bg-paper border-b border-line py-14 md:py-20">
          <div className="section-wrap">
            <div className="mb-6">
              <StateSelector currentStateSlug={stateData.slug} />
            </div>
            <div className="inline-flex items-center gap-2 bg-good-bg text-good-fg font-mono text-xs px-3.5 py-1.5 rounded-full border border-good-fg/15 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
              {stateData.name} · {fmt.cents1(stateData.kwhCents)}/kWh · {fmt.money2(stateData.gasDollar)}/gal
            </div>
            <h1 className="font-serif text-4xl md:text-6xl font-medium tracking-tight text-ink mb-4 max-w-2xl leading-[1.05]">
              EV savings in <em className="italic text-forest">{stateData.name}</em>
            </h1>
            <p className="text-ink-3 text-lg max-w-xl leading-relaxed mb-6">
              Electricity costs <b className="text-ink">{fmt.cents1(stateData.kwhCents)}/kWh</b> and
              gas runs <b className="text-ink">{fmt.money2(stateData.gasDollar)}/gal</b> in {stateData.name}.
              A Model Y vs RAV4 saves roughly{" "}
              <b className="text-forest">{fmt.money0(exSavings.annualSavings)}/yr</b> at 15,000 miles.
            </p>

            {/* Quick-stat row */}
            <div className="flex flex-wrap gap-4">
              {[
                { label: "EV electricity rate",  val: `${fmt.cents1(stateData.kwhCents)}/kWh` },
                { label: "Gas price",             val: `${fmt.money2(stateData.gasDollar)}/gal` },
                { label: "Model Y annual cost",   val: fmt.money0(exSavings.evAnnualCost) },
                { label: "RAV4 annual cost",      val: fmt.money0(exSavings.gasAnnualCost) },
                { label: "CO₂ saved / yr",        val: fmt.lbs(exCo2.savedLbs) },
              ].map((s) => (
                <div key={s.label} className="bg-paper border border-line rounded-xl px-4 py-3 text-sm">
                  <div className="font-serif text-lg font-medium text-forest">{s.val}</div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute">{s.label}</div>
                </div>
              ))}
            </div>

            {stateData.hasTOU && (
              <div className="mt-4 inline-flex items-center gap-2 bg-okay-bg text-okay-fg text-xs font-mono px-3 py-1.5 rounded-full">
                ⚡ Time-of-use rates available in {stateData.name}
                {stateData.touCents && ` — off-peak as low as ${fmt.cents1(stateData.touCents)}/kWh`}
              </div>
            )}
            {stateData.incentiveNote && (
              <p className="mt-3 text-sm text-ink-3">
                <b className="text-ink">State incentive:</b> {stateData.incentiveNote}
              </p>
            )}
          </div>
        </section>

        <SavingsSlotBand
          eyebrow={`${stateData.name} context`}
          title="See how local rates move the savings number"
          body={`${stateData.name}'s electricity and gas prices are only part of the story. Vehicle efficiency, home charging, and mileage can swing the yearly total fast.`}
        />

        {/* Calculator */}
        <section className="py-12">
          <div className="section-wrap">
            <CalculatorShell evSummaries={evSummaries} gasVehicles={gasVehicles} />
          </div>
        </section>

        {/* EV Marketplace Affiliates */}
        <EVMarketplaceAffiliates />

        {/* Cost-to-charge by EV */}
        <section className="bg-cream-soft border-t border-line py-12">
          <div className="section-wrap">
            <div className="mb-5">
              <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-2">
                Charging cost by EV · {stateData.name}
              </div>
              <h2 className="font-serif text-2xl font-medium tracking-tight text-ink">
                What does it cost to charge specific EVs in {stateData.name}?
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {[
                { slug: "tesla-model-y-long-range-awd",       name: "Tesla Model Y LR AWD" },
                { slug: "tesla-model-3-rwd",                  name: "Tesla Model 3 RWD" },
                { slug: "hyundai-ioniq-5-long-range-rwd",     name: "Hyundai Ioniq 5 LR RWD" },
                { slug: "chevrolet-equinox-ev-lt-fwd",        name: "Chevy Equinox EV" },
                { slug: "ford-mustang-mach-e-standard-rwd",   name: "Ford Mustang Mach-E" },
                { slug: "kia-ev6-long-range-rwd",             name: "Kia EV6 LR RWD" },
                { slug: "rivian-r1t-dual-motor",              name: "Rivian R1T" },
                { slug: "volkswagen-id4-pro-rwd",             name: "VW ID.4 Pro" },
              ].map((ev) => (
                <a
                  key={ev.slug}
                  href={`/cost-to-charge/${ev.slug}/${stateData.slug}`}
                  className="group border border-line rounded-xl bg-paper px-4 py-3 hover:border-forest/35 hover:shadow-1 transition-all"
                >
                  <div className="font-serif text-sm font-medium text-ink group-hover:text-forest transition-colors leading-snug">
                    {ev.name}
                  </div>
                  <div className="font-mono text-[10px] text-ink-mute mt-1 group-hover:text-forest/70 transition-colors">
                    Charging cost in {stateData.name} →
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* State comparison table */}
        <section className="bg-paper border-t border-line py-12">
          <div className="section-wrap">
            <h2 className="font-serif text-2xl font-medium tracking-tight mb-6">
              How {stateData.name} compares
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-line">
                    <th className="text-left font-mono text-[10px] uppercase tracking-widest text-ink-mute py-2 pr-6">Metric</th>
                    <th className="text-right font-mono text-[10px] uppercase tracking-widest text-ink-mute py-2 pr-6">{stateData.name}</th>
                    <th className="text-right font-mono text-[10px] uppercase tracking-widest text-ink-mute py-2">US Average</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "Electricity rate (EIA)", state: fmt.cents1(stateData.kwhCents) + "/kWh", nat: "16.5¢/kWh" },
                    { label: "Gas price (EIA)",        state: fmt.money2(stateData.gasDollar) + "/gal", nat: "$3.45/gal" },
                    { label: "Annual EV cost (15k mi, 80% home)", state: fmt.money0(exSavings.evAnnualCost), nat: "$900" },
                    { label: "Annual gas cost (15k mi, RAV4)",    state: fmt.money0(exSavings.gasAnnualCost), nat: "$2,588" },
                    { label: "Annual savings",    state: fmt.money0(exSavings.annualSavings), nat: "$1,688" },
                  ].map((row) => (
                    <tr key={row.label} className="border-b border-line-soft">
                      <td className="py-3 pr-6 text-ink-2">{row.label}</td>
                      <td className="py-3 pr-6 text-right font-mono font-semibold text-forest">{row.state}</td>
                      <td className="py-3 text-right font-mono text-ink-mute">{row.nat}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {(elecPeriod || gasPeriod) && (
              <p className="text-ink-mute font-mono text-[10px] mt-4">
                Source: EIA
                {elecPeriod && <> · Electricity: residential avg · {elecPeriod}</>}
                {gasPeriod  && <> · Gas: retail avg · {gasPeriod}</>}
              </p>
            )}
          </div>
        </section>

        <SiteFooter />
      </main>
    </>
  );
}
