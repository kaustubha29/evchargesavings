import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { evRepository, gasRepository } from "@/features/ev-data/repository";
import { calculateSavings } from "@/features/calculations/savings";
import { calculateCO2 } from "@/features/calculations/co2";
import { calculateBreakEven } from "@/features/calculations/break-even";
import { evPageMeta } from "@/features/content/seo";
import { CalculatorShell } from "@/components/features/calculator/CalculatorShell";
import { LocationDetector } from "@/components/features/location/LocationDetector";
import { SavingsSlotBand } from "@/components/shared/SavingsSlotBand";
import { fmt } from "@/lib/format";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return evRepository.getAll().map((ev) => ({ slug: ev.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ev = evRepository.getBySlug(slug);
  if (!ev) return {};
  const { title, description } = evPageMeta(ev);
  return {
    title,
    description,
    alternates: { canonical: `/ev/${slug}` },
    openGraph: { title, description, url: `/ev/${slug}` },
  };
}

const NATIONAL_KWH_CENTS = 16.5;
const NATIONAL_GAS_DOLLAR = 3.45;
const DEFAULT_MILES = 15000;
const DEFAULT_HOME_PCT = 80;

export default async function EVDetailPage({ params }: Props) {
  const { slug } = await params;
  const ev = evRepository.getBySlug(slug);
  if (!ev) notFound();

  const evSummaries = evRepository.getSummaries();
  const gasVehicles = gasRepository.getAll();

  // Example: compare vs Toyota RAV4 nationally
  const rav4 = gasRepository.getById("toyota-rav4") ?? gasVehicles[0];
  const exSavings = calculateSavings({
    evEfficiency:   ev.efficiency,
    gasMpg:         rav4.mpg,
    annualMiles:    DEFAULT_MILES,
    homePct:        DEFAULT_HOME_PCT,
    homeRateKwh:    NATIONAL_KWH_CENTS,
    publicRateKwh:  NATIONAL_KWH_CENTS * 2.5,
    gasPriceDollar: NATIONAL_GAS_DOLLAR,
  });
  const exCo2 = calculateCO2(DEFAULT_MILES, rav4.mpg, exSavings.annualKwh);
  const RAV4_MSRP = 32000;
  const breakEven = calculateBreakEven(ev.msrp, RAV4_MSRP, exSavings.annualSavings, ev.federalTaxCredit);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: ev.fullName,
    description: evPageMeta(ev).description,
    brand: { "@type": "Brand", name: ev.brand },
    offers: {
      "@type": "Offer",
      price: ev.msrp,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    additionalProperty: [
      { "@type": "PropertyValue", name: "Range",      value: `${ev.range} miles EPA` },
      { "@type": "PropertyValue", name: "Efficiency", value: `${ev.efficiency} mi/kWh` },
      { "@type": "PropertyValue", name: "Connector",  value: ev.connector },
      { "@type": "PropertyValue", name: "Battery",    value: `${ev.battery} kWh` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LocationDetector />

      <main>
        {/* EV hero */}
        <section className="bg-paper border-b border-line py-14 md:py-20">
          <div className="section-wrap">
            <div className="inline-flex items-center gap-2 bg-good-bg text-good-fg font-mono text-xs px-3.5 py-1.5 rounded-full border border-good-fg/15 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
              {ev.modelYear} · {ev.connector} · {ev.segment}
            </div>
            <h1 className="font-serif text-4xl md:text-6xl font-medium tracking-tight text-ink mb-4 max-w-3xl leading-[1.05]">
              <em className="italic text-forest">{ev.fullName}</em> cost calculator
            </h1>
            <p className="text-ink-3 text-lg max-w-xl leading-relaxed mb-8">
              {ev.range}-mile EPA range · {ev.efficiency} mi/kWh efficiency · saves roughly{" "}
              <b className="text-forest">{fmt.money0(exSavings.annualSavings)}/yr</b> vs a {rav4.name} nationally.
            </p>

            {/* Spec cards */}
            <div className="flex flex-wrap gap-4 mb-6">
              {[
                { label: "EPA range",       val: `${ev.range} mi` },
                { label: "Efficiency",      val: `${ev.efficiency} mi/kWh` },
                { label: "Battery",         val: `${ev.battery} kWh` },
                { label: "Connector",       val: ev.connector },
                { label: "Starting MSRP",   val: fmt.money0(ev.msrp) },
                { label: "Federal credit",  val: ev.federalTaxCredit > 0 ? fmt.money0(ev.federalTaxCredit) : "None" },
              ].map((s) => (
                <div key={s.label} className="bg-paper border border-line rounded-xl px-4 py-3 text-sm">
                  <div className="font-serif text-lg font-medium text-forest">{s.val}</div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Savings preview */}
            <div className="flex flex-wrap gap-4">
              {[
                { label: "Annual savings vs RAV4", val: fmt.money0(exSavings.annualSavings), accent: true },
                { label: "5-year savings",          val: fmt.money0(exSavings.fiveYearSavings) },
                { label: "CO₂ saved / yr",          val: fmt.lbs(exCo2.savedLbs) },
                ...(breakEven ? [{ label: "Break-even vs RAV4", val: `${breakEven.years}y ${breakEven.months % 12}mo` }] : []),
              ].map((s) => (
                <div
                  key={s.label}
                  className={`rounded-xl px-4 py-3 text-sm border ${s.accent ? "bg-good-bg border-good-fg/20 text-good-fg" : "bg-paper border-line"}`}
                >
                  <div className={`font-serif text-lg font-medium ${s.accent ? "text-good-fg" : "text-forest"}`}>{s.val}</div>
                  <div className="font-mono text-[10px] uppercase tracking-widest opacity-60">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <SavingsSlotBand
          eyebrow={`${ev.brand} context`}
          title="Compare this EV against real-world savings examples"
          body={`Use the calculator below for your ${ev.name}, then sanity-check the range of savings other drivers can see by location and model.`}
        />

        {/* Calculator with this EV pre-selected */}
        <section className="py-12">
          <div className="section-wrap">
            <CalculatorShell evSummaries={evSummaries} gasVehicles={gasVehicles} defaultEvSlug={ev.slug} />
          </div>
        </section>

        {/* Similar EVs */}
        <section className="bg-paper border-t border-line py-12">
          <div className="section-wrap">
            <h2 className="font-serif text-2xl font-medium tracking-tight mb-6">
              Other {ev.brand} EVs
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {evRepository.getByBrand(ev.brand)
                .filter((e) => e.slug !== ev.slug)
                .slice(0, 6)
                .map((e) => (
                  <a
                    key={e.slug}
                    href={`/ev/${e.slug}`}
                    className="block bg-paper border border-line rounded-xl p-4 hover:border-emerald/40 transition-colors"
                  >
                    <div className="font-serif text-base font-medium text-ink mb-1">{e.name}</div>
                    <div className="flex gap-3 text-xs font-mono text-ink-mute">
                      <span>{e.range} mi</span>
                      <span>{e.efficiency} mi/kWh</span>
                      <span>{fmt.money0(e.msrp)}</span>
                    </div>
                  </a>
                ))}
            </div>
          </div>
        </section>

        <footer className="bg-ink text-cream/40 py-10 border-t border-white/10">
          <div className="section-wrap">
            <div className="flex flex-wrap justify-between items-center gap-4 text-xs font-mono">
              <span>© 2026 EV Charge Savings</span>
              <span className="text-cream/25 text-center max-w-2xl">
                Rate data from EIA Nov 2025 + AAA monthly averages. Calculations are estimates.
              </span>
              <span>evchargesavings.com</span>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
