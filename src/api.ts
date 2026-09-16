import type { Persona, ReframeResponse, SavedCard, CardPayload } from "./types";

async function parse<T>(res: Response): Promise<T> {
  const data = (await res.json()) as T & { message?: string; success?: boolean };
  if (!res.ok) {
    throw new Error(data.message || "요청에 실패했습니다.");
  }
  return data;
}

export async function fetchPersonas(): Promise<Persona[]> {
  const data = await parse<{ success: boolean; personas: Persona[] }>(
    await fetch("/api/mental-reset/personas"),
  );
  return data.personas;
}

export async function reframeDump(text: string, personaId: string) {
  return parse<ReframeResponse>(
    await fetch("/api/mental-reset/reframe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, personaId }),
    }),
  );
}

export async function fetchCards(): Promise<SavedCard[]> {
  const data = await parse<{ success: boolean; cards: SavedCard[] }>(
    await fetch("/api/mental-reset/cards"),
  );
  return data.cards;
}

export async function saveCard(card: CardPayload & { dumpId?: string }) {
  const data = await parse<{ success: boolean; card: SavedCard }>(
    await fetch("/api/mental-reset/cards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(card),
    }),
  );
  return data.card;
}

export async function deleteCard(id: string) {
  await parse<{ success: boolean }>(
    await fetch(`/api/mental-reset/cards/${id}`, { method: "DELETE" }),
  );
}
