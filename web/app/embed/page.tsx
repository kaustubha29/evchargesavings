import type { Metadata } from "next";
import { evRepository, gasRepository, phevRepository } from "@/features/ev-data/repository";
import { getAllStates, getStateBySlug } from "@/features/location/queries";
import { enrichState } from "@/features/location/live-rates";
import { CalculatorShell } from "@/components/features/calculator/CalculatorShell";
import { LocationDetector } from "@/components/features/location/LocationDetector";
import { EmbedTeaser } from "@/components/shared/EmbedTeaser";
import { NATIONAL_AVG } from "@/features/location/data/states";

export const metadata: Metadata = {
  title: "EV Savings Calculator — EVChargeSavings",
  robots: { index: false },
};

const TEASER_EV_SLUGS = [
  "tesla-model-y-long-range-awd",
  "tesla-model-3-long-range-rwd",
  "hyundai-ioniq-5-long-range-rwd",
  "kia-ev6-long-range-rwd",
  "kia-ev9-gt-line-awd",
  "chevrolet-equinox-ev-lt-fwd",
  "ford-mustang-mach-e-standard-rwd",
  "rivian-r1s-dual-motor",
  "volkswagen-id4-pro-rwd",
  "chevrolet-bolt-ev",
  "hyundai-ioniq-6-long-range-rwd",
  "nissan-leaf-s-plus",
];

interface Props {
  searchParams: Promise<{ state?: string; ev?: string; mode?: string }>;
}

export default async function EmbedPage({ searchParams }: Props) {
  const { state: stateSlug, ev: evSlug, mode } = await searchParams;
  const isFull = mode === "full";

  const rawState = (stateSlug ? getStateBySlug(stateSlug) : null) ?? NATIONAL_AVG;
  const { state } = await enrichState(rawState);

  if (isFull) {
    const evSummaries = evRepository.getSummaries();
    const gasVehicles  = gasRepository.getAll();
    const phevVehicles = phevRepository.getAll();
    return (
      <div className="bg-paper min-h-screen flex flex-col">
        <div className="flex-1 py-6 px-4">
          {rawState.code !== "US" && <LocationDetector forceState={rawState.code} />}
          <CalculatorShell
            evSummaries={evSummaries}
            gasVehicles={gasVehicles}
            phevVehicles={phevVehicles}
            defaultEvSlug={evSlug}
            initialHomeRateKwh={state.kwhCents}
            initialGasPriceDollar={state.gasDollar}
          />
        </div>
        <div className="border-t border-line py-3 px-4 text-center">
          <a
            href="https://www.evchargesavings.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[10px] uppercase tracking-widest text-ink-mute hover:text-forest transition-colors"
          >
            Powered by EVChargeSavings.com →
          </a>
        </div>
      </div>
    );
  }

  // Teaser mode (default)
  const allStates = getAllStates().map((s) => ({
    name: s.name,
    slug: s.slug,
    kwhCents: s.kwhCents,
    gasDollar: s.gasDollar,
  }));

  const teaserEvs = TEASER_EV_SLUGS.flatMap((slug) => {
    const ev = evRepository.getBySlug(slug);
    if (!ev) return [];
    return [{ name: ev.name, slug: ev.slug, efficiency: ev.efficiency, battery: ev.battery }];
  });

  const defaultStateSlug = stateSlug && allStates.find((s) => s.slug === stateSlug) ? stateSlug : "california";
  const defaultEvSlug = evSlug && teaserEvs.find((e) => e.slug === evSlug) ? evSlug : teaserEvs[0].slug;

  return (
    <EmbedTeaser
      states={allStates}
      evs={teaserEvs}
      defaultStateSlug={defaultStateSlug}
      defaultEvSlug={defaultEvSlug}
    />
  );
}
