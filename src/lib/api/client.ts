import type { DataMode } from "@/lib/types/auth";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

// Wrapper usado pelos módulos de dados (lib/api/<modulo>.ts) das próximas
// fases: no modo "real" chama o proxy autenticado; no modo "mock" resolve
// a função de fixture equivalente, sem tocar a rede.
export async function apiFetch<T>(
  mode: DataMode,
  path: string,
  init: RequestInit | undefined,
  mock: () => Promise<T> | T
): Promise<T> {
  if (mode === "mock") {
    return mock();
  }

  const res = await fetch(`/api/proxy/${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(
      body.error ?? `Erro ${res.status} ao chamar ${path}`,
      res.status
    );
  }

  return res.json() as Promise<T>;
}
