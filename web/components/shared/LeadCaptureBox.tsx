"use client";

import { useState } from "react";
import { useCalculatorStore } from "@/store/calculator";

export const LEAD_FORM_SUBMITTED_KEY = "ecs-lead-submitted";

type State = "idle" | "submitting" | "success" | "error";

interface Props {
  sourcePage?: string;
  gateId?: string;
}

export function LeadCaptureBox({ sourcePage = "/", gateId }: Props) {
  const { zip, setZip } = useCalculatorStore();
  const [email, setEmail] = useState("");
  const [formState, setFormState] = useState<State>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormState("submitting");

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, zip, sourcePage }),
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
    // ✅ Card stays centered, but NOT the content
    <div className="rounded-2xl border border-gold/30 bg-gradient-to-br from-cream-soft to-paper p-6 relative overflow-hidden flex justify-center">

      <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-gold opacity-[0.06] -translate-y-12 translate-x-12 pointer-events-none" />

      {/* ✅ IMPORTANT FIX: full width content, no max-width constraint */}
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

        <div className="flex flex-wrap gap-2 text-xs font-medium mb-3">
          <span className="px-2 py-1 rounded-full bg-forest/10 text-forest">
            EV pricing
          </span>
          <span className="px-2 py-1 rounded-full bg-gold/10 text-gold">
            Install cost
          </span>
          <span className="px-2 py-1 rounded-full bg-ink/5 text-ink">
            Local incentives
          </span>
        </div>

        {formState === "success" ? (
          <div className="flex items-center gap-3 bg-good-bg border border-good-fg/20 rounded-xl px-4 py-3">
            <span className="text-good-fg text-lg">✓</span>
            <span className="text-sm text-good-fg font-medium">
              Got it — we’ll send your EV cost and installation options within 24 hours.
            </span>
          </div>
        ) : formState === "submitting" ? (
          <div className="text-sm text-ink-3">Sending your request…</div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="flex flex-wrap gap-2">
              <input
                type="email"
                required
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 min-w-44 border border-line rounded-xl px-3.5 py-2.5 text-sm bg-paper focus:outline-none focus:ring-2 focus:ring-forest"
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

              <button
                type="submit"
                disabled={(formState as string) === "submitting"}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-forest text-white border border-forest hover:bg-emerald hover:border-emerald transition-all disabled:opacity-60"
              >
                {(formState as string) === "submitting" ? "Sending…" : "Get EV cost report"}
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
