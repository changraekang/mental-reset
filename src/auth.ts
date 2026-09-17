const TOKEN_KEY = "mental-reset.token";
const NAME_KEY = "mental-reset.name";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getAuthName() {
  return localStorage.getItem(NAME_KEY);
}

export function setAuth(token: string, name?: string) {
  localStorage.setItem(TOKEN_KEY, token);
  if (name) localStorage.setItem(NAME_KEY, name);
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(NAME_KEY);
}

export function authHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function isNaverCallbackPath() {
  const current = window.location.pathname.replace(/\/+$/, "").toLowerCase();
  const configured = import.meta.env.VITE_APP_NAVER_CALLBACK_LOGIN_URL;
  if (configured) {
    try {
      const path = new URL(configured, window.location.origin).pathname
        .replace(/\/+$/, "")
        .toLowerCase();
      if (path && current === path) return true;
    } catch {
      /* 잘못된 URL이면 아래 기본 경로만 본다 */
    }
  }
  return current === "/oauth/login" || current === "/oauthlogin" || current === "/oauth";
}
