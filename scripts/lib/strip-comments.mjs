// =============================================================
// TS/TSX ソースからコメントだけを空白に潰す小さなスキャナ
//
// 用途: クラス名を grep する検査（check-tailwind-v4.mjs 等）が、
// JSDoc や行コメントに書かれた「記法例」を実コードと誤検知しないようにする。
//
// 行番号・桁位置は保存する（検査が file:line を報告するため）。
// 文字列 / テンプレートリテラルの中身は残す（クラス名はそこにある）。
//
// 素朴に `/*` を探すだけでは 2 通りの壊れ方をする:
//   1. 正規表現リテラル `/[/*]/` の中の `/*` をブロックコメント開始と誤認し、
//      以降のファイル全体が空白化 → **違反を取りこぼす**（検査が静かに死ぬ）
//   2. テンプレートリテラルの `${ ... }` 内のコメントが潰れず残る → 誤検知
// どちらも state を持って読むことで防ぐ。
//
// 既知の限界: JSX テキストを独立した字句状態として扱っていないため、
// `<code>/*</code>` のように JSX 本文に `/*` が現れ、かつ後方に本物の `*/` が
// ある場合は、その区間をコメントと誤認する（終端が無い場合は素通しに倒す）。
// ここは完全な JSX レキサが要る領域で、記法統一のための検査に対しては
// 過剰なので取っていない。誤認しても壊れるのは「検査の網羅性」だけで、
// 実装の挙動には影響しない。
// =============================================================

/**
 * `/` が除算でなく正規表現リテラルの開始になりうる直前の文字。
 *
 * `<` と `>` は**入れない**。tsx では `</span>` の閉じタグが最頻出で、
 * `<` を許すと `/` を正規表現開始と誤認して行末までのコメント除去を飛ばす。
 * `a < /re/.test(b)` のような比較直後の正規表現は捨てる（JSX の方が桁違いに多い）。
 * ただし `=>` は別扱い（下の isRegexStart を参照）。
 */
const REGEX_PRECEDING = new Set([
  "", "(", ",", "=", ":", "[", "!", "&", "|", "?", "{", "}", ";", "+", "-", "*", "%", "~", "^", "\n",
])

/** `return /re/` のように識別子で終わっていても正規表現になるキーワード */
const REGEX_KEYWORDS = /(?:^|[^.\w$])(?:return|typeof|instanceof|in|of|new|delete|void|throw|case|do|else|yield|await)$/

/**
 * @param {string} prev     直前の意味のある文字
 * @param {string} prevPrev その 1 つ前の意味のある文字
 * @param {string} emittedSoFar ここまでの出力（キーワード判定用）
 */
function isRegexStart(prev, prevPrev, emittedSoFar) {
  // `() => /[/*]/` のアロー関数の式本体。`>` は JSX 閉じタグと同じ文字なので、
  // 直前が `=` のとき（＝ `=>`）だけ正規表現の開始として扱う。
  if (prev === ">") return prevPrev === "="
  if (REGEX_PRECEDING.has(prev)) return true
  return REGEX_KEYWORDS.test(emittedSoFar.trimEnd())
}

/**
 * コメントを空白（改行は保持）に置き換えた文字列を返す。
 * @param {string} src
 * @returns {string}
 */
export function stripComments(src) {
  let out = ""
  let i = 0
  // code: 通常のコード。template: テンプレートリテラル本文。
  // `${` に入るたび code を push し、対応する `}` で pop する。
  const stack = [{ type: "code", braceDepth: 0, interpolation: false }]
  let prevMeaningful = ""
  let prevPrevMeaningful = ""
  const setPrev = (ch) => {
    prevPrevMeaningful = prevMeaningful
    prevMeaningful = ch
  }

  const blank = (ch) => (ch === "\n" ? "\n" : " ")

  while (i < src.length) {
    const top = stack[stack.length - 1]
    const c = src[i]
    const next = src[i + 1]

    if (top.type === "template") {
      if (c === "\\") { out += c + (next ?? ""); i += 2; continue }
      if (c === "`") { stack.pop(); out += c; i++; continue }
      if (c === "$" && next === "{") {
        out += "${"
        i += 2
        stack.push({ type: "code", braceDepth: 0, interpolation: true })
        setPrev("{")
        continue
      }
      out += c
      i++
      continue
    }

    // ── code ──
    // 直前が `:` の `//` は行コメントとして扱わない。JSX テキスト中の URL
    // （`<span>https://example.com</span>`）を行コメント開始と誤認すると、
    // 同じ行の以降が空白化して**違反を取りこぼす**。
    // 逆に `{ a: // メモ` のようなコメントは剥がれずに残るが、そちらは
    // 誤検知（CI が落ちる）方向で、見逃しよりは気付ける。
    if (c === "/" && next === "/" && prevMeaningful !== ":") {
      while (i < src.length && src[i] !== "\n") { out += " "; i++ }
      continue
    }

    if (c === "/" && next === "*") {
      // 終端 `*/` を先に探す。見つからなければブロックコメントではない
      // （JSX テキストの `<code>/*</code>` 等）。ここで空白化してしまうと
      // 以降のファイル全体が消えて**違反を取りこぼす**ので、素通しに倒す。
      const end = src.indexOf("*/", i + 2)
      if (end === -1) {
        out += c
        i++
        setPrev(c)
        continue
      }
      out += "  "
      i += 2
      while (i < end) {
        out += blank(src[i])
        i++
      }
      out += "  "
      i = end + 2
      continue
    }

    if (c === "/" && isRegexStart(prevMeaningful, prevPrevMeaningful, out)) {
      out += c
      i++
      let inCharClass = false
      while (i < src.length) {
        const r = src[i]
        if (r === "\\") { out += r + (src[i + 1] ?? ""); i += 2; continue }
        if (r === "\n") break // 未終端。除算だった可能性が高いので打ち切る
        out += r
        i++
        if (r === "[") inCharClass = true
        else if (r === "]") inCharClass = false
        else if (r === "/" && !inCharClass) break
      }
      setPrev("/")
      continue
    }

    if (c === "'" || c === '"') {
      const quote = c
      out += c
      i++
      while (i < src.length) {
        const s = src[i]
        if (s === "\\") { out += s + (src[i + 1] ?? ""); i += 2; continue }
        out += s
        i++
        if (s === quote || s === "\n") break
      }
      setPrev(quote)
      continue
    }

    if (c === "`") {
      stack.push({ type: "template" })
      out += c
      i++
      setPrev("`")
      continue
    }

    if (top.interpolation && c === "{") top.braceDepth++
    if (top.interpolation && c === "}") {
      if (top.braceDepth === 0) { stack.pop(); out += c; i++; setPrev("}"); continue }
      top.braceDepth--
    }

    out += c
    if (!/\s/.test(c)) setPrev(c)
    else if (c === "\n") setPrev("\n")
    i++
  }

  return out
}
