import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { evRepository, gasRepository } from "@/features/ev-data/repository";
import { CalculatorShell } from "@/components/features/calculator/CalculatorShell";
import { LocationDetector } from "@/components/features/location/LocationDetector";
import { SavingsSlotBand } from "@/components/shared/SavingsSlotBand";
import { fmt } from "@/lib/format";

export const dynamicParams = true;

interface Props {
  params: Promise<{ comparison: string }>;
}

const NATIONAL_KWH_CENTS = 16.5;
const PUBLIC_RATE_MULTIPLIER = 2.5;
const DEFAULT_MILES = 15000;
const DEFAULT_HOME_PCT = 80;

const TOP_EV_IDS = [
  "t-my-lr-awd", "t-my-rwd", "t-m3-rwd", "t-m3-lr-awd",
  "h-i5-lr-rwd", "h-i6-lr-rwd", "k-ev6-lr-rwd", "k-ev9-wind",
  "f-mache-sr", "f-lt-sr", "c-bolt", "c-eq-lt",
  "vw-id4-pro", "bmw-i4-40", "cd-lyriq-rwd",
];

function parseComparison(slug: string): { ev1Slug: string; ev2Slug: string } | null {
  const sepIdx = slug.lastIndexOf("-vs-");
  if (sepIdx === -1) return null;
  return { ev1Slug: slug.slice(0, sepIdx), ev2Slug: slug.slice(sepIdx + 4) };
}

function annualChargingCost(efficiencyMiPerKwh: number): number {
  const annualKwh = DEFAULT_MILES / efficiencyMiPerKwh;
  const homeCost = annualKwh * (DEFAULT_HOME_PCT / 100) * (NATIONAL_KWH_CENTS / 100);
  const publicCost = annualKwh * ((100 - DEFAULT_HOME_PCT) / 100) * (NATIONAL_KWH_CENTS * PUBLIC_RATE_MULTIPLIER / 100);
  return homeCost + publicCost;
}

export function generateStaticParams() {
  const allEvs = evRepository.getAll();
  const top = TOP_EV_IDS.map(id => allEvs.find(e => e.id === id)).filter(Boolean);
  const params: { comparison: string }[] = [];
  for (let i = 0; i < top.length; i++) {
    for (let j = 0; j < top.length; j++) {
      if (i === j) continue;
      params.push({ comparison: `${top[i]!.slug}-vs-${top[j]!.slug}` });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { comparison } = await params;
  const parsed = parseComparison(comparison);
  if (!parsed) return {};
  const ev1 = evRepository.getBySlug(parsed.ev1Slug);
  const ev2 = evRepository.getBySlug(parsed.ev2Slug);
  if (!ev1 || !ev2) return {};
  const title = `${ev1.fullName} vs ${ev2.fullName}: Cost Comparison (2026)`;
  const description = `${ev1.fullName} vs ${ev2.fullName} — annual charging cost, range, efficiency, and price comparison at national average rates. Which EV costs less to own?`;
  return {
    title,
    description,
    alternates: { canonical: `/compare-evs/${comparison}` },
    openGraph: { title, description, url: `https://evchargesavings.com/compare-evs/${comparison}` },
  };
}

export default async function CompareEvsPage({ params }: Props) {
  const { comparison } = await params;
  const parsed = parseComparison(comparison);
  if (!parsed) notFound();

  const ev1 = evRepository.getBySlug(parsed.ev1Slug);
  const ev2 = evRepository.getBySlug(parsed.ev2Slug);
  if (!ev1 || !ev2) notFound();

  const ev1Cost = annualChargingCost(ev1.efficiency);
  const ev2Cost = annualChargingCost(ev2.efficiency);
  const annualDiff = Math.abs(ev1Cost - ev2Cost);
  const ev1Cheaper = ev1Cost <= ev2Cost;
  const cheaper = ev1Cheaper ? ev1 : ev2;
  const pricier = ev1Cheaper ? ev2 : ev1;
  const fiveYearSavings = annualDiff * 5;

  const msrpDiff = Math.abs(ev1.msrp - ev2.msrp);
  const msrpPremiumEv = ev1.msrp >= ev2.msrp ? ev1 : ev2;
  const premiumEvCost = msrpPremiumEv === ev1 ? ev1Cost : ev2Cost;
  const cheaperEvCost = msrpPremiumEv === ev1 ? ev2Cost : ev1Cost;
  const chargingSavingsForPricierEv = cheaperEvCost - premiumEvCost;
  const breakEvenYears = chargingSavingsForPricierEv > 50 ? msrpDiff / chargingSavingsForPricierEv : null;

  const evSummaries = evRepository.getSummaries();
  const gasVehicles = gasRepository.getAll();

  const title = `${ev1.fullName} vs ${ev2.fullName}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description: `Annual charging cost, range, and price comparison between ${ev1.fullName} and ${ev2.fullName}.`,
    url: `https://evchargesavings.com/compare-evs/${comparison}`,
    mainEntity: {
      "@type": "Dataset",
      name: title,
      variableMeasured: [
        { "@type": "PropertyValue", name: `${ev1.name} annual charging cost`, value: fmt.money0(ev1Cost) },
        { "@type": "PropertyValue", name: `${ev2.name} annual charging cost`, value: fmt.money0(ev2Cost) },
        { "@type": "PropertyValue", name: "Annual charging difference",        value: fmt.money0(annualDiff) },
      ],
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://evchargesavings.com" },
      { "@type": "ListItem", position: 2, name: "Compare EVs", item: "https://evchargesavings.com/guides" },
      { "@type": "ListItem", position: 3, name: title, item: `https://evchargesavings.com/compare-evs/${comparison}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <LocationDetector />

      <main>
        {/* Hero */}
        <section className="bg-paper border-b border-line py-16 md:py-24">
          <div className="section-wrap">
            <div className="inline-flex items-center gap-2 bg-good-bg text-good-fg font-mono text-xs px-3.5 py-1.5 rounded-full border border-good-fg/15 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
              EV vs EV · 2026 national rates
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-medium tracking-tight text-ink mb-4 max-w-3xl leading-[1.05]">
              <em className="italic text-forest">{ev1.fullName}</em>{" "}
              <span className="text-ink-mute">vs</span>{" "}
              <em className="italic text-forest">{ev2.fullName}</em>
            </h1>
            <p className="text-ink-3 text-lg max-w-xl leading-relaxed mb-8">
              {annualDiff < 30
                ? <>Both EVs cost nearly the same to charge — within {fmt.money0(annualDiff)}/yr at {DEFAULT_MILES.toLocaleString()} miles nationally.</>
                : <>The {cheaper.name} costs <b className="text-forest">{fmt.money0(annualDiff)}/yr less</b> to charge than the {pricier.name} at {DEFAULT_MILES.toLocaleString()} miles nationally.</>
              }
            </p>

            {/* Side-by-side cards */}
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              {[ev1, ev2].map((ev) => {
                const cost = ev === ev1 ? ev1Cost : ev2Cost;
                const isWinner = ev === cheaper && annualDiff >= 30;
                return (
                  <div key={ev.id} className={`rounded-2xl p-6 border ${isWinner ? "bg-good-bg border-good-fg/20" : "bg-paper border-line"}`}>
                    <div className={`font-mono text-[10px] uppercase tracking-widest mb-2 ${isWinner ? "text-good-fg/70" : "text-ink-mute"}`}>
                      {isWinner ? "Lower charging cost" : "Electric"}
                    </div>
                    <div className="font-serif text-xl font-medium text-ink mb-4">{ev.fullName}</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-ink-mute">Annual charging cost</span>
                        <b className={`font-mono ${isWinner ? "text-good-fg" : ""}`}>{fmt.money0(cost)}</b>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-ink-mute">Cost per mile</span>
                        <b className="font-mono">{((cost / DEFAULT_MILES) * 100).toFixed(1)}¢</b>
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
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary stats */}
            <div className="flex flex-wrap gap-4">
              {annualDiff >= 30 && (
                <>
                  <div className="rounded-xl px-4 py-3 text-sm border bg-good-bg border-good-fg/20">
                    <div className="font-serif text-lg font-medium text-good-fg">{fmt.money0(annualDiff)}/yr</div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute">Charging savings</div>
                  </div>
                  <div className="rounded-xl px-4 py-3 text-sm border bg-paper border-line">
                    <div className="font-serif text-lg font-medium text-forest">{fmt.money0(fiveYearSavings)}</div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute">5-year savings</div>
                  </div>
                </>
              )}
              <div className="rounded-xl px-4 py-3 text-sm border bg-paper border-line">
                <div className="font-serif text-lg font-medium text-forest">{Math.abs(ev1.range - ev2.range)} mi</div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute">Range difference</div>
              </div>
              {msrpDiff > 0 && (
                <div className="rounded-xl px-4 py-3 text-sm border bg-paper border-line">
                  <div className="font-serif text-lg font-medium text-forest">{fmt.money0(msrpDiff)}</div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute">Price difference</div>
                </div>
              )}
              {breakEvenYears && breakEvenYears > 0 && breakEvenYears < 15 && (
                <div className="rounded-xl px-4 py-3 text-sm border bg-paper border-line">
                  <div className="font-serif text-lg font-medium text-forest">{breakEvenYears.toFixed(1)} yrs</div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute">Charging break-even</div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Bar chart */}
        <section className="py-12 bg-ink text-cream">
          <div className="section-wrap">
            <div className="font-mono text-xs uppercase tracking-widest text-cream/50 mb-6">Annual charging cost at {DEFAULT_MILES.toLocaleString()} miles</div>
            {[{ label: ev1.name, val: ev1Cost }, { label: ev2.name, val: ev2Cost }].map((row) => {
              const max = Math.max(ev1Cost, ev2Cost, 1);
              return (
                <div key={row.label} className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-cream/70">{row.label}</span>
                    <span className="font-mono text-cream">{fmt.money0(row.val)}/yr</span>
                  </div>
                  <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-emerald" style={{ width: `${(row.val / max * 100).toFixed(1)}%` }} />
                  </div>
                </div>
              );
            })}
            <div className="mt-6 pt-4 border-t border-white/10 font-mono text-xs text-cream/40">
              National avg · {NATIONAL_KWH_CENTS}¢/kWh · 80% home charging
            </div>
          </div>
        </section>

        <SavingsSlotBand
          eyebrow="Your state changes the math"
          title="California and Louisiana have very different electricity rates."
          body={`The ${ev1.name} vs ${ev2.name} numbers above use national averages. Your actual costs depend on your state's electricity rate and how much you charge at home.`}
        />

        {/* Calculator */}
        <section className="py-12">
          <div className="section-wrap">
            <h2 className="font-serif text-2xl font-medium tracking-tight mb-6">
              Adjust for your state, miles, and charging mix
            </h2>
            <CalculatorShell
              evSummaries={evSummaries}
              gasVehicles={gasVehicles}
              defaultEvSlug={ev1.slug}
            />
          </div>
        </section>

        <footer className="bg-ink text-cream/40 py-10 border-t border-white/10">
          <div className="section-wrap">
            <div className="flex flex-wrap justify-between items-center gap-4 text-xs font-mono">
              <span>© 2026 EV Charge Savings</span>
              <span className="text-cream/25 text-center max-w-2xl">
                Rate data from EIA. Calculations are estimates — actual costs vary by state, charging behavior, and utility rate plan.
              </span>
              <span>evchargesavings.com</span>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
