"use client";
import { useEffect, useRef } from "react";

export function ArticleScrollTracker({ slug }: { slug: string }) {
  const fired = useRef(new Set<number>());

  useEffect(() => {
    function handler() {
      const el = document.documentElement;
      const scrollable = el.scrollHeight - el.clientHeight;
      if (scrollable <= 0) return;
      const pct = Math.round((window.scrollY / scrollable) * 100);
      for (const threshold of [25, 50, 75, 100]) {
        if (pct >= threshold && !fired.current.has(threshold)) {
          fired.current.add(threshold);
          if (typeof (window as any).gtag === "function") {
            (window as any).gtag("event", "article_scroll_depth", { slug, depth: threshold });
          }
        }
      }
    }
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [slug]);

  return null;
}
