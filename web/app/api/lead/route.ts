import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { stateFromZip, getStateData } from "@/features/location/queries";

const OWNER_EMAIL = "hello@evchargesavings.com";
const FROM_EMAIL  = "EV Charge Savings <noreply@evchargesavings.com>";

export async function POST(req: NextRequest) {
  // Guard: fail loudly in logs if env vars are missing
  const supabaseUrl  = process.env.SUPABASE_URL;
  const supabaseKey  = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const resendKey    = process.env.RESEND_API_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("[lead] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }
  if (!resendKey) {
    console.error("[lead] Missing RESEND_API_KEY");
    // Don't block lead capture if only email is misconfigured
  }

  // Parse + validate
  let email: string, zip: string, sourcePage: string;
  try {
    const body = await req.json();
    email      = (body.email      ?? "").trim().toLowerCase();
    zip        = (body.zip        ?? "").trim();
    sourcePage = (body.sourcePage ?? "/").trim();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 422 });
  }
  if (zip && !/^\d{5}$/.test(zip)) {
    return NextResponse.json({ error: "Invalid ZIP" }, { status: 422 });
  }

  // Resolve zip → state
  const stateCode = zip ? stateFromZip(zip) : null;
  const stateName = stateCode ? getStateData(stateCode).name : null;

  // Init clients here — avoids module-load crash if env vars were missing
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Deduplicate: same email within 7 days → silently succeed
  const { data: existing, error: dupError } = await supabase
    .from("leads")
    .select("id")
    .eq("email", email)
    .gte("created_at", new Date(Date.now() - 7 * 86400_000).toISOString())
    .maybeSingle();

  if (dupError) {
    console.error("[lead] Dedup query failed:", dupError);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  if (existing) {
    return NextResponse.json({ ok: true });
  }

  // Insert
  const { error: insertError } = await supabase.from("leads").insert({
    email,
    zip:         zip || null,
    state_code:  stateCode,
    source_page: sourcePage,
  });

  if (insertError) {
    console.error("[lead] Insert failed:", insertError);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  // Send emails — fire-and-forget, never block the 200
  if (resendKey) {
    const resend = new Resend(resendKey);
    Promise.allSettled([
      resend.emails.send({
        from: FROM_EMAIL,
        to:   email,
        subject: "We're matching you with EV charger installers",
        html: `
          <p>Hi,</p>
          <p>Thanks — we're matching you with vetted, licensed electricians${stateName ? ` in <b>${stateName}</b>` : ""} who install Level 2 EV chargers.</p>
          <p>You'll hear from up to 3 installers within 24 hours with no-obligation quotes.</p>
          <p>— EV Charge Savings</p>
          <p style="font-size:11px;color:#999">Submitted at evchargesavings.com. We never sell your email.</p>
        `,
      }),
      resend.emails.send({
        from: FROM_EMAIL,
        to:   OWNER_EMAIL,
        subject: `New lead${stateName ? ` · ${stateName}` : ""}${zip ? ` · ${zip}` : ""}`,
        html: `
          <b>New installer lead</b><br/>
          Email: ${email}<br/>
          ZIP: ${zip || "—"}<br/>
          State: ${stateName ?? stateCode ?? "—"}<br/>
          Source: ${sourcePage}
        `,
      }),
    ]).then((results) => {
      results.forEach((r) => {
        if (r.status === "rejected") console.error("[lead] Email error:", r.reason);
      });
    });
  }

  return NextResponse.json({ ok: true });
}
