export interface EntradaSaidaProduto {
  codigoProduto: number;
  descricaoProduto?: string;
  quantidade?: number;
  valorUnitario?: number;
  valorTotal?: number;
  [key: string]: unknown;
}

export interface EntradaSaida {
  idmaster: number;
  tipo?: "entrada" | "saida" | string;
  codigoPessoa?: number;
  nomePessoa?: string;
  dataMovimento?: string;
  valorTotal?: number;
  situacao?: string;
  produtos?: EntradaSaidaProduto[];
  [key: string]: unknown;
}

export interface EntradaSaidaCompletoPayload {
  tipo?: string;
  codigoPessoa?: number;
  nomePessoa?: string;
  dataMovimento?: string;
  produtos?: Array<{
    codigoProduto: number;
    quantidade: number;
    valorUnitario: number;
  }>;
}
