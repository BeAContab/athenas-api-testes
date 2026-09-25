import type {
  PedidoVenda,
  PedidoVendaHeaderInput,
  PedidoVendaItem,
  PedidoVendaItemInput,
} from "@/lib/types/pedido-venda";

// Estado em memória para o modo Protótipo — reinicia a cada recarregamento
// completo da página, já que não existe um backend simulado persistente.
let pedidosStore: PedidoVenda[] = [
  {
    idmaster: 2001,
    codigoPessoa: 501,
    nomePessoa: "Comercial Rio Verde Ltda",
    dataEmissao: "2026-07-10",
    valorTotal: 8400,
    situacao: "aberto",
    itens: [
      {
        idmaster: 2001,
        item: 1,
        codigoProduto: 310,
        descricaoProduto: "Adubo NPK 20-05-20 (saco 50kg)",
        quantidade: 40,
        valorUnitario: 180,
        valorTotal: 7200,
      },
      {
        idmaster: 2001,
        item: 2,
        codigoProduto: 415,
        descricaoProduto: "Semente de soja RR (saco 40kg)",
        quantidade: 4,
        valorUnitario: 300,
        valorTotal: 1200,
      },
    ],
  },
  {
    idmaster: 2002,
    codigoPessoa: 512,
    nomePessoa: "Fazenda Boa Esperança",
    dataEmissao: "2026-07-15",
    valorTotal: 2400,
    situacao: "finalizado",
    itens: [
      {
        idmaster: 2002,
        item: 1,
        codigoProduto: 220,
        descricaoProduto: "Calcário dolomítico (tonelada)",
        quantidade: 8,
        valorUnitario: 300,
        valorTotal: 2400,
      },
    ],
  },
  {
    idmaster: 2003,
    codigoPessoa: 118,
    nomePessoa: "Transportadora Sul Minas",
    dataEmissao: "2026-07-20",
    valorTotal: 950,
    situacao: "aberto",
    itens: [
      {
        idmaster: 2003,
        item: 1,
        codigoProduto: 118,
        descricaoProduto: "Óleo lubrificante (galão 20L)",
        quantidade: 5,
        valorUnitario: 190,
        valorTotal: 950,
      },
    ],
  },
  {
    idmaster: 2004,
    codigoPessoa: 220,
    nomePessoa: "Distribuidora Athenas Insumos",
    dataEmissao: "2026-06-28",
    valorTotal: 5100,
    situacao: "cancelado",
    itens: [
      {
        idmaster: 2004,
        item: 1,
        codigoProduto: 310,
        descricaoProduto: "Adubo NPK 20-05-20 (saco 50kg)",
        quantidade: 28,
        valorUnitario: 182.14,
        valorTotal: 5100,
      },
    ],
  },
];

let nextIdmaster = 2005;

function delay<T>(value: T, ms = 250): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

function recalcTotal(pedido: PedidoVenda) {
  pedido.valorTotal = (pedido.itens ?? []).reduce(
    (sum, item) => sum + (Number(item.valorTotal) || 0),
    0
  );
}

export async function listPedidos() {
  return delay(clone(pedidosStore));
}

export async function getPedido(idmaster: number) {
  const found = pedidosStore.find((p) => p.idmaster === idmaster);
  if (!found) throw new Error("Pedido não encontrado.");
  return delay(clone(found));
}

export async function deletePedido(idmaster: number) {
  pedidosStore = pedidosStore.filter((p) => p.idmaster !== idmaster);
  return delay({ ok: true });
}

export async function createPedido(payload: PedidoVendaHeaderInput) {
  const idmaster = nextIdmaster++;
  const novo: PedidoVenda = {
    idmaster,
    codigoPessoa: payload.codigoPessoa,
    nomePessoa: payload.nomePessoa,
    dataEmissao: payload.dataEmissao,
    valorTotal: 0,
    situacao: "aberto",
    itens: [],
  };
  pedidosStore = [novo, ...pedidosStore];
  return delay(clone(novo));
}

export async function createPedidoItem(
  idmaster: number,
  payload: PedidoVendaItemInput
) {
  const pedido = pedidosStore.find((p) => p.idmaster === idmaster);
  if (!pedido) throw new Error("Pedido não encontrado.");
  const item: PedidoVendaItem = {
    idmaster,
    item: payload.item,
    codigoProduto: payload.codigoProduto,
    descricaoProduto: payload.descricaoProduto,
    quantidade: payload.quantidade,
    valorUnitario: payload.valorUnitario,
    valorTotal: payload.quantidade * payload.valorUnitario,
  };
  pedido.itens = [...(pedido.itens ?? []), item];
  recalcTotal(pedido);
  return delay(clone(item));
}

export async function finalizarPedido(idmaster: number) {
  const pedido = pedidosStore.find((p) => p.idmaster === idmaster);
  if (!pedido) throw new Error("Pedido não encontrado.");
  pedido.situacao = "finalizado";
  return delay(clone(pedido));
}
