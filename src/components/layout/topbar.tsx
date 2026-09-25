import { Bell } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ModeToggle } from "@/components/layout/mode-toggle";
import { UserMenu } from "@/components/layout/user-menu";
import type { AthenasUser } from "@/lib/types/auth";

export function Topbar({ user }: { user: AthenasUser }) {
  return (
    <header className="bg-background flex h-14 shrink-0 items-center justify-between border-b px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-5" />
        <span className="text-sm font-medium">Athenas Dashboard</span>
      </div>
      <div className="flex items-center gap-3">
        <ModeToggle />
        <Separator orientation="vertical" className="h-5" />
        <Tooltip>
          <TooltipTrigger render={<Button variant="ghost" size="icon" />}>
            <Bell className="size-4" />
          </TooltipTrigger>
          <TooltipContent>Notificações (em breve)</TooltipContent>
        </Tooltip>
        <UserMenu user={user} />
      </div>
    </header>
  );
}
