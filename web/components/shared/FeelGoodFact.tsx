"use client";
import { useEffect, useState } from "react";
import { FACTS } from "@/features/content/facts";

interface Props {
  savings: number;
  co2Lbs: number;
  gasAnnual: number;
  evAnnual: number;
}

export function FeelGoodFact({ savings, co2Lbs, gasAnnual, evAnnual }: Props) {
  const [idx, setIdx] = useState(0);

  // Rotate fact on every meaningful change to savings
  useEffect(() => {
    setIdx((i) => (i + 1) % FACTS.length);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Math.round(savings / 10)]);

  if (savings <= 0) return null;

  const fact = FACTS[idx];
  const html = fact.render(savings, co2Lbs, gasAnnual, evAnnual);

  return (
    <div className="feel-good-bar flex items-start gap-2">
      <span className="text-base leading-snug">{fact.icon}</span>
      <span dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
