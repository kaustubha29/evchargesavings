import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { NEWS, getNewsBySlug, type NewsTable } from "@/features/news/data";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { StickySavingsBar } from "@/components/shared/StickySavingsBar";
import { ArticleScrollTracker } from "@/components/shared/ArticleScrollTracker";

const BASE = "https://www.evchargesavings.com";

interface Props { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return NEWS.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getNewsBySlug(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/news/${slug}` },
    openGraph: {
      title: article.title,
      description: article.description,
      url: `/news/${slug}`,
      type: "article",
      publishedTime: article.publishedAt,
    },
  };
}

function ComparisonTable({ table }: { table: NewsTable }) {
  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0 mt-4">
      <table className="w-full text-sm border-collapse min-w-[500px]">
        <thead>
          <tr className="bg-ink text-cream">
            {table.headers.map((h, i) => (
              <th
                key={i}
                className={`px-4 py-3 text-left font-mono text-[10px] uppercase tracking-widest font-medium ${i === 0 ? "rounded-tl-xl" : ""} ${i === table.headers.length - 1 ? "rounded-tr-xl" : ""}`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, ri) => (
            <tr key={ri} className={ri % 2 === 0 ? "bg-cream-soft" : "bg-paper"}>
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className={`px-4 py-3 text-ink-2 border-b border-line ${ci === 0 ? "font-medium text-ink" : ""} ${ri === table.rows.length - 1 && ci === 0 ? "rounded-bl-xl" : ""} ${ri === table.rows.length - 1 && ci === row.length - 1 ? "rounded-br-xl" : ""}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getNewsBySlug(slug);
  if (!article) notFound();

  const others = NEWS.filter((a) => a.slug !== slug)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.description,
    image: [`${BASE}/news/${slug}/opengraph-image`],
    datePublished: `${article.publishedAt}T08:00:00Z`,
    dateModified: `${article.publishedAt}T08:00:00Z`,
    url: `${BASE}/news/${slug}`,
    publisher: {
      "@type": "Organization",
      name: "EV Charge Savings",
      url: BASE,
    },
    author: {
      "@type": "Person",
      name: "Kaustubha",
      url: `${BASE}/about`,
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE },
      { "@type": "ListItem", position: 2, name: "News", item: `${BASE}/news` },
      { "@type": "ListItem", position: 3, name: article.title, item: `${BASE}/news/${slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleScrollTracker slug={slug} />
      <StickySavingsBar />
      <main className="bg-paper min-h-screen">
        <div className="section-wrap py-12 max-w-3xl">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 font-mono text-xs text-ink-mute mb-8">
            <a href="/" className="hover:text-forest transition-colors">Home</a>
            <span>/</span>
            <a href="/news" className="hover:text-forest transition-colors">News</a>
            <span>/</span>
            <span className="text-ink-3 truncate max-w-[200px]">{article.title}</span>
          </div>

          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-[10px] uppercase tracking-widest text-white bg-forest px-2.5 py-1 rounded-full">
                News
              </span>
              <span className="font-mono text-[10px] text-ink-mute">{formatDate(article.publishedAt)}</span>
              <span className="font-mono text-[10px] text-ink-mute">{article.readTime}</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-medium tracking-tight text-ink mb-3" style={{ lineHeight: 1.1 }}>
              {article.title}
            </h1>
            <p className="text-ink-2 text-base leading-relaxed max-w-2xl mb-5">{article.hook}</p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-forest/15 border border-forest/25 flex items-center justify-center flex-shrink-0">
                <span className="text-forest font-serif text-sm font-medium">K</span>
              </div>
              <div>
                <a href="/about" className="font-semibold text-sm text-ink hover:text-forest transition-colors">Kaustubha</a>
                <span className="font-mono text-[10px] text-ink-mute ml-2 uppercase tracking-widest">Kia EV9 owner · EV Charge Savings</span>
              </div>
            </div>
          </div>

          {/* Article body */}
          <div className="space-y-10 mb-14">
            {article.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-serif text-2xl font-medium tracking-tight text-ink mb-3">{section.heading}</h2>
                <p className="text-ink-2 leading-relaxed mb-4">{section.body}</p>
                {section.list && (
                  <ul className="space-y-2">
                    {section.list.map((item) => (
                      <li key={item} className="flex gap-3 text-sm text-ink-3 leading-relaxed">
                        <span className="text-forest font-bold flex-shrink-0 mt-0.5">·</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                {section.table && <ComparisonTable table={section.table} />}
              </section>
            ))}
          </div>

          {/* Sources */}
          {article.sources && article.sources.length > 0 && (
            <div className="border-t border-line pt-6 mb-10">
              <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-3">Sources</div>
              <ul className="space-y-1.5">
                {article.sources.map((s) => (
                  <li key={s.url} className="text-sm">
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-forest hover:underline"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Calculator CTA */}
          <div className="bg-ink text-cream rounded-3xl p-8 mb-10">
            <div className="font-mono text-[10px] uppercase tracking-widest text-emerald mb-3">Free calculator</div>
            <h3 className="font-serif text-2xl font-medium mb-2">See your exact charging costs</h3>
            <p className="text-cream/60 text-sm leading-relaxed mb-6 max-w-lg">
              Pick your EV and state — get annual fuel savings vs your current gas car using live EIA rate data.
            </p>
            <a
              href="/#calculator"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-forest text-white border border-forest hover:bg-emerald hover:border-emerald transition-all"
            >
              Open calculator →
            </a>
          </div>

          {/* Related news */}
          {others.length > 0 && (
            <div>
              <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-5">More news</div>
              <div className="space-y-3">
                {others.map((a) => (
                  <a
                    key={a.slug}
                    href={`/news/${a.slug}`}
                    className="group flex gap-4 bg-paper border border-line rounded-xl p-4 hover:border-forest/40 transition-all"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-mono text-[9px] text-ink-mute mb-1">{formatDate(a.publishedAt)}</div>
                      <div className="font-serif text-base font-medium text-ink group-hover:text-forest transition-colors leading-snug">
                        {a.title}
                      </div>
                    </div>
                    <span className="font-mono text-[10px] text-ink-mute group-hover:text-forest transition-colors self-center flex-shrink-0">→</span>
                  </a>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
      <SiteFooter />
    </>
  );
}
