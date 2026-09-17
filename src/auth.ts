import { NAVER_CALLBACK_PATH, naverCallbackUrl } from "./config";

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
  try {
    const configured = new URL(naverCallbackUrl(), window.location.origin).pathname
      .replace(/\/+$/, "")
      .toLowerCase();
    if (current === configured) return true;
  } catch {
    /* 아래 기본 경로만 본다 */
  }
  return (
    current === NAVER_CALLBACK_PATH.toLowerCase() ||
    current === "/oauth/login" ||
    current === "/oauthlogin" ||
    current === "/oauth"
  );
}
