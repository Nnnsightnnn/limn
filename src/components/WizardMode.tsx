// The Wizard — "A Style Workshop in Six Movements". One movement visible at a
// time, with a magazine-style TOC stepper, keyboard nav (← / →), and slide
// transitions between movements.

import { useEffect, useState } from 'react'
import {
  ARTISTS_AND_DIRECTORS,
  ART_MOVEMENTS,
  ASPECT_RATIOS,
  CAMERA_ANGLES,
  CAMERA_LENS,
  COLOR,
  COMPOSITION,
  ENVIRONMENTS,
  LIGHTING,
  MEDIUMS,
  MJ_VERSIONS,
  MOOD,
  SHOT_TYPES,
  SUBJECT_SUBTYPES,
  TIME_OF_DAY,
} from '../data/vocabulary'
import { suggestForSlot } from '../lib/openrouter'
import type { LimnState } from '../lib/useLimnState'
import { AISuggestButton, Chip, ChipCloud, ChipRow } from './chip-primitives'
import { PopularPrompts } from './PopularPrompts'
import { SlotCard } from './SlotCard'

interface StepDef {
  num: number
  title: string
  hint: string
}

const STEPS: StepDef[] = [
  { num: 1, title: 'Subject', hint: 'what the image is about' },
  { num: 2, title: 'Medium & Style', hint: "how it's rendered + artistic lineage" },
  { num: 3, title: 'Scene', hint: 'environment + light + time' },
  { num: 4, title: 'Mood & Colour', hint: 'emotional + palette tone' },
  { num: 5, title: 'Camera', hint: 'composition + shot + angle + lens' },
  { num: 6, title: 'Parameters', hint: 'output flags' },
]

const ROMAN_PREFIX = ['I.', 'II.', 'III.', 'IV.', 'V.', 'VI.']

export function WizardMode({ state }: { state: LimnState }) {
  const { slots, setSlots, toggleChip, params, setParams, settings, setFreeform, setMode } = state

  const [active, setActive] = useState(0)
  const [dir, setDir] = useState<1 | -1>(1)

  const isWizardEmpty =
    !slots.subject.trim() &&
    !slots.subjectSubType &&
    !slots.artists.trim() &&
    slots.medium.length === 0 &&
    slots.environment.length === 0 &&
    slots.lighting.length === 0 &&
    slots.timeOfDay.length === 0 &&
    slots.mood.length === 0 &&
    slots.color.length === 0 &&
    slots.composition.length === 0 &&
    slots.shotType.length === 0 &&
    slots.cameraAngle.length === 0 &&
    slots.cameraLens.length === 0

  function go(next: number) {
    const clamped = Math.max(0, Math.min(STEPS.length - 1, next))
    if (clamped === active) return
    setDir(clamped > active ? 1 : -1)
    setActive(clamped)
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        go(active + 1)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        go(active - 1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active])

  function aiSuggest(slotName: string, slotDescription: string) {
    return () =>
      suggestForSlot({
        apiKey: settings.openrouterKey,
        model: settings.openrouterModel,
        slotName,
        slotDescription,
        currentSlots: slots,
      })
  }

  const counts = stepCounts(state)
  const current = STEPS[active]

  return (
    <div className="space-y-8">
      {/* Workshop header */}
      <header
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          alignItems: 'end',
          borderBottom: '2px solid var(--color-rule)',
          paddingBottom: 14,
          gap: 24,
        }}
      >
        <div>
          <div className="kicker">
            The Wizard &nbsp;·&nbsp; A Style Workshop in Six Movements
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(36px, 5vw, 56px)',
              fontWeight: 500,
              lineHeight: 1,
              letterSpacing: '-0.02em',
              margin: '8px 0 0',
              color: 'var(--color-ink)',
            }}
          >
            Composing
            <span
              style={{
                fontStyle: 'italic',
                fontWeight: 400,
                color: 'var(--color-accent)',
                fontSize: '0.7em',
                padding: '0 0.1em',
              }}
            >
              &amp;
            </span>
            Depicting
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: 18,
              color: 'var(--color-ink-soft)',
              margin: '6px 0 0',
            }}
          >
            Six steps from a vague notion to a prompt that prints.
          </p>
        </div>
        <div
          style={{
            textAlign: 'right',
            fontFamily: 'var(--font-sans)',
            fontSize: 10.5,
            letterSpacing: '0.20em',
            textTransform: 'uppercase',
            color: 'var(--color-ink-mute)',
          }}
        >
          Movement <span className="num" style={{ color: 'var(--color-accent)', fontWeight: 600 }}>
            {ROMAN_PREFIX[active]?.replace('.', '')}
          </span>{' '}
          of <span className="num">VI</span>
          <br />
          <span className="num">·</span> use <kbd style={kbdStyle}>←</kbd>{' '}
          <kbd style={kbdStyle}>→</kbd> <span className="num">·</span>
        </div>
      </header>

      <Stepper active={active} counts={counts} onPick={go} />

      <div key={active} className={dir > 0 ? 'limn-slide-in-r' : 'limn-slide-in-l'}>
        <SlotCard step={current.num} title={current.title} hint={current.hint}>
          {active === 0 && (
            <>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {SUBJECT_SUBTYPES.map((st, i) => (
                  <Chip
                    key={st.value}
                    label={st.label}
                    active={slots.subjectSubType === st.value}
                    onClick={() =>
                      setSlots((prev) => ({
                        ...prev,
                        subjectSubType: prev.subjectSubType === st.value ? null : st.value,
                      }))
                    }
                    tight={i % 3 === 1}
                  />
                ))}
              </div>
              <textarea
                value={slots.subject}
                onChange={(e) => setSlots((p) => ({ ...p, subject: e.target.value }))}
                placeholder="e.g. A medieval knight standing in a misty forest at dawn"
                rows={2}
                className="field-textarea"
              />
              {slots.subjectSubType && (
                <div>
                  <div className="group-label">Example starters — click to use</div>
                  <div className="flex flex-wrap gap-1.5">
                    {SUBJECT_SUBTYPES.find((s) => s.value === slots.subjectSubType)?.examples.map(
                      (ex) => (
                        <button
                          key={ex}
                          type="button"
                          onClick={() => setSlots((p) => ({ ...p, subject: ex }))}
                          className="chip-ai"
                        >
                          {ex}
                        </button>
                      ),
                    )}
                  </div>
                </div>
              )}
              <AISuggestButton
                onRequest={aiSuggest('Subject ideas', 'Concrete subject ideas given any current context')}
                onPick={(v) => setSlots((p) => ({ ...p, subject: v }))}
              />
            </>
          )}

          {active === 1 && (
            <>
              <Shelf title="Medium" cabinet="I" count={`${slots.medium.length} chosen`}>
                <ChipCloud
                  groups={MEDIUMS.groups.map((g) => ({
                    name: g.name,
                    chips: g.chips.map(asLabel),
                  }))}
                  selected={slots.medium}
                  onToggle={(v) => toggleChip('medium', v)}
                />
                <AISuggestButton
                  onRequest={aiSuggest('Medium', MEDIUMS.description)}
                  onPick={(v) => toggleChip('medium', v)}
                />
              </Shelf>

              <Shelf title="Movement & School" cabinet="II">
                <ChipCloud
                  groups={ART_MOVEMENTS.groups.map((g) => ({
                    name: g.name,
                    chips: g.chips.map(asLabel),
                  }))}
                  selected={slots.medium}
                  onToggle={(v) => toggleChip('medium', v)}
                />
              </Shelf>

              <Shelf title="Artists & Directors" cabinet="III" count="free hand">
                <input
                  type="text"
                  value={slots.artists}
                  onChange={(e) => setSlots((p) => ({ ...p, artists: e.target.value }))}
                  placeholder="e.g. Roger Deakins, Wes Anderson, Hayao Miyazaki"
                  className="field-input"
                />
                <div style={{ marginTop: 18 }}>
                  <ChipCloud
                    groups={ARTISTS_AND_DIRECTORS.groups.map((g) => ({
                      name: g.name,
                      chips: g.chips.map(asLabel),
                    }))}
                    selected={[]}
                    onToggle={(v) =>
                      setSlots((p) => ({
                        ...p,
                        artists: p.artists ? `${p.artists}, ${v}` : v,
                      }))
                    }
                  />
                </div>
              </Shelf>
            </>
          )}

          {active === 2 && (
            <>
              <Shelf title="Environment" cabinet="I">
                <ChipCloud
                  groups={ENVIRONMENTS.groups.map((g) => ({
                    name: g.name,
                    chips: g.chips.map(asLabel),
                  }))}
                  selected={slots.environment}
                  onToggle={(v) => toggleChip('environment', v)}
                />
                <AISuggestButton
                  onRequest={aiSuggest('Environment', ENVIRONMENTS.description)}
                  onPick={(v) => toggleChip('environment', v)}
                />
              </Shelf>
              <Shelf title="Lighting" cabinet="II">
                <ChipCloud
                  groups={LIGHTING.groups.map((g) => ({
                    name: g.name,
                    chips: g.chips.map(asLabel),
                  }))}
                  selected={slots.lighting}
                  onToggle={(v) => toggleChip('lighting', v)}
                />
              </Shelf>
              <Shelf title="Time of day" cabinet="III">
                <ChipRow
                  chips={TIME_OF_DAY.groups[0].chips.map(asLabel)}
                  selected={slots.timeOfDay}
                  onToggle={(v) => toggleChip('timeOfDay', v)}
                />
              </Shelf>
            </>
          )}

          {active === 3 && (
            <>
              <Shelf title="Mood" cabinet="I">
                <ChipCloud
                  groups={MOOD.groups.map((g) => ({ name: g.name, chips: g.chips.map(asLabel) }))}
                  selected={slots.mood}
                  onToggle={(v) => toggleChip('mood', v)}
                />
                <AISuggestButton
                  onRequest={aiSuggest('Mood', MOOD.description)}
                  onPick={(v) => toggleChip('mood', v)}
                />
              </Shelf>
              <Shelf title="Colour" cabinet="II">
                <ChipCloud
                  groups={COLOR.groups.map((g) => ({ name: g.name, chips: g.chips.map(asLabel) }))}
                  selected={slots.color}
                  onToggle={(v) => toggleChip('color', v)}
                />
              </Shelf>
            </>
          )}

          {active === 4 && (
            <>
              <Shelf title="Composition" cabinet="I">
                <ChipCloud
                  groups={COMPOSITION.groups.map((g) => ({
                    name: g.name,
                    chips: g.chips.map(asLabel),
                  }))}
                  selected={slots.composition}
                  onToggle={(v) => toggleChip('composition', v)}
                />
              </Shelf>
              <Shelf title="Shot type" cabinet="II">
                <ChipRow
                  chips={SHOT_TYPES.groups[0].chips.map(asLabel)}
                  selected={slots.shotType}
                  onToggle={(v) => toggleChip('shotType', v)}
                />
              </Shelf>
              <Shelf title="Camera angle" cabinet="III">
                <ChipRow
                  chips={CAMERA_ANGLES.groups[0].chips.map(asLabel)}
                  selected={slots.cameraAngle}
                  onToggle={(v) => toggleChip('cameraAngle', v)}
                />
              </Shelf>
              <Shelf title="Camera & lens" cabinet="IV">
                <ChipCloud
                  groups={CAMERA_LENS.groups.map((g) => ({
                    name: g.name,
                    chips: g.chips.map(asLabel),
                  }))}
                  selected={slots.cameraLens}
                  onToggle={(v) => toggleChip('cameraLens', v)}
                />
              </Shelf>
            </>
          )}

          {active === 5 && (
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-5">
              <div>
                <div className="group-label">Aspect ratio</div>
                <div className="flex flex-wrap gap-1.5">
                  {ASPECT_RATIOS.map((ar, i) => (
                    <Chip
                      key={ar}
                      label={ar}
                      active={params.aspectRatio === ar}
                      onClick={() => setParams((p) => ({ ...p, aspectRatio: ar }))}
                      tight={i % 3 === 1}
                    />
                  ))}
                </div>
              </div>

              <div>
                <div className="group-label">Model version</div>
                <div className="flex flex-wrap gap-1.5">
                  {MJ_VERSIONS.map((v, i) => (
                    <Chip
                      key={v}
                      label={v}
                      active={params.version === v}
                      onClick={() => setParams((p) => ({ ...p, version: v }))}
                      tight={i % 3 === 1}
                    />
                  ))}
                </div>
              </div>

              <div className="sm:col-span-2 flex flex-wrap gap-6">
                <Toggle
                  label="--style raw"
                  checked={params.styleRaw}
                  onChange={(v) => setParams((p) => ({ ...p, styleRaw: v }))}
                />
                <Toggle
                  label="--tile"
                  checked={params.tile}
                  onChange={(v) => setParams((p) => ({ ...p, tile: v }))}
                />
              </div>

              <Slider
                label="Chaos"
                value={params.chaos}
                min={0}
                max={100}
                onChange={(v) => setParams((p) => ({ ...p, chaos: v }))}
              />
              <Slider
                label="Stylize"
                value={params.stylize}
                min={0}
                max={1000}
                step={25}
                onChange={(v) => setParams((p) => ({ ...p, stylize: v }))}
              />
              <Slider
                label="Quality"
                value={params.quality}
                min={0}
                max={2}
                step={0.25}
                onChange={(v) => setParams((p) => ({ ...p, quality: v }))}
              />
              <Slider
                label="Weird"
                value={params.weird}
                min={0}
                max={3000}
                step={50}
                onChange={(v) => setParams((p) => ({ ...p, weird: v }))}
              />

              <div>
                <div className="group-label">Seed</div>
                <input
                  type="text"
                  value={params.seed}
                  onChange={(e) => setParams((p) => ({ ...p, seed: e.target.value }))}
                  placeholder="empty = random"
                  className="field-input"
                />
              </div>
              <div>
                <div className="group-label">Negative prompt (--no)</div>
                <input
                  type="text"
                  value={params.negative}
                  onChange={(e) => setParams((p) => ({ ...p, negative: e.target.value }))}
                  placeholder="e.g. blur, text, signature"
                  className="field-input"
                />
              </div>
            </div>
          )}
        </SlotCard>
      </div>

      <Nav
        active={active}
        total={STEPS.length}
        onPrev={() => go(active - 1)}
        onNext={() => go(active + 1)}
      />

      {isWizardEmpty && (
        <PopularPrompts
          heading="Or begin from a popular prompt"
          subheading="Click any plate to load it into Free Studio — you can refine it there, or use Parse to wizard to fill these movements."
          onPick={(p) => {
            setFreeform(p.prompt)
            setMode('freeform')
          }}
        />
      )}
    </div>
  )
}

const kbdStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 9.5,
  background: 'var(--color-paper)',
  color: 'var(--color-ink)',
  padding: '2px 5px',
  border: '1px solid var(--color-rule)',
  letterSpacing: 0,
  textTransform: 'none',
}

function Shelf({
  title,
  cabinet,
  count,
  children,
}: {
  title: string
  cabinet: string
  count?: string
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        borderTop: '1px solid var(--color-rule)',
        paddingTop: 18,
        marginTop: 32,
      }}
    >
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: 14,
        }}
      >
        <h3
          style={{
            margin: 0,
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontWeight: 500,
            fontSize: 28,
            letterSpacing: '-0.01em',
            color: 'var(--color-ink)',
          }}
        >
          {title}
        </h3>
        <div
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 10.5,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--color-ink-mute)',
          }}
        >
          Cabinet {cabinet}
          {count && (
            <>
              {' '}
              &nbsp;·&nbsp;{' '}
              <span style={{ color: 'var(--color-accent)', fontWeight: 600 }}>{count}</span>
            </>
          )}
        </div>
      </header>
      {children}
    </div>
  )
}

function Stepper({
  active,
  counts,
  onPick,
}: {
  active: number
  counts: number[]
  onPick: (i: number) => void
}) {
  return (
    <nav className="toc" aria-label="Movements">
      {STEPS.map((s, i) => {
        const isActive = i === active
        const filled = counts[i] > 0
        const cls = ['toc-step', isActive && 'is-active', !isActive && filled && 'is-done']
          .filter(Boolean)
          .join(' ')
        return (
          <button key={s.num} type="button" className={cls} onClick={() => onPick(i)}>
            <div className="row">
              <span className="roman">{ROMAN_PREFIX[i]}</span> Movement
              {filled && !isActive && (
                <span className="pill">·{counts[i]}</span>
              )}
              {isActive && (
                <span className="now-editing">
                  now editing
                  <span className="caret" />
                </span>
              )}
            </div>
            <div className="title">{s.title}</div>
          </button>
        )
      })}
    </nav>
  )
}

function Nav({
  active,
  total,
  onPrev,
  onNext,
}: {
  active: number
  total: number
  onPrev: () => void
  onNext: () => void
}) {
  const isFirst = active === 0
  const isLast = active === total - 1
  return (
    <div
      style={{
        marginTop: 24,
        paddingTop: 16,
        borderTop: '1px solid var(--color-rule)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <button type="button" onClick={onPrev} disabled={isFirst} className="btn">
        ← {isFirst ? 'Beginning' : `Back to ${STEPS[active - 1].title}`}
      </button>
      <span
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 10.5,
          letterSpacing: '0.20em',
          textTransform: 'uppercase',
          color: 'var(--color-ink-mute)',
        }}
      >
        Movement{' '}
        <span className="num" style={{ color: 'var(--color-accent)' }}>
          {ROMAN_PREFIX[active]?.replace('.', '')}
        </span>{' '}
        / <span className="num">{ROMAN_PREFIX[total - 1]?.replace('.', '')}</span>
      </span>
      {isLast ? (
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 10.5,
            letterSpacing: '0.20em',
            textTransform: 'uppercase',
            color: 'var(--color-accent)',
          }}
        >
          all set — see the manuscript →
        </span>
      ) : (
        <button type="button" onClick={onNext} className="btn primary">
          Onward to {STEPS[active + 1].title} →
        </button>
      )}
    </div>
  )
}

function stepCounts(state: LimnState): number[] {
  const { slots, params } = state
  const subjectCount = (slots.subject.trim() ? 1 : 0) + (slots.subjectSubType ? 1 : 0)
  const mediumCount = slots.medium.length + (slots.artists.trim() ? 1 : 0)
  const sceneCount = slots.environment.length + slots.lighting.length + slots.timeOfDay.length
  const moodCount = slots.mood.length + slots.color.length
  const cameraCount =
    slots.composition.length +
    slots.shotType.length +
    slots.cameraAngle.length +
    slots.cameraLens.length
  let paramsCount = 0
  if (params.aspectRatio) paramsCount++
  if (params.version) paramsCount++
  if (params.styleRaw) paramsCount++
  if (params.tile) paramsCount++
  if (params.chaos >= 0) paramsCount++
  if (params.stylize >= 0) paramsCount++
  if (params.quality >= 0) paramsCount++
  if (params.weird >= 0) paramsCount++
  if (params.seed) paramsCount++
  if (params.negative) paramsCount++
  return [subjectCount, mediumCount, sceneCount, moodCount, cameraCount, paramsCount]
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        cursor: 'pointer',
        userSelect: 'none',
        fontFamily: 'var(--font-mono)',
        fontSize: 13,
        color: 'var(--color-ink)',
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ accentColor: 'var(--color-accent)' }}
      />
      <span>{label}</span>
    </label>
  )
}

function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (v: number) => void
}) {
  const off = value < 0
  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: 4,
        }}
      >
        <span className="group-label" style={{ margin: 0 }}>
          {label}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            color: off ? 'var(--color-ink-mute)' : 'var(--color-ink)',
          }}
        >
          {off ? 'off' : value}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={off ? min : value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          style={{ flex: 1, accentColor: 'var(--color-accent)' }}
        />
        <button type="button" onClick={() => onChange(off ? min : -1)} className="btn">
          {off ? 'set' : 'clear'}
        </button>
      </div>
    </div>
  )
}

function asLabel(c: string | { label: string; value?: string }): string {
  return typeof c === 'string' ? c : c.label
}
