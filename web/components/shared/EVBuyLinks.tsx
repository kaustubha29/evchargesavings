interface Props {
  brand: string;
  name: string;
  slug: string;
}

const BRAND_DEALER: Record<string, string> = {
  Tesla:          "https://www.tesla.com/findus",
  Ford:           "https://www.ford.com/locator/",
  Chevrolet:      "https://www.chevrolet.com/dealer-locator",
  Hyundai:        "https://www.hyundaiusa.com/dealer-locator",
  Kia:            "https://www.kia.com/us/en/dealers",
  Volkswagen:     "https://www.vw.com/en/models.html",
  BMW:            "https://www.bmwusa.com/dealer-locator",
  "Mercedes-Benz":"https://www.mbusa.com/en/vehicles",
  Rivian:         "https://rivian.com/locations",
  Lucid:          "https://lucidmotors.com/experience",
  Audi:           "https://www.audiusa.com/us/web/en/dealer-locator.html",
  Porsche:        "https://finder.porsche.com/us/en-US/",
  Cadillac:       "https://www.cadillac.com/dealer-locator",
  Polestar:       "https://www.polestar.com/us/stores/",
  Volvo:          "https://www.volvocars.com/us/find-a-dealer",
  Genesis:        "https://www.genesis.com/us/en/dealer-locator.html",
  Nissan:         "https://www.nissanusa.com/dealer-locator.html",
  Honda:          "https://www.honda.com/dealer-locator",
  Toyota:         "https://www.toyota.com/configurator/api/pub/v2/lexicon/models",
  Subaru:         "https://www.subaru.com/find-a-dealer/index.html",
  Dodge:          "https://www.dodge.com/dealer-locator",
  Ram:            "https://www.ramtrucks.com/dealer-locator",
  Jeep:           "https://www.jeep.com/dealer-locator",
  Mini:           "https://www.miniusa.com/find-a-dealer.html",
};

function utm(base: string, campaign: string, term: string) {
  const url = new URL(base);
  url.searchParams.set("utm_source", "evchargesavings");
  url.searchParams.set("utm_medium", "affiliate");
  url.searchParams.set("utm_campaign", campaign);
  url.searchParams.set("utm_term", term);
  return url.toString();
}

export function EVBuyLinks({ brand, name, slug }: Props) {
  const dealerBase = BRAND_DEALER[brand] ?? `https://www.google.com/search?q=buy+${encodeURIComponent(brand)}+EV+dealer+near+me`;

  const options = [
    {
      site: "CarGurus",
      label: "Used EV",
      tag: "Best price transparency",
      desc: "Price drop history, deal ratings, and real pricing data across thousands of used EV listings. See how long a car has been listed and whether the price is fair.",
      perks: ["Instant deal rating per listing", "Price history & drop alerts", "Used EV tax credit eligible"],
      cta: "Find used",
      url: utm("https://www.cargurus.com/shop/electric-cars", "cargurus_ev", slug),
      accent: false,
    },
    {
      site: "Cars.com",
      label: "Trade-in + shop",
      tag: "Best if you're trading in",
      desc: "Get a real cash offer on your current car and browse new & used EV inventory side by side. No obligation to buy — the trade-in offer is a firm quote, not an estimate.",
      perks: ["Firm cash offer on trade-in", "New and used inventory", "Filter by zip & price"],
      cta: "Get trade-in offer",
      url: utm("https://www.cars.com/shopping/electric-vehicles/", "carsdotcom_ev", slug),
      accent: false,
    },
    {
      site: "Carvana",
      label: "Used online",
      tag: "No-haggle online buying",
      desc: "Fixed price, no negotiation, home delivery to most states, 7-day return window. Financing is built in. Good option if you want to skip the dealership entirely.",
      perks: ["Fixed price — no negotiation", "7-day return window", "Home delivery + built-in financing"],
      cta: "Shop Carvana",
      url: utm("https://www.carvana.com/cars/type/electric", "carvana_ev", slug),
      accent: false,
    },
    {
      site: `${brand} Dealers`,
      label: "Buy New",
      tag: "Official dealership",
      desc: `New with full manufacturer warranty. Order directly from the factory or choose from dealer lot inventory. Check for state & local incentives — many states offer rebates even after federal credits expired.`,
      perks: [
        "Full manufacturer warranty",
        "Order from factory or pick from lot",
        "State & local incentives may apply",
      ],
      cta: "Find dealers",
      url: utm(dealerBase, "dealer_locator", slug),
      accent: true,
    },
  ];

  return (
    <section className="bg-cream-soft border-t border-line py-12">
      <div className="section-wrap">
        <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-3">Buy your {brand}</div>
        <h2 className="font-serif text-2xl font-medium text-ink mb-1.5">Find your {name}</h2>
        <p className="text-sm text-ink-3 mb-8 max-w-lg">New, used, or trade-in — pick the path that fits your situation.</p>

        <div className="grid sm:grid-cols-2 gap-4">
          {options.map((o) => (
            <div
              key={o.site}
              className={`rounded-2xl border p-6 flex flex-col ${o.accent ? "border-forest/30 bg-forest/5" : "border-line bg-paper"}`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <div>
                  <div className="font-mono text-[9px] uppercase tracking-widest text-ink-mute mb-1">{o.label}</div>
                  <div className="font-serif text-lg font-medium text-ink">{o.site}</div>
                </div>
                <span className="font-mono text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full bg-ink/5 text-ink-mute whitespace-nowrap">
                  {o.tag}
                </span>
              </div>
              <p className="text-sm text-ink-mute leading-relaxed mt-3 mb-4 flex-1">{o.desc}</p>
              <ul className="space-y-1.5 mb-5">
                {o.perks.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-xs text-ink-mute">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald flex-shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
              <a
                href={o.url}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className={`inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest px-4 py-2.5 rounded-xl transition-colors self-start ${
                  o.accent ? "bg-forest text-cream hover:bg-forest/90" : "bg-ink text-cream hover:bg-ink/80"
                }`}
              >
                {o.cta} →
              </a>
            </div>
          ))}
        </div>

        <p className="font-mono text-[10px] text-ink-mute/60 mt-6">
          We may earn a commission on qualifying purchases — at no extra cost to you. Calculator results are never influenced by partnerships.
        </p>
      </div>
    </section>
  );
}
