"use client";
import { useState } from "react";

type State = "idle" | "submitting" | "success" | "error";

interface Props {
  sourcePage?: string;
}

export function LeadCaptureBox({ sourcePage = "/" }: Props) {
  const [email, setEmail] = useState("");
  const [zip, setZip] = useState("");
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
      setFormState("success");
    } catch {
      setFormState("error");
    }
  }

  return (
    <div className="rounded-2xl border border-gold/30 bg-gradient-to-br from-cream-soft to-paper p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-gold opacity-[0.06] -translate-y-12 translate-x-12 pointer-events-none" />

      <div className="relative">
        <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-2">Free service · No obligation</div>
        <h3 className="font-serif text-xl font-medium text-ink mb-1">
          Get <em className="italic text-forest">three</em> Level 2 installer quotes in your zip
        </h3>
        <p className="text-sm text-ink-3 mb-4 max-w-md">
          Vetted, licensed installers across all 50 states. Drop your email and zip — they&apos;ll reach out within 24 hours.
        </p>

        {formState === "success" ? (
          <div className="flex items-center gap-3 bg-good-bg border border-good-fg/20 rounded-xl px-4 py-3">
            <span className="text-good-fg text-lg">✓</span>
            <span className="text-sm text-good-fg font-medium">Got it — we&apos;ll match you with installers in your area within 24 hours.</span>
          </div>
        ) : (
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
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              className="w-24 border border-line rounded-xl px-3.5 py-2.5 text-sm bg-paper focus:outline-none focus:ring-2 focus:ring-forest"
            />
            <button
              type="submit"
              disabled={formState === "submitting"}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-forest text-white border border-forest hover:bg-emerald hover:border-emerald transition-all disabled:opacity-60"
            >
              {formState === "submitting" ? "Sending…" : "Get quotes"}
            </button>
          </form>
        )}

        {formState === "error" && (
          <p className="text-xs text-rust mt-2">Something went wrong — try again or email us directly.</p>
        )}

        <p className="text-[10px] text-ink-mute font-mono mt-3">
          We never sell your email. By submitting you agree to be contacted by up to 3 vetted installers.{" "}
          <a href="/privacy" className="underline hover:text-forest">Privacy policy</a>.
        </p>
      </div>
    </div>
  );
}
