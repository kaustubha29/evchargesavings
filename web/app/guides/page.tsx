import type { Metadata } from "next";
import { GUIDES } from "@/features/guides/data";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { StickySavingsBar } from "@/components/shared/StickySavingsBar";

export const metadata: Metadata = {
  title: "EV Guides — Smarter EV Decisions",
  description: "Practical guides on buying, charging, financing, and owning an electric vehicle. Real numbers, no jargon.",
  alternates: { canonical: "/guides" },
  openGraph: {
    title: "EV Guides — Smarter EV Decisions",
    description: "Practical guides on buying, charging, financing, and owning an electric vehicle.",
    url: "/guides",
  },
};

const CATEGORY_ORDER = ["Buying", "Finance", "Installation", "Charging", "Savings", "Ownership", "Driving", "Education"];

function groupByCategory(guides: typeof GUIDES) {
  const map = new Map<string, typeof GUIDES>();
  for (const g of guides) {
    const list = map.get(g.category) ?? [];
    list.push(g);
    map.set(g.category, list);
  }
  return CATEGORY_ORDER
    .filter((c) => map.has(c))
    .map((c) => ({ category: c, guides: map.get(c)! }));
}

export default function GuidesIndexPage() {
  const groups = groupByCategory(GUIDES);

  return (
    <>
      <StickySavingsBar />
      <main className="bg-paper min-h-screen">

        {/* Hero */}
        <section className="border-b border-line py-14">
          <div className="section-wrap">
            <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-4">EV guides</div>
            <h1 className="font-serif text-4xl md:text-5xl font-medium tracking-tight text-ink mb-4 max-w-2xl leading-[1.05]">
              Smarter EV decisions, <em className="italic text-forest">minus the jargon</em>
            </h1>
            <p className="text-ink-3 text-lg max-w-xl leading-relaxed">
              {GUIDES.length} practical guides on buying, charging, financing, and owning an electric vehicle.
            </p>
          </div>
        </section>

        {/* Guides by category */}
        <div className="section-wrap py-12 space-y-14">
          {groups.map(({ category, guides }) => (
            <div key={category}>
              <div className="flex items-center gap-3 mb-6">
                <span className="font-mono text-[11px] uppercase tracking-widest text-forest bg-forest/8 px-3 py-1 rounded-full">
                  {category}
                </span>
                <span className="font-mono text-[10px] text-ink-mute">{guides.length} guide{guides.length !== 1 ? "s" : ""}</span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {guides.map((g) => (
                  <a
                    key={g.slug}
                    href={`/guides/${g.slug}`}
                    className="group block bg-paper border border-line rounded-2xl p-6 hover:border-forest/40 hover:shadow-1 transition-all"
                  >
                    <div className="font-mono text-[10px] text-ink-mute mb-3">{g.readTime}</div>
                    <h2 className="font-serif text-lg font-medium text-ink group-hover:text-forest transition-colors leading-snug mb-2">
                      {g.title}
                    </h2>
                    <p className="text-sm text-ink-3 leading-relaxed line-clamp-2">
                      {g.hook ?? g.description}
                    </p>
                    <div className="mt-4 font-mono text-[10px] uppercase tracking-wide text-ink-mute group-hover:text-forest transition-colors">
                      Read guide →
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Calculator CTA */}
        <div className="section-wrap pb-16">
          <div className="bg-ink text-cream rounded-3xl p-8">
            <div className="font-mono text-[10px] uppercase tracking-widest text-emerald mb-3">Free calculator</div>
            <h3 className="font-serif text-2xl font-medium mb-2">See your exact savings</h3>
            <p className="text-cream/60 text-sm leading-relaxed mb-6 max-w-lg">
              Pick your EV, your current gas car, and your state — get a personalised savings estimate with real 2026 rate data.
            </p>
            <a
              href="/#calculator"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-forest text-white border border-forest hover:bg-emerald hover:border-emerald transition-all"
            >
              Open calculator →
            </a>
          </div>
        </div>

      </main>
      <SiteFooter />
    </>
  );
}
