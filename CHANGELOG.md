# Changelog

Formato: `major.minor.patch` (versionamento semântico). Histórico consolidado em 2026-09-25.

## [0.4.0] - 2026-09-25
### Adicionado
- Fase 3 — Produtos e Estoque: catálogo com filtros reais (`GET /ws/produtos/get`), cadastro, detalhe com composição, entradas/saídas (listagem/busca, criação completa, detalhe) e movimentações (busca por idmaster+id e registro), com sub-navegação no módulo.

## [0.3.0] - 2026-09-25
### Adicionado
- Fase 2 — Pedidos de Venda: listagem/busca, criação (cabeçalho + itens em chamadas separadas), detalhe com itens, novo item, finalizar e excluir pedido.
- Status "Finalizado" no `StatusBadge`.

## [0.2.1] - 2026-09-25
### Alterado
- Aplicado o design gerado no Stitch (pasta `design/`): paleta, tipografia (Geist + JetBrains Mono), raio de 8px, sidebar com ícones, toggle Real/Protótipo em pill, novo visual de login, Visão Geral e Financeiro.
- Variantes `success`/`warning` no `Badge`; status derivado "Atrasado" em parcelas.

## [0.2.0] - 2026-09-25
### Adicionado
- Fase 1 — Financeiro: listagem/busca, novo lançamento, detalhe com parcelas (editar, liquidar, estornar, alterar situação, excluir) e custos.
### Corrigido
- Datas `YYYY-MM-DD` exibidas com um dia a menos por fuso horário (`formatDate`).

## [0.1.0] - 2026-09-25
### Adicionado
- Fase 0 — Fundação: Next.js + TypeScript + Tailwind + shadcn/ui; login (real/protótipo) com cookies, proxy autenticado para a API Athenas, alternância Real/Protótipo, shell do dashboard e proteção de rotas (`src/proxy.ts`).
