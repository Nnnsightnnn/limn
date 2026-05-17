// Vertical-scroll wizard: all 6 slot cards visible. Each card binds to a slice of state.

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
import { AISuggestButton, ChipCloud, ChipRow } from './chip-primitives'
import { SlotCard } from './SlotCard'

export function WizardMode({ state }: { state: LimnState }) {
  const { slots, setSlots, toggleChip, params, setParams, settings } = state

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

  return (
    <div className="space-y-4">
      {/* 01 — Subject */}
      <SlotCard step={1} title="Subject" hint="what the image is about">
        <div className="flex flex-wrap gap-1.5 mb-2">
          {SUBJECT_SUBTYPES.map((st) => (
            <button
              key={st.value}
              type="button"
              onClick={() =>
                setSlots((prev) => ({
                  ...prev,
                  subjectSubType: prev.subjectSubType === st.value ? null : st.value,
                }))
              }
              className={
                'text-xs px-3 py-1 rounded-full border transition-colors ' +
                (slots.subjectSubType === st.value
                  ? 'bg-ink-700 border-ink-600 text-ink-100'
                  : 'bg-ink-900 border-ink-800 text-ink-300 hover:border-ink-600')
              }
            >
              {st.label}
            </button>
          ))}
        </div>
        <textarea
          value={slots.subject}
          onChange={(e) => setSlots((p) => ({ ...p, subject: e.target.value }))}
          placeholder="e.g. A medieval knight standing in a misty forest at dawn"
          rows={2}
          className="w-full bg-ink-950 border border-ink-800 rounded-md px-3 py-2 text-sm text-ink-100 placeholder:text-ink-500 focus:outline-none focus:border-ember-500"
        />
        {slots.subjectSubType && (
          <div className="space-y-1">
            <div className="text-[10px] uppercase tracking-wider text-ink-400">
              Example starters — click to use
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SUBJECT_SUBTYPES.find((s) => s.value === slots.subjectSubType)?.examples.map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => setSlots((p) => ({ ...p, subject: ex }))}
                  className="text-xs px-3 py-1 rounded-full bg-ink-800/60 border border-ink-700 text-ink-300 hover:border-ember-500 hover:text-ember-400 transition-colors"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        )}
        <AISuggestButton
          onRequest={aiSuggest('Subject ideas', 'Concrete subject ideas given any current context')}
          onPick={(v) => setSlots((p) => ({ ...p, subject: v }))}
        />
      </SlotCard>

      {/* 02 — Medium & Style */}
      <SlotCard step={2} title="Medium & Style" hint="how it's rendered + artistic lineage">
        <div>
          <div className="text-xs uppercase tracking-wider text-ink-400 mb-2">Medium</div>
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
        </div>
        <div className="pt-2 border-t border-ink-800">
          <div className="text-xs uppercase tracking-wider text-ink-400 mb-2">Art movement</div>
          <ChipCloud
            groups={ART_MOVEMENTS.groups.map((g) => ({
              name: g.name,
              chips: g.chips.map(asLabel),
            }))}
            selected={slots.medium}
            onToggle={(v) => toggleChip('medium', v)}
          />
        </div>
        <div className="pt-2 border-t border-ink-800">
          <div className="text-xs uppercase tracking-wider text-ink-400 mb-2">
            Artists / directors / cinematographers
          </div>
          <input
            type="text"
            value={slots.artists}
            onChange={(e) => setSlots((p) => ({ ...p, artists: e.target.value }))}
            placeholder="e.g. Roger Deakins, Wes Anderson"
            className="w-full bg-ink-950 border border-ink-800 rounded-md px-3 py-2 text-sm text-ink-100 placeholder:text-ink-500 focus:outline-none focus:border-ember-500"
          />
          <div className="mt-2">
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
        </div>
      </SlotCard>

      {/* 03 — Scene */}
      <SlotCard step={3} title="Scene" hint="environment + light + time">
        <div>
          <div className="text-xs uppercase tracking-wider text-ink-400 mb-2">Environment</div>
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
        </div>
        <div className="pt-2 border-t border-ink-800">
          <div className="text-xs uppercase tracking-wider text-ink-400 mb-2">Lighting</div>
          <ChipCloud
            groups={LIGHTING.groups.map((g) => ({
              name: g.name,
              chips: g.chips.map(asLabel),
            }))}
            selected={slots.lighting}
            onToggle={(v) => toggleChip('lighting', v)}
          />
        </div>
        <div className="pt-2 border-t border-ink-800">
          <div className="text-xs uppercase tracking-wider text-ink-400 mb-2">Time of day</div>
          <ChipRow
            chips={TIME_OF_DAY.groups[0].chips.map(asLabel)}
            selected={slots.timeOfDay}
            onToggle={(v) => toggleChip('timeOfDay', v)}
          />
        </div>
      </SlotCard>

      {/* 04 — Mood & Color */}
      <SlotCard step={4} title="Mood & Color" hint="emotional + palette tone">
        <div>
          <div className="text-xs uppercase tracking-wider text-ink-400 mb-2">Mood</div>
          <ChipCloud
            groups={MOOD.groups.map((g) => ({ name: g.name, chips: g.chips.map(asLabel) }))}
            selected={slots.mood}
            onToggle={(v) => toggleChip('mood', v)}
          />
          <AISuggestButton
            onRequest={aiSuggest('Mood', MOOD.description)}
            onPick={(v) => toggleChip('mood', v)}
          />
        </div>
        <div className="pt-2 border-t border-ink-800">
          <div className="text-xs uppercase tracking-wider text-ink-400 mb-2">Color</div>
          <ChipCloud
            groups={COLOR.groups.map((g) => ({ name: g.name, chips: g.chips.map(asLabel) }))}
            selected={slots.color}
            onToggle={(v) => toggleChip('color', v)}
          />
        </div>
      </SlotCard>

      {/* 05 — Camera */}
      <SlotCard step={5} title="Camera" hint="composition + shot + angle + lens">
        <div>
          <div className="text-xs uppercase tracking-wider text-ink-400 mb-2">Composition</div>
          <ChipCloud
            groups={COMPOSITION.groups.map((g) => ({
              name: g.name,
              chips: g.chips.map(asLabel),
            }))}
            selected={slots.composition}
            onToggle={(v) => toggleChip('composition', v)}
          />
        </div>
        <div className="pt-2 border-t border-ink-800">
          <div className="text-xs uppercase tracking-wider text-ink-400 mb-2">Shot type</div>
          <ChipRow
            chips={SHOT_TYPES.groups[0].chips.map(asLabel)}
            selected={slots.shotType}
            onToggle={(v) => toggleChip('shotType', v)}
          />
        </div>
        <div className="pt-2 border-t border-ink-800">
          <div className="text-xs uppercase tracking-wider text-ink-400 mb-2">Camera angle</div>
          <ChipRow
            chips={CAMERA_ANGLES.groups[0].chips.map(asLabel)}
            selected={slots.cameraAngle}
            onToggle={(v) => toggleChip('cameraAngle', v)}
          />
        </div>
        <div className="pt-2 border-t border-ink-800">
          <div className="text-xs uppercase tracking-wider text-ink-400 mb-2">Camera & lens</div>
          <ChipCloud
            groups={CAMERA_LENS.groups.map((g) => ({
              name: g.name,
              chips: g.chips.map(asLabel),
            }))}
            selected={slots.cameraLens}
            onToggle={(v) => toggleChip('cameraLens', v)}
          />
        </div>
      </SlotCard>

      {/* 06 — Parameters */}
      <SlotCard step={6} title="MidJourney parameters" hint="output flags">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Aspect ratio</Label>
            <div className="flex flex-wrap gap-1.5">
              {ASPECT_RATIOS.map((ar) => (
                <button
                  key={ar}
                  type="button"
                  onClick={() => setParams((p) => ({ ...p, aspectRatio: ar }))}
                  className={
                    'text-xs px-2.5 py-1 rounded-md border transition-colors ' +
                    (params.aspectRatio === ar
                      ? 'bg-ember-500 border-ember-500 text-ink-950 font-medium'
                      : 'bg-ink-900 border-ink-800 text-ink-300 hover:border-ember-500')
                  }
                >
                  {ar}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label>Model version</Label>
            <div className="flex flex-wrap gap-1.5">
              {MJ_VERSIONS.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setParams((p) => ({ ...p, version: v }))}
                  className={
                    'text-xs px-2.5 py-1 rounded-md border transition-colors ' +
                    (params.version === v
                      ? 'bg-ember-500 border-ember-500 text-ink-950 font-medium'
                      : 'bg-ink-900 border-ink-800 text-ink-300 hover:border-ember-500')
                  }
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="sm:col-span-2 flex flex-wrap gap-4">
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
            <Label>Seed</Label>
            <input
              type="text"
              value={params.seed}
              onChange={(e) => setParams((p) => ({ ...p, seed: e.target.value }))}
              placeholder="empty = random"
              className="w-full bg-ink-950 border border-ink-800 rounded-md px-3 py-1.5 text-xs text-ink-100 placeholder:text-ink-500 focus:outline-none focus:border-ember-500"
            />
          </div>
          <div>
            <Label>Negative prompt (--no)</Label>
            <input
              type="text"
              value={params.negative}
              onChange={(e) => setParams((p) => ({ ...p, negative: e.target.value }))}
              placeholder="e.g. blur, text, signature"
              className="w-full bg-ink-950 border border-ink-800 rounded-md px-3 py-1.5 text-xs text-ink-100 placeholder:text-ink-500 focus:outline-none focus:border-ember-500"
            />
          </div>
        </div>
      </SlotCard>
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-[10px] uppercase tracking-wider text-ink-400 mb-1.5">{children}</div>
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
    <label className="inline-flex items-center gap-2 text-xs text-ink-200 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="accent-ember-500"
      />
      <span className="font-mono">{label}</span>
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
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-[10px] uppercase tracking-wider text-ink-400">{label}</span>
        <span className="text-xs font-mono text-ink-200">{off ? 'off' : value}</span>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={off ? min : value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="flex-1 accent-ember-500"
        />
        <button
          type="button"
          onClick={() => onChange(off ? min : -1)}
          className="text-[10px] px-2 py-0.5 rounded border border-ink-700 text-ink-300 hover:border-ember-500 hover:text-ember-400"
        >
          {off ? 'set' : 'clear'}
        </button>
      </div>
    </div>
  )
}

function asLabel(c: string | { label: string; value?: string }): string {
  return typeof c === 'string' ? c : c.label
}
