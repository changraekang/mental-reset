import { useState } from "react";
import type { CardPayload, Persona } from "../types";
import { ActionCard } from "../components/ActionCard";
import { Mascot } from "../components/Mascot";
import "./screens.css";

type Props = {
  card: CardPayload;
  persona: Persona | null;
  onSave: () => Promise<void>;
  onAgain: () => void;
  onCollection: () => void;
};

export function CardRevealScreen({
  card,
  persona,
  onSave,
  onAgain,
  onCollection,
}: Props) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setError(null);
    try {
      await onSave();
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="reveal">
      <header className="top">
        <span className="top__side" />
        <h1 className="top__title">액션 카드</h1>
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
        <ActionCard card={card} persona={persona} />
      </div>
      {error ? <p className="error">{error}</p> : null}

      <div className="bottom-cta">
        <div className="bottom-cta__stack">
          <button className="btn btn--primary" onClick={save} disabled={saving || saved}>
            {saved ? "컬렉션에 넣었어요" : saving ? "저장 중…" : "카드 저장"}
          </button>
          <button className="btn btn--weak" onClick={onAgain}>
            하나 더 버리기
          </button>
          <button className="btn btn--ghost" onClick={onCollection}>
            컬렉션 보기
          </button>
        </div>
      </div>
    </section>
  );
}
