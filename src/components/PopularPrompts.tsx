// A "popular plates" gallery shown as an empty-state for both Wizard and Free
// Studio. Rendered as a magazine plate-strip — each card a numbered Plate with
// category tag, title and blurb.

import {
  POPULAR_PROMPTS,
  POPULAR_PROMPT_CATEGORY_LABELS,
  type PopularPrompt,
  type PopularPromptCategory,
} from '../data/popularPrompts'

interface PopularPromptsProps {
  onPick: (prompt: PopularPrompt) => void
  heading?: string
  subheading?: string
}

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']

export function PopularPrompts({
  onPick,
  heading = 'Popular plates to start from',
  subheading = 'Click any plate to load it — refine, parse, or send straight to MidJourney.',
}: PopularPromptsProps) {
  return (
    <section
      aria-labelledby="popular-prompts-heading"
      style={{
        marginTop: 24,
        borderTop: '1px solid var(--color-rule)',
        paddingTop: 22,
      }}
    >
      <header style={{ marginBottom: 18 }}>
        <div className="kicker">From the Backlist</div>
        <h3
          id="popular-prompts-heading"
          style={{
            margin: '6px 0 4px',
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontWeight: 500,
            fontSize: 28,
            letterSpacing: '-0.01em',
            color: 'var(--color-ink)',
          }}
        >
          {heading}
        </h3>
        <p
          style={{
            margin: 0,
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: 16,
            color: 'var(--color-ink-soft)',
          }}
        >
          {subheading}
        </p>
      </header>

      <ul role="list" className="archive-grid" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {POPULAR_PROMPTS.map((p, i) => (
          <li key={p.title}>
            <PromptCard prompt={p} index={i} onPick={() => onPick(p)} />
          </li>
        ))}
      </ul>
    </section>
  )
}

function PromptCard({
  prompt,
  index,
  onPick,
}: {
  prompt: PopularPrompt
  index: number
  onPick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onPick}
      title={prompt.prompt}
      className="archive-card"
    >
      <div className="img">
        <span className="plate-no">Plate {ROMAN[index] ?? index + 1}</span>
      </div>
      <div className="title">{prompt.title}</div>
      <div className="by">
        <CategoryTag category={prompt.category} />
      </div>
      <div
        style={{
          marginTop: 6,
          fontFamily: 'var(--font-serif)',
          fontSize: 14,
          color: 'var(--color-ink-soft)',
          lineHeight: 1.4,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {prompt.blurb}
      </div>
    </button>
  )
}

function CategoryTag({ category }: { category: PopularPromptCategory }) {
  return (
    <span className="cat">{POPULAR_PROMPT_CATEGORY_LABELS[category]}</span>
  )
}
