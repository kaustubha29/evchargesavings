import { GUIDES } from "@/features/guides/data";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-cream pt-14 pb-8">
      <div className="section-wrap">
        <div className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr] gap-10 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="font-serif text-3xl font-medium mb-3">
              EV Charge <em className="italic text-gold">Savings</em>
            </div>
            <p className="text-sm text-cream/50 max-w-xs leading-relaxed">
              Independent EV cost analysis. We make money when readers click affiliate links — never from utilities, automakers, or charging networks.
            </p>
          </div>

          {/* Calculator */}
          <div>
            <div className="font-mono text-[11px] uppercase tracking-widest text-gold mb-4">Calculator</div>
            <ul className="space-y-2">
              {[
                { href: "/#calculator", label: "Compare vehicles" },
                { href: "/#calculator", label: "Driving habits" },
                { href: "/#public-charging", label: "Charging networks" },
              ].map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-sm text-cream/70 hover:text-gold transition-colors">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Guides */}
          <div>
            <div className="font-mono text-[11px] uppercase tracking-widest text-gold mb-4">Guides</div>
            <ul className="space-y-2">
              {GUIDES.slice(0, 4).map((g) => (
                <li key={g.slug}>
                  <a href={`/guides/${g.slug}`} className="text-sm text-cream/70 hover:text-gold transition-colors">{g.title}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Site */}
          <div>
            <div className="font-mono text-[11px] uppercase tracking-widest text-gold mb-4">Site</div>
            <ul className="space-y-2">
              {[
                { href: "/ev-cost/california", label: "Savings by state" },
                { href: "/ev-insurance", label: "EV insurance costs" },
                { href: "/guides", label: "All guides" },
                { href: "/privacy", label: "Privacy" },
                { href: "/terms", label: "Terms" },
                { href: "mailto:hello@evchargesavings.com", label: "Contact" },
              ].map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-sm text-cream/70 hover:text-gold transition-colors">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/8 pt-6 mb-4">
          <p className="text-xs text-cream/40 leading-relaxed max-w-4xl">
            <b className="text-gold/70 font-medium">Affiliate disclosure.</b>{" "}
            This site contains affiliate links to charger manufacturers and EV marketplaces. If you click and buy, we may earn a commission at no extra cost to you. Our calculator results are never altered to favor sponsors. Rate data is sourced from the U.S. Energy Information Administration (EIA) and AAA, refreshed monthly. Calculations are estimates — your actual savings will vary.
          </p>
        </div>

        <div className="flex flex-wrap justify-between gap-4 font-mono text-[10px] uppercase tracking-widest text-cream/25">
          <span>© 2026 EV Charge Savings</span>
          <span>Not legal or financial advice</span>
          <span>evchargesavings.com</span>
        </div>
      </div>
    </footer>
  );
}
