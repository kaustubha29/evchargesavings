import type { Metadata } from "next";
import { GUIDES } from "@/features/guides/data";
import { EVOwnerHero } from "@/components/shared/EVOwnerHero";
import { StickyOwnerBar } from "@/components/shared/StickyOwnerBar";
import { QuickWinsLabel } from "@/components/shared/QuickWinsLabel";
import { HomeChargingSection } from "@/components/shared/HomeChargingSection";
import { EVOwnerChargerBundle } from "@/components/shared/EVOwnerChargerBundle";
import { HomeChargerROI } from "@/components/shared/HomeChargerROI";
import { LeadCaptureBoxGate } from "@/components/shared/LeadCaptureBoxGate";
import { EVInsuranceCTA } from "@/components/shared/EVInsuranceCTA";
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
    body: "Level 1 adds 4–5 miles per hour — fine for low mileage, painful for anything else. A Level 2 install runs $500–$1,500 and fully charges most EVs overnight. One-time cost, permanent fix.",
    cta: { label: "Calculate your break-even →", href: "#charger-roi" },
  },
  {
    num: "02",
    title: "Switch to a TOU rate",
    body: "Most utilities offer time-of-use plans with overnight rates 30–60% below standard. Set your car to charge after 9 PM and your effective per-mile cost drops — often the single biggest lever after your Level 2 install.",
    cta: { label: "How TOU rates work →", href: "/guides/time-of-use-rates" },
  },
  {
    num: "03",
    title: "Review your EV insurance",
    body: "EV insurance costs vary dramatically by insurer — some penalize for high parts costs, others offer EV-specific discounts. Most owners who shop after year one find real savings. It takes 10 minutes.",
    cta: { label: "Compare EV insurance →", href: "/ev-insurance" },
  },
];

export default function EVOwnerPage() {
  const ownerGuides = GUIDES.filter((g) => OWNER_GUIDE_CATEGORIES.has(g.category)).slice(0, 8);

  return (
    <>
      <StickyOwnerBar />
      <main className="bg-paper min-h-screen">

        {/* HERO — with integrated car picker */}
        <EVOwnerHero />

        {/* QUICK WINS */}
        <section className="border-b border-line py-12 bg-cream-soft">
          <div className="section-wrap">
            <QuickWinsLabel />
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

        {/* HOME CHARGER ROI */}
        <HomeChargerROI />

        {/* HOME CHARGER PRODUCTS — connector driven by owner store */}
        <EVOwnerChargerBundle />

        {/* INSTALLER LEAD CAPTURE */}
        <LeadCaptureBoxGate
          sourcePage="/ev-owner"
          sectionId="installer-quotes"
          sectionClassName="bg-cream-soft border-b border-line py-10"
          contentClassName="section-wrap"
          availableIntents={["charger", "insurance"]}
          defaultIntent={["charger", "insurance"]}
          isOwner={true}
          heading="Get matched with local installers and insurance"
          description="Licensed electricians for Level 2 install quotes, EV insurance comparisons, or both. Free, no obligation — providers reach out within 24 hours."
          submitLabel="Get quotes"
          successMessage="Got it — relevant providers will reach out within 24 hours."
        />

        <EVInsuranceCTA />
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
