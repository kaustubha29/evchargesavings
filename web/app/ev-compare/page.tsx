import type { Metadata } from "next";
import { evRepository } from "@/features/ev-data/repository";
import { getAllStates } from "@/features/location/queries";
import { NATIONAL_AVG } from "@/features/location/data/states";
import { GUIDES } from "@/features/guides/data";
import { EVComparatorTool } from "@/components/features/ev-comparator/EVComparatorTool";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { LeadCaptureBoxGate } from "@/components/shared/LeadCaptureBoxGate";
import { EVMarketplaceAffiliates } from "@/components/shared/EVMarketplaceAffiliates";
import { EVInsuranceCTA } from "@/components/shared/EVInsuranceCTA";
import { HomeChargingSection } from "@/components/shared/HomeChargingSection";
import { HomeChargerProductsPersonalized } from "@/components/shared/HomeChargerProductsPersonalized";
import { PublicChargingSection } from "@/components/features/networks/PublicChargingSection";

const BASE = "https://www.evchargesavings.com";

export const metadata: Metadata = {
  title: "EV vs EV Comparison Tool — Compare Any Two Electric Cars (2026)",
  description:
    "Compare any two EVs side by side — annual charging cost, range, efficiency, battery size, and MSRP. Adjust for your state's electricity rate and driving miles.",
  alternates: { canonical: "/ev-compare" },
  openGraph: {
    title: "EV vs EV Comparison Tool — Compare Any Two Electric Cars (2026)",
    description: "Compare any two EVs side by side with live state electricity rates.",
    url: `${BASE}/ev-compare`,
  },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Which EV has the lowest charging cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Charging cost depends on efficiency (mi/kWh) and your local electricity rate. Highly efficient EVs like the Hyundai Ioniq 6 Long Range RWD (4.0 mi/kWh) and Tesla Model 3 Long Range RWD (4.0 mi/kWh) cost the least to charge. Use this tool to compare any two EVs with your state's actual electricity rate.",
      },
    },
    {
      "@type": "Question",
      name: "What is the most cost-effective EV to own?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Total cost of ownership includes charging costs, MSRP, and depreciation. For lowest charging cost, the most efficient EVs win — typically the Ioniq 6, Model 3 Long Range, or Chevy Equinox EV. For lowest purchase price plus charging cost combined, smaller EVs like the Chevy Bolt EV or Nissan Leaf are strong options.",
      },
    },
    {
      "@type": "Question",
      name: "How does electricity rate affect EV charging cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Electricity rate is the biggest variable in EV charging cost. A California driver paying 33¢/kWh pays more than twice as much to charge as a Louisiana driver paying 13¢/kWh, for the same EV and same miles. Always use your state's actual rate — this tool applies EIA state-level electricity prices.",
      },
    },
  ],
};

export default function EVComparePage() {
  const evSummaries = evRepository.getSummaries();
  const allEvs = evRepository.getAll();
  const states = getAllStates();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <main className="bg-paper min-h-screen">

        {/* HERO */}
        <section className="border-b border-line py-16 md:py-24 bg-ink text-cream overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-forest/30 via-transparent to-transparent pointer-events-none" />
          <div className="section-wrap max-w-4xl relative">
            <div className="inline-flex items-center gap-2 bg-forest/20 border border-forest/30 font-mono text-[11px] px-3.5 py-1.5 rounded-full mb-6 text-emerald">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
              {states.length} states · live EIA electricity rates
            </div>
            <h1 className="font-serif text-5xl md:text-6xl font-medium tracking-tight text-cream mb-5 leading-[1.0]">
              Compare any<br />
              <em className="text-emerald italic">two EVs</em>
            </h1>
            <p className="text-cream/60 text-lg leading-relaxed max-w-xl mb-8">
              Real charging cost side-by-side — adjusted for your state&apos;s electricity rate, your miles, and your home charging split. Not national averages.
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              {[
                { n: "141", label: "EV models" },
                { n: `${states.length}`, label: "states covered" },
                { n: "12", label: "metrics compared" },
              ].map(({ n, label }) => (
                <div key={label} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                  <div className="font-serif text-2xl font-medium text-cream">{n}</div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-cream/40">{label}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                "Annual charging cost", "Cost per mile", "5-yr charging total",
                "EPA range", "0–60 mph", "DC fast charge",
                "10–80% charge time", "Battery size", "Efficiency",
                "Connector type", "Starting MSRP", "5-yr TCO",
              ].map((m) => (
                <span key={m} className="font-mono text-[10px] uppercase tracking-widest bg-white/5 border border-white/10 text-cream/50 px-3 py-1 rounded-full">
                  {m}
                </span>
              ))}</div>
          </div>
        </section>

        {/* TOOL */}
        <section className="py-10">
          <div className="section-wrap max-w-4xl">
            <EVComparatorTool
              evSummaries={evSummaries}
              allEvs={allEvs}
              states={states}
              nationalAvg={NATIONAL_AVG}
            />
          </div>
        </section>

        {/* POST-COMPARISON FLOW: mirrors home page after calculator */}
        <EVMarketplaceAffiliates />
        <EVInsuranceCTA />
        <LeadCaptureBoxGate
          sourcePage="/ev-compare"
          sectionId="installer-quotes"
          sectionClassName="bg-cream-soft border-b border-line py-8"
          contentClassName="section-wrap"
          heading="Lock in your home charging setup"
          description="Get matched with up to 3 licensed electricians for Level 2 charger installation in your area."
          submitLabel="Get installer quotes"
        />
        <HomeChargingSection />
        <HomeChargerProductsPersonalized />
        <LeadCaptureBoxGate
          sourcePage="/ev-compare"
          sectionClassName="bg-cream-soft border-b border-line py-8"
          contentClassName="section-wrap"
        />
        <PublicChargingSection />

        {/* GUIDES — EV buying & ownership focus */}
        <section className="bg-cream-soft border-b border-line py-16">
          <div className="section-wrap">
            <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
              <div>
                <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-3">EV guides</div>
                <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight text-ink">
                  Smarter EV decisions, minus the jargon
                </h2>
              </div>
              <a href="/guides" className="shrink-0 font-mono text-[11px] uppercase tracking-widest text-forest border border-forest/30 hover:border-forest hover:bg-forest/5 rounded-full px-4 py-2 transition-all whitespace-nowrap">
                All {GUIDES.length} guides →
              </a>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 md:gap-3">
              {GUIDES
                .filter((g) => ["Buying", "Ownership", "Charging", "Savings", "Installation", "Driving", "Finance"].includes(g.category))
                .slice(0, 25)
                .map((g, i) => (
                  <a key={g.slug} href={`/guides/${g.slug}`}
                    className={`group relative overflow-hidden border border-line rounded-lg bg-paper p-3 min-h-28 md:min-h-32 flex-col hover:-translate-y-0.5 hover:border-forest/35 hover:shadow-1 transition-all ${i >= 10 ? "hidden sm:flex" : "flex"}`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-mono text-[9px] uppercase tracking-wide text-forest bg-forest/8 px-2 py-0.5 rounded-full truncate">{g.category}</span>
                      <span className="hidden sm:inline font-mono text-[9px] text-ink-mute whitespace-nowrap">{g.readTime}</span>
                    </div>
                    <h3 className="font-serif text-sm font-medium tracking-tight text-ink leading-snug group-hover:text-forest transition-colors">{g.title}</h3>
                    <p className="hidden lg:block text-xs text-ink-3 leading-relaxed mt-2 line-clamp-2">{g.hook ?? g.description}</p>
                    <div className="mt-auto pt-2 font-mono text-[9px] uppercase tracking-wide text-ink-mute group-hover:text-forest transition-colors">Read →</div>
                  </a>
                ))}
            </div>
            <div className="mt-6 text-center">
              <a href="/guides" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-forest text-white hover:bg-emerald transition-colors">
                Browse all {GUIDES.length} guides →
              </a>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-line py-12 bg-paper">
          <div className="section-wrap max-w-4xl">
            <h2 className="font-serif text-2xl font-medium text-ink mb-6">Common questions</h2>
            <div className="space-y-6">
              {faqLd.mainEntity.map((q) => (
                <div key={q.name} className="border-b border-line pb-6 last:border-0 last:pb-0">
                  <h3 className="font-serif text-base font-medium text-ink mb-2">{q.name}</h3>
                  <p className="text-sm text-ink-3 leading-relaxed">{q.acceptedAnswer.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <SiteFooter />
    </>
  );
}
