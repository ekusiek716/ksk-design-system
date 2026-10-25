// lint.js と report-ignores.js が共有する「ignore コメント」まわりの小道具。
// lint.js から挙動不変で切り出したもの（issue #405）。ここを変えると
// lint の ignore 判定と report-ignores の集計が同時に変わる（両者の判定を揃えるための共有）。

/**
 * escape コメントの理由に要求する最低文字数（issue #405）。
 * 「x」「-」のような空虚な 1 文字で全ルールを恒久無効化できてしまうのを防ぐ。
 */
export const MIN_ESCAPE_REASON_LENGTH = 5

/** escape の理由として実質的な内容があるか（issue #405） */
export function isMeaningfulReason(reason) {
  const trimmed = (reason ?? "").trim().replace(/[-*/\s]+$/, "").trim()
  return trimmed.length >= MIN_ESCAPE_REASON_LENGTH
}

/** 文字数と行番号を保ったまま 1 文字を潰す（改行だけは残す） */
export function blankChar(ch) {
  return ch === "\n" || ch === "\r" ? ch : " "
}

/**
 * 文字列リテラルの**中身**だけを空白へ潰し、コメントはそのまま残す（issue #405）。
 * 文字数・行番号は元の source と完全に一致する。maskComments とはちょうど逆で、
 * 「コメントに書く前提のマーカー」を安全に探すために使う。CSS にもそのまま使える。
 */
export function maskCodeStrings(source) {
  let result = ""
  const n = source.length
  let i = 0

  while (i < n) {
    const ch = source[i]

    if (ch === "/" && source[i + 1] === "/") {
      while (i < n && source[i] !== "\n" && source[i] !== "\r") {
        result += source[i]
        i += 1
      }
      continue
    }

    if (ch === "/" && source[i + 1] === "*") {
      result += "/*"
      i += 2
      while (i < n && !(source[i] === "*" && source[i + 1] === "/")) {
        result += source[i]
        i += 1
      }
      if (i < n) {
        result += "*/"
        i += 2
      }
      continue
    }

    if (ch === "'" || ch === '"' || ch === "`") {
      result += ch
      i += 1
      while (i < n) {
        if (source[i] === "\\" && i + 1 < n) {
          result += blankChar(source[i]) + blankChar(source[i + 1])
          i += 2
          continue
        }
        if (source[i] === ch) {
          result += ch
          i += 1
          break
        }
        result += blankChar(source[i])
        i += 1
      }
      continue
    }

    result += ch
    i += 1
  }

  return result
}
