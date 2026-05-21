"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import { useOwnerStore, deriveConnector } from "@/store/owner";
import { EV_MODELS } from "@/features/ev-data/data/evs";

const YEARS = Array.from({ length: 9 }, (_, i) => 2026 - i);

// Year × model combos — "2023 Kia EV9 Wind RWD" format
const ALL_OPTIONS = EV_MODELS.flatMap((m) =>
  YEARS.filter((year) => year >= m.firstYear).map((year) => ({
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
  const [activeIdx, setActiveIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    setLocked(!!brand);
    if (brand && year && model) setQuery(`${year} ${brand} ${model}`);
  }, [brand, year, model]);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return ALL_OPTIONS.filter((o) => o.label.toLowerCase().includes(q)).slice(0, 25);
  }, [query]);

  const connector = brand && year ? deriveConnector(brand, year) : null;

  const pick = (opt: typeof ALL_OPTIONS[number]) => {
    setOwnerCar(opt.brand, opt.year, opt.model, opt.slug);
    setQuery(opt.label);
    setOpen(false);
    setLocked(true);
    setActiveIdx(-1);
    inputRef.current?.blur();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).gtag?.("event", "owner_car_selected", {
      car_brand: opt.brand,
      car_model: opt.model,
      car_year: opt.year,
      car_label: opt.label,
    });
  };

  const clear = () => {
    clearOwnerCar();
    setQuery("");
    setOpen(false);
    setLocked(false);
    setActiveIdx(-1);
    setTimeout(() => inputRef.current?.focus(), 0);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).gtag?.("event", "owner_car_cleared");
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
    <section className="relative bg-paper border-b border-line py-16 md:py-28 overflow-hidden" id="owner-car-picker">
      <style>{`
        @keyframes _fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-anim { animation: _fadeUp 0.55s cubic-bezier(.22,.68,0,1.1) both; opacity: 0; }
      `}</style>
      {/* atmosphere — two glows */}
      <div className="pointer-events-none absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full bg-forest/[0.09] blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 -left-32 w-[500px] h-[500px] rounded-full bg-forest/[0.05] blur-3xl" />
      <div className="section-wrap relative">
        <div className="grid lg:grid-cols-[1.15fr_0.9fr] gap-14 items-center">

          {/* Left — headline + CTAs */}
          <div>
            <div className="hero-anim inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-forest bg-forest/8 px-3 py-1.5 rounded-full mb-5" style={{ animationDelay: "0ms" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-forest inline-block" />
              For EV owners
            </div>
            <h1 className="hero-anim font-serif text-[3.25rem] md:text-[4.25rem] font-medium tracking-tight text-ink mb-5 leading-[1.06]" style={{ animationDelay: "80ms" }}>
              You already<br />made the switch.<br />
              <em className="not-italic text-forest relative inline-block">
                Make the most of it.
                <span className="absolute bottom-0.5 left-0 w-full h-[3px] bg-forest/25 rounded-full" />
              </em>
            </h1>
            <p className="hero-anim text-ink-3 text-lg leading-relaxed max-w-md mb-9" style={{ animationDelay: "180ms" }}>
              Home charging, TOU rates, public networks, and EV insurance — personalized for your exact car.
            </p>
            <div className="hero-anim flex flex-wrap gap-3" style={{ animationDelay: "260ms" }}>
              <a href="#level2" className="px-6 py-3 rounded-xl text-sm font-semibold bg-forest text-white hover:bg-emerald transition-colors shadow-sm">
                Level 2 setup →
              </a>
              <a href="#ev-insurance" className="px-6 py-3 rounded-xl text-sm font-semibold border border-line text-ink-2 hover:border-forest/40 hover:text-forest transition-colors">
                Compare insurance →
              </a>
            </div>
          </div>

          {/* Right — car picker */}
          <div className="hero-anim bg-white border border-line/80 border-t-[3px] border-t-forest/70 rounded-2xl shadow-[0_8px_40px_-8px_rgba(0,0,0,0.13),0_2px_6px_-2px_rgba(0,0,0,0.07)] transition-shadow hover:shadow-[0_12px_48px_-8px_rgba(0,0,0,0.16)]" style={{ animationDelay: "200ms" }}>
            <div className="p-6">
            <label className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-2 block">
              Your EV
            </label>
            <div className="relative">
              {locked ? (
                <div className="flex items-center gap-3 bg-forest rounded-xl px-4 py-3">
                  <span className="text-emerald text-base leading-none">✓</span>
                  <span className="flex-1 text-sm text-cream font-semibold truncate">{query}</span>
                  <button
                    type="button"
                    onClick={clear}
                    aria-label="Change car"
                    className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-cream/50 hover:text-cream transition-colors"
                  >change</button>
                </div>
              ) : (
                <>
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    placeholder="e.g. 2024 Kia EV9, 2024 Tesla Model Y…"
                    className={`w-full border rounded-xl px-4 py-3 pr-9 text-sm bg-paper font-sans outline-none transition-all ${
                      open ? "border-forest ring-2 ring-forest/20" : "border-line focus:ring-2 focus:ring-emerald/30 focus:border-forest"
                    }`}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setActiveIdx(-1);
                      clearOwnerCar();
                      setOpen(true);
                    }}
                    onFocus={() => { if (query && !brand) setOpen(true); }}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") { setOpen(false); return; }
                      if (e.key === "ArrowDown") {
                        e.preventDefault();
                        setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1));
                        return;
                      }
                      if (e.key === "ArrowUp") {
                        e.preventDefault();
                        setActiveIdx((i) => Math.max(i - 1, -1));
                        return;
                      }
                      if (e.key === "Enter") {
                        const target = activeIdx >= 0 ? suggestions[activeIdx] : suggestions[0];
                        if (target) pick(target);
                      }
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
                      {suggestions.map((opt, i) => (
                        <li key={`${opt.slug}-${opt.year}`}>
                          <button
                            onMouseDown={(e) => { e.preventDefault(); pick(opt); }}
                            onMouseEnter={() => setActiveIdx(i)}
                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-baseline gap-2 ${i === activeIdx ? "bg-forest/10 text-ink" : "hover:bg-forest/5 text-ink"}`}
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
                <span className="font-mono text-[10px] uppercase tracking-widest text-forest">
                  {CONNECTOR_LABEL[connector]} connector
                </span>
                <span className="text-ink-mute">·</span>
                <span className="text-ink-mute">ROI, chargers & adapters personalized below</span>
              </div>
            ) : (
              <p className="mt-2 text-xs text-ink-mute">
                Enter your car to personalize results below.
              </p>
            )}
            <div className="mt-4 pt-4 border-t border-line flex flex-wrap gap-1.5">
              {[
                { icon: "⚡", label: "Charger ROI" },
                { icon: "🔌", label: "Adapter guide" },
                { icon: "🛡", label: "Insurance" },
                { icon: "🔔", label: "Recalls" },
              ].map((b) => (
                <span key={b.label} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-cream-soft text-[10px] font-mono uppercase tracking-wide text-ink-mute">
                  <span className="text-[11px]">{b.icon}</span>{b.label}
                </span>
              ))}
            </div>
            <div className="mt-3">
              <a href="/" className="font-mono text-[11px] text-ink-mute hover:text-forest transition-colors">
                Still shopping? Try the savings calculator →
              </a>
            </div>
            </div>{/* end p-6 */}
          </div>

        </div>
      </div>
    </section>
  );
}
