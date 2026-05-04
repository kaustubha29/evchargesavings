export type IntentKind = "charger" | "ev" | "insurance";

export interface LeadPayload {
  name: string;
  email: string;
  phone: string;
  zip: string | null;
  intent: IntentKind[];
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
  displayName: string;
  intent: IntentKind;
  envKey: string;
  envEndpoint: string;
  buildBody: (lead: LeadPayload) => Record<string, unknown>;
}

const NETWORK_CONFIGS: NetworkConfig[] = [
  // ── charger ──────────────────────────────────────────────────────────────
  {
    id: "modernize",
    displayName: "Modernize",
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
    displayName: "HomeAdvisor",
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
    displayName: "AutoWeb",
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
    displayName: "TrueCar",
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
    displayName: "Edmunds",
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
    displayName: "EverQuote",
    intent: "insurance",
    envKey: "EVERQUOTE_API_KEY",
    envEndpoint: "EVERQUOTE_ENDPOINT",
    buildBody: (lead) => ({
      name: lead.name, email: lead.email, phone: lead.phone, zip: lead.zip,
    }),
  },
  {
    id: "quotewizard",
    displayName: "QuoteWizard",
    intent: "insurance",
    envKey: "QUOTEWIZARD_API_KEY",
    envEndpoint: "QUOTEWIZARD_ENDPOINT",
    buildBody: (lead) => ({
      name: lead.name, email: lead.email, phone: lead.phone, zip: lead.zip,
    }),
  },
  {
    id: "mediaalpha",
    displayName: "MediaAlpha",
    intent: "insurance",
    envKey: "MEDIAALPHA_API_KEY",
    envEndpoint: "MEDIAALPHA_ENDPOINT",
    buildBody: (lead) => ({
      name: lead.name, email: lead.email, phone: lead.phone, zip: lead.zip,
    }),
  },
  {
    id: "zebra",
    displayName: "The Zebra",
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

export function getNetworkDisplayNamesForIntent(intents: IntentKind[]): string[] {
  return NETWORK_CONFIGS
    .filter((cfg) => intents.includes(cfg.intent))
    .map((cfg) => cfg.displayName);
}

// Returns the network IDs that would be contacted for a given set of intents.
// Used by route.ts to build the owner notification email before results are available.
export function getNetworkNamesForIntent(intents: IntentKind[]): string[] {
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
