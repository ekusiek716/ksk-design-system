#!/usr/bin/env node
/**
 * DS 内部ユーティリティの safelist 生成スクリプト（issue #258）
 *
 * 背景:
 *   DS は minified な dist を配布し、消費側 Tailwind v4 は
 *   `@source "../node_modules/ksk-design-system/dist"` で dist を走査して
 *   ユーティリティ CSS を生成する。この @source が無い / パスがずれている /
 *   スキャナが dist を辿れない（symlink・monorepo・別バンドラ等）と、
 *   DS 内部でしか出現しないクラス（`pointer-events-auto` 等）の CSS が
 *   消費側で生成されず、開発環境（Storybook）では正常なのに消費側でだけ壊れる。
 *   #132/#134 → #138 → #143 と3回、個別コンポーネントの書き換えで対症療法した。
 *
 * 対策:
 *   DS が実際に使うユーティリティを build 時に抽出し、
 *   `@source inline("…")` 形式の safelist として src/styles/source-safelist.css に
 *   生成して preset.css から読み込む。消費側は preset を @import するだけなので
 *   **消費側の設定変更なしに** DS 内部クラスの生成が保証される。
 *
 * 追加のガード（いずれも「黙って safelist から漏れる」ことを防ぐ）:
 *   - `bg-${x}` のような動的クラス名合成は静的抽出では原理的に拾えないため、
 *     safelist に載らない。DS の実ユーティリティ接頭辞を使った動的合成を検出してエラーにする。
 *   - `@source inline()` の構文上どうしても表現できないユーティリティ（波括弧を含む等）は
 *     除外せず生成失敗にし、該当クラスと対処法を表示する。
 *   どちらも --check / 生成の両方で検査する。
 *
 * Usage:
 *   node scripts/generate-source-safelist.mjs          # 生成
 *   node scripts/generate-source-safelist.mjs --check  # 差分があれば exit 1（CI 用）
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs"
import { dirname, join, relative } from "node:path"
import { fileURLToPath } from "node:url"
import { Scanner } from "@tailwindcss/oxide"
import { __unstable__loadDesignSystem } from "tailwindcss"
import {
  findDynamicClassComposition,
  formatInlineSource,
  UNSUPPORTED_HELP,
} from "./lib/source-safelist-format.mjs"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const OUT_PATH = join(ROOT, "src/styles/source-safelist.css")
const CHECK = process.argv.includes("--check")

/**
 * 走査対象 = dist に同梱される Web 側ソース。
 * .stories.tsx / src/native（RN。Tailwind を使わない）/ prototypes は除外する。
 *
 * クラス抽出（Scanner）と動的クラス名合成の検査は**同じ対象**でなければならない。
 * 片方だけを見ていると、配布されるのに検査されないファイルが生まれる（issue #258 のレビュー指摘）。
 * そのため Scanner 用の sources と、検査用のファイル収集を 1 つの定義から導出する。
 */
const SOURCE_SPECS = [
  {
    dir: "src/components",
    recursive: true,
    scannerPatterns: [
      { pattern: "**/*.{ts,tsx}", negated: false },
      { pattern: "**/*.stories.tsx", negated: true },
    ],
    matches: (name) => /\.tsx?$/.test(name) && !name.endsWith(".stories.tsx"),
  },
  {
    dir: "src/lib",
    recursive: true,
    scannerPatterns: [{ pattern: "**/*.ts", negated: false }],
    matches: (name) => name.endsWith(".ts"),
  },
  {
    dir: "src",
    recursive: false,
    scannerPatterns: [
      { pattern: "class-names.ts", negated: false },
      { pattern: "index.ts", negated: false },
    ],
    matches: (name) => name === "class-names.ts" || name === "index.ts",
  },
]

const SCANNER_SOURCES = SOURCE_SPECS.flatMap(({ dir, scannerPatterns }) =>
  scannerPatterns.map(({ pattern, negated }) => ({ base: join(ROOT, dir), pattern, negated })),
)

async function loadDesignSystem() {
  const css = readFileSync(join(ROOT, "src/index.css"), "utf8")
  return __unstable__loadDesignSystem(css, {
    base: join(ROOT, "src"),
    loadStylesheet: async (id, base) => {
      const resolve = (p) => ({
        path: p,
        base: dirname(p),
        // 生成対象ファイル自身は読み込まない。preset.css がこれを @import しているため、
        // 素直に読むと (1) 初回生成時（ファイル未作成）に throw して --check の欠損診断にも
        // writeFileSync にも到達できない (2) 前回の生成結果が入力に混ざる、の2つの問題が出る。
        // 常に空として扱えばブートストラップ可能で、生成は src の実装だけに依存する。
        content: p === OUT_PATH ? "" : readFileSync(p, "utf8"),
      })
      if (id === "tailwindcss") return resolve(join(ROOT, "node_modules/tailwindcss/index.css"))
      if (id === "tw-animate-css") return resolve(join(ROOT, "node_modules/tw-animate-css/dist/tw-animate.css"))
      if (id.startsWith("tailwindcss/")) return resolve(join(ROOT, "node_modules", id))
      return resolve(join(base, id))
    },
    loadModule: async () => {
      throw new Error(`source-safelist: @plugin / @config は未対応です`)
    },
  })
}

/** 実際に CSS を生成する候補だけに絞り込む（識別子・コメント文言などを落とす） */
function filterValid(designSystem, candidates) {
  const compiled = designSystem.candidatesToCss(candidates)
  return candidates.filter((_, i) => compiled[i] != null)
}

/* ─── 動的クラス名合成の検出 ───────────────────────────────
   DS が実際に使うユーティリティの「接頭辞」（`pointer-events-` / `bg-` 等）で
   始まるテンプレートリテラル補間だけを違反とする。`key={`separator-${i}`}` の
   ような非ユーティリティ文字列は接頭辞集合に無いので誤検出しない。 */
function utilityPrefixes(utilities) {
  const prefixes = new Set()
  for (const u of utilities) {
    // variant（`hover:` 等）と arbitrary は落とし、素の `foo-bar-` 部分だけ拾う
    const bare = u.split(":").pop()
    if (!/^-?[a-z][a-z0-9-]*$/.test(bare)) continue
    const parts = bare.split("-")
    for (let i = 1; i < parts.length; i++) {
      prefixes.add(`${parts.slice(0, i).join("-")}-`)
    }
  }
  return prefixes
}

function collectFiles(dir, filter, recursive) {
  const out = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      if (recursive) out.push(...collectFiles(full, filter, recursive))
    } else if (filter(entry)) {
      out.push(full)
    }
  }
  return out
}

/** 検査対象ファイル = Scanner の走査対象と同一（SOURCE_SPECS から導出） */
function sourceFiles() {
  return SOURCE_SPECS.flatMap(({ dir, matches, recursive }) =>
    collectFiles(join(ROOT, dir), matches, recursive),
  )
}

function collectDynamicClassViolations(prefixes) {
  return sourceFiles().flatMap((file) =>
    findDynamicClassComposition(readFileSync(file, "utf8"), prefixes).map(
      ({ line, prefix }) => `${relative(ROOT, file)}:${line}  \`…${prefix}\${…}\``,
    ),
  )
}

/* ─── 生成 ─────────────────────────────────────────────── */
const designSystem = await loadDesignSystem()
const scanned = new Scanner({ sources: SCANNER_SOURCES }).scan()
const utilities = filterValid(designSystem, scanned).sort()

// 表現不能な候補を黙って捨てない。捨てると safelist から漏れ、#258 と同型の
// 「消費側でだけ CSS が生成されない」欠落が静かに再発する。
const lines = []
const unsupported = []
for (const u of utilities) {
  const result = formatInlineSource(u)
  if (result.ok) lines.push(result.line)
  else unsupported.push({ candidate: u, reason: result.reason })
}

if (unsupported.length > 0) {
  console.error(`✗ safelist に載せられないユーティリティが ${unsupported.length} 件あります（黙って除外すると消費側で CSS が生成されません）`)
  for (const { candidate, reason } of unsupported) {
    console.error(`  ${candidate}`)
    console.error(`    → ${UNSUPPORTED_HELP[reason]}`)
  }
  process.exit(1)
}

const dynamic = collectDynamicClassViolations(utilityPrefixes(utilities))
if (dynamic.length > 0) {
  console.error("✗ 動的なクラス名合成を検出しました（静的抽出できず消費側で CSS が生成されません）")
  for (const v of dynamic) console.error(`  ${v}`)
  console.error("  クラス名は完全な文字列で書き、分岐は三項演算子・cva の variant で表現してください")
  process.exit(1)
}

const header = `/* =============================================================
   KSK Design System — @source safelist（自動生成 / 手で編集しない）

   生成: node scripts/generate-source-safelist.mjs
   検証: node scripts/generate-source-safelist.mjs --check

   DS 内部でしか出現しないユーティリティを消費側の @source スキャンに
   依存せず生成させるための safelist（issue #258）。
   preset.css から読み込まれるため、消費側は追加設定なしで恩恵を受ける。
   ============================================================= */
`

const output = `${header}\n${lines.join("\n")}\n`

if (CHECK) {
  let existing
  try {
    existing = readFileSync(OUT_PATH, "utf8")
  } catch {
    console.error(`✗ ${relative(ROOT, OUT_PATH)} が存在しません。node scripts/generate-source-safelist.mjs を実行してください`)
    process.exit(1)
  }
  if (existing !== output) {
    console.error("✗ src/styles/source-safelist.css が src の実装と一致していません（差分あり）")
    console.error("  node scripts/generate-source-safelist.mjs を実行して再生成してください")
    const a = existing.split("\n")
    const b = output.split("\n")
    let shown = 0
    for (let i = 0; i < Math.max(a.length, b.length) && shown < 20; i++) {
      if (a[i] !== b[i]) {
        console.error(`  L${i + 1}: - ${a[i] ?? "(なし)"}`)
        console.error(`  L${i + 1}: + ${b[i] ?? "(なし)"}`)
        shown++
      }
    }
    process.exit(1)
  }
  console.log(`✓ src/styles/source-safelist.css は最新です（safelist: ${lines.length} 件）`)
  process.exit(0)
}

writeFileSync(OUT_PATH, output)
console.log(`✓ src/styles/source-safelist.css を生成しました（safelist: ${lines.length} 件）`)
