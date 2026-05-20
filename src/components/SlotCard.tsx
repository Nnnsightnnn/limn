// A magazine "Shelf" — one movement of the wizard, framed by an editorial
// header (kicker · roman numeral · display title · italic deck).

import type { ReactNode } from 'react'

const ROMAN: Record<number, string> = {
  1: 'I.',
  2: 'II.',
  3: 'III.',
  4: 'IV.',
  5: 'V.',
  6: 'VI.',
  7: 'VII.',
  8: 'VIII.',
}

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
    <section
      style={{
        borderTop: '2px solid var(--color-rule)',
        paddingTop: 18,
      }}
    >
      <header
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 16,
          marginBottom: 18,
          flexWrap: 'wrap',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontWeight: 500,
            fontSize: 28,
            color: 'var(--color-accent)',
            letterSpacing: 0,
          }}
        >
          {ROMAN[step] ?? `${step}.`}
        </span>
        <h2
          style={{
            margin: 0,
            fontFamily: 'var(--font-display)',
            fontWeight: 500,
            fontSize: 40,
            letterSpacing: '-0.02em',
            lineHeight: 1,
            color: 'var(--color-ink)',
          }}
        >
          {title}
        </h2>
        {hint && (
          <span
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: 17,
              color: 'var(--color-ink-soft)',
              flex: 1,
            }}
          >
            — {hint}
          </span>
        )}
      </header>
      <div className="space-y-6">{children}</div>
    </section>
  )
}
