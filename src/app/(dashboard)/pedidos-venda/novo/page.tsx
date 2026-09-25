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
import { createPedido, createPedidoItem } from "@/lib/api/pedido-venda";

interface ItemDraft {
  codigoProduto: string;
  descricaoProduto: string;
  quantidade: string;
  valorUnitario: string;
}

const EMPTY_ITEM: ItemDraft = {
  codigoProduto: "",
  descricaoProduto: "",
  quantidade: "",
  valorUnitario: "",
};

export default function NovoPedidoVendaPage() {
  const { mode } = useMode();
  const router = useRouter();
  const [codigoPessoa, setCodigoPessoa] = useState("");
  const [nomePessoa, setNomePessoa] = useState("");
  const [dataEmissao, setDataEmissao] = useState("");
  const [itens, setItens] = useState<ItemDraft[]>([{ ...EMPTY_ITEM }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addItem = () => setItens((prev) => [...prev, { ...EMPTY_ITEM }]);

  const removeItem = (index: number) =>
    setItens((prev) => prev.filter((_, i) => i !== index));

  const updateItem = (index: number, patch: Partial<ItemDraft>) =>
    setItens((prev) => prev.map((it, i) => (i === index ? { ...it, ...patch } : it)));

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (
      !codigoPessoa ||
      itens.some((it) => !it.descricaoProduto || !it.quantidade || !it.valorUnitario)
    ) {
      toast.error("Preencha o cliente e todos os itens.");
      return;
    }
    setIsSubmitting(true);
    try {
      const pedido = await createPedido(mode, {
        codigoPessoa: Number(codigoPessoa),
        nomePessoa: nomePessoa || undefined,
        dataEmissao: dataEmissao || undefined,
      });
      // A API não tem endpoint "completo" para pedido de venda — os itens
      // são inseridos um a um após o cabeçalho existir.
      for (let i = 0; i < itens.length; i++) {
        const item = itens[i];
        await createPedidoItem(mode, pedido.idmaster, {
          item: i + 1,
          codigoProduto: item.codigoProduto ? Number(item.codigoProduto) : undefined,
          descricaoProduto: item.descricaoProduto,
          quantidade: Number(item.quantidade),
          valorUnitario: Number(item.valorUnitario),
        });
      }
      toast.success("Pedido criado.");
      router.push(`/pedidos-venda/${pedido.idmaster}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao criar pedido.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Novo pedido de venda</h1>
        <p className="text-muted-foreground text-sm">
          Cria o cabeçalho do pedido e, em seguida, cada item informado.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Dados gerais</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="codigoPessoa">Código do cliente</Label>
              <Input
                id="codigoPessoa"
                inputMode="numeric"
                value={codigoPessoa}
                onChange={(e) => setCodigoPessoa(e.target.value)}
                required
              />
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
            <div className="col-span-2 flex flex-col gap-2">
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
              <CardTitle className="text-base">Itens</CardTitle>
              <CardDescription>Ao menos um item é necessário.</CardDescription>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addItem}>
              <Plus /> Adicionar
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {itens.map((item, index) => (
              <div key={index} className="flex flex-col gap-3 rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-xs font-medium">
                    Item {index + 1}
                  </span>
                  {itens.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(index)}
                    >
                      <Trash2 />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="col-span-2 flex flex-col gap-2 sm:col-span-1">
                    <Label>Código do produto</Label>
                    <Input
                      inputMode="numeric"
                      value={item.codigoProduto}
                      onChange={(e) =>
                        updateItem(index, { codigoProduto: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-span-2 flex flex-col gap-2">
                    <Label>Descrição</Label>
                    <Input
                      value={item.descricaoProduto}
                      onChange={(e) =>
                        updateItem(index, { descricaoProduto: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Quantidade</Label>
                    <Input
                      inputMode="decimal"
                      value={item.quantidade}
                      onChange={(e) => updateItem(index, { quantidade: e.target.value })}
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
                        value={item.valorUnitario}
                        onChange={(e) =>
                          updateItem(index, { valorUnitario: e.target.value })
                        }
                        className="pl-8"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            render={<Link href="/pedidos-venda" />}
            nativeButton={false}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar pedido"}
          </Button>
        </div>
      </form>
    </div>
  );
}
