import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { deleteCard, fetchCards, fetchPersonas, reframeDump, saveCard } from "./api";
import { CollectionScreen } from "./screens/CollectionScreen";
import { CardRevealScreen } from "./screens/CardRevealScreen";
import { DumpScreen } from "./screens/DumpScreen";
import { SplashScreen } from "./screens/SplashScreen";
import type { CardPayload, Persona, SavedCard } from "./types";
import "./App.css";

type View = "splash" | "dump" | "reveal" | "collection";

const FALLBACK_PERSONAS: Persona[] = [
  {
    id: "cynic",
    name: "시니컬한 현실주의자",
    tagline: "달콤한 말은 생략. 상황부터 자른다.",
    color: "#191F28",
    paper: "#F2F4F6",
    shape: "square",
  },
  {
    id: "ally",
    name: "무조건 내 편",
    tagline: "네 감정은 이미 옳다.",
    color: "#3182F6",
    paper: "#E8F3FF",
    shape: "blob",
  },
  {
    id: "solver",
    name: "T 성향 해결사",
    tagline: "감정은 인정. 다음은 한 수.",
    color: "#1B64DA",
    paper: "#E8F3FF",
    shape: "circle",
  },
];

export default function App() {
  const [view, setView] = useState<View>("splash");
  const [personas, setPersonas] = useState<Persona[]>(FALLBACK_PERSONAS);
  const [personaId, setPersonaId] = useState("ally");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dumpId, setDumpId] = useState<string | undefined>();
  const [card, setCard] = useState<CardPayload | null>(null);
  const [cards, setCards] = useState<SavedCard[]>([]);

  useEffect(() => {
    fetchPersonas()
      .then((list) => {
        if (list.length) setPersonas(list);
      })
      .catch(() => {
        /* keep fallback */
      });
  }, []);

  async function loadCards() {
    const list = await fetchCards();
    setCards(list);
  }

  async function submitDump(text: string) {
    setBusy(true);
    setError(null);
    try {
      const result = await reframeDump(text, personaId);
      setDumpId(result.dumpId);
      setCard(result.card);
      setView("reveal");
    } catch (err) {
      setError(err instanceof Error ? err.message : "리프레이밍에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  }

  async function persistCard() {
    if (!card) return;
    await saveCard({ ...card, dumpId });
    await loadCards();
  }

  async function openCollection() {
    try {
      await loadCards();
    } catch {
      setCards([]);
    }
    setView("collection");
  }

  const persona = personas.find((p) => p.id === (card?.personaId || personaId)) || null;

  return (
    <div className="app" style={{ "--ink": persona?.color || "#3182F6" } as CSSProperties}>
      {view === "splash" && (
        <SplashScreen
          personas={personas}
          onStart={() => {
            setError(null);
            setView("dump");
          }}
          onCollection={openCollection}
        />
      )}
      {view === "dump" && (
        <DumpScreen
          personas={personas}
          selectedId={personaId}
          onSelect={setPersonaId}
          onSubmit={submitDump}
          onBack={() => setView("splash")}
          busy={busy}
          error={error}
        />
      )}
      {view === "reveal" && card && (
        <CardRevealScreen
          card={card}
          persona={persona}
          onSave={persistCard}
          onAgain={() => {
            setCard(null);
            setError(null);
            setView("dump");
          }}
          onCollection={openCollection}
        />
      )}
      {view === "collection" && (
        <CollectionScreen
          cards={cards}
          personas={personas}
          onBack={() => setView("splash")}
          onDump={() => {
            setError(null);
            setView("dump");
          }}
          onDelete={async (id) => {
            await deleteCard(id);
            await loadCards();
          }}
        />
      )}
    </div>
  );
}
