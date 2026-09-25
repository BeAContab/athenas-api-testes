import type {
  MovimentacaoProduto,
  MovimentacaoProdutoInput,
  MovimentacaoRef,
} from "@/lib/types/movimentacao-produto";

let movimentacoesStore: MovimentacaoProduto[] = [
  {
    idmaster: 3001,
    id: 1,
    codigoProduto: 310,
    descricaoProduto: "Adubo NPK 20-05-20 (saco 50kg)",
    tipo: "entrada",
    quantidade: 100,
    data: "2026-07-01",
  },
  {
    idmaster: 3002,
    id: 1,
    codigoProduto: 310,
    descricaoProduto: "Adubo NPK 20-05-20 (saco 50kg)",
    tipo: "saida",
    quantidade: 30,
    data: "2026-07-12",
  },
];

let nextId = 2;

function delay<T>(value: T, ms = 250): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

export async function getMovimentacao(ref: MovimentacaoRef) {
  const found = movimentacoesStore.find(
    (m) => m.idmaster === ref.idmaster && m.id === ref.id
  );
  if (!found) throw new Error("Movimentação não encontrada.");
  return delay(clone(found));
}

export async function createMovimentacao(payload: MovimentacaoProdutoInput) {
  const movimentacao: MovimentacaoProduto = { ...payload, id: nextId++ };
  movimentacoesStore = [...movimentacoesStore, movimentacao];
  return delay(clone(movimentacao));
}
