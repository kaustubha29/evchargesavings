import { cn } from "@/lib/cn";

interface Props {
  label: string;
  value: React.ReactNode;
  sub?: string;
  accent?: boolean;
  className?: string;
}

export function StatCard({ label, value, sub, accent, className }: Props) {
  return (
    <div className={cn("stat-card flex flex-col gap-1", accent && "border-emerald-bright ring-1 ring-emerald-bright", className)}>
      <div className="font-mono text-[10px] uppercase tracking-widest text-ink-mute">{label}</div>
      <div className={cn("font-serif text-3xl font-medium tracking-tight leading-none", accent ? "text-forest" : "text-ink")}>
        {value}
      </div>
      {sub && <div className="font-mono text-[11px] text-ink-mute mt-1">{sub}</div>}
    </div>
  );
}
