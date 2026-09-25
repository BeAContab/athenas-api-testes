"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, FlaskConical, Info, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";

  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [sub, setSub] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEnteringPrototype, setIsEnteringPrototype] = useState(false);

  const login = async (payload: Record<string, unknown>) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      toast.error(data.error ?? "Não foi possível entrar.");
      return false;
    }
    router.push(next);
    router.refresh();
    return true;
  };

  const handleRealLogin = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await login({ mode: "real", usuario, senha, sub });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrototypeLogin = async () => {
    setIsEnteringPrototype(true);
    try {
      await login({ mode: "mock" });
    } finally {
      setIsEnteringPrototype(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <form className="flex flex-col gap-4" onSubmit={handleRealLogin}>
        <div className="flex flex-col gap-2">
          <Label htmlFor="sub">Ambiente (sub)</Label>
          <Input
            id="sub"
            value={sub}
            onChange={(e) => setSub(e.target.value)}
            placeholder="Ex.: localhost"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="usuario">Usuário</Label>
          <div className="relative">
            <User className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
            <Input
              id="usuario"
              autoComplete="username"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="Digite seu usuário"
              className="pl-8"
              required
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="senha">Senha</Label>
          <div className="relative">
            <Lock className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
            <Input
              id="senha"
              type="password"
              autoComplete="current-password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              className="pl-8"
              required
            />
          </div>
        </div>
        <Button type="submit" disabled={isSubmitting} className="mt-1 w-full">
          {isSubmitting ? "Entrando..." : "Entrar (modo Real)"}
          <ArrowRight />
        </Button>
      </form>

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-muted-foreground text-xs">ou</span>
        <Separator className="flex-1" />
      </div>

      <div className="flex flex-col gap-4">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          disabled={isEnteringPrototype}
          onClick={handlePrototypeLogin}
        >
          <FlaskConical />
          {isEnteringPrototype ? "Entrando..." : "Continuar em modo Protótipo"}
        </Button>
        <p className="text-muted-foreground flex items-start gap-1.5 text-center text-xs">
          <Info className="mt-0.5 size-3.5 shrink-0" />
          O modo Protótipo utiliza dados simulados para demonstração de
          funcionalidades.
        </p>
      </div>
    </div>
  );
}
