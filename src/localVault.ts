import type { CardPayload, SavedCard } from "./types";

const KEY = "mental-reset.cards.v2";

function read(): SavedCard[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedCard[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(cards: SavedCard[]) {
  localStorage.setItem(KEY, JSON.stringify(cards.slice(0, 60)));
}

export function listLocalCards(): SavedCard[] {
  return read().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function saveLocalCard(card: CardPayload, persona: SavedCard["persona"]): SavedCard {
  const saved: SavedCard = {
    ...card,
    id: crypto.randomUUID(),
    dumpId: null,
    persona,
    createdAt: new Date().toISOString(),
    local: true,
    isPublic: Boolean(card.isPublic),
  };
  write([saved, ...read().filter((c) => c.id !== saved.id)]);
  return saved;
}

export function updateLocalCard(id: string, patch: Partial<SavedCard>) {
  write(read().map((card) => (card.id === id ? { ...card, ...patch } : card)));
}

export function deleteLocalCard(id: string) {
  write(read().filter((card) => card.id !== id));
}

export function clearLocalCards() {
  write([]);
}
