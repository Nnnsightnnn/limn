// One-shot generator for the Popular Plates gallery.
//
// Reads POPULAR_PROMPTS from src/data/popularPrompts.ts, calls OpenRouter once
// per plate to generate a 1:1 image, writes PNG/JPG/WEBP into public/plates/,
// and rewrites src/data/plateImages.generated.ts with the title→file map that
// the runtime component reads.
//
// Usage:
//   OPENROUTER_API_KEY=sk-or-... npm run gen:plates
//   npm run gen:plates -- --force                 # re-generate everything
//   npm run gen:plates -- --only freckled-laugh-golden-hour
//   npm run gen:plates -- --model google/gemini-2.5-flash-image
//
// Runs on Node 22+ (native TS strip-types). No build step.

import { mkdir, writeFile, access } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Buffer } from 'node:buffer'
import sharp from 'sharp'
import { POPULAR_PROMPTS } from '../src/data/popularPrompts.ts'

const THUMB_SIZE = 640
const WEBP_QUALITY = 82

const __filename = fileURLToPath(import.meta.url)
const ROOT = dirname(dirname(__filename))
const OUT_DIR = join(ROOT, 'public', 'plates')
const GEN_FILE = join(ROOT, 'src', 'data', 'plateImages.generated.ts')

const ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions'
const REFERER = 'https://nnnsightnnn.github.io/limn/'
const X_TITLE = 'Limn'

const args = process.argv.slice(2)
const force = args.includes('--force')
const onlyFlag = args.indexOf('--only')
const onlySlug = onlyFlag >= 0 ? args[onlyFlag + 1] : null
const modelFlag = args.indexOf('--model')
const MODEL = modelFlag >= 0 ? args[modelFlag + 1] : 'google/gemini-3.1-flash-image-preview'

const KEY = process.env.OPENROUTER_API_KEY
if (!KEY) {
  console.error('error: OPENROUTER_API_KEY is not set in the environment.')
  process.exit(1)
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

async function fileExists(p: string): Promise<boolean> {
  try { await access(p); return true } catch { return false }
}

function extractDataUrl(data: unknown): string | null {
  const root = data as { choices?: Array<{ message?: unknown }> }
  const msg = root?.choices?.[0]?.message as
    | {
        images?: Array<{ image_url?: { url?: string } }>
        content?: unknown
      }
    | undefined
  if (!msg) return null

  // Shape A: choices[0].message.images[0].image_url.url
  const fromImages = msg.images?.[0]?.image_url?.url
  if (typeof fromImages === 'string') return fromImages

  // Shape B: choices[0].message.content is an array of multimodal parts
  if (Array.isArray(msg.content)) {
    for (const part of msg.content as Array<{ image_url?: { url?: string } }>) {
      const u = part?.image_url?.url
      if (typeof u === 'string') return u
    }
  }

  // Shape C: choices[0].message.content is a string that contains a data URL
  if (typeof msg.content === 'string') {
    const m = msg.content.match(/data:image\/[a-z]+;base64,[A-Za-z0-9+/=]+/)
    if (m) return m[0]
  }

  return null
}

interface PlateInput { title: string; prompt: string }

async function generate(plate: PlateInput): Promise<string> {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${KEY}`,
      'HTTP-Referer': REFERER,
      'X-Title': X_TITLE,
    },
    body: JSON.stringify({
      model: MODEL,
      modalities: ['image', 'text'],
      messages: [{ role: 'user', content: plate.prompt }],
      image_config: { aspect_ratio: '1:1', image_size: '1K' },
    }),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`HTTP ${res.status}: ${text.slice(0, 400) || res.statusText}`)
  }
  const json = await res.json()
  const dataUrl = extractDataUrl(json)
  if (!dataUrl) {
    throw new Error(`no image in response: ${JSON.stringify(json).slice(0, 400)}`)
  }
  return dataUrl
}

function decodeDataUrl(dataUrl: string): Buffer {
  const m = dataUrl.match(/^data:image\/[a-zA-Z]+;base64,(.+)$/)
  if (!m) throw new Error('response was not a base64 data URL')
  return Buffer.from(m[1], 'base64')
}

async function toThumbWebp(buf: Buffer): Promise<Buffer> {
  return sharp(buf)
    .resize(THUMB_SIZE, THUMB_SIZE, { fit: 'cover', position: 'attention' })
    .webp({ quality: WEBP_QUALITY, effort: 5 })
    .toBuffer()
}

await mkdir(OUT_DIR, { recursive: true })

const results: Array<{ title: string; file: string }> = []
const failures: Array<{ slug: string; reason: string }> = []

let i = 0
for (const plate of POPULAR_PROMPTS) {
  i++
  const slug = slugify(plate.title)
  if (onlySlug && slug !== onlySlug) continue

  const outPath = join(OUT_DIR, `${slug}.webp`)

  if ((await fileExists(outPath)) && !force) {
    console.log(`[${i}/${POPULAR_PROMPTS.length}] skip ${slug} (exists)`)
    results.push({ title: plate.title, file: `plates/${slug}.webp` })
    continue
  }

  console.log(`[${i}/${POPULAR_PROMPTS.length}] gen  ${slug} ...`)
  try {
    const dataUrl = await generate(plate)
    const raw = decodeDataUrl(dataUrl)
    const thumb = await toThumbWebp(raw)
    await writeFile(outPath, thumb)
    results.push({ title: plate.title, file: `plates/${slug}.webp` })
    console.log(`         ${outPath}  (${(thumb.length / 1024).toFixed(1)} KB, from ${(raw.length / 1024).toFixed(1)} KB)`)
  } catch (e) {
    const reason = (e as Error).message
    failures.push({ slug, reason })
    console.error(`         FAILED: ${reason}`)
  }

  await new Promise((r) => setTimeout(r, 500))
}

const header = `// AUTO-GENERATED by scripts/generate-plates.ts — do not edit by hand.
// Re-run with \`npm run gen:plates\` after changing prompts.

export const PLATE_IMAGES_BY_TITLE: Record<string, string> = {
`
const body = results
  .map((r) => `  ${JSON.stringify(r.title)}: ${JSON.stringify(r.file)},`)
  .join('\n')
const footer = '\n}\n'
await writeFile(GEN_FILE, header + body + footer, 'utf8')

console.log('')
console.log(`wrote ${GEN_FILE} (${results.length} entries)`)
if (failures.length) {
  console.log(`\n${failures.length} failed:`)
  for (const f of failures) console.log(`  - ${f.slug}: ${f.reason}`)
  process.exit(1)
}
