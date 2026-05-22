// built by nnnsightnnn — signal from noise
// Magazine shell — masthead at top, two-column workshop (or full-width essay
// for the Free Studio), Folio archive, colophon, and a sticky drafting dock.

import { useEffect, useMemo, useState } from 'react'
import BrandCredit from './BrandCredit'
import { FreeformMode } from './components/FreeformMode'
import { Header } from './components/Header'
import { Library } from './components/Library'
import { OutputPanel } from './components/OutputPanel'
import { SettingsDrawer } from './components/SettingsDrawer'
import { WizardMode } from './components/WizardMode'
import { useLimnState } from './lib/useLimnState'

const TOTAL_MOVEMENTS = 6

export default function App() {
  const state = useLimnState()
  const [settingsOpen, setSettingsOpen] = useState(false)

  // Session-local "revision" counter — bumps whenever the manuscript state
  // changes. Used as a friendly drafting indicator in the header + dock.
  const [revision, setRevision] = useState(0)
  useEffect(() => {
    setRevision((r) => r + 1)
  }, [state.slots, state.params, state.freeform])

  const touchedSteps = useMemo(() => countTouched(state), [state.slots, state.params])

  // Restore edition (paper/evening) on first load.
  useEffect(() => {
    const stored = localStorage.getItem('limn:edition')
    const edition = stored === 'evening' ? 'evening' : 'paper'
    document.documentElement.dataset.edition = edition
    document.body.dataset.edition = edition
  }, [])

  function handleNewSession() {
    if (state.isDirty) {
      const ok = confirm(
        'Begin a fresh draft? Your current in-progress work will be cleared (the Folio and parameter preferences are kept).',
      )
      if (!ok) return
    }
    state.resetSlots()
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-paper)' }}>
      <div style={{ position: 'relative', zIndex: 2 }}>
        <Header
          mode={state.mode}
          setMode={state.setMode}
          onOpenSettings={() => setSettingsOpen(true)}
          onNewSession={handleNewSession}
          hasKey={Boolean(state.settings.openrouterKey)}
          dirty={state.isDirty}
          revision={revision}
          touchedSteps={touchedSteps}
          totalSteps={TOTAL_MOVEMENTS}
        />

        <main
          style={{
            maxWidth: 1320,
            margin: '0 auto',
            padding: '40px 56px 140px',
          }}
        >
          {state.mode === 'wizard' ? (
            <div className="grid lg:grid-cols-[1fr_380px] gap-14 items-start">
              <section className="min-w-0">
                <WizardMode state={state} />
              </section>
              <OutputPanel state={state} />
            </div>
          ) : (
            <div className="grid lg:grid-cols-[1fr_380px] gap-14 items-start">
              <section className="min-w-0">
                <FreeformMode state={state} />
              </section>
              <OutputPanel state={state} />
            </div>
          )}

          <Library state={state} />

          <Colophon />

          <BrandCredit />
        </main>
      </div>

      <DraftingDock
        active={activeMovement(state)}
        touched={touchedSteps}
        total={TOTAL_MOVEMENTS}
        dirty={state.isDirty}
        revision={revision}
      />

      <SettingsDrawer
        state={state}
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  )
}

function Colophon() {
  return (
    <footer
      style={{
        marginTop: 88,
        paddingTop: 24,
        borderTop: '2px solid var(--color-rule)',
        display: 'grid',
        gridTemplateColumns: '1.4fr 1fr 1fr',
        gap: 32,
        fontFamily: 'var(--font-sans)',
        fontSize: 11,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'var(--color-ink-mute)',
      }}
    >
      <div>
        <h5 style={colophonHeading}>Colophon</h5>
        <p style={colophonBody}>
          Limn is set in Bodoni Moda and EB Garamond, with Inter and JetBrains Mono for marginalia
          and machine matter. Printed quarterly from a single browser tab; bound by the reader's
          localStorage.
        </p>
      </div>
      <div>
        <h5 style={colophonHeading}>Masthead</h5>
        <p style={colophonBody}>
          Editor &amp; sole subscriber: <em>You</em>. Compositions assembled from MidJourney,
          FLUX, and the long memory of cinema. Source on{' '}
          <a
            href="https://github.com/Nnnsightnnn/limn"
            target="_blank"
            rel="noreferrer"
            style={{ color: 'var(--color-accent)', textDecoration: 'none' }}
          >
            GitHub
          </a>
          .
        </p>
      </div>
      <div style={{ textAlign: 'right' }}>
        <h5 style={colophonHeading}>Folio</h5>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: 28,
            color: 'var(--color-ink)',
            letterSpacing: 0,
            textTransform: 'none',
          }}
        >
          — I · 02 —
        </div>
        <p style={{ ...colophonBody, textAlign: 'right' }}>
          {monthYear()} · Open Atelier · BYO Key
        </p>
      </div>
    </footer>
  )
}

const colophonHeading: React.CSSProperties = {
  margin: '0 0 8px',
  fontFamily: 'var(--font-display)',
  fontWeight: 500,
  fontStyle: 'italic',
  fontSize: 16,
  letterSpacing: 0,
  textTransform: 'none',
  color: 'var(--color-ink)',
}

const colophonBody: React.CSSProperties = {
  margin: 0,
  fontFamily: 'var(--font-serif)',
  fontSize: 14,
  letterSpacing: 0,
  textTransform: 'none',
  lineHeight: 1.5,
  color: 'var(--color-ink-soft)',
}

function DraftingDock({
  active,
  touched,
  total,
  dirty,
  revision,
}: {
  active: number
  touched: number
  total: number
  dirty: boolean
  revision: number
}) {
  return (
    <aside className="dock" aria-label="Drafting status">
      <div className="dock-inner">
        <div className="dock-status">
          <span className="dot" /> {dirty ? 'Drafting' : 'At rest'} Plate{' '}
          <span className="num" style={{ color: 'var(--color-accent)', fontWeight: 600 }}>
            {String(revision).padStart(2, '0')}
          </span>
        </div>
        <div className="dock-progress">
          <span>
            Movement{' '}
            <span style={{ color: 'var(--color-accent)', fontWeight: 600 }} className="num">
              {roman(active + 1)}
            </span>{' '}
            of {roman(total)}
          </span>
          <div className="dock-pips" aria-hidden="true">
            {Array.from({ length: total }, (_, i) => (
              <span
                key={i}
                className={
                  'pip' +
                  (i === active ? ' active' : i < touched ? ' done' : '')
                }
              />
            ))}
          </div>
          <span>
            {touched} of {total} touched
          </span>
        </div>
        <div className="dock-actions">
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 9.5,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--color-ink-mute)',
            }}
          >
            ⌘S — copy from manuscript
          </span>
        </div>
      </div>
    </aside>
  )
}

const ROMAN_NUM = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII']
function roman(n: number): string {
  return ROMAN_NUM[n - 1] ?? String(n)
}

function activeMovement(state: ReturnType<typeof useLimnState>): number {
  const c = stepCounts(state)
  // first unfilled movement, or last filled one
  for (let i = 0; i < c.length; i++) if (c[i] === 0) return i
  return c.length - 1
}

function countTouched(state: ReturnType<typeof useLimnState>): number {
  return stepCounts(state).filter((n) => n > 0).length
}

function stepCounts(state: ReturnType<typeof useLimnState>): number[] {
  const { slots, params } = state
  const subjectCount = (slots.subject.trim() ? 1 : 0) + (slots.subjectSubType ? 1 : 0)
  const mediumCount = slots.medium.length + (slots.artists.trim() ? 1 : 0)
  const sceneCount = slots.environment.length + slots.lighting.length + slots.timeOfDay.length
  const moodCount = slots.mood.length + slots.color.length
  const cameraCount =
    slots.composition.length +
    slots.shotType.length +
    slots.cameraAngle.length +
    slots.cameraLens.length
  let paramsCount = 0
  if (params.styleRaw) paramsCount++
  if (params.tile) paramsCount++
  if (params.chaos >= 0) paramsCount++
  if (params.stylize >= 0) paramsCount++
  if (params.quality >= 0) paramsCount++
  if (params.weird >= 0) paramsCount++
  if (params.seed) paramsCount++
  if (params.negative) paramsCount++
  return [subjectCount, mediumCount, sceneCount, moodCount, cameraCount, paramsCount]
}

function monthYear(): string {
  const d = new Date()
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  // Roman numeral year — for fun, matches design
  const yr = d.getFullYear()
  return `${months[d.getMonth()]} ${toRomanYear(yr)}`
}

function toRomanYear(n: number): string {
  const map: Array<[number, string]> = [
    [1000, 'M'],
    [900, 'CM'],
    [500, 'D'],
    [400, 'CD'],
    [100, 'C'],
    [90, 'XC'],
    [50, 'L'],
    [40, 'XL'],
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ]
  let out = ''
  let rem = n
  for (const [v, s] of map) {
    while (rem >= v) {
      out += s
      rem -= v
    }
  }
  return out
}
