import type { EVModel, EVModelSummary, GasVehicle } from "./types";
import { EV_MODELS } from "./data/evs";
import { GAS_MODELS } from "./data/gas-vehicles";

export const evRepository = {
  getAll(): EVModel[] { return EV_MODELS; },

  getBySlug(slug: string): EVModel | undefined {
    return EV_MODELS.find((m) => m.slug === slug);
  },

  getByBrand(brand: string): EVModel[] {
    return EV_MODELS.filter((m) => m.brand === brand);
  },

  getByConnector(connector: EVModel["connector"]): EVModel[] {
    return EV_MODELS.filter((m) => m.connector === connector);
  },

  getBySegment(segment: EVModel["segment"]): EVModel[] {
    return EV_MODELS.filter((m) => m.segment === segment);
  },

  getSummaries(): EVModelSummary[] {
    return EV_MODELS.map(({ id, slug, brand, name, fullName, range, msrp, connector, segment }) => ({
      id, slug, brand, name, fullName, range, msrp, connector, segment,
    }));
  },

  getBrands(): string[] {
    return [...new Set(EV_MODELS.map((m) => m.brand))].sort();
  },

  getUnder(msrpCap: number): EVModel[] {
    return EV_MODELS.filter((m) => m.msrp <= msrpCap);
  },

  getSortedByRange(): EVModel[] {
    return [...EV_MODELS].sort((a, b) => b.range - a.range);
  },

  getSortedByEfficiency(): EVModel[] {
    return [...EV_MODELS].sort((a, b) => b.efficiency - a.efficiency);
  },
};

export const gasRepository = {
  getAll(): GasVehicle[] { return GAS_MODELS; },
  getById(id: string): GasVehicle | undefined {
    return GAS_MODELS.find((m) => m.id === id);
  },
};
