import { evRepository, gasRepository } from "@/features/ev-data/repository";
import { GUIDES } from "@/features/guides/data";
import { CalculatorShell } from "@/components/features/calculator/CalculatorShell";
import { LocationDetector } from "@/components/features/location/LocationDetector";
import { PublicChargingSection } from "@/components/features/networks/PublicChargingSection";
import { StickySavingsBar } from "@/components/shared/StickySavingsBar";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { SavingsSlot } from "@/components/shared/SavingsSlot";
import { HomeChargerProducts } from "@/components/shared/HomeChargerProducts";
import { ChargingNetworkReferrals } from "@/components/shared/ChargingNetworkReferrals";
import { LeadCaptureBoxGate } from "@/components/shared/LeadCaptureBoxGate";
import { EVInsuranceCTA } from "@/components/shared/EVInsuranceCTA";
import { EVMarketplaceAffiliates } from "@/components/shared/EVMarketplaceAffiliates";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EV Charge Savings — How Much Will You Save Going Electric?",
  description:
    "See exactly how much an EV would save you in your zip code. Real 2026 electricity and gas rates for all 50 US states, 130+ EV models.",
};

function AdSlot({ label, size = "leaderboard" }: { label: string; size?: "leaderboard" | "rectangle" }) {
  const dims =
    size === "leaderboard"
      ? "h-24 w-full max-w-3xl"
      : "h-64 w-full max-w-sm";

  return (
    <div
      className={`mx-auto ${dims} border-2 border-dashed border-line rounded-xl flex flex-col items-center justify-center gap-1 bg-cream-soft`}
    >
      <span className="font-mono text-[10px] uppercase tracking-widest text-ink-mute">
        Advertisement
      </span>
      <span className="font-mono text-[9px] text-ink-mute/60">{label}</span>
    </div>
  );
}

/** Unified lead capture (keeps original large layout feel) */
function LeadCaptureSection({ sourcePage }: { sourcePage: string }) {
  return (
    <section className="bg-cream-soft border-b border-line py-14">
      <div className="section-wrap">
        <div className="mt-12">
          <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-4">
            Need help with quotes?
          </div>
          <LeadCaptureBoxGate sourcePage={sourcePage} />
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const evSummaries = evRepository.getSummaries();
  const gasVehicles = gasRepository.getAll();

  return (
    <>
      <LocationDetector />
      <StickySavingsBar />

      <main>

        {/* ── Hero ── */}
        <section className="bg-paper border-b border-line py-14 md:py-20">
          <div className="section-wrap">
            <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 items-center">
              <div>
                <h1
                  className="font-serif font-medium tracking-tight text-ink mb-4 overflow-visible"
                  style={{ fontSize: "clamp(2.25rem,6vw,3.75rem)", lineHeight: 1.15 }}
                >
                  <span className="block">Going electric</span>
                  <em className="block italic text-forest">saves you thousands.</em>
                </h1>

                <p className="text-ink-3 text-lg max-w-xl leading-relaxed">
                  How much exactly? Pick your EV and your current car — get your number in seconds, using live rates for your state.
                </p>
              </div>

              <div>
                <SavingsSlot />
              </div>
            </div>
          </div>
        </section>

        {/* ── Ad ── */}
        <div className="py-4 border-b border-line bg-cream-soft">
          <div className="section-wrap">
            <AdSlot label="728×90 · leaderboard" size="leaderboard" />
          </div>
        </div>

        {/* ── Calculator ── */}
        <section className="bg-cream-soft py-12">
          <div className="section-wrap">
            <CalculatorShell evSummaries={evSummaries} gasVehicles={gasVehicles} />
          </div>
        </section>

        <EVMarketplaceAffiliates />
        <EVInsuranceCTA />

        {/* ── Lead capture #1 ── */}
        <LeadCaptureSection sourcePage="/" />

        {/* ── Home charging ── */}
        <section className="bg-ink text-cream py-16" id="home-charging">
          <div className="section-wrap">
            <div className="text-center mb-10">
              <div className="font-mono text-[11px] uppercase tracking-widest text-emerald mb-3">
                Home charging guide
              </div>

              <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight mb-3">
                Home charging explained
              </h2>

              <p className="text-cream/60 max-w-lg mx-auto">
                90% of EV charging happens overnight at home.
              </p>
            </div>
          </div>
        </section>

        <HomeChargerProducts />

        {/* ── Lead capture #2 ── */}
        <LeadCaptureSection sourcePage="/" />

        <ChargingNetworkReferrals />
        <PublicChargingSection />

        {/* ── Guides (RESTORED) ── */}
        <section className="bg-cream-soft border-b border-line py-14" id="guides">
          <div className="section-wrap">
            <div className="mb-8">
              <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-3">
                EV guides
              </div>

              <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight mb-2">
                Everything you need to know
              </h2>

              <p className="text-ink-3 max-w-xl">
                Quick guides that answer the questions every new EV owner has — before they buy.
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 flex-1">
                {GUIDES.map((g) => (
                  <a
                    key={g.slug}
                    href={`/guides/${g.slug}`}
                    className="block bg-paper border border-line rounded-2xl p-4 hover:border-forest/40 hover:shadow-1 transition-all group"
                  >
                    <div className="font-mono text-[9px] uppercase tracking-widest text-ink-mute mb-1">
                      {g.readTime}
                    </div>

                    <div className="font-serif text-sm font-semibold text-ink mb-1 group-hover:text-forest transition-colors leading-tight">
                      {g.title}
                    </div>

                    <p className="text-sm text-ink-3 leading-tight">
                      {g.description}
                    </p>

                    <div className="font-mono text-[10px] text-forest mt-3 group-hover:underline">
                      Read guide →
                    </div>
                  </a>
                ))}
              </div>

              <div className="hidden lg:flex flex-col gap-4 w-72 flex-shrink-0">
                <AdSlot label="300×250 · sidebar rectangle" size="rectangle" />
                <AdSlot label="300×250 · sidebar rectangle 2" size="rectangle" />
              </div>
            </div>
          </div>
        </section>

        {/* ── Footer ad ── */}
        <div className="py-6 bg-paper border-t border-line">
          <div className="section-wrap">
            <AdSlot label="728×90 · above footer" size="leaderboard" />
          </div>
        </div>

        <SiteFooter />
      </main>
    </>
  );
}