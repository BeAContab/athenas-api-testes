import type {
  EntradaSaida,
  EntradaSaidaCompletoPayload,
} from "@/lib/types/entrada-saida";

let entradasSaidasStore: EntradaSaida[] = [
  {
    idmaster: 3001,
    tipo: "entrada",
    codigoPessoa: 220,
    nomePessoa: "Distribuidora Athenas Insumos",
    dataMovimento: "2026-07-01",
    valorTotal: 17000,
    situacao: "concluido",
    produtos: [
      {
        codigoProduto: 310,
        descricaoProduto: "Adubo NPK 20-05-20 (saco 50kg)",
        quantidade: 100,
        valorUnitario: 170,
        valorTotal: 17000,
      },
    ],
  },
  {
    idmaster: 3002,
    tipo: "saida",
    codigoPessoa: 501,
    nomePessoa: "Comercial Rio Verde Ltda",
    dataMovimento: "2026-07-12",
    valorTotal: 5400,
    situacao: "concluido",
    produtos: [
      {
        codigoProduto: 310,
        descricaoProduto: "Adubo NPK 20-05-20 (saco 50kg)",
        quantidade: 30,
        valorUnitario: 180,
        valorTotal: 5400,
      },
    ],
  },
];

let nextIdmaster = 3003;

function delay<T>(value: T, ms = 250): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

export async function listEntradasSaidas() {
  return delay(clone(entradasSaidasStore));
}

export async function getEntradaSaida(idmaster: number) {
  const found = entradasSaidasStore.find((e) => e.idmaster === idmaster);
  if (!found) throw new Error("Registro não encontrado.");
  return delay(clone(found));
}

export async function createEntradaSaidaCompleto(
  payload: EntradaSaidaCompletoPayload
) {
  const idmaster = nextIdmaster++;
  const produtos = (payload.produtos ?? []).map((p) => ({
    ...p,
    valorTotal: p.quantidade * p.valorUnitario,
  }));
  const novo: EntradaSaida = {
    idmaster,
    tipo: payload.tipo,
    codigoPessoa: payload.codigoPessoa,
    nomePessoa: payload.nomePessoa,
    dataMovimento: payload.dataMovimento,
    valorTotal: produtos.reduce((sum, p) => sum + p.valorTotal, 0),
    situacao: "concluido",
    produtos,
  };
  entradasSaidasStore = [novo, ...entradasSaidasStore];
  return delay(clone(novo));
}
