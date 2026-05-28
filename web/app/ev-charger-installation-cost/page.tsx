import type { Metadata } from "next";
import { getAllStates } from "@/features/location/queries";
import { getInstallCost } from "@/features/location/data/installation-costs";
import { SiteFooter } from "@/components/shared/SiteFooter";

export const metadata: Metadata = {
  title: "Level 2 EV Charger Installation Cost by State (2026)",
  description:
    "How much does a Level 2 EV charger installation cost in your state? Standard costs range from $700–$3,500 depending on labor market, panel condition, and run length. See state-by-state estimates.",
  alternates: { canonical: "/ev-charger-installation-cost" },
};

export default function InstallCostIndexPage() {
  const states = getAllStates();

  return (
    <>
      <main className="bg-paper min-h-screen">
        <section className="border-b border-line py-14 md:py-20">
          <div className="section-wrap max-w-4xl">
            <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-4">By state · 2026</div>
            <h1 className="font-serif text-4xl md:text-5xl font-medium tracking-tight text-ink mb-4">
              Level 2 EV charger installation cost by state
            </h1>
            <p className="text-ink-3 text-lg leading-relaxed max-w-2xl">
              Installation costs vary widely by state — labor rates, permit requirements, and panel upgrade frequency all differ.
              Select your state for a detailed estimate including the §30C tax credit (30%, up to $1,000 — expires June 30, 2026).
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="section-wrap max-w-4xl">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {states.map((s) => {
                const cost = getInstallCost(s.code);
                return (
                  <a
                    key={s.code}
                    href={`/ev-charger-installation-cost/${s.slug}`}
                    className="flex items-center justify-between border border-line rounded-xl px-4 py-3 hover:border-forest hover:bg-cream-soft transition-colors group"
                  >
                    <span className="text-sm font-medium text-ink group-hover:text-forest">{s.name}</span>
                    <span className="font-mono text-xs text-ink-mute">
                      ${cost.low.toLocaleString()}–${cost.high.toLocaleString()}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
