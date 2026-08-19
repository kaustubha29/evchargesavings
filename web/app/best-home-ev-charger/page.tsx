import type { Metadata } from "next";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { LeadCaptureBoxGate } from "@/components/shared/LeadCaptureBoxGate";

export const metadata: Metadata = {
  title: "Best Home EV Chargers 2026 — Level 2 Charger Picks & Buying Guide",
  description:
    "The best Level 2 home EV chargers in 2026: ChargePoint HomeFlex, Grizzl-E, EVIQO, Autel, Tesla Wall Connector. Comparison table, buying guide, and installation cost breakdown.",
  alternates: { canonical: "/best-home-ev-charger" },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the best home EV charger in 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The ChargePoint HomeFlex is the best overall Level 2 home charger in 2026 — it supports 16–50 A adjustable output, works with every EV via J1772, has Wi-Fi app control and scheduling, and is available hardwired or as a NEMA 14-50 plug-in. For best value, the Grizzl-E Classic at $229 is a rugged 40A option with no smart features.",
      },
    },
    {
      "@type": "Question",
      name: "What amperage do I need for a home EV charger?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most EV owners do well with a 40A charger on a 50A circuit. A 40A charger adds roughly 30–35 miles of range per hour — enough to fully charge most EVs overnight. 50A hardwired chargers add 40–44 miles/hr and are worth it for large-battery trucks (F-150 Lightning, Silverado EV). Going above 50A typically doesn't speed up charging since most EVs cap onboard AC acceptance at 11–12 kW (48–50A).",
      },
    },
    {
      "@type": "Question",
      name: "Should I get a plug-in or hardwired EV charger?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Plug-in (NEMA 14-50) chargers are easier to install — if you already have a 14-50 outlet for a dryer or range, you may not need an electrician at all. Hardwired chargers support higher amperage, look cleaner outdoors, and are better for garages exposed to weather. If you're installing new wiring either way, hardwired is often the same cost and gives you more flexibility.",
      },
    },
    {
      "@type": "Question",
      name: "How much does it cost to install a Level 2 EV charger at home?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A standard Level 2 charger installation costs $800–$2,500 in most parts of the US, including labor, wiring, and permits. If your electrical panel needs an upgrade to support a 240V circuit, add $1,500–$3,500 to that. There is no longer a federal tax credit for home charger installation — the §30C credit expired for equipment placed in service after June 30, 2026. Check your utility and state for rebates, which commonly run $250–$1,000.",
      },
    },
    {
      "@type": "Question",
      name: "Can I get a tax credit for installing a home EV charger?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. The §30C Alternative Fuel Vehicle Refueling Property Credit ended for equipment placed in service after June 30, 2026, so a charger installed today qualifies for no federal credit. Utility and state rebates are what remain — many utilities offer $250–$1,000 toward a Level 2 charger, often tied to enrolling in a time-of-use or managed-charging program.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need a NACS or J1772 charger?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most non-Tesla EVs (Hyundai, Kia, Ford, GM, VW, BMW, etc.) still use J1772 for home AC charging. Tesla vehicles use NACS natively. The EVIQO charger has a dual-head cable supporting both standards without an adapter. If you have a non-Tesla, any J1772 charger works. If you have a Tesla, any charger works via the included J1772 adapter, but the Tesla Wall Connector is the cleanest native option.",
      },
    },
  ],
};

type Charger = {
  name: string;
  tag: string;
  price: string;
  amps: string;
  mount: string;
  connector: string;
  smart: string;
  pros: string[];
  cons: string[];
  bestFor: string;
  url: string;
  highlight?: boolean;
};

const CHARGERS: Charger[] = [
  {
    name: "ChargePoint HomeFlex",
    tag: "Best overall",
    price: "$699",
    amps: "16–50 A adjustable",
    mount: "Hardwired or NEMA 14-50",
    connector: "J1772",
    smart: "Wi-Fi, app, scheduling, energy tracking",
    pros: [
      "Only charger that adjusts amperage from 16–50 A — future-proof for any panel",
      "Works with every EV on the market via J1772",
      "Full app with off-peak scheduling and energy history",
    ],
    cons: ["Priciest option at $699", "App required to unlock full scheduling"],
    bestFor: "Anyone who wants one charger that works forever, regardless of what EV comes next",
    url: "https://amzn.to/4cWpokz",
    highlight: true,
  },
  {
    name: "Grizzl-E Classic",
    tag: "Best value",
    price: "$229",
    amps: "40 A fixed",
    mount: "Hardwired or NEMA 14-50 / 10-30 / 6-50",
    connector: "J1772",
    smart: "None — no app, no Wi-Fi",
    pros: [
      "Cheapest capable 40A charger — by a wide margin",
      "Rugged all-metal enclosure, UL Listed, outdoor-rated",
      "Multiple plug options — can often install without new wiring",
    ],
    cons: ["No scheduling, no app, no energy tracking", "Fixed amperage"],
    bestFor: "Budget buyers who just want reliable Level 2 charging with no fuss",
    url: "https://amzn.to/4t6JFKi",
  },
  {
    name: "EVIQO Level 2",
    tag: "Dual-head NACS+J1772",
    price: "$419",
    amps: "40 A",
    mount: "NEMA 14-50 plug-in",
    connector: "NACS + J1772 (both on one cable)",
    smart: "App control, scheduling",
    pros: [
      "Dual connector charges any EV — no adapter needed",
      "Plug-in install — no electrician if you have a 14-50 outlet",
      "App scheduling for off-peak TOU rates",
    ],
    cons: ["Newer brand with less ownership history", "Requires NEMA 14-50 outlet"],
    bestFor: "Households with both a Tesla and non-Tesla EV, or future-proofing for a NACS vehicle",
    url: "https://www.amazon.com/dp/B0F48X956K?tag=evchargesavin-20",
  },
  {
    name: "Autel MaxiCharger 40A",
    tag: "Plug-in · smart",
    price: "~$360",
    amps: "40 A",
    mount: "NEMA 14-50 plug-in",
    connector: "J1772",
    smart: "Bluetooth app, scheduling, energy tracking",
    pros: [
      "Plug-in install — no electrician needed with existing 14-50 outlet",
      "Bluetooth app with scheduling and energy logging",
      "Compact design, 25 ft cable",
    ],
    cons: ["Bluetooth only (no Wi-Fi), shorter range for app control", "40A cap"],
    bestFor: "Renters or owners who already have a dryer outlet and want app control",
    url: "https://www.awin1.com/cread.php?awinmid=72577&awinaffid=2896627&ued=https%3A%2F%2Fautelenergy.us%2Fproducts%2Fmaxicharger-ac-wallbox-home-40a-nema-14-50-ev-charger-with-separate-holster",
  },
  {
    name: "Autel MaxiCharger 50A",
    tag: "Max power",
    price: "~$420",
    amps: "50 A hardwired",
    mount: "Hardwired only",
    connector: "J1772",
    smart: "Bluetooth app, scheduling, energy tracking",
    pros: [
      "Highest output for non-Tesla J1772 chargers — adds ~44 mi/hr",
      "Bluetooth app with full scheduling",
      "Clean hardwired install, 25 ft cable",
    ],
    cons: ["Requires electrician install", "Bluetooth only"],
    bestFor: "Large-battery EVs (F-150 Lightning, Rivian, Silverado EV) where overnight charging time matters",
    url: "https://www.awin1.com/cread.php?awinmid=72577&awinaffid=2896627&ued=https%3A%2F%2Fautelenergy.us%2Fproducts%2Fmaxicharger-ac-hardwired-wallbox-with-side-holster",
  },
  {
    name: "Tesla Wall Connector",
    tag: "Tesla owners",
    price: "$595",
    amps: "Up to 48 A",
    mount: "Hardwired",
    connector: "NACS (native)",
    smart: "Wi-Fi, Tesla app, scheduling, vehicle-aware charging",
    pros: [
      "Native NACS — no adapter, fastest possible home charge for any Tesla",
      "Vehicle-aware charging integrates with Tesla app schedules",
      "Elegant design, best Tesla-specific feature set",
    ],
    cons: ["Only works natively with Tesla (NACS adapter required for other EVs)", "Hardwired install required"],
    bestFor: "Tesla owners who want the cleanest home charging setup",
    url: "https://amzn.to/4taNQVM",
  },
  {
    name: "Lectron Portable L2",
    tag: "Portable",
    price: "~$320",
    amps: "8–40 A dual-level",
    mount: "Plug-in (NEMA 14-50, 10-30, or 120V)",
    connector: "J1772",
    smart: "None",
    pros: [
      "Works at any outlet — Level 2 at 240V or Level 1 at 120V",
      "Portable — take it on road trips, store it in the car",
      "No installation needed",
    ],
    cons: ["No smart features", "Slower than dedicated hardwired charger at same amperage"],
    bestFor: "Renters, travelers, or owners who want a backup charger with zero installation",
    url: "https://www.amazon.com/dp/B0FVD5RGTF?tag=evchargesavin-20",
  },
];

function ChargerCard({ c }: { c: Charger }) {
  return (
    <div className={`rounded-2xl border p-6 flex flex-col gap-4 ${c.highlight ? "border-forest/40 bg-forest/5" : "border-line bg-paper"}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-1">{c.tag}</div>
          <h3 className="font-serif text-lg font-medium text-ink">{c.name}</h3>
        </div>
        <div className="font-mono text-sm font-medium text-ink flex-shrink-0">{c.price}</div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
        {[
          ["Amperage", c.amps],
          ["Mount", c.mount],
          ["Connector", c.connector],
          ["Smart", c.smart],
        ].map(([k, v]) => (
          <div key={k} className="col-span-2 sm:col-span-1 flex gap-2">
            <span className="font-mono text-ink-mute flex-shrink-0 w-20">{k}</span>
            <span className="text-ink-3">{v}</span>
          </div>
        ))}
      </div>

      <div className="space-y-1">
        {c.pros.map((p) => (
          <div key={p} className="flex gap-2 text-xs text-ink-3">
            <span className="text-forest flex-shrink-0 mt-0.5">✓</span>
            <span>{p}</span>
          </div>
        ))}
        {c.cons.map((con) => (
          <div key={con} className="flex gap-2 text-xs text-ink-mute">
            <span className="flex-shrink-0 mt-0.5">–</span>
            <span>{con}</span>
          </div>
        ))}
      </div>

      <p className="text-xs text-ink-3 italic border-t border-line pt-3">
        <span className="not-italic font-semibold text-ink not-italic">Best for:</span> {c.bestFor}
      </p>

      <a
        href={c.url}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="mt-auto font-mono text-[10px] uppercase tracking-widest bg-ink text-cream px-4 py-2 rounded-xl text-center hover:bg-forest transition-colors"
      >
        Check price →
      </a>
    </div>
  );
}

export default function BestHomeEvChargerPage() {
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
            <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-4">Buyer&apos;s guide · 2026</div>
            <h1 className="font-serif text-4xl md:text-5xl font-medium tracking-tight text-ink mb-4">
              Best Level 2 home EV chargers
            </h1>
            <p className="text-ink-3 text-lg leading-relaxed max-w-2xl mb-8">
              A Level 2 charger adds 25–44 miles of range per hour — vs. 3–5 miles on the standard outlet that came in the box.
              Most EV owners recover the cost within a year through avoided public charging sessions.
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                "7 chargers compared",
                "Plug-in and hardwired",
                "NACS + J1772 options",
                "Charger rebates guide",
              ].map((s) => (
                <span key={s} className="font-mono text-[11px] bg-cream-soft border border-line px-3 py-1.5 rounded-full text-ink-mute">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* QUICK PICKS */}
        <section className="border-b border-line py-12">
          <div className="section-wrap max-w-4xl">
            <h2 className="font-serif text-2xl font-medium text-ink mb-6">Quick picks</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { label: "Best overall", name: "ChargePoint HomeFlex", note: "Adjustable 16–50A, Wi-Fi, works with any EV" },
                { label: "Best value", name: "Grizzl-E Classic", note: "40A, rugged metal, UL Listed — just $229" },
                { label: "No electrician needed", name: "EVIQO Level 2", note: "Plug into existing 14-50 outlet, dual NACS+J1772" },
              ].map((p) => (
                <div key={p.label} className="bg-cream-soft border border-line rounded-2xl p-5">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-forest mb-2">{p.label}</div>
                  <div className="font-serif text-base font-medium text-ink mb-1">{p.name}</div>
                  <div className="text-xs text-ink-mute">{p.note}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ALL CHARGERS */}
        <section className="border-b border-line py-12">
          <div className="section-wrap max-w-4xl">
            <h2 className="font-serif text-2xl font-medium text-ink mb-2">All chargers compared</h2>
            <p className="text-sm text-ink-mute mb-8">Prices are approximate — check Amazon for current pricing.</p>
            <div className="grid md:grid-cols-2 gap-5">
              {CHARGERS.map((c) => (
                <ChargerCard key={c.name} c={c} />
              ))}
            </div>
            <p className="mt-6 font-mono text-[10px] text-ink-mute/60">
              We may earn a commission on purchases through these links — at no extra cost to you.
            </p>
          </div>
        </section>

        {/* BUYING GUIDE */}
        <section className="border-b border-line py-12 bg-cream-soft">
          <div className="section-wrap max-w-4xl">
            <h2 className="font-serif text-2xl font-medium text-ink mb-8">How to choose</h2>
            <div className="space-y-8">

              <div>
                <h3 className="font-serif text-lg font-medium text-ink mb-2">Plug-in vs. hardwired</h3>
                <p className="text-sm text-ink-3 leading-relaxed">
                  If you already have a NEMA 14-50 outlet (240V, 50A — used for electric dryers, ranges, and RV hookups), a plug-in charger installs in minutes with no electrician.
                  Hardwired chargers support higher amperage and are better for outdoor installs where weather exposure matters.
                  If you&apos;re running new wiring either way, hardwired is usually the same cost and gives you more flexibility.
                </p>
              </div>

              <div>
                <h3 className="font-serif text-lg font-medium text-ink mb-2">What amperage do you need?</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-paper border-b border-line">
                        <th className="text-left p-3 font-mono text-ink-mute uppercase tracking-wider">Amperage</th>
                        <th className="text-left p-3 font-mono text-ink-mute uppercase tracking-wider">Miles/hr added</th>
                        <th className="text-left p-3 font-mono text-ink-mute uppercase tracking-wider">Circuit needed</th>
                        <th className="text-left p-3 font-mono text-ink-mute uppercase tracking-wider">Best for</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["30 A", "20–25 mi/hr", "40A circuit", "Light daily drivers (<50 mi/day)"],
                        ["40 A", "30–35 mi/hr", "50A circuit", "Most EV owners — charges overnight reliably"],
                        ["48–50 A", "38–44 mi/hr", "60A circuit", "Large-battery trucks and SUVs (F-150 Lightning, Rivian, Silverado EV)"],
                      ].map(([amp, miles, circuit, note]) => (
                        <tr key={amp} className="border-b border-line">
                          <td className="p-3 font-mono text-ink">{amp}</td>
                          <td className="p-3 text-ink-3">{miles}</td>
                          <td className="p-3 text-ink-3">{circuit}</td>
                          <td className="p-3 text-ink-3">{note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="font-serif text-lg font-medium text-ink mb-2">NACS vs. J1772</h3>
                <p className="text-sm text-ink-3 leading-relaxed">
                  Tesla vehicles use NACS natively. All other EVs (Hyundai, Kia, Ford, GM, VW, BMW, Rivian, etc.) use J1772 for home AC charging.
                  Most J1772 chargers include a J1772→NACS adapter in the Tesla box, so any J1772 charger technically works with a Tesla.
                  The EVIQO charger has a dual-head cable supporting both without adapters — the best choice for mixed-EV households.
                </p>
              </div>

              <div>
                <h3 className="font-serif text-lg font-medium text-ink mb-2">Smart features worth paying for</h3>
                <p className="text-sm text-ink-3 leading-relaxed">
                  If your utility offers Time-of-Use (TOU) rates with cheaper overnight electricity, a charger with scheduling will pay for itself quickly.
                  Some utilities in California charge $0.44/kWh peak vs $0.15/kWh off-peak — that&apos;s a 65% cost difference.
                  Wi-Fi-connected chargers (ChargePoint, Tesla Wall Connector) let you set schedules remotely and track energy use.
                  Bluetooth-only chargers (Autel) require you to be nearby to adjust settings.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* 30C CREDIT */}
        <section className="border-b border-line py-12">
          <div className="section-wrap max-w-4xl">
            <div className="bg-forest/8 border border-forest/25 rounded-2xl p-6 md:p-8">
              <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-3">Tax credit — expired June 30, 2026</div>
              <h2 className="font-serif text-2xl font-medium text-ink mb-3">The §30C federal charger credit is gone</h2>
              <p className="text-sm text-ink-3 leading-relaxed mb-4">
                The Alternative Fuel Vehicle Refueling Property Credit (§30C) covered 30% of charger hardware and installation
                costs, up to $1,000 per port. It terminated for property placed in service after June 30, 2026, so a charger
                installed today gets no federal credit. State and utility rebates are what remain — many utilities still offer
                $250 to $1,000 toward a Level 2 charger, sometimes tied to enrolling in a managed-charging or time-of-use plan.
              </p>
              <div className="grid sm:grid-cols-3 gap-4 text-sm">
                {[
                  ["Federal credit today", "None"],
                  ["Expired", "June 30, 2026"],
                  ["Still available", "Utility & state rebates"],
                ].map(([k, v]) => (
                  <div key={k} className="bg-paper border border-line rounded-xl p-4">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-1">{k}</div>
                    <div className="font-serif text-base font-medium text-ink">{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* INSTALLATION CTA */}
        <section className="border-b border-line py-12 bg-cream-soft">
          <div className="section-wrap max-w-4xl">
            <h2 className="font-serif text-2xl font-medium text-ink mb-2">Get installation quotes</h2>
            <p className="text-sm text-ink-3 mb-6">
              Installation cost varies by state, panel capacity, and run length.{" "}
              <a href="/ev-charger-installation-cost" className="text-forest underline">See cost estimates by state →</a>
            </p>
            <LeadCaptureBoxGate
              sourcePage="/best-home-ev-charger"
              defaultIntent={["charger"]}
              availableIntents={["charger"]}
              heading="Get quotes from licensed electricians in your area"
              description="Enter your ZIP and we'll match you with up to three licensed electricians for Level 2 charger installation — free, no obligation."
              submitLabel="Get installation quotes"
              successMessage="Got it — you'll hear from licensed electricians in your area within 24 hours."
            />
          </div>
        </section>

        {/* FAQ */}
        <section className="border-b border-line py-12">
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

      </main>
      <SiteFooter />
    </>
  );
}
