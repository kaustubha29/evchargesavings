import type { Metadata } from "next";
import { InsuranceCostWidget } from "@/components/features/insurance/InsuranceCostWidget";
import { LeadCaptureBoxGate } from "@/components/shared/LeadCaptureBoxGate";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { LocationDetector } from "@/components/features/location/LocationDetector";

export const metadata: Metadata = {
  title: "EV vs Gas Insurance Cost Calculator — How Much More Does EV Insurance Cost?",
  description:
    "EVs cost 15–22% more to insure than comparable gas cars. See exact annual insurance costs by state, how it affects your total EV savings, and how to get cheaper rates.",
  alternates: { canonical: "/ev-insurance" },
};

const WHY_ITEMS = [
  {
    title: "Higher repair costs",
    body: "EV body panels, sensors, and battery packs cost significantly more to repair after a collision. Insurers price in that risk.",
  },
  {
    title: "Specialized labor",
    body: "Not all shops can work on EVs. Fewer qualified technicians = longer repair times = higher rental car costs insurers absorb.",
  },
  {
    title: "Higher vehicle value",
    body: "EVs carry higher sticker prices than comparable gas cars. Comprehensive and collision coverage scales with vehicle value.",
  },
  {
    title: "Battery replacement risk",
    body: "A totaled EV often means a $10,000–$20,000 battery replacement. Insurers factor that into premiums.",
  },
];

const TIPS = [
  "Shop quotes annually — EV insurance rates are dropping as claims data matures.",
  "Ask about EV-specific discounts (Tesla, Rivian, and some carriers offer them).",
  "Bundle home + auto — typically saves $150–$300/yr regardless of vehicle type.",
  "Higher deductible ($1,000 vs $500) can cut annual premium by $200–$400.",
  "Telematics / usage-based programs reward low-mileage drivers (common for EV commuters).",
];

export default function EVInsurancePage() {
  return (
    <>
      <LocationDetector />
      <main>

        {/* HERO */}
        <section className="bg-paper border-b border-line py-14 md:py-20">
          <div className="section-wrap max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-rust/10 text-rust border border-rust/20 font-mono text-[11px] px-3.5 py-1.5 rounded-full mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-rust flex-shrink-0" />
              Hidden EV cost — insurance
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-medium tracking-tight text-ink mb-4">
              EVs save on fuel. They cost more to{" "}
              <em className="text-rust">insure.</em>
            </h1>
            <p className="text-ink-3 text-lg leading-relaxed max-w-2xl">
              EV owners pay 15–22% more for auto insurance than drivers of comparable gas cars.
              See exactly how much that eats into your fuel savings — and whether shopping around can close the gap.
            </p>
          </div>
        </section>

        {/* CALCULATOR WIDGET */}
        <section className="bg-cream-soft py-12 border-b border-line">
          <div className="section-wrap max-w-3xl">
            <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-4">
              Insurance cost calculator
            </div>
            <InsuranceCostWidget />
          </div>
        </section>

        {/* WHY */}
        <section className="bg-paper py-14 border-b border-line">
          <div className="section-wrap max-w-4xl">
            <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-3">
              Why it costs more
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-medium tracking-tight text-ink mb-8">
              Four reasons EV insurance runs higher
            </h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {WHY_ITEMS.map((item) => (
                <div key={item.title} className="border border-line rounded-2xl p-6 bg-cream-soft">
                  <h3 className="font-serif text-lg font-medium text-ink mb-2">{item.title}</h3>
                  <p className="text-sm text-ink-3 leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW TO OFFSET */}
        <section className="bg-ink text-cream py-14 border-b border-white/10">
          <div className="section-wrap max-w-4xl">
            <div className="font-mono text-[11px] uppercase tracking-widest text-emerald mb-3">
              How to close the gap
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-medium tracking-tight mb-6">
              5 ways to cut your EV insurance cost
            </h2>
            <ul className="space-y-3">
              {TIPS.map((tip, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="font-mono text-[11px] text-emerald mt-0.5 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                  <p className="text-sm text-cream/75 leading-relaxed">{tip}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA — lead form with ev intent pre-selected */}
        <LeadCaptureBoxGate
          sourcePage="/ev-insurance"
          sectionClassName="bg-cream-soft border-b border-line py-12"
          contentClassName="section-wrap max-w-xl"
          defaultIntent={["ev"]}
          heading="Compare EV vs gas insurance quotes in your area"
          description="Find out if shopping around can offset the higher EV insurance cost. Free quotes — local providers respond within 24 hours."
          submitLabel="Get free insurance quotes"
          successMessage="Got it — local insurance providers will reach out with EV-specific quotes within 24 hours."
        >
          <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-4">
            Compare quotes · free service
          </div>
        </LeadCaptureBoxGate>

        <SiteFooter />
      </main>
    </>
  );
}
