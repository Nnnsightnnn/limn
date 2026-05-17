// A card that wraps a single wizard step.

import type { ReactNode } from 'react'

export function SlotCard({
  step,
  title,
  hint,
  children,
}: {
  step: number
  title: string
  hint?: string
  children: ReactNode
}) {
  return (
    <section className="rounded-xl border border-ink-800 bg-ink-900/40 p-5 shadow-sm">
      <header className="flex items-baseline gap-3 mb-4">
        <span className="text-xs font-mono text-ember-500 tabular-nums">
          {String(step).padStart(2, '0')}
        </span>
        <h2 className="text-lg font-semibold text-ink-100">{title}</h2>
        {hint && <span className="text-xs text-ink-400">— {hint}</span>}
      </header>
      <div className="space-y-4">{children}</div>
    </section>
  )
}
