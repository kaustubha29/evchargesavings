import { describe, it, expect, vi, beforeEach } from "vitest";
import { submitLeadToNetworks } from "./lead-networks";

const LEAD = {
  name: "Jane Smith",
  email: "jane@test.com",
  phone: "5551234567",
  zip: "90210",
  intent: ["charger", "ev", "insurance"],
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

  it("returns not-configured for all 3 when env vars missing", async () => {
    const results = await submitLeadToNetworks(LEAD);
    expect(results).toHaveLength(3);
    expect(results.every((r) => r.error === "not configured")).toBe(true);
  });

  it("calls modernize only for charger-only intent", async () => {
    const results = await submitLeadToNetworks({ ...LEAD, intent: ["charger"] });
    const networks = results.map((r) => r.network);
    expect(networks).toEqual(["modernize"]);
  });

  it("calls autoweb only for ev-only intent", async () => {
    const results = await submitLeadToNetworks({ ...LEAD, intent: ["ev"] });
    const networks = results.map((r) => r.network);
    expect(networks).toEqual(["autoweb"]);
  });

  it("calls everquote only for insurance-only intent", async () => {
    const results = await submitLeadToNetworks({ ...LEAD, intent: ["insurance"] });
    const networks = results.map((r) => r.network);
    expect(networks).toEqual(["everquote"]);
  });

  it("calls all 3 networks when intent includes all three", async () => {
    const results = await submitLeadToNetworks(LEAD);
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

    const results = await submitLeadToNetworks({ ...LEAD, intent: ["insurance"] });
    const everquote = results.find((r) => r.network === "everquote");

    expect(everquote?.accepted).toBe(true);
    expect(everquote?.leadId).toBe("eq-123");

    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });
});
