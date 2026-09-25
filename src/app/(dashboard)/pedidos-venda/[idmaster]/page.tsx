"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle2, Plus, Trash2 } from "lucide-react";
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
import { deletePedido, finalizarPedido, getPedido } from "@/lib/api/pedido-venda";
import type { PedidoVenda } from "@/lib/types/pedido-venda";
import { formatCurrency, formatDate } from "@/lib/format";
import { ItemDialog } from "./item-dialog";

type ConfirmAction = "excluir" | "finalizar" | null;

export default function PedidoVendaDetailPage() {
  const { mode } = useMode();
  const router = useRouter();
  const params = useParams<{ idmaster: string }>();
  const idmaster = Number(params.idmaster);

  const [pedido, setPedido] = useState<PedidoVenda | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await getPedido(mode, idmaster);
      setPedido(data);
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

  const confirmDialogAction = async () => {
    if (!confirmAction) return;
    setIsConfirming(true);
    try {
      if (confirmAction === "excluir") {
        await deletePedido(mode, idmaster);
        toast.success("Pedido excluído.");
        router.push("/pedidos-venda");
        return;
      }
      await finalizarPedido(mode, idmaster);
      toast.success("Pedido finalizado.");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao processar ação.");
    } finally {
      setIsConfirming(false);
      setConfirmAction(null);
    }
  };

  const nextItemNumber = (pedido?.itens?.length ?? 0) + 1;
  const isAberto = pedido?.situacao?.toLowerCase() === "aberto";

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error || !pedido) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-muted-foreground text-sm">
          {error ?? "Pedido não encontrado."}
        </p>
        <Button
          variant="outline"
          render={<Link href="/pedidos-venda" />}
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
            Pedido #{pedido.idmaster}
          </h1>
          <p className="text-muted-foreground text-sm">
            {pedido.nomePessoa ?? `Cliente ${pedido.codigoPessoa ?? "—"}`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-destructive/40 text-destructive hover:bg-destructive/10"
            onClick={() => setConfirmAction("excluir")}
          >
            <Trash2 />
            Excluir pedido
          </Button>
          {isAberto && (
            <Button onClick={() => setConfirmAction("finalizar")}>
              <CheckCircle2 />
              Finalizar pedido
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="gap-1 p-4">
          <p className="text-muted-foreground text-xs">Emissão</p>
          <p className="text-sm font-medium">{formatDate(pedido.dataEmissao)}</p>
        </Card>
        <Card className="gap-1 p-4">
          <p className="text-muted-foreground text-xs">Valor total</p>
          <p className="font-mono text-sm font-medium">
            {formatCurrency(pedido.valorTotal)}
          </p>
        </Card>
        <Card className="gap-1 p-4">
          <p className="text-muted-foreground text-xs">Situação</p>
          <StatusBadge status={pedido.situacao} />
        </Card>
        <Card className="gap-1 p-4">
          <p className="text-muted-foreground text-xs">Código do cliente</p>
          <p className="font-mono text-sm font-medium">
            {pedido.codigoPessoa ?? "—"}
          </p>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Itens</CardTitle>
          {isAberto && (
            <Button size="sm" onClick={() => setItemDialogOpen(true)}>
              <Plus /> Novo item
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead className="text-right">Quantidade</TableHead>
                <TableHead className="text-right">Valor unitário</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pedido.itens?.length ? (
                pedido.itens.map((item) => (
                  <TableRow key={item.item}>
                    <TableCell className="font-mono font-medium">{item.item}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {item.descricaoProduto ?? "—"}
                        </span>
                        {item.codigoProduto !== undefined && (
                          <span className="text-muted-foreground font-mono text-xs">
                            #{item.codigoProduto}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {item.quantidade ?? "—"}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(item.valorUnitario)}
                    </TableCell>
                    <TableCell className="text-right font-mono font-medium">
                      {formatCurrency(item.valorTotal)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-muted-foreground text-center">
                    Nenhum item cadastrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        {pedido.itens && pedido.itens.length > 0 && (
          <div className="text-muted-foreground flex items-center justify-between border-t px-4 py-3 text-xs">
            <span>Exibindo {pedido.itens.length} de {pedido.itens.length} itens</span>
            <span className="text-foreground font-mono font-medium">
              Total: {formatCurrency(pedido.valorTotal)}
            </span>
          </div>
        )}
      </Card>

      <ItemDialog
        open={itemDialogOpen}
        onOpenChange={setItemDialogOpen}
        dataMode={mode}
        idmaster={idmaster}
        nextItemNumber={nextItemNumber}
        onSaved={load}
      />

      <AlertDialog
        open={Boolean(confirmAction)}
        onOpenChange={(open) => !open && setConfirmAction(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction === "excluir" ? "Excluir pedido?" : "Finalizar pedido?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction === "excluir"
                ? "Esta ação não pode ser desfeita."
                : "Após finalizado, não será mais possível adicionar itens a este pedido."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDialogAction} disabled={isConfirming}>
              {confirmAction === "excluir" ? "Excluir" : "Finalizar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
