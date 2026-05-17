// Free-form textarea with a categorized chip sidebar that injects vocabulary at the cursor,
// plus AI-assist actions: enhance, parse-to-slots.

import { useRef, useState } from 'react'
import { ALL_VOCAB } from '../data/vocabulary'
import { enhanceFreeform, parseToSlots } from '../lib/openrouter'
import type { LimnState } from '../lib/useLimnState'
import { Chip } from './chip-primitives'

export function FreeformMode({ state }: { state: LimnState }) {
  const { freeform, setFreeform, setSlots, setMode, settings } = state
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const [busy, setBusy] = useState<null | 'enhance' | 'parse'>(null)
  const [error, setError] = useState<string | null>(null)
  const [openCat, setOpenCat] = useState<string | null>('Mediums')

  function insertAtCursor(value: string) {
    const ta = textareaRef.current
    if (!ta) {
      setFreeform(freeform ? `${freeform}, ${value}` : value)
      return
    }
    const start = ta.selectionStart ?? freeform.length
    const end = ta.selectionEnd ?? freeform.length
    const before = freeform.slice(0, start)
    const after = freeform.slice(end)
    const needsLeadingSep = before.length > 0 && !/[\s,]/.test(before.slice(-1))
    const needsTrailingSep = after.length > 0 && !/[\s,]/.test(after[0])
    const insert = (needsLeadingSep ? ', ' : '') + value + (needsTrailingSep ? ', ' : '')
    const next = before + insert + after
    setFreeform(next)
    // Restore cursor after the inserted value
    requestAnimationFrame(() => {
      ta.focus()
      const pos = (before + insert).length
      ta.setSelectionRange(pos, pos)
    })
  }

  async function doEnhance() {
    setBusy('enhance')
    setError(null)
    try {
      const result = await enhanceFreeform({
        apiKey: settings.openrouterKey,
        model: settings.openrouterModel,
        text: freeform,
      })
      setFreeform(result)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy(null)
    }
  }

  async function doParse() {
    setBusy('parse')
    setError(null)
    try {
      const partial = await parseToSlots({
        apiKey: settings.openrouterKey,
        model: settings.openrouterModel,
        text: freeform,
      })
      setSlots((prev) => ({
        ...prev,
        ...Object.fromEntries(
          Object.entries(partial).filter(([, v]) => v !== undefined && v !== null),
        ),
      }))
      setMode('wizard')
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-4">
      <div className="space-y-3">
        <textarea
          ref={textareaRef}
          value={freeform}
          onChange={(e) => setFreeform(e.target.value)}
          placeholder="Describe whatever's in your head. Type a rough idea, or paste an existing prompt to refine it."
          rows={14}
          className="w-full bg-ink-950 border border-ink-800 rounded-xl px-4 py-3 text-sm text-ink-100 placeholder:text-ink-500 focus:outline-none focus:border-ember-500 leading-relaxed"
        />

        <div className="flex flex-wrap gap-2 items-center">
          <button
            type="button"
            onClick={doEnhance}
            disabled={busy !== null || !freeform.trim()}
            className="text-xs inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-ember-500 text-ink-950 font-medium hover:bg-ember-400 disabled:opacity-40 transition-colors"
          >
            {busy === 'enhance' ? '· · ·' : '✨'} Enhance with AI
          </button>
          <button
            type="button"
            onClick={doParse}
            disabled={busy !== null || !freeform.trim()}
            className="text-xs inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-ink-800 border border-ink-700 text-ink-200 hover:border-ember-500 hover:text-ember-400 disabled:opacity-40 transition-colors"
          >
            {busy === 'parse' ? '· · ·' : '⇄'} Parse to wizard
          </button>
          {error && (
            <span className="text-xs text-red-400/90 bg-red-950/40 border border-red-900/60 rounded-md px-2.5 py-1.5">
              {error}
            </span>
          )}
        </div>
      </div>

      <aside className="rounded-xl border border-ink-800 bg-ink-900/40 p-3 max-h-[640px] overflow-y-auto">
        <div className="text-xs uppercase tracking-wider text-ink-400 mb-2 sticky top-0 bg-ink-900/80 backdrop-blur py-1">
          Chip library
        </div>
        <div className="space-y-1">
          {Object.entries(ALL_VOCAB).map(([catName, cat]) => {
            const open = openCat === catName
            return (
              <div key={catName} className="border-b border-ink-800 last:border-0">
                <button
                  type="button"
                  onClick={() => setOpenCat(open ? null : catName)}
                  className="w-full flex items-center justify-between py-2 text-sm text-ink-200 hover:text-ember-400 transition-colors"
                >
                  <span>{catName}</span>
                  <span className="text-xs text-ink-500">{open ? '−' : '+'}</span>
                </button>
                {open && (
                  <div className="pb-3 space-y-2">
                    {cat.groups.map((g) => (
                      <div key={g.name}>
                        <div className="text-[10px] uppercase tracking-wider text-ink-500 mb-1">
                          {g.name}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {g.chips.map((c) => {
                            const label = typeof c === 'string' ? c : c.label
                            return (
                              <Chip
                                key={label}
                                label={label}
                                active={false}
                                onClick={() => insertAtCursor(label)}
                              />
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </aside>
    </div>
  )
}
