import type { Metadata } from "next";
import { SavingsSlotBand } from "@/components/shared/SavingsSlotBand";
import { SiteFooter } from "@/components/shared/SiteFooter";

export const metadata: Metadata = {
  title: "About EV Charge Savings",
  description: "EV Charge Savings was built by a Kia EV9 owner and engineering leader in the Pacific Northwest after two years of navigating EV charging confusion — so the next person doesn't have to.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <main className="bg-paper min-h-screen">
        <div className="section-wrap py-16 max-w-2xl">
          <a href="/" className="font-mono text-xs text-ink-mute hover:text-forest mb-8 inline-block">← evchargesavings.com</a>

          <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-3">About</div>
          <h1 className="font-serif text-4xl font-medium tracking-tight text-ink mb-4">
            Built by an EV owner, for people still deciding
          </h1>
          <p className="text-ink-2 text-lg leading-relaxed mb-10">
            I got a Kia EV9, went through two years of confusion figuring out charging, costs, and real-world ownership —
            then built this so the next person doesn&apos;t have to start from scratch.
          </p>

          {/* Author block */}
          <div className="bg-cream-soft border border-line rounded-2xl p-6 mb-12 flex gap-5 items-start">
            <div className="w-12 h-12 rounded-full bg-forest/15 border border-forest/25 flex items-center justify-center flex-shrink-0">
              <span className="text-forest font-serif text-xl font-medium">⚡</span>
            </div>
            <div>
              <div className="font-serif text-base font-medium text-ink mb-0.5">Engineering leader · Pacific Northwest</div>
              <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-3">Kia EV9 owner · influenced 4 others to buy one</div>
              <p className="text-sm text-ink-3 leading-relaxed">
                After I got my EV9, four friends and coworkers bought one too — partly based on my experience.
                I helped each of them set up Level 2 charging, navigate the connector confusion, and understand what their
                electricity rate actually meant for their monthly costs. That process is what turned a calculator side project
                into a full resource.
              </p>
            </div>
          </div>

          <div className="space-y-10 text-ink-2 leading-relaxed">

            <section>
              <h2 className="font-serif text-2xl font-medium text-ink mb-3">How this started</h2>
              <p className="mb-3">
                When I got my EV9, I had no idea what to expect from home charging — different connector types,
                Level 1 vs Level 2, whether a standard outlet would actually work, what the monthly electricity
                bill impact would look like. The information was scattered, the calculators were vague, and most
                of the advice online was written for Tesla owners.
              </p>
              <p className="mb-4">
                That last part matters. Owning a non-Tesla EV is a different experience — the charging network
                options, connector compatibility, road trip planning all work differently. I spent two years
                figuring this out the hard way.
              </p>
              <aside className="border-l-4 border-forest/30 pl-5 py-1 bg-cream-soft rounded-r-xl">
                <p className="text-sm text-ink-3 italic leading-relaxed">
                  <span className="not-italic font-semibold text-ink">True story:</span> I spent two hours
                  the day I got my EV9 puzzling over why the included charger was so slow — adding about
                  4 miles per hour. Turns out it was a Level 1 brick plugged into a standard 120V outlet.
                  Had to schedule an electrician the next week for a proper Level 2 install. That confusion
                  is why there&apos;s a whole section on this site explaining exactly what each charging level means.
                </p>
              </aside>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-medium text-ink mb-3">What this site is now</h2>
              <p className="mb-3">
                What started as a calculator idea grew into a more complete resource for the EV buying decision:
                real cost estimates using live government data, education on home charging setup, reality checks
                on range and public networks, and connections to licensed electricians for installation.
              </p>
              <p>
                The calculator uses live data from the U.S. Energy Information Administration — actual state
                electricity rates updated monthly, actual gas prices updated weekly — because national averages
                are often meaningfully off from what you actually pay. A driver in California paying 30¢/kWh
                has completely different savings math than one in Wyoming paying 11¢.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-medium text-ink mb-3">Data sources</h2>
              <ul className="space-y-3">
                {[
                  {
                    name: "EIA — Electricity rates",
                    detail: "U.S. Energy Information Administration residential electricity rates by state. Published monthly. Pulled via the EIA API — the same source utilities reference.",
                  },
                  {
                    name: "EIA — Gas prices",
                    detail: "EIA retail gasoline prices by PADD region and state. Published weekly. Regional prices mapped to individual states when state-level data is unavailable.",
                  },
                  {
                    name: "EPA — Vehicle efficiency",
                    detail: "MPG and miles-per-kWh ratings from the EPA's fueleconomy.gov dataset. EPA combined-cycle ratings used as baseline, with a ±10–30% real-world variance note throughout.",
                  },
                  {
                    name: "MSRP data",
                    detail: "Base MSRP compiled from manufacturer websites and Edmunds. Updated periodically — always verify with a dealer for current pricing and available incentives.",
                  },
                ].map((s) => (
                  <li key={s.name} className="pl-4 border-l-2 border-forest/30 list-none">
                    <div className="font-semibold text-ink text-sm mb-0.5">{s.name}</div>
                    <div className="text-sm text-ink-3">{s.detail}</div>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-medium text-ink mb-3">What the calculator includes — and what it doesn&apos;t</h2>
              <p className="mb-3">
                The calculator estimates <strong className="text-ink">fuel costs only</strong>. It doesn&apos;t
                include purchase price, insurance, maintenance, financing, or depreciation. Those factors matter —
                but fuel is where EV savings are most consistent and most calculable from public data.
              </p>
              <p>
                The break-even tool adds EV purchase premium and estimates how many years of fuel savings pay it back.
                These are informed estimates with real data behind them, not guarantees. Your actual costs depend on your
                utility, your driving style, and how much you charge at home vs. on public networks.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-medium text-ink mb-3">Editorial independence</h2>
              <p className="mb-3">
                This site is independent. No automaker, utility, or charging network funds or influences it.
                Revenue comes from:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-sm">
                <li>Affiliate commissions when readers buy home chargers or accessories through links (Amazon Associates and similar programs)</li>
                <li>Google AdSense display advertising</li>
                <li>Referral fees when readers request electrician quotes through the installer network</li>
              </ul>
              <p className="mt-3">
                None of these affect calculator results, data sources, or guide content. If the math shows gas
                is cheaper for your situation, the calculator says so — and explains why.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-medium text-ink mb-3">Get in touch</h2>
              <p>
                Questions, data corrections, or feedback?{" "}
                <a href="/contact" className="text-forest underline">Contact page</a>{" "}
                or email{" "}
                <a href="mailto:hello@evchargesavings.com" className="text-forest underline">hello@evchargesavings.com</a>.
              </p>
            </section>

          </div>
        </div>

        <SavingsSlotBand
          eyebrow="Try the calculator"
          title="See how the numbers play out for your situation"
          body="Pick your EV, your current gas car, and your state — live EIA rates, real EPA efficiency data, instant result."
          cta={{ label: "Open the calculator →", href: "/#calculator" }}
        />
      </main>
      <SiteFooter />
    </>
  );
}
