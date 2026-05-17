// Thin OpenRouter client.
//
// Keys live in localStorage; nothing is sent except the explicit calls made here.
// Docs: https://openrouter.ai/docs

import type { PromptSlots } from './types'

const ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions'

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface ChatRequest {
  model: string
  messages: ChatMessage[]
  temperature?: number
  max_tokens?: number
  response_format?: { type: 'json_object' }
}

interface ChatResponse {
  choices: { message: { content: string } }[]
  error?: { message: string; code?: number }
}

async function callOpenRouter(
  apiKey: string,
  model: string,
  messages: ChatMessage[],
  opts: { json?: boolean; temperature?: number; maxTokens?: number } = {},
): Promise<string> {
  if (!apiKey) throw new Error('OpenRouter API key not set. Add it in Settings.')
  if (!model) throw new Error('OpenRouter model not selected. Pick one in Settings.')

  const body: ChatRequest = {
    model,
    messages,
    temperature: opts.temperature ?? 0.7,
    max_tokens: opts.maxTokens ?? 800,
  }
  if (opts.json) body.response_format = { type: 'json_object' }

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://nnnsightnnn.github.io/limn/',
      'X-Title': 'Limn',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`OpenRouter ${res.status}: ${text.slice(0, 200) || res.statusText}`)
  }
  const data = (await res.json()) as ChatResponse
  if (data.error) throw new Error(data.error.message)
  const content = data.choices?.[0]?.message?.content?.trim()
  if (!content) throw new Error('OpenRouter returned no content.')
  return content
}

/**
 * Suggest N options for a specific slot, given the current context.
 * Returns an array of short label strings ready to be turned into chips.
 */
export async function suggestForSlot(args: {
  apiKey: string
  model: string
  slotName: string
  slotDescription: string
  currentSlots: PromptSlots
  count?: number
}): Promise<string[]> {
  const { apiKey, model, slotName, slotDescription, currentSlots, count = 8 } = args

  const system = `You are a prompt engineering assistant for AI image generation. \
Given a user's partial prompt state, suggest concise, evocative options for one specific slot. \
Reply ONLY with valid JSON of the shape: {"suggestions": ["...", "...", ...]}. \
Each suggestion should be 1–6 words. No numbering, no explanations.`

  const ctx = JSON.stringify(
    {
      subject: currentSlots.subject || '(empty)',
      medium: currentSlots.medium,
      environment: currentSlots.environment,
      mood: currentSlots.mood,
      lighting: currentSlots.lighting,
    },
    null,
    2,
  )

  const user = `Slot to fill: **${slotName}** — ${slotDescription}
Suggest exactly ${count} options.

Current prompt context:
${ctx}`

  const raw = await callOpenRouter(
    apiKey,
    model,
    [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
    { json: true, temperature: 0.9, maxTokens: 400 },
  )

  let parsed: { suggestions?: unknown }
  try {
    parsed = JSON.parse(raw)
  } catch {
    // Try to recover from a non-JSON answer
    const match = raw.match(/\{[\s\S]*\}/)
    if (!match) throw new Error('Could not parse AI response as JSON.')
    parsed = JSON.parse(match[0])
  }
  if (!Array.isArray(parsed.suggestions)) throw new Error('AI response missing "suggestions" array.')
  return parsed.suggestions
    .filter((s): s is string => typeof s === 'string')
    .map((s) => s.trim())
    .filter(Boolean)
}

/** Enhance a free-form rough idea into a richer image-gen prompt. */
export async function enhanceFreeform(args: {
  apiKey: string
  model: string
  text: string
}): Promise<string> {
  const { apiKey, model, text } = args
  if (!text.trim()) throw new Error('Type something first.')

  const system = `You are a prompt engineering assistant for AI image generation. \
Rewrite the user's rough idea into a single rich, evocative image-generation prompt. \
Include subject, medium, environment, lighting, mood, and composition cues where appropriate. \
Reply with just the prompt — no preamble, no quotes, no parameter flags.`

  return callOpenRouter(
    apiKey,
    model,
    [
      { role: 'system', content: system },
      { role: 'user', content: text.trim() },
    ],
    { temperature: 0.8, maxTokens: 400 },
  )
}

/** Parse an existing free-form prompt back into structured slot values. */
export async function parseToSlots(args: {
  apiKey: string
  model: string
  text: string
}): Promise<Partial<PromptSlots>> {
  const { apiKey, model, text } = args
  if (!text.trim()) throw new Error('Nothing to parse.')

  const system = `You are a prompt analyzer. Extract structured slots from an image-generation prompt. \
Reply ONLY with valid JSON matching this TypeScript shape (omit any slot you can't infer):
{
  "subject": string,
  "medium": string[],
  "environment": string[],
  "lighting": string[],
  "timeOfDay": string[],
  "mood": string[],
  "color": string[],
  "composition": string[],
  "shotType": string[],
  "cameraAngle": string[],
  "cameraLens": string[],
  "artists": string
}
Use short canonical phrases for each value.`

  const raw = await callOpenRouter(
    apiKey,
    model,
    [
      { role: 'system', content: system },
      { role: 'user', content: text.trim() },
    ],
    { json: true, temperature: 0.2, maxTokens: 600 },
  )

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    const match = raw.match(/\{[\s\S]*\}/)
    if (!match) throw new Error('Could not parse AI response as JSON.')
    parsed = JSON.parse(match[0])
  }
  return parsed as Partial<PromptSlots>
}

/** A short curated list of OpenRouter models to seed the picker. Users can type any model ID. */
export const SEED_MODELS = [
  'anthropic/claude-sonnet-4',
  'anthropic/claude-haiku-4.5',
  'openai/gpt-4o',
  'openai/gpt-4o-mini',
  'google/gemini-2.0-flash',
  'meta-llama/llama-3.3-70b-instruct',
] as const
