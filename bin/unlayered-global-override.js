/**
 * P053: @layer の外で、タグ / role / 汎用属性セレクタに寸法・余白・角丸・文字サイズ・outline を当てない
 *
 * 由来: belle-todo（2026-10-01）。消費側の globals.css に @layer 無しで書いた
 *   `[role="radio"] { min-height: 44〜52px }`   → DS Chip（32px）が見た目ごと膨らむ
 *   `:focus-visible { outline; border-radius: 8px }` → pill のボタンがフォーカス中だけ角ばる・
 *                                                     DS 部品でフォーカス枠が二重になる
 *   `input:focus-visible { border-radius: 16px }`    → 入力欄の角丸がフォーカス中だけ変わる
 *   `nav { padding-bottom: env(safe-area-inset-bottom) }` → 浮いたタブバーに safe-area が二重
 * がいずれも DS の見た目を壊した。CSS の仕様上、layer 外の宣言は @layer の中の宣言
 * （Tailwind / DS のユーティリティは @layer utilities）に詳細度と無関係に勝つため、
 * DS 部品の className では打ち消せない。
 *
 * 報告しないもの（誤検知を出さない方を優先）:
 * - @layer の中（base に置けば DS のユーティリティが勝つ）・@theme の中
 * - クラスで始まるセレクタ（消費側の独自クラス）、html / body / :root / *、keyframes
 * - data-slot を含むセレクタ（DS の公開 data-slot を明示的に狙う・:not([data-slot]) で外すのは意図的）
 */

const PROPS = ["min-height", "height", "padding", "border-radius", "font-size", "line-height", "outline"]
// 接尾辞 (-bottom / -left 等) は全候補に掛ける (padding-bottom / outline-offset 等)
const PROP_RE = new RegExp(String.raw`(?:^|[;{\s])((?:${PROPS.join("|")})(?:-[a-z]+)?)\s*:`)

/** コメントを同じ長さの空白に置き換える（行番号を保つ） */
function maskCssComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, (comment) => comment.replace(/[^\n]/g, " "))
}

/** セレクタ群をカンマで分ける。:is(a, button) / :not(...) / [a="b,c"] の中のカンマでは分けない */
export function splitSelectors(prelude) {
  const out = []
  let depth = 0
  let current = ""
  for (const ch of prelude) {
    if (ch === "(" || ch === "[") depth++
    else if (ch === ")" || ch === "]") depth--
    if (ch === "," && depth === 0) {
      out.push(current)
      current = ""
      continue
    }
    current += ch
  }
  out.push(current)
  return out.map((selector) => selector.trim()).filter(Boolean)
}

/** DS 部品にも当たりうるセレクタか */
export function isBroadSelector(selector) {
  if (/^(?:html|body|:root|::selection|\*)(?![\w-])/.test(selector)) return false
  if (/^\./.test(selector)) return false
  if (/^(?:\d+(?:\.\d+)?%|from|to)$/.test(selector)) return false
  if (/data-slot/.test(selector)) return false
  return true
}

/**
 * @returns {{ line: number, selector: string, property: string }[]}
 */
export function inspectUnlayeredGlobalOverrides(source) {
  const css = maskCssComments(source)
  const findings = []
  const stack = []
  let segmentStart = 0
  for (let index = 0; index < css.length; index++) {
    const ch = css[index]
    if (ch === "{") {
      const prelude = css.slice(segmentStart, index)
      const trimmed = prelude.trim()
      const kind = /^@layer\b/.test(trimmed) ? "layer" : /^@theme\b/.test(trimmed) ? "theme" : /^@/.test(trimmed) ? "at" : "rule"
      // 行番号はセレクタの先頭（前置の空白・改行を除いた位置）で数える
      const leading = prelude.length - prelude.trimStart().length
      stack.push({ kind, prelude: trimmed, bodyStart: index + 1, selectorStart: segmentStart + leading })
      segmentStart = index + 1
    } else if (ch === "}") {
      const block = stack.pop()
      if (block && block.kind === "rule") {
        const insideLayer = stack.some((entry) => entry.kind === "layer" || entry.kind === "theme")
        const body = css.slice(block.bodyStart, index)
        const match = !insideLayer && body.match(PROP_RE)
        if (match) {
          const broad = splitSelectors(block.prelude).filter(isBroadSelector)
          if (broad.length > 0) {
            const line = css.slice(0, block.selectorStart).split("\n").length
            findings.push({ line, selector: broad.join(", "), property: match[1] })
          }
        }
      }
      segmentStart = index + 1
    } else if (ch === ";" && stack.length === 0) {
      // @import / @charset 等の文
      segmentStart = index + 1
    }
  }
  return findings
}
