import { apiFetch } from "@/lib/api/client";
import type { DataMode } from "@/lib/types/auth";
import type {
  PedidoVenda,
  PedidoVendaHeaderInput,
  PedidoVendaItem,
  PedidoVendaItemInput,
} from "@/lib/types/pedido-venda";
import * as mock from "@/lib/mocks/pedido-venda";

// A API real não expõe um endpoint de listagem geral de pedidos de venda
// (apenas GET por idmaster) — listPedidosMock só existe para o modo
// Protótipo; no modo Real a tela usa busca por IDMASTER.
export function listPedidosMock() {
  return mock.listPedidos();
}

export function getPedido(mode: DataMode, idmaster: number) {
  return apiFetch<PedidoVenda>(mode, `ws/pedido-venda/${idmaster}`, undefined, () =>
    mock.getPedido(idmaster)
  );
}

export function deletePedido(mode: DataMode, idmaster: number) {
  return apiFetch<unknown>(
    mode,
    `ws/pedido-venda/${idmaster}`,
    { method: "DELETE" },
    () => mock.deletePedido(idmaster)
  );
}

export function finalizarPedido(mode: DataMode, idmaster: number) {
  return apiFetch<unknown>(
    mode,
    `ws/pedido-venda/finalizar/${idmaster}`,
    { method: "PUT" },
    () => mock.finalizarPedido(idmaster)
  );
}

export function createPedido(mode: DataMode, payload: PedidoVendaHeaderInput) {
  return apiFetch<PedidoVenda>(
    mode,
    "ws/pedido-venda",
    { method: "POST", body: JSON.stringify(payload) },
    () => mock.createPedido(payload)
  );
}

// Diferente do Financeiro (que tem add-financeiro-completo), a API de
// Pedido de Venda só documenta a inserção de item avulsa — por isso a
// criação de um pedido novo precisa de uma chamada de cabeçalho seguida de
// uma chamada por item.
export function createPedidoItem(
  mode: DataMode,
  idmaster: number,
  payload: PedidoVendaItemInput
) {
  return apiFetch<PedidoVendaItem>(
    mode,
    "ws/pedido-venda/detalhe",
    { method: "POST", body: JSON.stringify({ idmaster, ...payload }) },
    () => mock.createPedidoItem(idmaster, payload)
  );
}
