import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NAV_MODULES } from "@/components/layout/nav-modules";
import { getMode, getUser } from "@/lib/session";
import { cn } from "@/lib/utils";

export default async function OverviewPage() {
  const user = await getUser();
  const mode = await getMode();
  const modules = NAV_MODULES.filter((m) => m.href !== "/");

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          Olá, {user?.nome ?? "visitante"}
        </h1>
        {mode === "mock" && (
          <Badge variant="warning" className="h-auto gap-2 rounded-full px-3 py-1">
            <span className="bg-warning-foreground size-1.5 rounded-full" />
            Ambiente de Protótipo
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <Card key={module.href} className="relative gap-4 p-6">
              {!module.available && (
                <span className="bg-muted text-muted-foreground absolute top-4 right-4 rounded px-2 py-1 text-[11px] font-medium">
                  Fase {module.phase}
                </span>
              )}
              <div
                className={cn(
                  "flex size-11 items-center justify-center rounded-lg",
                  module.available
                    ? "bg-muted text-ring"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <Icon className="size-5" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-base font-semibold">{module.title}</h3>
                <div className="flex items-center gap-2 text-sm">
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      module.available ? "bg-success-foreground" : "bg-border"
                    )}
                  />
                  <span
                    className={cn(
                      module.available
                        ? "text-success-foreground font-medium"
                        : "text-muted-foreground"
                    )}
                  >
                    {module.available ? "Disponível" : "Ainda não implementado"}
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
