const MARKETPLACES = [
  {
    name: "CarGurus",
    label: "Marketplace",
    tag: "Used & certified",
    desc: "Search used EVs with real pricing, mileage history, and owner reviews. Compare prices across dealers instantly.",
    perks: ["Browse 500k+ listings", "Real dealer pricing", "Certified pre-owned filter"],
    cta: "Browse EVs",
    url: "https://www.cargurus.com/Cars/inventorylisting/used-electric/",
    accent: true,
  },
  {
    name: "Cars.com",
    label: "Classifieds",
    tag: "New & used",
    desc: "Largest auto marketplace. Filter by EV type, price range, and dealer ratings. Get pre-approved financing offers.",
    perks: ["400k+ EV listings", "Dealer ratings", "Pre-approval in 60 seconds"],
    cta: "View inventory",
    url: "https://www.cars.com/vehicles/search/?stock_type=used&body_type=electric%20vehicle",
  },
  {
    name: "Carvana",
    label: "Online-only",
    tag: "Nationwide delivery",
    desc: "Buy used EVs entirely online with 7-day test drive guarantee. Free delivery to your home or pickup at a hub.",
    perks: ["7-day test drive", "Free delivery", "As-is warranty"],
    cta: "Shop Carvana",
    url: "https://www.carvana.com/cars/type/electric",
  },
];

export function UsedEVMarketplaceAffiliates() {
  return (
    <section className="bg-cream-soft border-b border-line py-14">
      <div className="section-wrap">

        {/* Header */}
        <div className="mb-8">
          <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-3">Used EV marketplace</div>
          <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight mb-3">
            Find your used EV
          </h2>
          <p className="text-ink-3 max-w-xl leading-relaxed">
            Compare prices and availability across the largest used EV marketplaces. Many certified pre-owned vehicles come with manufacturer warranties.
          </p>
        </div>

        {/* Marketplace cards */}
        <div className="grid sm:grid-cols-3 gap-6">
          {MARKETPLACES.map((m) => (
            <div
              key={m.name}
              className={`rounded-2xl border p-7 ${m.accent ? "border-forest/30 bg-forest/5" : "border-line bg-paper"}`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-1">{m.label}</div>
                  <div className="font-serif text-xl font-medium text-ink">{m.name}</div>
                </div>
                <span className={`font-mono text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full whitespace-nowrap ${
                  m.accent ? "bg-forest/10 text-forest" : "bg-ink/5 text-ink-mute"
                }`}>{m.tag}</span>
              </div>

              <p className="text-sm text-ink-mute leading-relaxed mt-3 mb-4">{m.desc}</p>

              {/* Perks */}
              <ul className="space-y-1 mb-6">
                {m.perks.map((perk) => (
                  <li key={perk} className="flex items-center gap-2 text-xs text-ink-mute">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald flex-shrink-0" />
                    {perk}
                  </li>
                ))}
              </ul>

              <a
                href={m.url}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className={`inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest px-4 py-2.5 rounded-xl transition-colors ${
                  m.accent
                    ? "bg-forest text-cream hover:bg-forest/90"
                    : "bg-ink text-cream hover:bg-ink/80"
                }`}
              >
                {m.cta} →
              </a>
            </div>
          ))}
        </div>

        <p className="mt-8 font-mono text-[10px] text-ink-mute/60">
          We may earn a commission on qualifying sales — at no extra cost to you. Calculator results are never altered based on marketplace partnerships.
        </p>

      </div>
    </section>
  );
}
