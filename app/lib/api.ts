import {
  clearSession,
  getSession,
  saveSession,
  type AuthSession,
} from "./session";

const apiUrl =
  (import.meta.env.VITE_API_URL as string | undefined) ??
  "http://localhost:3000";
interface ApiEnvelope<T> {
  data: T;
}
interface ApiErrorEnvelope {
  error?: { message?: string };
}

async function refreshSession(): Promise<AuthSession> {
  const current = getSession();
  if (!current) throw new Error("You are not signed in");
  const response = await fetch(`${apiUrl}/api/v1/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: current.refreshToken }),
  });
  if (!response.ok) {
    clearSession();
    throw new Error("Your session has expired. Please sign in again.");
  }
  const body = (await response.json()) as ApiEnvelope<AuthSession>;
  saveSession(body.data);
  return body.data;
}

async function request<T>(
  path: string,
  init: RequestInit = {},
  retry = true
): Promise<T> {
  const session = getSession();
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  if (session) headers.set("Authorization", `Bearer ${session.accessToken}`);
  const response = await fetch(`${apiUrl}${path}`, { ...init, headers });
  if (response.status === 401 && retry && session) {
    await refreshSession();
    return request<T>(path, init, false);
  }
  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as ApiErrorEnvelope;
    throw new Error(body.error?.message ?? "The request failed");
  }
  if (response.status === 204) return undefined as T;
  const body = (await response.json()) as ApiEnvelope<T>;
  return body.data;
}

export function signIn(email: string, password: string): Promise<AuthSession> {
  return request<AuthSession>(
    "/api/v1/auth/sign-in",
    { method: "POST", body: JSON.stringify({ email, password }) },
    false
  );
}

export function requestPasswordReset(email: string): Promise<void> {
  return request<void>(
    "/api/v1/auth/forgot-password",
    { method: "POST", body: JSON.stringify({ email }) },
    false
  );
}

export interface SignUpResult {
  user: { id: string; email?: string } | null;
  profile: {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    created_at: string;
  } | null;
  session: AuthSession | null;
  requiresEmailConfirmation: boolean;
}

export function signUp(
  email: string,
  password: string,
  fullName?: string
): Promise<SignUpResult> {
  return request<SignUpResult>(
    "/api/v1/auth/sign-up",
    {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        fullName: fullName || undefined,
      }),
    },
    false
  );
}

export interface Workspace {
  id: string;
  name: string;
  created_by: string;
  created_at: string;
  role: "owner" | "admin" | "member";
}
export function listWorkspaces(): Promise<Workspace[]> {
  return request<Workspace[]>("/api/v1/workspaces");
}
export function createWorkspace(name: string): Promise<Workspace> {
  return request<Workspace>("/api/v1/workspaces", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export function deleteWorkspace(workspaceId: string): Promise<void> {
  return request<void>(`/api/v1/workspaces/${workspaceId}`, {
    method: "DELETE",
  });
}

export interface WorkspaceMember {
  workspace_id: string;
  user_id: string;
  role: "owner" | "admin" | "member";
  joined_at: string;
  profile?: {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

export function listWorkspaceMembers(
  workspaceId: string
): Promise<WorkspaceMember[]> {
  return request<WorkspaceMember[]>(
    `/api/v1/workspaces/${workspaceId}/members`
  );
}

export function addWorkspaceMember(
  workspaceId: string,
  userId: string,
  role: "admin" | "member" = "member"
): Promise<WorkspaceMember> {
  return request<WorkspaceMember>(`/api/v1/workspaces/${workspaceId}/members`, {
    method: "POST",
    body: JSON.stringify({ userId, role }),
  });
}

export function updateWorkspaceMember(
  workspaceId: string,
  memberId: string,
  role: "admin" | "member"
): Promise<WorkspaceMember> {
  return request<WorkspaceMember>(
    `/api/v1/workspaces/${workspaceId}/members/${memberId}`,
    {
      method: "PATCH",
      body: JSON.stringify({ role }),
    }
  );
}

export function removeWorkspaceMember(
  workspaceId: string,
  memberId: string
): Promise<void> {
  return request<void>(
    `/api/v1/workspaces/${workspaceId}/members/${memberId}`,
    { method: "DELETE" }
  );
}
