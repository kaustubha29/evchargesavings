import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { stateFromZip, getStateData } from "@/features/location/queries";

const OWNER_EMAIL = "hello@evchargesavings.com";
const FROM_EMAIL  = "EV Charge Savings <noreply@evchargesavings.com>";

export async function POST(req: NextRequest) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const resendKey   = process.env.RESEND_API_KEY;

  // Diagnostic: log URL shape without exposing full value
  console.log("[lead] SUPABASE_URL prefix:", supabaseUrl?.slice(0, 35));
  console.log("[lead] KEY prefix:", supabaseKey?.slice(0, 10));

  if (!supabaseUrl || !supabaseKey) {
    console.error("[lead] Missing Supabase env vars");
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
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

  const stateCode = zip ? stateFromZip(zip) : null;
  const stateName = stateCode ? getStateData(stateCode).name : null;

  // Supabase write — non-blocking, never fails the request
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { error } = await supabase.from("leads").insert(
      { email, zip: zip || null, state_code: stateCode, source_page: sourcePage },
    );
    if (error && error.code !== "23505") {
      // 23505 = unique_violation (duplicate email) — silently ignore
      console.error("[lead] Supabase write failed:", error);
    } else {
      console.log("[lead] Supabase write OK");
    }
  } catch (e) {
    console.error("[lead] Supabase exception:", e);
  }

  // Resend emails — also non-blocking
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
  } else {
    console.error("[lead] Missing RESEND_API_KEY");
  }

  // Always return success — user gets confirmation, we get the email
  return NextResponse.json({ ok: true });
}
