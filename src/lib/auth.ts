const TOKEN_KEY = "token";
const ACCESS_TOKEN_KEY = "accessToken";
const USER_KEY = "user";
const AUTH_CHANGED_EVENT = "auth:changed";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  avatar?: string;
  plan?: string;
}

function notifyAuthChanged() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem(TOKEN_KEY) ||
    localStorage.getItem(ACCESS_TOKEN_KEY)
  );
}

export function setAuthToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
  notifyAuthChanged();
}

export function clearAuthToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  notifyAuthChanged();
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

export function getAuthUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function setAuthUser(user: AuthUser): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  notifyAuthChanged();
}

export function clearAuthUser(): void {
  localStorage.removeItem(USER_KEY);
  notifyAuthChanged();
}

export function logout(): void {
  clearAuthToken();
  clearAuthUser();
}
