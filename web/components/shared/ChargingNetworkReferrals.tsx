const NETWORKS = [
  {
    name: "ChargePoint Home Flex",
    label: "ChargePoint",
    tag: "Referral program",
    desc: "America's largest charging network. Buy a ChargePoint Home Flex and get access to 70,000+ public stations with the same app.",
    perks: ["Adjustable 16–50 A", "Works with any EV", "70k+ public stations"],
    cta: "Shop + refer a friend",
    // Replace with your ChargePoint affiliate/referral link
    url: "https://www.chargepoint.com/drivers/home/",
    accent: true,
  },
  {
    name: "JuiceBox by Enel X",
    label: "Enel X Way",
    tag: "Partner program",
    desc: "Smart home charger with built-in energy monitoring, TOU scheduling, and utility rebate eligibility in most states.",
    perks: ["Up to 48 A / 11.5 kW", "TOU auto-scheduling", "Utility rebates"],
    cta: "View chargers",
    // Replace with your Enel X / JuiceBox affiliate link
    url: "https://www.enelxway.com/us/en/residential/ev-chargers/juicebox/",
  },
];

export function ChargingNetworkReferrals() {
  return (
    <section className="bg-paper border-b border-line py-14" id="charging-networks">
      <div className="section-wrap">

        {/* Header */}
        <div className="mb-8">
          <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-3">Charging networks</div>
          <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight mb-3">
            Hardware with a network behind it
          </h2>
          <p className="text-ink-3 max-w-xl leading-relaxed">
            These chargers come with access to a nationwide public network — one app for home and on the road.
          </p>
        </div>

        {/* Network cards */}
        <div className="grid sm:grid-cols-2 gap-6">
          {NETWORKS.map((n) => (
            <div
              key={n.name}
              className={`rounded-2xl border p-7 ${n.accent ? "border-forest/30 bg-forest/5" : "border-line bg-cream-soft"}`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-1">{n.label}</div>
                  <div className="font-serif text-xl font-medium text-ink">{n.name}</div>
                </div>
                <span className={`font-mono text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full whitespace-nowrap ${
                  n.accent ? "bg-forest/10 text-forest" : "bg-ink/5 text-ink-mute"
                }`}>{n.tag}</span>
              </div>

              <p className="text-sm text-ink-mute leading-relaxed mt-3 mb-4">{n.desc}</p>

              {/* Perks */}
              <ul className="space-y-1 mb-6">
                {n.perks.map((perk) => (
                  <li key={perk} className="flex items-center gap-2 text-xs text-ink-mute">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald flex-shrink-0" />
                    {perk}
                  </li>
                ))}
              </ul>

              <a
                href={n.url}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className={`inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest px-4 py-2.5 rounded-xl transition-colors ${
                  n.accent
                    ? "bg-forest text-cream hover:bg-forest/90"
                    : "bg-ink text-cream hover:bg-ink/80"
                }`}
              >
                {n.cta} →
              </a>
            </div>
          ))}
        </div>

        <p className="mt-8 font-mono text-[10px] text-ink-mute/60">
          We may earn a commission on qualifying purchases — at no extra cost to you.
        </p>

      </div>
    </section>
  );
}
