import type { MetadataRoute } from "next";
import { getAllStates } from "@/features/location/queries";
import { evRepository, gasRepository } from "@/features/ev-data/repository";
import { GUIDES } from "@/features/guides/data";

const BASE = "https://evchargesavings.com";
const NOW = new Date().toISOString();

// Must match the EV IDs and gas IDs used in app/compare/[comparison]/page.tsx
const TOP_EV_IDS = [
  "t-my-lr-awd", "t-my-rwd", "t-m3-rwd", "t-m3-lr-awd",
  "h-i5-lr-rwd", "h-i6-lr-rwd", "k-ev6-lr-rwd", "k-ev9-wind",
  "f-mache-sr", "f-lt-sr", "r-r1t-dual", "r-r1s-dual",
  "c-bolt", "c-bl-lt", "vw-id4-pro", "ni-ariya-fwd",
  "bmw-ix-50", "ps-p2-lr1", "lu-air-pure", "mb-eqs-450",
];

const TOP_GAS_IDS = [
  "toyota-rav4", "honda-cr-v", "toyota-camry", "ford-f150",
  "honda-civic", "chevy-silverado", "ford-explorer",
  "hyundai-tucson", "jeep-grand-cherokee", "bmw-x5",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const states = getAllStates();
  const evs = evRepository.getSummaries();
  const gases = gasRepository.getAll();

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

  const allEvs = evRepository.getAll();
  const compareUrls: MetadataRoute.Sitemap = [];
  for (const evId of TOP_EV_IDS) {
    const ev = allEvs.find((e) => e.id === evId);
    if (!ev) continue;
    for (const gasId of TOP_GAS_IDS) {
      if (!gases.find((g) => g.id === gasId)) continue;
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

  return [
    { url: BASE, lastModified: NOW, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/privacy`, lastModified: NOW, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE}/terms`, lastModified: NOW, changeFrequency: "yearly", priority: 0.2 },
    ...guideUrls,
    ...stateUrls,
    ...evUrls,
    ...compareUrls,
  ];
}
