"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useMode } from "@/lib/mode-context";
import { getProduto, getComposicao } from "@/lib/api/produto";
import type { Produto, ProdutoComposicaoItem } from "@/lib/types/produto";
import { formatCurrency } from "@/lib/format";

export default function ProdutoDetailPage() {
  const { mode } = useMode();
  const params = useParams<{ codigo: string }>();
  const codigo = Number(params.codigo);

  const [produto, setProduto] = useState<Produto | null>(null);
  const [composicao, setComposicao] = useState<ProdutoComposicaoItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [produtoData, composicaoData] = await Promise.all([
        getProduto(mode, codigo),
        getComposicao(mode, codigo).catch(() => []),
      ]);
      setProduto(produtoData);
      setComposicao(composicaoData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar.");
    } finally {
      setIsLoading(false);
    }
  }, [mode, codigo]);

  useEffect(() => {
    if (!codigo) return;
    void Promise.resolve().then(load);
  }, [load, codigo]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error || !produto) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-muted-foreground text-sm">
          {error ?? "Produto não encontrado."}
        </p>
        <Button
          variant="outline"
          render={<Link href="/produtos-estoque" />}
          nativeButton={false}
          className="w-fit"
        >
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{produto.descricao}</h1>
        <p className="text-muted-foreground font-mono text-sm">#{produto.codigo}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="gap-1 p-4">
          <p className="text-muted-foreground text-xs">Natureza</p>
          {produto.natureza ? (
            <Badge variant="outline" className="w-fit capitalize">
              {produto.natureza.replace("-", " ")}
            </Badge>
          ) : (
            <p className="text-sm font-medium">—</p>
          )}
        </Card>
        <Card className="gap-1 p-4">
          <p className="text-muted-foreground text-xs">Unidade</p>
          <p className="text-sm font-medium">{produto.unidade ?? "—"}</p>
        </Card>
        <Card className="gap-1 p-4">
          <p className="text-muted-foreground text-xs">Preço de venda</p>
          <p className="font-mono text-sm font-medium">
            {formatCurrency(produto.precoVenda)}
          </p>
        </Card>
        <Card className="gap-1 p-4">
          <p className="text-muted-foreground text-xs">Código do grupo</p>
          <p className="font-mono text-sm font-medium">{produto.codigoGrupo ?? "—"}</p>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Composição</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Componente</TableHead>
                <TableHead className="text-right">Quantidade</TableHead>
                <TableHead>Unidade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {composicao?.length ? (
                composicao.map((item) => (
                  <TableRow key={item.codigoComponente}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {item.descricaoComponente ?? "—"}
                        </span>
                        <span className="text-muted-foreground font-mono text-xs">
                          #{item.codigoComponente}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {item.quantidade ?? "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {item.unidade ?? "—"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-muted-foreground text-center">
                    Este produto não tem composição cadastrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
