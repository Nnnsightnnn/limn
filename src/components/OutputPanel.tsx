// Right-rail "Working Manuscript" — typewritten, lined paper, revision bar,
// blinking caret, save-to-Folio card, and a sticky editor's-mark note.

import { useEffect, useMemo, useState } from 'react'
import { assembleMidjourney, assembleNaturalLanguage } from '../lib/assemble'
import type { LimnState } from '../lib/useLimnState'

type Tab = 'mj' | 'nl'

export function OutputPanel({ state }: { state: LimnState }) {
  const { slots, params, freeform, mode, saveCurrent, isDirty } = state
  const [tab, setTab] = useState<Tab>('mj')
  const [name, setName] = useState('')
  const [copied, setCopied] = useState(false)
  const [savedFlash, setSavedFlash] = useState(false)
  const [revision, setRevision] = useState(0)

  // Source the manuscript text from whichever mode the user is in.
  const sourceNL =
    mode === 'freeform' && freeform.trim() ? freeform.trim() : assembleNaturalLanguage(slots)
  const sourceMJ =
    mode === 'freeform' && freeform.trim()
      ? [freeform.trim(), buildMJFlagsOnly(state)].filter(Boolean).join(' ')
      : assembleMidjourney(slots, params)

  const shown = tab === 'mj' ? sourceMJ : sourceNL
  const charCount = shown.length

  useEffect(() => {
    setRevision((r) => r + 1)
  }, [shown])

  const segments = useMemo(() => splitMJFlags(shown), [shown])

  function copy() {
    if (!shown) return
    navigator.clipboard.writeText(shown).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    })
  }

  function doSave() {
    if (!shown) return
    saveCurrent(name)
    setName('')
    setSavedFlash(true)
    setTimeout(() => setSavedFlash(false), 1200)
  }

  return (
    <aside
      className="lg:sticky lg:top-6 self-start"
      style={{ display: 'flex', flexDirection: 'column', gap: 22 }}
    >
      <section className="composition" aria-label="Working manuscript">
        <header
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            marginBottom: 14,
            gap: 12,
          }}
        >
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontWeight: 500,
              margin: 0,
              fontSize: 22,
              letterSpacing: '-0.01em',
              color: 'var(--color-ink)',
            }}
          >
            Working Manuscript
          </h3>
          <div style={{ display: 'flex', gap: 10 }}>
            <TabBtn active={tab === 'mj'} onClick={() => setTab('mj')}>
              MidJourney
            </TabBtn>
            <TabBtn active={tab === 'nl'} onClick={() => setTab('nl')}>
              Plain prose
            </TabBtn>
          </div>
        </header>

        <div className="revision-bar">
          {isDirty ? <span className="live">drafting</span> : <span>at rest</span>}
          <span>
            · Revision{' '}
            <span className="num" style={{ color: 'var(--color-ink)' }}>
              {String(revision).padStart(2, '0')}
            </span>
          </span>
          <span>· {charCount} ch.</span>
        </div>

        <pre className="comp-body">
          {shown ? (
            <>
              {segments.map((seg, i) =>
                seg.kind === 'flag' ? (
                  <span key={i} className="mj-flag">
                    {seg.text}
                  </span>
                ) : (
                  <span key={i}>{seg.text}</span>
                ),
              )}
              <span className="comp-caret" />
            </>
          ) : (
            <span style={{ color: 'var(--color-ink-fade)', fontStyle: 'italic' }}>
              (the manuscript is blank — choose a subject to begin)
            </span>
          )}
        </pre>

        <div
          style={{
            marginTop: 14,
            display: 'flex',
            gap: 8,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <button type="button" onClick={copy} disabled={!shown} className="btn primary">
            {copied ? '✓ Copied' : '📋 Copy current draft'}
          </button>
          <span
            style={{
              marginLeft: 'auto',
              color: 'var(--color-ink-fade)',
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              textTransform: 'none',
              letterSpacing: 0,
            }}
          >
            rev {String(revision).padStart(2, '0')}
          </span>
        </div>
      </section>

      <section className="save-card" aria-label="Publish to library">
        <h4>
          <span>Publish this draft to the Folio</span>
          <span className="num">★</span>
        </h4>
        <div className="field">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name this plate before publishing…"
            className="title"
            onKeyDown={(e) => {
              if (e.key === 'Enter') doSave()
            }}
          />
          <button type="button" onClick={doSave} disabled={!shown} className="btn primary">
            {savedFlash ? '✓ Published' : 'Publish'}
          </button>
        </div>
      </section>

      <EditorMark dirty={isDirty} />
    </aside>
  )
}

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: 'none',
        border: 0,
        padding: '4px 0',
        cursor: 'pointer',
        color: active ? 'var(--color-ink)' : 'var(--color-ink-mute)',
        borderBottom: '1px solid ' + (active ? 'var(--color-accent)' : 'transparent'),
        fontFamily: 'var(--font-sans)',
        fontSize: 10,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
      }}
    >
      {children}
    </button>
  )
}

function EditorMark({ dirty }: { dirty: boolean }) {
  if (!dirty) return null
  return (
    <aside className="editor-mark">
      a draft, not yet a verdict — keep going and the manuscript will keep up.
      <span className="sig">— your note to self</span>
    </aside>
  )
}

/** Split a prompt into normal and `--flag` segments, so flags can be tinted accent-red. */
function splitMJFlags(text: string): Array<{ kind: 'text' | 'flag'; text: string }> {
  if (!text) return []
  const parts: Array<{ kind: 'text' | 'flag'; text: string }> = []
  const regex = /(--[a-z]+(?:\s+[^\s-][^\s]*)?)/gi
  let lastIndex = 0
  let m: RegExpExecArray | null
  while ((m = regex.exec(text)) !== null) {
    if (m.index > lastIndex) parts.push({ kind: 'text', text: text.slice(lastIndex, m.index) })
    parts.push({ kind: 'flag', text: m[0] })
    lastIndex = m.index + m[0].length
  }
  if (lastIndex < text.length) parts.push({ kind: 'text', text: text.slice(lastIndex) })
  return parts
}

/** Just the MJ flags suffix, no natural-language prefix — used when in free-form mode. */
function buildMJFlagsOnly(state: LimnState): string {
  const { params } = state
  const flags: string[] = []
  if (params.aspectRatio.trim()) flags.push(`--ar ${params.aspectRatio.trim()}`)
  if (params.version.trim()) {
    const v = params.version.trim()
    if (v.toLowerCase().startsWith('niji')) {
      const num = v.replace(/[^\d.]/g, '')
      flags.push(num ? `--niji ${num}` : '--niji')
    } else {
      flags.push(`--v ${v}`)
    }
  }
  if (params.styleRaw) flags.push('--style raw')
  if (params.stylize >= 0) flags.push(`--stylize ${params.stylize}`)
  if (params.chaos >= 0) flags.push(`--chaos ${params.chaos}`)
  if (params.quality >= 0) flags.push(`--q ${params.quality}`)
  if (params.weird >= 0) flags.push(`--weird ${params.weird}`)
  if (params.seed.trim()) flags.push(`--seed ${params.seed.trim()}`)
  if (params.negative.trim()) flags.push(`--no ${params.negative.trim()}`)
  if (params.tile) flags.push('--tile')
  return flags.join(' ')
}
