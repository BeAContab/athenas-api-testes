import { NextRequest, NextResponse } from "next/server";
import { getToken, setMode } from "@/lib/session";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as { mode?: string } | null;
  const mode = body?.mode;

  if (mode !== "real" && mode !== "mock") {
    return NextResponse.json({ error: "Modo inválido." }, { status: 400 });
  }

  if (mode === "real") {
    const token = await getToken();
    if (!token) {
      return NextResponse.json(
        { error: "Faça login com suas credenciais reais para usar o modo Real." },
        { status: 409 }
      );
    }
  }

  await setMode(mode);
  return NextResponse.json({ mode });
}
