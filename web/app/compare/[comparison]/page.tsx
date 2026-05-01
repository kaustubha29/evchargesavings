import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { evRepository, gasRepository } from "@/features/ev-data/repository";
import { calculateSavings } from "@/features/calculations/savings";
import { calculateCO2 } from "@/features/calculations/co2";
import { calculateBreakEven } from "@/features/calculations/break-even";
import { comparePageMeta } from "@/features/content/seo";
import { CalculatorShell } from "@/components/features/calculator/CalculatorShell";
import { LocationDetector } from "@/components/features/location/LocationDetector";
import { SavingsSlotBand } from "@/components/shared/SavingsSlotBand";
import { fmt } from "@/lib/format";

interface Props {
  params: Promise<{ comparison: string }>;
}

// Top EV slugs × top gas IDs to pre-build
const TOP_EV_SLUGS = [
  "t-my-lr-awd", "t-my-rwd", "t-m3-rwd", "t-m3-lr-awd",
  "h-i5-lr-rwd", "h-i6-lr-rwd", "k-ev6-lr-rwd", "k-ev9-awd",
  "f-mache-sr-rwd", "f-f150l-xlt", "r-r1t-dual", "r-r1s-dual",
  "c-bolt-euv", "c-blaze-ev", "vw-id4-pro-s", "n-ariya-fwd",
  "b-ix-xdrive50", "p-epa-lr-rwd", "lc-air-pure", "mb-eqs-450",
];
const TOP_GAS_IDS = [
  "toyota-rav4", "honda-cr-v", "toyota-camry", "ford-f150",
  "honda-civic", "chevy-silverado", "ford-explorer",
  "hyundai-tucson", "jeep-grand-cherokee", "bmw-x5",
];

function parseComparison(slug: string): { evSlug: string; gasId: string } | null {
  const sepIdx = slug.lastIndexOf("-vs-");
  if (sepIdx === -1) return null;
  return { evSlug: slug.slice(0, sepIdx), gasId: slug.slice(sepIdx + 4) };
}

export function generateStaticParams() {
  const params: { comparison: string }[] = [];
  for (const evSlug of TOP_EV_SLUGS) {
    for (const gasId of TOP_GAS_IDS) {
      params.push({ comparison: `${evSlug}-vs-${gasId}` });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { comparison } = await params;
  const parsed = parseComparison(comparison);
  if (!parsed) return {};
  const ev  = evRepository.getBySlug(parsed.evSlug);
  const gas = gasRepository.getById(parsed.gasId);
  if (!ev || !gas) return {};
  const { title, description } = comparePageMeta(ev.fullName, gas.name);
  return {
    title,
    description,
    alternates: { canonical: `/compare/${comparison}` },
    openGraph: { title, description, url: `/compare/${comparison}` },
  };
}

const NATIONAL_KWH_CENTS = 16.5;
const NATIONAL_GAS_DOLLAR = 3.45;
const DEFAULT_MILES = 15000;
const DEFAULT_HOME_PCT = 80;
const GAS_VEHICLE_MSRPS: Record<string, number> = {
  "toyota-rav4": 32000, "honda-cr-v": 31000, "toyota-camry": 27000,
  "ford-f150": 35000, "honda-civic": 24000, "chevy-silverado": 36000,
  "ford-explorer": 36000, "hyundai-tucson": 28000, "jeep-grand-cherokee": 40000,
  "bmw-x5": 67000,
};

export default async function ComparePage({ params }: Props) {
  const { comparison } = await params;
  const parsed = parseComparison(comparison);
  if (!parsed) notFound();

  const ev  = evRepository.getBySlug(parsed.evSlug);
  const gas = gasRepository.getById(parsed.gasId);
  if (!ev || !gas) notFound();

  const evSummaries = evRepository.getSummaries();
  const gasVehicles = gasRepository.getAll();

  const savings = calculateSavings({
    evEfficiency:   ev.efficiency,
    gasMpg:         gas.mpg,
    annualMiles:    DEFAULT_MILES,
    homePct:        DEFAULT_HOME_PCT,
    homeRateKwh:    NATIONAL_KWH_CENTS,
    publicRateKwh:  NATIONAL_KWH_CENTS * 2.5,
    gasPriceDollar: NATIONAL_GAS_DOLLAR,
  });
  const co2 = calculateCO2(DEFAULT_MILES, gas.mpg, savings.annualKwh);
  const gasMsrp = GAS_VEHICLE_MSRPS[gas.id] ?? 30000;
  const breakEven = calculateBreakEven(ev.msrp, gasMsrp, savings.annualSavings, ev.federalTaxCredit);

  const { title, description } = comparePageMeta(ev.fullName, gas.name);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: `https://evchargesavings.com/compare/${comparison}`,
    mainEntity: {
      "@type": "Dataset",
      name: `${ev.fullName} vs ${gas.name} cost comparison`,
      variableMeasured: [
        { "@type": "PropertyValue", name: "Annual EV fuel cost",  value: fmt.money0(savings.evAnnualCost) },
        { "@type": "PropertyValue", name: "Annual gas fuel cost", value: fmt.money0(savings.gasAnnualCost) },
        { "@type": "PropertyValue", name: "Annual savings",       value: fmt.money0(savings.annualSavings) },
      ],
    },
  };

  const isEvCheaper = savings.annualSavings > 0;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LocationDetector />

      <main>
        {/* Hero */}
        <section className="bg-paper border-b border-line py-16 md:py-24">
          <div className="section-wrap">
            <div className="inline-flex items-center gap-2 bg-good-bg text-good-fg font-mono text-xs px-3.5 py-1.5 rounded-full border border-good-fg/15 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
              EV vs Gas · 2026 national rates
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-medium tracking-tight text-ink mb-4 max-w-3xl leading-[1.05]">
              <em className="italic text-forest">{ev.fullName}</em>{" "}
              <span className="text-ink-mute">vs</span>{" "}
              {gas.name}
            </h1>
            <p className="text-ink-3 text-lg max-w-xl leading-relaxed mb-8">
              {isEvCheaper
                ? <>The {ev.name} saves <b className="text-forest">{fmt.money0(savings.annualSavings)}/yr</b> in fuel compared to the {gas.name} at 15,000 miles nationally.</>
                : <>At current rates, the {gas.name} costs less to fuel than the {ev.name} by {fmt.money0(-savings.annualSavings)}/yr.</>
              }
            </p>

            {/* Side-by-side cards */}
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              {/* EV card */}
              <div className="bg-good-bg border border-good-fg/20 rounded-2xl p-6">
                <div className="font-mono text-[10px] uppercase tracking-widest text-good-fg/70 mb-2">Electric</div>
                <div className="font-serif text-xl font-medium text-ink mb-4">{ev.fullName}</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-ink-mute">Annual fuel cost</span>
                    <b className="font-mono text-good-fg">{fmt.money0(savings.evAnnualCost)}</b>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-mute">Cost per mile</span>
                    <b className="font-mono">{(savings.evCostPerMile * 100).toFixed(1)}¢</b>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-mute">EPA range</span>
                    <b className="font-mono">{ev.range} mi</b>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-mute">Efficiency</span>
                    <b className="font-mono">{ev.efficiency} mi/kWh</b>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-mute">Connector</span>
                    <b className="font-mono">{ev.connector}</b>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-mute">Starting MSRP</span>
                    <b className="font-mono">{fmt.money0(ev.msrp)}</b>
                  </div>
                  {ev.federalTaxCredit > 0 && (
                    <div className="flex justify-between text-good-fg">
                      <span>Federal tax credit</span>
                      <b className="font-mono">−{fmt.money0(ev.federalTaxCredit)}</b>
                    </div>
                  )}
                </div>
              </div>

              {/* Gas card */}
              <div className="bg-paper border border-line rounded-2xl p-6">
                <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-2">Gas</div>
                <div className="font-serif text-xl font-medium text-ink mb-4">{gas.name}</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-ink-mute">Annual fuel cost</span>
                    <b className="font-mono text-rust">{fmt.money0(savings.gasAnnualCost)}</b>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-mute">Cost per mile</span>
                    <b className="font-mono">{(savings.gasCostPerMile * 100).toFixed(1)}¢</b>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-mute">Fuel economy</span>
                    <b className="font-mono">{gas.mpg} MPG</b>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-mute">Segment</span>
                    <b className="font-mono">{gas.type}</b>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-mute">Starting MSRP</span>
                    <b className="font-mono">{fmt.money0(gasMsrp)}</b>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary stats */}
            <div className="flex flex-wrap gap-6">
              {[
                { label: "Annual savings",  val: fmt.money0(savings.annualSavings),    accent: isEvCheaper },
                { label: "5-year savings",  val: fmt.money0(savings.fiveYearSavings),  accent: false },
                { label: "CO₂ saved / yr",  val: fmt.lbs(co2.savedLbs),               accent: false },
                ...(breakEven ? [{ label: "Break-even point", val: `${breakEven.years.toFixed(1)} yrs`, accent: false }] : []),
              ].map((s) => (
                <div
                  key={s.label}
                  className={`rounded-xl px-4 py-3 text-sm border ${s.accent ? "bg-good-bg border-good-fg/20" : "bg-paper border-line"}`}
                >
                  <div className={`font-serif text-lg font-medium ${s.accent ? "text-good-fg" : "text-forest"}`}>{s.val}</div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <SavingsSlotBand
          eyebrow="Comparison context"
          title="One matchup is useful. The wider savings range is better."
          body={`The ${ev.name} vs ${gas.name} estimate is a starting point. Nearby rates, charging mix, and the EV you choose can reshape the annual savings.`}
        />

        {/* Bar chart comparison */}
        <section className="py-12 bg-ink text-cream">
          <div className="section-wrap">
            <div className="font-mono text-xs uppercase tracking-widest text-cream/50 mb-6">Annual fuel cost at 15,000 miles</div>
            {[
              { label: gas.name,  val: savings.gasAnnualCost, color: "#c25234" },
              { label: ev.name,   val: savings.evAnnualCost,  color: "#34a960" },
            ].map((row) => {
              const max = Math.max(savings.gasAnnualCost, savings.evAnnualCost, 1);
              return (
                <div key={row.label} className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-cream/70">{row.label}</span>
                    <span className="font-mono text-cream">{fmt.money0(row.val)}/yr</span>
                  </div>
                  <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${(row.val / max * 100).toFixed(1)}%`, background: row.color }}
                    />
                  </div>
                </div>
              );
            })}
            <div className="mt-6 pt-4 border-t border-white/10 font-mono text-xs text-cream/40">
              National avg · {fmt.cents1(NATIONAL_KWH_CENTS)}/kWh · {fmt.money2(NATIONAL_GAS_DOLLAR)}/gal · 80% home charging
            </div>
          </div>
        </section>

        {/* Full interactive calculator */}
        <section className="py-12">
          <div className="section-wrap">
            <h2 className="font-serif text-2xl font-medium tracking-tight mb-6">
              Customize with your zip code and driving habits
            </h2>
            <CalculatorShell
              evSummaries={evSummaries}
              gasVehicles={gasVehicles}
              defaultEvSlug={ev.slug}
              defaultGasId={gas.id}
            />
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
