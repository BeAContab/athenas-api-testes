import {
  Factory,
  LayoutDashboard,
  Landmark,
  Package,
  ReceiptText,
  ShieldCheck,
  ShoppingCart,
  UserCog,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface NavModule {
  title: string;
  href: string;
  phase: number;
  available: boolean;
  icon: LucideIcon;
}

// Espelha as fases do plano de desenvolvimento — cada módulo passa a
// "available: true" quando sua fase é implementada.
export const NAV_MODULES: NavModule[] = [
  { title: "Visão Geral", href: "/", phase: 0, available: true, icon: LayoutDashboard },
  { title: "Financeiro", href: "/financeiro", phase: 1, available: true, icon: Landmark },
  { title: "Pedidos de Venda", href: "/pedidos-venda", phase: 2, available: true, icon: ShoppingCart },
  { title: "Produtos e Estoque", href: "/produtos-estoque", phase: 3, available: true, icon: Package },
  { title: "Pessoas", href: "/pessoas", phase: 4, available: false, icon: Users },
  { title: "Industrial", href: "/industrial", phase: 5, available: false, icon: Factory },
  { title: "Fiscal / Contábil", href: "/fiscal-contabil", phase: 5, available: false, icon: ReceiptText },
  { title: "Administração", href: "/administracao", phase: 5, available: false, icon: ShieldCheck },
  { title: "RH", href: "/rh", phase: 5, available: false, icon: UserCog },
];
