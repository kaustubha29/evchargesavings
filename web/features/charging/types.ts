import type { ConnectorType } from "@/features/ev-data/types";

export type NetworkRating = "ex" | "gd" | "fr";

export interface ChargingNetwork {
  id: string;
  short: string;
  name: string;
  maxKw: number;
  perKwh: number;
  stations: number;
  color: string;
  bgColor: string;
  rating: NetworkRating;
  connectors: string[];
  stars: number;
  desc: string;
  membershipLabel: string;
  memberPrice: number | null;
  pros: string[];
  cons: string[];
}

export interface NetworkWithCost extends ChargingNetwork {
  annualCost: number;
}

export type CompatibilityClass = "yes" | "adapter" | "incompat";

export interface ConnectorCompat {
  label: string;
  cls: CompatibilityClass;
  note: string;
}
