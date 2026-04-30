import { evRepository, gasRepository } from "@/features/ev-data/repository";
import { CalculatorShell } from "@/components/features/calculator/CalculatorShell";
import { LocationDetector } from "@/components/features/location/LocationDetector";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EV Charge Savings — How Much Will You Save Going Electric?",
  description:
    "See exactly how much an EV would save you in your zip code. Real 2026 electricity and gas rates for all 50 US states, 130+ EV models.",
};

export default function HomePage() {
  const evSummaries = evRepository.getSummaries();
  const gasVehicles = gasRepository.getAll();

  return (
    <>
      <LocationDetector />
      <main>

        {/* ── Hero ── */}
        <section className="bg-paper border-b border-line py-14 md:py-20">
          <div className="section-wrap">
            <div className="inline-flex items-center gap-2 bg-good-bg text-good-fg font-mono text-xs px-3.5 py-1.5 rounded-full border border-good-fg/15 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
              2026 rates · 50 states · 130+ EV models
            </div>
            {/* Two-line headline — keeps italic text on its own line so descenders aren't clipped */}
            <h1 className="font-serif font-medium tracking-tight text-ink mb-4 max-w-2xl overflow-visible" style={{ fontSize:"clamp(2.25rem,6vw,3.75rem)", lineHeight:1.15 }}>
              <span className="block">How much would going</span>
              <em className="block italic text-forest">electric save you?</em>
            </h1>
            <p className="text-ink-3 text-lg max-w-xl leading-relaxed">
              Real electricity and gas rates for your state. Pick your EV and your current car — see the savings instantly.
            </p>
          </div>
        </section>

        {/* ── Calculator ── */}
        <section className="py-12">
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
                  howto: "Plug the included EVSE into your dryer-style outlet or standard 120 V.",
                },
                {
                  level: "Level 2 · 240 V / EVSE",
                  speed: "20–35 miles / hr",
                  desc: "A dedicated 240 V circuit with a wall-mounted charger. Most EVs charge fully in 6–10 hours overnight — wake up to a full battery every morning.",
                  note: "Top picks: Grizzl-E, JuiceBox 40, Emporia Energy, Tesla Wall Connector",
                  cost: "Setup cost: $500–$1,500 installed",
                  howto: "Have a licensed electrician run a 50 A circuit; mount charger 18\" from ground.",
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

        {/* ── Level 2 installer quotes ── */}
        <section className="bg-paper border-b border-line py-14" id="installer-quotes">
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
            <div className="bg-cream-soft rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="font-serif text-lg font-medium text-ink mb-1">Get free quotes from local electricians</div>
                <p className="text-sm text-ink-3">Compare 3–5 quotes in your area — prices vary significantly by region.</p>
              </div>
              <div className="flex gap-3 flex-wrap">
                <a href="https://www.angi.com/nearme/ev-charger-installation" target="_blank" rel="noopener noreferrer"
                  className="btn-primary text-sm px-5 py-2.5">
                  Angi quotes
                </a>
                <a href="https://www.thumbtack.com/k/ev-charger-installation/near-me" target="_blank" rel="noopener noreferrer"
                  className="btn-ghost text-sm px-5 py-2.5">
                  Thumbtack quotes
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── Where to plug in on the road ── */}
        <section className="bg-paper border-b border-line py-14" id="public-charging">
          <div className="section-wrap">
            <div className="mb-8">
              <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-3">Public charging</div>
              <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight mb-3">Where to plug in on the road</h2>
              <p className="text-ink-3 max-w-xl leading-relaxed">
                The US now has over 175,000 public charging outlets. Finding one is easier than finding a gas station — once you know which apps to use.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {[
                {
                  name: "PlugShare",
                  type: "App · Free",
                  desc: "Crowdsourced map of every charger in North America. Real-time availability, check-in reviews, and photos of each location.",
                  tag: "Best overall finder",
                  tagColor: "bg-good-bg text-good-fg",
                },
                {
                  name: "ABRP",
                  type: "App · Free / $3/mo",
                  desc: "A Better Route Planner. Enter your destination and it plans charging stops automatically, accounting for elevation, speed, and weather.",
                  tag: "Best for road trips",
                  tagColor: "bg-blue-50 text-blue-700",
                },
                {
                  name: "Tesla Supercharger",
                  type: "Network · NACS + CCS",
                  desc: "50,000+ stalls globally. Now open to non-Tesla EVs with CCS adapters. Fastest and most reliable network in the US.",
                  tag: "Fastest network",
                  tagColor: "bg-good-bg text-good-fg",
                },
                {
                  name: "Electrify America",
                  type: "Network · CCS + NACS",
                  desc: "Largest DC fast-charge network outside Tesla. Located at Walmart, Target, and along major interstate corridors. Up to 350 kW.",
                  tag: "Widest coverage",
                  tagColor: "bg-okay-bg text-okay-fg",
                },
                {
                  name: "ChargePoint",
                  type: "Network · CCS",
                  desc: "Largest charging network by station count. Strong in cities and workplace charging, plus hotel destination chargers across the US.",
                  tag: "Best in cities",
                  tagColor: "bg-blue-50 text-blue-700",
                },
                {
                  name: "EVgo",
                  type: "Network · CCS + NACS",
                  desc: "Urban-focused fast chargers, often located at grocery stores and shopping centers. Good for quick top-ups while running errands.",
                  tag: "Best for errands",
                  tagColor: "bg-okay-bg text-okay-fg",
                },
              ].map((n) => (
                <div key={n.name} className="bg-paper border border-line rounded-2xl p-5">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <div className="font-serif text-base font-medium text-ink">{n.name}</div>
                      <div className="font-mono text-[10px] text-ink-mute uppercase tracking-wide">{n.type}</div>
                    </div>
                    <span className={`font-mono text-[9px] uppercase tracking-wide px-2 py-0.5 rounded-full whitespace-nowrap ${n.tagColor}`}>{n.tag}</span>
                  </div>
                  <p className="text-sm text-ink-3 leading-relaxed">{n.desc}</p>
                </div>
              ))}
            </div>
            <div className="bg-ink text-cream rounded-2xl p-6">
              <div className="font-mono text-[11px] uppercase tracking-widest text-emerald mb-3">Pro tips for fast charging</div>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  "Charge to 80% on DC fast chargers — the last 20% charges at half the speed.",
                  "Plan stops before you hit 20% battery — charging anxiety is real and avoidable.",
                  "Check-in reports on PlugShare before you arrive; out-of-order stalls are common.",
                  "Precondition your battery while still plugged in on cold mornings — saves 20–30% range.",
                ].map((tip) => (
                  <div key={tip} className="flex gap-3 text-sm text-cream/70">
                    <span className="text-emerald font-bold flex-shrink-0 mt-0.5">→</span>
                    {tip}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── NACS, CCS & CHAdeMO explained ── */}
        <section className="bg-cream-soft border-b border-line py-14" id="connectors">
          <div className="section-wrap">
            <div className="mb-8">
              <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-3">Connector guide</div>
              <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight mb-3">NACS, CCS & CHAdeMO explained</h2>
              <p className="text-ink-3 max-w-xl leading-relaxed">
                Three different plugs, one charging network world. Here&apos;s which connector your EV uses and where you can plug in.
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
                  brands: "Hyundai · Kia · VW · Audi · Porsche · Mercedes · Nissan Ariya · Lucid · Rivian (older)",
                  networks: "Electrify America · EVgo · ChargePoint · BP Pulse · Blink (all native)",
                  speed: "Up to 350 kW",
                },
                {
                  name: "CHAdeMO",
                  full: "CHArge de MOve",
                  badge: "Legacy / fading",
                  badgeColor: "bg-okay-bg text-okay-fg",
                  desc: "Japanese DC fast-charge standard used primarily by the Nissan Leaf. Network support is shrinking — many stations have removed CHAdeMO stalls. The Leaf will transition to NACS.",
                  brands: "Nissan Leaf (2011–2025) · older Mitsubishi i-MiEV",
                  networks: "EVgo · ChargePoint (select locations) · Blink (select locations)",
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

        {/* ── Product links ── */}
        <section className="bg-paper border-b border-line py-14" id="products">
          <div className="section-wrap">
            <div className="mb-8">
              <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-3">EV gear</div>
              <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight mb-2">Gear worth buying</h2>
              <p className="text-ink-3 max-w-xl">The chargers, adapters, and accessories that actually make EV ownership easier.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  name: "Grizzl-E Classic 40A",
                  cat: "Level 2 charger",
                  price: "$279",
                  desc: "The no-frills workhorse. Built in Canada, outdoor-rated, 40 A / 9.6 kW. No subscription, no app required. Just plug in and charge.",
                  tag: "Best value",
                  url: "https://www.amazon.com/s?k=grizzl-e+classic+40a",
                },
                {
                  name: "JuiceBox 40",
                  cat: "Level 2 charger · Smart",
                  price: "$399",
                  desc: "Wi-Fi connected, 40 A, works with utility TOU schedules. Schedule charging to off-peak hours from the app. Energy Star certified.",
                  tag: "Best smart charger",
                  url: "https://www.amazon.com/s?k=juicebox+40+ev+charger",
                },
                {
                  name: "Tesla Wall Connector (Gen 3)",
                  cat: "Level 2 charger · NACS",
                  price: "$449",
                  desc: "The best charger for Tesla and NACS-equipped EVs. 48 A, Wi-Fi enabled, load-sharing for multi-car households. Sleek and reliable.",
                  tag: "Best for Tesla / NACS",
                  url: "https://www.amazon.com/s?k=tesla+wall+connector+gen+3",
                },
                {
                  name: "Lectron CCS→NACS Adapter",
                  cat: "Charging adapter",
                  price: "$149",
                  desc: "Lets CCS-equipped EVs use Tesla Superchargers without the Tesla app. Compatible with Hyundai, Kia, VW, Audi, and more.",
                  tag: "CCS owners",
                  url: "https://www.amazon.com/s?k=lectron+ccs+to+nacs+adapter",
                },
                {
                  name: "Emporia Level 2 (48A)",
                  cat: "Level 2 charger · Smart",
                  price: "$349",
                  desc: "48 A / 11.5 kW with built-in energy monitoring. Pairs with the Emporia app for TOU scheduling and consumption tracking.",
                  tag: "Best with energy monitor",
                  url: "https://www.amazon.com/s?k=emporia+ev+charger+48a",
                },
                {
                  name: "Lectron Level 1/2 Portable EVSE",
                  cat: "Portable charger",
                  price: "$159",
                  desc: "Adjustable 16 A / 32 A. Travel with a 120 V and 240 V cable included. Perfect backup when you don't have a wall charger installed yet.",
                  tag: "Best portable",
                  url: "https://www.amazon.com/s?k=lectron+portable+ev+charger",
                },
              ].map((p) => (
                <a
                  key={p.name}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="block bg-paper border border-line rounded-2xl p-5 hover:border-forest/40 hover:shadow-1 transition-all group"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute">{p.cat}</div>
                    <span className="bg-cream text-ink-3 font-mono text-[9px] px-2 py-0.5 rounded-full whitespace-nowrap">{p.tag}</span>
                  </div>
                  <div className="font-serif text-lg font-medium text-ink mb-0.5 group-hover:text-forest transition-colors">{p.name}</div>
                  <div className="font-mono text-base font-semibold text-forest mb-3">{p.price}</div>
                  <p className="text-sm text-ink-3 leading-relaxed">{p.desc}</p>
                  <div className="font-mono text-[10px] text-forest mt-3 group-hover:underline">View on Amazon →</div>
                </a>
              ))}
            </div>
            <p className="text-xs text-ink-mute mt-4 font-mono">Links may be affiliate links — we may earn a commission at no cost to you.</p>
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
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  title: "Is an EV right for you?",
                  desc: "The 5 questions that determine whether an EV fits your life — apartment vs. home, commute length, access to public charging.",
                  readTime: "5 min read",
                  slug: "#guides",
                },
                {
                  title: "How to claim the $7,500 EV tax credit",
                  desc: "Income limits, vehicle eligibility, and the new point-of-sale option. Avoid the mistakes that disqualify thousands of buyers.",
                  readTime: "6 min read",
                  slug: "#guides",
                },
                {
                  title: "Home charging setup checklist",
                  desc: "Panel capacity check, charger selection, permit requirements, installer vetting — everything before your Level 2 EVSE goes on the wall.",
                  readTime: "7 min read",
                  slug: "#guides",
                },
                {
                  title: "Road trip planning with an EV",
                  desc: "How to use ABRP, picking the right charging stops, managing range anxiety, and why most people stop worrying after the first road trip.",
                  readTime: "8 min read",
                  slug: "#guides",
                },
                {
                  title: "EV vs hybrid: which is right for you?",
                  desc: "Plug-in hybrid, full hybrid, or battery electric — how each fits different driving patterns and why the math isn't always obvious.",
                  readTime: "6 min read",
                  slug: "#guides",
                },
                {
                  title: "Understanding time-of-use (TOU) rates",
                  desc: "How to slash your charging cost by 40–60% by shifting to off-peak electricity pricing. State-by-state program guide.",
                  readTime: "5 min read",
                  slug: "#guides",
                },
              ].map((g) => (
                <a
                  key={g.title}
                  href={g.slug}
                  className="block bg-paper border border-line rounded-2xl p-5 hover:border-forest/40 hover:shadow-1 transition-all group"
                >
                  <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-2">{g.readTime}</div>
                  <div className="font-serif text-base font-medium text-ink mb-2 group-hover:text-forest transition-colors leading-snug">{g.title}</div>
                  <p className="text-sm text-ink-3 leading-relaxed">{g.desc}</p>
                  <div className="font-mono text-[10px] text-forest mt-3 group-hover:underline">Read guide →</div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="bg-ink text-cream/40 py-10 border-t border-white/10">
          <div className="section-wrap">
            <div className="flex flex-wrap justify-between items-center gap-4 text-xs font-mono">
              <span>© 2026 EV Charge Savings</span>
              <span className="text-cream/25 text-center max-w-2xl">
                Rate data from EIA Nov 2025 + AAA monthly averages. Calculations are estimates — actual savings depend on your driving and utility.
              </span>
              <span>evchargesavings.com</span>
            </div>
          </div>
        </footer>

      </main>
    </>
  );
}
