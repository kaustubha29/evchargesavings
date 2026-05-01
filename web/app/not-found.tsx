import Link from "next/link";
import type { Metadata } from "next";
import { SavingsSlot } from "@/components/shared/SavingsSlot";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main className="min-h-screen bg-paper flex items-center px-6 py-14">
      <div className="section-wrap grid lg:grid-cols-[0.85fr_1fr] gap-10 items-center">
        <div className="max-w-md">
          <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-4">404</div>
          <h1 className="font-serif text-4xl font-medium tracking-tight text-ink mb-3">
            Page not found
          </h1>
          <p className="text-ink-3 leading-relaxed mb-8">
            This page doesn&apos;t exist — or was moved. The savings examples are still rolling, though.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-forest text-white border border-forest transition-all hover:bg-emerald-bright hover:border-emerald-bright"
          >
            Back to calculator
          </Link>
        </div>
        <SavingsSlot />
      </div>
    </main>
  );
}
