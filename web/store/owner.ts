"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type OwnerConnector = "tesla" | "nacs" | "j1772" | null;

export const NACS_FROM_YEAR: Record<string, number> = {
  Tesla: 2012,
  Rivian: 2024,
  Chevrolet: 2024, GMC: 2024, Cadillac: 2024, Buick: 2024,
  Honda: 2024, Acura: 2024,
  Ford: 2025,
  Hyundai: 2025, Kia: 2025,
  BMW: 2025, MINI: 2025,
  Polestar: 2025, Volvo: 2025,
  Genesis: 2026, Scout: 2026,
  Ram: 2025, Jeep: 2025,
};

export function deriveConnector(brand: string, year: number): OwnerConnector {
  if (brand === "Tesla") return "tesla";
  const nacsYear = NACS_FROM_YEAR[brand];
  if (nacsYear && year >= nacsYear) return "nacs";
  return "j1772";
}

interface OwnerStore {
  brand: string | null;
  year: number | null;
  model: string | null;   // e.g. "EV9 Wind RWD"
  slug: string | null;    // evs.ts slug for efficiency lookup
  setOwnerCar: (brand: string, year: number, model: string, slug: string) => void;
  clearOwnerCar: () => void;
}

export const useOwnerStore = create<OwnerStore>()(
  persist(
    (set) => ({
      brand: null,
      year: null,
      model: null,
      slug: null,
      setOwnerCar: (brand, year, model, slug) => set({ brand, year, model, slug }),
      clearOwnerCar: () => set({ brand: null, year: null, model: null, slug: null }),
    }),
    { name: "ecs-owner-v1" }
  )
);
