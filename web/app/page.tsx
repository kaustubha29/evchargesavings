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

function AdSlot({
  label,
  size = "leaderboard",
}: {
  label: string;
  size?: "leaderboard" | "rectangle";
}) {
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

function LeadCaptureSection({ sourcePage, id }: { sourcePage: string; id?: string }) {
  return (
    <LeadCaptureBoxGate
      sourcePage={sourcePage}
      sectionId={id}
      sectionClassName="bg-cream-soft border-b border-line py-8"
      contentClassName="section-wrap"
    >
      <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-4">
        Need help with quotes?
      </div>
    </LeadCaptureBoxGate>
  );
}

export default function HomePage() {
  const evSummaries = evRepository.getSummaries();
  const gasVehicles = gasRepository.getAll();

  const chargingCards = [
    {
      level: "Level 1 · 120 V outlet",
      speed: "4–5 miles / hr",
      desc: "Plug directly into any standard household outlet. Zero installation cost — just run the cord.",
      note: "Best for: low-mileage commuters, condos, backup charging",
      cost: "Setup cost: $0",
      howto: "Use included EVSE cable in any standard outlet.",
    },
    {
      level: "Level 2 · 240 V / EVSE",
      speed: "20–35 miles / hr",
      desc: "Dedicated 240V circuit. Fully charges overnight for most EVs.",
      note: "Top picks: Grizzl-E, JuiceBox, Emporia, Tesla Wall Connector",
      cost: "Setup cost: $500–$1,500 installed",
      howto: "Licensed electrician installs 40–60A circuit.",
      best: true,
    },
    {
      level: "DC Fast · Public only",
      speed: "150–350 miles / hr",
      desc: "Ultra-fast charging for road trips. Not installable at home.",
      note: "Networks: Tesla Supercharger, EVgo, Electrify America",
      cost: "Not available for home installation",
      howto: "Use navigation apps like PlugShare or built-in EV routing.",
    },
  ];

  return (
    <>
      <LocationDetector />
      <StickySavingsBar />

      <main>

        {/* HERO */}
        <section className="bg-paper border-b border-line py-14 md:py-20">
          <div className="section-wrap grid lg:grid-cols-[1.1fr_1fr] gap-12 items-center">
            <div>
              <h1 className="font-serif text-5xl font-medium tracking-tight text-ink mb-4">
                Going electric <em className="text-forest">saves you thousands.</em>
              </h1>
              <p className="text-ink-3 text-lg">
                Compare real EV costs using live data.
              </p>
            </div>

            <SavingsSlot />
          </div>
        </section>

        {/* AD */}
        <div className="py-4 border-b border-line bg-cream-soft">
          <div className="section-wrap">
            <AdSlot label="728×90 leaderboard" />
          </div>
        </div>

        {/* CALCULATOR */}
        <section className="bg-cream-soft py-12">
          <div className="section-wrap">
            <CalculatorShell evSummaries={evSummaries} gasVehicles={gasVehicles} />
          </div>
        </section>

        <EVMarketplaceAffiliates />
        <EVInsuranceCTA />

        {/* LEAD */}
        <LeadCaptureSection sourcePage="/" id="installer-quotes" />

        {/* HOME CHARGING */}
        <section className="bg-ink text-cream py-16" id="home-charging">
          <div className="section-wrap">

            <div className="text-center mb-10">
              <div className="font-mono text-[11px] uppercase tracking-widest text-emerald mb-3">
                Home charging guide
              </div>

              <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight mb-3">
                How to charge <em>at home</em>
              </h2>

              <p className="text-cream/60 max-w-lg mx-auto">
                90% of EV charging happens overnight at home.
              </p>
            </div>

            {/* ✅ FIXED: stable rendering */}
            <div className="grid md:grid-cols-3 gap-5">
              {chargingCards.map((c) => (
                <div
                  key={c.level}
                  className={`rounded-2xl p-7 border relative ${
                    c.best
                      ? "border-emerald/40 bg-emerald/10"
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  {c.best && (
                    <span className="absolute top-4 right-4 bg-emerald text-white font-mono text-[10px] px-2 py-1 rounded-full">
                      Recommended
                    </span>
                  )}

                  <div className="font-mono text-[10px] uppercase tracking-widest text-cream/40 mb-2">
                    {c.level}
                  </div>

                  <div className="font-serif text-2xl font-medium text-cream mb-2">
                    {c.speed}
                  </div>

                  <p className="text-sm text-cream/60 mb-3">
                    {c.desc}
                  </p>

                  <p className="text-xs text-cream/40 mb-1">{c.note}</p>
                  <p className="text-xs text-cream/40 italic mb-3">
                    {c.howto}
                  </p>

                  <p className="font-mono text-xs text-emerald">
                    {c.cost}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </section>

        <HomeChargerProducts />

        {/* LEAD */}
        <LeadCaptureSection sourcePage="/" />

        <ChargingNetworkReferrals />
        <PublicChargingSection />

        {/* GUIDES */}
        <section className="bg-cream-soft border-b border-line py-16" id="guides">
          <div className="section-wrap">
            <div className="mb-6">
              <div>
                <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-3">
                  EV guides
                </div>
                <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight text-ink">
                  Smarter EV decisions, minus the jargon
                </h2>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {GUIDES.map((g) => (
                <a
                  key={g.slug}
                  href={`/guides/${g.slug}`}
                  className="group relative overflow-hidden border border-line rounded-xl bg-paper p-4 min-h-36 flex flex-col hover:-translate-y-0.5 hover:border-forest/35 hover:shadow-1 transition-all"
                >
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-forest bg-forest/8 px-2.5 py-1 rounded-full">
                      {g.category}
                    </span>
                    <span className="font-mono text-[10px] text-ink-mute">
                      {g.readTime}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-medium tracking-tight text-ink leading-snug group-hover:text-forest transition-colors">
                    {g.title}
                  </h3>

                  <p className="text-xs text-ink-3 leading-relaxed mt-2 line-clamp-2">
                    {g.hook ?? g.description}
                  </p>

                  <div className="mt-auto pt-3 font-mono text-[10px] uppercase tracking-widest text-ink-mute group-hover:text-forest transition-colors">
                    Read guide →
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <SiteFooter />

      </main>
    </>
  );
}
