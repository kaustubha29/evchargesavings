"use client";

import { useState } from "react";

interface State { name: string; slug: string }

const EV_OPTIONS = [
  { label: "Any EV (default)", slug: "" },
  { label: "Tesla Model Y LR AWD", slug: "tesla-model-y-long-range-awd" },
  { label: "Hyundai Ioniq 5 LR RWD", slug: "hyundai-ioniq-5-long-range-rwd" },
  { label: "Kia EV6 LR RWD", slug: "kia-ev6-long-range-rwd" },
  { label: "Chevy Equinox EV", slug: "chevrolet-equinox-ev-lt-fwd" },
  { label: "Ford Mustang Mach-E", slug: "ford-mustang-mach-e-standard-rwd" },
  { label: "Rivian R1S", slug: "rivian-r1s-dual-motor" },
  { label: "Kia EV9", slug: "kia-ev9-gt-line-awd" },
];

type Mode = "teaser" | "full";

const MODE_INFO = {
  teaser: {
    label: "Teaser widget",
    tag: "Lightweight — links out to the full tool",
    desc: "Shows a savings estimate with a 'See full breakdown' CTA. Best for blogs and news sites — readers click through to evchargesavings.com for the full calculator.",
    height: 420,
  },
  full: {
    label: "Full calculator",
    tag: "Self-contained tool",
    desc: "Complete EV vs gas calculator embedded directly. Best for utility EV resource pages or dealership sites where you want users to stay on your page.",
    height: 700,
  },
};

export function EmbedDemoClient({ states }: { states: State[] }) {
  const [mode, setMode] = useState<Mode>("teaser");
  const [stateSlug, setStateSlug] = useState("california");
  const [evSlug, setEvSlug] = useState("");

  const params = new URLSearchParams();
  if (stateSlug) params.set("state", stateSlug);
  if (evSlug) params.set("ev", evSlug);
  if (mode === "full") params.set("mode", "full");
  const paramStr = params.toString();
  const embedSrc = `https://www.evchargesavings.com/embed${paramStr ? "?" + paramStr : ""}`;
  const { height } = MODE_INFO[mode];
  const embedCode = `<iframe src="${embedSrc}" width="100%" height="${height}" frameborder="0" style="border-radius:12px;border:1px solid #e5e5e5"></iframe>`;

  return (
    <div className="bg-paper min-h-screen">

      {/* Header */}
      <div className="bg-ink text-cream">
        <div className="section-wrap py-10 max-w-4xl">
          <div className="font-mono text-[10px] uppercase tracking-widest text-emerald mb-4">Partner Demo</div>
          <h1 className="font-serif text-4xl font-medium tracking-tight mb-3" style={{ lineHeight: 1.1 }}>
            Embed the EV Savings Calculator
          </h1>
          <p className="text-cream/70 text-base max-w-xl leading-relaxed">
            Free to embed on any site. Pick the widget type that fits your use case.
          </p>
        </div>
      </div>

      <div className="section-wrap py-10 max-w-4xl">

        {/* Mode toggle */}
        <div className="mb-8">
          <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-4">Widget type</div>
          <div className="grid sm:grid-cols-2 gap-4">
            {(["teaser", "full"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`text-left p-5 rounded-2xl border transition-all ${
                  mode === m
                    ? "border-forest bg-forest/5 ring-1 ring-forest/30"
                    : "border-line bg-paper hover:border-forest/30"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="font-serif text-base font-medium text-ink">{MODE_INFO[m].label}</div>
                  <span className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-ink/5 text-ink-mute">
                    {MODE_INFO[m].tag}
                  </span>
                </div>
                <p className="text-xs text-ink-3 leading-relaxed">{MODE_INFO[m].desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div>
            <label className="font-mono text-[10px] uppercase tracking-widest text-ink-mute block mb-1.5">State</label>
            <select
              value={stateSlug}
              onChange={(e) => setStateSlug(e.target.value)}
              className="border border-line rounded-xl px-3 py-2 text-sm bg-paper text-ink focus:outline-none focus:border-forest"
            >
              {states.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="font-mono text-[10px] uppercase tracking-widest text-ink-mute block mb-1.5">Pre-select EV</label>
            <select
              value={evSlug}
              onChange={(e) => setEvSlug(e.target.value)}
              className="border border-line rounded-xl px-3 py-2 text-sm bg-paper text-ink focus:outline-none focus:border-forest"
            >
              {EV_OPTIONS.map((ev) => <option key={ev.slug} value={ev.slug}>{ev.label}</option>)}
            </select>
          </div>
        </div>

        {/* Mock partner site */}
        <div className="rounded-2xl border border-line overflow-hidden mb-8 shadow-sm">
          <div className="bg-[#f0f0f0] border-b border-[#ddd] px-4 py-2.5 flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            </div>
            <div className="flex-1 bg-white rounded-md px-3 py-1 text-xs text-[#999] border border-[#ddd] font-mono">
              yoursite.com/ev-resources
            </div>
          </div>
          <div className="bg-white">
            <div className="border-b border-[#eee] px-8 py-4 flex items-center justify-between">
              <div className="font-semibold text-[#1a1a1a] text-sm">⚡ EV Resources</div>
              <div className="flex gap-6 text-xs text-[#666]">
                <span>Rates</span><span>Rebates</span><span>Charging</span>
              </div>
            </div>
            <div className="px-8 py-6">
              <h2 className="text-xl font-semibold text-[#1a1a1a] mb-1">See your EV savings</h2>
              <p className="text-sm text-[#666] mb-5">Use our free calculator to compare EV fuel costs vs your current gas car.</p>
              <iframe
                key={embedSrc}
                src={embedSrc}
                width="100%"
                height={height}
                frameBorder="0"
                style={{ borderRadius: 12, border: "1px solid #e5e5e5" }}
                title="EV Savings Calculator"
              />
            </div>
          </div>
        </div>

        {/* Embed code */}
        <div className="mb-10">
          <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-3">Your embed code</div>
          <div className="bg-ink rounded-2xl px-5 py-4 overflow-x-auto mb-3">
            <pre className="text-emerald text-xs leading-relaxed whitespace-pre-wrap break-all font-mono">{embedCode}</pre>
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(embedCode)}
            className="font-mono text-[11px] uppercase tracking-widest px-4 py-2 rounded-xl bg-forest text-white hover:bg-emerald transition-colors"
          >
            Copy code
          </button>
        </div>

        {/* Features */}
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          {[
            { title: "Free forever", body: "No API key, no account. Just paste the code." },
            { title: "Live EIA data", body: "Rates update automatically from EIA actuals. Always current." },
            { title: "Pre-load state", body: "Set ?state=california so readers see local rates immediately." },
          ].map((f) => (
            <div key={f.title} className="bg-cream-soft border border-line rounded-2xl p-5">
              <div className="font-serif text-base font-medium text-ink mb-1">{f.title}</div>
              <p className="text-xs text-ink-3 leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-forest/5 border border-forest/25 rounded-2xl p-6">
          <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-2">Ready to embed?</div>
          <p className="text-sm text-ink-3 leading-relaxed mb-4">
            Copy the code above or email us for custom integrations or co-branded versions.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="mailto:media@evchargesavings.com" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-forest text-white border border-forest hover:bg-emerald transition-all">
              Contact us for custom integrations →
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
