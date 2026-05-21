import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { GUIDES, getGuideBySlug } from "@/features/guides/data";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { StickySavingsBar } from "@/components/shared/StickySavingsBar";
import { HomeChargerProductsPersonalized } from "@/components/shared/HomeChargerProductsPersonalized";
import { EVMarketplaceAffiliates } from "@/components/shared/EVMarketplaceAffiliates";
import { EVInsuranceCTA } from "@/components/shared/EVInsuranceCTA";

const BASE = "https://evchargesavings.com";
const SITE_CONTENT_UPDATED = "2026-05-18"; // bump when the guide corpus is materially refreshed
const AUTHOR = { "@type": "Person", name: "Kaustubha", url: `${BASE}/about` };

interface Props { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `/guides/${slug}` },
    openGraph: {
      title: guide.title,
      description: guide.description,
      url: `/guides/${slug}`,
      type: "article",
    },
  };
}

function AffiliateSection({ category }: { category: string }) {
  if (category === "Installation" || category === "Charging" || category === "Savings") {
    return <HomeChargerProductsPersonalized />;
  }
  if (category === "Buying" || category === "Finance" || category === "Education") {
    return <EVMarketplaceAffiliates />;
  }
  if (category === "Ownership" || category === "Insurance") {
    return <EVInsuranceCTA />;
  }
  if (category === "Driving") {
    return null;
  }
  return null;
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const others = GUIDES.filter((g) => g.slug !== slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    url: `${BASE}/guides/${slug}`,
    image: [`${BASE}/guides/${slug}/opengraph-image`],
    datePublished: `${guide.publishedAt ?? SITE_CONTENT_UPDATED}T08:00:00Z`,
    dateModified: `${SITE_CONTENT_UPDATED}T08:00:00Z`,
    author: AUTHOR,
    publisher: {
      "@type": "Organization",
      name: "EV Charge Savings",
      url: BASE,
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE },
      { "@type": "ListItem", position: 2, name: "Guides", item: `${BASE}/guides` },
      { "@type": "ListItem", position: 3, name: guide.title, item: `${BASE}/guides/${slug}` },
    ],
  };

  const faqLd = guide.faqs && guide.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: guide.faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  } : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}
      <StickySavingsBar />
      <main className="bg-paper min-h-screen">

        {/* Narrow article column */}
        <div className="section-wrap py-12 max-w-3xl">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 font-mono text-xs text-ink-mute mb-8">
            <a href="/" className="hover:text-forest transition-colors">Home</a>
            <span>/</span>
            <a href="/#guides" className="hover:text-forest transition-colors">Guides</a>
            <span>/</span>
            <span className="text-ink-3">{guide.title}</span>
          </div>

          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-[10px] uppercase tracking-widest text-ink-mute bg-cream-soft border border-line px-2.5 py-1 rounded-full">
                {guide.category}
              </span>
              <span className="font-mono text-[10px] text-ink-mute">{guide.readTime}</span>
              {guide.publishedAt && (
                <span className="font-mono text-[10px] text-ink-mute">
                  {new Date(guide.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </span>
              )}
              <span className="font-mono text-[10px] text-ink-mute">
                By <a href="/about" className="text-forest hover:underline">Kaustubha</a>, EV9 owner
              </span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-medium tracking-tight text-ink mb-3" style={{ lineHeight: 1.1 }}>
              {guide.title}
            </h1>
            <p className="text-ink-2 text-base leading-relaxed max-w-3xl">{guide.description}</p>
          </div>

          {(guide.category === "Buying" || guide.category === "Finance") && slug !== "ev-tax-credit-7500" && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 mb-6 flex gap-3 items-start">
              <span className="text-amber-500 text-lg flex-shrink-0 mt-0.5">⚠</span>
              <div>
                <div className="font-semibold text-sm text-ink mb-1">The $7,500 federal EV tax credit ended October 1, 2025</div>
                <p className="text-xs text-ink-3 leading-relaxed">
                  The One Big Beautiful Bill eliminated the §30D credit. Several state programs are still active.{" "}
                  <a href="/guides/ev-tax-credit-7500" className="text-forest underline font-medium">See what's left →</a>
                </p>
              </div>
            </div>
          )}

          {(guide.category === "Installation" || guide.category === "Charging" || slug === "ev-tax-credit-7500") && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 mb-6 flex gap-3 items-start">
              <span className="text-amber-500 text-lg flex-shrink-0 mt-0.5">⚠</span>
              <div>
                <div className="font-semibold text-sm text-ink mb-1">The home EV charger tax credit ends June 30, 2026</div>
                <p className="text-xs text-ink-3 leading-relaxed">
                  The federal §30C credit (30%, up to $1,000) terminates June 30. A census-tract requirement means many homeowners don&apos;t qualify — check before you spend.{" "}
                  <a href="/news/home-ev-charger-tax-credit-ends-june-2026" className="text-forest underline font-medium">Read the deadline breakdown →</a>
                </p>
              </div>
            </div>
          )}

          {(guide.category === "Buying" || guide.category === "Finance") && (
            <div className="rounded-2xl border border-line bg-cream-soft p-5 mb-10">
              <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-3">Compare EV listings</div>
              <div className="flex flex-wrap gap-2.5">
                <a
                  href="https://www.cargurus.com/shop/electric-cars?utm_source=evchargesavings&utm_medium=affiliate&utm_campaign=guide_inline"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-sm font-medium bg-paper border border-line hover:border-forest/40 transition-all text-ink"
                >
                  CarGurus — used EVs →
                </a>
                <a
                  href="https://www.cars.com/shopping/electric-vehicles/?utm_source=evchargesavings&utm_medium=affiliate&utm_campaign=guide_inline"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-sm font-medium bg-paper border border-line hover:border-forest/40 transition-all text-ink"
                >
                  Cars.com — new + used →
                </a>
                <a
                  href="https://www.carvana.com/cars/type/electric?utm_source=evchargesavings&utm_medium=affiliate&utm_campaign=guide_inline"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-sm font-medium bg-forest text-white border border-forest hover:bg-emerald transition-all"
                >
                  Carvana — no haggle →
                </a>
              </div>
            </div>
          )}

          {/* Article body */}
          <div className="space-y-10 mb-14">
            {guide.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-serif text-2xl font-medium tracking-tight text-ink mb-3">{section.heading}</h2>
                <p className="text-ink-2 leading-relaxed mb-4">{section.body}</p>
                {section.list && (
                  <ul className="space-y-2 mb-4">
                    {section.list.map((item) => (
                      <li key={item} className="flex gap-3 text-sm text-ink-3 leading-relaxed">
                        <span className="text-forest font-bold flex-shrink-0 mt-0.5">·</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                {section.callout && (
                  <div className="flex gap-3 bg-forest/5 border border-forest/20 rounded-xl px-4 py-3 mb-4">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-forest font-bold flex-shrink-0 mt-0.5">Tip</span>
                    <p className="text-sm text-ink-2 leading-relaxed">{section.callout}</p>
                  </div>
                )}
                {section.links && section.links.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-line">
                    {section.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        className="inline-flex items-center gap-1 text-sm font-medium text-forest bg-forest/5 border border-forest/20 px-3 py-1.5 rounded-lg hover:bg-forest/10 hover:border-forest/40 transition-all"
                      >
                        {link.label} →
                      </a>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>

          {guide.faqs && guide.faqs.length > 0 && (
            <div className="mt-14 pt-10 border-t border-line">
              <h2 className="font-serif text-2xl font-medium tracking-tight text-ink mb-6">
                Frequently asked questions
              </h2>
              <div className="space-y-6">
                {guide.faqs.map((f) => (
                  <div key={f.question}>
                    <h3 className="font-serif text-lg font-medium text-ink mb-2">{f.question}</h3>
                    <p className="text-ink-2 leading-relaxed text-sm">{f.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Full-width affiliate section */}
        <AffiliateSection category={guide.category} />

        {/* Narrow bottom column */}
        <div className="section-wrap pb-12 max-w-3xl">

          {/* Calculator CTA */}
          <div className="bg-ink text-cream rounded-3xl p-8 mb-8 mt-10">
            <div className="font-mono text-[10px] uppercase tracking-widest text-emerald mb-3">Free calculator</div>
            <h3 className="font-serif text-2xl font-medium mb-2">See your exact numbers</h3>
            <p className="text-cream/60 text-sm leading-relaxed mb-6 max-w-lg">
              Pick your EV, your current gas car, and your state — get a personalised savings estimate with real 2026 rate data.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="/#calculator"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-forest text-white border border-forest hover:bg-emerald hover:border-emerald transition-all"
              >
                Choose my EV →
              </a>
              <a
                href="/#calculator"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-transparent text-cream/80 border border-white/20 hover:border-white/50 transition-all"
              >
                Select my state
              </a>
            </div>
          </div>

          {/* Related guides */}
          {others.length > 0 && (
            <div className="mb-14">
              <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-5">More guides</div>
              <div className="grid sm:grid-cols-3 gap-4">
                {others.map((g) => (
                  <a
                    key={g.slug}
                    href={`/guides/${g.slug}`}
                    className="block bg-paper border border-line rounded-2xl p-5 hover:border-forest/40 hover:shadow-1 transition-all group"
                  >
                    <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-2">{g.category} · {g.readTime}</div>
                    <div className="font-serif text-base font-medium text-ink group-hover:text-forest transition-colors leading-snug">{g.title}</div>
                    <p className="text-xs text-ink-3 leading-relaxed mt-2 line-clamp-2">
                      {g.hook ?? g.description}
                    </p>
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
