import type { CSSProperties } from "react";
import type { CardPayload, Persona } from "../types";
import { Mascot } from "./Mascot";
import "./ActionCard.css";

const SENTIMENT: Record<string, string> = {
  anger: "분노",
  anxiety: "불안",
  sadness: "슬픔",
  shame: "수치",
  burnout: "번아웃",
  confusion: "혼란",
  relief: "안도",
  mixed: "복합",
};

type Props = {
  card: CardPayload;
  persona: Persona | null;
  compact?: boolean;
};

export function ActionCard({ card, persona, compact = false }: Props) {
  const color = persona?.color || "#3182F6";
  const paper = persona?.paper || "#FFFFFF";

  return (
    <article
      className={`action-card ${compact ? "action-card--compact" : ""}`}
      style={{ "--card-ink": color, "--card-paper": paper } as CSSProperties}
    >
      <header className="action-card__top">
        {persona ? (
          <Mascot
            color={persona.color}
            shape={persona.shape}
            size={compact ? 44 : 56}
            phase={compact ? 0.4 : 0.2}
            label={persona.name}
          />
        ) : null}
        <div>
          <p className="action-card__persona">{persona?.name || card.personaId}</p>
          <h3>{card.headline}</h3>
        </div>
        <span className="action-card__badge">
          {SENTIMENT[card.sentimentLabel] || card.sentimentLabel}
        </span>
      </header>
      <p className="action-card__reframe">{card.reframe}</p>
      <p className="action-card__action">{card.action}</p>
    </article>
  );
}
