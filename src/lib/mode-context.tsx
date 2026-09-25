"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { toast } from "sonner";
import type { DataMode } from "@/lib/types/auth";

interface ModeContextValue {
  mode: DataMode;
  isChanging: boolean;
  setMode: (mode: DataMode) => Promise<boolean>;
}

const ModeContext = createContext<ModeContextValue | null>(null);

export function ModeProvider({
  initialMode,
  children,
}: {
  initialMode: DataMode;
  children: ReactNode;
}) {
  const [mode, setModeState] = useState<DataMode>(initialMode);
  const [isChanging, setIsChanging] = useState(false);

  const setMode = async (next: DataMode) => {
    if (next === mode) return true;
    setIsChanging(true);
    try {
      const res = await fetch("/api/auth/mode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: next }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error ?? "Não foi possível alterar o modo.");
        return false;
      }
      setModeState(next);
      toast.success(
        next === "real"
          ? "Modo Real ativado — chamadas serão feitas à API Athenas."
          : "Modo Protótipo ativado — usando dados simulados."
      );
      return true;
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <ModeContext.Provider value={{ mode, isChanging, setMode }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error("useMode deve ser usado dentro de um ModeProvider");
  return ctx;
}
