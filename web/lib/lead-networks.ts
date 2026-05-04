export interface LeadPayload {
  name: string;
  email: string;
  phone: string;
  zip: string;
  intent: string[];
  stateName?: string | null;
}

export interface NetworkResult {
  network: "modernize" | "autoweb" | "everquote";
  accepted: boolean;
  leadId?: string;
  error?: string;
}

async function postToNetwork(
  url: string,
  apiKey: string,
  body: Record<string, unknown>,
  network: NetworkResult["network"]
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
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return { network, accepted: false, error: `HTTP ${res.status}: ${text}` };
    }
    const data = await res.json().catch(() => ({}));
    return {
      network,
      accepted: true,
      leadId: data.lead_id ?? data.id ?? data.leadId ?? undefined,
    };
  } catch (err) {
    return { network, accepted: false, error: String(err) };
  }
}

export async function submitToModernize(lead: LeadPayload): Promise<NetworkResult> {
  const apiKey   = process.env.MODERNIZE_API_KEY;
  const endpoint = process.env.MODERNIZE_ENDPOINT;
  if (!apiKey || !endpoint) {
    console.warn("[lead-networks] MODERNIZE_API_KEY or MODERNIZE_ENDPOINT not set — skipping");
    return { network: "modernize", accepted: false, error: "not configured" };
  }
  return postToNetwork(endpoint, apiKey, {
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    zip: lead.zip,
    service_type: "ev_charger_installation",
  }, "modernize");
}

export async function submitToAutoWeb(lead: LeadPayload): Promise<NetworkResult> {
  const apiKey   = process.env.AUTOWEB_API_KEY;
  const endpoint = process.env.AUTOWEB_ENDPOINT;
  if (!apiKey || !endpoint) {
    console.warn("[lead-networks] AUTOWEB_API_KEY or AUTOWEB_ENDPOINT not set — skipping");
    return { network: "autoweb", accepted: false, error: "not configured" };
  }
  return postToNetwork(endpoint, apiKey, {
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    zip: lead.zip,
    vehicle_interest: "electric",
  }, "autoweb");
}

export async function submitToEverQuote(lead: LeadPayload): Promise<NetworkResult> {
  const apiKey   = process.env.EVERQUOTE_API_KEY;
  const endpoint = process.env.EVERQUOTE_ENDPOINT;
  if (!apiKey || !endpoint) {
    console.warn("[lead-networks] EVERQUOTE_API_KEY or EVERQUOTE_ENDPOINT not set — skipping");
    return { network: "everquote", accepted: false, error: "not configured" };
  }
  return postToNetwork(endpoint, apiKey, {
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    zip: lead.zip,
  }, "everquote");
}

// postToNetwork never throws — safe to use Promise.all
export async function submitLeadToNetworks(lead: LeadPayload): Promise<NetworkResult[]> {
  const tasks: Promise<NetworkResult>[] = [];
  if (lead.intent.includes("charger")) tasks.push(submitToModernize(lead));
  if (lead.intent.includes("ev"))      tasks.push(submitToAutoWeb(lead));
  tasks.push(submitToEverQuote(lead)); // always
  return Promise.all(tasks);
}
