import { useState } from 'react'

type Mode = 'wizard' | 'freeform'

export default function App() {
  const [mode, setMode] = useState<Mode>('wizard')

  return (
    <div className="min-h-screen flex flex-col bg-ink-950 text-ink-100">
      <Header mode={mode} setMode={setMode} />
      <main className="flex-1 grid place-items-center px-6 py-16">
        <div className="max-w-xl text-center space-y-4">
          <h1 className="text-5xl font-semibold tracking-tight">
            <span className="text-ember-500">Limn</span>
          </h1>
          <p className="text-ink-300 leading-relaxed">
            Scaffold is live. The full {mode === 'wizard' ? 'wizard' : 'free-form'} mode —
            chip libraries, OpenRouter AI assist, multi-model output, prompt library — lands next.
          </p>
          <p className="text-ink-400 text-sm">
            See <code className="bg-ink-800 px-1.5 py-0.5 rounded text-ink-200">README.md</code> for
            the roadmap.
          </p>
        </div>
      </main>
    </div>
  )
}

function Header({ mode, setMode }: { mode: Mode; setMode: (m: Mode) => void }) {
  return (
    <header className="border-b border-ink-800 bg-ink-900/60 backdrop-blur sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <span className="text-ember-500">◐</span>
          <span>Limn</span>
        </div>
        <nav className="flex gap-1 bg-ink-800/60 p-1 rounded-full text-sm">
          <ModeButton active={mode === 'wizard'} onClick={() => setMode('wizard')}>
            Wizard
          </ModeButton>
          <ModeButton active={mode === 'freeform'} onClick={() => setMode('freeform')}>
            Free-form
          </ModeButton>
        </nav>
        <button
          type="button"
          className="text-ink-400 hover:text-ink-100 transition-colors"
          aria-label="Settings"
        >
          ⚙
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
