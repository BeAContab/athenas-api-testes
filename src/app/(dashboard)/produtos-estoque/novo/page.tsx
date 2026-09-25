"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMode } from "@/lib/mode-context";
import { createProduto } from "@/lib/api/produto";

const NATUREZAS = [
  { value: "materia-prima", label: "Matéria-prima" },
  { value: "acabado", label: "Produto acabado" },
  { value: "revenda", label: "Revenda" },
  { value: "servico", label: "Serviço" },
];

export default function NovoProdutoPage() {
  const { mode } = useMode();
  const router = useRouter();
  const [descricao, setDescricao] = useState("");
  const [natureza, setNatureza] = useState("revenda");
  const [unidade, setUnidade] = useState("");
  const [codigoGrupo, setCodigoGrupo] = useState("");
  const [precoVenda, setPrecoVenda] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!descricao) {
      toast.error("Informe a descrição do produto.");
      return;
    }
    setIsSubmitting(true);
    try {
      const produto = await createProduto(mode, {
        descricao,
        natureza,
        unidade: unidade || undefined,
        codigoGrupo: codigoGrupo ? Number(codigoGrupo) : undefined,
        precoVenda: precoVenda ? Number(precoVenda) : undefined,
      });
      toast.success("Produto cadastrado.");
      router.push(`/produtos-estoque/${produto.codigo}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao cadastrar produto.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Novo produto</h1>
        <p className="text-muted-foreground text-sm">
          Cadastra um novo produto no catálogo.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Dados do produto</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="col-span-2 flex flex-col gap-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Input
                id="descricao"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="natureza">Natureza</Label>
              <Select value={natureza} onValueChange={(v) => setNatureza(String(v))}>
                <SelectTrigger id="natureza" className="w-full">
                  <SelectValue />
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
            <div className="flex flex-col gap-2">
              <Label htmlFor="unidade">Unidade</Label>
              <Input
                id="unidade"
                placeholder="Ex: SC, KG, UN"
                value={unidade}
                onChange={(e) => setUnidade(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="codigoGrupo">Código do grupo</Label>
              <Input
                id="codigoGrupo"
                inputMode="numeric"
                value={codigoGrupo}
                onChange={(e) => setCodigoGrupo(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="precoVenda">Preço de venda</Label>
              <div className="relative">
                <span className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 font-mono text-sm">
                  R$
                </span>
                <Input
                  id="precoVenda"
                  inputMode="decimal"
                  value={precoVenda}
                  onChange={(e) => setPrecoVenda(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            render={<Link href="/produtos-estoque" />}
            nativeButton={false}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar produto"}
          </Button>
        </div>
      </form>
    </div>
  );
}
