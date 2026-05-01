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

function ProductCard({
  name,
  tag,
  price,
  desc,
  url,
  accent,
}: {
  name: string;
  tag: string;
  price: string;
  desc: string;
  url: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`relative rounded-2xl border p-5 flex flex-col gap-3 ${
        accent ? "border-forest/40 bg-forest/5" : "border-line bg-paper"
      }`}
    >
      {accent && (
        <span className="absolute top-4 right-4 bg-forest text-cream font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full">
          Top pick
        </span>
      )}

      <div>
        <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-1">
          {tag}
        </div>

        <div className="font-serif text-base font-medium text-ink leading-snug">
          {name}
        </div>
      </div>

      <p className="text-xs text-ink-mute leading-relaxed flex-1">
        {desc}
      </p>

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-line">
        <span className="font-serif font-medium text-forest text-lg">
          {price}
        </span>

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
    <section className="bg-cream-soft border-b border-line pt-14 pb-8" id="charger-gear">
      <div className="section-wrap">

        {/* Header */}
        <div className="mb-8">
          <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-3">
            EV gear
          </div>

          <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight mb-4">
            Best Level 2 home chargers
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <p className="text-ink-3 leading-relaxed text-sm">
              Installing a Level 2 charger is the biggest convenience upgrade in EV ownership — full battery every morning.
            </p>
            <p className="text-ink-3 leading-relaxed text-sm">
              Most homes do best with a 40–48 A charger on a dedicated 240 V circuit, but the right pick depends on your panel, connector type, and whether you want smart scheduling for off-peak utility rates.
            </p>
          </div>
        </div>

        {/* Charger grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {CHARGERS.map((c) => (
            <ProductCard key={c.url} {...c} />
          ))}
        </div>

        <div className="border-t border-line pt-6 grid md:grid-cols-2 gap-6">
          <p className="text-sm text-ink-3 leading-relaxed">
            Budget <span className="text-ink font-semibold">$800–$1,500 installed</span> for many Level 2 setups. A short wiring run from a modern panel can be less, while older homes, long conduit runs, permits, trenching, or panel upgrades can push the project higher.
          </p>
          <p className="text-sm text-ink-3 leading-relaxed">
            Before buying hardware, ask your electrician whether your home supports a plug-in NEMA 14-50 unit or should use a hardwired charger. Hardwired installs are often cleaner outdoors and can support higher amperage.
          </p>
        </div>

        {/* Affiliate disclosure */}
        <p className="mt-8 font-mono text-[10px] text-ink-mute/60">
          We may earn a commission on purchases made through these links — at no extra cost to you.
        </p>

      </div>
    </section>
  );
}
