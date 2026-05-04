import { describe, it, expect, vi, beforeEach } from "vitest";
import { submitLeadToNetworks, getNetworkNamesForIntent } from "./lead-networks";

const LEAD = {
  name: "Jane Smith",
  email: "jane@test.com",
  phone: "5551234567",
  zip: "90210",
  intent: ["charger", "ev", "insurance"],
  stateName: "California",
};

// All 9 network env var pairs
const ALL_ENV_VARS = [
  "MODERNIZE_API_KEY",    "MODERNIZE_ENDPOINT",
  "HOMEADVISOR_API_KEY",  "HOMEADVISOR_ENDPOINT",
  "AUTOWEB_API_KEY",      "AUTOWEB_ENDPOINT",
  "TRUECAR_API_KEY",      "TRUECAR_ENDPOINT",
  "EDMUNDS_API_KEY",      "EDMUNDS_ENDPOINT",
  "EVERQUOTE_API_KEY",    "EVERQUOTE_ENDPOINT",
  "QUOTEWIZARD_API_KEY",  "QUOTEWIZARD_ENDPOINT",
  "MEDIAALPHA_API_KEY",   "MEDIAALPHA_ENDPOINT",
  "ZEBRA_API_KEY",        "ZEBRA_ENDPOINT",
];

describe("submitLeadToNetworks", () => {
  beforeEach(() => {
    ALL_ENV_VARS.forEach((key) => delete process.env[key]);
  });

  it("returns not-configured for all 9 when env vars missing", async () => {
    const results = await submitLeadToNetworks(LEAD);
    expect(results).toHaveLength(9);
    expect(results.every((r) => r.error === "not configured")).toBe(true);
  });

  it("calls both charger networks for charger-only intent", async () => {
    const results = await submitLeadToNetworks({ ...LEAD, intent: ["charger"] });
    expect(results.map((r) => r.network).sort()).toEqual(["homeadvisor", "modernize"]);
  });

  it("calls all 3 ev networks for ev-only intent", async () => {
    const results = await submitLeadToNetworks({ ...LEAD, intent: ["ev"] });
    expect(results.map((r) => r.network).sort()).toEqual(["autoweb", "edmunds", "truecar"]);
  });

  it("calls all 4 insurance networks for insurance-only intent", async () => {
    const results = await submitLeadToNetworks({ ...LEAD, intent: ["insurance"] });
    expect(results.map((r) => r.network).sort()).toEqual(["everquote", "mediaalpha", "quotewizard", "zebra"]);
  });

  it("calls all 9 networks when intent includes all three", async () => {
    const results = await submitLeadToNetworks(LEAD);
    expect(results).toHaveLength(9);
    expect(results.map((r) => r.network).sort()).toEqual([
      "autoweb", "edmunds", "everquote", "homeadvisor",
      "mediaalpha", "modernize", "quotewizard", "truecar", "zebra",
    ]);
  });

  it("returns accepted with leadId when fetch succeeds", async () => {
    vi.stubEnv("QUOTEWIZARD_API_KEY", "test-key");
    vi.stubEnv("QUOTEWIZARD_ENDPOINT", "https://example.com/leads");

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ lead_id: "qw-456" }),
      text: async () => "",
    });
    vi.stubGlobal("fetch", mockFetch);

    const results = await submitLeadToNetworks({ ...LEAD, intent: ["insurance"] });
    const qw = results.find((r) => r.network === "quotewizard");

    expect(qw?.accepted).toBe(true);
    expect(qw?.leadId).toBe("qw-456");

    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("skips networks whose env vars are missing, calls the one that is configured", async () => {
    vi.stubEnv("MODERNIZE_API_KEY", "test-key");
    vi.stubEnv("MODERNIZE_ENDPOINT", "https://example.com/modernize");

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: "m-789" }),
      text: async () => "",
    });
    vi.stubGlobal("fetch", mockFetch);

    const results = await submitLeadToNetworks({ ...LEAD, intent: ["charger"] });
    const modernize   = results.find((r) => r.network === "modernize");
    const homeadvisor = results.find((r) => r.network === "homeadvisor");

    expect(modernize?.accepted).toBe(true);
    expect(modernize?.leadId).toBe("m-789");
    expect(homeadvisor?.accepted).toBe(false);
    expect(homeadvisor?.error).toBe("not configured");

    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });
});

describe("getNetworkNamesForIntent", () => {
  it("returns charger network ids for charger intent", () => {
    expect(getNetworkNamesForIntent(["charger"]).sort()).toEqual(["homeadvisor", "modernize"]);
  });

  it("returns ev network ids for ev intent", () => {
    expect(getNetworkNamesForIntent(["ev"]).sort()).toEqual(["autoweb", "edmunds", "truecar"]);
  });

  it("returns insurance network ids for insurance intent", () => {
    expect(getNetworkNamesForIntent(["insurance"]).sort()).toEqual(["everquote", "mediaalpha", "quotewizard", "zebra"]);
  });

  it("returns all 9 ids for all three intents", () => {
    expect(getNetworkNamesForIntent(["charger", "ev", "insurance"])).toHaveLength(9);
  });

  it("returns empty array for unknown intent", () => {
    expect(getNetworkNamesForIntent(["unknown"])).toEqual([]);
  });
});
