"use client";
import { useMemo } from "react";
import { useCalculatorStore, computeSavings } from "@/store/calculator";
import { evRepository, gasRepository } from "@/features/ev-data/repository";
import { EVMarketplaceAffiliates } from "./EVMarketplaceAffiliates";
import { EVInsuranceCTA } from "./EVInsuranceCTA";
import { LeadCaptureBoxGate } from "./LeadCaptureBoxGate";
import { HomeChargerProducts } from "./HomeChargerProducts";
import { HomeChargingSection } from "./HomeChargingSection";
import { ChargingNetworkReferrals } from "./ChargingNetworkReferrals";
import { PublicChargingSection } from "@/components/features/networks/PublicChargingSection";
import { fmt } from "@/lib/format";

const EFFICIENT_SUGGESTIONS = [
  { slug: "hyundai-ioniq-6-long-range-rwd", name: "Hyundai Ioniq 6 LR RWD", efficiency: 4.6 },
  { slug: "tesla-model-3-rwd",              name: "Tesla Model 3 RWD",        efficiency: 4.5 },
  { slug: "chevrolet-bolt-ev",              name: "Chevrolet Bolt EV",         efficiency: 3.9 },
];


function topFactors(p: {
  homeRateKwh: number;
  gasPriceDollar: number;
  annualMiles: number;
  homePct: number;
  gasMpg: number;
}): string[] {
  const candidates: { msg: string; weight: number }[] = [];

  if (p.homeRateKwh > 22)
    candidates.push({
      msg: `Your electricity rate (${fmt.cents1(p.homeRateKwh)}/kWh) is above the ~16¢ national average, raising EV fuel cost`,
      weight: p.homeRateKwh - 16,
    });
  if (p.gasPriceDollar < 3.10)
    candidates.push({
      msg: `Low local gas price (${fmt.money2(p.gasPriceDollar)}/gal) shrinks the gap between gas and electric`,
      weight: 3.45 - p.gasPriceDollar,
    });
  if (p.annualMiles < 8000)
    candidates.push({
      msg: `Low annual mileage (${p.annualMiles.toLocaleString()} mi) limits total savings even when per-mile savings are solid`,
      weight: (10000 - p.annualMiles) / 2000,
    });
  if (p.homePct < 60)
    candidates.push({
      msg: `Charging mostly outside home (${p.homePct}% at home) — public charging is 2–4× pricier per kWh`,
      weight: (80 - p.homePct) / 20,
    });
  if (p.gasMpg > 38)
    candidates.push({
      msg: `Your gas car gets ${p.gasMpg} MPG — unusually efficient, meaning lower gas costs than average`,
      weight: (p.gasMpg - 30) / 10,
    });

  return candidates
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 2)
    .map((c) => c.msg);
}

function buildSuggestions(p: {
  homeRateKwh: number;
  annualMiles: number;
  homePct: number;
  hasTOU: boolean;
  touCents?: number;
  stateName: string;
}): string[] {
  const suggestions: string[] = [];

  if (p.hasTOU) {
    const touHint = p.touCents
      ? `as low as ${fmt.cents1(p.touCents)}/kWh`
      : "significantly lower than the state average";
    suggestions.push(
      `Switch to a time-of-use plan in ${p.stateName} — off-peak overnight rates are ${touHint}. Adjust the home rate slider above to model this.`
    );
  }
  if (p.annualMiles < 10000)
    suggestions.push(
      `Drive more miles. EV savings scale with mileage — try 15,000 mi/yr in the slider above to see the impact.`
    );
  if (p.homePct < 75)
    suggestions.push(
      `Increase home charging. Moving from ${p.homePct}% to 80% at home cuts your effective rate significantly — public chargers cost 2–4× more.`
    );
  if (p.homeRateKwh > 25)
    suggestions.push(
      `Shop for a lower electricity rate. ${p.stateName} has multiple utilities and EV-specific night rate plans — often 30–50% below the default residential rate.`
    );

  return suggestions.slice(0, 3);
}

export function ConditionalPostCalc() {
  const store = useCalculatorStore();
  const ev  = useMemo(() => evRepository.getBySlug(store.evSlug) ?? evRepository.getAll()[0], [store.evSlug]);
  const gas = useMemo(() => gasRepository.getById(store.gasId)  ?? gasRepository.getAll()[0], [store.gasId]);

  const savings = useMemo(
    () => computeSavings(ev.efficiency, gas.mpg, store),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ev.efficiency, gas.mpg, store.annualMiles, store.homePct, store.homeRateKwh, store.publicRateKwh, store.gasPriceDollar],
  );

  const { annualSavings, evAnnualCost, gasAnnualCost, evCostPerMile, gasCostPerMile } = savings;
  const { homeRateKwh, gasPriceDollar, annualMiles, homePct, stateData } = store;
  const hasTOU    = stateData.hasTOU;
  const touCents  = stateData.touCents;
  const stateName = stateData.name;

  // ── STRONG (>$800/yr) ─────────────────────────────────────────────────────
  if (annualSavings > 800) {
    return (
      <>
        <EVMarketplaceAffiliates />
        <EVInsuranceCTA />
        <LeadCaptureBoxGate
          sourcePage="/"
          sectionId="installer-quotes"
          sectionClassName="bg-cream-soft border-b border-line py-8"
          contentClassName="section-wrap"
          heading="Lock in your home charging setup"
          description="Get matched with up to 3 licensed electricians for Level 2 charger installation in your area."
          submitLabel="Get installer quotes"
        />
        <HomeChargingSection />
        <HomeChargerProducts />
        <LeadCaptureBoxGate
          sourcePage="/"
          sectionClassName="bg-cream-soft border-b border-line py-8"
          contentClassName="section-wrap"
        />
        <ChargingNetworkReferrals />
        <PublicChargingSection />
      </>
    );
  }

  // ── MARGINAL ($0–$800/yr) ─────────────────────────────────────────────────
  if (annualSavings >= 0) {
    const factors     = topFactors({ homeRateKwh, gasPriceDollar, annualMiles, homePct, gasMpg: gas.mpg });
    const suggestions = buildSuggestions({ homeRateKwh, annualMiles, homePct, hasTOU, touCents, stateName });

    return (
      <>
        <section className="py-14 border-b border-line bg-okay-bg/30">
          <div className="section-wrap max-w-3xl">
            <div className="font-mono text-[11px] uppercase tracking-widest text-okay-fg mb-3">Modest savings</div>
            <h2 className="font-serif text-3xl font-medium tracking-tight text-ink mb-3">
              {fmt.money0(annualSavings)}/yr in fuel savings — here&apos;s what could tip it further
            </h2>
            <p className="text-ink-3 leading-relaxed mb-8 max-w-xl">
              Switching to the {ev.name} saves on fuel, but not by a wide margin with these inputs. A few factors are keeping savings low.
            </p>

            {factors.length > 0 && (
              <div className="mb-8">
                <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-4">What&apos;s limiting your savings</div>
                <ul className="space-y-3">
                  {factors.map((f, i) => (
                    <li key={i} className="flex gap-3 text-sm text-ink-2">
                      <span className="text-okay-fg font-bold flex-shrink-0 mt-0.5">—</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {suggestions.length > 0 && (
              <div className="mb-8">
                <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-4">Adjustments that could help</div>
                <ul className="space-y-2">
                  {suggestions.map((s, i) => (
                    <li key={i} className="flex gap-3 text-sm text-ink-2">
                      <span className="text-forest font-bold flex-shrink-0 mt-0.5">→</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="border-t border-line pt-8">
              <LeadCaptureBoxGate
                sourcePage="/"
                sectionId="installer-quotes"
                heading="Get your actual electricity rate by ZIP"
                description="State averages can be 20–30% off from your real utility rate. Enter your ZIP for a more accurate estimate."
                submitLabel="Check my ZIP rate"
              />
            </div>
          </div>
        </section>

        <HomeChargingSection />
        <HomeChargerProducts />
        <ChargingNetworkReferrals />
        <PublicChargingSection />
      </>
    );
  }

  // ── NEGATIVE (<$0/yr) ─────────────────────────────────────────────────────
  const factors     = topFactors({ homeRateKwh, gasPriceDollar, annualMiles, homePct, gasMpg: gas.mpg });
  const suggestions = buildSuggestions({ homeRateKwh, annualMiles, homePct, hasTOU, touCents, stateName });
  const extraCost   = evAnnualCost - gasAnnualCost;

  return (
    <section className="py-14 border-b border-line bg-rust/5">
      <div className="section-wrap max-w-3xl">
        <div className="font-mono text-[11px] uppercase tracking-widest text-rust mb-3">Honest assessment</div>
        <h2 className="font-serif text-3xl font-medium tracking-tight text-ink mb-3">
          Gas is cheaper for this combination
        </h2>
        <p className="text-ink-3 leading-relaxed mb-8 max-w-xl">
          With these inputs, the {ev.name} costs <b className="text-rust">{fmt.money0(extraCost)} more</b> per year
          to fuel than the {gas.name}. Here&apos;s what&apos;s driving that, and what would flip it.
        </p>

        {/* Cost per mile table */}
        <div className="bg-paper border border-line rounded-2xl overflow-hidden mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line">
                <th className="text-left font-mono text-[10px] uppercase tracking-widest text-ink-mute py-3 px-5">Vehicle</th>
                <th className="text-right font-mono text-[10px] uppercase tracking-widest text-ink-mute py-3 px-5">¢/mile</th>
                <th className="text-right font-mono text-[10px] uppercase tracking-widest text-ink-mute py-3 px-5">Annual fuel</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-line-soft">
                <td className="py-3 px-5 text-ink-2">{ev.name} (electric)</td>
                <td className="py-3 px-5 text-right font-mono font-semibold text-rust">{(evCostPerMile * 100).toFixed(1)}¢</td>
                <td className="py-3 px-5 text-right font-mono font-semibold text-rust">{fmt.money0(evAnnualCost)}</td>
              </tr>
              <tr>
                <td className="py-3 px-5 text-ink-2">{gas.name} (gas)</td>
                <td className="py-3 px-5 text-right font-mono font-semibold text-forest">{(gasCostPerMile * 100).toFixed(1)}¢</td>
                <td className="py-3 px-5 text-right font-mono font-semibold text-forest">{fmt.money0(gasAnnualCost)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {factors.length > 0 && (
          <div className="mb-8">
            <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-4">What&apos;s driving the higher EV cost</div>
            <ul className="space-y-3">
              {factors.map((f, i) => (
                <li key={i} className="flex gap-3 text-sm text-ink-2">
                  <span className="text-rust font-bold flex-shrink-0 mt-0.5">—</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="mb-8">
            <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-4">What would change the math</div>
            <ul className="space-y-2">
              {suggestions.map((s, i) => (
                <li key={i} className="flex gap-3 text-sm text-ink-2">
                  <span className="text-forest font-bold flex-shrink-0 mt-0.5">→</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Efficient EV alternatives */}
        <div className="bg-paper border border-line rounded-2xl p-5">
          <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-3">Try a more efficient EV in the calculator</div>
          <div className="flex flex-wrap gap-2">
            {EFFICIENT_SUGGESTIONS.filter((s) => s.slug !== store.evSlug).slice(0, 3).map((s) => (
              <button
                key={s.slug}
                onClick={() => store.setEvSlug(s.slug)}
                className="text-xs text-forest border border-forest/30 rounded-lg px-3 py-1.5 hover:bg-forest/5 transition-colors font-mono"
              >
                {s.name} · {s.efficiency} mi/kWh
              </button>
            ))}
          </div>
          <p className="text-xs text-ink-mute mt-3">
            Clicking swaps the EV above and recalculates instantly.
          </p>
        </div>
      </div>
    </section>
  );
}
