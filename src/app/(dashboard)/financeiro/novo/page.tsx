"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
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
import { useMode } from "@/lib/mode-context";
import { createFinanceiroCompleto } from "@/lib/api/financeiro";

interface ParcelaDraft {
  valor: string;
  datavencimento: string;
}

export default function NovoFinanceiroPage() {
  const { mode } = useMode();
  const router = useRouter();
  const [tipo, setTipo] = useState<"pagar" | "receber">("receber");
  const [codigoPessoa, setCodigoPessoa] = useState("");
  const [nomePessoa, setNomePessoa] = useState("");
  const [dataEmissao, setDataEmissao] = useState("");
  const [parcelas, setParcelas] = useState<ParcelaDraft[]>([
    { valor: "", datavencimento: "" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addParcela = () =>
    setParcelas((prev) => [...prev, { valor: "", datavencimento: "" }]);

  const removeParcela = (index: number) =>
    setParcelas((prev) => prev.filter((_, i) => i !== index));

  const updateParcela = (index: number, patch: Partial<ParcelaDraft>) =>
    setParcelas((prev) => prev.map((p, i) => (i === index ? { ...p, ...patch } : p)));

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!codigoPessoa || parcelas.some((p) => !p.valor || !p.datavencimento)) {
      toast.error("Preencha o código da pessoa e todas as parcelas.");
      return;
    }
    setIsSubmitting(true);
    try {
      const created = await createFinanceiroCompleto(mode, {
        tipo,
        codigoPessoa: Number(codigoPessoa),
        nomePessoa: nomePessoa || undefined,
        dataEmissao: dataEmissao || undefined,
        parcelas: parcelas.map((p, i) => ({
          parcela: i + 1,
          subparcela: 0,
          valor: Number(p.valor),
          datavencimento: p.datavencimento,
        })),
      });
      toast.success("Lançamento criado.");
      router.push(`/financeiro/${created.idmaster}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao criar lançamento.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Novo lançamento financeiro
        </h1>
        <p className="text-muted-foreground text-sm">
          Cria um lançamento com parcelas via add-financeiro-completo.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Dados gerais</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="tipo">Tipo</Label>
              <select
                id="tipo"
                className="border-input bg-background h-8 rounded-md border px-2 text-sm"
                value={tipo}
                onChange={(e) => setTipo(e.target.value as "pagar" | "receber")}
              >
                <option value="receber">Receber</option>
                <option value="pagar">Pagar</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="dataEmissao">Data de emissão</Label>
              <Input
                id="dataEmissao"
                type="date"
                value={dataEmissao}
                onChange={(e) => setDataEmissao(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="codigoPessoa">Código da pessoa</Label>
              <Input
                id="codigoPessoa"
                inputMode="numeric"
                value={codigoPessoa}
                onChange={(e) => setCodigoPessoa(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="nomePessoa">Nome (opcional)</Label>
              <Input
                id="nomePessoa"
                value={nomePessoa}
                onChange={(e) => setNomePessoa(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Parcelas</CardTitle>
              <CardDescription>Ao menos uma parcela é necessária.</CardDescription>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addParcela}>
              <Plus /> Adicionar
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {parcelas.map((parcela, index) => (
              <div key={index} className="flex items-end gap-3">
                <div className="flex flex-col gap-2">
                  <Label>Parcela {index + 1} — valor</Label>
                  <div className="relative">
                    <span className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 font-mono text-sm">
                      R$
                    </span>
                    <Input
                      inputMode="decimal"
                      value={parcela.valor}
                      onChange={(e) => updateParcela(index, { valor: e.target.value })}
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Vencimento</Label>
                  <Input
                    type="date"
                    value={parcela.datavencimento}
                    onChange={(e) =>
                      updateParcela(index, { datavencimento: e.target.value })
                    }
                  />
                </div>
                {parcelas.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeParcela(index)}
                  >
                    <Trash2 />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            render={<Link href="/financeiro" />}
            nativeButton={false}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar lançamento"}
          </Button>
        </div>
      </form>
    </div>
  );
}
