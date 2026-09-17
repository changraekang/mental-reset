/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAVER_CLIENT_ID: string;
  readonly VITE_APP_NAVER_CALLBACK_LOGIN_URL: string;
  readonly VITE_KAKAO_JS_KEY: string;
  readonly VITE_API_BASE: string;
  readonly VITE_SITE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

type NaverImplicitLogin = {
  getUniqState: () => string;
  setState: (state: string) => void;
  init_naver_id_login: () => void;
};

type KakaoSharePayload = {
  objectType: "feed";
  content: {
    title: string;
    description: string;
    imageUrl: string;
    link: { mobileWebUrl: string; webUrl: string };
  };
  buttons: Array<{
    title: string;
    link: { mobileWebUrl: string; webUrl: string };
  }>;
};

type KakaoSDK = {
  isInitialized: () => boolean;
  init: (key: string) => void;
  Share?: { sendDefault: (payload: KakaoSharePayload) => void };
  Link?: { sendDefault: (payload: KakaoSharePayload) => void };
};

interface Window {
  naver_id_login?: new (clientId: string, callbackUrl: string) => NaverImplicitLogin;
  Kakao?: KakaoSDK;
}
