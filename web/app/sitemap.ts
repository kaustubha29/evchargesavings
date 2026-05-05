import type { MetadataRoute } from "next";
import { getAllStates } from "@/features/location/queries";
import { evRepository, gasRepository } from "@/features/ev-data/repository";
import { GUIDES } from "@/features/guides/data";

const BASE = "https://www.evchargesavings.com";
const NOW = new Date().toISOString();

const REAL_GAS_IDS = [
  "toyota-rav4", "toyota-camry",
  "honda-cr-v", "honda-civic", "honda-accord",
  "ford-f150", "ford-explorer",
  "chevy-silverado", "chevy-equinox",
  "hyundai-tucson", "hyundai-elantra",
  "jeep-grand-cherokee", "jeep-wrangler",
  "subaru-outback", "subaru-forester",
  "bmw-x5", "bmw-3",
  "mercedes-glc",
  "audi-q5",
  "ram-1500",
];

const TOP_CHARGE_EV_SLUGS = [
  "tesla-model-y-long-range-awd",
  "tesla-model-3-long-range-rwd",
  "tesla-model-x-dual-motor",
  "tesla-model-s-dual-motor",
  "chevrolet-bolt-ev",
  "ford-mustang-mach-e-standard-rwd",
  "rivian-r1t-dual-motor",
  "rivian-r1s-dual-motor",
  "kia-ev6-long-range-rwd",
  "hyundai-ioniq-5-long-range-rwd",
  "hyundai-ioniq-6-long-range-rwd",
  "volkswagen-id4-pro-rwd",
  "audi-q4-e-tron-40-rwd",
  "bmw-ix-xdrive40",
  "lucid-air-pure-rwd",
  "nissan-leaf-s-plus",
  "chevrolet-silverado-ev-work-truck",
  "cadillac-lyriq-rwd",
  "mercedes-benz-eqb-300-4matic",
  "subaru-solterra-fwd",
];

const TOP_CHARGE_STATE_SLUGS = [
  "california",
  "texas",
  "florida",
  "washington",
  "oregon",
  "new-york",
  "colorado",
  "arizona",
  "georgia",
  "virginia",
  "new-jersey",
  "north-carolina",
  "illinois",
  "massachusetts",
  "minnesota",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const states = getAllStates();
  const evs = evRepository.getSummaries();
  const allEvs = evRepository.getAll();
  const gases = gasRepository.getAll();

  const realGasIds = REAL_GAS_IDS.filter((id) => gases.find((g) => g.id === id));

  const stateUrls = states.map((s) => ({
    url: `${BASE}/ev-cost/${s.slug}`,
    lastModified: NOW,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const evUrls = evs.map((e) => ({
    url: `${BASE}/ev/${e.slug}`,
    lastModified: NOW,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const compareUrls: MetadataRoute.Sitemap = [];
  for (const ev of allEvs) {
    for (const gasId of realGasIds) {
      compareUrls.push({
        url: `${BASE}/compare/${ev.slug}-vs-${gasId}`,
        lastModified: NOW,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      });
    }
  }

  const guideUrls = GUIDES.map((g) => ({
    url: `${BASE}/guides/${g.slug}`,
    lastModified: NOW,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  const chargeUrls: MetadataRoute.Sitemap = TOP_CHARGE_EV_SLUGS.flatMap((car) =>
    TOP_CHARGE_STATE_SLUGS.map((state) => ({
      url: `${BASE}/cost-to-charge/${car}/${state}`,
      lastModified: NOW,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))
  );

  return [
    { url: BASE,                        lastModified: NOW, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/guides`,            lastModified: NOW, changeFrequency: "weekly",  priority: 0.85 },
    { url: `${BASE}/ev-insurance`,      lastModified: NOW, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/privacy`,           lastModified: NOW, changeFrequency: "yearly",  priority: 0.2 },
    { url: `${BASE}/terms`,             lastModified: NOW, changeFrequency: "yearly",  priority: 0.2 },
    ...guideUrls,
    ...stateUrls,
    ...evUrls,
    ...compareUrls,
    ...chargeUrls,
  ];
}
