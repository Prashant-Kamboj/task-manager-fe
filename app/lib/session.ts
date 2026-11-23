export interface SessionUser {
  id: string;
  email?: string;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  expiresAt?: number;
  tokenType: string;
  user: SessionUser;
}

const storageKey = "task-manager.session";

export function getSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(storageKey);
  if (!value) return null;
  try {
    return JSON.parse(value) as AuthSession;
  } catch {
    window.localStorage.removeItem(storageKey);
    return null;
  }
}

export function saveSession(session: AuthSession): void {
  window.localStorage.setItem(storageKey, JSON.stringify(session));
}
export function clearSession(): void {
  window.localStorage.removeItem(storageKey);
}
