import { describe, it, expect } from "vitest";
import { getComparableGasId, getComparableGas } from "./comparable-gas";
import { GAS_MODELS } from "./gas-vehicles";

describe("getComparableGasId", () => {
  it("returns direct match for Tesla Model Y slug", () => {
    expect(getComparableGasId("tesla-model-y-long-range-awd", "suv")).toBe("toyota-rav4");
  });

  it("returns direct match for Rivian R1T slug", () => {
    expect(getComparableGasId("rivian-r1t-dual-motor", "truck")).toBe("ford-f150");
  });

  it("falls back to segment map for unknown slug", () => {
    expect(getComparableGasId("some-unknown-ev", "truck")).toBe("ford-f150");
    expect(getComparableGasId("some-unknown-ev", "sedan")).toBe("toyota-camry");
    expect(getComparableGasId("some-unknown-ev", "suv")).toBe("toyota-rav4");
  });

  it("falls back to toyota-rav4 for unknown slug and unknown segment", () => {
    expect(getComparableGasId("unknown-ev", "unknown-segment")).toBe("toyota-rav4");
  });
});

describe("getComparableGas", () => {
  it("returns a GasVehicle with positive mpg", () => {
    const gas = getComparableGas("tesla-model-y-long-range-awd", "suv");
    expect(gas.mpg).toBeGreaterThan(0);
    expect(gas.id).toBe("toyota-rav4");
  });

  it("honours DIRECT map over segment fallback", () => {
    const gas = getComparableGas("chevrolet-bolt-ev", "sedan");
    expect(gas.id).toBe("honda-civic");
    expect(GAS_MODELS.some((g) => g.id === gas.id)).toBe(true);
  });

  it("never returns undefined — unknown slug falls back to toyota-rav4", () => {
    const gas = getComparableGas("does-not-exist", "does-not-exist");
    expect(gas).toBeDefined();
    expect(gas.id).toBe("toyota-rav4");
  });
});
