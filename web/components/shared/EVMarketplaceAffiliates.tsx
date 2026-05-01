"use client";

import { useMemo } from "react";
import { useCalculatorStore } from "@/store/calculator";
import { evRepository, gasRepository } from "@/features/ev-data/repository";
import { getStateData } from "@/features/location/queries";
import { LeadCaptureBox } from "@/components/shared/LeadCaptureBox";

function buildAffiliateUrl(baseUrl: string, campaign: string, term: string, state?: string) {
  const url = new URL(baseUrl);
  url.searchParams.set("utm_source", "evchargesavings");
  url.searchParams.set("utm_medium", "affiliate");
  url.searchParams.set("utm_campaign", campaign);
  url.searchParams.set("utm_term", term);
  if (state) url.searchParams.set("utm_content", state);
  return url.toString();
}

export function EVMarketplaceAffiliates() {
  const store = useCalculatorStore();
  const { evSlug, gasId, stateCode } = store;

  const ev = useMemo(() => evRepository.getBySlug(evSlug), [evSlug]);
  const gas = useMemo(() => gasRepository.getById(gasId), [gasId]);
  const stateData = useMemo(() => (stateCode ? getStateData(stateCode) : null), [stateCode]);

  if (!ev || !gas) return null;

  const sourcePage = stateCode ? `/ev-cost/${stateCode}?ev=${evSlug}` : "/";
  const stateTag = stateData ? stateData.slug || stateData.name : undefined;

  const brandDealerUrls: Record<string, string> = {
    Tesla: "https://www.tesla.com/findus",
    Ford: "https://www.ford.com/locator/",
    GM: "https://www.gm.com/find-a-dealership",
    Hyundai: "https://www.hyundaiusa.com/dealer-locator",
    Kia: "https://www.kia.com/us/en/dealers",
    Volkswagen: "https://www.volkswagenvehicles.com/find-a-dealer",
    BMW: "https://www.bmwusa.com/dealer-locator",
    Mercedes: "https://www.mercedesbenzusa.com/find-a-dealer",
    Rivian: "https://www.rivian.com/locations",
    Lucid: "https://www.lucidmotors.com/experience",
  };

  const dealerUrl = buildAffiliateUrl(
    brandDealerUrls[ev.brand] || "https://www.google.com/maps/search/ev+dealer",
    "dealer_locator",
    ev.brand,
    stateTag
  );

  const marketplaces = [
    {
      name: `${ev.brand} Dealers`,
      label: "Buy New",
      tag: "Official dealership",
      desc: `Find authorized ${ev.brand} dealers${stateData ? ` in ${stateData.name}` : ""} to explore the ${ev.name}.`,
      perks: ["Browse lineup", "Test drives", "Federal incentives"],
      cta: "Find dealers",
      url: dealerUrl,
      accent: true,
    },
    {
      name: "CarGurus",
      label: "Used EV",
      tag: "Marketplace",
      desc: `Browse used ${ev.brand} models with price comparison tools.`,
      perks: ["Real pricing", "Certified options", "Owner reviews"],
      cta: "Find used",
      url: buildAffiliateUrl(
        "https://www.cargurus.com/Cars/inventorylisting/used-electric/",
        "cargurus_ev",
        ev.brand,
        stateTag
      ),
    },
    {
      name: "Cars.com",
      label: "Trade-in",
      tag: "Classifieds",
      desc: `Get a trade-in estimate for your current vehicle.`,
      perks: ["Instant quote", "Market value", "Fast approval"],
      cta: "Get quote",
      url: buildAffiliateUrl(
        "https://www.cars.com/shopping/electric-vehicles/",
        "carsdotcom_ev",
        ev.brand,
        stateTag
      ),
    },
    {
      name: "Carvana",
      label: "Used online",
      tag: "Nationwide",
      desc: `Shop EVs online with delivery and return options.`,
      perks: ["7-day returns", "Home delivery", "Warranty"],
      cta: "Shop Carvana",
      url: buildAffiliateUrl(
        "https://www.carvana.com/cars/type/electric",
        "carvana_ev",
        ev.brand,
        stateTag
      ),
    },
  ];

  return (
    <section className="bg-cream-soft border-b border-line py-14">
      <div className="section-wrap">

        {/* Header */}
        <div className="mb-8">
          <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-3">
            Buy your {ev.brand}
          </div>

          <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight mb-3">
            Find your {ev.name}
          </h2>

          <p className="text-ink-3 max-w-xl leading-relaxed">
            Compare new and used options{stateData ? ` in ${stateData.name}` : ""} and estimate trade-in value.
          </p>
        </div>

        {/* Marketplace cards */}
        <div className="grid sm:grid-cols-2 gap-6">
          {marketplaces.map((m) => (
            <div
              key={m.name}
              className={`rounded-2xl border p-7 ${
                m.accent ? "border-forest/30 bg-forest/5" : "border-line bg-paper"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-1">
                    {m.label}
                  </div>
                  <div className="font-serif text-xl font-medium text-ink">{m.name}</div>
                </div>

                <span className="font-mono text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full bg-ink/5 text-ink-mute">
                  {m.tag}
                </span>
              </div>

              <p className="text-sm text-ink-mute leading-relaxed mt-3 mb-4">
                {m.desc}
              </p>

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

        {/* ✅ FIX: removed extra boxed wrapper */}
        <div className="mt-12">
          <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-4">
            Need help with quotes?
          </div>

          <LeadCaptureBox sourcePage={sourcePage} />
        </div>

        <p className="font-mono text-[10px] text-ink-mute/60 mt-6">
          We may earn a commission on qualifying sales — at no extra cost to you.
          Calculator results are never influenced by partnerships.
        </p>

      </div>
    </section>
  );
}