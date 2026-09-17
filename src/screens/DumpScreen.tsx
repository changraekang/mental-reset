import { useState } from "react";
import type { MascotExpression, Persona } from "../types";
import { Mascot } from "../components/Mascot";
import "./screens.css";

type Props = {
  personas: Persona[];
  selectedId: string;
  onSelect: (id: string) => void;
  onSubmit: (text: string) => void;
  onBack: () => void;
  onCollection: () => void;
  busy: boolean;
  error: string | null;
};

const PHASE = [0.2, 0.95, 1.7];

export function DumpScreen({
  personas,
  selectedId,
  onSelect,
  onSubmit,
  onBack,
  onCollection,
  busy,
  error,
}: Props) {
  const [text, setText] = useState("");
  const selected = personas.find((p) => p.id === selectedId) || personas[0];
  const expression: MascotExpression = busy ? "thinking" : "idle";
  const selectedIndex = Math.max(
    0,
    personas.findIndex((p) => p.id === selectedId),
  );

  return (
    <section className="dump">
      <header className="top">
        <button className="top__back" onClick={onBack} type="button" aria-label="뒤로">
          ←
        </button>
        <h1 className="top__title">감정 버리기</h1>
        <span className="top__side" />
      </header>

      <div className="dump__mascot">
        {selected ? (
          <Mascot
            color={selected.color}
            shape={selected.shape}
            size={96}
            expression={expression}
            phase={PHASE[selectedIndex] ?? 0.55}
            label={selected.name}
          />
        ) : null}
      </div>
      <h2>여기에 버려요</h2>
      <p className="lede lede--small">로그인 없이 바로 적을 수 있어요. 원문은 카드에 남지 않아요.</p>

      <div className="persona-row" role="listbox" aria-label="캐릭터">
        {personas.map((persona, index) => (
          <button
            key={persona.id}
            type="button"
            role="option"
            aria-selected={persona.id === selectedId}
            className={`persona-chip ${persona.id === selectedId ? "is-on" : ""}`}
            onClick={() => onSelect(persona.id)}
          >
            <Mascot
              color={persona.color}
              shape={persona.shape}
              size={48}
              phase={PHASE[index] ?? index * 0.7}
              label={persona.name}
            />
            <span>
              <strong>{persona.name}</strong>
              <em>{persona.tagline}</em>
            </span>
            <span className="persona-chip__check" aria-hidden="true">
              {persona.id === selectedId ? "✓" : ""}
            </span>
          </button>
        ))}
      </div>

      <label className="well">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="직장, 사람, 번아웃… 날것 그대로."
          rows={7}
          disabled={busy}
        />
      </label>
      {error ? <p className="error">{error}</p> : null}

      <div className="bottom-cta">
        <div className="bottom-cta__stack">
          <button
            type="button"
            className="btn btn--primary"
            disabled={busy || text.trim().length < 2}
            onClick={() => onSubmit(text.trim())}
          >
            {busy ? "다시 잡는 중…" : "카드로 다시 잡기"}
          </button>
          <button type="button" className="btn btn--weak" onClick={onCollection} disabled={busy}>
            카드 보관함
          </button>
        </div>
      </div>
    </section>
  );
}
