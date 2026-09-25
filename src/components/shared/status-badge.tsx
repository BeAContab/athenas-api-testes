import { Badge } from "@/components/ui/badge";

const VARIANTS: Record<
  string,
  "default" | "secondary" | "destructive" | "outline" | "success" | "warning"
> = {
  aberto: "secondary",
  liquidado: "success",
  finalizado: "success",
  estornado: "outline",
  cancelado: "destructive",
  atrasado: "destructive",
};

export function StatusBadge({ status }: { status?: string }) {
  if (!status) return <Badge variant="outline">—</Badge>;
  const variant = VARIANTS[status.toLowerCase()] ?? "outline";
  return (
    <Badge variant={variant} className="capitalize">
      {status}
    </Badge>
  );
}
