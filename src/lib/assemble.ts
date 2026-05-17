// Prompt assembly: turn structured slot state into output strings.

import type { MJParams, PromptSlots } from './types'

/** Join non-empty parts with a separator, trimming whitespace. */
function joinParts(parts: (string | undefined | null)[], sep: string): string {
  return parts
    .map((p) => (p ?? '').trim())
    .filter((p) => p.length > 0)
    .join(sep)
}

/** Render the slot state as a single natural-language prompt clause. */
export function assembleNaturalLanguage(slots: PromptSlots): string {
  const subjectPart = slots.subject.trim()
  if (!subjectPart && slots.medium.length === 0) return ''

  const mediumPart = slots.medium.length > 0 ? `${slots.medium.join(' + ')} style` : ''
  const environmentPart =
    slots.environment.length > 0 ? `in ${joinParts(slots.environment, ', ')}` : ''
  const timePart = slots.timeOfDay.length > 0 ? `at ${joinParts(slots.timeOfDay, ', ')}` : ''
  const lightingPart = slots.lighting.length > 0 ? `lit with ${joinParts(slots.lighting, ', ')}` : ''
  const colorPart = slots.color.length > 0 ? `${joinParts(slots.color, ', ')} colors` : ''
  const moodPart = slots.mood.length > 0 ? `${joinParts(slots.mood, ', ')} mood` : ''
  const compPart = slots.composition.length > 0 ? joinParts(slots.composition, ', ') : ''
  const shotPart = slots.shotType.length > 0 ? joinParts(slots.shotType, ', ') : ''
  const anglePart = slots.cameraAngle.length > 0 ? joinParts(slots.cameraAngle, ', ') : ''
  const lensPart = slots.cameraLens.length > 0 ? `shot on ${joinParts(slots.cameraLens, ', ')}` : ''
  const artistsPart = slots.artists.trim() ? `in the style of ${slots.artists.trim()}` : ''

  return joinParts(
    [
      subjectPart,
      mediumPart,
      environmentPart,
      timePart,
      lightingPart,
      colorPart,
      moodPart,
      shotPart,
      anglePart,
      compPart,
      lensPart,
      artistsPart,
    ],
    ', ',
  )
}

/** Render MJ-style parameter flags. */
export function assembleMJParams(params: MJParams): string {
  const flags: string[] = []
  if (params.aspectRatio.trim()) flags.push(`--ar ${params.aspectRatio.trim()}`)
  if (params.version.trim()) {
    // 'niji 6' uses --niji 6 instead of --v
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

/** Full MidJourney prompt = natural-language clause + flags. */
export function assembleMidjourney(slots: PromptSlots, params: MJParams): string {
  const nl = assembleNaturalLanguage(slots)
  const flags = assembleMJParams(params)
  return joinParts([nl, flags], ' ')
}
