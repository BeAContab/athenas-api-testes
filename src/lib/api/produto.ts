import { apiFetch } from "@/lib/api/client";
import type { DataMode } from "@/lib/types/auth";
import type {
  Produto,
  ProdutoComposicaoItem,
  ProdutoFiltros,
} from "@/lib/types/produto";
import * as mock from "@/lib/mocks/produto";

// Diferente de Financeiro e Pedido de Venda, a API de Produtos tem um
// endpoint de listagem de verdade (GET /ws/produtos/get, com filtros) —
// por isso essa busca funciona tanto no modo Real quanto no Protótipo.
export function listProdutos(mode: DataMode, filtros: ProdutoFiltros) {
  const search = new URLSearchParams();
  if (filtros.codigo) search.set("CODIGO", filtros.codigo);
  if (filtros.natureza) search.set("NATUREZA", filtros.natureza);
  if (filtros.codigoGrupo) search.set("CODIGOGRUPO", filtros.codigoGrupo);
  if (filtros.codigoEmpresa) search.set("CODIGOEMPRESA", filtros.codigoEmpresa);
  if (filtros.codigoFilial) search.set("CODIGOFILIAL", filtros.codigoFilial);
  const qs = search.toString();
  return apiFetch<Produto[]>(
    mode,
    `ws/produtos/get${qs ? `?${qs}` : ""}`,
    undefined,
    () => mock.listProdutos(filtros)
  );
}

// GET /ws/produtos/get sempre retorna uma lista (mesmo filtrando por
// CODIGO) — não existe um "GET por id" dedicado, então buscamos com o
// filtro de código e pegamos o primeiro resultado.
export async function getProduto(mode: DataMode, codigo: number) {
  const results = await listProdutos(mode, { codigo: String(codigo) });
  const found = results.find((p) => p.codigo === codigo) ?? results[0];
  if (!found) throw new Error("Produto não encontrado.");
  return found;
}

export function createProduto(mode: DataMode, payload: Partial<Produto>) {
  return apiFetch<Produto>(
    mode,
    "ws/produtos",
    { method: "POST", body: JSON.stringify(payload) },
    () => mock.createProduto(payload)
  );
}

export function getComposicao(mode: DataMode, codigoProduto: number) {
  return apiFetch<ProdutoComposicaoItem[]>(
    mode,
    `ws/produtos/composicao/${codigoProduto}`,
    undefined,
    () => mock.getComposicao(codigoProduto)
  );
}
