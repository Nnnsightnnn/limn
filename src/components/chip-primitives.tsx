// Small reusable building blocks: Chip, ChipCloud, AISuggestButton.

import { useState } from 'react'

export function Chip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        'inline-flex items-center px-3 py-1 rounded-full text-xs border transition-colors ' +
        (active
          ? 'bg-ember-500 border-ember-500 text-ink-950 font-medium'
          : 'bg-ink-900 border-ink-700 text-ink-200 hover:border-ember-500 hover:text-ember-400')
      }
    >
      {label}
    </button>
  )
}

export interface ChipCloudGroup {
  name: string
  chips: string[]
}

export function ChipCloud({
  groups,
  selected,
  onToggle,
}: {
  groups: ChipCloudGroup[]
  selected: string[]
  onToggle: (value: string) => void
}) {
  return (
    <div className="space-y-3">
      {groups.map((g) => (
        <div key={g.name}>
          <div className="text-[10px] uppercase tracking-wider text-ink-400 mb-1.5">
            {g.name}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {g.chips.map((c) => (
              <Chip key={c} label={c} active={selected.includes(c)} onClick={() => onToggle(c)} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

/** Flat single-row variant (no group labels). */
export function ChipRow({
  chips,
  selected,
  onToggle,
}: {
  chips: string[]
  selected: string[]
  onToggle: (value: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {chips.map((c) => (
        <Chip key={c} label={c} active={selected.includes(c)} onClick={() => onToggle(c)} />
      ))}
    </div>
  )
}

/** The ✨ button that triggers AI slot suggestions and renders the returned chips. */
export function AISuggestButton({
  onRequest,
  onPick,
}: {
  onRequest: () => Promise<string[]>
  onPick: (value: string) => void
}) {
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  async function go() {
    setLoading(true)
    setError(null)
    try {
      const result = await onRequest()
      setSuggestions(result)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-3 space-y-2">
      <button
        type="button"
        onClick={go}
        disabled={loading}
        className="text-xs inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-ink-800/80 border border-ink-700 text-ink-200 hover:border-ember-500 hover:text-ember-400 disabled:opacity-50 transition-colors"
      >
        {loading ? '· · ·' : '✨'} Suggest more (AI)
      </button>
      {error && (
        <div className="text-xs text-red-400/90 bg-red-950/40 border border-red-900/60 rounded-md px-2.5 py-1.5">
          {error}
        </div>
      )}
      {suggestions.length > 0 && (
        <div>
          <div className="text-[10px] uppercase tracking-wider text-ember-400 mb-1.5">
            AI suggestions — click to add
          </div>
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onPick(s)}
                className="text-xs px-3 py-1 rounded-full bg-ember-500/10 border border-ember-500/40 text-ember-400 hover:bg-ember-500 hover:text-ink-950 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
