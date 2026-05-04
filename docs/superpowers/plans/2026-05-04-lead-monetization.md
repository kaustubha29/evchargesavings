# Lead Monetization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend lead capture to collect name, phone, and intent, then automatically route leads to Modernize (installer), AutoWeb (dealer), and EverQuote (insurance) networks based on stated intent.

**Architecture:** New `web/lib/lead-networks.ts` encapsulates all 3 network API calls with typed interfaces and graceful skip-on-missing-key. API route updated to validate new fields, call networks non-blocking, log network IDs back to Supabase. Form updated with name, phone, intent toggles.

**Tech Stack:** Next.js App Router, TypeScript, Supabase (supabase-js), Resend, Vitest

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| Supabase SQL editor | Migration | Add 7 new columns to `leads` table |
| `web/lib/lead-networks.ts` | Create | 3 network API call functions, typed interfaces, env-based config |
| `web/lib/lead-networks.test.ts` | Create | Unit tests for routing logic |
| `web/app/api/lead/route.ts` | Modify | Validate new fields, call networks, log IDs to Supabase, update owner email |
| `web/components/shared/LeadCaptureBox.tsx` | Modify | Add name, phone, intent toggles, phone formatter |

---

### Task 1: Supabase Schema Migration

**Files:**
- No code files — run SQL in Supabase dashboard SQL editor

- [ ] **Step 1: Open Supabase dashboard SQL editor**

Navigate to your Supabase project → SQL Editor → New Query.

- [ ] **Step 2: Run migration**

```sql
ALTER TABLE leads ADD COLUMN IF NOT EXISTS name text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS intent text[];
ALTER TABLE leads ADD COLUMN IF NOT EXISTS modernize_id text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS autoweb_id text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS everquote_id text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS network_payouts jsonb;
```

- [ ] **Step 3: Verify columns exist**

Run in SQL editor:
```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'leads'
ORDER BY ordinal_position;
```

Expected: `name`, `phone`, `intent`, `modernize_id`, `autoweb_id`, `everquote_id`, `network_payouts` appear in results.

---

### Task 2: Lead Networks Module

**Files:**
- Create: `web/lib/lead-networks.ts`
- Create: `web/lib/lead-networks.test.ts`

- [ ] **Step 1: Create `web/lib/lead-networks.ts`**

```typescript
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
```

- [ ] **Step 2: Create `web/lib/lead-networks.test.ts`**

```typescript
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
```

- [ ] **Step 3: Check Vitest is available**

```bash
cd web && cat package.json | grep vitest
```

If not present:
```bash
cd web && npm install -D vitest && npx json -I -f package.json -e 'this.scripts.test="vitest run"'
```

- [ ] **Step 4: Run tests — verify all 5 pass**

```bash
cd web && npm test -- lead-networks
```

Expected: `5 tests passed`.

- [ ] **Step 5: Commit**

```bash
git add web/lib/lead-networks.ts web/lib/lead-networks.test.ts
git commit -m "feat: add lead networks module (Modernize, AutoWeb, EverQuote)"
```

---

### Task 3: Update API Route

**Files:**
- Modify: `web/app/api/lead/route.ts`

- [ ] **Step 1: Add env var placeholders to `web/.env.local`**

Append these lines (leave values empty until API keys approved):
```
MODERNIZE_API_KEY=
MODERNIZE_ENDPOINT=
AUTOWEB_API_KEY=
AUTOWEB_ENDPOINT=
EVERQUOTE_API_KEY=
EVERQUOTE_ENDPOINT=
```

- [ ] **Step 2: Replace full contents of `web/app/api/lead/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { stateFromZip, getStateData } from "@/features/location/queries";
import { submitLeadToNetworks } from "@/lib/lead-networks";
import type { NetworkResult } from "@/lib/lead-networks";

const OWNER_EMAIL = "evchargesavings@gmail.com";
const FROM_EMAIL  = "EV Charge Savings <noreply@evchargesavings.com>";

function formatPhone(digits: string): string {
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export async function POST(req: NextRequest) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const resendKey   = process.env.RESEND_API_KEY;

  console.log("[lead] SUPABASE_URL prefix:", supabaseUrl?.slice(0, 35));
  console.log("[lead] KEY prefix:", supabaseKey?.slice(0, 10));

  if (!supabaseUrl || !supabaseKey) {
    console.error("[lead] Missing Supabase env vars");
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  let email: string, zip: string, sourcePage: string;
  let name: string, phone: string, intent: string[];
  try {
    const body = await req.json();
    email      = (body.email      ?? "").trim().toLowerCase();
    zip        = (body.zip        ?? "").trim();
    sourcePage = (body.sourcePage ?? "/").trim();
    name       = (body.name       ?? "").trim();
    phone      = (body.phone      ?? "").replace(/\D/g, "");
    intent     = Array.isArray(body.intent) ? body.intent : [];
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 422 });
  }
  if (zip && !/^\d{5}$/.test(zip)) {
    return NextResponse.json({ error: "Invalid ZIP" }, { status: 422 });
  }
  if (!name) {
    return NextResponse.json({ error: "Name required" }, { status: 422 });
  }
  if (!phone || phone.length !== 10) {
    return NextResponse.json({ error: "Valid 10-digit US phone required" }, { status: 422 });
  }
  if (!intent.length || !intent.every((i) => ["ev", "charger"].includes(i))) {
    return NextResponse.json({ error: "At least one intent required" }, { status: 422 });
  }

  const stateCode = zip ? stateFromZip(zip) : null;
  const stateName = stateCode ? getStateData(stateCode).name : null;

  let cityName: string | null = null;
  if (zip) {
    try {
      const res = await fetch(`https://api.zippopotam.us/us/${zip}`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        const data = await res.json();
        cityName = data.places?.[0]?.["place name"] || null;
      }
    } catch {
      // cityName remains null
    }
  }

  const locationStr = cityName && stateName
    ? `${cityName}, ${stateName}`
    : stateName ?? "";

  const intentLabel = intent
    .map((i) => i === "ev" ? "Buy an EV" : "Install a charger")
    .join(" + ");

  const networksSubmitted = [
    ...(intent.includes("charger") ? ["Modernize"] : []),
    ...(intent.includes("ev")      ? ["AutoWeb"]   : []),
    "EverQuote",
  ].join(", ");

  // Supabase write
  let leadId: string | null = null;
  const supabase = createClient(supabaseUrl, supabaseKey);
  try {
    const { data, error } = await supabase.from("leads").insert({
      email,
      zip: zip || null,
      state_code: stateCode,
      source_page: sourcePage,
      name,
      phone,
      intent,
    }).select("id").single();

    if (error?.code === "23505") {
      const { data: updated } = await supabase.from("leads")
        .update({ zip: zip || null, state_code: stateCode, name, phone, intent })
        .eq("email", email)
        .select("id")
        .single();
      leadId = updated?.id || null;
      console.log("[lead] Supabase update OK (duplicate email)");
    } else if (error) {
      console.error("[lead] Supabase write failed:", error);
    } else {
      leadId = data?.id || null;
      console.log("[lead] Supabase insert OK, leadId:", leadId);
    }
  } catch (e) {
    console.error("[lead] Supabase exception:", e);
  }

  // Resend emails — non-blocking
  if (resendKey) {
    const resend = new Resend(resendKey);
    Promise.allSettled([
      resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: "Your personalized EV cost & charger options are on the way",
        html: `
          <p>Hi ${name},</p>
          <p>Thanks for checking out EV ownership costs${locationStr ? ` in <b>${locationStr}</b>` : ""} — we're putting together your personalized breakdown now.</p>
          <p><b>Within the next 24 hours, you'll receive:</b></p>
          <ul>
            <li>⚡ Estimated <b>EV pricing</b> based on your area</li>
            <li>🔌 <b>Level 2 home charger installation costs</b></li>
            <li>💸 Available <b>local incentives and rebates</b></li>
          </ul>
          <p>We'll match you with up to <b>3 vetted local professionals</b>${locationStr ? ` in <b>${locationStr}</b>` : ""} so you can compare quotes — no pressure, no obligation.</p>
          <p>— EV Charge Savings</p>
          <p style="font-size:11px;color:#999">
            Submitted at evchargesavings.com. We never sell your email. You may be contacted by up to 3 vetted local providers.
          </p>
        `,
      }),
      resend.emails.send({
        from: FROM_EMAIL,
        to: OWNER_EMAIL,
        subject: `New lead${stateName ? ` · ${stateName}` : ""}${zip ? ` · ${zip}` : ""}`,
        html: `
          <b>New lead</b><br/>
          Name: ${name}<br/>
          Email: ${email}<br/>
          Phone: ${formatPhone(phone)}<br/>
          ZIP: ${zip || "—"}<br/>
          Location: ${locationStr || "—"}<br/>
          Intent: ${intentLabel}<br/>
          Source: ${sourcePage}<br/>
          Networks submitted: ${networksSubmitted}
        `,
      }),
    ]).then((results) => {
      results.forEach((r) => {
        if (r.status === "rejected") console.error("[lead] Email error:", r.reason);
      });
    });
  } else {
    console.error("[lead] Missing RESEND_API_KEY");
  }

  // Submit to lead networks — non-blocking, log IDs back to Supabase
  submitLeadToNetworks({ name, email, phone, zip, intent, stateName })
    .then(async (networkResults: NetworkResult[]) => {
      console.log("[lead] Network results:", JSON.stringify(networkResults));
      if (!leadId) return;
      const update: Record<string, unknown> = { network_payouts: networkResults };
      for (const r of networkResults) {
        if (r.accepted && r.leadId) {
          if (r.network === "modernize") update.modernize_id = r.leadId;
          if (r.network === "autoweb")   update.autoweb_id   = r.leadId;
          if (r.network === "everquote") update.everquote_id = r.leadId;
        }
      }
      await supabase.from("leads").update(update).eq("id", leadId);
    })
    .catch((err) => console.error("[lead] Network submission error:", err));

  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd web && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add web/app/api/lead/route.ts
git commit -m "feat: validate name/phone/intent and route leads to networks"
```

---

### Task 4: Update Lead Capture Form

**Files:**
- Modify: `web/components/shared/LeadCaptureBox.tsx`

- [ ] **Step 1: Replace full contents of `web/components/shared/LeadCaptureBox.tsx`**

```typescript
"use client";

import { useState } from "react";
import { useCalculatorStore } from "@/store/calculator";

export const LEAD_FORM_SUBMITTED_KEY = "ecs-lead-submitted";

type State = "idle" | "submitting" | "success" | "error";
type Intent = "ev" | "charger";

function formatPhoneDisplay(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

interface Props {
  sourcePage?: string;
  gateId?: string;
}

export function LeadCaptureBox({ sourcePage = "/", gateId }: Props) {
  const { zip, setZip } = useCalculatorStore();
  const [name, setName]           = useState("");
  const [email, setEmail]         = useState("");
  const [phone, setPhone]         = useState("");
  const [intent, setIntent]       = useState<Intent[]>([]);
  const [formState, setFormState] = useState<State>("idle");

  function toggleIntent(value: Intent) {
    setIntent((prev) =>
      prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!intent.length) return;
    setFormState("submitting");

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone: phone.replace(/\D/g, ""),
          zip,
          intent,
          sourcePage,
        }),
      });

      if (!res.ok) throw new Error("Failed");

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(LEAD_FORM_SUBMITTED_KEY, "true");
          window.dispatchEvent(
            new CustomEvent("ecs-lead-submitted", { detail: { gateId } })
          );
        } catch {
          // ignore storage failures
        }
      }

      setFormState("success");
    } catch {
      setFormState("error");
    }
  }

  return (
    <div className="rounded-2xl border border-gold/30 bg-gradient-to-br from-cream-soft to-paper p-6 relative overflow-hidden flex justify-center">
      <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-gold opacity-[0.06] -translate-y-12 translate-x-12 pointer-events-none" />

      <div className="relative w-full text-left">
        <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-2">
          Free service · No obligation
        </div>

        <h3 className="font-serif text-xl font-medium text-ink mb-2 leading-snug">
          See what it costs to own an <em className="italic text-forest">EV</em> in your area
        </h3>

        <p className="text-sm text-ink-3 mb-4 leading-relaxed">
          Get personalized estimates for EV pricing, Level 2 home charger installation,
          and available incentives in your zip code.
        </p>

        {formState === "success" ? (
          <div className="flex items-center gap-3 bg-good-bg border border-good-fg/20 rounded-xl px-4 py-3">
            <span className="text-good-fg text-lg">✓</span>
            <span className="text-sm text-good-fg font-medium">
              Got it — we'll send your EV cost and installation options within 24 hours.
            </span>
          </div>
        ) : formState === "submitting" ? (
          <div className="text-sm text-ink-3">Sending your request…</div>
        ) : (
          <>
            {/* Intent toggles */}
            <div className="mb-4">
              <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-2">
                I'm looking to:{" "}
                {intent.length === 0 && (
                  <span className="text-rust normal-case">select at least one</span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {([
                  { value: "ev"      as Intent, label: "Buy an EV" },
                  { value: "charger" as Intent, label: "Install a home charger" },
                ] as const).map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => toggleIntent(value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      intent.includes(value)
                        ? "bg-forest text-white border-forest"
                        : "bg-paper text-ink-mute border-line hover:border-forest/40"
                    }`}
                  >
                    {intent.includes(value) ? "✓ " : ""}{label}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-2">
              {/* Name + Email */}
              <div className="flex flex-wrap gap-2">
                <input
                  type="text"
                  required
                  placeholder="First name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 min-w-32 border border-line rounded-xl px-3.5 py-2.5 text-sm bg-paper focus:outline-none focus:ring-2 focus:ring-forest"
                />
                <input
                  type="email"
                  required
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 min-w-44 border border-line rounded-xl px-3.5 py-2.5 text-sm bg-paper focus:outline-none focus:ring-2 focus:ring-forest"
                />
              </div>

              {/* Phone + ZIP */}
              <div className="flex flex-wrap gap-2">
                <input
                  type="tel"
                  required
                  placeholder="(555) 123-4567"
                  value={phone}
                  onChange={(e) => setPhone(formatPhoneDisplay(e.target.value))}
                  className="flex-1 min-w-36 border border-line rounded-xl px-3.5 py-2.5 text-sm bg-paper focus:outline-none focus:ring-2 focus:ring-forest"
                />
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={5}
                  pattern="[0-9]{5}"
                  required
                  placeholder="ZIP"
                  value={zip || ""}
                  onChange={(e) => setZip(e.target.value)}
                  className="w-24 border border-line rounded-xl px-3.5 py-2.5 text-sm bg-paper focus:outline-none focus:ring-2 focus:ring-forest"
                />
              </div>

              <button
                type="submit"
                disabled={formState === "submitting" || intent.length === 0}
                className="w-full px-5 py-2.5 rounded-xl text-sm font-semibold bg-forest text-white border border-forest hover:bg-emerald hover:border-emerald transition-all disabled:opacity-60"
              >
                {formState === "submitting" ? "Sending…" : "Get EV cost report"}
              </button>
            </form>

            <p className="text-xs text-ink-4 mt-3">
              Local providers send options within 24 hours. No spam.
            </p>
          </>
        )}

        {formState === "error" && (
          <p className="text-xs text-rust mt-2">
            Something went wrong — please try again.
          </p>
        )}

        <p className="text-[10px] text-ink-mute font-mono mt-3">
          We never sell your email. You may be contacted by up to 3 vetted local providers.{" "}
          <a href="/privacy" className="underline hover:text-forest">
            Privacy policy
          </a>.
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Start dev server and test manually**

```bash
cd web && npm run dev
```

Open http://localhost:3000. Scroll to lead capture form. Check:
- Intent toggle buttons appear, toggle on/off with green highlight
- Submit button disabled when no intent selected
- Name, email, phone, ZIP fields present
- Phone formats live as `(555) 123-4567` while typing
- Form submits and shows green success state
- Check Supabase `leads` table — new row has `name`, `phone`, `intent` populated
- Check your email for owner notification — should include name, phone, intent, networks submitted

- [ ] **Step 3: Commit**

```bash
git add web/components/shared/LeadCaptureBox.tsx
git commit -m "feat: add name, phone, intent fields to lead capture form"
```

---

## Prerequisite: Apply to Networks Now

Network integrations skip gracefully until API keys are set. Apply in parallel with building — approval takes 1–2 weeks.

| Network | URL | Pitch |
|---------|-----|-------|
| Modernize | modernize.com/partners | EV charger installation lead publisher, US traffic |
| AutoWeb | autobytel.com/affiliates | EV purchase-intent lead publisher |
| EverQuote | everquote.com/publishers | Auto insurance lead publisher |

When approved, add to production env vars:
```
MODERNIZE_API_KEY=<key>
MODERNIZE_ENDPOINT=<endpoint from approval docs>
AUTOWEB_API_KEY=<key>
AUTOWEB_ENDPOINT=<endpoint from approval docs>
EVERQUOTE_API_KEY=<key>
EVERQUOTE_ENDPOINT=<endpoint from approval docs>
```

Integrations go live automatically — no code change needed.
