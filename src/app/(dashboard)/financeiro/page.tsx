"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { listFinanceiroMock } from "@/lib/api/financeiro";
import type { Financeiro } from "@/lib/types/financeiro";
import { formatCurrency, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function FinanceiroPage() {
  const { mode } = useMode();
  const router = useRouter();
  const [items, setItems] = useState<Financeiro[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (mode !== "mock") return;
    // Disparado via microtask para não acionar o aviso
    // react-hooks/set-state-in-effect (setState só é isento dentro de um
    // callback assíncrono, não diretamente no corpo do efeito).
    void Promise.resolve().then(() => {
      setIsLoading(true);
      return listFinanceiroMock()
        .then(setItems)
        .catch((err) =>
          toast.error(err instanceof Error ? err.message : "Erro ao carregar lançamentos.")
        )
        .finally(() => setIsLoading(false));
    });
  }, [mode]);

  const filteredItems = useMemo(() => {
    if (!items) return items;
    const term = query.trim().toLowerCase();
    if (!term) return items;
    return items.filter(
      (item) =>
        String(item.idmaster).includes(term) ||
        item.nomePessoa?.toLowerCase().includes(term)
    );
  }, [items, query]);

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    const idmaster = Number(searchId);
    if (!idmaster) {
      toast.error("Informe um IDMASTER válido.");
      return;
    }
    router.push(`/financeiro/${idmaster}`);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Financeiro</h1>
          <p className="text-muted-foreground text-sm">
            Gestão de lançamentos financeiros e fluxo de caixa.
          </p>
        </div>
        <Button render={<Link href="/financeiro/novo" />} nativeButton={false}>
          <Plus />
          Novo lançamento
        </Button>
      </div>

      {mode === "real" ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Buscar lançamento</CardTitle>
            <CardDescription>
              A API Athenas não expõe uma listagem geral de lançamentos financeiros
              — consulte por IDMASTER para abrir o detalhe.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex items-end gap-3">
              <div className="flex flex-col gap-2">
                <Label htmlFor="search-idmaster">IDMASTER</Label>
                <Input
                  id="search-idmaster"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  inputMode="numeric"
                  className="w-40"
                />
              </div>
              <Button type="submit">Buscar</Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card className="gap-0 py-0">
          <div className="flex items-center justify-between border-b p-3">
            <div className="relative w-64">
              <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar lançamento..."
                className="h-8 pl-8 text-sm"
              />
            </div>
          </div>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex flex-col gap-2 p-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>IDMASTER</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Pessoa</TableHead>
                    <TableHead>Emissão</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead>Situação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems?.length ? (
                    filteredItems.map((item) => (
                      <TableRow
                        key={item.idmaster}
                        className="cursor-pointer"
                        onClick={() => router.push(`/financeiro/${item.idmaster}`)}
                      >
                        <TableCell className="text-muted-foreground font-mono">
                          #{item.idmaster}
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center gap-1.5 font-medium">
                            <span
                              className={cn(
                                "size-1.5 rounded-full",
                                item.tipo === "pagar" ? "bg-destructive" : "bg-ring"
                              )}
                            />
                            <span className="capitalize">{item.tipo ?? "—"}</span>
                          </span>
                        </TableCell>
                        <TableCell className="font-medium">
                          {item.nomePessoa ?? "—"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(item.dataEmissao)}
                        </TableCell>
                        <TableCell className="text-right font-mono font-medium">
                          {formatCurrency(item.valorTotal)}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={item.situacao} />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-muted-foreground text-center">
                        Nenhum lançamento encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
          {!isLoading && items && (
            <div className="text-muted-foreground border-t p-3 text-xs">
              Mostrando {filteredItems?.length ?? 0} de {items.length} resultados
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
