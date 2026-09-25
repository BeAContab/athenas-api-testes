import type {
  Produto,
  ProdutoComposicaoItem,
  ProdutoFiltros,
} from "@/lib/types/produto";

// Estado em memória para o modo Protótipo — reinicia a cada recarregamento
// completo da página. Códigos reaproveitados dos mocks de Pedido de Venda
// para manter consistência entre módulos.
let produtosStore: Produto[] = [
  {
    codigo: 310,
    descricao: "Adubo NPK 20-05-20 (saco 50kg)",
    natureza: "revenda",
    codigoGrupo: 10,
    codigoEmpresa: 1,
    codigoFilial: 1,
    unidade: "SC",
    precoVenda: 180,
  },
  {
    codigo: 415,
    descricao: "Semente de soja RR (saco 40kg)",
    natureza: "revenda",
    codigoGrupo: 20,
    codigoEmpresa: 1,
    codigoFilial: 1,
    unidade: "SC",
    precoVenda: 300,
  },
  {
    codigo: 220,
    descricao: "Calcário dolomítico (tonelada)",
    natureza: "revenda",
    codigoGrupo: 10,
    codigoEmpresa: 1,
    codigoFilial: 1,
    unidade: "TON",
    precoVenda: 300,
  },
  {
    codigo: 118,
    descricao: "Óleo lubrificante (galão 20L)",
    natureza: "revenda",
    codigoGrupo: 30,
    codigoEmpresa: 1,
    codigoFilial: 1,
    unidade: "GL",
    precoVenda: 190,
  },
  {
    codigo: 500,
    descricao: "Mistura fertilizante especial (saco 25kg)",
    natureza: "acabado",
    codigoGrupo: 40,
    codigoEmpresa: 1,
    codigoFilial: 1,
    unidade: "SC",
    precoVenda: 210,
  },
  {
    codigo: 501,
    descricao: "Ureia agrícola (matéria-prima, kg)",
    natureza: "materia-prima",
    codigoGrupo: 50,
    codigoEmpresa: 1,
    codigoFilial: 1,
    unidade: "KG",
    precoVenda: 4.2,
  },
];

const composicaoStore: Record<number, ProdutoComposicaoItem[]> = {
  500: [
    {
      codigoProduto: 500,
      codigoComponente: 501,
      descricaoComponente: "Ureia agrícola (matéria-prima, kg)",
      quantidade: 15,
      unidade: "KG",
    },
    {
      codigoProduto: 500,
      codigoComponente: 310,
      descricaoComponente: "Adubo NPK 20-05-20 (saco 50kg)",
      quantidade: 1,
      unidade: "SC",
    },
  ],
};

let nextCodigo = 502;

function delay<T>(value: T, ms = 250): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

export async function listProdutos(filtros: ProdutoFiltros = {}) {
  let results = produtosStore;
  if (filtros.codigo) {
    results = results.filter((p) => String(p.codigo).includes(filtros.codigo!));
  }
  if (filtros.natureza) {
    results = results.filter((p) => p.natureza === filtros.natureza);
  }
  if (filtros.codigoGrupo) {
    results = results.filter((p) => String(p.codigoGrupo) === filtros.codigoGrupo);
  }
  return delay(clone(results));
}

export async function createProduto(payload: Partial<Produto>) {
  const codigo = nextCodigo++;
  const novo: Produto = {
    codigo,
    descricao: payload.descricao,
    natureza: payload.natureza,
    codigoGrupo: payload.codigoGrupo,
    codigoEmpresa: payload.codigoEmpresa ?? 1,
    codigoFilial: payload.codigoFilial ?? 1,
    unidade: payload.unidade,
    precoVenda: payload.precoVenda,
  };
  produtosStore = [novo, ...produtosStore];
  return delay(clone(novo));
}

export async function getComposicao(codigoProduto: number) {
  return delay(clone(composicaoStore[codigoProduto] ?? []));
}
