import type { CSSProperties } from "react";
import { useCallback, useEffect, useState } from "react";
import {
  deleteCard,
  fetchCards,
  fetchPersonas,
  fetchPlaza,
  loginWithNaverToken,
  migrateCards,
  patchCardPublic,
  reframeDump,
  saveCard,
} from "./api";
import { clearAuth, getToken, isNaverCallbackPath, setAuth } from "./auth";
import {
  clearLocalCards,
  deleteLocalCard,
  listLocalCards,
  saveLocalCard,
  updateLocalCard,
} from "./localVault";
import { CollectionScreen } from "./screens/CollectionScreen";
import { CardRevealScreen } from "./screens/CardRevealScreen";
import { DumpScreen } from "./screens/DumpScreen";
import { PlazaScreen } from "./screens/PlazaScreen";
import { SplashScreen } from "./screens/SplashScreen";
import type { Persona, SavedCard } from "./types";
import "./App.css";

type View = "splash" | "dump" | "reveal" | "collection" | "plaza";

function readNaverCallback() {
  if (!isNaverCallbackPath()) return null;
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  return {
    accessToken: hash.get("access_token"),
    tokenType: hash.get("token_type") || "Bearer",
    state: hash.get("state") || "",
  };
}

const FALLBACK_PERSONAS: Persona[] = [
  {
    id: "bear",
    name: "포근이",
    tagline: "네 탓이 아니야, 오늘 진짜 애썼어.",
    color: "#3182F6",
    paper: "#E8F3FF",
    shape: "blob",
  },
  {
    id: "fox",
    name: "팩트여우",
    tagline: "문제와 자책을 나눠서 보자.",
    color: "#1B64DA",
    paper: "#E8F3FF",
    shape: "square",
  },
  {
    id: "cat",
    name: "시니컬 냥이",
    tagline: "그 인간이 이상한 거임. 신경 끄자.",
    color: "#191F28",
    paper: "#F2F4F6",
    shape: "circle",
  },
];

export default function App() {
  const [view, setView] = useState<View>("splash");
  const [personas, setPersonas] = useState<Persona[]>(FALLBACK_PERSONAS);
  const [personaId, setPersonaId] = useState("bear");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dumpId, setDumpId] = useState<string | null>(null);
  const [card, setCard] = useState<SavedCard | null>(null);
  const [cards, setCards] = useState<SavedCard[]>([]);
  const [plaza, setPlaza] = useState<SavedCard[]>([]);
  const [token, setToken] = useState<string | null>(getToken());
  const [oauthBusy, setOauthBusy] = useState(() => isNaverCallbackPath());
  const loggedIn = Boolean(token);

  const loadVault = useCallback(async () => {
    if (getToken()) {
      const list = await fetchCards();
      setCards(list);
      return list;
    }
    const list = listLocalCards();
    setCards(list);
    return list;
  }, []);

  useEffect(() => {
    fetchPersonas()
      .then((list) => {
        if (list.length) setPersonas(list);
      })
      .catch(() => {
        /* keep fallback */
      });
  }, []);

  useEffect(() => {
    async function finishLogin(nextToken: string, name: string) {
      setAuth(nextToken, name);
      setToken(nextToken);
      const local = listLocalCards();
      if (local.length) {
        try {
          await migrateCards(local);
          clearLocalCards();
        } catch {
          /* 로컬 카드는 남겨 두고 계정 보관함만 연다 */
        }
      }
      await loadVault();
    }

    const callback = readNaverCallback();
    if (callback) {
      if (!callback.accessToken) {
        setError("네이버 토큰이 없습니다.");
        setOauthBusy(false);
        window.history.replaceState({}, "", "/");
        return;
      }
      loginWithNaverToken({
        access_token: callback.accessToken,
        token_type: callback.tokenType,
        state: callback.state,
      })
        .then(async (data) => {
          window.history.replaceState({}, "", "/");
          await finishLogin(data.token, data.user?.nickname || "멘탈리셋");
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : "네이버 로그인에 실패했습니다.");
          window.history.replaceState({}, "", "/");
        })
        .finally(() => {
          setOauthBusy(false);
        });
      return;
    }

    setOauthBusy(false);

    const params = new URLSearchParams(window.location.search);
    const nextToken = params.get("token");
    const name = params.get("name");
    const authError = params.get("authError");
    if (authError) setError(authError);
    if (nextToken) {
      params.delete("token");
      params.delete("name");
      const qs = params.toString();
      window.history.replaceState({}, "", `${window.location.pathname}${qs ? `?${qs}` : ""}`);
      void finishLogin(nextToken, name || "멘탈리셋");
    }
  }, [loadVault]);

  async function submitDump(text: string) {
    setBusy(true);
    setError(null);
    try {
      const result = await reframeDump(text, personaId);
      const persona = personas.find((p) => p.id === result.card.personaId) || null;
      setDumpId(result.dumpId);
      let saved: SavedCard;
      if (getToken()) {
        saved = await saveCard({ ...result.card, dumpId: result.dumpId });
      } else {
        saved = saveLocalCard(result.card, persona);
      }
      setCard(saved);
      setView("reveal");
    } catch (err) {
      setError(err instanceof Error ? err.message : "리프레이밍에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  }

  async function togglePublic(next: boolean) {
    if (!card) return;
    if (getToken() && !card.local) {
      const saved = await patchCardPublic(card.id, next);
      setCard(saved);
      updateLocalCard(card.id, { isPublic: next });
      return;
    }
    if (next) {
      const saved = await saveCard({
        ...card,
        dumpId: getToken() ? dumpId : null,
        isPublic: true,
      });
      updateLocalCard(card.id, { ...saved, isPublic: true, local: false });
      setCard({ ...saved, isPublic: true, local: false });
      return;
    }
    if (!card.local) {
      const saved = await patchCardPublic(card.id, false);
      setCard(saved);
      updateLocalCard(card.id, { isPublic: false });
      return;
    }
    updateLocalCard(card.id, { isPublic: false });
    setCard({ ...card, isPublic: false });
  }

  async function openCollection() {
    try {
      await loadVault();
    } catch {
      setCards(listLocalCards());
    }
    setView("collection");
  }

  async function openPlaza() {
    try {
      setPlaza(await fetchPlaza());
    } catch {
      setPlaza([]);
    }
    setView("plaza");
  }

  const persona = personas.find((p) => p.id === (card?.personaId || personaId)) || null;

  if (oauthBusy) {
    return (
      <div className="app" style={{ "--ink": "#3182F6" } as CSSProperties}>
        <section className="splash">
          <div className="splash__copy">
            <p className="eyebrow">감정 쓰레기통</p>
            <h1>로그인 중</h1>
            <p className="lede">네이버 로그인을 마무리하고 있어요.</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="app" style={{ "--ink": persona?.color || "#3182F6" } as CSSProperties}>
      {view === "splash" && (
        <SplashScreen
          personas={personas}
          error={error}
          onStart={() => {
            setError(null);
            setView("dump");
          }}
          onPlaza={openPlaza}
        />
      )}
      {view === "dump" && (
        <DumpScreen
          personas={personas}
          selectedId={personaId}
          onSelect={setPersonaId}
          onSubmit={submitDump}
          onBack={() => setView("splash")}
          onCollection={openCollection}
          busy={busy}
          error={error}
        />
      )}
      {view === "reveal" && card && (
        <CardRevealScreen
          card={card}
          persona={persona}
          loggedIn={loggedIn}
          onTogglePublic={togglePublic}
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
          loggedIn={loggedIn}
          onBack={() => setView("splash")}
          onDump={() => {
            setError(null);
            setView("dump");
          }}
          onLogout={() => {
            clearAuth();
            setToken(null);
            setCards(listLocalCards());
          }}
          onDelete={async (id) => {
            const target = cards.find((item) => item.id === id);
            if (loggedIn && target && !target.local) {
              await deleteCard(id);
            } else {
              deleteLocalCard(id);
            }
            await loadVault();
          }}
        />
      )}
      {view === "plaza" && (
        <PlazaScreen
          cards={plaza}
          personas={personas}
          onBack={() => setView("splash")}
          onDump={() => {
            setError(null);
            setView("dump");
          }}
          onCollection={openCollection}
        />
      )}
    </div>
  );
}
