"use client";

import { cn } from "@/lib/utils";
import { useMode } from "@/lib/mode-context";
import type { DataMode } from "@/lib/types/auth";

const OPTIONS: { value: DataMode; label: string }[] = [
  { value: "real", label: "Real" },
  { value: "mock", label: "Protótipo" },
];

export function ModeToggle() {
  const { mode, isChanging, setMode } = useMode();

  return (
    <div className="bg-muted border-border/60 inline-flex items-center gap-0.5 rounded-full border p-1">
      {OPTIONS.map((option) => {
        const isActive = mode === option.value;
        return (
          <button
            key={option.value}
            type="button"
            disabled={isChanging}
            onClick={() => setMode(option.value)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
              isActive
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
