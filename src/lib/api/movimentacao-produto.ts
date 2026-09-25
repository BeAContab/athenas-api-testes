import { apiFetch } from "@/lib/api/client";
import type { DataMode } from "@/lib/types/auth";
import type {
  MovimentacaoProduto,
  MovimentacaoProdutoInput,
  MovimentacaoRef,
} from "@/lib/types/movimentacao-produto";
import * as mock from "@/lib/mocks/movimentacao-produto";

export function getMovimentacao(mode: DataMode, ref: MovimentacaoRef) {
  return apiFetch<MovimentacaoProduto>(
    mode,
    `ws/movimentacao-produtos/${ref.idmaster}/${ref.id}`,
    undefined,
    () => mock.getMovimentacao(ref)
  );
}

export function createMovimentacao(mode: DataMode, payload: MovimentacaoProdutoInput) {
  return apiFetch<MovimentacaoProduto>(
    mode,
    "ws/movimentacao-produtos",
    { method: "POST", body: JSON.stringify(payload) },
    () => mock.createMovimentacao(payload)
  );
}
