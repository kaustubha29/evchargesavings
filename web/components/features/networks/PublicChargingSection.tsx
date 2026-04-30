"use client";
import { useMemo } from "react";
import { useCalculatorStore, computeSavings } from "@/store/calculator";
import { evRepository, gasRepository } from "@/features/ev-data/repository";
import { NetworkGrid } from "./NetworkGrid";

export function PublicChargingSection() {
  const store = useCalculatorStore();
  const { evSlug } = store;

  const ev = useMemo(
    () => evRepository.getBySlug(evSlug) ?? evRepository.getAll()[0],
    [evSlug],
  );

  const gas = useMemo(
    () => gasRepository.getById(store.gasId) ?? gasRepository.getAll()[0],
    [store.gasId],
  );

  const savings = useMemo(
    () => computeSavings(ev.efficiency, gas.mpg, store),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ev.efficiency, gas.mpg, store.annualMiles, store.homePct, store.homeRateKwh, store.publicRateKwh, store.gasPriceDollar],
  );

  return (
    <section className="bg-paper border-b border-line py-14" id="public-charging">
      <div className="section-wrap">
        <div className="mb-8">
          <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-3">Public charging</div>
          <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight mb-3">
            Where to plug in on the road
          </h2>
          <p className="text-ink-3 max-w-xl leading-relaxed">
            The US now has over 175,000 public charging outlets. The rankings below are personalised
            to your current EV selection and driving split.
          </p>
        </div>

        {/* Apps row */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {[
            {
              name: "PlugShare",
              type: "Free · iOS & Android",
              desc: "Crowdsourced map of every public charger in North America. See real-time availability, check-in reviews, and photos before you arrive. The gold standard for finding working stalls.",
              tag: "Best overall finder",
              tagColor: "bg-good-bg text-good-fg",
              web: "https://www.plugshare.com",
              ios: "https://apps.apple.com/us/app/plugshare/id421788217",
              android: "https://play.google.com/store/apps/details?id=com.recargo.plugshare",
            },
            {
              name: "A Better Route Planner",
              type: "Free · $3/mo premium · iOS & Android",
              desc: "Enter your destination and ABRP calculates every charging stop automatically — factoring in elevation, speed, weather, and your car's real efficiency. Essential for road trips.",
              tag: "Best for road trips",
              tagColor: "bg-blue-50 text-blue-700",
              web: "https://abetterrouteplanner.com",
              ios: "https://apps.apple.com/us/app/a-better-routeplanner-abrp/id1490860521",
              android: "https://play.google.com/store/apps/details?id=com.iternio.abrpapp",
            },
          ].map((n) => (
            <div key={n.name} className="bg-paper border border-line rounded-2xl p-5 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-serif text-base font-medium text-ink">{n.name}</div>
                  <div className="font-mono text-[10px] text-ink-mute uppercase tracking-wide mt-0.5">{n.type}</div>
                </div>
                <span className={`font-mono text-[9px] uppercase tracking-wide px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 ${n.tagColor}`}>
                  {n.tag}
                </span>
              </div>
              <p className="text-sm text-ink-3 leading-relaxed">{n.desc}</p>
              <div className="flex flex-wrap gap-2 pt-1">
                <a
                  href={n.web}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wide text-forest border border-forest/30 hover:border-forest hover:bg-good-bg px-3 py-1.5 rounded-lg transition-all"
                >
                  Open web app →
                </a>
                <a
                  href={n.ios}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wide text-ink-3 border border-line hover:border-ink-3 px-3 py-1.5 rounded-lg transition-all"
                >
                  App Store
                </a>
                <a
                  href={n.android}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wide text-ink-3 border border-line hover:border-ink-3 px-3 py-1.5 rounded-lg transition-all"
                >
                  Google Play
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Live network ranking */}
        <div className="mb-6">
          <h3 className="font-serif text-xl font-medium tracking-tight mb-1">
            Best network for your {ev.name}
          </h3>
          <p className="text-sm text-ink-3 mb-5">
            Ranked by your estimated annual public charging cost · tap any card for full details
          </p>
          <NetworkGrid publicKwh={savings.publicKwh} evConn={ev.connector} />
        </div>

        {/* Pro tips */}
        <div className="bg-ink text-cream rounded-2xl p-6">
          <div className="font-mono text-[11px] uppercase tracking-widest text-emerald mb-3">Pro tips for fast charging</div>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              "Charge to 80% on DC fast chargers — the last 20% charges at half the speed.",
              "Plan stops before you hit 20% battery — range anxiety is avoidable with a little planning.",
              "Check check-in reports on PlugShare before you arrive; out-of-order stalls are common.",
              "Precondition your battery while plugged in on cold mornings — saves 20–30% range.",
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
  );
}
