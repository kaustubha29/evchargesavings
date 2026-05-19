"use client";
import { useState, useRef, useEffect, useMemo } from "react";

export interface ComboOption {
  value: string;
  label: string;
  group?: string;
}

interface Props {
  options: ComboOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
}

type DisplayItem =
  | { type: "group"; label: string }
  | { type: "option"; option: ComboOption; optionIndex: number };

export function VehicleCombobox({ options, value, onChange, placeholder, id }: Props) {
  const listboxId = id ? `${id}-listbox` : "vehicle-listbox";
  const selectedLabel = options.find((o) => o.value === value)?.label ?? "";
  const [inputValue, setInputValue] = useState(selectedLabel);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Sync display label when external value changes (e.g. default prop)
  useEffect(() => {
    if (!open) {
      const label = options.find((o) => o.value === value)?.label ?? "";
      setInputValue(label);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, options]);

  const query = open ? inputValue.trim().toLowerCase() : "";

  const filtered = useMemo(
    () => (query ? options.filter((o) => o.label.toLowerCase().includes(query)) : options),
    [options, query]
  );

  const displayItems: DisplayItem[] = useMemo(() => {
    if (query) {
      // Flat list when filtering
      return filtered.map((o, i) => ({ type: "option" as const, option: o, optionIndex: i }));
    }
    // Grouped list when showing all
    const groups = new Map<string, ComboOption[]>();
    for (const o of filtered) {
      const g = o.group ?? "Other";
      if (!groups.has(g)) groups.set(g, []);
      groups.get(g)!.push(o);
    }
    const items: DisplayItem[] = [];
    let idx = 0;
    for (const [g, opts] of groups) {
      items.push({ type: "group", label: g });
      for (const opt of opts) {
        items.push({ type: "option", option: opt, optionIndex: idx++ });
      }
    }
    return items;
  }, [filtered, query]);

  const selectableCount = displayItems.filter((d) => d.type === "option").length;

  function selectOption(option: ComboOption) {
    onChange(option.value);
    setInputValue(option.label);
    setOpen(false);
    setActiveIndex(-1);
  }

  function resetInput() {
    setOpen(false);
    setActiveIndex(-1);
    setInputValue(options.find((o) => o.value === value)?.label ?? "");
  }

  function handleFocus() {
    setInputValue("");
    setOpen(true);
    setActiveIndex(-1);
  }

  function handleClick() {
    if (open) return;
    setInputValue("");
    setOpen(true);
    setActiveIndex(-1);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value);
    setOpen(true);
    setActiveIndex(-1);
  }

  function handleBlur(e: React.FocusEvent) {
    if (containerRef.current?.contains(e.relatedTarget as Node)) return;
    resetInput();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setOpen(true);
        setInputValue("");
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (selectableCount === 0) return;
      setActiveIndex((i) => Math.min(i + 1, selectableCount - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const active = displayItems.find(
        (d): d is Extract<DisplayItem, { type: "option" }> =>
          d.type === "option" && d.optionIndex === activeIndex
      );
      if (active) selectOption(active.option);
    } else if (e.key === "Escape") {
      resetInput();
    }
  }

  // Scroll active option into view
  useEffect(() => {
    if (activeIndex < 0 || !listRef.current) return;
    const el = listRef.current.querySelector<HTMLElement>(`[data-opt-idx="${activeIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          aria-controls={listboxId}
          autoComplete="off"
          value={inputValue}
          placeholder={open ? "Type to search…" : (placeholder ?? "")}
          onChange={handleChange}
          onFocus={handleFocus}
          onClick={handleClick}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full border border-line rounded-xl px-4 py-3 pr-9 text-sm bg-paper font-sans focus:outline-none focus:ring-2 focus:ring-emerald"
        />
        <span
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-ink-mute transition-transform duration-150"
          style={{ transform: `translateY(-50%) rotate(${open ? 180 : 0}deg)` }}
        >
          <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </span>
      </div>

      {open && (
        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          className="absolute z-50 mt-1 w-full bg-paper border border-line rounded-xl shadow-lg max-h-72 overflow-y-auto py-1 text-sm"
        >
          {displayItems.length === 0 && (
            <li className="px-4 py-3 text-ink-mute font-mono text-xs">No matches found</li>
          )}
          {displayItems.map((item, i) => {
            if (item.type === "group") {
              return (
                <li
                  key={`g-${item.label}-${i}`}
                  className="px-4 py-1.5 font-mono text-[10px] uppercase tracking-widest text-ink-mute bg-cream-soft/70 sticky top-0"
                  aria-hidden="true"
                >
                  {item.label}
                </li>
              );
            }
            const isActive = item.optionIndex === activeIndex;
            const isSelected = item.option.value === value;
            return (
              <li
                key={item.option.value}
                role="option"
                aria-selected={isSelected}
                data-opt-idx={item.optionIndex}
                onMouseDown={(e) => { e.preventDefault(); selectOption(item.option); }}
                onMouseEnter={() => setActiveIndex(item.optionIndex)}
                className={[
                  "px-4 py-2 cursor-pointer transition-colors duration-75",
                  isActive ? "bg-emerald/10 text-forest" : "hover:bg-line/30",
                  isSelected ? "font-medium" : "",
                ].join(" ")}
              >
                {item.option.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
