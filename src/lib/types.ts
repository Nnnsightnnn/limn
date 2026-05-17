// Shared types for Limn

export type Mode = 'wizard' | 'freeform'

export type SubjectSubType =
  | 'person'
  | 'animal'
  | 'character'
  | 'location'
  | 'object'

/** Structured slots filled in via the wizard. Most are multi-select chip arrays. */
export interface PromptSlots {
  /** Free-form subject text (the "what" of the image). */
  subject: string
  /** Optional sub-type to narrow example chips. */
  subjectSubType: SubjectSubType | null
  /** Medium / art movement / style family (multi-select). */
  medium: string[]
  /** Where the scene takes place (multi-select). */
  environment: string[]
  /** Lighting setup (multi-select). */
  lighting: string[]
  /** Time-of-day modifiers (multi-select). */
  timeOfDay: string[]
  /** Mood / emotional tone (multi-select). */
  mood: string[]
  /** Color palette descriptors (multi-select). */
  color: string[]
  /** Framing / composition keywords (multi-select). */
  composition: string[]
  /** Cinematic shot type (multi-select). */
  shotType: string[]
  /** Camera angle (multi-select). */
  cameraAngle: string[]
  /** Camera body / lens hint (multi-select). */
  cameraLens: string[]
  /** Artist or director name(s) — comma-separated free text. */
  artists: string
}

/** MidJourney-specific output parameters. */
export interface MJParams {
  /** Aspect ratio, e.g. "16:9". Empty = omit. */
  aspectRatio: string
  /** MJ model version, e.g. "6.1". Empty = omit. */
  version: string
  /** Add `--style raw` flag. */
  styleRaw: boolean
  /** Stylize value 0–1000. -1 = omit. */
  stylize: number
  /** Chaos value 0–100. -1 = omit. */
  chaos: number
  /** Quality 0.25 | 0.5 | 1 | 2. -1 = omit. */
  quality: number
  /** Weirdness 0–3000. -1 = omit. */
  weird: number
  /** Seed integer as string. Empty = omit. */
  seed: string
  /** Negative prompt content for --no. Empty = omit. */
  negative: string
  /** Add --tile flag. */
  tile: boolean
}

export interface LibraryItem {
  id: string
  name: string
  createdAt: number
  modeWhenSaved: Mode
  slots: PromptSlots
  params: MJParams
  freeform: string
}

export interface Settings {
  openrouterKey: string
  openrouterModel: string
}

/** A single chip option. Some chips can carry a longer alias used in the assembled prompt. */
export interface Chip {
  /** Display label. */
  label: string
  /** Optional override used when assembling — useful when the label is shorter than the canonical term. */
  value?: string
}

export interface ChipGroup {
  name: string
  chips: (string | Chip)[]
}

export interface VocabCategory {
  /** Used by the AI 'suggest more' prompt for context. */
  description: string
  groups: ChipGroup[]
}
