import type { Persona, SavedCard } from "../types";
import { ActionCard } from "../components/ActionCard";
import "./screens.css";

type Props = {
  cards: SavedCard[];
  personas: Persona[];
  onBack: () => void;
  onDump: () => void;
};

export function PlazaScreen({ cards, personas, onBack, onDump }: Props) {
  return (
    <section className="collection">
      <header className="top">
        <button className="top__back" onClick={onBack} type="button" aria-label="처음으로">
          ←
        </button>
        <h1 className="top__title">익명 광장</h1>
        <span className="top__side" />
      </header>
      <p className="lede lede--small">질문은 한 줄로만 요약돼 있어요. 원문은 나가지 않아요.</p>

      {cards.length === 0 ? (
        <p className="empty">아직 공개된 카드가 없어요.</p>
      ) : (
        <div className="collection__list">
          {cards.map((card) => {
            const persona =
              card.persona || personas.find((p) => p.id === card.personaId) || null;
            return (
              <div key={card.id} className="card-grid__item">
                <ActionCard card={card} persona={persona} compact />
              </div>
            );
          })}
        </div>
      )}

      <div className="bottom-cta">
        <button className="btn btn--primary" onClick={onDump}>
          나도 버리기
        </button>
      </div>
    </section>
  );
}
