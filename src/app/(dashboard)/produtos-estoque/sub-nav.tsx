"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { label: "Produtos", href: "/produtos-estoque" },
  { label: "Entradas/Saídas", href: "/produtos-estoque/entradas-saidas" },
  { label: "Movimentações", href: "/produtos-estoque/movimentacoes" },
];

export function ProdutosEstoqueSubNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 border-b">
      {SECTIONS.map((section) => {
        const isActive =
          section.href === "/produtos-estoque"
            ? pathname === "/produtos-estoque" || /^\/produtos-estoque\/(novo|\d+)/.test(pathname)
            : pathname.startsWith(section.href);
        return (
          <Link
            key={section.href}
            href={section.href}
            className={cn(
              "border-b-2 px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "border-primary text-foreground"
                : "text-muted-foreground hover:text-foreground border-transparent"
            )}
          >
            {section.label}
          </Link>
        );
      })}
    </nav>
  );
}
