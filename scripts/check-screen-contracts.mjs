#!/usr/bin/env node
// =============================================================
// KSK Design System — 画面パターン契約 整合性チェック
//
// contracts/screen-patterns.json と contracts/composition.json が
// contracts/components.json の実在コンポーネント名・src/components/ui/button.tsx
// の実在 variant のみを参照しているか、decisionTree / crudMatrix が
// 実在パターンのみを指しているかを検査する。
//
// 検査項目:
//   (a) screen-patterns.patterns[].dsComponents / composition.pageSkeletons
//       の requiredComponents・optionalComponents が components.json の name に実在するか
//   (b) decisionTree の yes/no が「実在 pattern-id」か「実在 step 番号」か。
//       未到達 step・閉路（無限ループ）も検出する
//   (c) crudMatrix[].pattern が実在 pattern-id か
//   (d) ctaHierarchy.priority[].variant が button.tsx の cva variant に実在するか
//
// 実行: node scripts/check-screen-contracts.mjs
// =============================================================
import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")

const RED = "\x1b[0;31m"
const GREEN = "\x1b[0;32m"
const CYAN = "\x1b[0;36m"
const NC = "\x1b[0m"

let errors = 0
const error = (msg) => {
  console.log(`${RED}[FAIL]${NC} ${msg}`)
  errors += 1
}
const ok = (msg) => console.log(`${GREEN}[OK]${NC}   ${msg}`)
const info = (msg) => console.log(`${CYAN}[INFO]${NC} ${msg}`)

console.log("🔍 KSK Design System — 画面パターン契約 整合性チェック")
console.log("=======================================")

function readJson(relPath) {
  return JSON.parse(readFileSync(join(ROOT, relPath), "utf8"))
}

const screenPatterns = readJson("contracts/screen-patterns.json")
const composition = readJson("contracts/composition.json")
const components = readJson("contracts/components.json")

// ─── 実在コンポーネント名集合 ───
const componentNames = new Set()
for (const cat of ["ui", "patterns", "commerce", "admin", "shells"]) {
  for (const c of components[cat] ?? []) {
    componentNames.add(c.name)
  }
}
info(`components.json 実在コンポーネント: ${componentNames.size} 件`)

// ─── (a) dsComponents / requiredComponents / optionalComponents ───
for (const pattern of screenPatterns.patterns ?? []) {
  for (const comp of pattern.dsComponents ?? []) {
    if (!componentNames.has(comp)) {
      error(`screen-patterns.json: pattern "${pattern.id}" の dsComponents に未実在コンポーネント "${comp}"`)
    }
  }
}
for (const [skeletonName, skeleton] of Object.entries(composition.pageSkeletons ?? {})) {
  for (const comp of [...(skeleton.requiredComponents ?? []), ...(skeleton.optionalComponents ?? [])]) {
    if (!componentNames.has(comp)) {
      error(`composition.json: pageSkeletons.${skeletonName} に未実在コンポーネント "${comp}"`)
    }
  }
}
if (errors === 0) ok("dsComponents / requiredComponents / optionalComponents はすべて実在コンポーネント")

// ─── pattern-id 集合 ───
const patternIds = new Set((screenPatterns.patterns ?? []).map((p) => p.id))
info(`screen-patterns.json 実在パターン: ${patternIds.size} 件 (${[...patternIds].join(", ")})`)

// ─── (b) decisionTree ───
const tree = screenPatterns.decisionTree ?? []
const stepNumbers = new Set(tree.map((n) => n.step))
const reachedFromStep1 = new Set()
const visitingStack = new Set()
let cycleDetected = false

function resolveTarget(target, fromStep) {
  if (typeof target === "string") {
    if (!patternIds.has(target)) {
      error(`decisionTree: step ${fromStep} の遷移先 "${target}" は実在 pattern-id でも実在 step でもない`)
    }
    return null // leaf（パターンで終端）
  }
  if (typeof target === "number") {
    if (!stepNumbers.has(target)) {
      error(`decisionTree: step ${fromStep} の遷移先 step ${target} が存在しない`)
      return null
    }
    return target
  }
  error(`decisionTree: step ${fromStep} の遷移先の型が不正 (${JSON.stringify(target)})`)
  return null
}

function walk(step) {
  if (visitingStack.has(step)) {
    error(`decisionTree: step ${step} を含む閉路（無限ループ）を検出`)
    cycleDetected = true
    return
  }
  if (reachedFromStep1.has(step)) return
  reachedFromStep1.add(step)
  visitingStack.add(step)
  const node = tree.find((n) => n.step === step)
  if (!node) {
    error(`decisionTree: step ${step} が定義されていない`)
    visitingStack.delete(step)
    return
  }
  const yesNext = resolveTarget(node.yes, step)
  if (yesNext !== null) walk(yesNext)
  const noNext = resolveTarget(node.no, step)
  if (noNext !== null) walk(noNext)
  visitingStack.delete(step)
}

if (tree.length > 0) {
  walk(tree[0].step)
  const unreached = [...stepNumbers].filter((s) => !reachedFromStep1.has(s))
  if (unreached.length > 0) {
    error(`decisionTree: step 1 から到達不能な step が存在する: ${unreached.join(", ")}`)
  }
  if (!cycleDetected && unreached.length === 0) {
    ok(`decisionTree: 全 ${tree.length} step が到達可能・閉路なし`)
  }
} else {
  error("decisionTree が空、または未定義")
}

// ─── (c) crudMatrix ───
for (const row of screenPatterns.crudMatrix ?? []) {
  if (!patternIds.has(row.pattern)) {
    error(`crudMatrix: operation="${row.operation}" situation="${row.situation}" の pattern "${row.pattern}" は未実在`)
  }
}
if ((screenPatterns.crudMatrix ?? []).every((r) => patternIds.has(r.pattern))) {
  ok(`crudMatrix: 全 ${(screenPatterns.crudMatrix ?? []).length} 件が実在パターンを参照`)
}

// ─── (d) ctaHierarchy.priority[].variant ───
const buttonVariantsSrc = readFileSync(join(ROOT, "src/lib/server-variants/button-variants.ts"), "utf8")
const variantBlockMatch = buttonVariantsSrc.match(/variant:\s*\{([\s\S]*?)\n\s*\},/)
const buttonVariants = new Set()
if (variantBlockMatch) {
  const block = variantBlockMatch[1]
  const re = /^\s*"?([a-zA-Z][a-zA-Z0-9-]*)"?:\s*\n?\s*"/gm
  let m
  while ((m = re.exec(block))) {
    buttonVariants.add(m[1])
  }
}
if (buttonVariants.size === 0) {
  error("button-variants.ts から variant 定義を抽出できなかった（cva 定義の形が変わった可能性）")
} else {
  info(`button.tsx 実在 variant: ${buttonVariants.size} 件`)
  for (const entry of composition.ctaHierarchy?.priority ?? []) {
    if (!buttonVariants.has(entry.variant)) {
      error(`composition.json: ctaHierarchy.priority に未実在 Button variant "${entry.variant}"`)
    }
  }
  if ((composition.ctaHierarchy?.priority ?? []).every((e) => buttonVariants.has(e.variant))) {
    ok(`ctaHierarchy.priority: 全 ${(composition.ctaHierarchy?.priority ?? []).length} 件が実在 variant を参照`)
  }
}

console.log("=======================================")
if (errors > 0) {
  console.log(`${RED}✗ ${errors} 件のエラー${NC}`)
  process.exit(1)
} else {
  console.log(`${GREEN}✓ 画面パターン契約は整合${NC}`)
  process.exit(0)
}
