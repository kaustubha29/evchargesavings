import { SavingsSlot } from "@/components/shared/SavingsSlot";

interface Props {
  eyebrow?: string;
  title?: string;
  body?: string;
  className?: string;
}

export function SavingsSlotBand({
  eyebrow = "Live examples",
  title = "Real EV savings, rolling by",
  body = "See how model, location, and local rates change the yearly savings picture.",
  className = "",
}: Props) {
  return (
    <section className={`bg-cream-soft border-y border-line py-10 ${className}`}>
      <div className="section-wrap grid lg:grid-cols-[0.9fr_1.1fr] gap-8 items-center">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-widest text-ink-mute mb-3">
            {eyebrow}
          </div>
          <h2 className="font-serif text-2xl md:text-3xl font-medium tracking-tight text-ink mb-3">
            {title}
          </h2>
          <p className="text-sm text-ink-3 leading-relaxed max-w-md">
            {body}
          </p>
        </div>
        <SavingsSlot />
      </div>
    </section>
  );
}
