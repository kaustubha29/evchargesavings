import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { UTILITIES, getUtilityBySlug } from "@/features/location/data/utilities";
import { getStateData } from "@/features/location/queries";
import { enrichState } from "@/features/location/live-rates";
import { evRepository } from "@/features/ev-data/repository";
import { calculateSavings } from "@/features/calculations/savings";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { StickySavingsBar } from "@/components/shared/StickySavingsBar";
import { fmt } from "@/lib/format";

const BASE = "https://www.evchargesavings.com";

interface Props { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return UTILITIES.map((u) => ({ slug: u.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const utility = getUtilityBySlug(slug);
  if (!utility) return {};
  const rawState = getStateData(utility.stateCode);
  const { state } = await enrichState(rawState);
  const title = `${utility.shortName} EV Charging Cost — ${utility.stateName} (${state.kwhCents.toFixed(1)}¢/kWh)`;
  const description = `Home EV charging cost for ${utility.name} customers. ${utility.stateName} residential rate: ${state.kwhCents.toFixed(1)}¢/kWh. Cost per mile, full charge cost, and annual savings vs gas.${utility.touProgram ? ` Includes ${utility.touProgram} TOU plan info.` : ""}`;
  return {
    title,
    description,
    alternates: { canonical: `/utility/${slug}` },
    openGraph: { title, description, url: `/utility/${slug}`, type: "article" },
  };
}

const EXAMPLE_EVS = [
  { slug: "tesla-model-y-long-range-awd",     label: "Tesla Model Y LR AWD" },
  { slug: "hyundai-ioniq-5-long-range-rwd",   label: "Hyundai Ioniq 5 LR RWD" },
  { slug: "chevrolet-equinox-ev-lt-fwd",      label: "Chevy Equinox EV LT" },
  { slug: "kia-ev6-long-range-rwd",           label: "Kia EV6 LR RWD" },
  { slug: "ford-mustang-mach-e-standard-rwd", label: "Ford Mach-E Standard" },
];

const ANNUAL_MILES = 13500;
const HOME_PCT = 100;

export default async function UtilityPage({ params }: Props) {
  const { slug } = await params;
  const utility = getUtilityBySlug(slug);
  if (!utility) notFound();

  const rawState = getStateData(utility.stateCode);
  const { state, elecPeriod } = await enrichState(rawState);

  const modelY = evRepository.getBySlug("tesla-model-y-long-range-awd")!;
  const costPerMileModelY = (state.kwhCents / 100) / modelY.efficiency;
  const fullChargeModelY = (state.kwhCents / 100) * modelY.battery;
  const annualCostModelY = costPerMileModelY * ANNUAL_MILES;

  type EvExample = { label: string; slug: string; battery: number; efficiency: number; fullCharge: number; costPerMile: number; annualCost: number };
  const evExamples: EvExample[] = EXAMPLE_EVS.flatMap((e) => {
    const ev = evRepository.getBySlug(e.slug);
    if (!ev) return [];
    return [{
      label: e.label,
      slug: e.slug,
      battery: ev.battery,
      efficiency: ev.efficiency,
      fullCharge: (state.kwhCents / 100) * ev.battery,
      costPerMile: (state.kwhCents / 100) / ev.efficiency,
      annualCost: ((state.kwhCents / 100) / ev.efficiency) * ANNUAL_MILES,
    }];
  });

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `How much does it cost to charge an EV with ${utility.shortName}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `At ${utility.stateName}'s residential electricity rate of ${state.kwhCents.toFixed(1)}¢/kWh (EIA ${elecPeriod}), charging costs roughly ${(costPerMileModelY * 100).toFixed(1)}¢ per mile and ${fmt.money2(fullChargeModelY)} for a full charge of a 75 kWh EV like the Tesla Model Y. Annual charging cost at 13,500 miles is approximately ${fmt.money0(annualCostModelY)}.`,
        },
      },
      ...(utility.touProgram ? [{
        "@type": "Question",
        name: `Does ${utility.shortName} have a special EV rate?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes. ${utility.shortName} offers the ${utility.touProgram} time-of-use rate for EV owners. ${utility.touNote ?? ""} Visit ${utility.ratePageUrl} to check eligibility and enroll.`,
        },
      }] : []),
      {
        "@type": "Question",
        name: `What is the cheapest time to charge an EV on ${utility.shortName}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${utility.touProgram ? `On ${utility.shortName}'s ${utility.touProgram} time-of-use plan, off-peak hours (typically overnight) offer the lowest rates. Check ${utility.ratePageUrl} for current off-peak windows.` : `${utility.shortName} residential rates are relatively flat. Check the utility's website for any available TOU plans.`}`,
        },
      },
    ],
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${utility.shortName} EV Charging Cost — ${utility.stateName}`,
    description: `Home EV charging cost for ${utility.name} customers using ${utility.stateName} EIA residential rates.`,
    url: `${BASE}/utility/${slug}`,
    image: [`${BASE}/opengraph-image`],
    datePublished: "2026-05-01T08:00:00Z",
    dateModified: "2026-05-18T08:00:00Z",
    author: { "@type": "Person", name: "Kaustubha", url: `${BASE}/about` },
    publisher: { "@type": "Organization", name: "EV Charge Savings", url: BASE },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE },
      { "@type": "ListItem", position: 2, name: "EV Owner", item: `${BASE}/ev-owner` },
      { "@type": "ListItem", position: 3, name: `${utility.shortName} — ${utility.stateName}`, item: `${BASE}/utility/${slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <StickySavingsBar />
      <main className="bg-paper min-h-screen">

        {/* Hero */}
        <div className="bg-ink text-cream">
          <div className="section-wrap py-14 max-w-4xl">
            <div className="font-mono text-[10px] uppercase tracking-widest text-emerald mb-4">
              {utility.stateName} · Utility Guide
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-medium tracking-tight mb-4" style={{ lineHeight: 1.1 }}>
              {utility.shortName} EV Charging Cost
            </h1>

            {/* AI-extractable answer block */}
            <div className="bg-white/10 border border-white/20 rounded-2xl px-5 py-4 mb-6 max-w-2xl">
              <p className="text-cream text-sm leading-relaxed">
                <strong>{utility.shortName} customers pay {state.kwhCents.toFixed(1)}¢/kWh</strong> ({utility.stateName} residential avg, EIA {elecPeriod}).
                Home EV charging costs <strong>{(costPerMileModelY * 100).toFixed(1)}¢ per mile</strong> and{" "}
                <strong>{fmt.money2(fullChargeModelY)}</strong> for a full 75 kWh charge (Tesla Model Y).
                Annual cost at 13,500 miles: <strong>{fmt.money0(annualCostModelY)}</strong>.
              </p>
            </div>

            <p className="text-cream/70 text-sm max-w-xl leading-relaxed">
              {utility.serviceArea}
            </p>
          </div>
        </div>

        <div className="section-wrap py-12 max-w-4xl">

          {/* Key stats */}
          <section className="mb-12">
            <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-5">
              {utility.shortName} charging cost — {elecPeriod}
            </div>
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-cream-soft border border-line rounded-2xl p-5">
                <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-1">Electricity rate</div>
                <div className="font-serif text-3xl font-medium text-ink">{state.kwhCents.toFixed(1)}¢</div>
                <div className="text-xs text-ink-3 mt-1">per kWh · {utility.stateName} residential avg</div>
              </div>
              <div className="bg-cream-soft border border-line rounded-2xl p-5">
                <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-1">Cost per mile</div>
                <div className="font-serif text-3xl font-medium text-forest">{(costPerMileModelY * 100).toFixed(1)}¢</div>
                <div className="text-xs text-ink-3 mt-1">Model Y LR AWD (3.6 mi/kWh)</div>
              </div>
              <div className="bg-cream-soft border border-line rounded-2xl p-5">
                <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-1">Full charge (75 kWh)</div>
                <div className="font-serif text-3xl font-medium text-ink">{fmt.money2(fullChargeModelY)}</div>
                <div className="text-xs text-ink-3 mt-1">Tesla Model Y at home</div>
              </div>
            </div>
          </section>

          {/* TOU program */}
          {utility.touProgram && (
            <section className="bg-forest/5 border border-forest/25 rounded-2xl p-6 mb-12">
              <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-3">
                EV rate plan — {utility.touProgram}
              </div>
              <h2 className="font-serif text-xl font-medium text-ink mb-2">
                {utility.shortName} has a dedicated EV rate
              </h2>
              <p className="text-sm text-ink-3 leading-relaxed mb-4">{utility.touNote}</p>
              <a
                href={utility.ratePageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-forest hover:underline"
              >
                View {utility.shortName} EV rate details →
              </a>
            </section>
          )}

          {/* Cost table by EV */}
          <section className="mb-12">
            <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-5">
              Charging cost by EV · {utility.shortName} rate
            </div>
            <div className="overflow-x-auto rounded-2xl border border-line">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-cream-soft border-b border-line">
                    <th className="text-left px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-ink-mute">EV Model</th>
                    <th className="text-right px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-ink-mute">Battery</th>
                    <th className="text-right px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-ink-mute">Full charge</th>
                    <th className="text-right px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-ink-mute">¢/mile</th>
                    <th className="text-right px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-ink-mute">Annual cost*</th>
                  </tr>
                </thead>
                <tbody>
                  {evExamples.map((ev, i) => (
                    <tr key={ev.slug} className={`border-b border-line-soft hover:bg-cream-soft/50 transition-colors ${i % 2 === 0 ? "" : "bg-cream-soft/30"}`}>
                      <td className="px-4 py-2.5 font-medium text-ink">
                        <a href={`/cost-to-charge/${ev.slug}/${utility.stateSlug}`} className="hover:text-forest transition-colors">
                          {ev.label}
                        </a>
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono text-sm text-ink-2">{ev.battery} kWh</td>
                      <td className="px-4 py-2.5 text-right font-mono text-sm text-ink-2">{fmt.money2(ev.fullCharge)}</td>
                      <td className="px-4 py-2.5 text-right font-mono text-sm text-ink-2">{(ev.costPerMile * 100).toFixed(1)}¢</td>
                      <td className="px-4 py-2.5 text-right font-mono text-sm font-medium text-forest">{fmt.money0(ev.annualCost)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-ink-mute mt-3">
              * Annual cost at 13,500 miles, 100% home charging, {utility.stateName} residential rate {state.kwhCents.toFixed(1)}¢/kWh (EIA {elecPeriod}).
              Actual {utility.shortName} rates vary by tier and may differ from the state average used here.
            </p>
          </section>

          {/* Methodology */}
          <section className="bg-cream-soft border border-line rounded-2xl p-6 mb-12">
            <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-3">Data note</div>
            <p className="text-sm text-ink-3 leading-relaxed">
              Charging costs above use the <strong>{utility.stateName} statewide residential average</strong> from EIA Form EIA-861 ({elecPeriod} actuals).
              {utility.shortName} actual rates may differ by tier, territory, and plan. For exact current rates, visit{" "}
              <a href={utility.website} target="_blank" rel="noopener noreferrer" className="text-forest hover:underline">{utility.website.replace("https://", "")}</a>.
              {utility.touProgram && ` EV owners on the ${utility.touProgram} time-of-use plan will see different rates by time of day — overnight charging is typically cheaper.`}
            </p>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-5">Frequently asked</div>
            <div className="space-y-4">
              {[
                {
                  q: `How much does it cost to charge an EV with ${utility.shortName}?`,
                  a: `At ${utility.stateName}'s residential rate of ${state.kwhCents.toFixed(1)}¢/kWh (EIA ${elecPeriod}), home EV charging costs ${(costPerMileModelY * 100).toFixed(1)}¢ per mile and ${fmt.money2(fullChargeModelY)} for a full 75 kWh charge. Annual cost at 13,500 miles is about ${fmt.money0(annualCostModelY)}.`,
                },
                ...(utility.touProgram ? [{
                  q: `Does ${utility.shortName} have a special EV electricity rate?`,
                  a: `Yes — ${utility.shortName} offers the ${utility.touProgram} plan for EV owners. ${utility.touNote ?? ""} Visit the utility's website to enroll.`,
                }] : []),
                {
                  q: `Is it cheaper to charge an EV or fill up with gas in ${utility.stateName}?`,
                  a: `At ${utility.stateName}'s electricity rate of ${state.kwhCents.toFixed(1)}¢/kWh and gas at ${fmt.money2(state.gasDollar)}/gal, EVs are typically significantly cheaper per mile. Use the calculator below for a side-by-side comparison with your specific vehicles.`,
                },
              ].map((item) => (
                <div key={item.q} className="border border-line rounded-2xl p-5">
                  <div className="font-medium text-ink mb-2 text-sm">{item.q}</div>
                  <p className="text-sm text-ink-3 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Links */}
          <section className="mb-12">
            <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-5">Related</div>
            <div className="grid sm:grid-cols-2 gap-4">
              <a href={`/ev-cost/${utility.stateSlug}`} className="block bg-paper border border-line rounded-2xl p-5 hover:border-forest/40 transition-all group">
                <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-2">State data</div>
                <div className="font-serif text-base font-medium text-ink group-hover:text-forest transition-colors">EV savings in {utility.stateName} →</div>
                <p className="text-xs text-ink-3 mt-1">Full calculator with all EVs and gas cars</p>
              </a>
              <a href="/guides/time-of-use-rates" className="block bg-paper border border-line rounded-2xl p-5 hover:border-forest/40 transition-all group">
                <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-2">Guide</div>
                <div className="font-serif text-base font-medium text-ink group-hover:text-forest transition-colors">Time-of-use electricity rates →</div>
                <p className="text-xs text-ink-3 mt-1">How TOU plans can cut charging costs 30–60%</p>
              </a>
            </div>
          </section>

          {/* Calculator CTA */}
          <div className="bg-ink text-cream rounded-3xl p-8">
            <div className="font-mono text-[10px] uppercase tracking-widest text-emerald mb-3">Free calculator</div>
            <h3 className="font-serif text-2xl font-medium mb-2">See your exact savings</h3>
            <p className="text-cream/60 text-sm leading-relaxed mb-6 max-w-lg">
              Pick your EV, your current gas car, and {utility.stateName} — get a personalised annual savings estimate using EIA rate data.
            </p>
            <a
              href={`/ev-cost/${utility.stateSlug}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-forest text-white border border-forest hover:bg-emerald hover:border-emerald transition-all"
            >
              Open {utility.stateName} calculator →
            </a>
          </div>

        </div>
      </main>
      <SiteFooter />
    </>
  );
}
