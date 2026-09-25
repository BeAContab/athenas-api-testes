"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowDownRight, ArrowUpRight, MoreHorizontal, Plus, Trash2 } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/shared/status-badge";
import { useMode } from "@/lib/mode-context";
import {
  deleteFinanceiro,
  deleteParcela,
  estornarParcelas,
  getFinanceiro,
  liquidarParcelas,
} from "@/lib/api/financeiro";
import type { Financeiro, FinanceiroParcela } from "@/lib/types/financeiro";
import { formatCurrency, formatDate, getParcelaDisplayStatus } from "@/lib/format";
import { ParcelaDialog } from "./parcela-dialog";
import { SituacaoDialog } from "./situacao-dialog";
import { CustosDialog } from "./custos-dialog";

type DeleteTarget =
  | { type: "financeiro" }
  | { type: "parcela"; parcela: FinanceiroParcela }
  | null;

export default function FinanceiroDetailPage() {
  const { mode } = useMode();
  const router = useRouter();
  const params = useParams<{ idmaster: string }>();
  const idmaster = Number(params.idmaster);

  const [financeiro, setFinanceiro] = useState<Financeiro | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [parcelaDialogOpen, setParcelaDialogOpen] = useState(false);
  const [editingParcela, setEditingParcela] = useState<FinanceiroParcela | null>(null);
  const [situacaoDialogOpen, setSituacaoDialogOpen] = useState(false);
  const [custosDialogOpen, setCustosDialogOpen] = useState(false);
  const [selectedParcela, setSelectedParcela] = useState<FinanceiroParcela | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);

  const load = useCallback(async () => {
    try {
      const data = await getFinanceiro(mode, idmaster);
      setFinanceiro(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar.");
    } finally {
      setIsLoading(false);
    }
  }, [mode, idmaster]);

  useEffect(() => {
    if (!idmaster) return;
    // Chamado via microtask (em vez de diretamente) para não disparar o
    // aviso react-hooks/set-state-in-effect: `load` acaba chamando setState
    // internamente, e o lint só isenta chamadas feitas a partir de um
    // callback assíncrono (mesmo padrão de `.then(setItems)` abaixo).
    void Promise.resolve().then(load);
  }, [load, idmaster]);

  const handleLiquidar = async (parcela: FinanceiroParcela) => {
    try {
      await liquidarParcelas(mode, [
        { idmaster: parcela.idmaster, parcela: parcela.parcela, subparcela: parcela.subparcela },
      ]);
      toast.success("Parcela liquidada.");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao liquidar parcela.");
    }
  };

  const handleEstornar = async (parcela: FinanceiroParcela) => {
    try {
      await estornarParcelas(mode, [
        { idmaster: parcela.idmaster, parcela: parcela.parcela, subparcela: parcela.subparcela },
      ]);
      toast.success("Parcela estornada.");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao estornar parcela.");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.type === "financeiro") {
        await deleteFinanceiro(mode, idmaster);
        toast.success("Lançamento excluído.");
        router.push("/financeiro");
        return;
      }
      const { parcela } = deleteTarget;
      await deleteParcela(mode, parcela.idmaster, parcela.parcela, parcela.subparcela);
      toast.success("Parcela excluída.");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao excluir.");
    } finally {
      setDeleteTarget(null);
    }
  };

  const nextParcelaNumber = (financeiro?.parcelas?.length ?? 0) + 1;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error || !financeiro) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-muted-foreground text-sm">
          {error ?? "Lançamento não encontrado."}
        </p>
        <Button
          variant="outline"
          render={<Link href="/financeiro" />}
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
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Lançamento #{financeiro.idmaster}
          </h1>
          <p className="text-muted-foreground flex items-center gap-1.5 text-sm capitalize">
            {financeiro.tipo === "pagar" ? (
              <ArrowUpRight className="text-destructive size-4" />
            ) : (
              <ArrowDownRight className="text-ring size-4" />
            )}
            {financeiro.tipo ?? "—"} ·{" "}
            {financeiro.nomePessoa ?? `Pessoa ${financeiro.codigoPessoa ?? "—"}`}
          </p>
        </div>
        <Button
          variant="outline"
          className="border-destructive/40 text-destructive hover:bg-destructive/10"
          onClick={() => setDeleteTarget({ type: "financeiro" })}
        >
          <Trash2 />
          Excluir lançamento
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="gap-1 p-4">
          <p className="text-muted-foreground text-xs">Emissão</p>
          <p className="text-sm font-medium">{formatDate(financeiro.dataEmissao)}</p>
        </Card>
        <Card className="gap-1 p-4">
          <p className="text-muted-foreground text-xs">Valor total</p>
          <p className="font-mono text-sm font-medium">
            {formatCurrency(financeiro.valorTotal)}
          </p>
        </Card>
        <Card className="gap-1 p-4">
          <p className="text-muted-foreground text-xs">Situação</p>
          <StatusBadge status={financeiro.situacao} />
        </Card>
        <Card className="gap-1 p-4">
          <p className="text-muted-foreground text-xs">Código da pessoa</p>
          <p className="font-mono text-sm font-medium">
            {financeiro.codigoPessoa ?? "—"}
          </p>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Parcelas</CardTitle>
          <Button
            size="sm"
            onClick={() => {
              setEditingParcela(null);
              setParcelaDialogOpen(true);
            }}
          >
            <Plus /> Nova parcela
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Parcela</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Pagamento</TableHead>
                <TableHead>Situação</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {financeiro.parcelas?.length ? (
                financeiro.parcelas.map((parcela) => (
                  <TableRow key={`${parcela.parcela}-${parcela.subparcela}`}>
                    <TableCell className="font-mono font-medium">
                      {parcela.parcela}/{parcela.subparcela}
                    </TableCell>
                    <TableCell className="font-mono">
                      {formatCurrency(parcela.valor)}
                    </TableCell>
                    <TableCell>{formatDate(parcela.datavencimento)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(parcela.datapagamento)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={getParcelaDisplayStatus(parcela)} />
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger render={<Button variant="ghost" size="icon" />}>
                          <MoreHorizontal />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuGroup>
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingParcela(parcela);
                                setParcelaDialogOpen(true);
                              }}
                            >
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedParcela(parcela);
                                setCustosDialogOpen(true);
                              }}
                            >
                              Custos
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedParcela(parcela);
                                setSituacaoDialogOpen(true);
                              }}
                            >
                              Alterar situação
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleLiquidar(parcela)}>
                              Liquidar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEstornar(parcela)}>
                              Estornar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => setDeleteTarget({ type: "parcela", parcela })}
                            >
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-muted-foreground text-center">
                    Nenhuma parcela cadastrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        {financeiro.parcelas && financeiro.parcelas.length > 0 && (
          <div className="text-muted-foreground flex items-center justify-between border-t px-4 py-3 text-xs">
            <span>Exibindo {financeiro.parcelas.length} de {financeiro.parcelas.length} parcelas</span>
            <span className="text-foreground font-mono font-medium">
              Saldo devedor:{" "}
              {formatCurrency(
                financeiro.parcelas
                  .filter((p) => p.situacao?.toLowerCase() !== "liquidado")
                  .reduce((sum, p) => sum + (Number(p.valor) || 0), 0)
              )}
            </span>
          </div>
        )}
      </Card>

      <ParcelaDialog
        open={parcelaDialogOpen}
        onOpenChange={setParcelaDialogOpen}
        dataMode={mode}
        idmaster={idmaster}
        parcela={editingParcela}
        nextParcelaNumber={nextParcelaNumber}
        onSaved={load}
      />
      <SituacaoDialog
        open={situacaoDialogOpen}
        onOpenChange={setSituacaoDialogOpen}
        dataMode={mode}
        parcela={selectedParcela}
        onSaved={load}
      />
      <CustosDialog
        open={custosDialogOpen}
        onOpenChange={setCustosDialogOpen}
        dataMode={mode}
        parcela={selectedParcela}
      />

      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {deleteTarget?.type === "financeiro" ? "Excluir lançamento?" : "Excluir parcela?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
