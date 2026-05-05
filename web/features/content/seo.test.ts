import { describe, it, expect } from "vitest";
import { chargePageMeta } from "./seo";
import type { EVModel } from "../ev-data/types";
import type { StateData } from "../location/types";

const mockEv: EVModel = {
  id: "t-my-lr-awd",
  slug: "tesla-model-y-long-range-awd",
  brand: "Tesla",
  name: "Model Y Long Range AWD",
  fullName: "Tesla Model Y Long Range AWD",
  modelYear: 2026,
  battery: 75,
  efficiency: 3.6,
  range: 320,
  msrp: 50990,
  connector: "NACS",
  segment: "suv",
  federalTaxCredit: 7500,
};

const mockState: StateData = {
  code: "OR",
  name: "Oregon",
  slug: "oregon",
  kwhCents: 13.2,
  gasDollar: 3.95,
  hasTOU: true,
};

describe("chargePageMeta", () => {
  it("title includes EV full name, state name, and year", () => {
    const { title } = chargePageMeta(mockEv, mockState, 48, 1008);
    expect(title).toBe("Cost to Charge Tesla Model Y Long Range AWD in Oregon (2026)");
  });

  it("description includes monthly cost rounded to nearest dollar", () => {
    const { description } = chargePageMeta(mockEv, mockState, 48, 1008);
    expect(description).toContain("$48");
  });

  it("description includes state name", () => {
    const { description } = chargePageMeta(mockEv, mockState, 48, 1008);
    expect(description).toContain("Oregon");
  });

  it("description includes annual savings rounded to nearest dollar", () => {
    const { description } = chargePageMeta(mockEv, mockState, 48, 1008);
    expect(description).toContain("$1,008");
  });
});
