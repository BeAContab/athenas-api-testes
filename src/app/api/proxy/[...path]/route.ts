import { NextRequest, NextResponse } from "next/server";
import { ATHENAS_API_BASE_URL } from "@/lib/config";
import { getMode, getToken } from "@/lib/session";

async function handler(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const mode = await getMode();
  if (mode !== "real") {
    return NextResponse.json(
      { error: "Proxy disponível apenas no modo Real. Alterne o modo para continuar." },
      { status: 409 }
    );
  }

  const token = await getToken();
  if (!token) {
    return NextResponse.json(
      { error: "Sessão expirada. Faça login novamente." },
      { status: 401 }
    );
  }

  const { path } = await params;
  const upstreamUrl = new URL(`${ATHENAS_API_BASE_URL}/${path.join("/")}`);
  request.nextUrl.searchParams.forEach((value, key) => {
    upstreamUrl.searchParams.append(key, value);
  });

  const init: RequestInit = {
    method: request.method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": request.headers.get("content-type") ?? "application/json",
    },
  };

  if (!["GET", "HEAD"].includes(request.method)) {
    init.body = await request.text();
  }

  let upstream: Response;
  try {
    upstream = await fetch(upstreamUrl, init);
  } catch {
    return NextResponse.json(
      { error: "Não foi possível conectar à API Athenas." },
      { status: 502 }
    );
  }

  const text = await upstream.text();
  return new NextResponse(text, {
    status: upstream.status,
    headers: {
      "Content-Type": upstream.headers.get("content-type") ?? "application/json",
    },
  });
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as DELETE,
  handler as PATCH,
};
