import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { stateFromZip, getStateData } from "@/features/location/queries";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const resend = new Resend(process.env.RESEND_API_KEY!);

const OWNER_EMAIL = "hello@evchargesavings.com";
const FROM_EMAIL  = "EV Charge Savings <noreply@evchargesavings.com>";

export async function POST(req: NextRequest) {
  // Parse + basic validation
  let email: string, zip: string, sourcePage: string;
  try {
    const body = await req.json();
    email      = (body.email ?? "").trim().toLowerCase();
    zip        = (body.zip   ?? "").trim();
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

  // Deduplicate: reject same email submitted within 7 days
  const { data: existing } = await supabase
    .from("leads")
    .select("id, created_at")
    .eq("email", email)
    .gte("created_at", new Date(Date.now() - 7 * 86400_000).toISOString())
    .maybeSingle();

  if (existing) {
    // Silently succeed — don't tell the user we already have them
    return NextResponse.json({ ok: true });
  }

  // Insert lead
  const { error: insertError } = await supabase.from("leads").insert({
    email,
    zip:        zip || null,
    state_code: stateCode,
    source_page: sourcePage,
  });

  if (insertError) {
    console.error("Lead insert error:", insertError);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  // Send emails in parallel — don't fail the request if email fails
  await Promise.allSettled([
    // Confirmation to user
    resend.emails.send({
      from: FROM_EMAIL,
      to:   email,
      subject: "We're matching you with EV charger installers",
      html: `
        <p>Hi,</p>
        <p>Thanks for your interest. We're matching you with vetted, licensed electricians${stateName ? ` in <b>${stateName}</b>` : ""} who install Level 2 EV chargers.</p>
        <p>You'll hear from up to 3 installers within 24 hours with no-obligation quotes.</p>
        <p>— EV Charge Savings</p>
        <hr />
        <p style="font-size:11px;color:#999">You submitted this request at evchargesavings.com. We never sell your email.</p>
      `,
    }),

    // Notification to owner
    resend.emails.send({
      from: FROM_EMAIL,
      to:   OWNER_EMAIL,
      subject: `New installer lead${stateName ? ` · ${stateName}` : ""}${zip ? ` · ${zip}` : ""}`,
      html: `
        <p><b>New lead</b></p>
        <ul>
          <li>Email: ${email}</li>
          <li>ZIP: ${zip || "—"}</li>
          <li>State: ${stateName || stateCode || "—"}</li>
          <li>Source: ${sourcePage}</li>
        </ul>
      `,
    }),
  ]);

  return NextResponse.json({ ok: true });
}
