import { useState } from "react";
import type { CardPayload, Persona } from "../types";
import { ActionCard } from "../components/ActionCard";
import { Mascot } from "../components/Mascot";
import { shareKakao } from "../share";
import "./screens.css";

type Props = {
  card: CardPayload;
  persona: Persona | null;
  loggedIn: boolean;
  onTogglePublic: (next: boolean) => Promise<void>;
  onAgain: () => void;
  onCollection: () => void;
};

export function CardRevealScreen({
  card,
  persona,
  loggedIn,
  onTogglePublic,
  onAgain,
  onCollection,
}: Props) {
  const [busy, setBusy] = useState(false);
  const [hint, setHint] = useState<string | null>(
    loggedIn ? "계정 보관함에 저장했어요." : "이 기기 보관함에 자동으로 담았어요.",
  );
  const [isPublic, setIsPublic] = useState(Boolean(card.isPublic));

  async function kakao() {
    setBusy(true);
    try {
      const result = await shareKakao(card);
      if (result === "kakao") setHint("카카오톡 공유 창을 열었어요.");
      else if (result === "copied") setHint("카드 문장을 복사했어요. 카톡에 붙여 주세요.");
      else setHint("공유 창을 열었어요.");
    } catch {
      setHint("공유를 취소했어요.");
    } finally {
      setBusy(false);
    }
  }

  async function togglePlaza() {
    const next = !isPublic;
    setBusy(true);
    try {
      await onTogglePublic(next);
      setIsPublic(next);
      setHint(
        next
          ? "익명 광장에 올렸어요. 질문은 한 줄 요약만 보여요."
          : "광장에서 내렸어요.",
      );
    } catch (err) {
      setHint(err instanceof Error ? err.message : "광장 공개에 실패했어요.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="reveal">
      <header className="top">
        <span className="top__side" />
        <h1 className="top__title">리프레이밍 카드</h1>
        <span className="top__side" />
      </header>
      <div className="reveal__hero">
        {persona ? (
          <Mascot
            color={persona.color}
            shape={persona.shape}
            size={64}
            expression="speaking"
            phase={0.12}
          />
        ) : null}
        <p className="eyebrow">{persona?.name}의 카드</p>
      </div>
      <div className="reveal__flip">
        <ActionCard card={{ ...card, isPublic }} persona={persona} />
      </div>
      {hint ? <p className="lede lede--small">{hint}</p> : null}

      <div className="share-row">
        <button type="button" className="btn btn--kakao" onClick={kakao} disabled={busy}>
          카톡 공유
        </button>
        <button
          type="button"
          className={`btn ${isPublic ? "btn--ghost" : "btn--weak"}`}
          onClick={togglePlaza}
          disabled={busy}
        >
          {isPublic ? "광장 공개 중" : "익명 광장"}
        </button>
      </div>

      <div className="bottom-cta">
        <div className="bottom-cta__stack">
          <button className="btn btn--primary" onClick={onAgain}>
            하나 더 버리기
          </button>
          <button className="btn btn--weak" onClick={onCollection}>
            보관함 보기
          </button>
        </div>
      </div>
    </section>
  );
}
