import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { GUIDES, getGuideBySlug } from "@/features/guides/data";
import { SavingsSlotBand } from "@/components/shared/SavingsSlotBand";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { StickySavingsBar } from "@/components/shared/StickySavingsBar";
import { HomeChargerProducts } from "@/components/shared/HomeChargerProducts";
import { EVMarketplaceAffiliates } from "@/components/shared/EVMarketplaceAffiliates";
import { EVInsuranceCTA } from "@/components/shared/EVInsuranceCTA";
import { ChargingNetworkReferrals } from "@/components/shared/ChargingNetworkReferrals";

const BASE = "https://evchargesavings.com";

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
    return <HomeChargerProducts />;
  }
  if (category === "Buying" || category === "Finance" || category === "Education") {
    return <EVMarketplaceAffiliates />;
  }
  if (category === "Ownership") {
    return <EVInsuranceCTA />;
  }
  if (category === "Driving") {
    return <ChargingNetworkReferrals />;
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
    publisher: {
      "@type": "Organization",
      name: "EV Charge Savings",
      url: BASE,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-medium tracking-tight text-ink mb-3" style={{ lineHeight: 1.1 }}>
              {guide.title}
            </h1>
            <p className="text-ink-2 text-base leading-relaxed max-w-3xl">{guide.description}</p>
          </div>

          <div className="-mx-0 mb-12">
            <SavingsSlotBand
              eyebrow={`${guide.category} guide`}
              title="Put the advice next to real savings examples"
              body="The guide gives you the decision framework. The rolling examples show how much the numbers can move once model and location enter the picture."
              className="rounded-3xl overflow-hidden border"
            />
          </div>

          {/* Article body */}
          <div className="space-y-10 mb-14">
            {guide.sections.map((section) => (
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
              </section>
            ))}
          </div>

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
