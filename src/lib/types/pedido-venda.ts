// A API real não documenta os nomes exatos de campo (apenas parâmetros de
// rota e "Corpo: Sim/Não"), então os nomes abaixo seguem convenções comuns
// de ERP e devem ser conferidos assim que houver acesso autenticado à spec.

export interface PedidoVendaItem {
  idmaster: number;
  item: number;
  codigoProduto?: number;
  descricaoProduto?: string;
  quantidade?: number;
  valorUnitario?: number;
  valorTotal?: number;
  [key: string]: unknown;
}

export interface PedidoVenda {
  idmaster: number;
  codigoPessoa?: number;
  nomePessoa?: string;
  dataEmissao?: string;
  valorTotal?: number;
  situacao?: string; // aberto | finalizado | cancelado
  itens?: PedidoVendaItem[];
  [key: string]: unknown;
}

// Payload de criação do cabeçalho — a API não tem endpoint "completo" como
// o Financeiro, então cabeçalho e itens são criados em chamadas separadas.
export interface PedidoVendaHeaderInput {
  codigoPessoa?: number;
  nomePessoa?: string;
  dataEmissao?: string;
}

export interface PedidoVendaItemInput {
  item: number;
  codigoProduto?: number;
  descricaoProduto?: string;
  quantidade: number;
  valorUnitario: number;
}
