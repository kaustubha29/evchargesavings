import { STATE_INCENTIVES } from "@/features/location/data/incentives";
import { fmt } from "@/lib/format";

interface Props {
  stateCode: string;
  stateName: string;
}

export function StateIncentives({ stateCode, stateName }: Props) {
  const data = STATE_INCENTIVES[stateCode];
  if (!data) return null;

  return (
    <section className="bg-good-bg/30 border-t border-good-fg/15 py-10">
      <div className="section-wrap">
        <div className="font-mono text-[11px] uppercase tracking-widest text-good-fg/70 mb-2">
          State incentives · {stateName}
        </div>
        <h2 className="font-serif text-2xl font-medium tracking-tight text-ink mb-1">
          {stateName} EV purchase incentives
        </h2>
        <p className="text-sm text-ink-mute mb-6 max-w-xl">
          These stack on top of fuel savings. Verify eligibility and current availability at each program's official site before purchase.
        </p>

        <div className="space-y-4 max-w-2xl">
          {data.programs.map((p) => (
            <div key={p.name} className="bg-paper border border-line rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <div className="font-serif text-lg font-medium text-ink">{p.name}</div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mt-0.5">
                    {p.type === "tax_credit" ? "State tax credit" : p.type === "instant_rebate" ? "Instant rebate at dealer" : "State rebate"}
                    {" · "}
                    {p.bevOnly ? "BEV / FCEV only" : "BEV + PHEV eligible"}
                    {p.incomeOnly && " · Income-qualified only"}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-serif text-2xl font-medium text-good-fg">
                    {p.incomeOnly ? "Up to " : ""}{fmt.money0(p.amountIncomeQualified ?? p.amount)}
                  </div>
                  {p.amountIncomeQualified && !p.incomeOnly && (
                    <div className="font-mono text-[10px] text-ink-mute">
                      {fmt.money0(p.amount)} standard · {fmt.money0(p.amountIncomeQualified)} income-qualified
                    </div>
                  )}
                  {p.msrpCap && (
                    <div className="font-mono text-[10px] text-ink-mute">MSRP cap {fmt.money0(p.msrpCap)}</div>
                  )}
                </div>
              </div>
              <p className="text-xs text-ink-2 leading-relaxed mb-3">{p.notes}</p>
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center font-mono text-[11px] text-forest hover:underline"
              >
                Official program site →
              </a>
              {p.expires && (
                <span className="ml-4 font-mono text-[10px] text-rust">Expires {p.expires}</span>
              )}
            </div>
          ))}

          {data.noSalesTax && (
            <div className="bg-paper border border-line rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-serif text-lg font-medium text-ink">Sales Tax Exemption</div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute mt-0.5">
                    All EVs · No income limit
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-serif text-2xl font-medium text-good-fg">6.625%</div>
                  <div className="font-mono text-[10px] text-ink-mute">state sales tax waived</div>
                </div>
              </div>
              {data.noSalesTaxNote && (
                <p className="text-xs text-ink-2 leading-relaxed mt-2">{data.noSalesTaxNote}</p>
              )}
            </div>
          )}
        </div>

        <p className="text-xs text-ink-mute/60 mt-5 max-w-xl">
          Source: DOE Alternative Fuels Data Center (afdc.energy.gov/laws/state) + official program sites, verified May 2026.
          Program amounts, eligibility, and availability change — confirm before purchasing.
        </p>
      </div>
    </section>
  );
}
