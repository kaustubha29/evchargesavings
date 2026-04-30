import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { GUIDES, getGuideBySlug } from "@/features/guides/data";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { StickySavingsBar } from "@/components/shared/StickySavingsBar";

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
  };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const others = GUIDES.filter((g) => g.slug !== slug).slice(0, 3);

  return (
    <>
      <StickySavingsBar />
      <main className="bg-paper min-h-screen">
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
            <h1 className="font-serif text-4xl md:text-5xl font-medium tracking-tight text-ink mb-4" style={{ lineHeight: 1.1 }}>
              {guide.title}
            </h1>
            <p className="text-ink-3 text-lg leading-relaxed max-w-2xl">{guide.description}</p>
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

          {/* Calculator CTA */}
          <div className="bg-ink text-cream rounded-3xl p-8 mb-8">
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
                    <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-2">{g.readTime}</div>
                    <div className="font-serif text-sm font-medium text-ink group-hover:text-forest transition-colors leading-snug">{g.title}</div>
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
