const PROD_API = "https://api.sparkling-rae.com";
const PROD_NAVER_CLIENT_ID = "p96Rvd0TGKL2i0VfH81s";
const PROD_KAKAO_JS_KEY = "4056626004790c74276d8fbe866ad653";
export const NAVER_CALLBACK_PATH = "/Oauth/login";

function env(name: keyof ImportMetaEnv) {
  const value = import.meta.env[name];
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

export function apiBase() {
  return (
    env("VITE_API_BASE") ||
    (import.meta.env.DEV ? "http://localhost:4000" : PROD_API)
  ).replace(/\/$/, "");
}

export function naverClientId() {
  return env("VITE_APP_NAVER_CLIENT_ID") || PROD_NAVER_CLIENT_ID;
}

export function naverCallbackUrl() {
  const origin = window.location.origin;
  const fallback = `${origin}${NAVER_CALLBACK_PATH}`;
  const configured = env("VITE_APP_NAVER_CALLBACK_LOGIN_URL");
  if (!configured) return fallback;
  try {
    const url = new URL(configured, origin);
    if (url.hostname === "localhost" && window.location.hostname !== "localhost") {
      return fallback;
    }
    return url.toString();
  } catch {
    return fallback;
  }
}

export function kakaoJsKey() {
  return env("VITE_KAKAO_JS_KEY") || PROD_KAKAO_JS_KEY;
}
