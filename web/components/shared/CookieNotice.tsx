"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "cookie-notice-dismissed";

export function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--line)] bg-[var(--cream)] px-4 py-3 shadow-lg sm:flex sm:items-center sm:justify-between sm:gap-6">
      <p className="text-[13px] text-[var(--ink-3)] leading-relaxed">
        This site uses cookies for analytics (Google Analytics, Microsoft Clarity) and ads.{" "}
        <a href="/privacy" className="underline text-[var(--forest)] hover:text-[var(--emerald)] transition-colors">
          Learn more
        </a>
        .
      </p>
      <button
        onClick={dismiss}
        className="mt-2 sm:mt-0 shrink-0 rounded-lg border border-[var(--line)] bg-[var(--paper)] px-4 py-1.5 text-[13px] font-medium text-[var(--ink-2)] hover:bg-[var(--cream-soft)] transition-colors"
      >
        Got it
      </button>
    </div>
  );
}
