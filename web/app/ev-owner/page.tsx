import type { Metadata } from "next";
import { GUIDES } from "@/features/guides/data";
import { HomeChargingSection } from "@/components/shared/HomeChargingSection";
import { HomeChargerProducts } from "@/components/shared/HomeChargerProducts";
import { LeadCaptureBoxGate } from "@/components/shared/LeadCaptureBoxGate";
import { EVInsuranceCTA } from "@/components/shared/EVInsuranceCTA";
import { ChargingNetworkReferrals } from "@/components/shared/ChargingNetworkReferrals";
import { PublicChargingSection } from "@/components/features/networks/PublicChargingSection";
import { SiteFooter } from "@/components/shared/SiteFooter";

export const metadata: Metadata = {
  title: "EV Owner Resource Guide — Home Charging, Rates & Networks",
  description:
    "Already own an EV? Upgrade to Level 2 charging, switch to a TOU electricity rate, find the best public networks, and compare EV insurance — all in one place.",
  alternates: { canonical: "/ev-owner" },
};

const OWNER_GUIDE_CATEGORIES = new Set(["Charging", "Ownership", "Installation", "Driving", "Savings"]);

const QUICK_WINS = [
  {
    num: "01",
    title: "Upgrade to Level 2",
    body: "Level 1 (standard outlet) adds 4–5 miles per hour — fine for low mileage, painful for anything else. A Level 2 install runs $500–$1,500 total and fully charges most EVs overnight. One-time cost, permanent fix.",
    cta: { label: "See Level 2 charger options →", href: "#chargers" },
  },
  {
    num: "02",
    title: "Switch to a TOU electricity rate",
    body: "Most utilities offer time-of-use plans with overnight rates 30–60% below standard. Set your car to charge after 9 PM and your effective per-mile cost drops significantly — often the single biggest lever after the initial purchase.",
    cta: { label: "How TOU rates work →", href: "/guides/time-of-use-rates" },
  },
  {
    num: "03",
    title: "Review your EV insurance",
    body: "EV insurance costs vary dramatically by insurer — some penalize for high replacement part costs, others actively offer EV discounts. Most owners who shop after year one find meaningful savings. It takes 10 minutes.",
    cta: { label: "Compare EV insurance →", href: "/ev-insurance" },
  },
];

export default function EVOwnerPage() {
  const ownerGuides = GUIDES.filter((g) => OWNER_GUIDE_CATEGORIES.has(g.category)).slice(0, 8);

  return (
    <>
      <main className="bg-paper min-h-screen">

        {/* HERO */}
        <section className="bg-paper border-b border-line py-14 md:py-20">
          <div className="section-wrap max-w-3xl">
            <div className="font-mono text-[11px] uppercase tracking-widest text-forest mb-3">For EV owners</div>
            <h1 className="font-serif text-5xl font-medium tracking-tight text-ink mb-4">
              You already made the switch.<br />
              <em className="text-forest">Now make the most of it.</em>
            </h1>
            <p className="text-ink-3 text-lg leading-relaxed max-w-xl">
              Home charging levels, time-of-use electricity rates, the public charging landscape, and EV-specific insurance — here&apos;s what most owners figure out the hard way.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#level2" className="px-4 py-2 rounded-xl text-sm font-semibold bg-forest text-white hover:bg-emerald transition-colors">
                Level 2 setup →
              </a>
              <a href="/ev-insurance" className="px-4 py-2 rounded-xl text-sm font-semibold border border-line text-ink-2 hover:border-forest/40 hover:text-forest transition-colors">
                Compare insurance →
              </a>
              <a href="/" className="px-4 py-2 rounded-xl text-sm font-semibold border border-line text-ink-2 hover:border-forest/40 hover:text-forest transition-colors">
                Still deciding? Try the calculator →
              </a>
            </div>
          </div>
        </section>

        {/* QUICK WINS */}
        <section className="border-b border-line py-12 bg-cream-soft">
          <div className="section-wrap">
            <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-8 text-center">3 things that move the needle most</div>
            <div className="grid md:grid-cols-3 gap-6">
              {QUICK_WINS.map((w) => (
                <div key={w.num} className="bg-paper border border-line rounded-2xl p-6">
                  <div className="font-mono text-[11px] uppercase tracking-widest text-forest mb-2">{w.num}</div>
                  <h2 className="font-serif text-xl font-medium text-ink mb-3">{w.title}</h2>
                  <p className="text-sm text-ink-3 leading-relaxed mb-4">{w.body}</p>
                  <a href={w.cta.href} className="font-mono text-[11px] uppercase tracking-widest text-forest hover:underline">
                    {w.cta.label}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOME CHARGING GUIDE */}
        <div id="level2">
          <HomeChargingSection />
        </div>

        {/* HOME CHARGER PRODUCTS */}
        <div id="chargers">
          <HomeChargerProducts />
        </div>

        {/* INSTALLER LEAD CAPTURE */}
        <LeadCaptureBoxGate
          sourcePage="/ev-owner"
          sectionId="installer-quotes"
          sectionClassName="bg-cream-soft border-b border-line py-10"
          contentClassName="section-wrap max-w-2xl"
          availableIntents={["charger", "insurance"]}
          defaultIntent={["charger", "insurance"]}
          heading="Get Level 2 installation quotes in your area"
          description="Level 2 charging cuts overnight charge time from 20+ hours to 4–6. Get matched with up to 3 licensed electricians to compare quotes — free, no obligation."
          submitLabel="Get installer quotes"
          successMessage="Got it — local electricians will reach out within 24 hours with quotes."
        />

        <EVInsuranceCTA />
        <ChargingNetworkReferrals />
        <PublicChargingSection />

        {/* OWNER GUIDES */}
        {ownerGuides.length > 0 && (
          <section className="bg-cream-soft border-b border-line py-16">
            <div className="section-wrap">
              <div className="mb-6">
                <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-3">Guides for owners</div>
                <h2 className="font-serif text-3xl font-medium tracking-tight text-ink">
                  Charging, ownership & savings
                </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 md:gap-3">
                {ownerGuides.map((g) => (
                  <a
                    key={g.slug}
                    href={`/guides/${g.slug}`}
                    className="group relative overflow-hidden border border-line rounded-lg bg-paper p-3 min-h-28 md:min-h-32 flex flex-col hover:-translate-y-0.5 hover:border-forest/35 hover:shadow-1 transition-all"
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
                  Browse all guides →
                </a>
              </div>
            </div>
          </section>
        )}

      </main>
      <SiteFooter />
    </>
  );
}
