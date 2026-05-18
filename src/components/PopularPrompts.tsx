// Click-to-load gallery of curated popular prompts.
// Rendered as an empty-state surface in both Wizard and Free-form modes —
// disappears once the user has any prompt content. The click handler decides
// where the prompt lands (always Free-form, by current design).

import {
  POPULAR_PROMPTS,
  POPULAR_PROMPT_CATEGORY_LABELS,
  type PopularPrompt,
  type PopularPromptCategory,
} from '../data/popularPrompts'

interface PopularPromptsProps {
  /** Called with the prompt's text when a card is clicked. */
  onPick: (prompt: PopularPrompt) => void
  /** Headline copy — varies between Wizard and Free-form contexts. */
  heading?: string
  /** Subline shown under the heading. */
  subheading?: string
}

export function PopularPrompts({
  onPick,
  heading = 'Popular prompts to start with',
  subheading = 'Click any prompt to load it — refine, parse, or send straight to MidJourney.',
}: PopularPromptsProps) {
  return (
    <section
      aria-labelledby="popular-prompts-heading"
      className="rounded-xl border border-ink-800 bg-ink-900/40 p-4 sm:p-5"
    >
      <header className="mb-3 sm:mb-4">
        <h2
          id="popular-prompts-heading"
          className="text-sm font-medium text-ink-100"
        >
          {heading}
        </h2>
        <p className="text-xs text-ink-400 mt-0.5">{subheading}</p>
      </header>

      <ul
        role="list"
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2.5"
      >
        {POPULAR_PROMPTS.map((p) => (
          <li key={p.title}>
            <PromptCard prompt={p} onPick={() => onPick(p)} />
          </li>
        ))}
      </ul>
    </section>
  )
}

function PromptCard({
  prompt,
  onPick,
}: {
  prompt: PopularPrompt
  onPick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onPick}
      title={prompt.prompt}
      className="group w-full h-full text-left rounded-lg border border-ink-800 bg-ink-950/60 px-3 py-2.5 transition-colors hover:border-ember-500 hover:bg-ink-900/80 focus:outline-none focus-visible:border-ember-500 focus-visible:ring-1 focus-visible:ring-ember-500/40"
    >
      <div className="flex items-center justify-between gap-2 mb-1">
        <CategoryTag category={prompt.category} />
        <span
          aria-hidden
          className="text-[10px] text-ink-500 group-hover:text-ember-400 transition-colors"
        >
          load →
        </span>
      </div>
      <div className="text-sm text-ink-100 leading-snug">{prompt.title}</div>
      <div className="text-xs text-ink-400 mt-0.5 line-clamp-2">
        {prompt.blurb}
      </div>
    </button>
  )
}

function CategoryTag({ category }: { category: PopularPromptCategory }) {
  return (
    <span className="text-[10px] uppercase tracking-wider font-mono text-ember-700 bg-ember-700/10 border border-ember-700/30 rounded px-1.5 py-0.5">
      {POPULAR_PROMPT_CATEGORY_LABELS[category]}
    </span>
  )
}
