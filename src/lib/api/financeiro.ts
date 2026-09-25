import { apiFetch } from "@/lib/api/client";
import type { DataMode } from "@/lib/types/auth";
import type {
  CustoRef,
  Financeiro,
  FinanceiroCompletoPayload,
  FinanceiroCusto,
  FinanceiroParcela,
  ParcelaRef,
} from "@/lib/types/financeiro";
import * as mock from "@/lib/mocks/financeiro";

// A API real não expõe um endpoint de listagem geral de lançamentos
// financeiros (apenas GET por idmaster) — listFinanceiroMock só existe
// para o modo Protótipo; no modo Real a tela usa busca por IDMASTER.
export function listFinanceiroMock() {
  return mock.listFinanceiro();
}

export function getFinanceiro(mode: DataMode, idmaster: number) {
  return apiFetch<Financeiro>(mode, `ws/financeiro/${idmaster}`, undefined, () =>
    mock.getFinanceiro(idmaster)
  );
}

export function deleteFinanceiro(mode: DataMode, idmaster: number) {
  return apiFetch<unknown>(
    mode,
    `ws/financeiro/${idmaster}`,
    { method: "DELETE" },
    () => mock.deleteFinanceiro(idmaster)
  );
}

export function createFinanceiroCompleto(mode: DataMode, payload: FinanceiroCompletoPayload) {
  return apiFetch<Financeiro>(
    mode,
    "ws/financeiro/add-financeiro-completo",
    { method: "POST", body: JSON.stringify(payload) },
    () => mock.createFinanceiroCompleto(payload)
  );
}

export function getParcela(
  mode: DataMode,
  idmaster: number,
  parcela: number,
  subparcela: number
) {
  return apiFetch<FinanceiroParcela>(
    mode,
    `ws/financeiro/parcela/${idmaster}/${parcela}/${subparcela}`,
    undefined,
    () => mock.getParcela(idmaster, parcela, subparcela)
  );
}

export function updateParcela(
  mode: DataMode,
  idmaster: number,
  parcela: number,
  subparcela: number,
  payload: Partial<FinanceiroParcela>
) {
  return apiFetch<FinanceiroParcela>(
    mode,
    `ws/financeiro/parcela/${idmaster}/${parcela}/${subparcela}`,
    { method: "PUT", body: JSON.stringify(payload) },
    () => mock.updateParcela(idmaster, parcela, subparcela, payload)
  );
}

export function deleteParcela(
  mode: DataMode,
  idmaster: number,
  parcela: number,
  subparcela: number
) {
  return apiFetch<unknown>(
    mode,
    `ws/financeiro/parcela/${idmaster}/${parcela}/${subparcela}`,
    { method: "DELETE" },
    () => mock.deleteParcela(idmaster, parcela, subparcela)
  );
}

export function createParcela(mode: DataMode, payload: FinanceiroParcela) {
  return apiFetch<FinanceiroParcela>(
    mode,
    "ws/financeiro/parcela",
    { method: "POST", body: JSON.stringify(payload) },
    () => mock.createParcela(payload)
  );
}

export function liquidarParcelas(mode: DataMode, items: ParcelaRef[]) {
  return apiFetch<unknown>(
    mode,
    "ws/financeiro/parcelas/liquidar",
    { method: "PUT", body: JSON.stringify({ parcelas: items }) },
    () => mock.liquidarParcelas(items)
  );
}

export function estornarParcelas(mode: DataMode, items: ParcelaRef[]) {
  return apiFetch<unknown>(
    mode,
    "ws/financeiro/parcelas/estornar",
    { method: "PUT", body: JSON.stringify({ parcelas: items }) },
    () => mock.estornarParcelas(items)
  );
}

export function alterarSituacaoParcelas(mode: DataMode, items: ParcelaRef[], situacao: string) {
  return apiFetch<unknown>(
    mode,
    "ws/financeiro/parcelas/situacao",
    { method: "PUT", body: JSON.stringify({ parcelas: items, situacao }) },
    () => mock.alterarSituacaoParcelas(items, situacao)
  );
}

export function getCusto(mode: DataMode, ref: CustoRef) {
  const search = new URLSearchParams({
    idmaster: String(ref.idmaster),
    parcela: String(ref.parcela),
    subparcela: String(ref.subparcela),
    id: String(ref.id),
  });
  return apiFetch<FinanceiroCusto>(
    mode,
    `ws/financeiro/parcelas/custos?${search.toString()}`,
    undefined,
    () => mock.getCusto(ref)
  );
}

export function createCusto(mode: DataMode, payload: Partial<FinanceiroCusto>) {
  return apiFetch<FinanceiroCusto>(
    mode,
    "ws/financeiro/parcelas/custos",
    { method: "POST", body: JSON.stringify(payload) },
    () => mock.createCusto(payload)
  );
}

export function updateCusto(mode: DataMode, payload: Partial<FinanceiroCusto> & { id: number }) {
  return apiFetch<FinanceiroCusto>(
    mode,
    "ws/financeiro/parcelas/custos",
    { method: "PUT", body: JSON.stringify(payload) },
    () => mock.updateCusto(payload)
  );
}

export function deleteCusto(mode: DataMode, ref: CustoRef) {
  return apiFetch<unknown>(
    mode,
    "ws/financeiro/parcelas/custos",
    { method: "DELETE", body: JSON.stringify(ref) },
    () => mock.deleteCusto(ref)
  );
}
