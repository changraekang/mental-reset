import type { CSSProperties } from "react";
import type { Persona } from "../types";
import { Mascot } from "../components/Mascot";
import "./screens.css";

type Props = {
  personas: Persona[];
  error?: string | null;
  onStart: () => void;
  onPlaza: () => void;
};

export function SplashScreen({ personas, error, onStart, onPlaza }: Props) {
  return (
    <section className="splash">
      <div className="splash__stage" aria-hidden="true">
        <div className="orbit">
          <div className="orbit__track">
            {personas.map((persona, index) => (
              <div
                key={persona.id}
                className="orbit__slot"
                style={{ "--slot": `${index * 120}deg` } as CSSProperties}
              >
                <div className="orbit__counter">
                  <Mascot
                    color={persona.color}
                    shape={persona.shape}
                    size={88}
                    phase={0.2 + index * 0.37}
                    label={persona.name}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="splash__copy">
        <p className="eyebrow">감정 쓰레기통</p>
        <h1>멘탈 리셋</h1>
        <p className="lede">
          날것의 감정을 버리고,
          <br />한 장으로 다시 잡아요.
        </p>
        {error ? <p className="error">{error}</p> : null}
      </div>

      <div className="bottom-cta">
        <div className="bottom-cta__stack">
          <button className="btn btn--primary" onClick={onStart}>
            감정 버리기
          </button>
          <button className="btn btn--weak" onClick={onPlaza}>
            익명 광장
          </button>
        </div>
      </div>
    </section>
  );
}
