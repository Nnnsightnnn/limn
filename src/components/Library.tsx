// Saved-prompt strip along the bottom. Click to load, × to delete.
//
// "New session" lives in the header now — this footer is purely the library list.

import type { LimnState } from '../lib/useLimnState'

export function Library({ state }: { state: LimnState }) {
  const { library, loadItem, deleteItem } = state

  if (library.length === 0) {
    return (
      <div className="border-t border-ink-800 bg-ink-950/80">
        <div className="max-w-6xl mx-auto px-6 py-3 text-xs text-ink-500">
          📚 Library — save your first prompt and it'll appear here.
        </div>
      </div>
    )
  }

  return (
    <div className="border-t border-ink-800 bg-ink-950/80 sticky bottom-0 backdrop-blur">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-3 overflow-x-auto">
        <span className="text-xs text-ink-500 shrink-0">📚 Library</span>
        <div className="h-4 w-px bg-ink-800 shrink-0" />
        <div className="flex gap-2">
          {library.map((item) => (
            <div
              key={item.id}
              className="group inline-flex items-center gap-1 rounded-full bg-ink-900 border border-ink-800 hover:border-ember-500 transition-colors"
            >
              <button
                type="button"
                onClick={() => loadItem(item.id)}
                className="pl-3 pr-1 py-1 text-xs text-ink-200 hover:text-ember-400"
                title={new Date(item.createdAt).toLocaleString()}
              >
                {item.name}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Delete "${item.name}"?`)) deleteItem(item.id)
                }}
                className="pr-2 pl-1 py-1 text-xs text-ink-500 hover:text-red-400"
                aria-label={`Delete ${item.name}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
