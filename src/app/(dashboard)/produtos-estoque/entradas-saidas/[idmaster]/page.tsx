"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { StatusBadge } from "@/components/shared/status-badge";
import { useMode } from "@/lib/mode-context";
import { getEntradaSaida } from "@/lib/api/entrada-saida";
import type { EntradaSaida } from "@/lib/types/entrada-saida";
import { formatCurrency, formatDate } from "@/lib/format";

export default function EntradaSaidaDetailPage() {
  const { mode } = useMode();
  const params = useParams<{ idmaster: string }>();
  const idmaster = Number(params.idmaster);

  const [registro, setRegistro] = useState<EntradaSaida | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await getEntradaSaida(mode, idmaster);
      setRegistro(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar.");
    } finally {
      setIsLoading(false);
    }
  }, [mode, idmaster]);

  useEffect(() => {
    if (!idmaster) return;
    void Promise.resolve().then(load);
  }, [load, idmaster]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error || !registro) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-muted-foreground text-sm">
          {error ?? "Registro não encontrado."}
        </p>
        <Button
          variant="outline"
          render={<Link href="/produtos-estoque/entradas-saidas" />}
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
        <h1 className="text-2xl font-semibold tracking-tight">
          Registro #{registro.idmaster}
        </h1>
        <p className="text-muted-foreground flex items-center gap-1.5 text-sm capitalize">
          {registro.tipo === "saida" ? (
            <ArrowUpRight className="text-destructive size-4" />
          ) : (
            <ArrowDownRight className="text-ring size-4" />
          )}
          {registro.tipo ?? "—"} ·{" "}
          {registro.nomePessoa ?? `Pessoa ${registro.codigoPessoa ?? "—"}`}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="gap-1 p-4">
          <p className="text-muted-foreground text-xs">Data</p>
          <p className="text-sm font-medium">{formatDate(registro.dataMovimento)}</p>
        </Card>
        <Card className="gap-1 p-4">
          <p className="text-muted-foreground text-xs">Valor total</p>
          <p className="font-mono text-sm font-medium">
            {formatCurrency(registro.valorTotal)}
          </p>
        </Card>
        <Card className="gap-1 p-4">
          <p className="text-muted-foreground text-xs">Situação</p>
          <StatusBadge status={registro.situacao} />
        </Card>
        <Card className="gap-1 p-4">
          <p className="text-muted-foreground text-xs">Código da pessoa</p>
          <p className="font-mono text-sm font-medium">
            {registro.codigoPessoa ?? "—"}
          </p>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Produtos</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead className="text-right">Quantidade</TableHead>
                <TableHead className="text-right">Valor unitário</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registro.produtos?.length ? (
                registro.produtos.map((produto, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {produto.descricaoProduto ?? "—"}
                        </span>
                        <span className="text-muted-foreground font-mono text-xs">
                          #{produto.codigoProduto}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {produto.quantidade ?? "—"}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(produto.valorUnitario)}
                    </TableCell>
                    <TableCell className="text-right font-mono font-medium">
                      {formatCurrency(produto.valorTotal)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-muted-foreground text-center">
                    Nenhum produto neste registro.
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
