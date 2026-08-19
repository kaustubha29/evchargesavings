import { RATES_UPDATED, RATES_GAS_PERIOD, RATES_ELEC_PERIOD } from "@/features/location/data/states";

// Human-readable labels for rate provenance.
//
// Three distinct dates matter and they are not the same thing:
//   refreshedLabel — when we last pulled EIA data into the repo
//   elecPeriodLabel — the month the EIA residential electricity actuals cover (EIA lags ~3 months)
//   gasPeriodLabel  — the week the EIA retail gasoline survey covers (near-current)
//
// Always show the data period next to a number, and the refresh date next to the dataset.

function monthLabel(iso: string) {
  if (!/^\d{4}-\d{2}$/.test(iso)) return "";
  const [y, m] = iso.split("-");
  return new Date(Date.UTC(Number(y), Number(m) - 1, 1)).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function dayLabel(iso: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return "";
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function longDayLabel(iso: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Date we last ran scripts/refresh-baselines.mjs — e.g. "August 19, 2026". */
export const RATES_REFRESHED_LABEL = longDayLabel(RATES_UPDATED);

/** EIA residential electricity period — e.g. "May 2026". */
export const RATES_ELEC_LABEL = monthLabel(RATES_ELEC_PERIOD);

/** EIA weekly retail gasoline period — e.g. "Aug 17, 2026". */
export const RATES_GAS_LABEL = dayLabel(RATES_GAS_PERIOD);

/** One-line provenance string for footnotes and metadata. */
export const RATES_SOURCE_LINE =
  `EIA residential electricity actuals (${RATES_ELEC_LABEL}) and EIA weekly retail gasoline ` +
  `(${RATES_GAS_LABEL}), refreshed ${RATES_REFRESHED_LABEL}.`;
