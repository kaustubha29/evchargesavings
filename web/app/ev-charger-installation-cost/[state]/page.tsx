import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllStates, getStateBySlug } from "@/features/location/queries";
import { getInstallCost } from "@/features/location/data/installation-costs";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { LeadCaptureBoxGate } from "@/components/shared/LeadCaptureBoxGate";

interface Props {
  params: Promise<{ state: string }>;
}

export function generateStaticParams() {
  return getAllStates().filter((s) => s.code !== "US").map((s) => ({ state: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: stateSlug } = await params;
  const stateData = getStateBySlug(stateSlug);
  if (!stateData) return {};
  const cost = getInstallCost(stateData.code);
  return {
    title: `Level 2 EV Charger Installation Cost in ${stateData.name} (2026)`,
    description: `How much does a Level 2 EV charger installation cost in ${stateData.name}? Standard installs run $${cost.low.toLocaleString()}–$${cost.high.toLocaleString()}. Panel upgrade, permit costs, and the §30C tax credit explained.`,
    alternates: { canonical: `/ev-charger-installation-cost/${stateSlug}` },
  };
}

export default async function StateInstallCostPage({ params }: Props) {
  const { state: stateSlug } = await params;
  const stateData = getStateBySlug(stateSlug);
  if (!stateData || stateData.code === "US") notFound();

  const cost = getInstallCost(stateData.code);
  const netLow = Math.max(0, cost.low - 1000);
  const netHigh = Math.max(0, cost.high - 1000);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `How much does Level 2 EV charger installation cost in ${stateData.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `A standard Level 2 EV charger installation in ${stateData.name} costs approximately $${cost.low.toLocaleString()}–$${cost.high.toLocaleString()}, including labor, wiring, hardware, and permits. If your electrical panel needs an upgrade to support a new 240V circuit, expect to add $1,500–$3,500 to that figure.`,
        },
      },
      {
        "@type": "Question",
        name: "Does the federal tax credit apply to home EV charger installation?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes — the §30C credit covers 30% of charger hardware and installation costs, up to $1,000 per port. It applies to addresses in low-income or non-urban census tracts and expires June 30, 2026. Many suburban and rural addresses qualify — verify your address at the DOE eligibility tool.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need a permit to install a Level 2 charger?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "In most jurisdictions, yes — a licensed electrician should pull an electrical permit for any new 240V circuit installation. Permit costs typically run $50–$300 depending on your city or county. Permitted work is also required to claim the §30C tax credit.",
        },
      },
      {
        "@type": "Question",
        name: "How long does a Level 2 charger installation take?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A straightforward installation — existing panel, short wire run, no permit complications — typically takes 2–4 hours. Longer conduit runs, panel upgrades, or trenching for outdoor runs can take a full day or require a follow-up appointment after permit inspection.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <main className="bg-paper min-h-screen">

        {/* HERO */}
        <section className="border-b border-line py-14 md:py-20">
          <div className="section-wrap max-w-4xl">
            <a href="/ev-charger-installation-cost" className="font-mono text-xs text-ink-mute hover:text-forest mb-6 inline-block">
              ← Installation cost by state
            </a>
            <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-4">Installation cost · 2026</div>
            <h1 className="font-serif text-4xl md:text-5xl font-medium tracking-tight text-ink mb-4">
              Level 2 EV charger installation cost in {stateData.name}
            </h1>
            <p className="text-ink-3 text-lg leading-relaxed max-w-2xl">
              Standard installs in {stateData.name} run{" "}
              <strong className="text-ink">${cost.low.toLocaleString()}–${cost.high.toLocaleString()}</strong>.
              Panel upgrades add $1,500–$3,500. The §30C federal tax credit can offset up to $1,000 before it expires June 30, 2026.
            </p>
          </div>
        </section>

        {/* COST CARDS */}
        <section className="border-b border-line py-12">
          <div className="section-wrap max-w-4xl">
            <div className="grid sm:grid-cols-2 gap-5 mb-10">
              <div className="bg-cream-soft border border-line rounded-2xl p-6">
                <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-2">Standard install</div>
                <div className="font-serif text-3xl font-medium text-ink mb-1">
                  ${cost.low.toLocaleString()}–${cost.high.toLocaleString()}
                </div>
                <p className="text-xs text-ink-mute">Labor, wiring, hardware, permits. Short run from existing panel.</p>
              </div>
              <div className="bg-cream-soft border border-line rounded-2xl p-6">
                <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-2">With panel upgrade</div>
                <div className="font-serif text-3xl font-medium text-ink mb-1">
                  ${cost.panelLow.toLocaleString()}–${cost.panelHigh.toLocaleString()}
                </div>
                <p className="text-xs text-ink-mute">Includes upgrading electrical panel to support a new 240V circuit.</p>
              </div>
            </div>

            <h2 className="font-serif text-xl font-medium text-ink mb-4">What drives the cost</h2>
            <div className="space-y-4">
              {[
                {
                  label: "Electrician labor",
                  detail: `Labor is the largest variable. ${stateData.name} is a ${
                    ["CA","NY","WA","MA","CT","HI","AK","NJ","IL","MD","OR","CO","MN","NH","RI","VT","ME"].includes(stateData.code)
                      ? "higher-labor-cost state — licensed electricians typically charge $100–$150/hr"
                      : ["AL","MS","AR","WV","SD","ND","IA","KS","KY","LA","MO","NE","OH","OK","SC","TN","WY","IN"].includes(stateData.code)
                      ? "lower-labor-cost state — licensed electricians typically charge $65–$95/hr"
                      : "mid-range labor market — licensed electricians typically charge $85–$120/hr"
                  }. A straightforward install takes 2–4 hours.`,
                },
                {
                  label: "Wire run length",
                  detail: "Cost scales quickly with distance from your panel to the garage. A 10-ft run costs far less than 50 ft of conduit through finished walls or exterior routing.",
                },
                {
                  label: "Electrical permit",
                  detail: `Most jurisdictions in ${stateData.name} require a permit for new 240V circuit work. Permit fees typically run $50–$300 depending on the city or county.`,
                },
                {
                  label: "Panel capacity",
                  detail: "If your existing panel doesn't have a free 50A double-pole breaker slot, you'll either need a panel upgrade ($1,500–$3,500) or a sub-panel. Homes built before 1990 more often need this.",
                },
                {
                  label: "Charger hardware",
                  detail: "A quality 40A Level 2 charger runs $229–$699. Hardwired chargers are typically $50–$100 less than smart Wi-Fi models but require a licensed electrician regardless.",
                },
              ].map(({ label, detail }) => (
                <div key={label} className="pl-4 border-l-2 border-forest/30">
                  <div className="font-semibold text-sm text-ink mb-0.5">{label}</div>
                  <div className="text-sm text-ink-3">{detail}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 30C CREDIT */}
        <section className="border-b border-line py-12 bg-cream-soft">
          <div className="section-wrap max-w-4xl">
            <div className="bg-forest/8 border border-forest/25 rounded-2xl p-6 md:p-8">
              <div className="font-mono text-[10px] uppercase tracking-widest text-forest mb-3">Expires June 30, 2026</div>
              <h2 className="font-serif text-2xl font-medium text-ink mb-3">§30C tax credit: cut up to $1,000 off your install</h2>
              <p className="text-sm text-ink-3 leading-relaxed mb-6">
                The Alternative Fuel Vehicle Refueling Property Credit covers 30% of total charger + installation costs,
                up to $1,000 per port, for equipment placed in service by June 30, 2026. It applies to addresses in
                low-income or non-urban census tracts — many suburban and rural addresses in {stateData.name} qualify.
              </p>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  ["Standard install (after credit)", `$${netLow.toLocaleString()}–$${netHigh.toLocaleString()}*`],
                  ["Credit amount", "30% up to $1,000"],
                  ["Deadline", "June 30, 2026"],
                ].map(([k, v]) => (
                  <div key={k} className="bg-paper border border-line rounded-xl p-4">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-1">{k}</div>
                    <div className="font-serif text-base font-medium text-ink">{v}</div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-ink-mute mt-4">* Assumes full $1,000 credit. Verify address eligibility at the DOE census tract tool — not all addresses qualify.</p>
            </div>
          </div>
        </section>

        {/* LEAD FORM */}
        <section className="border-b border-line py-12">
          <div className="section-wrap max-w-4xl">
            <h2 className="font-serif text-2xl font-medium text-ink mb-2">Get quotes from {stateData.name} electricians</h2>
            <p className="text-sm text-ink-3 mb-6">
              Prices vary by zip code, panel condition, and run length. Get actual quotes before budgeting.
            </p>
            <LeadCaptureBoxGate
              sourcePage={`/ev-charger-installation-cost/${stateSlug}`}
              defaultIntent={["charger"]}
              availableIntents={["charger"]}
              heading={`Get Level 2 installation quotes in ${stateData.name}`}
              description="Enter your ZIP and we'll match you with up to three licensed electricians in your area — free, no obligation."
              submitLabel="Get quotes"
              successMessage="Got it — you'll hear from licensed electricians in your area within 24 hours."
            />
          </div>
        </section>

        {/* FAQ */}
        <section className="border-b border-line py-12 bg-cream-soft">
          <div className="section-wrap max-w-4xl">
            <h2 className="font-serif text-2xl font-medium text-ink mb-6">Common questions</h2>
            <div className="space-y-6">
              {faqJsonLd.mainEntity.map((q) => (
                <div key={q.name} className="border-b border-line pb-6 last:border-0 last:pb-0">
                  <h3 className="font-serif text-base font-medium text-ink mb-2">{q.name}</h3>
                  <p className="text-sm text-ink-3 leading-relaxed">{q.acceptedAnswer.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* RELATED */}
        <section className="py-12">
          <div className="section-wrap max-w-4xl">
            <h2 className="font-serif text-xl font-medium text-ink mb-4">Related</h2>
            <div className="flex flex-wrap gap-3">
              <a href="/best-home-ev-charger" className="text-sm text-forest underline">Best home EV chargers 2026</a>
              <span className="text-ink-mute">·</span>
              <a href={`/ev-cost/${stateData.slug}`} className="text-sm text-forest underline">EV charging cost in {stateData.name}</a>
              <span className="text-ink-mute">·</span>
              <a href="/guides/level-2-charger-cost-breakdown" className="text-sm text-forest underline">Level 2 installation cost breakdown guide</a>
            </div>
          </div>
        </section>

      </main>
      <SiteFooter />
    </>
  );
}
