// A API real não documenta os nomes exatos de campo (apenas parâmetros de
// rota/query e "Corpo: Sim/Não"), então os nomes abaixo seguem convenções
// comuns de ERP e devem ser conferidos assim que houver acesso autenticado
// à spec real.

export interface Produto {
  codigo: number;
  descricao?: string;
  natureza?: string; // materia-prima | acabado | revenda | servico
  codigoGrupo?: number;
  codigoEmpresa?: number;
  codigoFilial?: number;
  unidade?: string;
  precoVenda?: number;
  [key: string]: unknown;
}

export interface ProdutoComposicaoItem {
  codigoProduto: number;
  codigoComponente: number;
  descricaoComponente?: string;
  quantidade?: number;
  unidade?: string;
  [key: string]: unknown;
}

export interface ProdutoFiltros {
  codigo?: string;
  natureza?: string;
  codigoGrupo?: string;
  codigoEmpresa?: string;
  codigoFilial?: string;
}
