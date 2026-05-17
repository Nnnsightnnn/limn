// Curated seed vocabulary for Limn.
// Distilled from MidJourney v6.1 Cheat Sheet + cinematic-template.txt, then expanded.
// Users will eventually be able to extend this from the UI; for v0.1 it's static.

import type { SubjectSubType, VocabCategory } from '../lib/types'

export interface SubTypeOption {
  value: SubjectSubType
  label: string
  examples: string[]
}

export const SUBJECT_SUBTYPES: SubTypeOption[] = [
  {
    value: 'person',
    label: 'Person',
    examples: [
      'A medieval knight',
      'A cyberpunk android',
      'A woman in 18th-century attire',
      'A weathered fisherman',
      'A child with a paper crown',
      'A jazz pianist at midnight',
    ],
  },
  {
    value: 'animal',
    label: 'Animal',
    examples: [
      'A majestic eagle',
      'A surreal underwater fish',
      'A glowing fox',
      'A herd of bison crossing a river',
      'A snow leopard on a cliff edge',
    ],
  },
  {
    value: 'character',
    label: 'Character',
    examples: [
      'A fantasy elf ranger',
      'A sci-fi exploration robot',
      'A Victorian vampire',
      'A masked plague doctor',
      'A noir detective in a rain-slick alley',
    ],
  },
  {
    value: 'location',
    label: 'Location',
    examples: [
      'A gothic castle on a cliff',
      'A bustling neon city',
      'A serene mountain range',
      'An abandoned space station',
      'A desert oasis at dawn',
    ],
  },
  {
    value: 'object',
    label: 'Object',
    examples: [
      'An ancient artifact on velvet',
      'A futuristic gadget',
      'A vintage camera',
      'A teapot mid-pour',
      'A single rose on cracked marble',
    ],
  },
]

export const MEDIUMS: VocabCategory = {
  description: 'Artistic or photographic medium / style family.',
  groups: [
    {
      name: 'Photographic',
      chips: [
        'Photo',
        'RAW photo',
        'Polaroid',
        'Cyanotype',
        'Photogravure',
        'Photorealism',
        'Tintype',
        'Daguerreotype',
        'Film noir still',
      ],
    },
    {
      name: 'Painting',
      chips: [
        'Oil painting',
        'Watercolor',
        'Gouache',
        'Acrylic',
        'Digital painting',
        'Fresco',
        'Encaustic',
        'Tempera',
      ],
    },
    {
      name: 'Drawing',
      chips: [
        'Pencil sketch',
        'Charcoal drawing',
        'Ink drawing',
        'Pen and ink',
        'Pastel drawing',
        'Sumi-e (Japanese ink painting)',
        'Contour drawing',
        'Stippling',
        'Hatching',
        'Scratchboard',
      ],
    },
    {
      name: 'Printmaking',
      chips: [
        'Lithograph',
        'Etching',
        'Aquatint',
        'Drypoint',
        'Mezzotint',
        'Screen print',
        'Woodcut',
        'Linocut',
        'Monoprint',
        'Soft-ground etching',
      ],
    },
    {
      name: 'Digital & 3D',
      chips: [
        '3D render',
        'Octane render',
        'Unreal Engine 5 render',
        'Pixel art',
        'Vector art',
        'Logo / SVG / 2D',
        'Isometric 3D',
        'Knolling (exploded parts, top-down)',
        'Voxel art',
      ],
    },
    {
      name: 'Mixed Media',
      chips: [
        'Collage',
        'Photomontage',
        'Mosaic',
        'Stained glass',
        'Tapestry',
        'Quilling',
        'Origami',
        'Marbling',
        'Embroidery',
        'Papercutting',
        'Macramé',
        'Assemblage',
      ],
    },
    {
      name: 'Stylized',
      chips: [
        'Anime',
        'Manga',
        'Comic book',
        'Graphic novel',
        'Disney Pixar 2D art',
        'Studio Ghibli style',
        'Mad Magazine illustration',
        'Tarot card',
        'Psychedelic',
        'PastelPunk',
        'Mood board',
        'DVD screengrab',
      ],
    },
    {
      name: 'Street & Craft',
      chips: [
        'Graffiti',
        'Spray paint art',
        'Street art mural',
        'Stencil art',
        'Pyrography',
        'Ceramic sculpture',
        'Wire sculpture',
        'Glassblowing',
        'Sand art',
        'Chalk art',
      ],
    },
  ],
}

export const ART_MOVEMENTS: VocabCategory = {
  description: 'Historic / stylistic art movements.',
  groups: [
    {
      name: 'Modern',
      chips: [
        'Impressionism',
        'Post-impressionism',
        'Pointillism',
        'Cubism',
        'Fauvism',
        'Expressionism',
        'Abstract expressionism',
        'Surrealism',
        'Dadaism',
        'Futurism',
        'Constructivism',
        'Suprematism',
        'De Stijl',
        'Bauhaus',
      ],
    },
    {
      name: 'Contemporary',
      chips: [
        'Pop art',
        'Minimalism',
        'Op art',
        'Conceptual art',
        'Land art',
        'Performance art',
        'Installation art',
        'Kinetic art',
        'Outsider art',
      ],
    },
    {
      name: 'Historical',
      chips: [
        'Renaissance',
        'Baroque',
        'Rococo',
        'Romanticism',
        'Realism',
        'Pre-Raphaelite',
        'Art Nouveau',
        'Art Deco',
        'Chiaroscuro',
      ],
    },
    {
      name: 'Regional & Folk',
      chips: [
        'Ukiyo-e',
        'Madhubani (Indian folk)',
        'Ebru (Turkish marbling)',
        'Kintsugi-inspired',
        'Cloisonné',
        'Murrine',
        'Aboriginal dot painting',
      ],
    },
  ],
}

export const ENVIRONMENTS: VocabCategory = {
  description: 'Where the scene takes place.',
  groups: [
    {
      name: 'Outdoor — Natural',
      chips: [
        'Mountain range',
        'Dense forest',
        'Misty pine woods',
        'Open desert',
        'Tropical jungle',
        'Snowy tundra',
        'Coastal cliffs',
        'Tide pools',
        'Underwater coral reef',
        'Volcanic landscape',
        'Rolling meadow',
        'Lakeside at dawn',
      ],
    },
    {
      name: 'Urban',
      chips: [
        'Neon-lit cyberpunk city',
        'Cobblestone medieval town',
        'Bustling night market',
        'Rain-slick noir alley',
        'Rooftop skyline',
        'Subway platform',
        'Industrial port',
        'Quiet suburban street',
      ],
    },
    {
      name: 'Interior',
      chips: [
        'Candlelit library',
        'Cozy living room',
        'Cluttered artist studio',
        'Grand cathedral interior',
        'Smoky jazz club',
        'Minimalist gallery',
        'Brutalist concrete bunker',
        'Steampunk workshop',
      ],
    },
    {
      name: 'Speculative',
      chips: [
        'Surface of the moon',
        'Floating sky islands',
        'Mars colony',
        'Underwater city',
        'Cosmic void with nebulae',
        'Post-apocalyptic ruins',
        'Crystal cavern',
        'Inside a dream',
      ],
    },
  ],
}

export const LIGHTING: VocabCategory = {
  description: 'Lighting setup and qualities.',
  groups: [
    {
      name: 'Natural',
      chips: [
        'Golden hour',
        'Blue hour',
        'Overcast diffused light',
        'Dappled sunlight',
        'Moonlight',
        'Starlight',
        'Underwater caustics',
      ],
    },
    {
      name: 'Studio & Cinematic',
      chips: [
        'Studio softbox lighting',
        'Three-point lighting',
        'Rim light',
        'Backlit silhouette',
        'Chiaroscuro contrast',
        'Volumetric god rays',
        'Lens flare',
      ],
    },
    {
      name: 'Practical',
      chips: [
        'Neon signs',
        'Candlelight',
        'Firelight',
        'Lantern glow',
        'Computer screen glow',
        'Streetlamp pool',
      ],
    },
    {
      name: 'Mood',
      chips: [
        'Soft and ambient',
        'High contrast hard light',
        'Foggy and atmospheric',
        'Bioluminescent glow',
      ],
    },
  ],
}

export const TIME_OF_DAY: VocabCategory = {
  description: 'When the scene takes place.',
  groups: [
    {
      name: 'Times',
      chips: [
        'Dawn',
        'Sunrise',
        'Morning',
        'Noon',
        'Afternoon',
        'Golden hour',
        'Twilight',
        'Dusk',
        'Sunset',
        'Night',
        'Midnight',
        'Blue hour',
        'Pre-dawn',
      ],
    },
  ],
}

export const MOOD: VocabCategory = {
  description: 'Emotional tone or energy.',
  groups: [
    {
      name: 'Calm',
      chips: ['Serene', 'Sedate', 'Contemplative', 'Peaceful', 'Nostalgic', 'Dreamlike'],
    },
    {
      name: 'Energetic',
      chips: ['Raucous', 'Energetic', 'Triumphant', 'Joyful', 'Whimsical', 'Playful'],
    },
    {
      name: 'Dark',
      chips: ['Ominous', 'Melancholic', 'Foreboding', 'Haunting', 'Mysterious', 'Eerie', 'Tense'],
    },
    {
      name: 'Dramatic',
      chips: ['Dramatic', 'Epic', 'Heroic', 'Solemn', 'Reverent', 'Cinematic'],
    },
  ],
}

export const COLOR: VocabCategory = {
  description: 'Color palette and treatment.',
  groups: [
    {
      name: 'Saturation',
      chips: [
        'Vibrant',
        'Muted',
        'Bright',
        'Desaturated',
        'Monochromatic',
        'Black and white',
        'Sepia',
        'Duotone',
      ],
    },
    {
      name: 'Tone',
      chips: ['Pastel', 'Warm palette', 'Cool palette', 'Earth tones', 'Jewel tones', 'Neon palette'],
    },
    {
      name: 'Scheme',
      chips: [
        'Complementary colors',
        'Analogous palette',
        'Triadic palette',
        'Split-complementary',
        'High-key',
        'Low-key',
      ],
    },
  ],
}

export const COMPOSITION: VocabCategory = {
  description: 'Framing and composition rules.',
  groups: [
    {
      name: 'Framing',
      chips: ['Portrait', 'Headshot', 'Closeup', 'Wide composition', 'Macro', 'Panoramic'],
    },
    {
      name: 'Rules',
      chips: [
        'Rule of thirds',
        'Centered composition',
        'Symmetrical',
        'Leading lines',
        'Frame within a frame',
        'Negative space',
        'Golden ratio',
      ],
    },
    {
      name: 'Subject placement',
      chips: ['Silhouette', 'Candid', 'Foreground anchor', 'Vanishing point'],
    },
  ],
}

export const SHOT_TYPES: VocabCategory = {
  description: 'Cinematic shot type.',
  groups: [
    {
      name: 'Shots',
      chips: [
        'Long shot',
        'Wide shot',
        'Establishing shot',
        'Medium shot',
        'Closeup shot',
        'Extreme closeup',
        'Full body shot',
        'Over-the-shoulder',
        'Point of view',
        'Two-shot',
      ],
    },
  ],
}

export const CAMERA_ANGLES: VocabCategory = {
  description: 'Where the camera is positioned.',
  groups: [
    {
      name: 'Angles',
      chips: [
        'Eye level',
        'Low angle',
        'High angle',
        'Dutch angle (tilt)',
        "Bird's-eye view",
        "Worm's-eye view",
        'Drone shot',
        'Top-down flat-lay',
      ],
    },
  ],
}

export const CAMERA_LENS: VocabCategory = {
  description: 'Camera body and lens hints.',
  groups: [
    {
      name: 'Cameras',
      chips: [
        'Vintage film camera',
        'Polaroid SX-70',
        '35mm SLR',
        'Medium format',
        'Large format',
        'Disposable camera',
        'IMAX 70mm',
        'Arri Alexa',
        'RED Komodo',
        'Canon EOS R5',
      ],
    },
    {
      name: 'Lenses',
      chips: [
        '24mm wide-angle',
        '35mm prime',
        '50mm prime',
        '85mm portrait',
        '135mm telephoto',
        'Fisheye',
        'Tilt-shift',
        'Macro lens',
        'Anamorphic lens',
      ],
    },
  ],
}

export const ARTISTS_AND_DIRECTORS: VocabCategory = {
  description: 'Notable artists, illustrators, and cinematographers used as style references.',
  groups: [
    {
      name: 'Painters',
      chips: [
        'Van Gogh',
        'Monet',
        'Vermeer',
        'Rembrandt',
        'Caravaggio',
        'Klimt',
        'Hopper',
        'Dalí',
        'Magritte',
        'Picasso',
        'Mucha',
      ],
    },
    {
      name: 'Illustrators',
      chips: [
        'Moebius',
        'H.R. Giger',
        'Beksiński',
        'James Jean',
        'Greg Rutkowski',
        'Alphonse Mucha',
        'Mary Blair',
      ],
    },
    {
      name: 'Cinematographers',
      chips: [
        'Roger Deakins',
        'Emmanuel Lubezki',
        'Vittorio Storaro',
        'Bradford Young',
        'Hoyte van Hoytema',
      ],
    },
    {
      name: 'Directors',
      chips: [
        'Wes Anderson',
        'Denis Villeneuve',
        'Studio Ghibli',
        'Stanley Kubrick',
        'David Fincher',
        'Guillermo del Toro',
      ],
    },
  ],
}

/** All vocabulary in one map for the free-form chip sidebar. Order matters — used as accordion order. */
export const ALL_VOCAB: Record<string, VocabCategory> = {
  Mediums: MEDIUMS,
  'Art Movements': ART_MOVEMENTS,
  Environments: ENVIRONMENTS,
  Lighting: LIGHTING,
  'Time of Day': TIME_OF_DAY,
  Mood: MOOD,
  Color: COLOR,
  Composition: COMPOSITION,
  'Shot Types': SHOT_TYPES,
  'Camera Angles': CAMERA_ANGLES,
  'Camera & Lens': CAMERA_LENS,
  'Artists & Directors': ARTISTS_AND_DIRECTORS,
}

/** Aspect ratio presets for MJ. */
export const ASPECT_RATIOS = ['1:1', '4:5', '2:3', '3:2', '4:3', '16:9', '9:16', '21:9'] as const

export const MJ_VERSIONS = ['6.1', '6', '5.2', 'niji 6'] as const
