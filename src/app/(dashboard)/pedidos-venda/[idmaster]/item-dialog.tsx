"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { DataMode } from "@/lib/types/auth";
import { createPedidoItem } from "@/lib/api/pedido-venda";

interface ItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dataMode: DataMode;
  idmaster: number;
  nextItemNumber: number;
  onSaved: () => void;
}

// Remontado por `key` a cada abertura para nascer com o estado limpo, sem
// precisar de um efeito de reset (mesmo padrão do módulo Financeiro).
export function ItemDialog(props: ItemDialogProps) {
  const { open, onOpenChange } = props;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <ItemForm key={open ? "open" : "closed"} {...props} />
      </DialogContent>
    </Dialog>
  );
}

function ItemForm({
  onOpenChange,
  dataMode,
  idmaster,
  nextItemNumber,
  onSaved,
}: ItemDialogProps) {
  const [codigoProduto, setCodigoProduto] = useState("");
  const [descricaoProduto, setDescricaoProduto] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [valorUnitario, setValorUnitario] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!descricaoProduto || !quantidade || !valorUnitario) {
      toast.error("Preencha descrição, quantidade e valor unitário.");
      return;
    }
    setIsSubmitting(true);
    try {
      await createPedidoItem(dataMode, idmaster, {
        item: nextItemNumber,
        codigoProduto: codigoProduto ? Number(codigoProduto) : undefined,
        descricaoProduto,
        quantidade: Number(quantidade),
        valorUnitario: Number(valorUnitario),
      });
      toast.success("Item adicionado.");
      onOpenChange(false);
      onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao adicionar item.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Novo item</DialogTitle>
        <DialogDescription>
          Será criado como item {nextItemNumber} do pedido.
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="item-codigo">Código do produto</Label>
          <Input
            id="item-codigo"
            inputMode="numeric"
            value={codigoProduto}
            onChange={(e) => setCodigoProduto(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="item-descricao">Descrição</Label>
          <Input
            id="item-descricao"
            value={descricaoProduto}
            onChange={(e) => setDescricaoProduto(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="item-quantidade">Quantidade</Label>
            <Input
              id="item-quantidade"
              inputMode="decimal"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="item-valor">Valor unitário</Label>
            <div className="relative">
              <span className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 font-mono text-sm">
                R$
              </span>
              <Input
                id="item-valor"
                inputMode="decimal"
                value={valorUnitario}
                onChange={(e) => setValorUnitario(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Adicionar"}
        </Button>
      </DialogFooter>
    </>
  );
}
