"use client";
import { useOwnerStore, deriveConnector } from "@/store/owner";
import { HomeChargerProductsPersonalized } from "./HomeChargerProductsPersonalized";

type ConnectorType = "tesla" | "nacs" | "j1772" | null;

const CONNECTOR_DESC: Record<string, string> = {
  tesla: "Native NACS — Tesla Wall Connector is the top pick, plus 5 other NACS-native options.",
  nacs:  "Native NACS connector — every charger below plugs straight in, no adapter needed.",
  j1772: "J1772 connector — every charger below plugs straight in, no adapter needed.",
};

export function EVOwnerChargerBundle() {
  const { brand, year, model } = useOwnerStore();
  const connector: ConnectorType = brand && year ? deriveConnector(brand, year) : null;

  return (
    <>
      <section className="bg-cream-soft pt-6 pb-0" id="charger-gear">
        <div className="section-wrap">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

            {/* LEFT — heading */}
            <div>
              <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-1">EV gear</div>
              <h2 className="font-serif text-2xl font-medium tracking-tight">
                Best Level 2 home chargers
              </h2>
              <p className="text-sm text-ink-3 mt-1">Full charge every morning — the single biggest convenience upgrade in EV ownership.</p>
            </div>

            {/* RIGHT — connector status */}
            <div className="shrink-0">
              {connector && brand && year ? (
                <div className="flex items-center gap-2 bg-forest/6 border border-forest/20 rounded-xl px-4 py-2.5">
                  <span className="text-forest text-sm leading-none">✓</span>
                  <div>
                    <p className="text-sm font-medium text-ink leading-snug">
                      {connector === "tesla" ? "Tesla NACS" : connector === "nacs" ? "NACS" : "J1772"} chargers for your {year} {brand}{model ? ` ${model}` : ""}
                    </p>
                    <p className="text-xs text-ink-mute leading-snug">
                      {CONNECTOR_DESC[connector]}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 border border-line rounded-xl px-4 py-2.5 bg-paper">
                  <span className="text-ink-mute text-sm leading-none">↑</span>
                  <p className="text-sm text-ink-mute">
                    Enter your car above — we&apos;ll filter to native-plug chargers.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      <HomeChargerProductsPersonalized connectorOverride={connector} />
    </>
  );
}
