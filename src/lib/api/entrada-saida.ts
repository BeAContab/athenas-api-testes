import { apiFetch } from "@/lib/api/client";
import type { DataMode } from "@/lib/types/auth";
import type {
  EntradaSaida,
  EntradaSaidaCompletoPayload,
} from "@/lib/types/entrada-saida";
import * as mock from "@/lib/mocks/entrada-saida";

// A API real não expõe uma listagem geral de entradas/saídas (apenas GET
// por idmaster) — listEntradasSaidasMock só existe para o modo Protótipo;
// no modo Real a tela usa busca por IDMASTER.
export function listEntradasSaidasMock() {
  return mock.listEntradasSaidas();
}

export function getEntradaSaida(mode: DataMode, idmaster: number) {
  return apiFetch<EntradaSaida>(
    mode,
    `ws/entrada-saida/${idmaster}`,
    undefined,
    () => mock.getEntradaSaida(idmaster)
  );
}

export function createEntradaSaidaCompleto(
  mode: DataMode,
  payload: EntradaSaidaCompletoPayload
) {
  return apiFetch<EntradaSaida>(
    mode,
    "ws/entrada-saida-completo",
    { method: "POST", body: JSON.stringify(payload) },
    () => mock.createEntradaSaidaCompleto(payload)
  );
}
