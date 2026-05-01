const CHARGERS = [
  {
    name: "ChargePoint HomeFlex",
    tag: "Best overall",
    price: "$699",
    desc: "Wi-Fi, app control, works with any EV. Most flexible amperage (16–50 A).",
    url: "https://amzn.to/4cWpokz",
    accent: true,
  },
  {
    name: "Grizzl-E Classic",
    tag: "Best value",
    price: "$229",
    desc: "40 A / 240 V, UL certified, metal enclosure — no-frills workhorse.",
    url: "https://amzn.to/4t6JFKi",
  },
  {
    name: "Autel MaxiCharger",
    tag: "Smart pick",
    price: "$269",
    desc: "Up to 50 A, Bluetooth app, works with all J1772 EVs.",
    url: "https://amzn.to/428gHih",
  },
  {
    name: "Tesla Wall Connector",
    tag: "Tesla owners",
    price: "$595",
    desc: "Native NACS connector, up to 48 A. Best-in-class for any Tesla.",
    url: "https://amzn.to/4taNQVM",
  },
  {
    name: "EVIQO Level 2",
    tag: "Budget pick",
    price: "$199",
    desc: "32 A, NEMA 14-50 plug, gets most EVs to full overnight.",
    url: "https://amzn.to/4trN8DL",
  },
  {
    name: "AIMILER Portable L2",
    tag: "Portable",
    price: "~$150",
    desc: "Plugs into 240 V dryer outlet — no install needed, take it anywhere.",
    url: "https://amzn.to/42FXQLH",
  },
];

function ProductCard({ name, tag, price, desc, url, accent }: {
  name: string; tag: string; price: string; desc: string; url: string; accent?: boolean;
}) {
  return (
    <div className={`relative rounded-2xl border p-5 flex flex-col gap-3 ${accent ? "border-forest/40 bg-forest/5" : "border-line bg-paper"}`}>
      {accent && (
        <span className="absolute top-4 right-4 bg-forest text-cream font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full">
          Top pick
        </span>
      )}
      <div>
        <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-1">{tag}</div>
        <div className="font-serif text-base font-medium text-ink leading-snug">{name}</div>
      </div>
      <p className="text-xs text-ink-mute leading-relaxed flex-1">{desc}</p>
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-line">
        <span className="font-serif font-medium text-forest text-lg">{price}</span>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="font-mono text-[10px] uppercase tracking-widest bg-ink text-cream px-3 py-1.5 rounded-lg hover:bg-forest transition-colors"
        >
          Amazon →
        </a>
      </div>
    </div>
  );
}

export function HomeChargerProducts() {
  return (
    <section className="bg-cream-soft border-b border-line py-14" id="charger-gear">
      <div className="section-wrap">

        {/* Header */}
        <div className="mb-8">
          <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-3">EV gear</div>
          <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight mb-3">
            Best Level 2 home chargers
          </h2>
          <p className="text-ink-3 max-w-xl leading-relaxed">
            Installing a Level 2 charger is the single biggest quality-of-life upgrade for EV ownership — wake up to a full battery every morning.
          </p>
        </div>

        {/* Charger grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {CHARGERS.map((c) => (
            <ProductCard key={c.url} {...c} />
          ))}
        </div>

        {/* Installation cost guide */}
        <div className="mb-10">
          <div className="flex items-baseline gap-3 mb-4">
            <h3 className="font-serif text-xl font-medium tracking-tight">Level 2 installation costs</h3>
            <span className="font-mono text-[10px] uppercase tracking-widest text-ink-mute">What to budget</span>
          </div>
          <p className="text-ink-3 max-w-2xl leading-relaxed mb-6">
            Most homeowners pay <span className="text-ink font-semibold">$800–$1,500 all in</span> for a Level 2 charger install. The price depends on panel capacity, cable run length, permit fees, and whether you need a panel upgrade or trenching.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                tier: "Simple install",
                range: "$500–$900",
                note: "Panel nearby, 50 A available",
              },
              {
                tier: "Typical install",
                range: "$900–$1,500",
                note: "Most suburban homes",
                best: true,
              },
              {
                tier: "Complex install",
                range: "$1,500–$3,000+",
                note: "Older homes, long runs, condos",
              },
            ].map((t) => (
              <div key={t.tier} className={`rounded-2xl p-5 border ${t.best ? "border-forest/30 bg-forest/5" : "border-line bg-paper"}`}>
                {t.best && (
                  <div className="font-mono text-[10px] uppercase tracking-widest text-forest mb-2">Most common</div>
                )}
                <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-1">{t.tier}</div>
                <div className="font-serif text-2xl font-medium text-ink mb-1">{t.range}</div>
                <div className="text-xs text-ink-mute italic">{t.note}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Affiliate disclosure */}
        <p className="mt-8 font-mono text-[10px] text-ink-mute/60">
          We may earn a commission on purchases made through these links — at no extra cost to you.
        </p>

      </div>
    </section>
  );
}