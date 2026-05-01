"use client";

import { useRouter } from "next/navigation";
import { getAllStates } from "@/features/location/queries";

interface Props {
  currentStateSlug: string;
}

export function StateSelector({ currentStateSlug }: Props) {
  const router = useRouter();
  const states = getAllStates();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSlug = e.target.value;
    if (newSlug !== currentStateSlug) {
      router.push(`/ev-cost/${newSlug}`);
    }
  };

  return (
    <label className="inline-flex items-center gap-2">
      <span className="font-mono text-[11px] uppercase tracking-widest text-ink-mute">Select state:</span>
      <select
        value={currentStateSlug}
        onChange={handleChange}
        className="border border-line rounded-lg px-3.5 py-2 text-sm bg-paper font-sans appearance-none focus:outline-none focus:ring-2 focus:ring-forest cursor-pointer hover:border-forest/30 transition-colors"
      >
        {states.map((s) => (
          <option key={s.code} value={s.slug}>
            {s.name}
          </option>
        ))}
      </select>
    </label>
  );
}
