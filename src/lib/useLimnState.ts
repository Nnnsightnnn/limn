// Centralized app state + persistence.
//
// Kept in a single hook for v0.1 simplicity. If state grows, lift to Zustand or context.

import { useCallback, useEffect, useMemo, useState } from 'react'
import { loadJSON, saveJSON } from './storage'
import type {
  LibraryItem,
  MJParams,
  Mode,
  PromptSlots,
  Settings,
} from './types'

export const EMPTY_SLOTS: PromptSlots = {
  subject: '',
  subjectSubType: null,
  medium: [],
  environment: [],
  lighting: [],
  timeOfDay: [],
  mood: [],
  color: [],
  composition: [],
  shotType: [],
  cameraAngle: [],
  cameraLens: [],
  artists: '',
}

export const DEFAULT_PARAMS: MJParams = {
  aspectRatio: '16:9',
  version: '6.1',
  styleRaw: false,
  stylize: -1,
  chaos: -1,
  quality: -1,
  weird: -1,
  seed: '',
  negative: '',
  tile: false,
}

const DEFAULT_SETTINGS: Settings = {
  openrouterKey: '',
  openrouterModel: 'anthropic/claude-sonnet-4',
}

export interface LimnState {
  mode: Mode
  setMode: (m: Mode) => void

  slots: PromptSlots
  setSlots: (updater: (prev: PromptSlots) => PromptSlots) => void
  toggleChip: (slot: keyof PromptSlots, value: string) => void
  resetSlots: () => void

  freeform: string
  setFreeform: (s: string) => void

  params: MJParams
  setParams: (updater: (prev: MJParams) => MJParams) => void

  settings: Settings
  setSettings: (updater: (prev: Settings) => Settings) => void

  library: LibraryItem[]
  saveCurrent: (name: string) => LibraryItem
  loadItem: (id: string) => void
  deleteItem: (id: string) => void
}

function genId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

/** Multi-select chip slots — typed for safety in toggleChip. */
const MULTI_SELECT_SLOTS: Set<keyof PromptSlots> = new Set([
  'medium',
  'environment',
  'lighting',
  'timeOfDay',
  'mood',
  'color',
  'composition',
  'shotType',
  'cameraAngle',
  'cameraLens',
])

export function useLimnState(): LimnState {
  const [mode, setMode] = useState<Mode>(() => loadJSON<Mode>('mode', 'wizard'))
  const [slots, setSlotsRaw] = useState<PromptSlots>(() => loadJSON('slots', EMPTY_SLOTS))
  const [freeform, setFreeform] = useState<string>(() => loadJSON('freeform', ''))
  const [params, setParamsRaw] = useState<MJParams>(() => loadJSON('params', DEFAULT_PARAMS))
  const [settings, setSettingsRaw] = useState<Settings>(() =>
    loadJSON('settings', DEFAULT_SETTINGS),
  )
  const [library, setLibrary] = useState<LibraryItem[]>(() => loadJSON('library', []))

  // Persist on every change. Cheap because localStorage writes are sync and small.
  useEffect(() => saveJSON('mode', mode), [mode])
  useEffect(() => saveJSON('slots', slots), [slots])
  useEffect(() => saveJSON('freeform', freeform), [freeform])
  useEffect(() => saveJSON('params', params), [params])
  useEffect(() => saveJSON('settings', settings), [settings])
  useEffect(() => saveJSON('library', library), [library])

  const setSlots = useCallback((updater: (prev: PromptSlots) => PromptSlots) => {
    setSlotsRaw((prev) => updater(prev))
  }, [])

  const setParams = useCallback((updater: (prev: MJParams) => MJParams) => {
    setParamsRaw((prev) => updater(prev))
  }, [])

  const setSettings = useCallback((updater: (prev: Settings) => Settings) => {
    setSettingsRaw((prev) => updater(prev))
  }, [])

  const toggleChip = useCallback(
    (slot: keyof PromptSlots, value: string) => {
      if (!MULTI_SELECT_SLOTS.has(slot)) return
      setSlotsRaw((prev) => {
        const current = prev[slot]
        if (!Array.isArray(current)) return prev
        const exists = current.includes(value)
        const next = exists ? current.filter((c) => c !== value) : [...current, value]
        return { ...prev, [slot]: next } as PromptSlots
      })
    },
    [],
  )

  const resetSlots = useCallback(() => {
    setSlotsRaw(EMPTY_SLOTS)
    setFreeform('')
  }, [])

  const saveCurrent = useCallback(
    (name: string): LibraryItem => {
      const item: LibraryItem = {
        id: genId(),
        name: name.trim() || 'Untitled',
        createdAt: Date.now(),
        modeWhenSaved: mode,
        slots,
        params,
        freeform,
      }
      setLibrary((prev) => [item, ...prev])
      return item
    },
    [mode, slots, params, freeform],
  )

  const loadItem = useCallback(
    (id: string) => {
      const item = library.find((i) => i.id === id)
      if (!item) return
      setSlotsRaw(item.slots)
      setParamsRaw(item.params)
      setFreeform(item.freeform)
      setMode(item.modeWhenSaved)
    },
    [library],
  )

  const deleteItem = useCallback((id: string) => {
    setLibrary((prev) => prev.filter((i) => i.id !== id))
  }, [])

  return useMemo(
    () => ({
      mode,
      setMode,
      slots,
      setSlots,
      toggleChip,
      resetSlots,
      freeform,
      setFreeform,
      params,
      setParams,
      settings,
      setSettings,
      library,
      saveCurrent,
      loadItem,
      deleteItem,
    }),
    [
      mode,
      slots,
      setSlots,
      toggleChip,
      resetSlots,
      freeform,
      params,
      setParams,
      settings,
      setSettings,
      library,
      saveCurrent,
      loadItem,
      deleteItem,
    ],
  )
}
