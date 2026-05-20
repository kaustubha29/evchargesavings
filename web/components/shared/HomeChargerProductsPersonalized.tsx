"use client";
import { useState, useEffect, useMemo } from "react";
import { useCalculatorStore } from "@/store/calculator";
import { evRepository } from "@/features/ev-data/repository";

type ConnectorType = "tesla" | "nacs" | "j1772" | null;

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

// J1772 chargers (url) — shown for j1772/null selections
// NACS chargers (nacsUrl or separate id) — shown for tesla/nacs selections
const BASE_CHARGERS = [
  // ── J1772 entries ───────────────────────────────────────────────────────────
  {
    id: "chargepoint",
    name: "ChargePoint HomeFlex",
    tag: "Best overall · J1772",
    price: "$699",
    desc: "Wi-Fi, app control, 16–50 A. J1772 connector — plugs natively into any non-NACS EV.",
    url: "https://amzn.to/4cWpokz",
    nacsUrl: "https://amzn.to/4cWpokz",
  },
  {
    id: "grizzle",
    name: "Grizzl-E Classic",
    tag: "Best value · J1772",
    price: "$269",
    desc: "40 A / 240 V, UL certified, metal enclosure. J1772 connector — no-frills workhorse.",
    url: "https://amzn.to/4t6JFKi",
    nacsUrl: "https://amzn.to/4t6JFKi",
  },
  {
    id: "autel-plugin",
    name: "Autel MaxiCharger 40A",
    tag: "Plug-in · no electrician",
    price: null,
    desc: "40 A, NEMA 14-50 plug-in — uses existing dryer outlet, no electrician. J1772 connector, app control, 25 ft cable.",
    url: "https://www.awin1.com/cread.php?awinmid=72577&awinaffid=2896627&campaign=Autel+Spring+Sale+Boost&ued=https%3A%2F%2Fautelenergy.us%2Fproducts%2Fmaxicharger-ac-wallbox-home-40a-nema-14-50-ev-charger-with-separate-holster",
    nacsUrl: "https://www.awin1.com/cread.php?awinmid=72577&awinaffid=2896627&campaign=Autel+Spring+Sale+Boost&ued=https%3A%2F%2Fautelenergy.us%2Fproducts%2Fmaxicharger-ac-wallbox-home-40a-nema-14-50-ev-charger-with-separate-holster",
  },
  {
    id: "autel-hardwired",
    name: "Autel MaxiCharger 50A",
    tag: "High-power · J1772",
    price: null,
    desc: "50 A hardwired, max sustained output. J1772 connector, Bluetooth app, 25 ft cable. Electrician install required.",
    url: "https://www.awin1.com/cread.php?awinmid=72577&awinaffid=2896627&campaign=Autel+Spring+Sale+Boost&ued=https%3A%2F%2Fautelenergy.us%2Fproducts%2Fmaxicharger-ac-hardwired-wallbox-with-side-holster",
    nacsUrl: "https://www.awin1.com/cread.php?awinmid=72577&awinaffid=2896627&campaign=Autel+Spring+Sale+Boost&ued=https%3A%2F%2Fautelenergy.us%2Fproducts%2Fmaxicharger-ac-hardwired-wallbox-with-side-holster",
  },
  {
    id: "lectron",
    name: "Lectron Level 2",
    tag: "Budget pick · J1772",
    price: null,
    desc: "40 A, NEMA 14-50, UL certified. J1772 connector — solid no-frills wall-mount at a fair price.",
    url: "https://www.awin1.com/cread.php?awinmid=91891&awinaffid=2896627&ued=https%3A%2F%2Fev-lectron.com%2Fproducts%2Flectron-nema-14-50-level-2-ev-charger-240v-40-amp-j1772-charger-for-j1772-evs",
    nacsUrl: "https://www.awin1.com/cread.php?awinmid=91891&awinaffid=2896627&ued=https%3A%2F%2Fev-lectron.com%2Fproducts%2Flectron-nema-14-50-level-2-ev-charger-240v-40-amp-j1772-charger-for-j1772-evs",
  },
  {
    id: "aimiler",
    name: "Lectron Portable L2",
    tag: "Portable · J1772",
    price: "~$320",
    desc: "8–40 A dual-level, plugs into dryer outlet or standard 120 V. J1772 connector — no install needed.",
    url: "https://www.amazon.com/dp/B0FVD5RGTF?ref=t_ac_view_request_product_image&campaignId=amzn1.campaign.128LVNK1YIBTX&linkCode=tr1&tag=evchargesavin-20&linkId=amzn1.campaign.128LVNK1YIBTX_1779095024452",
    nacsUrl: "https://www.amazon.com/dp/B0FVD5RGTF?ref=t_ac_view_request_product_image&campaignId=amzn1.campaign.128LVNK1YIBTX&linkCode=tr1&tag=evchargesavin-20&linkId=amzn1.campaign.128LVNK1YIBTX_1779095024452",
  },
  // ── NACS-native entries ──────────────────────────────────────────────────────
  {
    id: "tesla-wc",
    name: "Tesla Wall Connector",
    tag: "Tesla · native NACS",
    price: "$595",
    desc: "Native NACS connector, up to 48 A. Designed for Tesla — best pick for any Tesla model.",
    url: "https://amzn.to/4taNQVM",
    nacsUrl: "https://amzn.to/4taNQVM",
  },
  {
    id: "chargepoint-nacs",
    name: "ChargePoint HomeFlex NACS",
    tag: "Best overall · NACS",
    price: null,
    desc: "Wi-Fi, app control, 16–50 A. Native NACS connector — plugs directly into Tesla, Kia, Hyundai, Ford, Rivian, and all NACS EVs.",
    url: "https://amzn.to/3PiusZ4",
    nacsUrl: "https://amzn.to/3PiusZ4",
  },
  {
    id: "grizzle-ultimate-nacs",
    name: "Grizzl-E 48A Ultimate NACS",
    tag: "High-power · NACS",
    price: null,
    desc: "48 A hardwired, max sustained output. Native NACS connector, UL certified, metal enclosure. Electrician install required.",
    url: "https://amzn.to/4v4vs28",
    nacsUrl: "https://amzn.to/4v4vs28",
  },
  {
    id: "grizzle-mini-nacs",
    name: "Grizzl-E Mini Connect NACS",
    tag: "Portable · NACS",
    price: null,
    desc: "40 A portable, NEMA 14-50 plug, 25 ft cable. Native NACS connector — no electrician, no adapter.",
    url: "https://amzn.to/42Ldhm4",
    nacsUrl: "https://amzn.to/42Ldhm4",
  },
  {
    id: "lectron-nexus",
    name: "Lectron NEXUS 40A NACS",
    tag: "Budget pick · NACS",
    price: null,
    desc: "40 A, NEMA 14-50 wall-mount. Native NACS connector, UL certified — solid no-frills NACS pick.",
    url: "https://www.awin1.com/cread.php?awinmid=91891&awinaffid=2896627&ued=https%3A%2F%2Fev-lectron.com%2Fproducts%2Flectron-nexus-level-2-nacs-tesla-ev-charging-station-240v-40-amp-23ft-cable-wall-mount-j-hook-plug-holder-nema-14-50",
    nacsUrl: "https://www.awin1.com/cread.php?awinmid=91891&awinaffid=2896627&ued=https%3A%2F%2Fev-lectron.com%2Fproducts%2Flectron-nexus-level-2-nacs-tesla-ev-charging-station-240v-40-amp-23ft-cable-wall-mount-j-hook-plug-holder-nema-14-50",
  },
  {
    id: "lectron-portable-nacs",
    name: "Lectron Portable NACS",
    tag: "Portable · NACS",
    price: null,
    desc: "8–40 A dual-level, plugs into dryer outlet or standard 120 V. Native NACS connector — no install, no adapter.",
    url: "https://www.awin1.com/cread.php?awinmid=91891&awinaffid=2896627&ued=https%3A%2F%2Fev-lectron.com%2Fproducts%2Flectron-portable-level-1-2-tesla-nacs-ev-charger-120v-240v-adjustable-current-8-40a-nema-5-15-14-50",
    nacsUrl: "https://www.awin1.com/cread.php?awinmid=91891&awinaffid=2896627&ued=https%3A%2F%2Fev-lectron.com%2Fproducts%2Flectron-portable-level-1-2-tesla-nacs-ev-charger-120v-240v-adjustable-current-8-40a-nema-5-15-14-50",
  },
  {
    id: "lectron-vbox-nacs",
    name: "Lectron V-BOX Pro NACS",
    tag: "Smart · WiFi · NACS",
    price: "$407",
    desc: "48 A, WiFi app control, scheduling. Native NACS connector, NEMA 14-50 or hardwired. Premium smart charger.",
    url: "https://www.awin1.com/cread.php?awinmid=91891&awinaffid=2896627&ued=https%3A%2F%2Fev-lectron.com%2Fproducts%2Flectron-home-level-2-nacs-tesla-v-box-pro-ev-charging-station-wifi-app-version-240v-48-amp-nema-14-50-hardwired",
    nacsUrl: "https://www.awin1.com/cread.php?awinmid=91891&awinaffid=2896627&ued=https%3A%2F%2Fev-lectron.com%2Fproducts%2Flectron-home-level-2-nacs-tesla-v-box-pro-ev-charging-station-wifi-app-version-240v-48-amp-nema-14-50-hardwired",
  },
];

// 6 cards per connector — all native, no adapter required
const LINEUP: Record<string, string[]> = {
  tesla: ["tesla-wc", "chargepoint-nacs", "grizzle-ultimate-nacs", "grizzle-mini-nacs", "lectron-nexus", "lectron-portable-nacs"],
  nacs:  ["chargepoint-nacs", "grizzle-ultimate-nacs", "grizzle-mini-nacs", "lectron-nexus", "lectron-portable-nacs", "lectron-vbox-nacs"],
  j1772: ["chargepoint", "grizzle", "autel-plugin", "autel-hardwired", "lectron", "aimiler"],
  null:  ["chargepoint", "grizzle", "autel-plugin", "autel-hardwired", "lectron", "aimiler"],
};

function selectChargers(connector: ConnectorType): Array<typeof BASE_CHARGERS[number] & { effectiveUrl: string }> {
  const ids = LINEUP[connector ?? "null"];
  const useNacs = connector === "tesla" || connector === "nacs";
  return ids.map((id) => {
    const c = BASE_CHARGERS.find((x) => x.id === id)!;
    return { ...c, effectiveUrl: useNacs ? c.nacsUrl : c.url };
  });
}

function accentId(connector: ConnectorType) {
  if (connector === "tesla") return "tesla-wc";
  if (connector === "nacs") return "chargepoint-nacs";
  return "chargepoint";
}

function ProductCard({
  name, tag, desc, url, accent, dimmed, btnLabel,
}: {
  name: string; tag: string; price?: string | null; desc: string;
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
        <span className="font-mono text-[10px] uppercase tracking-widest text-ink-mute">Live price</span>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="font-mono text-[10px] uppercase tracking-widest bg-ink text-cream px-3 py-1.5 rounded-lg hover:bg-forest transition-colors ml-auto"
        >
          {btnLabel ?? "Check on Amazon →"}
        </a>
      </div>
    </div>
  );
}

export function HomeChargerProductsPersonalized({ connectorOverride }: { connectorOverride?: ConnectorType } = {}) {
  const { evSlug } = useCalculatorStore();
  const selectedEv = useMemo(() => evRepository.getBySlug(evSlug) ?? null, [evSlug]);

  const autoConnector = useMemo((): ConnectorType => {
    if (connectorOverride !== undefined) return connectorOverride;
    if (!selectedEv) return null;
    if (selectedEv.brand === "Tesla") return "tesla";
    if (selectedEv.connector === "NACS") return "nacs";
    return "j1772";
  }, [selectedEv, connectorOverride]);

  const [connector, setConnector] = useState<ConnectorType>(connectorOverride ?? null);
  const [userOverride, setUserOverride] = useState(false);

  useEffect(() => {
    if (!userOverride) setConnector(autoConnector);
  }, [autoConnector, userOverride]);

  function handleConnector(v: ConnectorType) {
    setUserOverride(true);
    setConnector(v);
  }

  const chargers = selectChargers(connector);
  const topId    = accentId(connector);

  return (
    <section
      className={`bg-cream-soft border-b border-line pb-8 ${connectorOverride !== undefined ? "pt-6" : "pt-14"}`}
      id={connectorOverride !== undefined ? undefined : "charger-gear"}
    >
      <div className="section-wrap">

        {connectorOverride === undefined && (
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
        )}

        {/* Connector selector — hidden when parent already determined connector */}
        {connectorOverride === undefined && (
          <div className="mb-6">
            <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-3">
              What connector does your EV have?
            </div>
            <div className="flex gap-2 flex-wrap">
              {([
                { value: null,     label: "Not sure / show all" },
                { value: "tesla",  label: "Tesla" },
                { value: "nacs",   label: "NACS  —  Ford, GM, Rivian, Honda+" },
                { value: "j1772",  label: "J1772  —  older EV" },
              ] as { value: ConnectorType; label: string }[]).map((opt) => (
                <button
                  key={String(opt.value)}
                  onClick={() => handleConnector(opt.value)}
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
            {!userOverride && autoConnector && (
              <p className="mt-2 text-xs text-forest/80 font-mono">
                Auto-detected from your selected EV ·{" "}
                <button onClick={() => { setUserOverride(true); setConnector(null); }} className="underline hover:no-underline">
                  show all
                </button>
              </p>
            )}
            {connector && userOverride && (
              <p className="mt-2 text-xs text-forest/80 font-mono">
                {connector === "tesla"
                  ? "The Tesla Wall Connector is the best pick — native NACS connector, up to 48 A. J1772 chargers also work using the included adapter."
                  : connector === "nacs"
                  ? "All chargers here have a native NACS connector — no adapter needed."
                  : "J1772 chargers plug in natively to your EV."}
              </p>
            )}
          </div>
        )}

        {/* Charger grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {chargers.map((c) => (
            <ProductCard
              key={c.id}
              {...c}
              url={c.effectiveUrl}
              accent={c.id === topId}
              btnLabel={c.effectiveUrl.includes("awin1.com") ? "Shop →" : "Amazon →"}
            />
          ))}
        </div>

        {/* Adapters — car-specific */}
        {(() => {
          const adapterList =
            connector === "tesla"  ? [ADAPTERS[1]] :
            connector === "nacs"   ? [] :
            connector === "j1772"  ? [ADAPTERS[0]] :
                                     ADAPTERS;
          if (!adapterList.length) return null;
          return (
            <div className="mb-10">
              <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-3">Adapters</div>
              <div className="grid sm:grid-cols-2 gap-4">
                {adapterList.map((a) => (
                  <ProductCard key={a.name} {...a} btnLabel="Shop →" />
                ))}
              </div>
            </div>
          );
        })()}

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
