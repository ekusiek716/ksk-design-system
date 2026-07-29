/**
 * `@source inline("…")` 行の組み立てと、表現不能な候補・動的クラス名合成の判定（issue #258）
 *
 * scripts/generate-source-safelist.mjs から使う純関数群。
 * 「safelist に載せられない候補を黙って捨てる」と #258 と同型の欠落
 * （DS 内部クラスの CSS が消費側で生成されない）が静かに再発するため、
 * ここで表現可否を明示的に分類し、呼び出し側が生成失敗にできるようにする。
 */
import { stripComments } from "./strip-comments.mjs"

/**
 * Tailwind の `@source inline()` の制約:
 * - 波括弧はブレース展開として解釈される。エスケープしても
 *   `The pattern ... is not balanced.` で失敗するため表現できない（実測済み）。
 * - 文字列の引用符は `"` / `'` のどちらでもよいので、片方だけを含む候補は
 *   もう片方で囲めば表現できる。両方を含む候補は表現できない。
 */
export const UNSUPPORTED_BRACE = "brace"
export const UNSUPPORTED_BOTH_QUOTES = "both-quotes"

/**
 * 候補 1 件を分類する。
 * @returns {{ ok: true, line: string } | { ok: false, reason: string }}
 */
export function formatInlineSource(candidate) {
  if (/[{}]/.test(candidate)) {
    return { ok: false, reason: UNSUPPORTED_BRACE }
  }
  const hasDouble = candidate.includes('"')
  const hasSingle = candidate.includes("'")
  if (hasDouble && hasSingle) {
    return { ok: false, reason: UNSUPPORTED_BOTH_QUOTES }
  }
  const quote = hasDouble ? "'" : '"'
  return { ok: true, line: `@source inline(${quote}${candidate}${quote});` }
}

/**
 * 動的クラス名合成（`` `bg-${color}` `` 等）をソース全体から検出する。
 *
 * 行単位で見ると、複数行テンプレートリテラルの途中行
 * （その行にバッククォートが無い）を取りこぼす。ファイル内容全体から
 * バッククォート文字列を切り出し、その中身を検査する。
 *
 * コメントは stripComments で潰す（行番号・桁位置は保存される）ので、
 * 解説文中の記法例を誤検知しない。
 *
 * @param {string} source ソース全文
 * @param {Set<string>} prefixes DS が実際に使うユーティリティ接頭辞（`bg-` 等）
 * @returns {{ line: number, prefix: string }[]}
 */
export function findDynamicClassComposition(source, prefixes) {
  const stripped = stripComments(source)
  const violations = []
  // バッククォート文字列（改行を含みうる）。`\\[\s\S]` でエスケープを飛ばす。
  for (const literal of stripped.matchAll(/`(?:[^`\\]|\\[\s\S])*`/g)) {
    for (const hit of literal[0].matchAll(/([a-z][a-z0-9-]*-)\$\{/g)) {
      if (!prefixes.has(hit[1])) continue
      const index = literal.index + hit.index
      const line = stripped.slice(0, index).split("\n").length
      violations.push({ line, prefix: hit[1] })
    }
  }
  return violations
}

/** 表現不能な理由ごとの対処法（生成失敗時にそのまま表示する） */
export const UNSUPPORTED_HELP = {
  [UNSUPPORTED_BRACE]:
    "波括弧はブレース展開として解釈されるため safelist に載せられません。" +
    "波括弧を含まない書き方に変えるか、該当スタイルを src/styles/*.css で通常の CSS として定義してください",
  [UNSUPPORTED_BOTH_QUOTES]:
    "`\"` と `'` の両方を含むクラスは `@source inline()` の文字列に収められません。" +
    "引用符を片方だけにするか、該当スタイルを src/styles/*.css で通常の CSS として定義してください",
}
