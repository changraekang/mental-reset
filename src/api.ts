import { authHeaders } from "./auth";
import { apiBase } from "./config";
import type { CardPayload, Persona, ReframeResponse, SavedCard } from "./types";

const API_BASE = apiBase();

function apiUrl(path: string) {
  return `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
}

async function parse<T>(res: Response): Promise<T> {
  const raw = await res.text();
  let data = {} as T & { message?: string };
  try {
    data = raw ? (JSON.parse(raw) as T & { message?: string }) : data;
  } catch {
    throw new Error(
      res.ok ? "응답을 읽지 못했습니다." : `요청에 실패했습니다. (${res.status})`,
    );
  }
  if (!res.ok) {
    throw new Error(data.message || "요청에 실패했습니다.");
  }
  return data;
}

export async function fetchPersonas(): Promise<Persona[]> {
  const data = await parse<{ success: boolean; personas: Persona[] }>(
    await fetch(apiUrl("/mental-reset/personas")),
  );
  return data.personas;
}

export async function reframeDump(text: string, personaId: string) {
  return parse<ReframeResponse>(
    await fetch(apiUrl("/mental-reset/reframe"), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ text, personaId }),
    }),
  );
}

export async function fetchCards(): Promise<SavedCard[]> {
  const data = await parse<{ success: boolean; cards: SavedCard[] }>(
    await fetch(apiUrl("/mental-reset/cards"), { headers: authHeaders() }),
  );
  return data.cards;
}

export async function fetchPlaza(): Promise<SavedCard[]> {
  const data = await parse<{ success: boolean; cards: SavedCard[] }>(
    await fetch(apiUrl("/mental-reset/cards/plaza")),
  );
  return data.cards;
}

export async function saveCard(card: CardPayload & { dumpId?: string | null }) {
  const data = await parse<{ success: boolean; card: SavedCard }>(
    await fetch(apiUrl("/mental-reset/cards"), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(card),
    }),
  );
  return data.card;
}

export async function migrateCards(cards: CardPayload[]) {
  const data = await parse<{ success: boolean; cards: SavedCard[] }>(
    await fetch(apiUrl("/mental-reset/cards/migrate"), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ cards }),
    }),
  );
  return data.cards;
}

export async function patchCardPublic(id: string, isPublic: boolean) {
  const data = await parse<{ success: boolean; card: SavedCard }>(
    await fetch(apiUrl(`/mental-reset/cards/${id}`), {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ isPublic }),
    }),
  );
  return data.card;
}

export async function deleteCard(id: string) {
  await parse<{ success: boolean }>(
    await fetch(apiUrl(`/mental-reset/cards/${id}`), {
      method: "DELETE",
      headers: authHeaders(),
    }),
  );
}

export async function loginWithNaverToken(payload: {
  access_token: string;
  token_type?: string;
  state?: string;
}) {
  const data = await parse<{
    success: boolean;
    token: string;
    user: { nickname: string };
  }>(
    await fetch(apiUrl("/mental-reset/auth/naver"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, type: "login" }),
    }),
  );
  return data;
}
