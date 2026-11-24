import { createCookie, createSessionStorage, redirect } from "react-router";
import { Redis } from "@upstash/redis";
import type { AuthSession } from "./session";

type SessionData = { auth: AuthSession };

const redis = Redis.fromEnv();
const sessionCookie = createCookie("__task_manager_session", {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
  secrets: [process.env.SESSION_SECRET ?? "development-session-secret"],
});

const storage = createSessionStorage<SessionData>({
  cookie: sessionCookie,
  async createData(data, expires) {
    const id = crypto.randomUUID();
    const ttl = expires ? Math.max(1, Math.floor((expires.getTime() - Date.now()) / 1000)) : 60 * 60 * 24 * 30;
    await redis.set(`frontend:session:${id}`, data, { ex: ttl });
    return id;
  },
  async readData(id) {
    return redis.get<SessionData>(`frontend:session:${id}`);
  },
  async updateData(id, data, expires) {
    const ttl = expires ? Math.max(1, Math.floor((expires.getTime() - Date.now()) / 1000)) : 60 * 60 * 24 * 30;
    await redis.set(`frontend:session:${id}`, data, { ex: ttl });
  },
  async deleteData(id) {
    await redis.del(`frontend:session:${id}`);
  },
});

export const { getSession, commitSession, destroySession } = storage;

export async function getAuthSession(request: Request): Promise<AuthSession | null> {
  const session = await getSession(request.headers.get("Cookie"));
  return session.get("auth") ?? null;
}

export async function requireAuth(request: Request): Promise<AuthSession> {
  const auth = await getAuthSession(request);
  if (!auth) throw redirect(`/login?returnTo=${encodeURIComponent(new URL(request.url).pathname)}`);
  return auth;
}

export async function createAuthCookie(auth: AuthSession): Promise<string> {
  const session = await getSession(null);
  session.set("auth", auth);
  return commitSession(session);
}

export async function clearAuthCookie(request: Request): Promise<string> {
  const session = await getSession(request.headers.get("Cookie"));
  return destroySession(session);
}
