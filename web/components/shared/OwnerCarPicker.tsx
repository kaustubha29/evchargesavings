"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import { useOwnerStore, deriveConnector } from "@/store/owner";
import { EV_MODELS } from "@/features/ev-data/data/evs";

const YEARS = Array.from({ length: 9 }, (_, i) => 2026 - i);

const ALL_OPTIONS = EV_MODELS.flatMap((m) =>
  YEARS.map((year) => ({
    brand: m.brand,
    year,
    model: m.name,
    slug: m.slug,
    label: `${year} ${m.brand} ${m.name}`,
  }))
);

const CONNECTOR_LABEL: Record<string, string> = {
  tesla: "Tesla NACS — native connector",
  nacs:  "NACS — native connector",
  j1772: "J1772 — native connector",
};

export function OwnerCarPicker() {
  const { brand, year, model, setOwnerCar, clearOwnerCar } = useOwnerStore();
  const [query, setQuery] = useState(brand && year && model ? `${year} ${brand} ${model}` : "");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return ALL_OPTIONS.filter((o) => o.label.toLowerCase().includes(q)).slice(0, 8);
  }, [query]);

  const connector = brand && year ? deriveConnector(brand, year) : null;

  const pick = (opt: typeof ALL_OPTIONS[number]) => {
    setOwnerCar(opt.brand, opt.year, opt.model, opt.slug);
    setQuery(opt.label);
    setOpen(false);
  };

  const clear = () => {
    clearOwnerCar();
    setQuery("");
    setOpen(false);
    inputRef.current?.focus();
  };

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (
        !inputRef.current?.contains(e.target as Node) &&
        !listRef.current?.contains(e.target as Node)
      ) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  return (
    <section className="bg-paper border-b border-line py-5">
      <div className="section-wrap">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute shrink-0">Your EV</div>

          <div className="relative flex-1 max-w-sm">
            <input
              ref={inputRef}
              type="text"
              value={query}
              placeholder="e.g. 2023 Kia EV9, 2024 Tesla Model Y…"
              readOnly={!!brand}
              className={`w-full border border-line rounded-xl px-4 py-2.5 text-sm bg-paper outline-none focus:ring-2 focus:ring-emerald/30 focus:border-forest${brand ? " cursor-default select-none" : ""}`}
              onChange={(e) => {
                setQuery(e.target.value);
                clearOwnerCar();
                setOpen(true);
              }}
              onFocus={() => { if (query && !brand) setOpen(true); }}
              onKeyDown={(e) => {
                if (e.key === "Escape") setOpen(false);
                if (e.key === "Enter" && suggestions.length > 0) pick(suggestions[0]);
              }}
            />
            {brand && (
              <button onClick={clear} aria-label="Clear" className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-mute hover:text-rust text-xs">
                ✕
              </button>
            )}

            {open && suggestions.length > 0 && (
              <ul ref={listRef} className="absolute z-20 left-0 right-0 mt-1.5 bg-paper border border-line rounded-xl shadow-lg overflow-hidden">
                {suggestions.map((opt) => (
                  <li key={`${opt.slug}-${opt.year}`}>
                    <button
                      onMouseDown={(e) => { e.preventDefault(); pick(opt); }}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-forest/5 transition-colors flex items-baseline gap-2"
                    >
                      <span className="font-mono text-xs text-ink-mute">{opt.year}</span>
                      <span className="font-medium text-ink">{opt.brand}</span>
                      <span className="text-ink-2">{opt.model}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {connector && brand && year ? (
            <div className="flex items-center gap-2">
              <span className="text-forest text-sm">✓</span>
              <span className="text-sm text-ink font-medium">{year} {brand}{model ? ` ${model}` : ""}</span>
              <span className="font-mono text-[10px] text-forest uppercase tracking-widest">· {CONNECTOR_LABEL[connector]}</span>
            </div>
          ) : (
            <p className="text-xs text-ink-mute">Enter your car — everything below personalizes automatically.</p>
          )}
        </div>
      </div>
    </section>
  );
}
