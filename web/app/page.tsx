import { evRepository, gasRepository } from "@/features/ev-data/repository";
import { GUIDES } from "@/features/guides/data";
import { CalculatorShell } from "@/components/features/calculator/CalculatorShell";
import { LocationDetector } from "@/components/features/location/LocationDetector";
import { PublicChargingSection } from "@/components/features/networks/PublicChargingSection";
import { StickySavingsBar } from "@/components/shared/StickySavingsBar";
import { LeadCaptureBox } from "@/components/shared/LeadCaptureBox";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { SavingsSlot } from "@/components/shared/SavingsSlot";
import { HomeChargerProducts } from "@/components/shared/HomeChargerProducts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EV Charge Savings — How Much Will You Save Going Electric?",
  description:
    "See exactly how much an EV would save you in your zip code. Real 2026 electricity and gas rates for all 50 US states, 130+ EV models.",
};

function AdSlot({ label, size = "leaderboard" }: { label: string; size?: "leaderboard" | "rectangle" }) {
  const dims = size === "leaderboard"
    ? "h-24 w-full max-w-3xl"
    : "h-64 w-full max-w-sm";
  return (
    <div className={`mx-auto ${dims} border-2 border-dashed border-line rounded-xl flex flex-col items-center justify-center gap-1 bg-cream-soft`}>
      <span className="font-mono text-[10px] uppercase tracking-widest text-ink-mute">Advertisement</span>
      <span className="font-mono text-[9px] text-ink-mute/60">{label}</span>
    </div>
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
              {/* Left: headline */}
              <div>
                <h1 className="font-serif font-medium tracking-tight text-ink mb-4 overflow-visible" style={{ fontSize: "clamp(2.25rem,6vw,3.75rem)", lineHeight: 1.15 }}>
                  <span className="block">Going electric</span>
                  <em className="block italic text-forest">saves you thousands.</em>
                </h1>
                <p className="text-ink-3 text-lg max-w-xl leading-relaxed">
                  How much exactly? Pick your EV and your current car — get your number in seconds, using live rates for your state.
                </p>
              </div>

              {/* Right: savings slot */}
              <div>
                <SavingsSlot />
              </div>
            </div>

            {/* Full-width trust pill */}
            <div className="mt-10 flex items-center justify-center bg-good-bg border border-good-fg/15 rounded-full px-5 py-2">
              {/* Mobile: show only the 3 most important items */}
              <div className="flex sm:hidden items-center gap-0 font-mono text-[10px] text-good-fg">
                <span className="flex items-center gap-1.5 pr-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse flex-shrink-0" />
                  2026 rates
                </span>
                {["50 states + DC", "130+ EV models"].map((item) => (
                  <span key={item} className="flex items-center text-good-fg/70">
                    <span className="px-2 text-good-fg/30">·</span>
                    {item}
                  </span>
                ))}
              </div>
              {/* Desktop: all items */}
              <div className="hidden sm:flex items-center gap-0 font-mono text-xs text-good-fg">
                <span className="flex items-center gap-1.5 pr-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse flex-shrink-0" />
                  2026 rates
                </span>
                {["US EIA + AAA data", "50 states + DC", "130+ EV models", "Free forever", "No signup"].map((item) => (
                  <span key={item} className="flex items-center text-good-fg/70">
                    <span className="px-3 text-good-fg/30">·</span>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Ad: leaderboard above calculator ── */}
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

        {/* ── How to charge at home ── */}
        <section className="bg-ink text-cream py-16" id="home-charging">
          <div className="section-wrap">
            <div className="text-center mb-10">
              <div className="font-mono text-[11px] uppercase tracking-widest text-emerald mb-3">Home charging guide</div>
              <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight mb-3">
                How to charge <em>at home</em>
              </h2>
              <p className="text-cream/60 max-w-lg mx-auto">
                90% of EV charging happens overnight at home. Here&apos;s what each level actually means for your routine.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  level: "Level 1 · 120 V outlet",
                  speed: "4–5 miles / hr",
                  desc: "Plug directly into any standard household outlet. Zero installation cost — just run the cord. Works fine if you drive under 40 miles a day.",
                  note: "Best for: low-mileage commuters, condo dwellers, secondary EVs",
                  cost: "Setup cost: $0",
                  howto: "Use the included EVSE cable — plug into any standard 120 V outlet.",
                },
                {
                  level: "Level 2 · 240 V / EVSE",
                  speed: "20–35 miles / hr",
                  desc: "A dedicated 240 V circuit with a wall-mounted charger. Most EVs charge fully in 6–10 hours overnight — wake up to a full battery every morning.",
                  note: "Top picks: Grizzl-E, JuiceBox 40, Emporia Energy, Tesla Wall Connector",
                  cost: "Setup cost: $500–$1,500 installed",
                  howto: "Have a licensed electrician run a 50 A circuit; mount charger 18″ from ground.",
                  best: true,
                },
                {
                  level: "DC Fast · Public only",
                  speed: "150–350 miles / hr",
                  desc: "DCFC requires commercial 3-phase power — not available for homes. Use it at highway corridors and retail locations for a quick top-up on road trips.",
                  note: "Networks: Tesla Supercharger, Electrify America, EVgo, ChargePoint",
                  cost: "Not available for home installation",
                  howto: "Find stations via PlugShare, ABRP, or your car's built-in nav.",
                },
              ].map((c) => (
                <div key={c.level} className={`rounded-2xl p-7 border relative ${c.best ? "border-emerald/40 bg-emerald/10" : "border-white/10 bg-white/5"}`}>
                  {c.best && (
                    <span className="absolute top-4 right-4 bg-emerald text-white font-mono text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                      Recommended
                    </span>
                  )}
                  <div className="font-mono text-[10px] uppercase tracking-widest text-cream/40 mb-2">{c.level}</div>
                  <div className="font-serif text-2xl font-medium text-cream mb-2">{c.speed}</div>
                  <p className="text-sm text-cream/60 leading-relaxed mb-3">{c.desc}</p>
                  <p className="text-xs text-cream/40 mb-1">{c.note}</p>
                  <p className="text-xs text-cream/40 italic mb-3">{c.howto}</p>
                  <p className="font-mono text-xs text-emerald">{c.cost}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <HomeChargerProducts />

        {/* ── Level 2 installer quotes ── */}
        <section className="bg-cream-soft border-b border-line py-14" id="installer-quotes">
          <div className="section-wrap">
            <div className="mb-8">
              <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-3">Level 2 installation</div>
              <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight mb-3">What does Level 2 installation actually cost?</h2>
              <p className="text-ink-3 max-w-xl leading-relaxed">
                Most homeowners pay <b className="text-ink">$800–$1,500 all-in</b>. The main variables are your panel&apos;s available amperage, cable run distance, and local permit fees.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-5 mb-8">
              {[
                {
                  tier: "Simple install",
                  range: "$500–$900",
                  tag: "Panel nearby, 50 A available",
                  items: [
                    "Existing 200 A panel with open slot",
                    "Charger within 20 ft of panel",
                    "No trenching or conduit needed",
                    "Permit included in most markets",
                  ],
                },
                {
                  tier: "Typical install",
                  range: "$900–$1,500",
                  tag: "Most suburban homes",
                  items: [
                    "Panel upgrade or sub-panel addition",
                    "20–60 ft cable run in conduit",
                    "EVSE hardware ($300–$600)",
                    "Permit + inspection (~$150–$300)",
                  ],
                  best: true,
                },
                {
                  tier: "Complex install",
                  range: "$1,500–$3,000+",
                  tag: "Older homes, long runs, condos",
                  items: [
                    "Full 200 A panel upgrade required",
                    "Trenching across driveway or yard",
                    "HOA approval or shared metering",
                    "Time-of-use rate program enrollment",
                  ],
                },
              ].map((t) => (
                <div key={t.tier} className={`rounded-2xl p-6 border ${t.best ? "border-forest/30 bg-forest/5" : "border-line bg-paper"}`}>
                  {t.best && (
                    <div className="font-mono text-[10px] uppercase tracking-widest text-forest mb-2">Most common</div>
                  )}
                  <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-1">{t.tier}</div>
                  <div className="font-serif text-3xl font-medium text-ink mb-1">{t.range}</div>
                  <div className="text-xs text-ink-mute italic mb-4">{t.tag}</div>
                  <ul className="space-y-2">
                    {t.items.map((item) => (
                      <li key={item} className="text-sm text-ink-2 flex gap-2">
                        <span className="text-forest font-bold flex-shrink-0">·</span>{item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Ad: rectangle inside installer section */}
            <div className="flex justify-center mb-8">
              <AdSlot label="300×250 · in-content rectangle" size="rectangle" />
            </div>

            <LeadCaptureBox />
            <p className="text-xs text-ink-mute mt-4 font-mono">
              Prefer to browse yourself?{" "}
              <a href="https://www.angi.com/nearme/ev-charger-installation" target="_blank" rel="noopener noreferrer" className="underline hover:text-forest">Angi</a>
              {" "}and{" "}
              <a href="https://www.thumbtack.com/k/ev-charger-installation/near-me" target="_blank" rel="noopener noreferrer" className="underline hover:text-forest">Thumbtack</a>
              {" "}also list vetted electricians by zip.
            </p>
          </div>
        </section>

        {/* ── Where to plug in on the road (includes live network ranking) ── */}
        <PublicChargingSection />

        {/* ── Ad: leaderboard between road charging and connectors ── */}
        <div className="py-6 border-b border-line bg-cream-soft">
          <div className="section-wrap">
            <AdSlot label="728×90 · between sections" size="leaderboard" />
          </div>
        </div>

        {/* ── NACS, CCS & CHAdeMO explained ── */}
        <section className="bg-cream-soft border-b border-line py-14" id="connectors">
          <div className="section-wrap">
            <div className="mb-8">
              <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-3">Connector guide</div>
              <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight mb-3">NACS, CCS & CHAdeMO explained</h2>
              <p className="text-ink-3 max-w-xl leading-relaxed">
                Three different plugs, one charging-network world. Here&apos;s which connector your EV uses and where you can plug in.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  name: "NACS",
                  full: "North American Charging Standard",
                  badge: "Becoming the standard",
                  badgeColor: "bg-good-bg text-good-fg",
                  desc: "Originally Tesla's proprietary connector, now adopted as the North American standard by Ford, GM, Rivian, Honda, Toyota, Volvo, and more. Works on Superchargers natively.",
                  brands: "Tesla · Ford · GM · Rivian · Honda · BMW · Volvo · Polestar",
                  networks: "Tesla Supercharger (native) · EA · EVgo · ChargePoint (with adapter)",
                  speed: "Up to 250 kW",
                },
                {
                  name: "CCS",
                  full: "Combined Charging System (Combo 1)",
                  badge: "Most common today",
                  badgeColor: "bg-blue-50 text-blue-700",
                  desc: "The incumbent DC fast-charge standard used by most non-Tesla EVs. Combines AC Level 2 and DC fast-charge into one plug. All major networks support it.",
                  brands: "Hyundai · Kia · VW · Audi · Porsche · Mercedes · Nissan Ariya · Lucid",
                  networks: "Electrify America · EVgo · ChargePoint · BP Pulse · Blink (all native)",
                  speed: "Up to 350 kW",
                },
                {
                  name: "CHAdeMO",
                  full: "CHArge de MOve",
                  badge: "Legacy / fading",
                  badgeColor: "bg-okay-bg text-okay-fg",
                  desc: "Japanese DC fast-charge standard used primarily by the Nissan Leaf. Network support is shrinking — many stations have removed CHAdeMO stalls.",
                  brands: "Nissan Leaf (2011–2025) · older Mitsubishi i-MiEV",
                  networks: "EVgo · ChargePoint · Blink (select locations only)",
                  speed: "Up to 62 kW",
                },
              ].map((c) => (
                <div key={c.name} className="bg-paper border border-line rounded-2xl p-6">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="font-serif text-2xl font-bold text-ink">{c.name}</div>
                      <div className="text-xs text-ink-mute">{c.full}</div>
                    </div>
                    <span className={`font-mono text-[9px] uppercase tracking-wide px-2.5 py-1 rounded-full whitespace-nowrap ${c.badgeColor}`}>{c.badge}</span>
                  </div>
                  <p className="text-sm text-ink-2 leading-relaxed mb-4">{c.desc}</p>
                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="font-mono text-[9px] uppercase tracking-widest text-ink-mute mb-1">Car brands</div>
                      <div className="text-ink-2">{c.brands}</div>
                    </div>
                    <div>
                      <div className="font-mono text-[9px] uppercase tracking-widest text-ink-mute mb-1">Compatible networks</div>
                      <div className="text-ink-2">{c.networks}</div>
                    </div>
                    <div className="font-mono text-xs text-forest">{c.speed} max</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Guides ── */}
        <section className="bg-cream-soft border-b border-line py-14" id="guides">
          <div className="section-wrap">
            <div className="mb-8">
              <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-3">EV guides</div>
              <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight mb-2">Everything you need to know</h2>
              <p className="text-ink-3 max-w-xl">Quick guides that answer the questions every new EV owner has — before they buy.</p>
            </div>

            {/* Ad: rectangle inside guides (sidebar-style on desktop) */}
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="grid sm:grid-cols-2 gap-4 flex-1">
                {GUIDES.map((g) => (
                  <a
                    key={g.slug}
                    href={`/guides/${g.slug}`}
                    className="block bg-paper border border-line rounded-2xl p-5 hover:border-forest/40 hover:shadow-1 transition-all group"
                  >
                    <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-2">{g.readTime}</div>
                    <div className="font-serif text-base font-medium text-ink mb-2 group-hover:text-forest transition-colors leading-snug">{g.title}</div>
                    <p className="text-sm text-ink-3 leading-relaxed">{g.description}</p>
                    <div className="font-mono text-[10px] text-forest mt-3 group-hover:underline">Read guide →</div>
                  </a>
                ))}
              </div>

              {/* Ad: 300×600 half-page beside guide cards on desktop */}
              <div className="hidden lg:flex flex-col gap-4 w-72 flex-shrink-0">
                <AdSlot label="300×250 · sidebar rectangle" size="rectangle" />
                <AdSlot label="300×250 · sidebar rectangle 2" size="rectangle" />
              </div>
            </div>
          </div>
        </section>

        {/* ── Ad: leaderboard above footer ── */}
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
