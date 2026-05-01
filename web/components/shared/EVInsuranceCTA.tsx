const PROVIDERS = [
  {
    name: "The Zebra",
    tag: "Most quotes",
    desc: "Compares 100+ carriers instantly. No spam calls — see real rates in 2 min.",
    // Replace with your affiliate link from The Zebra's program (via Impact or CJ)
    url: "https://www.thezebra.com/auto-insurance/electric-vehicles/",
    accent: true,
  },
  {
    name: "Insurify",
    tag: "AI-powered",
    desc: "Side-by-side quotes from top carriers, with EV-specific discounts surfaced automatically.",
    // Replace with your affiliate link from Insurify's program
    url: "https://insurify.com/car-insurance/electric-vehicle/",
  },
  {
    name: "Jerry",
    tag: "Lowest hassle",
    desc: "Shops 55+ insurers in the background. Cancel your old policy — Jerry handles it.",
    // Replace with your affiliate link from Jerry's program
    url: "https://getjerry.com/",
  },
];

export function EVInsuranceCTA() {
  return (
    <section className="bg-ink text-cream border-b border-white/10 py-14" id="ev-insurance">
      <div className="section-wrap">

        {/* Header */}
        <div className="mb-8">
          <div className="font-mono text-[11px] uppercase tracking-widest text-emerald mb-3">Save more</div>
          <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight mb-3">
            Compare EV insurance rates
          </h2>
          <p className="text-cream/60 max-w-xl leading-relaxed">
            EV owners often overpay on insurance. Switching carriers saves an average of <b className="text-cream">$800/year</b> — on top of the fuel savings.
          </p>
        </div>

        {/* Provider cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          {PROVIDERS.map((p) => (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className={`group block rounded-2xl border p-6 transition-all hover:scale-[1.02] ${
                p.accent
                  ? "border-emerald/40 bg-emerald/10 hover:bg-emerald/15"
                  : "border-white/10 bg-white/5 hover:bg-white/8"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="font-serif text-lg font-medium text-cream">{p.name}</span>
                <span className={`font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full whitespace-nowrap ${
                  p.accent ? "bg-emerald/20 text-emerald" : "bg-white/10 text-cream/50"
                }`}>{p.tag}</span>
              </div>
              <p className="text-sm text-cream/60 leading-relaxed mb-4">{p.desc}</p>
              <div className={`font-mono text-[11px] uppercase tracking-widest group-hover:underline ${
                p.accent ? "text-emerald" : "text-cream/40 group-hover:text-cream/70"
              }`}>
                Compare rates →
              </div>
            </a>
          ))}
        </div>

        <p className="font-mono text-[10px] text-cream/25">
          We may earn a commission when you get a quote — at no cost to you. Rates vary by state and driving history.
        </p>

      </div>
    </section>
  );
}
