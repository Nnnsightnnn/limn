// Curated popular image-generation prompts.
//
// Sourced from current (2026) prompt galleries — Fiddl.art's "55+ AI Image Prompts"
// (Feb 2026), the Gelato MidJourney roundup, and trending styles surveyed on
// Createimg/Medium — then trimmed and made model-agnostic so they read well
// regardless of MidJourney / FLUX / SDXL.
//
// Click flow: each prompt is loaded into the Free-form textarea verbatim.
// Users can then refine, parse to wizard, or copy directly.

export type PopularPromptCategory =
  | 'portrait'
  | 'cinematic'
  | 'fantasy'
  | 'anime'
  | 'product'
  | 'macro'
  | 'landscape'
  | 'collectible'

export interface PopularPrompt {
  /** Short label shown on the card. */
  title: string
  /** Category tag, used for grouping and the tag pill. */
  category: PopularPromptCategory
  /** One-line tease shown under the title on the card. */
  blurb: string
  /** The prompt text loaded into Free-form on click. */
  prompt: string
}

export const POPULAR_PROMPT_CATEGORY_LABELS: Record<PopularPromptCategory, string> = {
  portrait: 'Portrait',
  cinematic: 'Cinematic',
  fantasy: 'Fantasy',
  anime: 'Anime',
  product: 'Product',
  macro: 'Macro',
  landscape: 'Landscape',
  collectible: 'Collectible',
}

export const POPULAR_PROMPTS: PopularPrompt[] = [
  // — Portrait —
  {
    title: 'Freckled laugh, golden hour',
    category: 'portrait',
    blurb: 'Photoreal close-up, 85mm shallow depth.',
    prompt:
      'Close-up portrait of a laughing young woman with freckles, natural light, shallow depth of field, shot on a Canon 5D Mark IV with an 85mm f/1.4 lens, photorealistic',
  },
  {
    title: 'Tokyo neon, candid',
    category: 'portrait',
    blurb: 'Street photography, reflections in the eyes.',
    prompt:
      'Candid street photography portrait of an elderly woman in Tokyo, neon lights reflecting in her eyes, thoughtful expression, film grain, 35mm lens',
  },
  {
    title: 'Soot and embers',
    category: 'portrait',
    blurb: 'Firefighter, gritty cinematic light.',
    prompt:
      'Portrait of a firefighter covered in soot, looking directly at the camera, intense expression, gritty, cinematic lighting, photorealistic',
  },

  // — Cinematic —
  {
    title: 'Two suns setting',
    category: 'cinematic',
    blurb: 'Lone astronaut, anamorphic flare, 21:9.',
    prompt:
      'Wide shot of a lone astronaut on a desolate red planet, two suns setting, cinematic, anamorphic lens flare, 21:9 aspect ratio',
  },
  {
    title: 'Noir on a rainy street',
    category: 'cinematic',
    blurb: 'Detective under neon, deep shadows, film grain.',
    prompt:
      'A noir detective on a rain-slicked city street at night, illuminated by a neon sign, deep shadows, film grain, cinematic',
  },
  {
    title: 'Cyberpunk night market',
    category: 'cinematic',
    blurb: 'Crowd, androids, Blade Runner palette.',
    prompt:
      'Cyberpunk street market at night, crowded with people and androids, neon-drenched, Blade Runner aesthetic, 21:9',
  },

  // — Fantasy —
  {
    title: 'Iridescent dragon, fire',
    category: 'fantasy',
    blurb: 'Mountain peak, epic concept art.',
    prompt:
      'Digital painting of a dragon with iridescent scales on a mountain peak, breathing fire, epic fantasy concept art, highly detailed',
  },
  {
    title: 'City inside a great tree',
    category: 'fantasy',
    blurb: 'Rope bridges, warm golden light through leaves.',
    prompt:
      'Fantasy city built into a giant ancient tree, rope bridges between branches, warm golden light filtering through leaves, concept art',
  },

  // — Anime —
  {
    title: 'Ghibli forest, silver hair',
    category: 'anime',
    blurb: 'Soft ethereal lighting, Studio Ghibli style.',
    prompt:
      'Anime girl with long silver hair and blue eyes, in a magical glowing forest, Studio Ghibli style, soft ethereal lighting',
  },
  {
    title: 'Shinkai rain, shared umbrella',
    category: 'anime',
    blurb: 'Wet pavement, melancholic Tokyo.',
    prompt:
      'Two anime students sharing an umbrella in Tokyo rain, Makoto Shinkai style, light reflections on wet pavement, melancholic mood',
  },

  // — Product —
  {
    title: 'Smartwatch on marble',
    category: 'product',
    blurb: 'Minimal commercial shot, 4K.',
    prompt:
      'Minimalist shot of a smartwatch on white marble, soft studio lighting, sharp detail, commercial product photography, 4K',
  },
  {
    title: 'Perfume and fresh flowers',
    category: 'product',
    blurb: 'Soft natural light, macro lens.',
    prompt:
      'Luxury perfume bottle surrounded by fresh flowers, soft natural light, macro lens, editorial product photography',
  },

  // — Macro —
  {
    title: 'Dewdrop on a spider web',
    category: 'macro',
    blurb: 'Rainbow refractions at dawn.',
    prompt:
      'Macro of a dewdrop on a spider web at dawn, rainbow refractions visible, sharp focus, photorealistic',
  },

  // — Landscape —
  {
    title: 'Storm-edge cliff',
    category: 'landscape',
    blurb: 'Last light catching sea spray.',
    prompt:
      "A cinematic wide shot of a coastal cliff at storm's edge, dark churning sea below, dramatic overcast sky, sea spray catching the last light, photorealistic",
  },
  {
    title: 'Misty dawn path',
    category: 'landscape',
    blurb: 'Diffused light through ancient trees.',
    prompt:
      'A misty forest path at dawn, soft diffused light filtering through ancient trees, dew on the ferns, photorealistic, breathtaking natural detail',
  },

  // — Collectible (trending in 2026) —
  {
    title: 'Hyper-detail action figure',
    category: 'collectible',
    blurb: '2026 trend — collector-toy hero shot.',
    prompt:
      'Hyper-detailed collector action figure of a sci-fi explorer, articulated joints visible, packaged with a printed cardback and clear plastic blister, dramatic product lighting, glossy editorial photography, 4K',
  },
]
