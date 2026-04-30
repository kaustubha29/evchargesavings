"use client";
import { useState } from "react";
import { rankNetworks } from "@/features/charging/recommender";
import { NetworkDrawer } from "./NetworkDrawer";
import type { ChargingNetwork, NetworkWithCost } from "@/features/charging/types";
import type { ConnectorType } from "@/features/ev-data/types";
import { cn } from "@/lib/cn";
import { fmt } from "@/lib/format";

const COMPAT_STYLES: Record<string, string> = {
  yes:      "bg-good-bg text-good-fg",
  adapter:  "bg-okay-bg text-okay-fg",
  incompat: "bg-red-50 text-red-700",
};
const RATING_STYLES: Record<string, string> = {
  ex: "bg-good-bg text-good-fg",
  gd: "bg-blue-50 text-blue-700",
  fr: "bg-okay-bg text-okay-fg",
};
const RATING_LABELS: Record<string, string> = { ex:"Excellent", gd:"Good", fr:"Fair" };

interface Props {
  publicKwh: number;
  evConn: ConnectorType | null;
}

export function NetworkGrid({ publicKwh, evConn }: Props) {
  const [drawer, setDrawer] = useState<NetworkWithCost | null>(null);
  const ranked = rankNetworks(publicKwh, evConn);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ranked.map((n, idx) => (
          <button
            key={n.id}
            onClick={() => setDrawer(n)}
            className={cn("net-card text-left", idx === 0 && "net-card-best")}
            aria-label={`View ${n.name} details`}
          >
            {idx === 0 && (
              <span className="absolute top-3 right-3 bg-emerald-bright text-white font-mono text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                Best for you
              </span>
            )}
            {/* Head */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm font-sans flex-shrink-0"
                style={{ background: n.bgColor }}
              >
                {n.short}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-serif text-base font-medium leading-tight">{n.name}</div>
                <div className="font-mono text-[11px] text-ink-mute uppercase tracking-wide">{n.maxKw} kW max</div>
              </div>
              <span className={cn("font-mono text-[10px] font-semibold px-2 py-1 rounded-full uppercase tracking-wide", RATING_STYLES[n.rating])}>
                {RATING_LABELS[n.rating]}
              </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs font-mono py-3 border-t border-b border-line-soft mb-3">
              <span className="text-ink-mute">Per kWh</span><b>{fmt.money2(n.perKwh)}</b>
              <span className="text-ink-mute">Stations</span><b>{n.stations.toLocaleString()}</b>
            </div>

            {/* Annual cost */}
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[10px] uppercase tracking-wide text-ink-mute">Est. annual cost</span>
              <span className={cn("font-serif text-2xl font-medium tracking-tight", idx === 0 ? "text-good-fg" : idx === ranked.length-1 ? "text-rust" : "text-ink")}>
                {fmt.money0(n.annualCost)}
              </span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              <span className={cn("font-mono text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide", COMPAT_STYLES[n.compat.cls])}>
                {n.compat.label}
              </span>
              {n.connectors.map((c) => (
                <span key={c} className="bg-good-bg text-good-fg font-mono text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide">
                  {c}
                </span>
              ))}
              <span className="bg-cream text-ink-3 font-mono text-[10px] px-2 py-0.5 rounded-full">
                ★ {n.stars}
              </span>
            </div>

            <p className="text-xs text-ink-3 italic leading-relaxed">{n.desc}</p>
            <p className="font-mono text-[10px] text-emerald mt-2">Tap for full details →</p>
          </button>
        ))}
      </div>

      <NetworkDrawer
        network={drawer}
        annualCost={drawer?.annualCost ?? 0}
        evConn={evConn}
        onClose={() => setDrawer(null)}
      />
    </>
  );
}
