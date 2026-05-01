"use client";
import { useEffect, useState, useMemo } from "react";
import { useCalculatorStore, computeSavings } from "@/store/calculator";
import { evRepository, gasRepository } from "@/features/ev-data/repository";
import { LEAD_FORM_SUBMITTED_KEY } from "@/components/shared/LeadCaptureBox";
import { fmt } from "@/lib/format";

export function StickySavingsBar() {
  const [visible, setVisible] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const store = useCalculatorStore();

  const ev  = useMemo(() => evRepository.getBySlug(store.evSlug) ?? evRepository.getAll()[0], [store.evSlug]);
  const gas = useMemo(() => gasRepository.getById(store.gasId) ?? gasRepository.getAll()[0], [store.gasId]);
  const savings = useMemo(
    () => computeSavings(ev.efficiency, gas.mpg, store),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ev.efficiency, gas.mpg, store.annualMiles, store.homePct, store.homeRateKwh, store.publicRateKwh, store.gasPriceDollar],
  );

  const locationLabel = store.stateCode ? (store.city ? `${store.city}, ${store.stateData.name}` : store.stateData.name) : "the US";

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 480);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const checkLeadSubmitted = () => {
      try {
        setLeadSubmitted(localStorage.getItem(LEAD_FORM_SUBMITTED_KEY) === "true");
      } catch {
        setLeadSubmitted(false);
      }
    };

    checkLeadSubmitted();
    window.addEventListener("ecs-lead-submitted", checkLeadSubmitted);

    return () => window.removeEventListener("ecs-lead-submitted", checkLeadSubmitted);
  }, []);

  return (
    <div
      className={`fixed bottom-0 inset-x-0 z-50 transition-transform duration-300 ease-in-out ${visible ? "translate-y-0" : "translate-y-full"}`}
      role="region"
      aria-label="Savings summary"
    >
      <div className="bg-ink/95 backdrop-blur-md border-t border-white/10 shadow-3 px-4 py-3 md:py-2.5">
        <div className="section-wrap flex items-center gap-4 flex-wrap">
          {/* Bolt icon */}
          <div className="hidden sm:flex w-8 h-8 rounded-full bg-emerald/20 items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-emerald" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 2L4 14h7l-2 8 9-12h-7l2-8z" />
            </svg>
          </div>

          {/* Savings amount */}
          <div className="flex-1 min-w-0">
            <div className="font-mono text-[10px] uppercase tracking-widest text-cream/40 leading-none mb-0.5">
              Annual savings in {locationLabel}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-xl font-medium text-honey leading-none">{fmt.money0(savings.annualSavings)}</span>
              <span className="font-mono text-xs text-cream/40">/yr</span>
            </div>
          </div>

          {/* Gas vs EV comparison */}
          <div className="hidden md:flex items-center gap-3 font-mono text-xs">
            <span className="text-rust/80">{fmt.money0(savings.gasAnnualCost)} gas</span>
            <span className="text-cream/20">→</span>
            <span className="text-emerald">{fmt.money0(savings.evAnnualCost)} EV</span>
            <span className="text-cream/30 ml-1">({fmt.pct0(savings.savingsPct)} less)</span>
          </div>

          <div className="flex flex-shrink-0 items-center gap-2">
            {!leadSubmitted && (
              <a
                href="/#installer-quotes"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-honey text-ink border border-honey/70 hover:bg-gold hover:border-gold transition-all"
              >
                Get quotes
              </a>
            )}
            <a
              href="#calculator"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-forest text-white border border-forest/50 hover:bg-emerald hover:border-emerald transition-all"
            >
              Adjust calculator ↑
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
