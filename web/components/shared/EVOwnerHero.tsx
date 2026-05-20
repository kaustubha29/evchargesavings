"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import { useOwnerStore, deriveConnector } from "@/store/owner";
import { EV_MODELS } from "@/features/ev-data/data/evs";

const YEARS = Array.from({ length: 9 }, (_, i) => 2026 - i);

// Year × model combos — "2023 Kia EV9 Wind RWD" format
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
  tesla: "Tesla NACS",
  nacs:  "NACS",
  j1772: "J1772",
};

export function EVOwnerHero() {
  const { brand, year, model, setOwnerCar, clearOwnerCar } = useOwnerStore();
  const [query, setQuery] = useState(brand && year && model ? `${year} ${brand} ${model}` : "");
  const [open, setOpen] = useState(false);
  const [locked, setLocked] = useState(!!brand);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => { setLocked(!!brand); }, [brand]);

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
    setLocked(true);
    inputRef.current?.blur();
  };

  const clear = () => {
    clearOwnerCar();
    setQuery("");
    setOpen(false);
    setLocked(false);
    setTimeout(() => inputRef.current?.focus(), 0);
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
    <section className="bg-paper border-b border-line py-14 md:py-20" id="owner-car-picker">
      <div className="section-wrap max-w-3xl">
        <div className="font-mono text-[11px] uppercase tracking-widest text-forest mb-3">For EV owners</div>
        <h1 className="font-serif text-5xl font-medium tracking-tight text-ink mb-4">
          You already made the switch.<br />
          <em className="text-forest">Now make the most of it.</em>
        </h1>
        <p className="text-ink-3 text-lg leading-relaxed max-w-xl mb-8">
          Home charging, TOU electricity rates, public networks, and EV insurance — personalized for your exact car.
        </p>

        {/* Car picker — primary action */}
        <div className="mb-8">
          <label className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-2 block">
            Your EV
          </label>
          <div className="relative">
            {locked ? (
              <div className="flex items-center gap-2 border border-forest/40 rounded-xl px-4 py-3 bg-forest/5">
                <span className="flex-1 text-sm text-ink font-medium truncate">{query}</span>
                <button
                  type="button"
                  onClick={clear}
                  aria-label="Change car"
                  className="shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-forest/15 hover:bg-rust/20 text-ink-mute hover:text-rust transition-colors text-[10px]"
                >✕</button>
              </div>
            ) : (
              <>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  placeholder="e.g. 2023 Kia EV9, 2024 Tesla Model Y, 2022 Ford Mach-E…"
                  className={`w-full border rounded-xl px-4 py-3 pr-9 text-sm bg-paper font-sans outline-none transition-all ${
                    open ? "border-forest ring-2 ring-forest/20" : "border-line focus:ring-2 focus:ring-emerald/30 focus:border-forest"
                  }`}
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
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-ink-mute">
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
                {open && suggestions.length > 0 && (
                  <ul
                    ref={listRef}
                    className="absolute z-50 left-0 right-0 mt-1 bg-paper border border-line rounded-xl shadow-lg max-h-64 overflow-y-auto py-1"
                  >
                    {suggestions.map((opt) => (
                      <li key={`${opt.slug}-${opt.year}`}>
                        <button
                          onMouseDown={(e) => { e.preventDefault(); pick(opt); }}
                          className="w-full text-left px-4 py-2.5 text-sm hover:bg-forest/5 hover:text-ink transition-colors flex items-baseline gap-2"
                        >
                          <span className="font-mono text-xs text-ink-mute shrink-0">{opt.year}</span>
                          <span className="font-medium text-ink">{opt.brand}</span>
                          <span className="text-ink-2">{opt.model}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>

          {connector && brand && year ? (
            <div className="mt-2.5 flex items-center gap-2 text-xs flex-wrap">
              <span className="text-forest font-bold">✓</span>
              <span className="text-ink font-medium">{year} {brand} {model}</span>
              <span className="text-ink-mute">·</span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-forest">
                {CONNECTOR_LABEL[connector]} connector
              </span>
              <span className="text-ink-mute">·</span>
              <span className="text-ink-mute">ROI, chargers & adapters personalized below</span>
            </div>
          ) : (
            <p className="mt-2 text-xs text-ink-mute">
              Enter your car to personalize the ROI calculator, charger picks, and adapter recommendations below.
            </p>
          )}
        </div>

        {/* Secondary CTAs */}
        <div className="flex flex-wrap gap-3">
          <a href="#level2" className="px-4 py-2 rounded-xl text-sm font-semibold bg-forest text-white hover:bg-emerald transition-colors">
            Level 2 setup →
          </a>
          <a href="#ev-insurance" className="px-4 py-2 rounded-xl text-sm font-semibold border border-line text-ink-2 hover:border-forest/40 hover:text-forest transition-colors">
            Compare insurance →
          </a>
          <a href="/" className="px-4 py-2 rounded-xl text-sm font-semibold border border-line text-ink-2 hover:border-forest/40 hover:text-forest transition-colors">
            Still deciding? Try the calculator →
          </a>
        </div>
      </div>
    </section>
  );
}
