import type { Mode } from '../lib/types'

export function Header({
  mode,
  setMode,
  onOpenSettings,
  hasKey,
}: {
  mode: Mode
  setMode: (m: Mode) => void
  onOpenSettings: () => void
  hasKey: boolean
}) {
  return (
    <header className="border-b border-ink-800 bg-ink-900/60 backdrop-blur sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
        <a
          href="/limn/"
          className="flex items-center gap-2 text-lg font-semibold text-ink-100 hover:text-ember-400 transition-colors"
        >
          <span className="text-ember-500">◐</span>
          <span>Limn</span>
        </a>

        <nav className="flex gap-1 bg-ink-800/60 p-1 rounded-full text-sm" role="tablist">
          <ModeButton active={mode === 'wizard'} onClick={() => setMode('wizard')}>
            Wizard
          </ModeButton>
          <ModeButton active={mode === 'freeform'} onClick={() => setMode('freeform')}>
            Free-form
          </ModeButton>
        </nav>

        <button
          type="button"
          onClick={onOpenSettings}
          className="text-sm text-ink-400 hover:text-ink-100 transition-colors flex items-center gap-1.5"
          aria-label="Open settings"
        >
          <span>⚙</span>
          {!hasKey && (
            <span className="text-xs text-ember-400 hidden sm:inline">add API key</span>
          )}
        </button>
      </div>
    </header>
  )
}

function ModeButton({
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
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={
        'px-4 py-1.5 rounded-full transition-colors ' +
        (active
          ? 'bg-ember-500 text-ink-950 font-medium'
          : 'text-ink-300 hover:text-ink-100')
      }
    >
      {children}
    </button>
  )
}
