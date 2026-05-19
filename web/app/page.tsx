import { evRepository, gasRepository, phevRepository } from "@/features/ev-data/repository";
import { NATIONAL_AVG } from "@/features/location/data/states";
import { GUIDES } from "@/features/guides/data";
import { CalculatorShell } from "@/components/features/calculator/CalculatorShell";
import { LocationDetector } from "@/components/features/location/LocationDetector";
import { StickySavingsBar } from "@/components/shared/StickySavingsBar";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { ClickableSlot } from "@/components/shared/ClickableSlot";
import { ConditionalPostCalc } from "@/components/shared/ConditionalPostCalc";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Should You Switch to an EV? Calculate Your Savings — 2026",
  description:
    "Calculate EV charging cost, EV vs gas savings, home charger costs, and local incentives using 2026 electricity and gas rates for all 50 states.",
  alternates: { canonical: "/" },
};


export default function HomePage() {
  const evSummaries = evRepository.getSummaries();
  const gasVehicles  = gasRepository.getAll();
  const phevVehicles = phevRepository.getAll();
  const national = NATIONAL_AVG;

  return (
    <>
      <LocationDetector />
      <StickySavingsBar />

      <main>

        {/* HERO */}
        <section className="bg-paper border-b border-line py-14 md:py-20">
          <div className="section-wrap grid lg:grid-cols-[1.1fr_1fr] gap-12 items-center">
            <div>
              <a
                href="/guides/ev-tax-credit-7500"
                className="inline-flex items-center gap-2 bg-rust/10 text-rust border border-rust/20 font-mono text-[11px] px-3.5 py-1.5 rounded-full mb-5 hover:bg-rust/15 transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rust flex-shrink-0" />
                Federal $7,500 EV credit expired Oct 1, 2025 — what's still available →
              </a>
              <h1 className="font-serif text-5xl font-medium tracking-tight text-ink mb-4">
                Should you <em className="text-forest">switch to an EV?</em>
              </h1>
              <p className="text-ink-3 text-lg leading-relaxed">
                Pick any EV and your current car — we'll calculate exact fuel savings using live electricity and gas prices for your state.
              </p>
              <div className="flex flex-wrap gap-3 mt-5">
                <a
                  href="/how-we-calculate"
                  className="inline-flex items-center gap-2 text-ink-2 hover:text-forest border border-line hover:border-forest/40 bg-paper text-xs font-mono px-3.5 py-1.5 rounded-full transition-all"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald flex-shrink-0" />
                  How we calculate this →
                </a>
                <a
                  href="/ev-owner"
                  className="inline-flex items-center gap-2 text-ink-2 hover:text-forest border border-line hover:border-forest/40 bg-paper text-xs font-mono px-3.5 py-1.5 rounded-full transition-all"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  Already own an EV? →
                </a>
              </div>
            </div>

            <ClickableSlot />
          </div>
        </section>

        {/* TRUST STRIP */}
        <div className="border-b border-line bg-paper py-4">
          <div className="section-wrap">
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
              {[
                { icon: "📡", text: "Live EIA electricity + gas rates" },
                { icon: "🚗", text: "140+ EV models" },
                { icon: "📊", text: "EPA efficiency data" },
                { icon: "🔄", text: "Updated monthly" },
                { icon: "🔓", text: "Free, no account" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2 font-mono text-[11px] text-ink-mute whitespace-nowrap">
                  <span>{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>


        {/* CALCULATOR */}
        <section id="calculator" className="bg-cream-soft py-12">
          <div className="section-wrap">
            <CalculatorShell evSummaries={evSummaries} gasVehicles={gasVehicles} phevVehicles={phevVehicles} initialHomeRateKwh={national.kwhCents} initialGasPriceDollar={national.gasDollar} />
          </div>
        </section>

        <ConditionalPostCalc />

        {/* GUIDES */}
        <section className="bg-cream-soft border-b border-line py-16" id="guides">
          <div className="section-wrap">
            <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
              <div>
                <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-3">
                  EV guides
                </div>
                <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight text-ink">
                  Smarter EV decisions, minus the jargon
                </h2>
              </div>
              <a
                href="/guides"
                className="shrink-0 font-mono text-[11px] uppercase tracking-widest text-forest border border-forest/30 hover:border-forest hover:bg-forest/5 rounded-full px-4 py-2 transition-all whitespace-nowrap"
              >
                All {GUIDES.length} guides →
              </a>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 md:gap-3">
              {GUIDES.slice(0, 25).map((g, i) => (
                <a
                  key={g.slug}
                  href={`/guides/${g.slug}`}
                  className={`group relative overflow-hidden border border-line rounded-lg bg-paper p-3 min-h-28 md:min-h-32 flex-col hover:-translate-y-0.5 hover:border-forest/35 hover:shadow-1 transition-all ${i >= 10 ? "hidden sm:flex" : "flex"}`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-[9px] uppercase tracking-wide text-forest bg-forest/8 px-2 py-0.5 rounded-full truncate">
                      {g.category}
                    </span>
                    <span className="hidden sm:inline font-mono text-[9px] text-ink-mute whitespace-nowrap">
                      {g.readTime}
                    </span>
                  </div>

                  <h3 className="font-serif text-sm font-medium tracking-tight text-ink leading-snug group-hover:text-forest transition-colors">
                    {g.title}
                  </h3>

                  <p className="hidden lg:block text-xs text-ink-3 leading-relaxed mt-2 line-clamp-2">
                    {g.hook ?? g.description}
                  </p>

                  <div className="mt-auto pt-2 font-mono text-[9px] uppercase tracking-wide text-ink-mute group-hover:text-forest transition-colors">
                    Read →
                  </div>
                </a>
              ))}
            </div>

            <div className="mt-6 text-center">
              <a
                href="/guides"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-forest text-white hover:bg-emerald transition-colors"
              >
                Browse all {GUIDES.length} guides →
              </a>
            </div>
          </div>
        </section>

        <SiteFooter />

      </main>
    </>
  );
}
