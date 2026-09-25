"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useMode } from "@/lib/mode-context";
import { listProdutos } from "@/lib/api/produto";
import type { Produto } from "@/lib/types/produto";
import { formatCurrency } from "@/lib/format";

const NATUREZAS = [
  { value: "materia-prima", label: "Matéria-prima" },
  { value: "acabado", label: "Produto acabado" },
  { value: "revenda", label: "Revenda" },
  { value: "servico", label: "Serviço" },
];

export default function ProdutosPage() {
  const { mode } = useMode();
  const router = useRouter();
  const [items, setItems] = useState<Produto[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [codigo, setCodigo] = useState("");
  const [natureza, setNatureza] = useState<string>("");

  const search = useCallback(
    async (filtros: { codigo?: string; natureza?: string }) => {
      setIsLoading(true);
      try {
        const results = await listProdutos(mode, filtros);
        setItems(results);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Erro ao buscar produtos.");
      } finally {
        setIsLoading(false);
      }
    },
    [mode]
  );

  useEffect(() => {
    void Promise.resolve().then(() => search({}));
  }, [search]);

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    search({ codigo: codigo || undefined, natureza: natureza || undefined });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Produtos</h1>
          <p className="text-muted-foreground text-sm">
            Cadastro e consulta de produtos, incluindo composição.
          </p>
        </div>
        <Button render={<Link href="/produtos-estoque/novo" />} nativeButton={false}>
          <Plus />
          Novo produto
        </Button>
      </div>

      <Card className="gap-0 py-0">
        <form
          onSubmit={handleSearch}
          className="flex flex-wrap items-end gap-3 border-b p-3"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="filtro-codigo" className="text-xs">
              Código
            </Label>
            <div className="relative">
              <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
              <Input
                id="filtro-codigo"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                className="h-8 w-40 pl-8 text-sm"
                inputMode="numeric"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-xs">Natureza</Label>
            <Select value={natureza} onValueChange={(v) => setNatureza(String(v))}>
              <SelectTrigger size="sm" className="w-48">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                {NATUREZAS.map((n) => (
                  <SelectItem key={n.value} value={n.value}>
                    {n.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" size="sm">
            Buscar
          </Button>
          {(codigo || natureza) && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setCodigo("");
                setNatureza("");
                search({});
              }}
            >
              Limpar
            </Button>
          )}
        </form>

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
                  <TableHead>Código</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Natureza</TableHead>
                  <TableHead>Unidade</TableHead>
                  <TableHead className="text-right">Preço de venda</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items?.length ? (
                  items.map((item) => (
                    <TableRow
                      key={item.codigo}
                      className="cursor-pointer"
                      onClick={() => router.push(`/produtos-estoque/${item.codigo}`)}
                    >
                      <TableCell className="text-muted-foreground font-mono">
                        #{item.codigo}
                      </TableCell>
                      <TableCell className="font-medium">{item.descricao}</TableCell>
                      <TableCell>
                        {item.natureza ? (
                          <Badge variant="outline" className="capitalize">
                            {item.natureza.replace("-", " ")}
                          </Badge>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {item.unidade ?? "—"}
                      </TableCell>
                      <TableCell className="text-right font-mono font-medium">
                        {formatCurrency(item.precoVenda)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-muted-foreground text-center">
                      Nenhum produto encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
        {!isLoading && items && (
          <div className="text-muted-foreground border-t p-3 text-xs">
            {items.length} produto{items.length === 1 ? "" : "s"} encontrado
            {items.length === 1 ? "" : "s"}
          </div>
        )}
      </Card>
    </div>
  );
}
