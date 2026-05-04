"use client";

import { useMemo, useState } from "react";
import { useCalculatorStore, computeSavings } from "@/store/calculator";
import { evRepository, gasRepository } from "@/features/ev-data/repository";
import { getInsuranceData, NATIONAL_INSURANCE } from "@/features/insurance/data";
import { getAllStates } from "@/features/location/queries";
import { fmt } from "@/lib/format";

const STATES = getAllStates();

function Bar({ label, val, max, color }: { label: string; val: number; max: number; color: string }) {
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-ink-mute">{label}</span>
        <span className="font-mono font-medium text-ink">{fmt.money0(val)}/yr</span>
      </div>
      <div className="h-3 bg-black/8 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${(val / max * 100).toFixed(1)}%`, background: color }}
        />
      </div>
    </div>
  );
}

export function InsuranceCostWidget() {
  const store = useCalculatorStore();
  const { stateCode, stateData, evSlug, gasId } = store;

  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const activeCode = selectedCode ?? stateCode;

  const ins = activeCode ? getInsuranceData(activeCode) : NATIONAL_INSURANCE;
  const delta = ins.evAnnual - ins.gasAnnual;
  const stateName = activeCode
    ? (STATES.find((s) => s.code === activeCode)?.name ?? "Your state")
    : "United States";

  const ev  = useMemo(() => evRepository.getBySlug(evSlug) ?? evRepository.getAll()[0], [evSlug]);
  const gas = useMemo(() => gasRepository.getById(gasId) ?? gasRepository.getAll()[0], [gasId]);

  const fuelSavings = useMemo(
    () => computeSavings(ev.efficiency, gas.mpg, store),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ev.efficiency, gas.mpg, store.annualMiles, store.homePct, store.homeRateKwh, store.publicRateKwh, store.gasPriceDollar]
  );

  const netAnnual = fuelSavings.annualSavings - delta;
  const barMax = Math.max(ins.evAnnual, ins.gasAnnual, 1);

  return (
    <div className="space-y-4">
      {/* State selector */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="font-mono text-[11px] uppercase tracking-widest text-ink-mute">Showing rates for</span>
        <select
          value={activeCode ?? ""}
          onChange={(e) => setSelectedCode(e.target.value || null)}
          className="border border-line rounded-xl px-3 py-2 text-sm bg-paper font-sans focus:outline-none focus:ring-2 focus:ring-emerald"
        >
          <option value="">United States (avg)</option>
          {STATES.map((s) => (
            <option key={s.code} value={s.code}>{s.name}</option>
          ))}
        </select>
        {activeCode && !selectedCode && (
          <span className="font-mono text-[10px] text-emerald bg-emerald/10 px-2.5 py-1 rounded-full">
            Auto-detected
          </span>
        )}
      </div>

      {/* Main comparison card */}
      <div className="bg-paper border border-line rounded-3xl p-7 shadow-2 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-rust opacity-[0.06] -translate-y-12 translate-x-12 pointer-events-none" />

        <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-1">
          Annual auto insurance · {stateName}
        </div>

        <div className="flex items-end gap-3 mb-1">
          <div
            className="font-serif font-medium leading-none"
            style={{ fontSize: "clamp(40px,8vw,72px)", color: "#c25234" }}
          >
            +{fmt.money0(delta)}
          </div>
          <div className="font-serif text-lg text-ink-2 pb-2">per year for an EV</div>
        </div>

        <p className="text-sm text-ink-3 mb-5">
          EV owners in {stateName} pay {fmt.money0(ins.evAnnual)}/yr vs {fmt.money0(ins.gasAnnual)}/yr for a comparable gas car.
          That's {((delta / ins.gasAnnual) * 100).toFixed(0)}% more — primarily due to higher repair costs and specialized parts.
        </p>

        <Bar label="EV insurance"  val={ins.evAnnual}  max={barMax} color="#c25234" />
        <Bar label="Gas car insurance" val={ins.gasAnnual} max={barMax} color="#888" />
      </div>

      {/* Net savings card */}
      <div className={`rounded-2xl border p-6 ${netAnnual >= 0 ? "border-emerald/30 bg-emerald/5" : "border-rust/30 bg-rust/5"}`}>
        <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-1">
          Full picture · {ev.name} vs {gas.name}
        </div>
        <div className="flex items-baseline gap-2 flex-wrap mb-3">
          <span
            className="font-serif font-medium"
            style={{ fontSize: "clamp(28px,5vw,48px)", color: netAnnual >= 0 ? "#1a4d36" : "#c25234" }}
          >
            {netAnnual >= 0 ? "+" : ""}{fmt.money0(netAnnual)}
          </span>
          <span className="font-serif text-base text-ink-2">net per year</span>
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm">
          {[
            { label: "Fuel savings", val: fuelSavings.annualSavings, pos: true },
            { label: "Insurance extra", val: -delta, pos: false },
            { label: "Net saving", val: netAnnual, pos: netAnnual >= 0 },
          ].map((r) => (
            <div key={r.label}>
              <div className={`font-serif text-lg font-medium ${r.pos ? "text-forest" : "text-rust"}`}>
                {r.val >= 0 ? "+" : ""}{fmt.money0(r.val)}
              </div>
              <div className="text-xs text-ink-mute">{r.label}</div>
            </div>
          ))}
        </div>
        <p className="text-xs text-ink-mute mt-3">
          Based on your calculator settings. <a href="/#calculator" className="text-forest hover:underline">Adjust inputs →</a>
        </p>
      </div>
    </div>
  );
}
