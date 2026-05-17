// Sticky right rail showing assembled prompts + actions.

import { useState } from 'react'
import { assembleMidjourney, assembleNaturalLanguage } from '../lib/assemble'
import type { LimnState } from '../lib/useLimnState'

type Tab = 'nl' | 'mj'

export function OutputPanel({ state }: { state: LimnState }) {
  const { slots, params, freeform, mode, saveCurrent } = state
  const [tab, setTab] = useState<Tab>('mj')
  const [name, setName] = useState('')
  const [copyStatus, setCopyStatus] = useState<'nl' | 'mj' | null>(null)
  const [savedFlash, setSavedFlash] = useState(false)

  // Source the output from whichever mode the user is in.
  const sourceNL =
    mode === 'freeform' && freeform.trim() ? freeform.trim() : assembleNaturalLanguage(slots)
  const sourceMJ =
    mode === 'freeform' && freeform.trim()
      ? [freeform.trim(), buildMJFlagsOnly(state)].filter(Boolean).join(' ')
      : assembleMidjourney(slots, params)

  function copy(value: string, which: Tab) {
    if (!value) return
    navigator.clipboard.writeText(value).then(() => {
      setCopyStatus(which)
      setTimeout(() => setCopyStatus(null), 1200)
    })
  }

  function doSave() {
    const item = saveCurrent(name)
    setName('')
    setSavedFlash(true)
    setTimeout(() => setSavedFlash(false), 1200)
    // intentionally ignoring item; could navigate-to/highlight if desired
    void item
  }

  return (
    <aside className="lg:sticky lg:top-20 self-start space-y-3">
      <div className="rounded-xl border border-ink-800 bg-ink-900/60 overflow-hidden">
        <div className="flex border-b border-ink-800">
          <TabBtn active={tab === 'mj'} onClick={() => setTab('mj')} label="MidJourney" />
          <TabBtn active={tab === 'nl'} onClick={() => setTab('nl')} label="Natural language" />
        </div>
        <div className="p-4">
          <pre className="whitespace-pre-wrap break-words text-sm text-ink-100 font-mono leading-relaxed min-h-[120px]">
            {tab === 'mj' ? sourceMJ || '(empty — pick a subject to start)' : sourceNL || '(empty)'}
          </pre>
          <div className="flex gap-2 mt-3">
            <button
              type="button"
              onClick={() => copy(tab === 'mj' ? sourceMJ : sourceNL, tab)}
              disabled={tab === 'mj' ? !sourceMJ : !sourceNL}
              className="text-xs inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-ink-800 border border-ink-700 text-ink-200 hover:border-ember-500 hover:text-ember-400 disabled:opacity-40 transition-colors"
            >
              {copyStatus === tab ? '✓ Copied' : '📋 Copy'}
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-ink-800 bg-ink-900/60 p-4 space-y-2">
        <div className="text-xs uppercase tracking-wider text-ink-400">Save to library</div>
        <div className="flex gap-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name this prompt"
            className="flex-1 bg-ink-950 border border-ink-800 rounded-md px-3 py-1.5 text-sm text-ink-100 placeholder:text-ink-500 focus:outline-none focus:border-ember-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter') doSave()
            }}
          />
          <button
            type="button"
            onClick={doSave}
            className="text-xs inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-ember-500 text-ink-950 font-medium hover:bg-ember-400 transition-colors"
          >
            {savedFlash ? '✓ Saved' : '⭐ Save'}
          </button>
        </div>
      </div>
    </aside>
  )
}

function TabBtn({
  active,
  onClick,
  label,
}: {
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        'flex-1 px-4 py-2.5 text-xs font-medium transition-colors ' +
        (active
          ? 'text-ember-400 border-b-2 border-ember-500 bg-ink-900'
          : 'text-ink-400 hover:text-ink-200 border-b-2 border-transparent')
      }
    >
      {label}
    </button>
  )
}

/** Just the MJ flags suffix, no natural-language prefix — used when in free-form mode. */
function buildMJFlagsOnly(state: LimnState): string {
  // Re-use the assembler by emptying slots and only passing params.
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
