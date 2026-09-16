import type { Persona, SavedCard } from "../types";
import { ActionCard } from "../components/ActionCard";
import "./screens.css";

type Props = {
  cards: SavedCard[];
  personas: Persona[];
  onBack: () => void;
  onDump: () => void;
  onDelete: (id: string) => void;
};

export function CollectionScreen({
  cards,
  personas,
  onBack,
  onDump,
  onDelete,
}: Props) {
  return (
    <section className="collection">
      <header className="top">
        <button className="top__back" onClick={onBack} type="button" aria-label="처음으로">
          ←
        </button>
        <h1 className="top__title">모은 카드</h1>
        <span className="top__side" />
      </header>
      <p className="lede lede--small">원문은 없고, 다시 잡은 문장만 남아요.</p>

      {cards.length === 0 ? (
        <p className="empty">아직 카드가 없어요. 감정을 하나 버리고 와 주세요.</p>
      ) : (
        <div className="collection__list">
          {cards.map((card) => {
            const persona =
              card.persona || personas.find((p) => p.id === card.personaId) || null;
            return (
              <div key={card.id} className="card-grid__item">
                <ActionCard card={card} persona={persona} compact />
                <button
                  type="button"
                  className="text-link"
                  onClick={() => onDelete(card.id)}
                >
                  버리기
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className="bottom-cta">
        <button className="btn btn--primary" onClick={onDump}>
          새로 버리기
        </button>
      </div>
    </section>
  );
}
