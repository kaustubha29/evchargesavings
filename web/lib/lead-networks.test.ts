import { describe, it, expect, vi, beforeEach } from "vitest";
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
    delete process.env.MODERNIZE_API_KEY;
    delete process.env.MODERNIZE_ENDPOINT;
    delete process.env.AUTOWEB_API_KEY;
    delete process.env.AUTOWEB_ENDPOINT;
    delete process.env.EVERQUOTE_API_KEY;
    delete process.env.EVERQUOTE_ENDPOINT;
  });

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

  it("returns accepted with leadId when fetch succeeds", async () => {
    vi.stubEnv("EVERQUOTE_API_KEY", "test-key");
    vi.stubEnv("EVERQUOTE_ENDPOINT", "https://example.com/leads");

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ lead_id: "eq-123" }),
      text: async () => "",
    });
    vi.stubGlobal("fetch", mockFetch);

    const results = await submitLeadToNetworks({ ...LEAD, intent: ["ev"] });
    const everquote = results.find((r) => r.network === "everquote");

    expect(everquote?.accepted).toBe(true);
    expect(everquote?.leadId).toBe("eq-123");

    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });
});
