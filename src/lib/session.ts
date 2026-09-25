import "server-only";
import { cookies } from "next/headers";
import {
  MODE_COOKIE,
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  USER_COOKIE,
} from "@/lib/config";
import type { AthenasUser, DataMode } from "@/lib/types/auth";

const baseCookieOptions = {
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_MAX_AGE_SECONDS,
};

export async function getToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value ?? null;
}

export async function getUser(): Promise<AthenasUser | null> {
  const store = await cookies();
  const raw = store.get(USER_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AthenasUser;
  } catch {
    return null;
  }
}

export async function getMode(): Promise<DataMode> {
  const store = await cookies();
  return store.get(MODE_COOKIE)?.value === "real" ? "real" : "mock";
}

export async function createSession(opts: {
  token?: string;
  user: AthenasUser;
  mode: DataMode;
}) {
  const store = await cookies();
  if (opts.token) {
    store.set(SESSION_COOKIE, opts.token, {
      ...baseCookieOptions,
      httpOnly: true,
    });
  }
  store.set(USER_COOKIE, JSON.stringify(opts.user), {
    ...baseCookieOptions,
    httpOnly: false,
  });
  store.set(MODE_COOKIE, opts.mode, {
    ...baseCookieOptions,
    httpOnly: false,
  });
}

export async function setMode(mode: DataMode) {
  const store = await cookies();
  store.set(MODE_COOKIE, mode, { ...baseCookieOptions, httpOnly: false });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  store.delete(USER_COOKIE);
  store.delete(MODE_COOKIE);
}
