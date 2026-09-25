// A spec OpenAPI da Athenas exige autenticação para ser lida, então os nomes
// exatos de campos abaixo (tipo, codigoPessoa, valor, datavencimento, etc.)
// seguem a descrição textual dos endpoints e devem ser conferidos assim que
// houver acesso autenticado à spec real. O índice [key: string] permite que
// campos adicionais retornados pela API real não quebrem a UI.

export interface FinanceiroParcela {
  idmaster: number;
  parcela: number;
  subparcela: number;
  valor?: number;
  datavencimento?: string;
  datapagamento?: string;
  situacao?: string;
  [key: string]: unknown;
}

export interface FinanceiroCusto {
  id: number;
  idmaster: number;
  parcela: number;
  subparcela: number;
  descricao?: string;
  valor?: number;
  [key: string]: unknown;
}

export interface Financeiro {
  idmaster: number;
  tipo?: "pagar" | "receber" | string;
  codigoPessoa?: number;
  nomePessoa?: string;
  dataEmissao?: string;
  valorTotal?: number;
  situacao?: string;
  parcelas?: FinanceiroParcela[];
  [key: string]: unknown;
}

// Payload de criação: idmaster/situacao das parcelas ainda não existem antes
// de o lançamento ser criado, por isso usam um tipo mais enxuto que
// FinanceiroParcela.
export interface FinanceiroCompletoParcelaInput {
  parcela: number;
  subparcela: number;
  valor: number;
  datavencimento: string;
  [key: string]: unknown;
}

export interface FinanceiroCompletoPayload {
  tipo?: string;
  codigoPessoa?: number;
  nomePessoa?: string;
  dataEmissao?: string;
  valorTotal?: number;
  parcelas?: FinanceiroCompletoParcelaInput[];
}

export interface ParcelaRef {
  idmaster: number;
  parcela: number;
  subparcela: number;
}

export interface CustoRef extends ParcelaRef {
  id: number;
}
