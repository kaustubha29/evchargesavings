import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { evRepository } from "@/features/ev-data/repository";
import { fmt } from "@/lib/format";

export const dynamicParams = false;

interface Props {
  params: Promise<{ price: string }>;
}

const PRICE_BANDS = [30000, 35000, 40000, 45000, 50000, 60000];
const NATIONAL_KWH_CENTS = 16.5;
const PUBLIC_RATE_MULTIPLIER = 2.5;
const DEFAULT_MILES = 15000;
const DEFAULT_HOME_PCT = 80;

function annualChargingCost(efficiencyMiPerKwh: number): number {
  const annualKwh = DEFAULT_MILES / efficiencyMiPerKwh;
  const homeCost = annualKwh * (DEFAULT_HOME_PCT / 100) * (NATIONAL_KWH_CENTS / 100);
  const publicCost = annualKwh * ((100 - DEFAULT_HOME_PCT) / 100) * (NATIONAL_KWH_CENTS * PUBLIC_RATE_MULTIPLIER / 100);
  return homeCost + publicCost;
}

export function generateStaticParams() {
  return PRICE_BANDS.map((p) => ({ price: String(p) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { price } = await params;
  const cap = Number(price);
  if (!PRICE_BANDS.includes(cap)) return {};
  const formatted = `$${(cap / 1000).toFixed(0)}K`;
  const title = `Best EVs Under ${formatted} in 2026 — Ranked by Range and Value`;
  const description = `Every electric vehicle under ${formatted} MSRP, ranked by EPA range and annual charging cost. ${evRepository.getUnder(cap).length} EVs qualify. Updated for 2026 with current prices.`;
  return {
    title,
    description,
    alternates: { canonical: `/best-evs-under/${price}` },
    openGraph: { title, description, url: `https://evchargesavings.com/best-evs-under/${price}` },
  };
}

export default async function BestEvsUnderPage({ params }: Props) {
  const { price } = await params;
  const cap = Number(price);
  if (!PRICE_BANDS.includes(cap)) notFound();

  const evs = evRepository
    .getUnder(cap)
    .sort((a, b) => b.range - a.range);

  if (evs.length === 0) notFound();

  const formatted = `$${cap.toLocaleString()}`;
  const formattedShort = `$${(cap / 1000).toFixed(0)}K`;

  const cheapestEV = [...evs].sort((a, b) => a.msrp - b.msrp)[0];
  const longestRangeEV = evs[0];
  const mostEfficientEV = [...evs].sort((a, b) => b.efficiency - a.efficiency)[0];

  const nextBand = PRICE_BANDS.find((b) => b > cap);
  const prevBand = [...PRICE_BANDS].reverse().find((b) => b < cap);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Best EVs Under ${formatted} (2026)`,
    description: `Electric vehicles available under ${formatted} MSRP, ranked by EPA range`,
    url: `https://evchargesavings.com/best-evs-under/${price}`,
    numberOfItems: evs.length,
    itemListElement: evs.slice(0, 10).map((ev, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: ev.fullName,
      url: `https://evchargesavings.com/ev/${ev.slug}`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main>
        {/* Hero */}
        <section className="bg-paper border-b border-line py-16 md:py-20">
          <div className="section-wrap">
            <div className="inline-flex items-center gap-2 bg-good-bg text-good-fg font-mono text-xs px-3.5 py-1.5 rounded-full border border-good-fg/15 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
              {evs.length} EVs · Updated 2026
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-medium tracking-tight text-ink mb-4 max-w-3xl leading-[1.05]">
              Best EVs Under{" "}
              <em className="italic text-forest">{formattedShort}</em>{" "}
              in 2026
            </h1>
            <p className="text-ink-3 text-lg max-w-xl leading-relaxed mb-6">
              {evs.length} electric vehicles with an MSRP under {formatted}, ranked by EPA range.
              The longest-range option is the <strong>{longestRangeEV.name}</strong> at {longestRangeEV.range} miles.
              Cheapest to buy: <strong>{cheapestEV.name}</strong> at {fmt.money0(cheapestEV.msrp)}.
            </p>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-4 mb-4">
              {[
                { label: "EVs under budget", val: String(evs.length) },
                { label: "Best range", val: `${longestRangeEV.range} mi — ${longestRangeEV.name}` },
                { label: "Most efficient", val: `${mostEfficientEV.efficiency} mi/kWh — ${mostEfficientEV.name}` },
                { label: "Lowest MSRP", val: `${fmt.money0(cheapestEV.msrp)} — ${cheapestEV.name}` },
              ].map((s) => (
                <div key={s.label} className="rounded-xl px-4 py-3 text-sm border bg-paper border-line">
                  <div className="font-mono text-[11px] text-ink-mute uppercase tracking-widest mb-0.5">{s.label}</div>
                  <div className="font-medium text-ink">{s.val}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* EV list */}
        <section className="py-12">
          <div className="section-wrap">
            <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-6">
              {evs.length} electric vehicles · sorted by EPA range · national avg {NATIONAL_KWH_CENTS}¢/kWh
            </div>

            <div className="divide-y divide-line border border-line rounded-2xl overflow-hidden">
              {evs.map((ev, i) => {
                const cost = annualChargingCost(ev.efficiency);
                return (
                  <a
                    key={ev.id}
                    href={`/ev/${ev.slug}`}
                    className="flex items-start sm:items-center gap-4 px-5 py-4 bg-paper hover:bg-good-bg/30 transition-colors group"
                  >
                    {/* Rank */}
                    <div className="w-7 flex-shrink-0 font-mono text-sm text-ink-mute text-center mt-0.5 sm:mt-0">
                      {i + 1}
                    </div>

                    {/* Name + connector */}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-ink group-hover:text-forest transition-colors leading-snug">
                        {ev.fullName}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="font-mono text-[10px] text-ink-mute">{ev.connector}</span>
                        <span className="font-mono text-[10px] text-ink-mute/50">·</span>
                        <span className="font-mono text-[10px] text-ink-mute">{ev.segment}</span>
                        {ev.federalTaxCredit > 0 && (
                          <>
                            <span className="font-mono text-[10px] text-ink-mute/50">·</span>
                            <span className="font-mono text-[10px] text-rust/70">Credit expired Oct 2025</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="hidden sm:flex items-center gap-6 flex-shrink-0 text-sm">
                      <div className="text-right">
                        <div className="font-mono text-ink">{ev.range} mi</div>
                        <div className="font-mono text-[10px] text-ink-mute">EPA range</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-ink">{ev.efficiency} mi/kWh</div>
                        <div className="font-mono text-[10px] text-ink-mute">efficiency</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-good-fg">{fmt.money0(cost)}/yr</div>
                        <div className="font-mono text-[10px] text-ink-mute">charging cost</div>
                      </div>
                      <div className="text-right w-20">
                        <div className="font-mono text-ink">{fmt.money0(ev.msrp)}</div>
                        <div className="font-mono text-[10px] text-ink-mute">starting MSRP</div>
                      </div>
                    </div>

                    {/* Mobile stats */}
                    <div className="flex sm:hidden flex-col items-end gap-1 flex-shrink-0 text-xs font-mono">
                      <span className="text-ink">{ev.range} mi</span>
                      <span className="text-good-fg">{fmt.money0(cost)}/yr</span>
                      <span className="text-ink-mute">{fmt.money0(ev.msrp)}</span>
                    </div>

                    <svg className="w-4 h-4 text-ink-mute group-hover:text-forest transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* Browse other bands */}
        <section className="py-10 border-t border-line bg-paper">
          <div className="section-wrap">
            <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-4">Browse other budgets</div>
            <div className="flex flex-wrap gap-3">
              {PRICE_BANDS.filter((b) => b !== cap).map((b) => (
                <a
                  key={b}
                  href={`/best-evs-under/${b}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm border border-line bg-paper hover:bg-good-bg hover:border-good-fg/30 hover:text-forest transition-all font-medium"
                >
                  Under ${(b / 1000).toFixed(0)}K
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-14 bg-ink text-cream">
          <div className="section-wrap max-w-2xl text-center">
            <div className="font-mono text-[11px] uppercase tracking-widest text-cream/40 mb-3">Fuel cost varies by state</div>
            <h2 className="font-serif text-2xl font-medium mb-3">
              See what any of these EVs saves{" "}
              <em className="italic text-gold">in your state</em>
            </h2>
            <p className="text-cream/60 text-sm mb-6 max-w-md mx-auto">
              California charges 26¢/kWh. Louisiana charges 11¢. Enter your state and driving habits to get the real annual savings number.
            </p>
            <a
              href="/#calculator"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-honey text-ink font-semibold text-sm hover:bg-gold transition-colors"
            >
              Open the calculator →
            </a>
          </div>
        </section>

        <footer className="bg-ink text-cream/40 py-10 border-t border-white/10">
          <div className="section-wrap">
            <div className="flex flex-wrap justify-between items-center gap-4 text-xs font-mono">
              <span>© 2026 EV Charge Savings</span>
              <span className="text-cream/25 text-center max-w-2xl">
                MSRP figures are base starting prices before options, destination, or incentives. Federal EV tax credits expired October 1, 2025. Check your state for current incentives.
              </span>
              <span>evchargesavings.com</span>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
