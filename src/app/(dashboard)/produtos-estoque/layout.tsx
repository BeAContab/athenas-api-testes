import { ProdutosEstoqueSubNav } from "./sub-nav";

export default function ProdutosEstoqueLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6">
      <ProdutosEstoqueSubNav />
      {children}
    </div>
  );
}
