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
    tag: "High-power",
    price: "~$449",
    desc: "50 A hardwired, Bluetooth app, 25 ft cable. Hardwired install — highest sustained output for any EV.",
    url: "https://www.amazon.com/dp/B0GS1J1LGJ?ref=t_ac_view_request_product_image&campaignId=amzn1.campaign.2UEXKMIV15FPW&linkCode=tr1&tag=evchargesavin-20&linkId=amzn1.campaign.2UEXKMIV15FPW_1779095345424",
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
    tag: "Plug-in pick",
    price: "$419",
    desc: "40 A, NEMA 14-50 plug, 25 ft cable, NACS + J1772. No hardwiring — plug into any 14-50 outlet.",
    url: "https://www.amazon.com/dp/B0F48X956K?ref=t_ac_view_request_product_image&campaignId=amzn1.campaign.34059MM4NMY6Q&linkCode=tr1&tag=evchargesavin-20&linkId=amzn1.campaign.34059MM4NMY6Q_1779095040824",
  },
  {
    name: "Lectron Portable L2",
    tag: "Portable",
    price: "~$320",
    desc: "8–40 A dual-level, plugs into dryer outlet or standard 120 V — no install needed.",
    url: "https://www.amazon.com/dp/B0FVD5RGTF?ref=t_ac_view_request_product_image&campaignId=amzn1.campaign.128LVNK1YIBTX&linkCode=tr1&tag=evchargesavin-20&linkId=amzn1.campaign.128LVNK1YIBTX_1779095024452",
  },
];

function ProductCard({
  name,
  tag,
  desc,
  url,
  accent,
}: {
  name: string;
  tag: string;
  price?: string;
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
        <span className="font-mono text-[10px] uppercase tracking-widest text-ink-mute">
          Live price
        </span>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="font-mono text-[10px] uppercase tracking-widest bg-ink text-cream px-3 py-1.5 rounded-lg hover:bg-forest transition-colors"
        >
          Check on Amazon →
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
