// =============================================================
// KSK Design System — 仕様パネル用の軽量 Markdown レンダラ
//
// `<slug>.spec.md`（Notion の PRD 等を貼り付けたもの）を表示するための
// 最小実装。依存を増やさない方針のため react-markdown は使わず、
// 見出し / リスト / 引用 / コード / 段落 + インライン（**bold** / `code` /
// [link](url)）だけを React 要素へ変換する。表や画像など高度な記法は非対応。
// =============================================================
import { type ReactNode } from "react"

const HEADING_CLASS: Record<number, string> = {
  1: "typo-heading-lg",
  2: "typo-heading-md",
  3: "typo-heading-sm",
  4: "typo-label-md",
}

const INLINE_RE = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g

/** **bold** / `code` / [link](url) をインライン要素へ変換 */
function renderInline(text: string): ReactNode[] {
  const out: ReactNode[] = []
  let last = 0
  let key = 0
  let m: RegExpExecArray | null
  INLINE_RE.lastIndex = 0
  while ((m = INLINE_RE.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index))
    const tok = m[0]
    if (tok.startsWith("**")) {
      out.push(
        <strong key={key++} className="text-[var(--Text-High-Emphasis)]">
          {tok.slice(2, -2)}
        </strong>,
      )
    } else if (tok.startsWith("`")) {
      out.push(
        <code
          key={key++}
          className="typo-label-sm rounded bg-[var(--Surface-Tertiary)] px-1 py-0.5 text-[var(--Text-High-Emphasis)]"
        >
          {tok.slice(1, -1)}
        </code>,
      )
    } else {
      const lm = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(tok)
      const label = lm?.[1] ?? tok
      const url = lm?.[2] ?? "#"
      const external = /^https?:\/\//.test(url)
      out.push(
        <a
          key={key++}
          href={url}
          target={external ? "_blank" : undefined}
          rel={external ? "noreferrer" : undefined}
          className="text-[var(--Text-Accent-Primary)] hover:underline"
        >
          {label}
        </a>,
      )
    }
    last = m.index + tok.length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

function isBlockStart(line: string): boolean {
  return (
    /^(#{1,4})\s+/.test(line) ||
    /^\s*[-*]\s+/.test(line) ||
    /^\s*\d+\.\s+/.test(line) ||
    /^\s*>\s?/.test(line) ||
    /^\s*```/.test(line) ||
    /^(-{3,}|\*{3,})$/.test(line.trim())
  )
}

/** 軽量 Markdown レンダラ。対応記法はファイル冒頭コメント参照。 */
function Markdown({ source }: { source: string }) {
  const lines = source.replace(/\r\n/g, "\n").split("\n")
  const blocks: ReactNode[] = []
  let i = 0
  let key = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.trim() === "") {
      i++
      continue
    }

    // フェンスコードブロック ```
    if (line.trim().startsWith("```")) {
      const buf: string[] = []
      i++
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        buf.push(lines[i])
        i++
      }
      i++ // 閉じフェンスを飛ばす
      blocks.push(
        <pre
          key={key++}
          className="my-3 overflow-x-auto rounded-lg bg-[var(--Surface-Inverse)] p-3 typo-label-sm text-[var(--Text-on-Inverse)]"
        >
          <code>{buf.join("\n")}</code>
        </pre>,
      )
      continue
    }

    // 水平線
    if (/^(-{3,}|\*{3,})$/.test(line.trim())) {
      blocks.push(<hr key={key++} className="my-4 border-[var(--Border-Low-Emphasis)]" />)
      i++
      continue
    }

    // 見出し
    const h = /^(#{1,4})\s+(.*)$/.exec(line)
    if (h) {
      const level = h[1].length
      blocks.push(
        <p
          key={key++}
          className={`${HEADING_CLASS[level]} mt-4 mb-2 text-[var(--Text-High-Emphasis)] first:mt-0`}
        >
          {renderInline(h[2])}
        </p>,
      )
      i++
      continue
    }

    // 箇条書き
    if (/^\s*[-*]\s+/.test(line)) {
      const items: ReactNode[] = []
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(<li key={items.length}>{renderInline(lines[i].replace(/^\s*[-*]\s+/, ""))}</li>)
        i++
      }
      blocks.push(
        <ul
          key={key++}
          className="my-2 ml-5 list-disc space-y-1 typo-body-sm text-[var(--Text-Medium-Emphasis)]"
        >
          {items}
        </ul>,
      )
      continue
    }

    // 番号付きリスト
    if (/^\s*\d+\.\s+/.test(line)) {
      const items: ReactNode[] = []
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(<li key={items.length}>{renderInline(lines[i].replace(/^\s*\d+\.\s+/, ""))}</li>)
        i++
      }
      blocks.push(
        <ol
          key={key++}
          className="my-2 ml-5 list-decimal space-y-1 typo-body-sm text-[var(--Text-Medium-Emphasis)]"
        >
          {items}
        </ol>,
      )
      continue
    }

    // 引用
    if (/^\s*>\s?/.test(line)) {
      const buf: string[] = []
      while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
        buf.push(lines[i].replace(/^\s*>\s?/, ""))
        i++
      }
      blocks.push(
        <blockquote
          key={key++}
          className="my-3 border-l-2 border-[var(--Border-Medium-Emphasis)] pl-3 typo-body-sm text-[var(--Text-Medium-Emphasis)]"
        >
          {renderInline(buf.join(" "))}
        </blockquote>,
      )
      continue
    }

    // 段落（空行 or 次のブロック開始まで結合）
    const buf: string[] = []
    while (i < lines.length && lines[i].trim() !== "" && !isBlockStart(lines[i])) {
      buf.push(lines[i])
      i++
    }
    blocks.push(
      <p key={key++} className="my-2 typo-body-sm text-[var(--Text-Medium-Emphasis)]">
        {renderInline(buf.join(" "))}
      </p>,
    )
  }

  return <div className="text-[var(--Text-Medium-Emphasis)]">{blocks}</div>
}

export { Markdown }
