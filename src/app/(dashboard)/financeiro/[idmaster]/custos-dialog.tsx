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
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { DataMode } from "@/lib/types/auth";
import type { ParcelaRef } from "@/lib/types/financeiro";
import { createCusto, deleteCusto, getCusto, updateCusto } from "@/lib/api/financeiro";

interface CustosDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dataMode: DataMode;
  parcela: ParcelaRef | null;
}

// A API real consulta/edita um custo por vez (idmaster + parcela + subparcela
// + id), sem endpoint de listagem — por isso este diálogo é um buscar/editar
// por ID, não uma tabela. O formulário é remontado por `key` a cada
// abertura/parcela para nascer limpo, sem precisar de um efeito de reset.
export function CustosDialog({ open, onOpenChange, dataMode, parcela }: CustosDialogProps) {
  const formKey = open && parcela ? `${parcela.parcela}-${parcela.subparcela}` : "closed";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <CustosForm
          key={formKey}
          onOpenChange={onOpenChange}
          dataMode={dataMode}
          parcela={parcela}
        />
      </DialogContent>
    </Dialog>
  );
}

function CustosForm({
  onOpenChange,
  dataMode,
  parcela,
}: Omit<CustosDialogProps, "open">) {
  const [custoId, setCustoId] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [foundId, setFoundId] = useState<number | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  const handleSearch = async () => {
    if (!parcela || !custoId) {
      toast.error("Informe o ID do custo.");
      return;
    }
    setIsBusy(true);
    try {
      const custo = await getCusto(dataMode, { ...parcela, id: Number(custoId) });
      setDescricao(custo.descricao ?? "");
      setValor(custo.valor !== undefined ? String(custo.valor) : "");
      setFoundId(custo.id);
      toast.success("Custo carregado.");
    } catch (err) {
      setFoundId(null);
      toast.error(err instanceof Error ? err.message : "Custo não encontrado.");
    } finally {
      setIsBusy(false);
    }
  };

  const handleSave = async () => {
    if (!parcela) return;
    setIsBusy(true);
    try {
      if (foundId) {
        await updateCusto(dataMode, {
          ...parcela,
          id: foundId,
          descricao,
          valor: valor ? Number(valor) : undefined,
        });
        toast.success("Custo atualizado.");
      } else {
        const created = await createCusto(dataMode, {
          ...parcela,
          descricao,
          valor: valor ? Number(valor) : undefined,
        });
        setFoundId(created.id);
        setCustoId(String(created.id));
        toast.success("Custo criado.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar custo.");
    } finally {
      setIsBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!parcela || !foundId) return;
    setIsBusy(true);
    try {
      await deleteCusto(dataMode, { ...parcela, id: foundId });
      toast.success("Custo excluído.");
      setFoundId(null);
      setCustoId("");
      setDescricao("");
      setValor("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao excluir custo.");
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Custos da parcela</DialogTitle>
        <DialogDescription>
          {parcela ? `Parcela ${parcela.parcela}/${parcela.subparcela} — ` : ""}
          busque um custo existente pelo ID ou preencha os campos para criar um novo.
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col gap-4">
        <div className="flex items-end gap-3">
          <div className="flex flex-1 flex-col gap-2">
            <Label htmlFor="custo-id">ID do custo</Label>
            <div className="relative">
              <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
              <Input
                id="custo-id"
                inputMode="numeric"
                value={custoId}
                onChange={(e) => {
                  setCustoId(e.target.value);
                  setFoundId(null);
                }}
                placeholder="Ex: 4"
                className="pl-8"
              />
            </div>
          </div>
          <Button type="button" variant="outline" onClick={handleSearch} disabled={isBusy}>
            Buscar
          </Button>
        </div>

        <Separator />

        <div className="flex flex-col gap-2">
          <Label htmlFor="custo-descricao">Descrição</Label>
          <Input
            id="custo-descricao"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="custo-valor">Valor</Label>
          <div className="relative">
            <span className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 font-mono text-sm">
              R$
            </span>
            <Input
              id="custo-valor"
              inputMode="decimal"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </div>

      <DialogFooter className="justify-between sm:justify-between">
        <Button
          type="button"
          variant="ghost"
          className="text-destructive"
          onClick={handleDelete}
          disabled={isBusy || !foundId}
        >
          Excluir
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          <Button onClick={handleSave} disabled={isBusy}>
            {foundId ? "Atualizar" : "Criar"}
          </Button>
        </div>
      </DialogFooter>
    </>
  );
}
