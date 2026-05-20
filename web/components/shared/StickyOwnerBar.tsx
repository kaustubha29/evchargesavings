"use client";
import { useOwnerStore, deriveConnector } from "@/store/owner";

const CONNECTOR_LABEL: Record<string, string> = {
  tesla: "Tesla NACS",
  nacs:  "NACS",
  j1772: "J1772",
};

export function StickyOwnerBar() {
  const { brand, year, model, clearOwnerCar } = useOwnerStore();
  if (!brand || !year) return null;

  const connector = deriveConnector(brand, year) ?? "j1772";

  return (
    <div className="sticky top-0 z-40 bg-forest text-cream border-b border-forest/20 py-2 px-4">
      <div className="section-wrap flex items-center gap-3">
        <span className="font-mono text-[10px] uppercase tracking-widest text-cream/60">Personalized for</span>
        <span className="font-mono text-xs font-semibold text-cream">{year} {brand}{model ? ` ${model}` : ""}</span>
        <span className="text-cream/40 font-mono text-[10px]">·</span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-emerald">
          {CONNECTOR_LABEL[connector]} connector
        </span>
        <button
          onClick={clearOwnerCar}
          className="ml-auto font-mono text-[10px] text-cream/50 hover:text-cream transition-colors uppercase tracking-widest"
        >
          Change car ✕
        </button>
      </div>
    </div>
  );
}
