import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { stateFromZip, getStateData } from "@/features/location/queries";
import { submitLeadToNetworks, getNetworkDisplayNamesForIntent } from "@/lib/lead-networks";
import type { NetworkResult, IntentKind } from "@/lib/lead-networks";

const OWNER_EMAIL = "evchargesavings@gmail.com";
const FROM_EMAIL  = "EV Charge Savings <noreply@evchargesavings.com>";

function formatPhone(digits: string): string {
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function escHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

export async function POST(req: NextRequest) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const resendKey   = process.env.RESEND_API_KEY;

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
    intent     = Array.isArray(body.intent) ? body.intent.slice(0, 10) : [];
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
  if (!intent.length || !intent.every((i) => ["ev", "charger", "insurance"].includes(i))) {
    return NextResponse.json({ error: "At least one intent required" }, { status: 422 });
  }

  const validIntent = intent as IntentKind[];
  const stateCode = zip ? stateFromZip(zip) : null;
  const stateName = stateCode ? (getStateData(stateCode)?.name ?? null) : null;

  const intentLabel = intent
    .map((i) => i === "ev" ? "Buy an EV" : i === "charger" ? "Install a charger" : "Compare EV insurance")
    .join(" + ");

  const networksSubmitted = getNetworkDisplayNamesForIntent(validIntent).join(", ");

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

  // Resend emails — non-blocking (cityName lookup happens here, not in hot path)
  if (resendKey) {
    const resend = new Resend(resendKey);
    (async () => {
      let cityName: string | null = null;
      if (zip) {
        try {
          const geoRes = await fetch(`https://api.zippopotam.us/us/${zip}`, { signal: AbortSignal.timeout(2000) });
          if (geoRes.ok) {
            const data = await geoRes.json();
            cityName = data.places?.[0]?.["place name"] || null;
          }
        } catch {
          // cityName remains null
        }
      }
      const locationStr = cityName && stateName
        ? `${cityName}, ${stateName}`
        : stateName ?? "";

      await Promise.allSettled([
        resend.emails.send({
          from: FROM_EMAIL,
          to: email,
          subject: "Your personalized EV cost & charger options are on the way",
          html: `
            <p>Hi ${escHtml(name)},</p>
            <p>Thanks for checking out EV ownership costs${locationStr ? ` in <b>${escHtml(locationStr)}</b>` : ""} — we're putting together your personalized breakdown now.</p>
            <p><b>Within the next 24 hours, you'll receive:</b></p>
            <ul>
              <li>⚡ Estimated <b>EV pricing</b> based on your area</li>
              <li>🔌 <b>Level 2 home charger installation costs</b></li>
              <li>💸 Available <b>local incentives and rebates</b></li>
            </ul>
            <p>We'll match you with up to <b>3 vetted local professionals</b>${locationStr ? ` in <b>${escHtml(locationStr)}</b>` : ""} so you can compare quotes — no pressure, no obligation.</p>
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
            Name: ${escHtml(name)}<br/>
            Email: ${escHtml(email)}<br/>
            Phone: ${formatPhone(phone)}<br/>
            ZIP: ${escHtml(zip || "—")}<br/>
            Location: ${escHtml(locationStr || "—")}<br/>
            Intent: ${escHtml(intentLabel)}<br/>
            Source: ${escHtml(sourcePage)}<br/>
            Networks submitted: ${escHtml(networksSubmitted)}
          `,
        }),
      ]).then((results) => {
        results.forEach((r) => {
          if (r.status === "rejected") console.error("[lead] Email error:", r.reason);
        });
      });
    })().catch((err) => console.error("[lead] Email block error:", err));
  } else {
    console.error("[lead] Missing RESEND_API_KEY");
  }

  // Submit to lead networks — non-blocking, log IDs back to Supabase
  submitLeadToNetworks({ name, email, phone, zip, intent: validIntent, stateName })
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
