# PromptForge

A comprehensive, model-agnostic prompt designer for AI image generation. Start from zero with a guided wizard, or paste a rough idea and let the chip library + AI assist flesh it out.

> **Status:** scaffolding — app implementation in progress.

## Why

Image-gen tools are powerful, but writing a prompt that fully exploits them is its own craft. Subject, medium, environment, lighting, color, mood, composition, camera, lens, time of day, style, parameters — each slot is a lever. PromptForge surfaces all the levers, gives you the vocabulary, and assembles a clean prompt for whichever model you're targeting.

## Features (planned)

- **Two starting modes**
  - *Wizard:* step through Subject → Medium → Scene → Mood/Color → Camera → Parameters with curated chip libraries at every step.
  - *Free-form:* big textarea plus a categorized chip sidebar that injects vocabulary at the cursor.
- **Model-agnostic output**
  - Tabs for natural-language, MidJourney (with `--ar`, `--v`, `--style`, etc.), Stable Diffusion / FLUX (positive + negative prompts), and DALL·E 3.
- **OpenRouter-powered AI assist** (BYO key, stored only in your browser's localStorage)
  - Suggest options for any slot given the current state.
  - Enhance a rough free-form prompt into a rich one.
  - Parse an existing prompt back into structured slots.
- **Prompt library** — save, star, copy, export to JSON. All local; nothing leaves your machine except the OpenRouter calls you explicitly trigger.
- **Single self-contained HTML file** — no install, no server, works offline (minus the AI calls).

## Repo layout

```
promptforge/
├── index.html              # the app — single self-contained file
├── docs/
│   ├── midjourney-v6.1-cheat-sheet.txt   # source vocabulary (prompt structure)
│   └── cinematic-template.txt            # source vocabulary (shot types, mediums)
├── src/                    # reserved for future split-file refactor
├── LICENSE                 # MIT
└── README.md
```

## Running it

Open `index.html` in any modern browser. That's it.

Optional: add an [OpenRouter](https://openrouter.ai) API key in the Settings panel to enable AI-assisted suggestions. The key is stored only in `localStorage` on your device and is sent only with the requests you trigger.

## Roadmap

- [ ] v0: scaffold + README (you are here)
- [ ] v0.1: Wizard mode end-to-end with seed vocabulary from `docs/`
- [ ] v0.2: Free-form mode with chip sidebar
- [ ] v0.3: Multi-model output rendering (NL / MJ / SD / FLUX / DALL·E)
- [ ] v0.4: OpenRouter integration (suggest, enhance, parse)
- [ ] v0.5: Prompt library (save / star / export)
- [ ] v0.6: Polish — keyboard shortcuts, mobile layout, theming
- [ ] v1.0: First tagged release

## License

MIT — see [LICENSE](./LICENSE).
