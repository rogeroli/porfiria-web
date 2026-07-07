import { AuthSession } from '../types/auth';

const AUTH_SESSION_KEY = '@porfiria-academy/auth-session';

export function saveAuthSession(session: AuthSession): void {
  if (typeof window === 'undefined') {
    return;
  }

  const expiresAt = Date.now() + session.expiresIn * 1000;

  window.localStorage.setItem(
    AUTH_SESSION_KEY,
    JSON.stringify({
      ...session,
      expiresAt,
    }),
  );
}

export function getAuthSession(): (AuthSession & { expiresAt: number }) | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const storedSession = window.localStorage.getItem(AUTH_SESSION_KEY);

  if (!storedSession) {
    return null;
  }

  try {
    return JSON.parse(storedSession) as AuthSession & { expiresAt: number };
  } catch {
    clearAuthSession();
    return null;
  }
}

export function getAccessToken(): string | null {
  return getAuthSession()?.accessToken ?? null;
}

export function getRefreshToken(): string | null {
  return getAuthSession()?.refreshToken ?? null;
}

export function clearAuthSession(): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(AUTH_SESSION_KEY);
}
