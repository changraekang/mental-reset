export type PersonaShape = "square" | "blob" | "circle";
export type MascotExpression = "idle" | "thinking" | "speaking";

export type Persona = {
  id: string;
  name: string;
  tagline: string;
  color: string;
  paper: string;
  shape: PersonaShape;
};

export type Sentiment = {
  label: string;
  score: number;
};

export type CardPayload = {
  personaId: string;
  headline: string;
  reframe: string;
  action: string;
  sentimentLabel: string;
};

export type SavedCard = CardPayload & {
  id: string;
  dumpId: string | null;
  persona: Persona | null;
  createdAt: string;
};

export type ReframeResponse = {
  success: boolean;
  dumpId: string;
  sentiment: Sentiment;
  card: CardPayload;
  message?: string;
};
