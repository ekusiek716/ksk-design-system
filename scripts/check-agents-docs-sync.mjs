#!/usr/bin/env node
// =============================================================
// KSK Design System — CLAUDE.md / AGENTS.md 内容同期検査
//
// CLAUDE.md（Claude Code 用）と AGENTS.md（Codex 用）は同じ作業手順書を
// 2ツール向けに複製したもので、共通で守るべき内容（実装前セルフチェック・
// セッション開始時に読み込むファイル・ローカル二重実装ゲート・このDSに
// ついて・最大の特徴・技術スタック・AIモデルの使い分け方針・ドキュメント
// 構成・ディレクトリ構成・カラートークン体系・クイックスタート・
// コンポーネント追加時のチェックリスト）が片方にしか書かれていない
// （＝内容ドリフト）を検出する。
//
// check-docs-drift.mjs との棲み分け:
//   - check-docs-drift.mjs はファイル名・コンポーネント名等「実在」の照合
//   - 本スクリプトは CLAUDE.md/AGENTS.md（および templates/ の対）の
//     「見出し単位の内容一致」を照合する
//
// 除外方法（両方とも単独行、次の1行のみを対象から除外）:
//   - `<!-- docs-sync-ignore -->`      → 見出し単位比較（root の2ファイル）
//   - `<!-- docs-sync-ignore -->`      → 全文比較（templates/ の2ファイル）
//   - `<!-- BEGIN:xxx -->` 〜 `<!-- END:xxx -->` で囲んだブロックは
//     完全にツール固有の付録として比較対象から除外する
//
// 実行: node scripts/check-agents-docs-sync.mjs
// =============================================================
import { existsSync, readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")

const RED = "\x1b[0;31m"
const GREEN = "\x1b[0;32m"
const NC = "\x1b[0m"

let errors = 0
const error = (msg) => {
  console.log(`${RED}[SYNC-DRIFT]${NC} ${msg}`)
  errors += 1
}
const ok = (msg) => console.log(`${GREEN}[OK]${NC}    ${msg}`)

console.log("🔍 KSK Design System — CLAUDE.md / AGENTS.md 内容同期検査")
console.log("=======================================")

// ─── ツール固有の付録ブロックを除去（`<!-- BEGIN:*-only -->` 〜 `<!-- END:*-only -->`） ───
function stripToolOnlyBlocks(text) {
  return text.replace(/<!--\s*BEGIN:[\w-]+\s*-->[\s\S]*?<!--\s*END:[\w-]+\s*-->\n?/g, "")
}

// ─── `<!-- docs-sync-ignore -->` 単独行 → 次の1行を除外してから返す ───
function stripIgnoredLines(text) {
  const lines = text.split(/\r?\n/)
  const out = []
  for (let i = 0; i < lines.length; i += 1) {
    if (/^\s*<!--\s*docs-sync-ignore\s*-->\s*$/.test(lines[i])) {
      i += 1 // マーカー行と次の1行の両方を捨てる
      continue
    }
    out.push(lines[i])
  }
  return out.join("\n")
}

function loadDoc(relPath) {
  const full = join(ROOT, relPath)
  if (!existsSync(full)) return null
  const raw = readFileSync(full, "utf8")
  return stripToolOnlyBlocks(raw)
}

// ファイル欠損は必ずエラー（exit 1）。片方だけ削除されて同期チェックが
// 素通りする事故を防ぐ。
function requireDoc(relPath) {
  const text = loadDoc(relPath)
  if (text === null) {
    error(`${relPath} が存在しません`)
  }
  return text
}

// ─── H1/H2 単位でセクションに分割し、見出しテキストをキーにした Map を返す ───
// H3 はネストした内容としてそのまま H2 セクションの本文に含める。
// fenced code block（```）の中身は見出し判定の対象外（プレーンテキスト扱い）にする。
// 同名 H2 の重複はドキュメント構造として不正なため即エラーにする（重複した2つ目以降を
// 静かに上書きすると、途中の出現に対する drift が比較から漏れて素通りしてしまうため）。
function splitSections(text, relPath) {
  const lines = stripIgnoredLines(text).split(/\r?\n/)
  const sections = new Map()
  let currentKey = null
  let buf = []
  let inFence = false
  const flush = () => {
    if (currentKey !== null) {
      const body = buf.join("\n").trim()
      sections.set(currentKey, body)
    }
    buf = []
  }
  for (const line of lines) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence
      if (currentKey !== null) buf.push(line)
      continue
    }
    if (inFence) {
      if (currentKey !== null) buf.push(line)
      continue
    }
    const m = line.match(/^(##)\s+(.+?)\s*$/)
    if (m) {
      if (sections.has(m[2])) {
        error(`${relPath}: 見出し「## ${m[2]}」が重複しています（ドキュメント構造として不正）`)
      }
      flush()
      currentKey = m[2]
      continue
    }
    if (/^#\s+/.test(line)) {
      // H1（タイトル）は同期対象外。既存セクションのバッファには含めない
      continue
    }
    if (currentKey !== null) buf.push(line)
  }
  flush()
  return sections
}

function firstDiffLine(a, b) {
  const la = a.split("\n")
  const lb = b.split("\n")
  const max = Math.max(la.length, lb.length)
  for (let i = 0; i < max; i += 1) {
    if ((la[i] ?? null) !== (lb[i] ?? null)) {
      return { line: i + 1, a: la[i] ?? "(なし)", b: lb[i] ?? "(なし)" }
    }
  }
  return null
}

// 同期必須の見出しは固定リストとして持たず、両ファイルの見出し集合の
// 和集合から動的に導出する。新セクションを片方だけに追加した場合も、
// このスクリプトへの登録漏れなしに即座に検出される。
// ツール固有で意図的に共有しない見出しは、BEGIN/END マーカーで囲んで
// splitSections に渡す前に除去すること（Codex PR Review Guidelines 等）。
function checkPairByHeadings(pathA, pathB) {
  const textA = requireDoc(pathA)
  const textB = requireDoc(pathB)
  if (textA === null || textB === null) return

  const secA = splitSections(textA, pathA)
  const secB = splitSections(textB, pathB)
  const allHeadings = new Set([...secA.keys(), ...secB.keys()])

  for (const heading of allHeadings) {
    const inA = secA.has(heading)
    const inB = secB.has(heading)
    if (inA !== inB) {
      error(`「## ${heading}」が ${inA ? pathB : pathA} に存在しません`)
      continue
    }
    const bodyA = secA.get(heading)
    const bodyB = secB.get(heading)
    if (bodyA !== bodyB) {
      const diff = firstDiffLine(bodyA, bodyB)
      error(
        `「## ${heading}」の内容が ${pathA} と ${pathB} で一致しません` +
          (diff
            ? ` (セクション内 ${diff.line} 行目: "${diff.a}" vs "${diff.b}")`
            : ""),
      )
    }
  }
  ok(`${pathA} <-> ${pathB}: 見出し単位の内容同期チェック完了（${allHeadings.size} 見出しを比較）`)
}

function checkPairWhole(pathA, pathB) {
  const textA = requireDoc(pathA)
  const textB = requireDoc(pathB)
  if (textA === null || textB === null) return
  // templates は H1 を含む全文を同期する。ツール固有の1行だけを変える場合は
  // 他の行と同様に docs-sync-ignore を明示し、タイトル差分を黙って捨てない。
  const normalizeWhole = (t) => stripIgnoredLines(t).trim()
  const a = normalizeWhole(textA)
  const b = normalizeWhole(textB)
  if (a !== b) {
    const diff = firstDiffLine(a, b)
    error(
      `${pathA} と ${pathB} の内容が一致しません` +
        (diff ? ` (${diff.line} 行目: "${diff.a}" vs "${diff.b}")` : ""),
    )
  } else {
    ok(`${pathA} <-> ${pathB}: 全文一致`)
  }
}

console.log("")
console.log("─── ルート CLAUDE.md / AGENTS.md ───")
checkPairByHeadings("CLAUDE.md", "AGENTS.md")

console.log("")
console.log("─── templates/CLAUDE.md / templates/AGENTS.md ───")
checkPairWhole(join("templates", "CLAUDE.md"), join("templates", "AGENTS.md"))

// ─── 結果 ───
console.log("")
console.log("=======================================")
if (errors > 0) {
  console.log(`${RED}✗ CLAUDE.md/AGENTS.md 内容同期: ${errors} 件の乖離${NC}`)
  console.log("  両ファイルの共通セクションを同一内容に揃えるか、")
  console.log("  意図的な差分には <!-- docs-sync-ignore --> マーカー（単独行、次の1行を除外）")
  console.log("  または <!-- BEGIN:xxx --> 〜 <!-- END:xxx --> ブロックを使ってください")
  process.exit(1)
} else {
  console.log(`${GREEN}✓ 同期OK — CLAUDE.md と AGENTS.md の共通内容が一致しています${NC}`)
  process.exit(0)
}
