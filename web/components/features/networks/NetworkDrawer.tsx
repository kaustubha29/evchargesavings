"use client";
import { BottomSheet } from "@/components/shared/BottomSheet";
import { connCompat } from "@/features/charging/recommender";
import type { ChargingNetwork } from "@/features/charging/types";
import type { ConnectorType } from "@/features/ev-data/types";
import { fmt } from "@/lib/format";
import { cn } from "@/lib/cn";

interface Props {
  network: ChargingNetwork | null;
  annualCost: number;
  evConn: ConnectorType | null;
  onClose: () => void;
}

const COMPAT_STYLES: Record<string, string> = {
  yes:      "bg-good-bg text-good-fg",
  adapter:  "bg-okay-bg text-okay-fg",
  incompat: "bg-red-50 text-red-700",
};

export function NetworkDrawer({ network, annualCost, evConn, onClose }: Props) {
  if (!network) return null;
  const compat = connCompat(evConn, network.connectors);

  return (
    <BottomSheet open={!!network} onClose={onClose}>
      <div className="px-6 pb-10 pt-4 max-w-2xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-center gap-4 mb-5">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-base font-sans flex-shrink-0"
            style={{ background: network.bgColor }}
          >
            {network.short}
          </div>
          <div>
            <div className="font-serif text-xl font-medium tracking-tight">{network.name}</div>
            <div className="font-mono text-xs text-ink-mute uppercase tracking-wide mt-0.5">
              {network.maxKw} kW max · ★ {network.stars}
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: "Max kW",    val: network.maxKw },
            { label: "Per kWh",  val: fmt.money2(network.perKwh) },
            { label: "Stations", val: network.stations.toLocaleString() },
          ].map((s) => (
            <div key={s.label} className="bg-cream-soft rounded-xl p-3 text-center">
              <div className="font-serif text-xl font-medium">{s.val}</div>
              <div className="font-mono text-[10px] text-ink-mute uppercase tracking-wide mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Annual cost */}
        <div className="mb-5">
          <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-1">Your annual cost estimate</div>
          <div className="font-serif text-4xl font-medium text-forest tracking-tight">{fmt.money0(annualCost)}/yr</div>
          <div className="text-xs text-ink-mute mt-1">Based on your public charging usage</div>
        </div>

        {/* Connector compat */}
        <div className="mb-5">
          <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-2">Connector compatibility</div>
          <span className={cn("inline-block px-3 py-1.5 rounded-full text-sm font-medium", COMPAT_STYLES[compat.cls])}>
            {compat.label}
          </span>
          <p className="text-xs text-ink-mute mt-1.5 italic">{compat.note}</p>
        </div>

        {/* Membership */}
        <div className="bg-cream-soft rounded-xl p-4 mb-5 text-sm">
          <span className="font-semibold">Membership: </span>{network.membershipLabel}
        </div>

        {/* Pros / Cons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-good-fg mb-2">Pros</div>
            <ul className="space-y-1.5">
              {network.pros.map((p) => (
                <li key={p} className="text-sm text-ink-2 flex gap-2">
                  <span className="text-emerald font-bold flex-shrink-0">✓</span>{p}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-rust mb-2">Cons</div>
            <ul className="space-y-1.5">
              {network.cons.map((c) => (
                <li key={c} className="text-sm text-ink-2 flex gap-2">
                  <span className="text-rust font-bold flex-shrink-0">✗</span>{c}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-4 bg-ink text-cream rounded-xl font-semibold text-base tracking-tight hover:bg-ink-2 transition-colors"
        >
          Done
        </button>
      </div>
    </BottomSheet>
  );
}
