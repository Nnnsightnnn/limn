// The Folio — a standing collection of saved plates, displayed as a 4-up
// archive grid. Click a plate to load; small ✕ to remove.

import { assembleMidjourney } from '../lib/assemble'
import type { LibraryItem } from '../lib/types'
import type { LimnState } from '../lib/useLimnState'

const ROMAN = [
  'I',
  'II',
  'III',
  'IV',
  'V',
  'VI',
  'VII',
  'VIII',
  'IX',
  'X',
  'XI',
  'XII',
  'XIII',
  'XIV',
  'XV',
  'XVI',
  'XVII',
  'XVIII',
  'XIX',
  'XX',
]

function toRoman(n: number): string {
  return ROMAN[n - 1] ?? String(n)
}

function mjFor(item: LibraryItem): string {
  if (item.modeWhenSaved === 'freeform' && item.freeform.trim()) return item.freeform
  return assembleMidjourney(item.slots, item.params)
}

function categoryFor(item: LibraryItem): string {
  const t = mjFor(item).toLowerCase()
  if (/(portrait|face|person|man|woman|character)/.test(t)) return 'Portrait'
  if (/(landscape|mountain|forest|sea|ocean|sky)/.test(t)) return 'Landscape'
  if (/(macro|close-?up|dewdrop|insect)/.test(t)) return 'Macro'
  if (/(product|knolling|isometric)/.test(t)) return 'Product'
  if (/(anime|ghibli|cel-?shaded|moebius)/.test(t)) return 'Anime'
  if (/(dragon|fantasy|wizard|knight)/.test(t)) return 'Fantasy'
  if (/(cinematic|film|noir|wes anderson)/.test(t)) return 'Cinematic'
  return 'Plate'
}

function arFor(item: LibraryItem): string | null {
  if (item.params.aspectRatio) return item.params.aspectRatio
  const m = mjFor(item).match(/--ar\s+([0-9:.\s]+)/i)
  return m ? m[1].trim() : null
}

function vFor(item: LibraryItem): string | null {
  if (item.params.version) {
    const v = item.params.version
    return v.toLowerCase().startsWith('niji') ? v : `v${v}`
  }
  const v = mjFor(item).match(/--v\s+([0-9.]+)/i)
  if (v) return `v${v[1]}`
  const niji = mjFor(item).match(/--niji\s+([0-9.]+)/i)
  if (niji) return `niji ${niji[1]}`
  return null
}

export function Library({ state }: { state: LimnState }) {
  const { library, loadItem, deleteItem } = state

  return (
    <section id="folio" style={{ marginTop: 96 }} aria-label="The Folio">
      <header
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr auto',
          alignItems: 'end',
          gap: 24,
          paddingBottom: 14,
          borderBottom: '2px solid var(--color-rule)',
        }}
      >
        <h2
          style={{
            margin: 0,
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(36px, 5vw, 52px)',
            fontWeight: 500,
            letterSpacing: '-0.02em',
            lineHeight: 1,
            color: 'var(--color-ink)',
          }}
        >
          The{' '}
          <em style={{ fontStyle: 'italic', color: 'var(--color-accent)', fontWeight: 400 }}>
            Folio
          </em>
        </h2>
        <div
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            color: 'var(--color-ink-soft)',
            fontSize: 17,
            paddingBottom: 6,
          }}
        >
          A standing collection of every prompt you have saved this season.
        </div>
        <div
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 10.5,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--color-ink-mute)',
            paddingBottom: 6,
          }}
        >
          Collection ·{' '}
          <strong style={{ color: 'var(--color-accent)', fontWeight: 600 }}>
            {String(library.length).padStart(2, '0')}
          </strong>{' '}
          plates
        </div>
      </header>

      {library.length === 0 ? (
        <div
          style={{
            marginTop: 28,
            padding: '48px 24px',
            border: '1px dashed var(--color-rule)',
            textAlign: 'center',
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: 17,
            color: 'var(--color-ink-mute)',
          }}
        >
          No plates yet. Publish your first draft and it will be bound here, dated and numbered.
        </div>
      ) : (
        <div className="archive-grid" style={{ marginTop: 28 }}>
          {library.map((item, idx) => {
            const ar = arFor(item)
            const ver = vFor(item)
            const cat = categoryFor(item)
            return (
              <div key={item.id} style={{ position: 'relative' }}>
                <button type="button" className="archive-card" onClick={() => loadItem(item.id)}>
                  <div className="img">
                    <span className="plate-no">Plate {toRoman(idx + 1)}</span>
                  </div>
                  <div className="title">{item.name || 'Untitled'}</div>
                  <div className="by">
                    <span className="cat">{cat}</span>
                    {ar && (
                      <>
                        {' '}
                        · {ar}
                      </>
                    )}
                    {ver && (
                      <>
                        {' '}
                        · {ver}
                      </>
                    )}
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Remove "${item.name || 'Untitled'}" from the Folio?`)) {
                      deleteItem(item.id)
                    }
                  }}
                  aria-label={`Delete ${item.name || 'Untitled'}`}
                  style={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    width: 24,
                    height: 24,
                    background: 'var(--color-paper)',
                    border: '1px solid var(--color-rule)',
                    color: 'var(--color-ink-mute)',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-sans)',
                    fontSize: 13,
                    lineHeight: 1,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--color-accent)'
                    e.currentTarget.style.borderColor = 'var(--color-accent)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--color-ink-mute)'
                    e.currentTarget.style.borderColor = 'var(--color-rule)'
                  }}
                >
                  ×
                </button>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
