"use client";
import { useEffect, useState } from "react";
import { useOwnerStore } from "@/store/owner";

interface NHTSARecall {
  NHTSACampaignNumber: string;
  Component: string;
  Summary: string;
  Consequence: string;
  Remedy: string;
  ReportReceivedDate: string;
}

function toNHTSAModel(model: string): string {
  return model
    .replace(/\s+(Long Range|Standard Range|Performance|RWD|AWD|Dual Motor|Plaid|Cyberbeast|Wind RWD|Wind|GT-Line|GT|Standard|SV Plus|SV|Plus|\bN\b).*/i, "")
    .trim();
}

function parseDate(d: string): string {
  const m = d.match(/\/Date\((\d+)\)\//);
  if (!m) return "";
  return new Date(Number(m[1])).toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
}

export function RecallsSection() {
  const { brand, year, model } = useOwnerStore();
  const [recalls, setRecalls] = useState<NHTSARecall[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!brand || !year || !model) { setRecalls([]); return; }
    const nhtsaModel = toNHTSAModel(model);
    setLoading(true);
    setError(false);
    fetch(
      `/api/recalls?make=${encodeURIComponent(brand)}&model=${encodeURIComponent(nhtsaModel)}&year=${year}`
    )
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { setError(true); setLoading(false); return; }
        setRecalls(data.results ?? []);
        setLoading(false);
      })
      .catch(() => { setError(true); setLoading(false); });
  }, [brand, year, model]);

  if (!brand || !year || !model) return null;

  const hasRecalls = !loading && !error && recalls.length > 0;

  return (
    <section className={`border-b border-line ${hasRecalls ? "py-8 bg-rust/[0.025]" : "py-6 bg-cream-soft/60"}`}>
      <div className="section-wrap">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute">Safety recalls</div>
            {!loading && !error && (
              <span className={`font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full ${
                recalls.length === 0
                  ? "bg-good-bg text-good-fg"
                  : "bg-rust/10 text-rust"
              }`}>
                {recalls.length === 0 ? "None found" : `${recalls.length} open`}
              </span>
            )}
          </div>
          <a
            href="https://www.nhtsa.gov/recalls"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 font-mono text-[11px] text-forest hover:underline"
          >
            NHTSA.gov →
          </a>
        </div>

        {hasRecalls && (
          <>
            <h2 className="font-serif text-xl font-medium tracking-tight text-ink mt-4 mb-1">
              NHTSA safety recalls
            </h2>
            <p className="text-sm text-ink-2 mt-1 mb-3">
              <span className="font-medium text-rust">{recalls.length} open {recalls.length === 1 ? "recall" : "recalls"}:</span>{" "}
              {recalls.map((r) => r.Component.split(":")[0].trim()).join(", ")}.{" "}
              Contact your dealer — repairs are always free.
            </p>
          </>
        )}

        {loading && (
          <div className="font-mono text-xs text-ink-mute animate-pulse mt-3">Checking NHTSA database…</div>
        )}

        {error && (
          <p className="text-sm text-ink-mute mt-3">
            Couldn't reach NHTSA right now.{" "}
            <a
              href="https://www.nhtsa.gov/recalls"
              target="_blank"
              rel="noopener noreferrer"
              className="text-forest hover:underline"
            >Check directly at NHTSA.gov →</a>
          </p>
        )}

        {!loading && !error && recalls.length === 0 && (
          <div className="flex items-center gap-3 mt-3">
            <span className="text-good-fg text-sm">✓</span>
            <span className="text-sm text-ink-mute">No open recalls found · <a href="https://www.nhtsa.gov/recalls" target="_blank" rel="noopener noreferrer" className="text-forest hover:underline">Verify at NHTSA.gov</a></span>
          </div>
        )}

        {!loading && !error && recalls.length > 0 && (
          <div className="flex flex-col gap-3 mt-4">
            {recalls.map((r) => (
              <div key={r.NHTSACampaignNumber} className="border border-rust/20 rounded-2xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExpanded(expanded === r.NHTSACampaignNumber ? null : r.NHTSACampaignNumber)}
                  className="w-full text-left flex items-start justify-between gap-4 px-5 py-4 hover:bg-rust/5 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-rust mb-1">
                      {r.NHTSACampaignNumber}{parseDate(r.ReportReceivedDate) ? ` · ${parseDate(r.ReportReceivedDate)}` : ""}
                    </div>
                    <div className="text-sm font-medium text-ink truncate">{r.Component}</div>
                  </div>
                  <span className="shrink-0 text-ink-mute text-xs mt-0.5">{expanded === r.NHTSACampaignNumber ? "▲" : "▼"}</span>
                </button>

                {expanded === r.NHTSACampaignNumber && (
                  <div className="px-5 pb-5 border-t border-rust/10 pt-4 flex flex-col gap-3">
                    {r.Summary && (
                      <div>
                        <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-1">Summary</div>
                        <p className="text-sm text-ink-2 leading-relaxed">{r.Summary}</p>
                      </div>
                    )}
                    {r.Consequence && (
                      <div>
                        <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-1">Consequence</div>
                        <p className="text-sm text-ink-2 leading-relaxed">{r.Consequence}</p>
                      </div>
                    )}
                    {r.Remedy && (
                      <div>
                        <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mb-1">Remedy</div>
                        <p className="text-sm text-ink-2 leading-relaxed">{r.Remedy}</p>
                      </div>
                    )}
                    <a
                      href={`https://www.nhtsa.gov/recalls?nhtsaId=${r.NHTSACampaignNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center font-mono text-[11px] text-forest hover:underline mt-1"
                    >
                      View on NHTSA.gov →
                    </a>
                  </div>
                )}
              </div>
            ))}
            <p className="text-xs text-ink-mute/60 mt-1">Source: NHTSA. Check nhtsa.gov for the most current status.</p>
          </div>
        )}
      </div>
    </section>
  );
}
