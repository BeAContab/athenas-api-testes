"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { ArrowDownRight, ArrowUpRight, Search } from "lucide-react";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMode } from "@/lib/mode-context";
import { createMovimentacao, getMovimentacao } from "@/lib/api/movimentacao-produto";
import type { MovimentacaoProduto } from "@/lib/types/movimentacao-produto";
import { formatDate } from "@/lib/format";

export default function MovimentacoesPage() {
  const { mode } = useMode();

  const [searchIdmaster, setSearchIdmaster] = useState("");
  const [searchId, setSearchId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [found, setFound] = useState<MovimentacaoProduto | null>(null);

  const [idmaster, setIdmaster] = useState("");
  const [codigoProduto, setCodigoProduto] = useState("");
  const [descricaoProduto, setDescricaoProduto] = useState("");
  const [tipo, setTipo] = useState<"entrada" | "saida">("entrada");
  const [quantidade, setQuantidade] = useState("");
  const [data, setData] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSearch = async (event: FormEvent) => {
    event.preventDefault();
    if (!searchIdmaster || !searchId) {
      toast.error("Informe IDMASTER e ID.");
      return;
    }
    setIsSearching(true);
    try {
      const result = await getMovimentacao(mode, {
        idmaster: Number(searchIdmaster),
        id: Number(searchId),
      });
      setFound(result);
    } catch (err) {
      setFound(null);
      toast.error(err instanceof Error ? err.message : "Movimentação não encontrada.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleCreate = async (event: FormEvent) => {
    event.preventDefault();
    if (!idmaster || !quantidade) {
      toast.error("Preencha IDMASTER e quantidade.");
      return;
    }
    setIsSubmitting(true);
    try {
      const created = await createMovimentacao(mode, {
        idmaster: Number(idmaster),
        codigoProduto: codigoProduto ? Number(codigoProduto) : undefined,
        descricaoProduto: descricaoProduto || undefined,
        tipo,
        quantidade: Number(quantidade),
        data: data || undefined,
      });
      toast.success(`Movimentação registrada (ID ${created.id}).`);
      setIdmaster("");
      setCodigoProduto("");
      setDescricaoProduto("");
      setQuantidade("");
      setData("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao registrar movimentação.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Movimentações de Produtos
        </h1>
        <p className="text-muted-foreground text-sm">
          A API consulta uma movimentação por vez, pela chave IDMASTER + ID
          — não há endpoint de listagem.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Buscar movimentação</CardTitle>
          <CardDescription>Informe o IDMASTER e o ID da movimentação.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <form onSubmit={handleSearch} className="flex items-end gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="search-idmaster">IDMASTER</Label>
              <Input
                id="search-idmaster"
                inputMode="numeric"
                value={searchIdmaster}
                onChange={(e) => setSearchIdmaster(e.target.value)}
                className="w-32"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="search-id">ID</Label>
              <Input
                id="search-id"
                inputMode="numeric"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="w-24"
              />
            </div>
            <Button type="submit" disabled={isSearching}>
              <Search />
              Buscar
            </Button>
          </form>

          {found && (
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                {found.tipo === "saida" ? (
                  <ArrowUpRight className="text-destructive size-5" />
                ) : (
                  <ArrowDownRight className="text-ring size-5" />
                )}
                <div>
                  <p className="font-medium">{found.descricaoProduto ?? "—"}</p>
                  <p className="text-muted-foreground font-mono text-xs">
                    #{found.codigoProduto} · idmaster {found.idmaster}/{found.id}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm font-medium capitalize">
                  {found.tipo} · {found.quantidade}
                </p>
                <p className="text-muted-foreground text-xs">{formatDate(found.data)}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Registrar nova movimentação</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="mov-idmaster">IDMASTER de referência</Label>
              <Input
                id="mov-idmaster"
                inputMode="numeric"
                value={idmaster}
                onChange={(e) => setIdmaster(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="mov-tipo">Tipo</Label>
              <Select value={tipo} onValueChange={(v) => setTipo(v as "entrada" | "saida")}>
                <SelectTrigger id="mov-tipo" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entrada">Entrada</SelectItem>
                  <SelectItem value="saida">Saída</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="mov-codigo">Código do produto</Label>
              <Input
                id="mov-codigo"
                inputMode="numeric"
                value={codigoProduto}
                onChange={(e) => setCodigoProduto(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="mov-descricao">Descrição</Label>
              <Input
                id="mov-descricao"
                value={descricaoProduto}
                onChange={(e) => setDescricaoProduto(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="mov-quantidade">Quantidade</Label>
              <Input
                id="mov-quantidade"
                inputMode="decimal"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="mov-data">Data</Label>
              <Input
                id="mov-data"
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
              />
            </div>
            <div className="col-span-2 flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Registrar movimentação"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
