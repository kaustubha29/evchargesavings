# Lead Monetization — Design Spec
**Date:** 2026-05-04  
**Status:** Approved

## Problem

Current lead capture collects email + ZIP and stops there. No revenue path after capture. Need to route leads to installer and dealer networks that pay per accepted lead.

## Goal

Automatically submit captured leads to 3 networks based on stated intent. Earn $10–50 per accepted lead. Zero manual work per lead. Works across all 50 US states.

---

## Section 1 — Form Changes

**File:** `web/components/shared/LeadCaptureBox.tsx`

Add 3 new fields:

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `name` | text | yes | non-empty |
| `phone` | text | yes | 10 digits US, strip formatting |
| `intent` | checkbox array | yes (min 1) | `['charger', 'ev']` |

Intent checkboxes:
- "Buy an EV" → value `ev`
- "Install a home charger" → value `charger`

Phone stored as digits only (no dashes/parens). Display formatted `(xxx) xxx-xxxx` while typing.

---

## Section 2 — API Route Changes

**File:** `web/app/api/lead/route.ts`

### Request body additions
```ts
name: string       // required
phone: string      // required, 10 digits
intent: string[]   // required, min 1 of ['ev', 'charger']
```

### Routing logic

```
POST /api/lead
  ↓
1. Validate all fields (existing + new)
2. Write to Supabase (all fields)
3. Send Resend confirmation email to user
4. Send Resend notify email to owner
5. if 'charger' in intent → POST Modernize API (non-blocking)
6. if 'ev' in intent → POST AutoWeb API (non-blocking)
7. always → POST EverQuote API (non-blocking)
8. Log all network responses + lead IDs to Supabase
9. Return 200 to user regardless of network outcomes
```

Network calls are `Promise.allSettled` — user never sees a network rejection. Failures logged only.

### Network integrations

**Modernize.com** (installer leads, ~$15–30/lead)
- Endpoint: TBD pending API key approval
- Payload: name, email, phone, zip, service_type = "ev_charger_installation"
- Triggered: intent includes `charger`

**AutoWeb / Autobytel** (dealer leads, ~$15–50/lead)
- Endpoint: TBD pending API key approval
- Payload: name, email, phone, zip, vehicle_interest = "electric"
- Triggered: intent includes `ev`

**EverQuote** (insurance leads, ~$10–25/lead)
- Endpoint: TBD pending API key approval
- Payload: name, email, phone, zip
- Triggered: always

---

## Section 3 — Supabase Schema

Run these migrations before deploying:

```sql
ALTER TABLE leads ADD COLUMN IF NOT EXISTS name text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS intent text[];
ALTER TABLE leads ADD COLUMN IF NOT EXISTS modernize_id text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS autoweb_id text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS everquote_id text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS network_payouts jsonb;
```

---

## Section 4 — Network Approvals (prerequisite)

Must apply before integration goes live. Build integration with placeholder endpoints in the meantime.

| Network | Apply at | Lead type | Est. payout |
|---------|----------|-----------|-------------|
| Modernize.com | modernize.com/partners | EV charger install | $15–30 |
| AutoWeb | autobytel.com/affiliates | EV dealer leads | $15–50 |
| EverQuote | everquote.com/publishers | Auto insurance | $10–25 |

---

## Section 5 — Owner Notify Email Update

Add to existing owner notification email:
- Name and phone of lead
- Intent selected
- Which networks were submitted to (known at send time)

Network acceptance/rejection responses are async. Log returned lead IDs back to Supabase only (update the leads row in a non-blocking `.then()` after `Promise.allSettled`). No second email — check Supabase dashboard for network outcomes.

---

## Out of Scope

- Accepting payments directly from dealers/installers
- Building a dealer/installer portal
- Manual lead matching
- Lead scoring or quality tiers
- Non-US leads
