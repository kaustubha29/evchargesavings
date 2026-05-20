export function SiteFooter() {
  return (
    <footer className="bg-ink text-cream pt-14 pb-8">
      <div className="section-wrap">
        <div className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-10 mb-10">
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
                { href: "/#calculator",                    label: "Compare vehicles" },
                { href: "/#public-charging",               label: "Charging networks" },
                { href: "/#charger-gear",                  label: "Level 2 chargers" },
                { href: "/ev-insurance",                   label: "EV insurance" },
                { href: "/guides/home-charging-setup",     label: "Home charging guide" },
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
              {[
                { href: "/guides/ev-charging-for-apartment-renters-2026", label: "Apartment charging" },
                { href: "/guides/ev-utility-rate-plans-guide",            label: "Utility rate plans" },
                { href: "/guides/best-used-evs-to-buy-2026",              label: "Best used EVs" },
                { href: "/guides/is-ev-right-for-you",                    label: "Is EV right for you?" },
                { href: "/guides",                                         label: "All guides →" },
              ].map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-sm text-cream/70 hover:text-gold transition-colors">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div>
            <div className="font-mono text-[11px] uppercase tracking-widest text-gold mb-4">Explore</div>
            <ul className="space-y-2">
              {[
                { href: "/ev-cost/california", label: "Savings by state" },
                { href: "/ev-owner", label: "EV owner guide" },
                { href: "/ev-insurance", label: "EV insurance costs" },
                { href: "/guides", label: "All guides" },
                { href: "/research", label: "Research & data" },
              ].map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-sm text-cream/70 hover:text-gold transition-colors">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Head-to-head */}
          <div>
            <div className="font-mono text-[11px] uppercase tracking-widest text-gold mb-4">Head-to-head</div>
            <ul className="space-y-2">
              {[
                { href: "/compare/tesla-model-y-long-range-awd-vs-toyota-rav4",      label: "Model Y vs RAV4" },
                { href: "/compare/tesla-model-3-rwd-vs-toyota-camry",              label: "Model 3 vs Camry" },
                { href: "/compare/tesla-model-3-rwd-vs-honda-civic",               label: "Model 3 vs Civic" },
                { href: "/compare/hyundai-ioniq-6-long-range-rwd-vs-toyota-camry", label: "Ioniq 6 vs Camry" },
                { href: "/compare/hyundai-ioniq-5-long-range-rwd-vs-honda-cr-v",   label: "Ioniq 5 vs CR-V" },
              ].map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-sm text-cream/70 hover:text-gold transition-colors">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Site */}
          <div>
            <div className="font-mono text-[11px] uppercase tracking-widest text-gold mb-4">Site</div>
            <ul className="space-y-2">
              {[
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" },
                { href: "/privacy", label: "Privacy" },
                { href: "/terms", label: "Terms" },
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
            This site contains affiliate links to charger manufacturers and EV marketplaces. If you click and buy, we may earn a commission at no extra cost to you. Our calculator results are never altered to favor sponsors. Rate data: EIA (electricity monthly, gas weekly) · EPA Fuel Economy Guide (vehicle efficiency) · DOE Alternative Fuels Data Center (state EV/PHEV registration fees) · NCSL. Calculations are estimates — your actual savings will vary.
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
