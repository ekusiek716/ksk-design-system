// @ts-check
/**
 * socialicon/ の SVG を SocialIcon コンポーネント用データ (social-icon-data.tsx) に変換する。
 *
 * 対応する命名フォーマット（どちらも platform 名が明確なもののみ）:
 *   1. `Name=BRAND, Colors=Neutral|Original.svg`  ← 現行・推奨（viewBox 0 0 24 24 統一）
 *      Neutral → tone "mono"（currentColor 化）/ Original → tone "brand"
 *   2. `platform=BRAND, shape=SHAPE, colored=False|True|Gray.svg`  ← 旧形式
 *      colored=False → "mono" / True → "brand" / Gray → "gray"
 *
 * それ以外（日本語プロパティ名・platform 欠落の無名・連番重複・単独命名）と、
 * PNG を埋め込んだだけのラスター SVG（<image>/base64）は warn を出してスキップ。
 * 命名を上記いずれかに直して再生成すれば自動で取り込まれる。
 *
 * 出力データのキーはファイル名ではなく正規化済みの安定キー（platform slug / tone）。
 * コンポーネント API はファイル名の揺れに一切依存しない。
 *
 * 実行: node scripts/generate-social-icons.mjs
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, "..")
const SRC_DIR = join(ROOT, "socialicon")
const OUT = join(ROOT, "src/components/ui/social-icon-data.tsx")

// 旧 platform= 形式の enum マップ
const SHAPE_MAP = {
  Original: "original",
  Square: "square",
  "Rounded square": "rounded-square",
  Rounded: "rounded",
}
const TONE_MAP = { False: "mono", True: "brand", Gray: "gray" }

// Name=BRAND, Colors=Neutral|Original.svg（現行）
const RE_NAME = /^Name=(.+), Colors=(Neutral|Original)\.svg$/
// platform=BRAND, shape=SHAPE, colored=False|True|Gray.svg（旧）
const RE_PLATFORM = /^platform=([^,]+), shape=([^,]+), colored=([^.]+)\.svg$/

/** ブランド表示名を安定 slug 化（"Apple Music" → "apple-music", "X ex Twitter" → "x-ex-twitter"） */
function toSlug(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[()]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/** `style="a-b:c;d:e"`（CSS文字列）を JSX の style={{aB:"c"}} オブジェクトに変換 */
function styleStringToJsx(css) {
  const props = css
    .split(";")
    .map((d) => d.trim())
    .filter(Boolean)
    .map((decl) => {
      const i = decl.indexOf(":")
      if (i === -1) return null
      const key = decl.slice(0, i).trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase())
      const val = decl.slice(i + 1).trim()
      return `${JSON.stringify(key)}: ${JSON.stringify(val)}`
    })
    .filter(Boolean)
  return `style={{${props.join(", ")}}}`
}

/** SVG 属性を JSX(camelCase) に変換 */
function toJsxAttrs(s) {
  s = s.replace(/style="([^"]*)"/g, (_, css) => styleStringToJsx(css))
  return s
    .replace(/fill-rule=/g, "fillRule=")
    .replace(/clip-rule=/g, "clipRule=")
    .replace(/stroke-width=/g, "strokeWidth=")
    .replace(/stroke-linecap=/g, "strokeLinecap=")
    .replace(/stroke-linejoin=/g, "strokeLinejoin=")
    .replace(/stroke-miterlimit=/g, "strokeMiterlimit=")
    .replace(/stroke-dasharray=/g, "strokeDasharray=")
    .replace(/fill-opacity=/g, "fillOpacity=")
    .replace(/stroke-opacity=/g, "strokeOpacity=")
    .replace(/clip-path=/g, "clipPath=")
    .replace(/stop-color=/g, "stopColor=")
    .replace(/stop-opacity=/g, "stopOpacity=")
    .replace(/gradientUnits=/g, "gradientUnits=")
    .replace(/gradientTransform=/g, "gradientTransform=")
    .replace(/color-interpolation-filters=/g, "colorInterpolationFilters=")
    .replace(/xmlns:xlink="[^"]*"/g, "")
    .replace(/xlink:href=/g, "xlinkHref=")
}

/** ファイル名 → { platform, shape, tone, label } か null（非対応命名） */
function parseName(file) {
  let m = file.match(RE_NAME)
  if (m) {
    const label = m[1].trim()
    const tone = m[2] === "Neutral" ? "mono" : "brand"
    // Name= 形式は単一形状のみ（shape 概念なし）→ "original" に集約
    return { platform: toSlug(label), shape: "original", tone, label }
  }
  m = file.match(RE_PLATFORM)
  if (m) {
    const label = m[1].trim()
    const shape = SHAPE_MAP[m[2].trim()]
    const tone = TONE_MAP[m[3].trim()]
    if (!shape || !tone) return null
    return { platform: toSlug(label), shape, tone, label }
  }
  return null
}

const files = readdirSync(SRC_DIR).filter((f) => f.endsWith(".svg"))
const skipped = []
/** @type {Record<string, {label:string, shapes:Record<string, Record<string, {viewBox:string, body:string}>>}>} */
const data = {}
let count = 0

for (const file of files.sort()) {
  const parsed = parseName(file)
  if (!parsed) {
    skipped.push(file)
    continue
  }
  const { platform, shape, tone, label } = parsed

  const raw = readFileSync(join(SRC_DIR, file), "utf8")
  // PNG を埋め込んだだけのラスター SVG は除外（巨大 base64 のバンドル混入を防ぐ）。
  if (/<image\b/.test(raw) || /data:image\/(png|jpe?g)/i.test(raw)) {
    skipped.push(`${file} (raster/base64 埋め込み)`)
    continue
  }
  const viewBox = (raw.match(/viewBox="([^"]+)"/) || [])[1] || "0 0 24 24"
  let inner = (raw.match(/<svg[^>]*>([\s\S]*?)<\/svg>/) || [])[1] || ""
  inner = toJsxAttrs(inner).trim()
  // mono はテキスト色に追従させるため、Neutral の代表色を currentColor 化
  if (tone === "mono") {
    inner = inner.replace(/fill="#0A0A0A"/gi, 'fill="currentColor"')
    inner = inner.replace(/fill="#1C1A1A"/gi, 'fill="currentColor"')
    inner = inner.replace(/fill="#1A1414"/gi, 'fill="currentColor"')
  }

  data[platform] ??= { label, shapes: {} }
  data[platform].shapes[shape] ??= {}
  // 先勝ち: 同じ platform/shape/tone が複数命名で重複した場合（例: Name=Github と
  // 旧 platform=github の original）、sort 順で先に来る Name= 形式(viewBox 24 統一)を
  // 採用し、後続の旧形式では上書きしない。
  if (data[platform].shapes[shape][tone]) {
    skipped.push(`${file} (既存エントリ優先のため重複スキップ)`)
    continue
  }
  data[platform].shapes[shape][tone] = { viewBox, body: inner }
  count++
}

const platforms = Object.keys(data).sort()

let out = `// AUTO-GENERATED by scripts/generate-social-icons.mjs — DO NOT EDIT.
// 取り込み済み: ${count} アイコン / ${platforms.length} プラットフォーム。
// 命名が非対応 or PNG 埋め込みでスキップされたファイルは再生成ログ参照。
import * as React from "react"

export interface SocialIconEntry {
  viewBox: string
  body: React.ReactNode
}

export type SocialIconTone = "mono" | "brand" | "gray"
export type SocialIconShape = "original" | "square" | "rounded-square" | "rounded"

/** platform slug → 表示用ラベル */
export const SOCIAL_ICON_LABELS: Record<string, string> = {
`
for (const p of platforms) {
  out += `  ${JSON.stringify(p)}: ${JSON.stringify(data[p].label)},\n`
}
out += `}

export const SOCIAL_ICON_DATA: Record<
  string,
  Partial<Record<SocialIconShape, Partial<Record<SocialIconTone, SocialIconEntry>>>>
> = {
`
for (const p of platforms) {
  out += `  ${JSON.stringify(p)}: {\n`
  for (const shape of Object.keys(data[p].shapes)) {
    out += `    ${JSON.stringify(shape)}: {\n`
    for (const tone of Object.keys(data[p].shapes[shape])) {
      const e = data[p].shapes[shape][tone]
      out += `      ${JSON.stringify(tone)}: { viewBox: ${JSON.stringify(e.viewBox)}, body: (<>${e.body}</>) },\n`
    }
    out += `    },\n`
  }
  out += `  },\n`
}
out += `}\n\nexport const SOCIAL_ICON_PLATFORMS = ${JSON.stringify(platforms)} as const\n`

writeFileSync(OUT, out)
console.log(`✅ social-icon-data.tsx 生成: ${count} アイコン / ${platforms.length} プラットフォーム`)
console.log(`   platforms: ${platforms.join(", ")}`)
if (skipped.length) {
  console.log(`\n⚠️  非対応命名 or PNG埋め込みでスキップ (${skipped.length}件):`)
  for (const f of skipped) console.log(`   - ${f}`)
}
