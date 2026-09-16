import { useMemo, useRef, useState } from "react";
import type { MascotExpression, Persona } from "../types";
import { Mascot } from "../components/Mascot";
import "./screens.css";

type SpeechCtor = new () => SpeechRecognition;

type Props = {
  personas: Persona[];
  selectedId: string;
  onSelect: (id: string) => void;
  onSubmit: (text: string) => void;
  onBack: () => void;
  busy: boolean;
  error: string | null;
};

function getSpeechRecognition(): SpeechCtor | null {
  const w = window as Window & {
    SpeechRecognition?: SpeechCtor;
    webkitSpeechRecognition?: SpeechCtor;
  };
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

export function DumpScreen({
  personas,
  selectedId,
  onSelect,
  onSubmit,
  onBack,
  busy,
  error,
}: Props) {
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const recRef = useRef<SpeechRecognition | null>(null);
  const selected = personas.find((p) => p.id === selectedId) || personas[0];
  const speechOk = useMemo(() => Boolean(getSpeechRecognition()), []);
  const expression: MascotExpression = busy
    ? "thinking"
    : listening
      ? "speaking"
      : "idle";

  function toggleVoice() {
    const Ctor = getSpeechRecognition();
    if (!Ctor) return;
    if (listening && recRef.current) {
      recRef.current.stop();
      return;
    }
    const rec = new Ctor();
    rec.lang = "ko-KR";
    rec.interimResults = true;
    rec.continuous = false;
    rec.onresult = (event: SpeechRecognitionEvent) => {
      const chunk = Array.from(event.results)
        .map((r) => r[0]?.transcript || "")
        .join(" ");
      setText((prev) => (prev ? `${prev.trim()} ${chunk}` : chunk).trim());
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recRef.current = rec;
    setListening(true);
    rec.start();
  }

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
            size={72}
            expression={expression}
            phase={0.55}
            label={selected.name}
          />
        ) : null}
      </div>
      <h2>여기에 버려요</h2>
      <p className="lede lede--small">검열하지 말고 적거나 말해 주세요. 카드에 원문은 남지 않아요.</p>

      <div className="persona-row" role="listbox" aria-label="페르소나">
        {personas.map((persona) => (
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
              size={36}
              phase={persona.id === "ally" ? 0.8 : 0.15}
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
            className={`btn btn--ghost ${listening ? "is-live" : ""}`}
            onClick={toggleVoice}
            disabled={!speechOk || busy}
          >
            {listening ? "듣는 중" : speechOk ? "음성으로 털기" : "음성 미지원"}
          </button>
          <button
            type="button"
            className="btn btn--primary"
            disabled={busy || text.trim().length < 2}
            onClick={() => onSubmit(text.trim())}
          >
            {busy ? "다시 잡는 중…" : "액션 카드로"}
          </button>
        </div>
      </div>
    </section>
  );
}
