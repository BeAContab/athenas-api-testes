import type {
  CustoRef,
  Financeiro,
  FinanceiroCompletoPayload,
  FinanceiroCusto,
  FinanceiroParcela,
  ParcelaRef,
} from "@/lib/types/financeiro";

// Estado em memória para o modo Protótipo — reinicia a cada recarregamento
// completo da página, já que não existe um backend simulado persistente.
let financeiroStore: Financeiro[] = [
  {
    idmaster: 1001,
    tipo: "receber",
    codigoPessoa: 501,
    nomePessoa: "Comercial Rio Verde Ltda",
    dataEmissao: "2026-06-02",
    valorTotal: 12500,
    situacao: "aberto",
    parcelas: [
      { idmaster: 1001, parcela: 1, subparcela: 0, valor: 6250, datavencimento: "2026-07-02", situacao: "aberto" },
      { idmaster: 1001, parcela: 2, subparcela: 0, valor: 6250, datavencimento: "2026-08-02", situacao: "aberto" },
    ],
  },
  {
    idmaster: 1002,
    tipo: "pagar",
    codigoPessoa: 220,
    nomePessoa: "Distribuidora Athenas Insumos",
    dataEmissao: "2026-06-10",
    valorTotal: 3800,
    situacao: "aberto",
    parcelas: [
      { idmaster: 1002, parcela: 1, subparcela: 0, valor: 3800, datavencimento: "2026-06-25", situacao: "aberto" },
    ],
  },
  {
    idmaster: 1003,
    tipo: "receber",
    codigoPessoa: 512,
    nomePessoa: "Fazenda Boa Esperança",
    dataEmissao: "2026-05-20",
    valorTotal: 9000,
    situacao: "liquidado",
    parcelas: [
      {
        idmaster: 1003,
        parcela: 1,
        subparcela: 0,
        valor: 9000,
        datavencimento: "2026-06-05",
        datapagamento: "2026-06-04",
        situacao: "liquidado",
      },
    ],
  },
  {
    idmaster: 1004,
    tipo: "pagar",
    codigoPessoa: 118,
    nomePessoa: "Transportadora Sul Minas",
    dataEmissao: "2026-06-15",
    valorTotal: 2150,
    situacao: "aberto",
    parcelas: [
      { idmaster: 1004, parcela: 1, subparcela: 0, valor: 1075, datavencimento: "2026-07-01", situacao: "aberto" },
      { idmaster: 1004, parcela: 2, subparcela: 0, valor: 1075, datavencimento: "2026-07-15", situacao: "aberto" },
    ],
  },
  {
    idmaster: 1005,
    tipo: "receber",
    codigoPessoa: 501,
    nomePessoa: "Comercial Rio Verde Ltda",
    dataEmissao: "2026-06-20",
    valorTotal: 4400,
    situacao: "aberto",
    parcelas: [
      { idmaster: 1005, parcela: 1, subparcela: 0, valor: 4400, datavencimento: "2026-07-20", situacao: "aberto" },
    ],
  },
];

let custosStore: FinanceiroCusto[] = [
  { id: 1, idmaster: 1001, parcela: 1, subparcela: 0, descricao: "Juros de mora", valor: 45.2 },
  { id: 2, idmaster: 1002, parcela: 1, subparcela: 0, descricao: "Tarifa bancária", valor: 12.9 },
  { id: 3, idmaster: 1004, parcela: 1, subparcela: 0, descricao: "Desconto por antecipação", valor: -30 },
];

let nextIdmaster = 1006;
let nextCustoId = 4;

function delay<T>(value: T, ms = 250): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

function findParcela(idmaster: number, parcela: number, subparcela: number) {
  const financeiro = financeiroStore.find((f) => f.idmaster === idmaster);
  const item = financeiro?.parcelas?.find(
    (p) => p.parcela === parcela && p.subparcela === subparcela
  );
  return { financeiro, parcela: item };
}

export async function listFinanceiro() {
  return delay(clone(financeiroStore));
}

export async function getFinanceiro(idmaster: number) {
  const found = financeiroStore.find((f) => f.idmaster === idmaster);
  if (!found) throw new Error("Lançamento não encontrado.");
  return delay(clone(found));
}

export async function deleteFinanceiro(idmaster: number) {
  financeiroStore = financeiroStore.filter((f) => f.idmaster !== idmaster);
  return delay({ ok: true });
}

export async function createFinanceiroCompleto(payload: FinanceiroCompletoPayload) {
  const idmaster = nextIdmaster++;
  const parcelas: FinanceiroParcela[] = (payload.parcelas ?? []).map((p, i) => ({
    ...p,
    idmaster,
    parcela: p.parcela ?? i + 1,
    subparcela: p.subparcela ?? 0,
    situacao: "aberto",
  }));
  const novo: Financeiro = {
    idmaster,
    tipo: payload.tipo,
    codigoPessoa: payload.codigoPessoa,
    nomePessoa: payload.nomePessoa,
    dataEmissao: payload.dataEmissao,
    valorTotal:
      payload.valorTotal ??
      parcelas.reduce((sum, p) => sum + (Number(p.valor) || 0), 0),
    situacao: "aberto",
    parcelas,
  };
  financeiroStore = [novo, ...financeiroStore];
  return delay(clone(novo));
}

export async function getParcela(idmaster: number, parcela: number, subparcela: number) {
  const { parcela: found } = findParcela(idmaster, parcela, subparcela);
  if (!found) throw new Error("Parcela não encontrada.");
  return delay(clone(found));
}

export async function updateParcela(
  idmaster: number,
  parcela: number,
  subparcela: number,
  payload: Partial<FinanceiroParcela>
) {
  const { parcela: found } = findParcela(idmaster, parcela, subparcela);
  if (!found) throw new Error("Parcela não encontrada.");
  Object.assign(found, payload);
  return delay(clone(found));
}

export async function deleteParcela(idmaster: number, parcela: number, subparcela: number) {
  const financeiro = financeiroStore.find((f) => f.idmaster === idmaster);
  if (financeiro?.parcelas) {
    financeiro.parcelas = financeiro.parcelas.filter(
      (p) => !(p.parcela === parcela && p.subparcela === subparcela)
    );
  }
  return delay({ ok: true });
}

export async function createParcela(payload: FinanceiroParcela) {
  const financeiro = financeiroStore.find((f) => f.idmaster === payload.idmaster);
  if (!financeiro) throw new Error("Lançamento não encontrado.");
  const nova: FinanceiroParcela = { ...payload, situacao: payload.situacao ?? "aberto" };
  financeiro.parcelas = [...(financeiro.parcelas ?? []), nova];
  return delay(clone(nova));
}

export async function liquidarParcelas(items: ParcelaRef[]) {
  const hoje = new Date().toISOString().slice(0, 10);
  for (const item of items) {
    const { parcela } = findParcela(item.idmaster, item.parcela, item.subparcela);
    if (parcela) {
      parcela.situacao = "liquidado";
      parcela.datapagamento = hoje;
    }
  }
  return delay({ ok: true });
}

export async function estornarParcelas(items: ParcelaRef[]) {
  for (const item of items) {
    const { parcela } = findParcela(item.idmaster, item.parcela, item.subparcela);
    if (parcela) {
      parcela.situacao = "aberto";
      delete parcela.datapagamento;
    }
  }
  return delay({ ok: true });
}

export async function alterarSituacaoParcelas(items: ParcelaRef[], situacao: string) {
  for (const item of items) {
    const { parcela } = findParcela(item.idmaster, item.parcela, item.subparcela);
    if (parcela) parcela.situacao = situacao;
  }
  return delay({ ok: true });
}

export async function getCusto(ref: CustoRef) {
  const found = custosStore.find(
    (c) =>
      c.id === ref.id &&
      c.idmaster === ref.idmaster &&
      c.parcela === ref.parcela &&
      c.subparcela === ref.subparcela
  );
  if (!found) throw new Error("Custo não encontrado.");
  return delay(clone(found));
}

export async function createCusto(payload: Partial<FinanceiroCusto>) {
  const custo: FinanceiroCusto = {
    idmaster: payload.idmaster!,
    parcela: payload.parcela!,
    subparcela: payload.subparcela ?? 0,
    descricao: payload.descricao,
    valor: payload.valor,
    id: nextCustoId++,
  };
  custosStore = [...custosStore, custo];
  return delay(clone(custo));
}

export async function updateCusto(payload: Partial<FinanceiroCusto> & { id: number }) {
  const idx = custosStore.findIndex((c) => c.id === payload.id);
  if (idx === -1) throw new Error("Custo não encontrado.");
  custosStore[idx] = { ...custosStore[idx], ...payload };
  return delay(clone(custosStore[idx]));
}

export async function deleteCusto(ref: CustoRef) {
  custosStore = custosStore.filter((c) => c.id !== ref.id);
  return delay({ ok: true });
}
