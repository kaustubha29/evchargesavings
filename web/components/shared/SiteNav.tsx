"use client";

import { usePathname } from "next/navigation";

export function SiteNav() {
  const pathname = usePathname();
  if (pathname === "/embed") return null;

  return (
    <div className="bg-[#0d2c1f] text-cream font-mono text-[13px] uppercase tracking-[.08em] px-7 py-2.5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1.5 sm:gap-4">
      {/* Row 1: Logo + live rates */}
      <div className="flex justify-between items-center">
        <a href="/" className="text-cream no-underline hover:text-honey transition-colors normal-case whitespace-nowrap font-semibold tracking-wide">
          ⚡ EV Charge Savings
        </a>
        <span className="sm:hidden text-cream/40 normal-case tracking-normal text-[11px]">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald animate-pulse mr-1.5 align-middle" />
          <span className="text-honey/80">Live rates</span>
        </span>
      </div>

      {/* Row 2 (mobile) / inline (desktop): nav */}
      <div className="flex items-center gap-4 sm:gap-6">
        <span className="hidden sm:inline text-cream/40 normal-case tracking-normal">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald animate-pulse mr-2 align-middle" />
          <span className="text-honey/80">Live rates</span>
          {" · "}
          <span className="text-cream/30">EIA data</span>
        </span>
        <nav className="flex gap-4 sm:gap-6 overflow-x-auto whitespace-nowrap" aria-label="Top">
          {[
            { href: "/#calculator", label: "Calculator" },
            { href: "/ev-compare", label: "Compare EVs" },
            { href: "/ev-owner", label: "Own an EV?" },
            { href: "/news", label: "News" },
            { href: "/guides", label: "Guides" },
            { href: "/about", label: "About" },
          ].map((l) => (
            <a key={l.href} href={l.href} className="text-cream/60 no-underline hover:text-cream transition-colors normal-case">
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
