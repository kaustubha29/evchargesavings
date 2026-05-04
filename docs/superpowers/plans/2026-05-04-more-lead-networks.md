# More Lead Networks Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand from 3 hardcoded lead networks to 9 config-driven networks (2 charger, 3 ev, 4 insurance), where adding a new network in future requires only one config entry.

**Architecture:** Refactor `lead-networks.ts` from one-function-per-network to a `NETWORK_CONFIGS` array. Each config entry declares the intent it handles, its env var names, and how to build its request body. `submitLeadToNetworks` iterates configs, filters by intent, and fans out. Networks with missing env vars skip silently (same UX as today). `route.ts` gets a `getNetworkNamesForIntent` helper to compute the networksSubmitted email field dynamically.

**Tech Stack:** TypeScript, Vitest, Next.js API route, Supabase.

---

## File Map

| File | Change |
|------|--------|
| `web/lib/lead-networks.ts` | Full refactor: `NetworkConfig` interface, `NETWORK_CONFIGS` array (9 entries), config-driven `submitLeadToNetworks`, new `getNetworkNamesForIntent` export |
| `web/lib/lead-networks.test.ts` | Update all tests: new beforeEach clears all 18 env vars, updated counts and network names |
| `web/app/api/lead/route.ts` | Replace hardcoded `networksSubmitted` string with `getNetworkNamesForIntent(intent)`, keep existing 3 Supabase column updates for backward compat |

---

### Task 1: Refactor `lead-networks.ts` to config-driven

**Files:**
- Modify: `web/lib/lead-networks.ts` (full rewrite)

- [ ] **Step 1: Replace the entire file with the config-driven implementation**

```typescript
export interface LeadPayload {
  name: string;
  email: string;
  phone: string;
  zip: string | null;
  intent: string[];
  stateName?: string | null;
}

export interface NetworkResult {
  network: string;
  accepted: boolean;
  leadId?: string;
  error?: string;
}

interface NetworkConfig {
  id: string;
  intent: string;
  envKey: string;
  envEndpoint: string;
  buildBody: (lead: LeadPayload) => Record<string, unknown>;
}

const NETWORK_CONFIGS: NetworkConfig[] = [
  // ── charger ──────────────────────────────────────────────────────────────
  {
    id: "modernize",
    intent: "charger",
    envKey: "MODERNIZE_API_KEY",
    envEndpoint: "MODERNIZE_ENDPOINT",
    buildBody: (lead) => ({
      name: lead.name, email: lead.email, phone: lead.phone, zip: lead.zip,
      service_type: "ev_charger_installation",
    }),
  },
  {
    id: "homeadvisor",
    intent: "charger",
    envKey: "HOMEADVISOR_API_KEY",
    envEndpoint: "HOMEADVISOR_ENDPOINT",
    buildBody: (lead) => ({
      name: lead.name, email: lead.email, phone: lead.phone, zip: lead.zip,
      category: "ev_charger",
    }),
  },
  // ── ev ───────────────────────────────────────────────────────────────────
  {
    id: "autoweb",
    intent: "ev",
    envKey: "AUTOWEB_API_KEY",
    envEndpoint: "AUTOWEB_ENDPOINT",
    buildBody: (lead) => ({
      name: lead.name, email: lead.email, phone: lead.phone, zip: lead.zip,
      vehicle_interest: "electric",
    }),
  },
  {
    id: "truecar",
    intent: "ev",
    envKey: "TRUECAR_API_KEY",
    envEndpoint: "TRUECAR_ENDPOINT",
    buildBody: (lead) => ({
      name: lead.name, email: lead.email, phone: lead.phone, zip: lead.zip,
      vehicle_type: "electric",
    }),
  },
  {
    id: "edmunds",
    intent: "ev",
    envKey: "EDMUNDS_API_KEY",
    envEndpoint: "EDMUNDS_ENDPOINT",
    buildBody: (lead) => ({
      name: lead.name, email: lead.email, phone: lead.phone, zip: lead.zip,
      fuel_type: "electric",
    }),
  },
  // ── insurance ─────────────────────────────────────────────────────────────
  {
    id: "everquote",
    intent: "insurance",
    envKey: "EVERQUOTE_API_KEY",
    envEndpoint: "EVERQUOTE_ENDPOINT",
    buildBody: (lead) => ({
      name: lead.name, email: lead.email, phone: lead.phone, zip: lead.zip,
    }),
  },
  {
    id: "quotewizard",
    intent: "insurance",
    envKey: "QUOTEWIZARD_API_KEY",
    envEndpoint: "QUOTEWIZARD_ENDPOINT",
    buildBody: (lead) => ({
      name: lead.name, email: lead.email, phone: lead.phone, zip: lead.zip,
    }),
  },
  {
    id: "mediaalpha",
    intent: "insurance",
    envKey: "MEDIAALPHA_API_KEY",
    envEndpoint: "MEDIAALPHA_ENDPOINT",
    buildBody: (lead) => ({
      name: lead.name, email: lead.email, phone: lead.phone, zip: lead.zip,
    }),
  },
  {
    id: "zebra",
    intent: "insurance",
    envKey: "ZEBRA_API_KEY",
    envEndpoint: "ZEBRA_ENDPOINT",
    buildBody: (lead) => ({
      name: lead.name, email: lead.email, phone: lead.phone, zip: lead.zip,
    }),
  },
];

async function postToNetwork(
  url: string,
  apiKey: string,
  body: Record<string, unknown>,
  network: string
): Promise<NetworkResult> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(5000),
    });
    // Assumes HTTP 200 = accepted. Networks that return 200 with an error body
    // will be logged as accepted — update once per-network response shapes are known.
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return { network, accepted: false, error: `HTTP ${res.status}: ${text}` };
    }
    const data = await res.json().catch(() => ({}));
    return {
      network,
      accepted: true,
      ...(data.lead_id ?? data.id ?? data.leadId
        ? { leadId: data.lead_id ?? data.id ?? data.leadId }
        : {}),
    };
  } catch (err) {
    return { network, accepted: false, error: String(err) };
  }
}

// Returns the network IDs that would be contacted for a given set of intents.
// Used by route.ts to build the owner notification email before results are available.
export function getNetworkNamesForIntent(intents: string[]): string[] {
  return NETWORK_CONFIGS
    .filter((cfg) => intents.includes(cfg.intent))
    .map((cfg) => cfg.id);
}

// postToNetwork never throws — safe to use Promise.all
export async function submitLeadToNetworks(lead: LeadPayload): Promise<NetworkResult[]> {
  const tasks = NETWORK_CONFIGS
    .filter((cfg) => lead.intent.includes(cfg.intent))
    .map((cfg) => {
      const apiKey   = process.env[cfg.envKey];
      const endpoint = process.env[cfg.envEndpoint];
      if (!apiKey || !endpoint) {
        console.warn(`[lead-networks] ${cfg.envKey} or ${cfg.envEndpoint} not set — skipping`);
        return Promise.resolve<NetworkResult>({ network: cfg.id, accepted: false, error: "not configured" });
      }
      return postToNetwork(endpoint, apiKey, cfg.buildBody(lead), cfg.id);
    });
  return Promise.all(tasks);
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd web && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add web/lib/lead-networks.ts
git commit -m "refactor: config-driven lead networks, add homeadvisor/truecar/edmunds/quotewizard/mediaalpha/zebra"
```

---

### Task 2: Update `lead-networks.test.ts`

**Files:**
- Modify: `web/lib/lead-networks.test.ts` (full rewrite)

- [ ] **Step 1: Replace the entire test file**

```typescript
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
    const modernize    = results.find((r) => r.network === "modernize");
    const homeadvisor  = results.find((r) => r.network === "homeadvisor");

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
```

- [ ] **Step 2: Run tests — expect all to pass**

```bash
cd web && npx vitest run lib/lead-networks.test.ts
```

Expected output:
```
Test Files  1 passed (1)
     Tests  11 passed (11)
```

- [ ] **Step 3: Commit**

```bash
git add web/lib/lead-networks.test.ts
git commit -m "test: update lead-networks tests for 9-network config-driven architecture"
```

---

### Task 3: Update `route.ts` to use `getNetworkNamesForIntent`

**Files:**
- Modify: `web/app/api/lead/route.ts`

- [ ] **Step 1: Update the import line at the top of the file**

Find:
```typescript
import { submitLeadToNetworks } from "@/lib/lead-networks";
import type { NetworkResult } from "@/lib/lead-networks";
```

Replace with:
```typescript
import { submitLeadToNetworks, getNetworkNamesForIntent } from "@/lib/lead-networks";
import type { NetworkResult } from "@/lib/lead-networks";
```

- [ ] **Step 2: Replace the hardcoded `networksSubmitted` block**

Find:
```typescript
  const networksSubmitted = [
    ...(intent.includes("charger")   ? ["Modernize"] : []),
    ...(intent.includes("ev")        ? ["AutoWeb"]   : []),
    ...(intent.includes("insurance") ? ["EverQuote"] : []),
  ].join(", ");
```

Replace with:
```typescript
  const networksSubmitted = getNetworkNamesForIntent(intent).join(", ");
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd web && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Run the full test suite to catch any regressions**

```bash
cd web && npx vitest run
```

Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add web/app/api/lead/route.ts
git commit -m "feat: derive networksSubmitted from config, remove hardcoded network list in route"
```
