import type { Metadata } from "next";
import { evRepository, gasRepository } from "@/features/ev-data/repository";
import { getAllStates, getStateBySlug } from "@/features/location/queries";
import { enrichState } from "@/features/location/live-rates";
import { CalculatorShell } from "@/components/features/calculator/CalculatorShell";
import { LocationDetector } from "@/components/features/location/LocationDetector";
import { NATIONAL_AVG } from "@/features/location/data/states";

export const metadata: Metadata = {
  title: "EV Savings Calculator — EVChargeSavings",
  robots: { index: false },
};

interface Props {
  searchParams: Promise<{ state?: string; ev?: string }>;
}

export default async function EmbedPage({ searchParams }: Props) {
  const { state: stateSlug, ev: evSlug } = await searchParams;

  const rawState = (stateSlug ? getStateBySlug(stateSlug) : null) ?? NATIONAL_AVG;
  const { state } = await enrichState(rawState);

  const evSummaries = evRepository.getSummaries();
  const gasVehicles = gasRepository.getAll();

  return (
    <div className="bg-paper min-h-screen flex flex-col">
      <div className="flex-1 py-6 px-4">
        {rawState.code !== "US" && <LocationDetector forceState={rawState.code} />}
        <CalculatorShell
          evSummaries={evSummaries}
          gasVehicles={gasVehicles}
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
