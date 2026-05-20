"use client";
import { useOwnerStore } from "@/store/owner";

export function QuickWinsLabel() {
  const { brand, year, model } = useOwnerStore();

  if (brand && year) {
    return (
      <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-8 text-center">
        For your <span className="text-forest font-semibold">{year} {brand}{model ? ` ${model}` : ""}</span> — 3 things that move the needle most
      </div>
    );
  }

  return (
    <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-8 text-center">
      3 things that move the needle most
    </div>
  );
}
