// The magazine masthead: drafting strip + big Bodoni "Limn" + masthead-strap +
// section-nav (Wizard / Free-form / Folio / Settings).

import { useEffect, useState } from 'react'
import type { Mode } from '../lib/types'

export function Header({
  mode,
  setMode,
  onOpenSettings,
  onNewSession,
  hasKey,
  dirty,
  revision,
  touchedSteps,
  totalSteps,
}: {
  mode: Mode
  setMode: (m: Mode) => void
  onOpenSettings: () => void
  onNewSession: () => void
  hasKey: boolean
  dirty: boolean
  revision: number
  touchedSteps: number
  totalSteps: number
}) {
  // Lightweight "X seconds ago" for the autosave indicator. Resets on dirty changes.
  const [savedAt, setSavedAt] = useState<number>(() => Date.now())
  const [tick, setTick] = useState(0)

  useEffect(() => {
    setSavedAt(Date.now())
  }, [revision])

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 1000)
    return () => window.clearInterval(id)
  }, [])

  const ago = formatAgo(Date.now() - savedAt, tick)

  return (
    <header className="px-14 pt-7 pb-1">
      <div className="max-w-[1320px] mx-auto">
        <div className="draft-strip" aria-label="Drafting status">
          <div className="left">
            <span className="pill"><span className="live-dot" />Working Proof</span>
            &nbsp;&nbsp;Vol. I · No. 02 &nbsp;·&nbsp;{' '}
            <span className="accent">{dirty ? 'drafting' : 'at rest'}</span>
          </div>
          <div className="center">
            Revision <span className="accent num">{String(revision).padStart(2, '0')}</span>
            &nbsp;·&nbsp; auto-saved <span className="accent">{ago}</span>
            &nbsp;·&nbsp; {touchedSteps} of {totalSteps} movements touched
          </div>
          <div className="right">
            Composer: <span className="accent">you</span>
            &nbsp;·&nbsp;
            <button
              type="button"
              onClick={onNewSession}
              title={dirty ? 'Clear the current prompt (will confirm)' : 'Start a fresh prompt'}
              className="underline-offset-4 hover:text-[var(--color-accent)] transition-colors"
              style={{ background: 'none', border: 0, font: 'inherit', letterSpacing: 'inherit', textTransform: 'inherit', cursor: 'pointer', padding: 0, color: 'inherit' }}
              aria-label="New session"
            >
              ＋ new draft
            </button>
          </div>
        </div>

        <h1 className="masthead">
          <span className="crescent" aria-hidden="true" />
          Limn
        </h1>

        <div className="masthead-strap">
          <hr />
          <div className="tag whitespace-nowrap">
            An Atelier in your Browser &nbsp;·&nbsp; Composing in Progress &nbsp;·&nbsp; Bring Your Own Key
          </div>
          <hr />
        </div>

        <nav className="section-nav mt-6" aria-label="Sections">
          <button
            type="button"
            className={mode === 'wizard' ? 'is-active' : ''}
            onClick={() => setMode('wizard')}
          >
            The Wizard
          </button>
          <span className="sep">/</span>
          <button
            type="button"
            className={mode === 'freeform' ? 'is-active' : ''}
            onClick={() => setMode('freeform')}
          >
            The Free Studio
          </button>
          <span className="sep">/</span>
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('folio')
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }}
          >
            The Folio
          </button>
          <span className="sep">/</span>
          <button type="button" onClick={onOpenSettings}>
            {hasKey ? 'Settings' : (
              <>
                Settings <span style={{ color: 'var(--color-accent)', marginLeft: 8 }}>add API key</span>
              </>
            )}
          </button>
        </nav>
      </div>
    </header>
  )
}

function formatAgo(ms: number, _tick: number): string {
  void _tick // keep the component re-rendering on tick changes
  const sec = Math.max(0, Math.floor(ms / 1000))
  if (sec < 60) return `${sec}s ago`
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min}m ago`
  const hr = Math.floor(min / 60)
  return `${hr}h ago`
}
