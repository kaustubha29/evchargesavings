import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { EV_MODELS } from "@/features/ev-data/data/evs";
import type { EVModel } from "@/features/ev-data/types";
import { DC_KW, chargeTime } from "@/features/ev-data/data/dc-kw";

export const metadata: Metadata = {
  title: "Fastest Charging Electric SUVs 2026 — Peak kW & 10–80% Times",
  description:
    "Ranked list of the fastest-charging electric SUVs and EVs in 2026. Compare peak DC fast-charge rates (kW), estimated 10–80% charge times, connector types, and MSRP for every major EV on sale in the US.",
  alternates: { canonical: "/fastest-charging-evs" },
  openGraph: {
    title: "Fastest Charging Electric SUVs 2026 — Peak kW & 10–80% Times",
    description:
      "Compare DC fast-charge speeds for every major 2026 EV in the US. Ranked by peak kW with estimated 10–80% charge times.",
    url: "/fastest-charging-evs",
  },
};


interface EVRow extends EVModel {
  dcKw: number;
  mins: number;
}

function buildRows(segment?: string): EVRow[] {
  return EV_MODELS
    .filter((ev) => DC_KW[ev.id] !== undefined)
    .filter((ev) => !segment || ev.segment === segment)
    .map((ev) => {
      const dcKw = DC_KW[ev.id];
      return { ...ev, dcKw, mins: chargeTime(ev.battery, dcKw) };
    })
    .sort((a, b) => b.dcKw - a.dcKw || a.mins - b.mins);
}

function kwBadge(kw: number) {
  if (kw >= 350) return "bg-emerald-100 text-emerald-800 border-emerald-200";
  if (kw >= 220) return "bg-green-100 text-green-800 border-green-200";
  if (kw >= 150) return "bg-yellow-100 text-yellow-800 border-yellow-200";
  return "bg-slate-100 text-slate-600 border-slate-200";
}

function ConnectorBadge({ connector }: { connector: string }) {
  const cls =
    connector === "NACS"
      ? "bg-blue-50 text-blue-700 border-blue-200"
      : connector === "CCS"
      ? "bg-orange-50 text-orange-700 border-orange-200"
      : "bg-slate-50 text-slate-600 border-slate-200";
  return (
    <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-mono border ${cls}`}>
      {connector}
    </span>
  );
}

function EVTable({ rows, limit }: { rows: EVRow[]; limit?: number }) {
  const display = limit ? rows.slice(0, limit) : rows;
  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <table className="min-w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-line bg-cream-soft">
            <th className="text-left font-mono text-[10px] uppercase tracking-wider text-ink-mute px-4 py-2.5 whitespace-nowrap">#</th>
            <th className="text-left font-mono text-[10px] uppercase tracking-wider text-ink-mute px-4 py-2.5">Vehicle</th>
            <th className="text-right font-mono text-[10px] uppercase tracking-wider text-ink-mute px-4 py-2.5 whitespace-nowrap">Peak DC</th>
            <th className="text-right font-mono text-[10px] uppercase tracking-wider text-ink-mute px-4 py-2.5 whitespace-nowrap">10–80%</th>
            <th className="text-center font-mono text-[10px] uppercase tracking-wider text-ink-mute px-4 py-2.5">Port</th>
            <th className="text-right font-mono text-[10px] uppercase tracking-wider text-ink-mute px-4 py-2.5 whitespace-nowrap">Range</th>
            <th className="text-right font-mono text-[10px] uppercase tracking-wider text-ink-mute px-4 py-2.5 whitespace-nowrap">MSRP</th>
            <th className="px-4 py-2.5"></th>
          </tr>
        </thead>
        <tbody>
          {display.map((ev, i) => (
            <tr key={ev.id} className="border-b border-line/60 hover:bg-cream-soft/50 transition-colors">
              <td className="px-4 py-3 font-mono text-xs text-ink-mute">{i + 1}</td>
              <td className="px-4 py-3">
                <div className="font-medium text-ink text-sm">{ev.fullName}</div>
                <div className="text-xs text-ink-mute mt-0.5">{ev.modelYear} model year</div>
              </td>
              <td className="px-4 py-3 text-right">
                <span className={`inline-block px-2 py-0.5 rounded-full font-mono text-xs font-medium border ${kwBadge(ev.dcKw)}`}>
                  {ev.dcKw} kW
                </span>
              </td>
              <td className="px-4 py-3 text-right font-mono text-sm text-ink">~{ev.mins} min</td>
              <td className="px-4 py-3 text-center"><ConnectorBadge connector={ev.connector} /></td>
              <td className="px-4 py-3 text-right font-mono text-sm text-ink">{ev.range} mi</td>
              <td className="px-4 py-3 text-right font-mono text-sm text-ink">
                ${(ev.msrp / 1000).toFixed(0)}K
              </td>
              <td className="px-4 py-3 text-right">
                <Link
                  href={`/ev/${ev.slug}`}
                  className="font-mono text-[10px] text-forest hover:underline whitespace-nowrap"
                >
                  Savings →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const faqItems = [
  {
    q: "Which electric SUV charges the fastest in 2026?",
    a: "The Hyundai Ioniq 9, Cadillac Escalade IQ, and Chevrolet Silverado EV all peak at 350 kW — the highest DC fast-charge rate available on a consumer SUV or truck in the US as of 2026. At 350 kW and an 800-volt architecture, the Ioniq 9 can add roughly 100 miles of range in about 5 minutes at a capable charger.",
  },
  {
    q: "What is DC fast charging (DCFC) and how does peak kW affect charge time?",
    a: "DC fast charging delivers power directly to an EV's battery, bypassing the onboard AC charger. Peak kW is the maximum rate the vehicle can accept. A higher peak kW shortens the 10–80% window because more energy flows per minute. However, most vehicles taper down as the battery fills — the peak rate only holds for part of the session.",
  },
  {
    q: "Does my charging network affect how fast I charge?",
    a: "Yes. The network must match or exceed the vehicle's peak rate. Tesla Superchargers V3 deliver up to 250 kW; V4 Superchargers deliver up to 350 kW. Electrify America stations deliver up to 350 kW. ChargePoint and EVgo stations vary by location. An 800V vehicle (Ioniq 5, EV6, Taycan) can accept 350 kW at a V4 Supercharger or Electrify America 350 kW stall.",
  },
  {
    q: "What is the difference between 400V and 800V charging architecture?",
    a: "800-volt vehicles (Hyundai Ioniq 5/6/9, Kia EV6/EV9, Porsche Taycan, Audi Q6/e-tron GT, Genesis GV60) can charge at higher kW rates while keeping current lower, reducing heat. This enables 220–350 kW charging speeds. Most 400V vehicles (Tesla, Rivian, BMW, Ford, GM) peak at 170–250 kW. 400V vehicles can still use 800V stations but may need a booster or accept a reduced rate depending on the charger's design.",
  },
  {
    q: "Why does the Chevy Bolt charge so slowly?",
    a: "The Bolt EV tops out at 55 kW for DC fast charging — a significant limitation compared to newer models. This was an intentional design constraint in the original 2017 platform to reduce battery stress. The 2026 Bolt uses updated electronics but the same 400-volt battery pack limited to 55 kW DC input. A 10–80% session on a Bolt takes roughly 49 minutes.",
  },
  {
    q: "How can I reduce charging costs even with a fast-charging EV?",
    a: "Most daily charging happens at home on Level 2 (11 kW). DC fast charging is 3–5× more expensive per kWh than home rates. Enrolling in a time-of-use (TOU) utility rate and charging overnight typically costs $0.05–$0.12/kWh vs $0.25–$0.50/kWh at a public DCFC station. See our calculator for your state's electricity rates.",
  },
];

export default function FastestChargingEVsPage() {
  const suvRows = buildRows("suv");
  const truckRows = buildRows("truck");
  const allRows = buildRows();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const listJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Fastest Charging Electric SUVs 2026",
    description: "Ranked by peak DC fast-charge rate (kW), US market, 2026 model year",
    numberOfItems: suvRows.length,
    itemListElement: suvRows.slice(0, 10).map((ev, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: ev.fullName,
      description: `Peak DC: ${ev.dcKw} kW · 10–80%: ~${ev.mins} min · ${ev.range} mi range · $${ev.msrp.toLocaleString()} MSRP`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listJsonLd) }}
      />

      <main className="min-h-screen bg-paper">
        {/* Hero */}
        <section className="border-b border-line bg-cream-soft py-12">
          <div className="section-wrap">
            <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-3">
              DC Fast Charging · 2026 US Market
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-medium tracking-tight text-ink mb-4 max-w-3xl">
              Fastest Charging Electric SUVs 2026
            </h1>
            <p className="text-ink-3 text-lg leading-relaxed max-w-2xl mb-6">
              Every major EV ranked by peak DC fast-charge rate. Includes estimated 10–80% charge times, connector type, and MSRP. Data reflects 2026 US model year specs.
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              <a href="#suvs" className="px-4 py-2 rounded-full bg-forest text-white font-medium hover:bg-emerald transition-colors">
                Electric SUVs
              </a>
              <a href="#trucks" className="px-4 py-2 rounded-full bg-cream-soft border border-line text-ink hover:border-forest/40 transition-colors">
                Trucks &amp; Vans
              </a>
              <a href="#all" className="px-4 py-2 rounded-full bg-cream-soft border border-line text-ink hover:border-forest/40 transition-colors">
                All EVs
              </a>
            </div>
          </div>
        </section>

        {/* Key stats */}
        <section className="border-b border-line py-8">
          <div className="section-wrap">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: "Fastest SUV", value: "350 kW", sub: "Ioniq 9 · Escalade IQ" },
                { label: "Fastest charge time", value: "~14 min", sub: "10–80%, Ioniq 9 (110 kWh)" },
                { label: "Slowest SUV", value: "50 kW", sub: "Nissan Leaf · Bolt EV" },
                { label: "Most common rate", value: "150–220 kW", sub: "Mid-range EVs" },
              ].map(({ label, value, sub }) => (
                <div key={label}>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-1">{label}</div>
                  <div className="font-mono text-2xl font-medium text-forest">{value}</div>
                  <div className="text-xs text-ink-mute mt-0.5">{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How to read */}
        <section className="border-b border-line py-8 bg-cream-soft/50">
          <div className="section-wrap">
            <h2 className="font-serif text-xl font-medium text-ink mb-3">How to read this table</h2>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-ink-3">
              <div>
                <span className="font-medium text-ink">Peak DC (kW)</span> — the maximum DC fast-charge rate the vehicle accepts. Color-coded:
                <span className="inline-block ml-1 px-2 py-0.5 rounded-full text-xs font-mono border bg-emerald-100 text-emerald-800 border-emerald-200">350+</span>
                <span className="inline-block ml-1 px-2 py-0.5 rounded-full text-xs font-mono border bg-green-100 text-green-800 border-green-200">220+</span>
                <span className="inline-block ml-1 px-2 py-0.5 rounded-full text-xs font-mono border bg-yellow-100 text-yellow-800 border-yellow-200">150+</span>
              </div>
              <div>
                <span className="font-medium text-ink">10–80% time</span> — estimated minutes assuming the vehicle charges at its peak rate for the full session. Real sessions taper above 80% SoC; actual times may be 10–20% longer.
              </div>
              <div>
                <span className="font-medium text-ink">Port type</span> — NACS (Tesla Supercharger natively) vs CCS (Electrify America, ChargePoint, EVgo). Most NACS vehicles also include a CCS adapter.
              </div>
            </div>
          </div>
        </section>

        {/* SUV Rankings */}
        <section id="suvs" className="border-b border-line py-12">
          <div className="section-wrap">
            <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-2">
              Fastest charging
            </div>
            <h2 className="font-serif text-3xl font-medium text-ink mb-2">
              Electric SUVs — ranked by peak kW
            </h2>
            <p className="text-ink-3 text-sm mb-6">
              {suvRows.length} electric SUVs and crossovers, 2026 US model year. Sorted by peak DC fast-charge rate.
            </p>
            <EVTable rows={suvRows} />
          </div>
        </section>

        {/* Trucks */}
        <section id="trucks" className="border-b border-line py-12 bg-cream-soft/30">
          <div className="section-wrap">
            <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-2">
              Trucks &amp; vans
            </div>
            <h2 className="font-serif text-3xl font-medium text-ink mb-2">
              Electric Trucks — ranked by peak kW
            </h2>
            <p className="text-ink-3 text-sm mb-6">
              {truckRows.length} electric pickup trucks and vans.
            </p>
            <EVTable rows={truckRows} />
          </div>
        </section>

        {/* All EVs */}
        <section id="all" className="border-b border-line py-12">
          <div className="section-wrap">
            <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-2">
              All electric vehicles
            </div>
            <h2 className="font-serif text-3xl font-medium text-ink mb-2">
              Complete ranking — all 2026 EVs
            </h2>
            <p className="text-ink-3 text-sm mb-6">
              {allRows.length} EVs across all segments, sorted by peak DC fast-charge rate.
            </p>
            <EVTable rows={allRows} />
          </div>
        </section>

        {/* What fast charging costs */}
        <section className="border-b border-line py-12 bg-cream-soft/50">
          <div className="section-wrap max-w-3xl">
            <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-2">
              Charging costs
            </div>
            <h2 className="font-serif text-3xl font-medium text-ink mb-4">
              Fast charging is convenient — but expensive
            </h2>
            <p className="text-ink-3 leading-relaxed mb-4">
              DC fast charging at public stations typically costs $0.25–$0.50 per kWh, depending on the network and your state. That works out to roughly $15–30 to add 200 miles on a mid-range EV. By contrast, charging overnight at home on a Level 2 charger costs $0.05–$0.15/kWh in most states — a full charge for $3–8.
            </p>
            <p className="text-ink-3 leading-relaxed mb-6">
              Enrolling in a time-of-use (TOU) electricity rate from your utility can cut home charging costs by 30–70%. Most EV owners only need public DC fast charging on road trips — daily driving runs entirely on overnight home charging.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/"
                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-forest text-white hover:bg-emerald transition-colors"
              >
                Calculate your charging costs →
              </Link>
              <Link
                href="/guides/time-of-use-rates"
                className="px-5 py-2.5 rounded-xl text-sm font-medium border border-line text-ink hover:border-forest/40 transition-colors"
              >
                How TOU rates work →
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-b border-line py-12">
          <div className="section-wrap max-w-3xl">
            <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-2">
              FAQ
            </div>
            <h2 className="font-serif text-3xl font-medium text-ink mb-8">
              EV fast charging — common questions
            </h2>
            <div className="space-y-6">
              {faqItems.map((item) => (
                <div key={item.q} className="border-b border-line/60 pb-6 last:border-0 last:pb-0">
                  <h3 className="font-medium text-ink mb-2">{item.q}</h3>
                  <p className="text-ink-3 text-sm leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="py-12">
          <div className="section-wrap max-w-2xl text-center">
            <h2 className="font-serif text-2xl font-medium text-ink mb-3">
              See how much you&apos;d save owning any of these EVs
            </h2>
            <p className="text-ink-3 text-sm mb-6">
              Enter your ZIP and compare fuel costs, home charging, and break-even timelines for your state&apos;s electricity rates.
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 rounded-xl text-sm font-semibold bg-forest text-white hover:bg-emerald transition-colors"
            >
              Open the EV savings calculator →
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
