// Slide-in "Editorial Notes" panel — OpenRouter key, model, and Edition toggle
// (paper / evening). Matches the magazine palette.

import { useEffect, useState } from 'react'
import { SEED_MODELS } from '../lib/openrouter'
import type { LimnState } from '../lib/useLimnState'

type Edition = 'paper' | 'evening'

export function SettingsDrawer({
  state,
  open,
  onClose,
}: {
  state: LimnState
  open: boolean
  onClose: () => void
}) {
  const { settings, setSettings } = state
  const [showKey, setShowKey] = useState(false)

  // Edition (paper/evening) is a visual preference — stored on document for now;
  // not persisted in `Settings` to avoid a storage migration.
  const [edition, setEdition] = useState<Edition>(() => {
    const stored = localStorage.getItem('limn:edition')
    return stored === 'evening' ? 'evening' : 'paper'
  })
  useEffect(() => {
    document.documentElement.dataset.edition = edition
    document.body.dataset.edition = edition
    localStorage.setItem('limn:edition', edition)
  }, [edition])

  if (!open) return null

  return (
    <>
      <button
        type="button"
        aria-label="Close settings"
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'oklch(0 0 0 / 0.45)',
          zIndex: 60,
          border: 0,
          cursor: 'default',
        }}
      />
      <aside
        style={{
          position: 'fixed',
          right: 0,
          top: 0,
          bottom: 0,
          width: '100%',
          maxWidth: 420,
          background: 'var(--color-paper)',
          borderLeft: '1px solid var(--color-rule)',
          zIndex: 70,
          overflowY: 'auto',
          color: 'var(--color-ink)',
        }}
      >
        <div style={{ padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: 24 }}>
          <header
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              paddingBottom: 12,
              borderBottom: '2px solid var(--color-rule)',
            }}
          >
            <div>
              <div className="kicker">Editorial Notes</div>
              <h2
                style={{
                  margin: '6px 0 0',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 500,
                  fontSize: 36,
                  letterSpacing: '-0.01em',
                  lineHeight: 1,
                  color: 'var(--color-ink)',
                }}
              >
                Settings
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              style={{
                background: 'none',
                border: 0,
                cursor: 'pointer',
                color: 'var(--color-ink-mute)',
                fontFamily: 'var(--font-sans)',
                fontSize: 22,
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </header>

          <section>
            <div className="group-label">OpenRouter API key</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type={showKey ? 'text' : 'password'}
                value={settings.openrouterKey}
                onChange={(e) =>
                  setSettings((p) => ({ ...p, openrouterKey: e.target.value.trim() }))
                }
                placeholder="sk-or-v1-..."
                className="field-input"
                style={{ fontFamily: 'var(--font-mono)', fontStyle: 'normal', fontSize: 13 }}
                autoComplete="off"
                spellCheck={false}
              />
              <button
                type="button"
                onClick={() => setShowKey((s) => !s)}
                className="btn"
              >
                {showKey ? 'hide' : 'show'}
              </button>
            </div>
            <p
              style={{
                marginTop: 10,
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: 14,
                lineHeight: 1.5,
                color: 'var(--color-ink-soft)',
              }}
            >
              Stored only in <code style={{ fontFamily: 'var(--font-mono)', fontStyle: 'normal' }}>localStorage</code>{' '}
              on this device. Get one at{' '}
              <a
                href="https://openrouter.ai/keys"
                target="_blank"
                rel="noreferrer"
                style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}
              >
                openrouter.ai/keys
              </a>
              .
            </p>
          </section>

          <section>
            <div className="group-label">Model</div>
            <input
              type="text"
              list="limn-model-list"
              value={settings.openrouterModel}
              onChange={(e) =>
                setSettings((p) => ({ ...p, openrouterModel: e.target.value.trim() }))
              }
              placeholder="anthropic/claude-sonnet-4"
              className="field-input"
              style={{ fontFamily: 'var(--font-mono)', fontStyle: 'normal', fontSize: 13 }}
            />
            <datalist id="limn-model-list">
              {SEED_MODELS.map((m) => (
                <option key={m} value={m} />
              ))}
            </datalist>
            <p
              style={{
                marginTop: 10,
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: 14,
                lineHeight: 1.5,
                color: 'var(--color-ink-soft)',
              }}
            >
              Any{' '}
              <a
                href="https://openrouter.ai/models"
                target="_blank"
                rel="noreferrer"
                style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}
              >
                OpenRouter model ID
              </a>{' '}
              works. The seeded list is just a starting point.
            </p>
          </section>

          <section>
            <div className="group-label">Edition</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                className={'btn' + (edition === 'paper' ? ' primary' : '')}
                onClick={() => setEdition('paper')}
              >
                Paper
              </button>
              <button
                type="button"
                className={'btn' + (edition === 'evening' ? ' primary' : '')}
                onClick={() => setEdition('evening')}
              >
                Evening
              </button>
            </div>
            <p
              style={{
                marginTop: 10,
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: 14,
                lineHeight: 1.5,
                color: 'var(--color-ink-soft)',
              }}
            >
              Paper: cream and ink, like a quarterly. Evening: art-book dark for late drafting.
            </p>
          </section>

          <footer
            style={{
              paddingTop: 16,
              borderTop: '1px solid var(--color-rule)',
              fontFamily: 'var(--font-serif)',
              fontSize: 14,
              color: 'var(--color-ink-soft)',
              lineHeight: 1.5,
            }}
          >
            <p style={{ margin: 0 }}>
              Limn keeps everything local. Your key and prompt library never leave this device
              except via explicit AI calls you trigger.
            </p>
            <p style={{ margin: '8px 0 0' }}>
              <a
                href="https://github.com/Nnnsightnnn/limn"
                target="_blank"
                rel="noreferrer"
                style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}
              >
                Source on GitHub →
              </a>
            </p>
          </footer>
        </div>
      </aside>
    </>
  )
}
