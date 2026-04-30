export type ConnectorType = "NACS" | "CCS" | "CHADEMO";
export type VehicleSegment = "sedan" | "suv" | "truck" | "van" | "sports" | "crossover";

export interface EVModel {
  id: string;
  slug: string;
  brand: string;
  name: string;
  fullName: string;
  modelYear: number;
  battery: number;
  efficiency: number;
  range: number;
  msrp: number;
  connector: ConnectorType;
  segment: VehicleSegment;
  federalTaxCredit: number;
}

export type EVModelSummary = Pick<
  EVModel,
  "id" | "slug" | "brand" | "name" | "fullName" | "range" | "msrp" | "connector" | "segment"
>;

export interface GasVehicle {
  id: string;
  name: string;
  mpg: number;
  type: string;
}
