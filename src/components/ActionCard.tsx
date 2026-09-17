import { forwardRef, type CSSProperties } from "react";
import type { CardPayload, Persona } from "../types";
import { Mascot } from "./Mascot";
import "./ActionCard.css";

type Props = {
  card: CardPayload;
  persona: Persona | null;
  compact?: boolean;
};

export const ActionCard = forwardRef<HTMLElement, Props>(function ActionCard(
  { card, persona, compact = false },
  ref,
) {
  const color = persona?.color || "#3182F6";
  const paper = persona?.paper || "#FFFFFF";

  return (
    <article
      ref={ref}
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
          <p className="action-card__prompt">이런 질문</p>
          <h3>{card.headline}</h3>
        </div>
      </header>
      {card.tags?.length ? (
        <p className="action-card__tags">
          {card.tags.map((tag) => (
            <span key={tag}>{tag.startsWith("#") ? tag : `#${tag}`}</span>
          ))}
        </p>
      ) : null}
      <p className="action-card__reframe">{card.reframe}</p>
      <p className="action-card__action">{card.action}</p>
    </article>
  );
});
