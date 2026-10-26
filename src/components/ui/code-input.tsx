import * as React from "react"
import { cn } from "@/lib/utils"
import { inputBaseClass } from "./input"
import { formatKskLabel, useKskLabels } from "./ksk-labels"

/**
 * 1 文字として受け付ける文字種（issue #669）。
 * - `"numeric"`: 0-9（既定）。数字キーボード（inputMode="numeric"）を出す
 * - `"alphanumeric"`: 0-9 / A-Z / a-z
 * - `RegExp`: 1 文字ずつ test する（例: `/[0-9A-F]/i`）
 */
type CodeInputPattern = "numeric" | "alphanumeric" | RegExp

/**
 * 見た目（issue #669）。
 * - `"cells"`（既定）: 桁ごとのセル。OTP（4〜8 桁）向け
 * - `"single"`: 1 つの入力欄を等幅・大きめ・字間広めで表示。24 桁の招待コードのような長いコード向け
 */
type CodeInputVariant = "cells" | "single"

interface CodeInputProps {
  /** 桁数（コードの長さ）。`single` では maxLength になる */
  length: number
  /** 入力中のコード（controlled）。左詰めの文字列 */
  value?: string
  /** 初期値（uncontrolled） */
  defaultValue?: string
  /** 入力が変わるたびに、受け付けた文字だけを左詰めにした文字列で呼ばれる */
  onChange?: (value: string) => void
  /** 全桁がそろった瞬間に 1 回呼ばれる（例: そのまま検証 API を呼ぶ） */
  onComplete?: (value: string) => void
  /** 受け付ける文字種。@default "numeric" */
  pattern?: CodeInputPattern
  /** 英字を大文字にそろえる（招待コード等）。@default false */
  uppercase?: boolean
  /** @default "cells" */
  variant?: CodeInputVariant
  autoFocus?: boolean
  disabled?: boolean
  /** エラー表示。各入力に aria-invalid を付け、枠を Caution 色にする */
  invalid?: boolean
  /** フォーム送信用の name（cells では hidden input に値を入れる） */
  name?: string
  /** 先頭の入力（single では入力そのもの）の id。`<Label htmlFor>` と結ぶときに使う */
  id?: string
  /** グループ（single では入力）のアクセシブルネーム。見出しがあるなら aria-labelledby を使う */
  "aria-label"?: string
  "aria-labelledby"?: string
  "aria-describedby"?: string
  /**
   * 各セルの読み上げ名（cells のみ）。省略時は KskLabelsProvider の `codeInputCell`
   * （`{index}`（1 始まり）/ `{length}` を置換。Provider 無しは `${index + 1}桁目（全${length}桁）`、locale="en" で `Digit N of M`）。
   */
  cellLabel?: (index: number, length: number) => string
  /**
   * 入力欄の autocomplete（issue #669 レビュー）。
   * 既定は `cells` が先頭セルに `"one-time-code"`（SMS / メールの認証コード自動入力）、
   * `single` は付けない（招待コード等にワンタイムコードの候補を出さないため）。
   * single で OTP を受けるなら `autoComplete="one-time-code"` を渡す。
   */
  autoComplete?: React.InputHTMLAttributes<HTMLInputElement>["autoComplete"]
  /** `single` の placeholder（例: "A1B2C3…"） */
  placeholder?: string
  /** ルート（cells ではセル列の div、single では input）に付く className */
  className?: string
}

/**
 * 開発ビルド判定（ChipSelector と同じ形）。process が無い環境では本番扱いにする。
 */
const isDev = () => {
  const proc = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process
  return Boolean(proc) && proc!.env?.NODE_ENV !== "production"
}


function acceptsChar(char: string, pattern: CodeInputPattern) {
  if (pattern === "numeric") return /^[0-9]$/.test(char)
  if (pattern === "alphanumeric") return /^[0-9A-Za-z]$/.test(char)
  // g / y フラグ付きの RegExp は lastIndex を持ち回って結果が揺れるので、毎回新しく作る
  return new RegExp(pattern.source, pattern.flags.replace(/[gy]/g, "")).test(char)
}

/** 受け付けない文字（空白・ハイフン等）を落とし、必要なら大文字化する */
function sanitize(raw: string, pattern: CodeInputPattern, uppercase: boolean) {
  const chars = Array.from(uppercase ? raw.toUpperCase() : raw)
  return chars.filter((c) => acceptsChar(c, pattern)).join("")
}

// セルは Input と同じ枠・背景・フォーカス・エラー表現（inputBaseClass の --Field-* / Border-Control
// トークン）を使い、幅と文字の置き方だけを変える。桁数が多くても行からはみ出さないよう
// flex-1 で縮み、上限は高さと同じ（正方形）。
const cellClass =
  "w-auto min-w-0 flex-1 max-w-[var(--Field-Height-Md)] px-0 text-center typo-heading-lg tabular-nums"

/**
 * CodeInput — 認証コード（OTP）・招待コードのような固定桁のコード入力（issue #669）。
 *
 * - 貼り付けで全桁が埋まる（空白・ハイフン等は自動で落とす）。Backspace で前の桁へ戻り、
 *   ← → / Home / End で桁を移動する
 * - `autocomplete="one-time-code"` と `inputMode`（numeric なら数字キーボード）を設定するので、
 *   iOS / Android の SMS コード自動入力がそのまま全桁に入る
 * - a11y: グループに名前（aria-label / aria-labelledby）、各セルに「n 桁目」の名前、
 *   invalid で aria-invalid
 * - 24 桁のような長いコードは `variant="single"`（等幅・大きめ・字間広めの 1 入力）
 *
 * ```tsx
 * <CodeInput length={6} value={code} onChange={setCode} onComplete={verify} aria-label="認証コード" />
 * <CodeInput variant="single" length={24} pattern="alphanumeric" uppercase value={invite} onChange={setInvite} aria-labelledby="invite-label" />
 * ```
 *
 * Input に `typo-heading-2xl tracking-wider` 等を被せてコード欄を自作しない。
 */
function CodeInput({
  length,
  value: valueProp,
  defaultValue = "",
  onChange,
  onComplete,
  pattern = "numeric",
  uppercase = false,
  variant = "cells",
  autoFocus,
  disabled = false,
  invalid = false,
  name,
  id,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  "aria-describedby": ariaDescribedby,
  cellLabel: cellLabelProp,
  autoComplete,
  placeholder,
  className,
}: CodeInputProps) {
  const defaultLabels = useKskLabels()
  const cellLabel =
    cellLabelProp ??
    ((index: number, length: number) =>
      formatKskLabel(defaultLabels.codeInputCell, { index: index + 1, length }))
  const isControlled = valueProp !== undefined
  const [innerValue, setInnerValue] = React.useState(() =>
    sanitize(defaultValue, pattern, uppercase).slice(0, length)
  )
  const value = (isControlled ? valueProp : innerValue).slice(0, length)
  const cellsRef = React.useRef<Array<HTMLInputElement | null>>([])
  const inputMode = pattern === "numeric" ? "numeric" : "text"

  const commit = (next: string) => {
    const clipped = next.slice(0, length)
    if (clipped === value) return
    if (!isControlled) setInnerValue(clipped)
    onChange?.(clipped)
    if (clipped.length === length) onComplete?.(clipped)
  }

  const focusCell = (index: number) => {
    const target = cellsRef.current[Math.max(0, Math.min(index, length - 1))]
    target?.focus()
    target?.select()
  }

  // cells のグループ（role="group"）は名前が無いと「グループ」としか読まれない。
  // ChipSelector と同じく、名前なしは開発ビルドで 1 回だけ警告する。
  const isUnnamedGroup = variant === "cells" && !ariaLabel && !ariaLabelledby
  React.useEffect(() => {
    if (!isUnnamedGroup || !isDev()) return
    console.warn(
      '[ksk-ds] CodeInput: variant="cells"（role="group"）にはアクセシブルネームが必要です。見出しの id を aria-labelledby に渡すか、aria-label を指定してください。'
    )
  }, [isUnnamedGroup])

  if (variant === "single") {
    return (
      <input
        data-slot="code-input"
        data-variant="single"
        id={id}
        name={name}
        type="text"
        value={value}
        // maxLength は付けない。付けるとハイフン・空白入りの貼り付け（"ABCD-EFGH-…"）が
        // ブラウザで先に切り詰められて桁が欠ける。長さは sanitize 後の slice（commit）で揃える。
        onChange={(event) => commit(sanitize(event.target.value, pattern, uppercase))}
        autoComplete={autoComplete}
        inputMode={inputMode}
        autoCapitalize={uppercase ? "characters" : "off"}
        autoCorrect="off"
        spellCheck={false}
        autoFocus={autoFocus}
        disabled={disabled}
        placeholder={placeholder}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
        aria-invalid={invalid || undefined}
        className={cn(
          inputBaseClass,
          "text-center font-mono typo-heading-lg tracking-wider tabular-nums",
          className
        )}
      />
    )
  }

  const handleCellChange = (index: number, raw: string) => {
    // 1 セルに複数文字が入るのは、SMS 自動入力・IME・高速入力のとき。
    // 既存の 1 文字（選択済み）を置き換えたうえで、残りを後ろの桁へ流し込む。
    const typed = sanitize(raw, pattern, uppercase)
    if (!raw) {
      // Android の仮想キーボードは Backspace を keydown で送らない（key="Unidentified"）ので、
      // 空になった change を削除として扱う
      commit(value.slice(0, index) + value.slice(index + 1))
      return
    }
    if (!typed) return
    const existing = value[index]
    const incoming = existing && typed.length > 1 && typed.startsWith(existing) ? typed.slice(1) : typed
    const start = Math.min(index, value.length)
    const next = (value.slice(0, start) + incoming + value.slice(start + incoming.length)).slice(0, length)
    commit(next)
    focusCell(start + incoming.length)
  }

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case "Backspace": {
        event.preventDefault()
        if (value[index]) {
          commit(value.slice(0, index) + value.slice(index + 1))
          focusCell(index)
        } else if (index > 0) {
          commit(value.slice(0, index - 1) + value.slice(index))
          focusCell(index - 1)
        }
        return
      }
      case "Delete": {
        event.preventDefault()
        commit(value.slice(0, index) + value.slice(index + 1))
        return
      }
      case "ArrowLeft":
        event.preventDefault()
        focusCell(index - 1)
        return
      case "ArrowRight":
        event.preventDefault()
        focusCell(Math.min(index + 1, value.length))
        return
      case "Home":
        event.preventDefault()
        focusCell(0)
        return
      case "End":
        event.preventDefault()
        focusCell(value.length)
        return
    }
  }

  const handlePaste = (index: number, event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()
    const pasted = sanitize(event.clipboardData.getData("text"), pattern, uppercase)
    if (!pasted) return
    // 全桁ぶん貼られたらどのセルからでも先頭から入れ替える（コードをまるごと貼る使い方）
    const start = pasted.length >= length ? 0 : Math.min(index, value.length)
    const next = (value.slice(0, start) + pasted + value.slice(start + pasted.length)).slice(0, length)
    commit(next)
    focusCell(start + pasted.length)
  }

  // roving tabindex: Tab で止まるのは「次に入力すべきセル」1 つだけ（全桁入力済みなら最後のセル）。
  // 値は常に左詰めなので、それより後ろの空セルはタブ順から外す。セル間の移動は ← → / Home / End。
  // こうすると Tab / Shift+Tab で CodeInput をそのまま抜けられる（WCAG 2.1.2 のキーボードトラップを作らない）。
  const activeIndex = Math.min(value.length, length - 1)

  return (
    <div
      data-slot="code-input"
      data-variant="cells"
      role="group"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-describedby={ariaDescribedby}
      className={cn("flex w-full gap-2", className)}
    >
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(node) => {
            cellsRef.current[index] = node
          }}
          data-slot="code-input-cell"
          id={index === 0 ? id : undefined}
          type="text"
          value={value[index] ?? ""}
          onChange={(event) => handleCellChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={(event) => handlePaste(index, event)}
          tabIndex={index === activeIndex ? 0 : -1}
          // 先の空セルをタップ / クリックしたときだけ、次に入力すべきセルへ寄せる
          // （値は左詰めなので後ろの桁には入れられない）。focus イベントで寄せると
          // キーボードのフォーカス移動まで奪ってトラップになるため、ポインタ操作に限る。
          onMouseDown={(event) => {
            if (index > value.length) {
              event.preventDefault()
              focusCell(value.length)
            }
          }}
          onFocus={(event) => event.currentTarget.select()}
          // SMS 自動入力は先頭セルに全桁が届く。2 桁目以降は候補を出さない
          autoComplete={index === 0 ? (autoComplete ?? "one-time-code") : "off"}
          inputMode={inputMode}
          autoCapitalize={uppercase ? "characters" : "off"}
          autoCorrect="off"
          spellCheck={false}
          autoFocus={autoFocus && index === 0}
          disabled={disabled}
          aria-label={cellLabel(index, length)}
          aria-invalid={invalid || undefined}
          className={cn(inputBaseClass, cellClass)}
        />
      ))}
      {name && <input type="hidden" name={name} value={value} />}
    </div>
  )
}

export { CodeInput }
export type { CodeInputProps, CodeInputPattern, CodeInputVariant }
