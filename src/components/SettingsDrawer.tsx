// Slide-in panel for OpenRouter API key + model selection.

import { useState } from 'react'
import { SEED_MODELS } from '../lib/openrouter'
import type { LimnState } from '../lib/useLimnState'

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

  if (!open) return null

  return (
    <>
      <button
        type="button"
        aria-label="Close settings"
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-20"
      />
      <aside className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-ink-950 border-l border-ink-800 z-30 overflow-y-auto">
        <div className="p-5 space-y-5">
          <header className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-ink-100">Settings</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-ink-400 hover:text-ink-100"
              aria-label="Close"
            >
              ×
            </button>
          </header>

          <section className="space-y-3">
            <div>
              <div className="text-xs uppercase tracking-wider text-ink-400 mb-1.5">
                OpenRouter API key
              </div>
              <div className="flex gap-2">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={settings.openrouterKey}
                  onChange={(e) =>
                    setSettings((p) => ({ ...p, openrouterKey: e.target.value.trim() }))
                  }
                  placeholder="sk-or-v1-..."
                  className="flex-1 bg-ink-900 border border-ink-800 rounded-md px-3 py-1.5 text-sm font-mono text-ink-100 placeholder:text-ink-500 focus:outline-none focus:border-ember-500"
                  autoComplete="off"
                  spellCheck={false}
                />
                <button
                  type="button"
                  onClick={() => setShowKey((s) => !s)}
                  className="text-xs px-2.5 py-1.5 rounded-md border border-ink-700 text-ink-300 hover:border-ember-500 hover:text-ember-400"
                >
                  {showKey ? 'hide' : 'show'}
                </button>
              </div>
              <p className="text-xs text-ink-500 mt-1.5">
                Stored only in <code className="text-ink-400">localStorage</code> on this device.
                Get one at{' '}
                <a
                  href="https://openrouter.ai/keys"
                  target="_blank"
                  rel="noreferrer"
                  className="text-ember-400 underline underline-offset-2"
                >
                  openrouter.ai/keys
                </a>
                .
              </p>
            </div>

            <div>
              <div className="text-xs uppercase tracking-wider text-ink-400 mb-1.5">Model</div>
              <input
                type="text"
                list="limn-model-list"
                value={settings.openrouterModel}
                onChange={(e) =>
                  setSettings((p) => ({ ...p, openrouterModel: e.target.value.trim() }))
                }
                placeholder="anthropic/claude-sonnet-4"
                className="w-full bg-ink-900 border border-ink-800 rounded-md px-3 py-1.5 text-sm font-mono text-ink-100 placeholder:text-ink-500 focus:outline-none focus:border-ember-500"
              />
              <datalist id="limn-model-list">
                {SEED_MODELS.map((m) => (
                  <option key={m} value={m} />
                ))}
              </datalist>
              <p className="text-xs text-ink-500 mt-1.5">
                Any{' '}
                <a
                  href="https://openrouter.ai/models"
                  target="_blank"
                  rel="noreferrer"
                  className="text-ember-400 underline underline-offset-2"
                >
                  OpenRouter model ID
                </a>{' '}
                works. The seeded list is just a starting point.
              </p>
            </div>
          </section>

          <footer className="pt-4 border-t border-ink-800 text-xs text-ink-500 space-y-1">
            <p>
              Limn keeps everything local. Your key and prompt library never leave this device
              except via explicit AI calls you trigger.
            </p>
            <p>
              <a
                href="https://github.com/Nnnsightnnn/limn"
                target="_blank"
                rel="noreferrer"
                className="text-ember-400 underline underline-offset-2"
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
