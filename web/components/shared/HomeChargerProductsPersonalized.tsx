"use client";
import { useState } from "react";

type ConnectorType = "nacs" | "j1772" | null;

const ADAPTERS = [
  {
    name: "NACS → CCS Adapter",
    tag: "Non-Tesla EVs",
    desc: "Use any Tesla Supercharger with your non-Tesla EV. 500A / 1000V, Vortex Plus with interlock.",
    price: null,
    url: "https://www.awin1.com/cread.php?awinmid=91891&awinaffid=2896627&ued=https%3A%2F%2Fev-lectron.com%2Fproducts%2Flectron-nacs-to-ccs-adapter-with-interlock-vortex-plus-500a-1-000v-compatible-with-tesla-superchargers",
  },
  {
    name: "Tesla → J1772 Adapter",
    tag: "Tesla owners",
    desc: "Plug your Tesla into any J1772 public or home charger. 250V / 80A.",
    price: null,
    url: "https://www.awin1.com/cread.php?awinmid=91891&awinaffid=2896627&ued=https%3A%2F%2Fev-lectron.com%2Fproducts%2Flectron-tesla-to-j1772-ev-adapter-250v-80-amp",
  },
];

const BASE_CHARGERS = [
  {
    id: "chargepoint",
    name: "ChargePoint HomeFlex",
    tag: "Best overall",
    price: "$699",
    desc: "Wi-Fi, app control, works with any EV via J1772. Most flexible amperage (16–50 A).",
    url: "https://amzn.to/4cWpokz",
    connectors: ["j1772", "nacs"],
  },
  {
    id: "grizzle",
    name: "Grizzl-E Classic",
    tag: "Best value",
    price: "$229",
    desc: "40 A / 240 V, UL certified, metal enclosure — no-frills workhorse.",
    url: "https://amzn.to/4t6JFKi",
    connectors: ["j1772", "nacs"],
  },
  {
    id: "tesla-wc",
    name: "Tesla Wall Connector",
    tag: "NACS / Tesla",
    price: "$595",
    desc: "Native NACS connector, up to 48 A. Works with Tesla and all 2024+ NACS EVs natively.",
    url: "https://amzn.to/4taNQVM",
    connectors: ["nacs"],
  },
  {
    id: "autel",
    name: "Autel MaxiCharger",
    tag: "Smart pick",
    price: "$269",
    desc: "Up to 50 A, Bluetooth app, works with all J1772 EVs.",
    url: "https://amzn.to/428gHih",
    connectors: ["j1772", "nacs"],
  },
  {
    id: "lectron",
    name: "Lectron Level 2",
    tag: "Budget pick",
    price: "$229",
    desc: "40 A, NEMA 14-50 plug, UL certified — solid no-frills charger at a fair price.",
    url: "https://www.awin1.com/cread.php?awinmid=91891&awinaffid=2896627&ued=https%3A%2F%2Fev-lectron.com%2Fproducts%2Flectron-nema-14-50-level-2-ev-charger-240v-40-amp-j1772-charger-for-j1772-evs",
    connectors: ["j1772", "nacs"],
  },
  {
    id: "aimiler",
    name: "Lectron Portable L2",
    tag: "Portable",
    price: "~$150",
    desc: "8–40 A dual-level, plugs into dryer outlet or standard 120 V — no install needed.",
    url: "https://www.amazon.com/dp/B0FVD5RGTF?ref=t_ac_view_request_product_image&campaignId=amzn1.campaign.128LVNK1YIBTX&linkCode=tr1&tag=evchargesavin-20&linkId=amzn1.campaign.128LVNK1YIBTX_1779095024452",
    connectors: ["j1772", "nacs"],
  },
];

function sortedChargers(connector: ConnectorType) {
  if (connector === "nacs") {
    // Tesla Wall Connector first for NACS owners
    const wc   = BASE_CHARGERS.find((c) => c.id === "tesla-wc")!;
    const rest = BASE_CHARGERS.filter((c) => c.id !== "tesla-wc");
    return [wc, ...rest];
  }
  if (connector === "j1772") {
    // Tesla Wall Connector last for J1772-only owners
    const non = BASE_CHARGERS.filter((c) => c.id !== "tesla-wc");
    const wc  = BASE_CHARGERS.find((c) => c.id === "tesla-wc")!;
    return [...non, wc];
  }
  return BASE_CHARGERS;
}

function accentId(connector: ConnectorType) {
  return connector === "nacs" ? "tesla-wc" : "chargepoint";
}

function ProductCard({
  name, tag, price, desc, url, accent, dimmed, btnLabel,
}: {
  name: string; tag: string; price: string | null; desc: string;
  url: string; accent?: boolean; dimmed?: boolean; btnLabel?: string;
}) {
  return (
    <div className={`relative rounded-2xl border p-5 flex flex-col gap-3 transition-all ${
      accent ? "border-forest/40 bg-forest/5" :
      dimmed ? "border-line bg-paper opacity-40" :
               "border-line bg-paper"
    }`}>
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
        {price && <span className="font-serif font-medium text-forest text-lg">{price}</span>}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="font-mono text-[10px] uppercase tracking-widest bg-ink text-cream px-3 py-1.5 rounded-lg hover:bg-forest transition-colors ml-auto"
        >
          {btnLabel ?? "Amazon →"}
        </a>
      </div>
    </div>
  );
}

export function HomeChargerProductsPersonalized() {
  const [connector, setConnector] = useState<ConnectorType>(null);
  const chargers = sortedChargers(connector);
  const topId    = accentId(connector);

  return (
    <section className="bg-cream-soft border-b border-line pt-14 pb-8" id="charger-gear">
      <div className="section-wrap">

        <div className="mb-8">
          <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-3">EV gear</div>
          <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight mb-4">
            Best Level 2 home chargers
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <p className="text-ink-3 leading-relaxed text-sm">
              Installing a Level 2 charger is the biggest convenience upgrade in EV ownership — full battery every morning.
            </p>
            <p className="text-ink-3 leading-relaxed text-sm">
              The right charger depends on your connector type. Most 2024+ EVs use NACS (Tesla, Ford, GM, Rivian, Honda, and more). Older EVs use J1772.
            </p>
          </div>
        </div>

        {/* Connector selector */}
        <div className="mb-6">
          <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-3">
            What connector does your EV have?
          </div>
          <div className="flex gap-2 flex-wrap">
            {([
              { value: null,     label: "Not sure / show all" },
              { value: "nacs",   label: "NACS  —  Tesla or 2024+ EV" },
              { value: "j1772",  label: "J1772  —  older EV" },
            ] as { value: ConnectorType; label: string }[]).map((opt) => (
              <button
                key={String(opt.value)}
                onClick={() => setConnector(opt.value)}
                className={`px-4 py-1.5 rounded-full text-xs font-mono border transition-all ${
                  connector === opt.value
                    ? "bg-forest text-white border-forest"
                    : "bg-paper text-ink-2 border-line hover:border-forest/40"
                }`}
              >
                {connector === opt.value && opt.value !== null ? "✓ " : ""}
                {opt.label}
              </button>
            ))}
          </div>
          {connector && (
            <p className="mt-2 text-xs text-forest/80 font-mono">
              {connector === "nacs"
                ? "NACS chargers (including the Tesla Wall Connector) plug in natively. J1772 chargers work too using the adapter that came with your car."
                : "J1772 chargers plug in natively. The Tesla Wall Connector requires a NACS-to-J1772 adapter — check if your EV includes one."}
            </p>
          )}
        </div>

        {/* Charger grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {chargers.map((c) => (
            <ProductCard
              key={c.id}
              {...c}
              accent={c.id === topId}
              dimmed={connector === "j1772" && c.id === "tesla-wc"}
              btnLabel={c.id === "lectron" ? "Shop →" : "Amazon →"}
            />
          ))}
        </div>

        {/* Adapters */}
        <div className="mb-10">
          <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-3">Adapters</div>
          <div className="grid sm:grid-cols-2 gap-4">
            {ADAPTERS.map((a) => (
              <ProductCard key={a.name} {...a} btnLabel="Shop →" />
            ))}
          </div>
        </div>

        <div className="border-t border-line pt-6 grid md:grid-cols-2 gap-6">
          <p className="text-sm text-ink-3 leading-relaxed">
            Budget <span className="text-ink font-semibold">$800–$1,500 installed</span> for many Level 2 setups. A short wiring run from a modern panel can be less, while older homes, long conduit runs, permits, or panel upgrades can push the project higher.
          </p>
          <p className="text-sm text-ink-3 leading-relaxed">
            Before buying hardware, ask your electrician whether your home supports a plug-in NEMA 14-50 unit or should use a hardwired charger. Hardwired installs are often cleaner outdoors and can support higher amperage.
          </p>
        </div>

        <p className="mt-8 font-mono text-[10px] text-ink-mute/60">
          We may earn a commission on purchases made through these links — at no extra cost to you.
        </p>
      </div>
    </section>
  );
}
