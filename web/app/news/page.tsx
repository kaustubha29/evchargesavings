import type { Metadata } from "next";
import { NEWS } from "@/features/news/data";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { StickySavingsBar } from "@/components/shared/StickySavingsBar";

export const metadata: Metadata = {
  title: "EV News — Latest Electric Vehicle & Charging News",
  description: "Breaking EV news on charging infrastructure, new models, pricing, and policy. Updated daily with the latest from the electric vehicle industry.",
  alternates: { canonical: "/news" },
  openGraph: {
    title: "EV News — Latest Electric Vehicle & Charging News",
    description: "Breaking EV news on charging infrastructure, new models, pricing, and policy.",
    url: "/news",
  },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function isRecent(iso: string) {
  return Date.now() - new Date(iso).getTime() < 1000 * 60 * 60 * 48;
}

export default function NewsIndexPage() {
  const sorted = [...NEWS].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  return (
    <>
      <StickySavingsBar />
      <main className="bg-paper min-h-screen">

        <section className="border-b border-line py-14">
          <div className="section-wrap">
            <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-4">EV News</div>
            <h1 className="font-serif text-4xl md:text-5xl font-medium tracking-tight text-ink mb-4 max-w-2xl leading-[1.05]">
              Latest EV & charging news
            </h1>
            <p className="text-ink-3 text-lg max-w-xl leading-relaxed">
              Daily coverage of charging infrastructure, new EVs, pricing, and policy — focused on what matters to drivers.
            </p>
          </div>
        </section>

        <div className="section-wrap py-12 max-w-3xl">
          <div className="space-y-4">
            {sorted.map((article) => (
              <a
                key={article.slug}
                href={`/news/${article.slug}`}
                className="group block bg-paper border border-line rounded-2xl p-6 hover:border-forest/40 hover:shadow-1 transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  {isRecent(article.publishedAt) && (
                    <span className="font-mono text-[9px] uppercase tracking-widest text-white bg-forest px-2 py-0.5 rounded-full">
                      New
                    </span>
                  )}
                  <span className="font-mono text-[10px] text-ink-mute">{formatDate(article.publishedAt)}</span>
                  <span className="font-mono text-[10px] text-ink-mute">{article.readTime}</span>
                </div>
                <h2 className="font-serif text-xl font-medium text-ink group-hover:text-forest transition-colors leading-snug mb-2">
                  {article.title}
                </h2>
                <p className="text-sm text-ink-3 leading-relaxed line-clamp-2">{article.hook}</p>
                <div className="mt-4 font-mono text-[10px] uppercase tracking-wide text-ink-mute group-hover:text-forest transition-colors">
                  Read →
                </div>
              </a>
            ))}
          </div>

          {sorted.length === 0 && (
            <p className="text-ink-3 text-sm">No articles yet — check back soon.</p>
          )}
        </div>

      </main>
      <SiteFooter />
    </>
  );
}
