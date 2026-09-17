export type PersonaShape = "square" | "blob" | "circle";
export type MascotExpression = "idle" | "thinking" | "speaking";
export type PersonaId = "bear" | "fox" | "cat";

export type Persona = {
  id: PersonaId | string;
  name: string;
  tagline: string;
  color: string;
  paper: string;
  shape: PersonaShape;
};

export type CardPayload = {
  personaId: string;
  headline: string;
  tags: string[];
  reframe: string;
  action: string;
  isPublic?: boolean;
};

export type SavedCard = CardPayload & {
  id: string;
  dumpId?: string | null;
  persona: Persona | null;
  createdAt: string;
  local?: boolean;
};

export type ReframeResponse = {
  success: boolean;
  dumpId: string | null;
  card: CardPayload;
  message?: string;
};

export type AuthUser = {
  name: string;
};
