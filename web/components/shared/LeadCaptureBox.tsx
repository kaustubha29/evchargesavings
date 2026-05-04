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
  defaultIntent?: Intent[];
  heading?: string;
  description?: string;
  submitLabel?: string;
  successMessage?: string;
}

export function LeadCaptureBox({
  sourcePage = "/",
  gateId,
  defaultIntent,
  heading = "See what it costs to own an EV in your area",
  description = "Get personalized estimates for EV pricing, Level 2 home charger installation, and available incentives in your zip code.",
  submitLabel = "Get EV cost report",
  successMessage = "Got it — we'll send your EV cost and installation options within 24 hours.",
}: Props) {
  const { zip, setZip } = useCalculatorStore();
  const [name, setName]           = useState("");
  const [email, setEmail]         = useState("");
  const [phone, setPhone]         = useState("");
  const [intent, setIntent]       = useState<Intent[]>(defaultIntent ?? []);
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
          {heading}
        </h3>

        <p className="text-sm text-ink-3 mb-4 leading-relaxed">
          {description}
        </p>

        {formState === "success" ? (
          <div className="flex items-center gap-3 bg-good-bg border border-good-fg/20 rounded-xl px-4 py-3">
            <span className="text-good-fg text-lg">✓</span>
            <span className="text-sm text-good-fg font-medium">
              {successMessage}
            </span>
          </div>
        ) : formState === "submitting" ? (
          <div className="text-sm text-ink-3">Sending your request…</div>
        ) : formState === "error" ? (
          <div className="space-y-3">
            <p className="text-sm text-rust">Something went wrong — please try again.</p>
            <button
              type="button"
              onClick={() => setFormState("idle")}
              className="font-mono text-[11px] uppercase tracking-widest text-forest hover:underline"
            >
              ← Try again
            </button>
          </div>
        ) : (
          <>
            {/* Intent toggles */}
            <div className="mb-4">
              <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-2">
                I&apos;m looking to:{" "}
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
                disabled={(formState as State) === "submitting" || intent.length === 0}
                className="w-full px-5 py-2.5 rounded-xl text-sm font-semibold bg-forest text-white border border-forest hover:bg-emerald hover:border-emerald transition-all disabled:opacity-60"
              >
                {(formState as State) === "submitting" ? "Sending…" : submitLabel}
              </button>
            </form>

            <p className="text-xs text-ink-4 mt-3">
              Local providers send options within 24 hours. No spam.
            </p>
          </>
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
