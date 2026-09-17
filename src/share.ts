import type { CardPayload } from "./types";
import { kakaoJsKey, siteUrl } from "./config";

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

function getKakao(): KakaoSDK | null {
  return window.Kakao ?? null;
}

function ensureKakao(): KakaoSDK | null {
  const Kakao = getKakao();
  const key = kakaoJsKey();
  if (!Kakao || !key) return null;
  if (!Kakao.isInitialized()) Kakao.init(key);
  return Kakao;
}

function cardShareText(card: CardPayload) {
  const tags = card.tags.filter(Boolean).join(" ");
  return [card.headline, tags, card.reframe, `지금 · ${card.action}`]
    .filter(Boolean)
    .join("\n");
}

function isKakaoCallbackAlert(message: unknown) {
  const text = String(message ?? "");
  return /Callback URL|Redirect URI|콜백/i.test(text);
}

async function sendKakaoFeed(payload: KakaoSharePayload) {
  const Kakao = ensureKakao();
  if (!Kakao?.Share?.sendDefault && !Kakao?.Link?.sendDefault) return false;

  let blocked = false;
  const originalAlert = window.alert;
  window.alert = (message) => {
    if (isKakaoCallbackAlert(message)) {
      blocked = true;
      return;
    }
    originalAlert.call(window, message);
  };
  try {
    if (Kakao.Share?.sendDefault) Kakao.Share.sendDefault(payload);
    else Kakao.Link?.sendDefault(payload);
  } catch {
    blocked = true;
  }
  await new Promise((resolve) => window.setTimeout(resolve, 600));
  window.alert = originalAlert;
  return !blocked;
}


export async function shareKakao(card: CardPayload) {
  const text = cardShareText(card);
  const url = siteUrl();
  const payload: KakaoSharePayload = {
    objectType: "feed",
    content: {
      title: card.headline ? `${card.headline}` : "멘탈 리셋",
      description: card.reframe.slice(0, 200),
      imageUrl: `${url}/favicon.png`,
      link: { mobileWebUrl: 'https://mental-reset.sparkling-rae.com', webUrl: 'https://mental-reset.sparkling-rae.com' },
    },
    buttons: [
      {
        title: "나도 멘탈 리셋",
        link  : { mobileWebUrl: 'https://mental-reset.sparkling-rae.com', webUrl: 'https://mental-reset.sparkling-rae.com' },
      },
    ],
  };

  if (await sendKakaoFeed(payload)) return "kakao";

  const share = navigator.share?.bind(navigator);
  if (share) {
    await share({ title: "멘탈 리셋", text, url });
    return "shared";
  }
  await navigator.clipboard.writeText(`${text}\n${url}`);
  return "copied";
}
