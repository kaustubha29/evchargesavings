const CHARGING_CARDS = [
  {
    level: "Level 1 · 120 V outlet",
    speed: "4–5 miles / hr",
    desc: "Plug directly into any standard household outlet. Zero installation cost — just run the cord.",
    note: "Best for: low-mileage commuters, condos, backup charging",
    cost: "Setup cost: $0",
    howto: "Use the included EVSE cable in any standard outlet.",
  },
  {
    level: "Level 2 · 240 V / EVSE",
    speed: "20–35 miles / hr",
    desc: "Dedicated 240V circuit. Fully charges overnight for most EVs.",
    note: "Top picks: Grizzl-E, JuiceBox, Emporia, Tesla Wall Connector",
    cost: "Setup cost: $500–$1,500 installed",
    howto: "Licensed electrician installs 40–60A circuit.",
    best: true,
  },
  {
    level: "DC Fast · Public only",
    speed: "150–350 miles / hr",
    desc: "Ultra-fast charging for road trips. Not installable at home.",
    note: "Networks: Tesla Supercharger, EVgo, Electrify America",
    cost: "Not available for home installation",
    howto: "Use navigation apps like PlugShare or built-in EV routing.",
  },
];

export function HomeChargingSection() {
  return (
    <section className="bg-ink text-cream py-16" id="home-charging">
      <div className="section-wrap">
        <div className="text-center mb-10">
          <div className="font-mono text-[11px] uppercase tracking-widest text-emerald mb-3">Home charging guide</div>
          <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight mb-3">
            How to charge <em>at home</em>
          </h2>
          <p className="text-cream/60 max-w-lg mx-auto">90% of EV charging happens overnight at home.</p>
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
              <div className="font-mono text-[10px] uppercase tracking-widest text-cream/40 mb-2">{c.level}</div>
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
