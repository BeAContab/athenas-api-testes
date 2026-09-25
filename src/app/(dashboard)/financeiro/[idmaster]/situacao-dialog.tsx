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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DataMode } from "@/lib/types/auth";
import type { ParcelaRef } from "@/lib/types/financeiro";
import { alterarSituacaoParcelas } from "@/lib/api/financeiro";

const SITUACOES = ["aberto", "liquidado", "estornado", "cancelado"];

interface SituacaoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dataMode: DataMode;
  parcela: ParcelaRef | null;
  onSaved: () => void;
}

export function SituacaoDialog({
  open,
  onOpenChange,
  dataMode,
  parcela,
  onSaved,
}: SituacaoDialogProps) {
  const [situacao, setSituacao] = useState("aberto");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!parcela) return;
    setIsSubmitting(true);
    try {
      await alterarSituacaoParcelas(dataMode, [parcela], situacao);
      toast.success("Situação atualizada.");
      onOpenChange(false);
      onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao alterar situação.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Alterar situação</DialogTitle>
          <DialogDescription>
            {parcela ? `Parcela ${parcela.parcela}/${parcela.subparcela}` : ""}
          </DialogDescription>
        </DialogHeader>
        <Select value={situacao} onValueChange={(value) => setSituacao(String(value))}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SITUACOES.map((s) => (
              <SelectItem key={s} value={s} className="capitalize">
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
