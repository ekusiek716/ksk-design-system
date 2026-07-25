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
// =============================================================

/** `/` が除算でなく正規表現リテラルの開始になりうる直前の文字 */
const REGEX_PRECEDING = new Set([
  "", "(", ",", "=", ":", "[", "!", "&", "|", "?", "{", "}", ";", "+", "-", "*", "%", "~", "^", "<", ">", "\n",
])

/** `return /re/` のように識別子で終わっていても正規表現になるキーワード */
const REGEX_KEYWORDS = /(?:^|[^.\w$])(?:return|typeof|instanceof|in|of|new|delete|void|throw|case|do|else|yield|await)$/

function isRegexStart(prevMeaningful, emittedSoFar) {
  if (REGEX_PRECEDING.has(prevMeaningful)) return true
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
        prevMeaningful = "{"
        continue
      }
      out += c
      i++
      continue
    }

    // ── code ──
    if (c === "/" && next === "/") {
      while (i < src.length && src[i] !== "\n") { out += " "; i++ }
      continue
    }

    if (c === "/" && next === "*") {
      out += "  "
      i += 2
      while (i < src.length && !(src[i] === "*" && src[i + 1] === "/")) {
        out += blank(src[i])
        i++
      }
      out += i < src.length ? "  " : ""
      i += 2
      continue
    }

    if (c === "/" && isRegexStart(prevMeaningful, out)) {
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
      prevMeaningful = "/"
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
      prevMeaningful = quote
      continue
    }

    if (c === "`") {
      stack.push({ type: "template" })
      out += c
      i++
      prevMeaningful = "`"
      continue
    }

    if (top.interpolation && c === "{") top.braceDepth++
    if (top.interpolation && c === "}") {
      if (top.braceDepth === 0) { stack.pop(); out += c; i++; prevMeaningful = "}"; continue }
      top.braceDepth--
    }

    out += c
    if (!/\s/.test(c)) prevMeaningful = c
    else if (c === "\n") prevMeaningful = "\n"
    i++
  }

  return out
}
