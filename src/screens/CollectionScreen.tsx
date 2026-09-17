import type { Persona, SavedCard } from "../types";
import { ActionCard } from "../components/ActionCard";
import { NaverLoginButton } from "../components/NaverLoginButton";
import "./screens.css";

type Props = {
  cards: SavedCard[];
  personas: Persona[];
  loggedIn: boolean;
  onBack: () => void;
  onDump: () => void;
  onLogout: () => void;
  onDelete: (id: string) => void;
};

export function CollectionScreen({
  cards,
  personas,
  loggedIn,
  onBack,
  onDump,
  onLogout,
  onDelete,
}: Props) {
  return (
    <section className="collection">
      <header className="top">
        <button className="top__back" onClick={onBack} type="button" aria-label="처음으로">
          ←
        </button>
        <h1 className="top__title">카드 보관함</h1>
        <span className="top__side" />
      </header>
      <p className="lede lede--small">
        {loggedIn
          ? "로그인되어 있어 기기 사이에 동기화돼요."
          : "지금은 이 기기에만 담겨 있어요. 네이버로 로그인하면 계정으로 옮겨 드려요."}
      </p>
      <div className="collection__auth">
        {!loggedIn ? (
          <NaverLoginButton label="네이버로 로그인하고 동기화" />
        ) : (
          <button className="text-link" type="button" onClick={onLogout}>
            로그아웃
          </button>
        )}
      </div>

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
