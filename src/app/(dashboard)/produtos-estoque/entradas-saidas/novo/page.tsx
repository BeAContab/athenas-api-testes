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
import { createEntradaSaidaCompleto } from "@/lib/api/entrada-saida";

interface ProdutoDraft {
  codigoProduto: string;
  quantidade: string;
  valorUnitario: string;
}

const EMPTY_PRODUTO: ProdutoDraft = {
  codigoProduto: "",
  quantidade: "",
  valorUnitario: "",
};

export default function NovoEntradaSaidaPage() {
  const { mode } = useMode();
  const router = useRouter();
  const [tipo, setTipo] = useState<"entrada" | "saida">("entrada");
  const [codigoPessoa, setCodigoPessoa] = useState("");
  const [nomePessoa, setNomePessoa] = useState("");
  const [dataMovimento, setDataMovimento] = useState("");
  const [produtos, setProdutos] = useState<ProdutoDraft[]>([{ ...EMPTY_PRODUTO }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addProduto = () => setProdutos((prev) => [...prev, { ...EMPTY_PRODUTO }]);
  const removeProduto = (index: number) =>
    setProdutos((prev) => prev.filter((_, i) => i !== index));
  const updateProduto = (index: number, patch: Partial<ProdutoDraft>) =>
    setProdutos((prev) => prev.map((p, i) => (i === index ? { ...p, ...patch } : p)));

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (
      !codigoPessoa ||
      produtos.some((p) => !p.codigoProduto || !p.quantidade || !p.valorUnitario)
    ) {
      toast.error("Preencha a pessoa e todos os produtos.");
      return;
    }
    setIsSubmitting(true);
    try {
      const registro = await createEntradaSaidaCompleto(mode, {
        tipo,
        codigoPessoa: Number(codigoPessoa),
        nomePessoa: nomePessoa || undefined,
        dataMovimento: dataMovimento || undefined,
        produtos: produtos.map((p) => ({
          codigoProduto: Number(p.codigoProduto),
          quantidade: Number(p.quantidade),
          valorUnitario: Number(p.valorUnitario),
        })),
      });
      toast.success("Registro criado.");
      router.push(`/produtos-estoque/entradas-saidas/${registro.idmaster}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao criar registro.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Novo registro de entrada/saída
        </h1>
        <p className="text-muted-foreground text-sm">
          Cria a movimentação completa com os produtos informados.
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
              <Select value={tipo} onValueChange={(v) => setTipo(v as "entrada" | "saida")}>
                <SelectTrigger id="tipo" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entrada">Entrada</SelectItem>
                  <SelectItem value="saida">Saída</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="dataMovimento">Data</Label>
              <Input
                id="dataMovimento"
                type="date"
                value={dataMovimento}
                onChange={(e) => setDataMovimento(e.target.value)}
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
              <CardTitle className="text-base">Produtos</CardTitle>
              <CardDescription>Ao menos um produto é necessário.</CardDescription>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addProduto}>
              <Plus /> Adicionar
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {produtos.map((produto, index) => (
              <div key={index} className="flex items-end gap-3">
                <div className="flex flex-col gap-2">
                  <Label>Código do produto</Label>
                  <Input
                    inputMode="numeric"
                    value={produto.codigoProduto}
                    onChange={(e) =>
                      updateProduto(index, { codigoProduto: e.target.value })
                    }
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Quantidade</Label>
                  <Input
                    inputMode="decimal"
                    value={produto.quantidade}
                    onChange={(e) => updateProduto(index, { quantidade: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Valor unitário</Label>
                  <div className="relative">
                    <span className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 font-mono text-sm">
                      R$
                    </span>
                    <Input
                      inputMode="decimal"
                      value={produto.valorUnitario}
                      onChange={(e) =>
                        updateProduto(index, { valorUnitario: e.target.value })
                      }
                      className="pl-8"
                    />
                  </div>
                </div>
                {produtos.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeProduto(index)}
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
            render={<Link href="/produtos-estoque/entradas-saidas" />}
            nativeButton={false}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar registro"}
          </Button>
        </div>
      </form>
    </div>
  );
}
