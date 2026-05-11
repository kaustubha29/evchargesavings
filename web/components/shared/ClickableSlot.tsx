"use client";
import { SavingsSlot } from "./SavingsSlot";

export function ClickableSlot() {
  return (
    <div
      className="cursor-pointer"
      onClick={() => document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" })}
      role="button"
      aria-label="Go to calculator"
    >
      <SavingsSlot />
    </div>
  );
}
