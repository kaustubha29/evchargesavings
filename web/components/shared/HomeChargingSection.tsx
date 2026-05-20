const CHARGING_CARDS = [
  {
    level: "Level 1 · 120 V outlet",
    speed: "4–5 miles / hr",
    desc: "Plug into any standard household outlet. Zero install cost — use the included cable.",
    note: "Best for: low-mileage commuters, condos, backup charging",
    cost: "Setup cost: $0",
    howto: "Use the included EVSE cable in any standard outlet.",
  },
  {
    level: "Level 2 · 240 V / EVSE",
    speed: "20–35 miles / hr",
    desc: "Dedicated 240V circuit. Fully charges most EVs overnight, every night.",
    note: "Top picks: ChargePoint HomeFlex, Grizzl-E, Autel MaxiCharger, Tesla Wall Connector",
    cost: "Setup cost: $500–$1,500 installed",
    howto: "Licensed electrician installs a dedicated 40–60A circuit.",
    best: true,
  },
  {
    level: "DC Fast · Public only",
    speed: "150–350 miles / hr",
    desc: "Ultra-fast charging at public stations. For road trips — not installable at home.",
    note: "Networks: Tesla Supercharger, EVgo, Electrify America",
    cost: "Setup cost: N/A — public use only",
    howto: "Find stations via PlugShare or your car's built-in routing.",
  },
];

export function HomeChargingSection() {
  return (
    <section className="bg-ink text-cream py-16" id="home-charging">
      <div className="section-wrap">
        <div className="text-center mb-10">
          <div className="font-mono text-[11px] uppercase tracking-widest text-emerald mb-3">Charging levels</div>
          <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight mb-3">
            Know your charging options
          </h2>
          <p className="text-cream/60 max-w-lg mx-auto">Speed, cost, and where to use each — from wall outlet to road trip.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {CHARGING_CARDS.map((c) => (
            <div
              key={c.level}
              className={`rounded-2xl p-7 border relative ${
                c.best ? "border-emerald/40 bg-emerald/10" : "border-white/10 bg-white/5"
              }`}
            >
              {c.best && (
                <span className="absolute top-4 right-4 bg-emerald text-white font-mono text-[10px] px-2 py-1 rounded-full">
                  Recommended
                </span>
              )}
              {(() => {
                const [label, sub] = c.level.split(" · ");
                return (
                  <div className="mb-3">
                    <div className={`font-serif text-xl font-semibold mb-0.5 ${c.best ? "text-emerald" : "text-cream"}`}>{label}</div>
                    {sub && <div className="font-mono text-[10px] uppercase tracking-widest text-cream/40">{sub}</div>}
                  </div>
                );
              })()}
              <div className="font-serif text-2xl font-medium text-cream mb-2">{c.speed}</div>
              <p className="text-sm text-cream/60 mb-3">{c.desc}</p>
              <p className="text-xs text-cream/40 mb-1">{c.note}</p>
              <p className="text-xs text-cream/40 italic mb-3">{c.howto}</p>
              <p className="font-mono text-xs text-emerald">{c.cost}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
