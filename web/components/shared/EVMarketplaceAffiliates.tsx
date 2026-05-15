"use client";

import { useMemo } from "react";
import { useCalculatorStore } from "@/store/calculator";
import { evRepository, gasRepository } from "@/features/ev-data/repository";
import { getStateData } from "@/features/location/queries";

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
      name: "CarGurus",
      label: "Used EV",
      tag: "Best price transparency",
      desc: `Pick this if you want to know whether you're overpaying. CarGurus shows how long a car's been listed, price drops, and deal ratings — used EVs under $25k may also qualify for the federal used EV credit (up to $4,000).`,
      perks: ["Price drop history", "Deal rating per listing", "Used EV credit eligible"],
      cta: "Find used",
      url: buildAffiliateUrl(
        "https://www.cargurus.com/shop/electric-cars",
        "cargurus_ev",
        ev.brand,
        stateTag
      ),
    },
    {
      name: "Cars.com",
      label: "Trade-in + shop",
      tag: "Best if you're trading",
      desc: `Pick this if you're selling your current car. Get a cash offer on your trade-in and browse new and used inventory side by side — the offer is real, not an estimate.`,
      perks: ["Cash offer on trade-in", "New + used inventory", "No obligation to buy"],
      cta: "Get trade-in quote",
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
      tag: "Best for no-haggle",
      desc: `Pick this if you hate dealerships. One fixed price, no negotiation, home delivery to most states, and a 7-day return window if it's not right. Financing is built in.`,
      perks: ["Fixed price, no negotiation", "7-day return window", "Home delivery + built-in financing"],
      cta: "Shop Carvana",
      url: buildAffiliateUrl(
        "https://www.carvana.com/cars/type/electric",
        "carvana_ev",
        ev.brand,
        stateTag
      ),
    },
    {
      name: `${ev.brand} Dealers`,
      label: "Buy New",
      tag: "Official dealership",
      desc: `Pick this if you want brand-new with a full warranty. Any available federal EV incentives on new vehicles can only be claimed through an authorized dealer — check IRS.gov for current eligibility before buying.`,
      perks: ["Check IRS.gov for current incentives", "Full manufacturer warranty", "Order or pick from inventory"],
      cta: "Find dealers",
      url: dealerUrl,
      accent: true,
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
            New, used, or trade-in — pick the path that fits your situation.
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

        <p className="font-mono text-[10px] text-ink-mute/60 mt-6">
          We may earn a commission on qualifying sales — at no extra cost to you.
          Calculator results are never influenced by partnerships.
        </p>

      </div>
    </section>
  );
}