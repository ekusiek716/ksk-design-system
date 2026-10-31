#!/usr/bin/env node
/**
 * consumer 入口（README の `@import "tailwindcss"; @import "ksk-design-system/preset";`）で
 * safelist のクラスが実際に CSS になるかを検査する（issue #827）。
 *
 * 背景:
 *   safelist（src/styles/source-safelist.css）は Storybook 用の入口 src/index.css で
 *   「CSS が作られるクラス」だけを残して生成している。index.css にだけある @import
 *   （#827 では tw-animate-css）が定義するクラスは safelist に載るが、consumer の
 *   preset には定義が無いため、クラス名だけが列挙されて 1 行も CSS にならない。
 *   Storybook では動くのに本番で開閉アニメが消える、を生成時にも CI でも検出できなかった。
 *
 * 検査:
 *   1. safelist の全候補を consumer 入口で読み込んだ Tailwind に通し、CSS にならない候補を列挙して失敗させる。
 *   2. DS 部品の開閉アニメが頼るクラスと @keyframes が consumer 入口のビルド結果に含まれることを確かめる
 *      （safelist の生成規則が変わって候補ごと消えた場合も落とすため、1 とは別に固定する）。
 *
 * Usage:
 *   node scripts/check-preset-classes.mjs
 */
import { fileURLToPath } from "node:url"
import { buildConsumerCss, loadConsumerDesignSystem, readSafelistCandidates } from "./lib/consumer-css.mjs"

/** DS 部品（DropdownMenu / Popover / Tooltip / Accordion 等）の開閉アニメが頼るクラス */
export const REQUIRED_ANIMATION_CLASSES = [
  "animate-in",
  "animate-out",
  "fade-in-0",
  "fade-out-0",
  "zoom-in-95",
  "zoom-out-95",
  "data-[state=open]:animate-in",
  "data-[state=closed]:animate-out",
  "data-[state=open]:animate-accordion-down",
  "data-[state=closed]:animate-accordion-up",
]

/** 上のクラスが参照する @keyframes */
export const REQUIRED_KEYFRAMES = ["enter", "exit", "accordion-down", "accordion-up"]

/** safelist に載っているのに consumer 入口で CSS にならない候補 */
export async function findSafelistCandidatesWithoutCss(candidates = readSafelistCandidates()) {
  const designSystem = await loadConsumerDesignSystem()
  const compiled = designSystem.candidatesToCss(candidates)
  return candidates.filter((_, i) => compiled[i] == null)
}

/** 開閉アニメのクラスと @keyframes のうち、consumer 入口のビルド結果に無いもの */
export async function findMissingAnimationCss() {
  const designSystem = await loadConsumerDesignSystem()
  const compiled = designSystem.candidatesToCss(REQUIRED_ANIMATION_CLASSES)
  const missingClasses = REQUIRED_ANIMATION_CLASSES.filter((_, i) => compiled[i] == null)
  const css = await buildConsumerCss(REQUIRED_ANIMATION_CLASSES)
  const missingKeyframes = REQUIRED_KEYFRAMES.filter((name) => !new RegExp(`@keyframes ${name}\\s*\\{`).test(css))
  return { missingClasses, missingKeyframes }
}

async function main() {
  const candidates = readSafelistCandidates()
  if (candidates.length === 0) {
    console.error("✗ safelist から候補を読み取れませんでした（src/styles/source-safelist.css の形式を確認してください）")
    process.exit(1)
  }
  const withoutCss = await findSafelistCandidatesWithoutCss(candidates)
  const { missingClasses, missingKeyframes } = await findMissingAnimationCss()

  if (withoutCss.length > 0 || missingClasses.length > 0 || missingKeyframes.length > 0) {
    console.error("✗ consumer の preset だけでは CSS が作られないクラスがあります（issue #827）")
    for (const c of withoutCss) console.error(`  - safelist にあるが定義が無い: ${c}`)
    for (const c of missingClasses) console.error(`  - 開閉アニメのクラスが作られない: ${c}`)
    for (const k of missingKeyframes) console.error(`  - @keyframes ${k} が出力に無い`)
    console.error(
      "  対処: クラスの定義元（@utility / @theme / @keyframes を持つ CSS）を src/preset-core.css から読み込む。" +
        "src/index.css（Storybook 用）にだけ置くと consumer には届きません。",
    )
    process.exit(1)
  }
  console.log(
    `✓ safelist の ${candidates.length} 候補と開閉アニメのクラス ${REQUIRED_ANIMATION_CLASSES.length} 件は consumer の preset だけで CSS になります`,
  )
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main()
}
