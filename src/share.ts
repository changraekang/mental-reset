import type { CardPayload } from "./types";

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
  const key = import.meta.env.VITE_KAKAO_JS_KEY;
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

export async function shareKakao(card: CardPayload) {
  const text = cardShareText(card);
  const url = window.location.origin;
  const Kakao = ensureKakao();
  const payload: KakaoSharePayload = {
    objectType: "feed",
    content: {
      title: card.headline ? `#${card.headline.replace(/^#/, "")} · 멘탈 리셋` : "멘탈 리셋",
      description: text.slice(0, 200),
      imageUrl: `${url}/kakao-share.png`,
      link: {
        mobileWebUrl: url,
        webUrl: url,
      },
    },
    buttons: [
      {
        title: "나도 멘탈 리셋",
        link: {
          mobileWebUrl: url,
          webUrl: url,
        },
      },
    ],
  };

  try {
    if (Kakao?.Share?.sendDefault) {
      Kakao.Share.sendDefault(payload);
      return "kakao";
    }
    if (Kakao?.Link?.sendDefault) {
      Kakao.Link.sendDefault(payload);
      return "kakao";
    }
  } catch {
    /* SDK가 막히면 아래 폴백으로 이어간다 */
  }

  const share = navigator.share?.bind(navigator);
  if (share) {
    await share({ title: "멘탈 리셋", text, url });
    return "shared";
  }
  await navigator.clipboard.writeText(text);
  return "copied";
}
