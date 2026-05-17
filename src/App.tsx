import { useState } from 'react'
import { FreeformMode } from './components/FreeformMode'
import { Header } from './components/Header'
import { Library } from './components/Library'
import { OutputPanel } from './components/OutputPanel'
import { SettingsDrawer } from './components/SettingsDrawer'
import { WizardMode } from './components/WizardMode'
import { useLimnState } from './lib/useLimnState'

export default function App() {
  const state = useLimnState()
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-ink-950 text-ink-100">
      <Header
        mode={state.mode}
        setMode={state.setMode}
        onOpenSettings={() => setSettingsOpen(true)}
        hasKey={Boolean(state.settings.openrouterKey)}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        <section className="min-w-0">
          {state.mode === 'wizard' ? (
            <WizardMode state={state} />
          ) : (
            <FreeformMode state={state} />
          )}
        </section>
        <OutputPanel state={state} />
      </main>

      <Library state={state} />

      <SettingsDrawer
        state={state}
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  )
}
