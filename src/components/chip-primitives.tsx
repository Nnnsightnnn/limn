// Small reusable building blocks: Chip, ChipCloud, AISuggestButton — styled as
// magazine "cabinet entries" (square borders, serif body, hand-drawn accent
// circle when selected). See `.chip*` rules in src/index.css.

import { useState } from 'react'

export function Chip({
  label,
  active,
  onClick,
  /** Tighter circle rotation variant — caller can sprinkle this on some chips
   *  so a row of selected chips doesn't look identically circled. */
  tight,
}: {
  label: string
  active: boolean
  onClick: () => void
  tight?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        'chip' +
        (active ? ' is-selected' : '') +
        (active && tight ? ' circle-tight' : '')
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
    <div>
      {groups.map((g, gi) => (
        <div key={g.name}>
          <div className="group-label">{g.name}</div>
          <div className="flex flex-wrap gap-1.5">
            {g.chips.map((c, ci) => (
              <Chip
                key={c}
                label={c}
                active={selected.includes(c)}
                onClick={() => onToggle(c)}
                /* alternate the circle rotation between groups */
                tight={(gi + ci) % 3 === 1}
              />
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
      {chips.map((c, i) => (
        <Chip
          key={c}
          label={c}
          active={selected.includes(c)}
          onClick={() => onToggle(c)}
          tight={i % 3 === 1}
        />
      ))}
    </div>
  )
}

/** The ✻ button that triggers AI slot suggestions and renders the returned chips. */
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
    <div className="mt-3">
      <button type="button" onClick={go} disabled={loading} className="chip-suggest">
        <span className="asterism">✻</span>
        {loading ? 'Consulting the Editor…' : 'Ask the Editor for more suggestions'}
      </button>
      {error && (
        <div
          style={{
            marginTop: 10,
            padding: '8px 12px',
            border: '1px solid var(--color-accent)',
            background: 'var(--color-accent-soft)',
            fontFamily: 'var(--font-sans)',
            fontSize: 11,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--color-accent-deep)',
          }}
        >
          {error}
        </div>
      )}
      {suggestions.length > 0 && (
        <div className="mt-3">
          <div className="group-label">AI suggestions — click to add</div>
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map((s) => (
              <button key={s} type="button" onClick={() => onPick(s)} className="chip-ai">
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
