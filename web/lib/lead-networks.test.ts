import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { submitLeadToNetworks } from "./lead-networks";

const LEAD = {
  name: "Jane Smith",
  email: "jane@test.com",
  phone: "5551234567",
  zip: "90210",
  intent: ["charger", "ev"],
  stateName: "California",
};

describe("submitLeadToNetworks", () => {
  beforeEach(() => {
    vi.stubEnv("MODERNIZE_API_KEY", "");
    vi.stubEnv("MODERNIZE_ENDPOINT", "");
    vi.stubEnv("AUTOWEB_API_KEY", "");
    vi.stubEnv("AUTOWEB_ENDPOINT", "");
    vi.stubEnv("EVERQUOTE_API_KEY", "");
    vi.stubEnv("EVERQUOTE_ENDPOINT", "");
  });

  afterEach(() => vi.unstubAllEnvs());

  it("returns not-configured for all when env vars missing", async () => {
    const results = await submitLeadToNetworks(LEAD);
    expect(results).toHaveLength(3);
    expect(results.every((r) => r.error === "not configured")).toBe(true);
  });

  it("calls modernize + everquote only when intent is charger-only", async () => {
    const results = await submitLeadToNetworks({ ...LEAD, intent: ["charger"] });
    const networks = results.map((r) => r.network);
    expect(networks).toContain("modernize");
    expect(networks).not.toContain("autoweb");
    expect(networks).toContain("everquote");
    expect(results).toHaveLength(2);
  });

  it("calls autoweb + everquote only when intent is ev-only", async () => {
    const results = await submitLeadToNetworks({ ...LEAD, intent: ["ev"] });
    const networks = results.map((r) => r.network);
    expect(networks).not.toContain("modernize");
    expect(networks).toContain("autoweb");
    expect(networks).toContain("everquote");
    expect(results).toHaveLength(2);
  });

  it("always includes everquote", async () => {
    const results = await submitLeadToNetworks({ ...LEAD, intent: ["charger"] });
    expect(results.map((r) => r.network)).toContain("everquote");
  });

  it("calls all 3 networks when intent is both", async () => {
    const results = await submitLeadToNetworks({ ...LEAD, intent: ["charger", "ev"] });
    expect(results).toHaveLength(3);
    expect(results.map((r) => r.network).sort()).toEqual(["autoweb", "everquote", "modernize"].sort());
  });
});
