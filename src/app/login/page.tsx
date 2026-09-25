import { Suspense } from "react";
import { LayoutDashboard } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="bg-background flex min-h-svh items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="bg-muted text-primary mx-auto mb-2 flex size-12 items-center justify-center rounded-lg">
            <LayoutDashboard className="size-6" />
          </div>
          <CardTitle className="text-2xl">Athenas Dashboard</CardTitle>
          <CardDescription>
            Painel administrativo ERP. Escolha entre o modo real para
            produção ou protótipo para testes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense>
            <LoginForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
