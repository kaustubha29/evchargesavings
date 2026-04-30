import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main className="min-h-screen bg-paper flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-4">404</div>
        <h1 className="font-serif text-4xl font-medium tracking-tight text-ink mb-3">
          Page not found
        </h1>
        <p className="text-ink-3 leading-relaxed mb-8">
          This page doesn&apos;t exist — or was moved. Try searching for your state or EV model from the homepage.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-forest text-white border border-forest transition-all hover:bg-emerald-bright hover:border-emerald-bright"
        >
          Back to calculator
        </Link>
      </div>
    </main>
  );
}
