import type { MetadataRoute } from "next";
import { getAllStates } from "@/features/location/queries";
import { evRepository, gasRepository } from "@/features/ev-data/repository";
import { GUIDES } from "@/features/guides/data";

const BASE = "https://evchargesavings.com";
const NOW = new Date().toISOString();

const TOP_EV_SLUGS = [
  "t-my-lr-awd", "t-m3-lr-awd", "t-mx-plaid", "t-ms-plaid",
  "f-f150-lightning-xlt", "r-r1t-adventure", "gm-silverado-ev-rst",
  "h-ioniq6-se", "h-ioniq5-se", "k-ev6-wind",
  "vw-id4-pro", "a-etron-gt", "p-taycan-4s", "mc-elr1",
  "n-ariya-engage", "l-air-gt", "b-ix-xdrive50", "b-i4-edrive40",
  "v-xc40-recharge", "r-zephyr-reserve",
].slice(0, 20);

const TOP_GAS_IDS = [
  "toyota-rav4", "honda-crv", "toyota-camry", "honda-accord",
  "ford-f150", "chevy-silverado", "toyota-highlander",
  "honda-pilot", "ford-explorer", "chevy-equinox",
].slice(0, 10);

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

  const compareUrls: MetadataRoute.Sitemap = [];
  for (const evSlug of TOP_EV_SLUGS) {
    if (!evRepository.getBySlug(evSlug)) continue;
    for (const gasId of TOP_GAS_IDS) {
      if (!gases.find((g) => g.id === gasId)) continue;
      compareUrls.push({
        url: `${BASE}/compare/${evSlug}-vs-${gasId}`,
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
