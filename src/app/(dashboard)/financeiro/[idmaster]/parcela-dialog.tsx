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
import type { FinanceiroParcela } from "@/lib/types/financeiro";
import { createParcela, updateParcela } from "@/lib/api/financeiro";

interface ParcelaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dataMode: DataMode;
  idmaster: number;
  parcela?: FinanceiroParcela | null;
  nextParcelaNumber: number;
  onSaved: () => void;
}

// O formulário é isolado num subcomponente remontado por `key` sempre que o
// diálogo abre para uma parcela diferente — assim o estado inicial já nasce
// correto, sem precisar de um efeito para "resetar" os campos.
export function ParcelaDialog(props: ParcelaDialogProps) {
  const { open, onOpenChange, parcela } = props;
  const formKey = open ? (parcela ? `${parcela.parcela}-${parcela.subparcela}` : "new") : "closed";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <ParcelaForm key={formKey} {...props} />
      </DialogContent>
    </Dialog>
  );
}

function ParcelaForm({
  onOpenChange,
  dataMode,
  idmaster,
  parcela,
  nextParcelaNumber,
  onSaved,
}: ParcelaDialogProps) {
  const isEdit = Boolean(parcela);
  const [valor, setValor] = useState(
    parcela?.valor !== undefined ? String(parcela.valor) : ""
  );
  const [datavencimento, setDatavencimento] = useState(parcela?.datavencimento ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!valor || !datavencimento) {
      toast.error("Informe valor e vencimento.");
      return;
    }
    setIsSubmitting(true);
    try {
      if (isEdit && parcela) {
        await updateParcela(dataMode, idmaster, parcela.parcela, parcela.subparcela, {
          valor: Number(valor),
          datavencimento,
        });
        toast.success("Parcela atualizada.");
      } else {
        await createParcela(dataMode, {
          idmaster,
          parcela: nextParcelaNumber,
          subparcela: 0,
          valor: Number(valor),
          datavencimento,
        });
        toast.success("Parcela criada.");
      }
      onOpenChange(false);
      onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar parcela.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{isEdit ? "Editar parcela" : "Nova parcela"}</DialogTitle>
        <DialogDescription>
          {isEdit
            ? `Parcela ${parcela?.parcela}/${parcela?.subparcela}`
            : `Será criada como parcela ${nextParcelaNumber}/0.`}
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="parcela-valor">Valor</Label>
          <div className="relative">
            <span className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 font-mono text-sm">
              R$
            </span>
            <Input
              id="parcela-valor"
              inputMode="decimal"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="parcela-vencimento">Vencimento</Label>
          <Input
            id="parcela-vencimento"
            type="date"
            value={datavencimento}
            onChange={(e) => setDatavencimento(e.target.value)}
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar"}
        </Button>
      </DialogFooter>
    </>
  );
}
