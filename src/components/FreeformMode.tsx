// The Free Studio — a magazine "essay form" where the writer drafts freely.
// Big italic textarea, AI actions on the side, and an Index sidebar (the
// chip library, presented as a magazine index of available vocabulary).

import { useRef, useState } from 'react'
import { ALL_VOCAB } from '../data/vocabulary'
import { enhanceFreeform, parseToSlots } from '../lib/openrouter'
import type { LimnState } from '../lib/useLimnState'
import { Chip } from './chip-primitives'
import { PopularPrompts } from './PopularPrompts'

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
    <div className="space-y-6">
      <header
        style={{
          borderBottom: '2px solid var(--color-rule)',
          paddingBottom: 14,
        }}
      >
        <div className="kicker">The Free Studio &nbsp;·&nbsp; The Essay Form</div>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(36px, 5vw, 56px)',
            fontWeight: 500,
            lineHeight: 1,
            letterSpacing: '-0.02em',
            margin: '8px 0 0',
            color: 'var(--color-ink)',
          }}
        >
          Write your way into <em style={{ color: 'var(--color-accent)', fontWeight: 400 }}>the picture</em>.
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: 18,
            color: 'var(--color-ink-soft)',
            margin: '6px 0 0',
          }}
        >
          A blank page and the Index. Draft anything; have the Editor tidy it; or parse to the Wizard.
        </p>
      </header>

      <div className="grid lg:grid-cols-[1fr_300px] gap-8">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <textarea
            ref={textareaRef}
            value={freeform}
            onChange={(e) => setFreeform(e.target.value)}
            placeholder="Describe whatever's in your head. A rough idea, a paragraph, a paste from somewhere else — anything."
            rows={14}
            className="field-textarea"
            style={{ minHeight: 320 }}
          />

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
            <button
              type="button"
              onClick={doEnhance}
              disabled={busy !== null || !freeform.trim()}
              className="btn primary"
            >
              {busy === 'enhance' ? '· · ·' : '✻'} Have the Editor enhance
            </button>
            <button
              type="button"
              onClick={doParse}
              disabled={busy !== null || !freeform.trim()}
              className="btn"
            >
              {busy === 'parse' ? '· · ·' : '⇄'} Parse to the Wizard
            </button>
            {error && (
              <span
                style={{
                  padding: '6px 12px',
                  border: '1px solid var(--color-accent)',
                  background: 'var(--color-accent-soft)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: 10.5,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: 'var(--color-accent-deep)',
                }}
              >
                {error}
              </span>
            )}
          </div>

          {freeform.trim() === '' && (
            <PopularPrompts
              heading="Popular plates to start from"
              subheading="Click any plate to drop it into the essay above."
              onPick={(p) => {
                setFreeform(p.prompt)
                requestAnimationFrame(() => {
                  const ta = textareaRef.current
                  if (!ta) return
                  ta.focus()
                  const end = p.prompt.length
                  ta.setSelectionRange(end, end)
                })
              }}
            />
          )}
        </div>

        <aside
          aria-label="Index"
          style={{
            border: '1px solid var(--color-rule)',
            padding: 14,
            maxHeight: 640,
            overflowY: 'auto',
            background: 'var(--color-paper)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              marginBottom: 10,
              paddingBottom: 8,
              borderBottom: '1px solid var(--color-rule)',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontStyle: 'italic',
                fontWeight: 500,
                fontSize: 20,
                color: 'var(--color-ink)',
              }}
            >
              Index
            </div>
            <div
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 9.5,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--color-ink-mute)',
              }}
            >
              of available vocabulary
            </div>
          </div>
          <div>
            {Object.entries(ALL_VOCAB).map(([catName, cat]) => {
              const open = openCat === catName
              return (
                <div
                  key={catName}
                  style={{
                    borderBottom: '1px solid var(--color-rule-soft)',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenCat(open ? null : catName)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'baseline',
                      justifyContent: 'space-between',
                      padding: '10px 0',
                      background: 'none',
                      border: 0,
                      cursor: 'pointer',
                      fontFamily: 'var(--font-serif)',
                      fontSize: 16,
                      color: 'var(--color-ink)',
                      fontStyle: open ? 'italic' : 'normal',
                    }}
                  >
                    <span>{catName}</span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 11,
                        color: 'var(--color-ink-mute)',
                      }}
                    >
                      {open ? '—' : '+'}
                    </span>
                  </button>
                  {open && (
                    <div style={{ paddingBottom: 12 }}>
                      {cat.groups.map((g) => (
                        <div key={g.name} style={{ marginBottom: 8 }}>
                          <div className="group-label" style={{ margin: '6px 0 6px' }}>
                            {g.name}
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {g.chips.map((c, i) => {
                              const label = typeof c === 'string' ? c : c.label
                              return (
                                <Chip
                                  key={label}
                                  label={label}
                                  active={false}
                                  onClick={() => insertAtCursor(label)}
                                  tight={i % 3 === 1}
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
    </div>
  )
}
