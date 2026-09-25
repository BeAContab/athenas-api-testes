import { NextRequest, NextResponse } from "next/server";
import { ATHENAS_API_BASE_URL } from "@/lib/config";
import { createSession } from "@/lib/session";
import { MOCK_USER } from "@/lib/mocks/auth";
import type { AthenasUser } from "@/lib/types/auth";

interface LoginBody {
  mode: "real" | "mock";
  usuario?: string;
  senha?: string;
  sub?: string;
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as LoginBody | null;

  if (!body || (body.mode !== "real" && body.mode !== "mock")) {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }

  if (body.mode === "mock") {
    await createSession({ user: MOCK_USER, mode: "mock" });
    return NextResponse.json({ user: MOCK_USER });
  }

  const { usuario, senha, sub } = body;
  if (!usuario || !senha) {
    return NextResponse.json(
      { error: "Usuário e senha são obrigatórios." },
      { status: 400 }
    );
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${ATHENAS_API_BASE_URL}/usuarios/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        sub: sub || "localhost",
      },
      body: JSON.stringify({ login: usuario, password: senha }),
    });
  } catch {
    return NextResponse.json(
      { error: "Não foi possível conectar à API Athenas." },
      { status: 502 }
    );
  }

  if (!upstream.ok) {
    const detail = await upstream.text().catch(() => "");
    // Repassa a mensagem da API (ex.: "Campos de autenticação faltando")
    // para o usuário saber se o problema é credencial ou formato da requisição.
    let reason = detail.slice(0, 200);
    try {
      const parsed = JSON.parse(detail) as { message?: string };
      if (parsed.message) reason = parsed.message;
    } catch {
      // resposta não-JSON: mantém o texto bruto truncado
    }
    return NextResponse.json(
      {
        error: `Falha na autenticação (HTTP ${upstream.status})${reason ? `: ${reason}` : "."}`,
        detail,
      },
      { status: upstream.status }
    );
  }

  const data = (await upstream.json().catch(() => ({}))) as Record<string, unknown>;
  const token =
    (data.token as string | undefined) ??
    (data.accessToken as string | undefined) ??
    (data.access_token as string | undefined) ??
    ((data.data as Record<string, unknown> | undefined)?.token as string | undefined);

  if (!token) {
    return NextResponse.json(
      { error: "Resposta de autenticação inesperada da API Athenas." },
      { status: 502 }
    );
  }

  const user: AthenasUser = {
    nome: (data.nome as string) ?? (data.usuario as string) ?? usuario,
    usuario,
  };

  await createSession({ token, user, mode: "real" });
  return NextResponse.json({ user });
}
