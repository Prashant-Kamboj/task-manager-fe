import { getAuthSession } from "./session.server";
import type { AuthSession } from "./session";

const apiUrl = process.env.VITE_API_URL ?? "http://localhost:3000";
type Envelope<T> = { data: T };

async function serverRequest<T>(request: Request, path: string, init: RequestInit = {}): Promise<T> {
  const session = await getAuthSession(request);
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  if (session) headers.set("Authorization", `Bearer ${session.accessToken}`);
  const response = await fetch(`${apiUrl}${path}`, { ...init, headers });
  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: { message?: string } };
    throw new Error(body.error?.message ?? "The request failed");
  }
  if (response.status === 204) return undefined as T;
  return ((await response.json()) as Envelope<T>).data;
}

export function signIn(request: Request, email: string, password: string) {
  return requestApi<AuthSession>(request, "/api/v1/auth/sign-in", { method: "POST", body: JSON.stringify({ email, password }) });
}

export function signUp(request: Request, email: string, password: string, fullName?: string) {
  return requestApi<SignUpResult>(request, "/api/v1/auth/sign-up", { method: "POST", body: JSON.stringify({ email, password, fullName: fullName || undefined }) });
}

export function requestPasswordReset(request: Request, email: string) {
  return requestApi<void>(request, "/api/v1/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) });
}

async function requestApi<T>(request: Request, path: string, init: RequestInit) {
  return serverRequest<T>(request, path, init);
}

export interface SignUpResult {
  user: { id: string; email?: string } | null;
  profile: { id: string; email: string; full_name: string | null; avatar_url: string | null; created_at: string } | null;
  session: AuthSession | null;
  requiresEmailConfirmation: boolean;
}
export interface Workspace { id: string; name: string; created_by: string; created_at: string; role: "owner" | "admin" | "member"; }
export interface WorkspaceMember { workspace_id: string; user_id: string; role: "owner" | "admin" | "member"; joined_at: string; profile?: { id: string; email: string; full_name: string | null; avatar_url: string | null }; }

export function listWorkspaces(request: Request) { return requestApi<Workspace[]>(request, "/api/v1/workspaces", {}); }
export function createWorkspace(request: Request, name: string) { return requestApi<Workspace>(request, "/api/v1/workspaces", { method: "POST", body: JSON.stringify({ name }) }); }
export function deleteWorkspace(request: Request, id: string) { return requestApi<void>(request, `/api/v1/workspaces/${id}`, { method: "DELETE" }); }
export function listWorkspaceMembers(request: Request, id: string) { return requestApi<WorkspaceMember[]>(request, `/api/v1/workspaces/${id}/members`, {}); }
export function addWorkspaceMember(request: Request, workspaceId: string, userId: string, role: "admin" | "member" = "member") { return requestApi<WorkspaceMember>(request, `/api/v1/workspaces/${workspaceId}/members`, { method: "POST", body: JSON.stringify({ userId, role }) }); }
export function updateWorkspaceMember(request: Request, workspaceId: string, memberId: string, role: "admin" | "member") { return requestApi<WorkspaceMember>(request, `/api/v1/workspaces/${workspaceId}/members/${memberId}`, { method: "PATCH", body: JSON.stringify({ role }) }); }
export function removeWorkspaceMember(request: Request, workspaceId: string, memberId: string) { return requestApi<void>(request, `/api/v1/workspaces/${workspaceId}/members/${memberId}`, { method: "DELETE" }); }
