import {
  RATES_REFRESHED_LABEL,
  RATES_ELEC_LABEL,
  RATES_GAS_LABEL,
} from "@/features/location/rate-meta";

/**
 * Provenance line for any page that displays electricity or gas rates.
 *
 * Shows both the refresh date and the underlying EIA data periods, because they
 * differ: EIA residential electricity actuals lag roughly three months, while the
 * retail gasoline survey is weekly.
 */
export function RatesUpdatedNote({ className = "" }: { className?: string }) {
  return (
    <p className={`font-mono text-[10px] text-ink-mute leading-relaxed ${className}`}>
      Rates refreshed {RATES_REFRESHED_LABEL} · electricity: EIA residential actuals,{" "}
      {RATES_ELEC_LABEL} · gasoline: EIA weekly retail, {RATES_GAS_LABEL}
    </p>
  );
}
