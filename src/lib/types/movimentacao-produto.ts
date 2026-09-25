export interface MovimentacaoProduto {
  idmaster: number;
  id: number;
  codigoProduto?: number;
  descricaoProduto?: string;
  tipo?: string; // entrada | saida
  quantidade?: number;
  data?: string;
  [key: string]: unknown;
}

export interface MovimentacaoRef {
  idmaster: number;
  id: number;
}

export interface MovimentacaoProdutoInput {
  idmaster: number;
  codigoProduto?: number;
  descricaoProduto?: string;
  tipo?: string;
  quantidade?: number;
  data?: string;
}
