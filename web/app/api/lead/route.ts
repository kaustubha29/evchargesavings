import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { stateFromZip, getStateData } from "@/features/location/queries";

const OWNER_EMAIL = "evchargesavings@gmail.com";
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

  // Get city name from ZIP
  let cityName: string | null = null;
  if (zip) {
    try {
      const res = await fetch(`https://api.zippopotam.us/us/${zip}`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        const data = await res.json();
        cityName = data.places?.[0]?.['place name'] || null;
      }
    } catch {
      // Ignore errors, cityName remains null
    }
  }

  // Supabase write — insert first; on duplicate email update zip/state instead
  let leadId: string | null = null;
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase.from("leads").insert(
      { email, zip: zip || null, state_code: stateCode, source_page: sourcePage },
    ).select("id").single();
    
    if (error?.code === "23505") {
      // Duplicate email — update location fields with latest submission
      const { data: updated } = await supabase.from("leads")
        .update({ zip: zip || null, state_code: stateCode })
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

  // Resend emails — also non-blocking
  if (resendKey) {
    const resend = new Resend(resendKey);

    Promise.allSettled([
      resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: "Your personalized EV cost & charger options are on the way",
        html: `
          <p>Hi,</p>

          <p>Thanks for checking out EV ownership costs${
            cityName && stateName
              ? ` in <b>${cityName}, ${stateName}</b>`
              : stateName
              ? ` in <b>${stateName}</b>`
              : ""
          } — we’re putting together your personalized breakdown now.</p>

          <p><b>Within the next 24 hours, you’ll receive:</b></p>
          <ul>
            <li>⚡ Estimated <b>EV pricing</b> based on your area</li>
            <li>🔌 <b>Level 2 home charger installation costs</b></li>
            <li>💸 Available <b>local incentives, rebates, and typical insurance costs in your area</b></li>
          </ul>

          <p>Most people are surprised by how much incentives and fuel savings can offset the upfront cost.</p>

          <p>We’ll also match you with up to <b>3 vetted, licensed installers</b>${
            cityName && stateName
              ? ` in <b>${cityName}, ${stateName}</b>`
              : stateName
              ? ` in <b>${stateName}</b>`
              : ""
          } so you can compare quotes — no pressure, no obligation.</p>

          <p>This gives you a clearer picture of the <b>true cost of owning an EV</b> before making any decisions.</p>

          <p>— EV Charge Savings</p>

          <p style="font-size:11px;color:#999">
            Submitted at evchargesavings.com. We never sell your email. You may be contacted by up to 3 vetted local providers.
          </p>
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
          Location: ${cityName ? `${cityName}, ` : ""}${stateName ?? stateCode ?? "—"}<br/>
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
