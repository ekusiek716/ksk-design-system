import * as React from "react"
import { cn } from "@/lib/utils"
import { isImeComposing } from "@/lib/ime"

interface TagInputProps {
  value?: string[]
  onChange?: (tags: string[]) => void
  placeholder?: string
  disabled?: boolean
  /** 最大タグ数 */
  max?: number
  /** 重複タグを許可するか */
  allowDuplicates?: boolean
  className?: string
  /**
   * タグ入力フィールドの aria-label。
   * i18n 対応: 英語では "Add tag" を渡す。
   *
   * `id`（`<label htmlFor>` / `FormField htmlFor` で結ぶ）か `aria-labelledby` を渡したときは
   * 既定では aria-label を付けない（付けると label より優先され、見出しが名前にならない）。
   * @default "タグ入力"（id / aria-labelledby が無いとき）
   */
  inputLabel?: string
  /**
   * 内部の `<input>` の id（issue #693）。`<FormField htmlFor={id}>` / `<Label htmlFor>` と結ぶ。
   */
  id?: string
  /** 内部の `<input>` の name（issue #693） */
  name?: string
  /** 内部の `<input>` に付ける aria-labelledby（issue #693） */
  "aria-labelledby"?: string
  /**
   * 内部の `<input>` に付ける aria-describedby（issue #693）。
   * `FormField` の子に置くと説明・エラーの id が自動で渡る。
   */
  "aria-describedby"?: string
  /** 内部の `<input>` に付ける aria-invalid。`FormField error` の子に置くと自動で true になる（issue #693） */
  "aria-invalid"?: boolean | "true" | "false"
}

/** 開発ビルド判定（Card / ChipSelector と同じ形）。process が無い環境では本番扱い。 */
const isDev = () => {
  const proc = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process
  return Boolean(proc) && proc!.env?.NODE_ENV !== "production"
}
let warnedMissingLabel = false

function TagInput({
  value = [],
  onChange,
  placeholder = "タグを入力して Enter",
  disabled = false,
  max,
  allowDuplicates = false,
  className,
  inputLabel,
  id,
  name,
  "aria-labelledby": ariaLabelledby,
  "aria-describedby": ariaDescribedby,
  "aria-invalid": ariaInvalid,
}: TagInputProps) {
  // label（id 経由）/ aria-labelledby で名前が付くときは、明示されない限り aria-label を出さない。
  // id だけ渡して実際には <label for={id}> が無い場合に無名の入力欄にならないよう、マウント後に
  // label の有無を確かめ、無ければ既定の aria-label に戻す（開発ビルドでは 1 回 warn）。
  // 判定は input の ref コールバックで行う（commit 時点で兄弟の label も DOM にある。id 等が変わると
  // コールバックの identity が変わり React が再度呼ぶ）。effect 内の同期 setState を避けるため。
  const [labelMissing, setLabelMissing] = React.useState(false)
  const attachInput = React.useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node
      if (!node) return
      if (!id || ariaLabelledby || inputLabel !== undefined) {
        setLabelMissing(false)
        return
      }
      const root = node.getRootNode() as Document | ShadowRoot
      const escaped = typeof CSS !== "undefined" && CSS.escape ? CSS.escape(id) : id
      const found = Boolean(root.querySelector?.(`label[for="${escaped}"]`)) || Boolean(node.closest("label"))
      setLabelMissing(!found)
      if (!found && isDev() && !warnedMissingLabel) {
        warnedMissingLabel = true
        console.warn(
          `[ksk-ds] TagInput: id="${id}" に対応する <label for> が見つかりません。FormField htmlFor で結ぶか inputLabel / aria-labelledby を渡してください（既定の aria-label「タグ入力」で補っています）。`
        )
      }
    },
    [id, ariaLabelledby, inputLabel]
  )
  const resolvedInputLabel =
    inputLabel ?? (ariaLabelledby || (id && !labelMissing) ? undefined : "タグ入力")
  const [input, setInput] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)
  const skipBlurRef = React.useRef(false)

  const addTag = React.useCallback(
    (raw: string) => {
      const tag = raw.trim()
      if (!tag) return
      if (!allowDuplicates && value.includes(tag)) return
      if (max !== undefined && value.length >= max) return
      onChange?.([...value, tag])
      setInput("")
    },
    [value, onChange, allowDuplicates, max]
  )

  const removeTag = React.useCallback(
    (index: number) => {
      onChange?.(value.filter((_, i) => i !== index))
    },
    [value, onChange]
  )

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // IME 変換中の Enter は「変換の確定」であってタグ追加ではない。
    // ガードしないと未確定文字がタグ化され、以降の変換操作が失われる（issue #301）。
    // 読点「、」入力で発火する `,` も同様。Backspace は変換中に押されても
    // input が空でなければ何もしないため、ガード対象外。
    if (isImeComposing(e)) return
    if (e.key === "Enter") {
      e.preventDefault()
      skipBlurRef.current = true
      addTag(input)
    }
    if (e.key === "Backspace" && input === "" && value.length > 0) {
      removeTag(value.length - 1)
    }
    if (e.key === ",") {
      e.preventDefault()
      addTag(input)
    }
  }

  // 枠内クリックで実 <input>（下記）へフォーカスを移すだけの補助操作。
  // 主操作は input 自体が担い、キーボードユーザーは Tab で input へ
  // 直接到達できるため代替経路が別にある。
  return (
    // ksk-ds-lint-ignore P024 -- 上記の通り input への focus 移譲のみの補助操作
    <div
      data-slot="tag-input"
      className={cn(
        "flex flex-wrap gap-1.5 min-h-12 w-full rounded-lg border border-[var(--Border-Control,var(--Border-Medium-Emphasis))] bg-[var(--Surface-Primary)] px-3 py-2 transition-colors",
        "focus-within:ring-[3px] focus-within:ring-[var(--Focus-High-Emphasis)]/50 focus-within:border-[var(--Border-Accent-Primary)]",
        // aria-invalid は内側の input に付くため、枠（外側）はその状態を :has で拾う（Input と同じ Caution 枠）
        "has-[input[aria-invalid=true]]:border-[var(--Border-Caution)]",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
      onClick={() => inputRef.current?.focus()}
    >
      {value.map((tag, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1 h-7 px-2.5 rounded-full bg-[var(--Brand-Ultra-Light)] text-[var(--Text-Accent-Primary)] typo-label-sm"
        >
          {tag}
          {!disabled && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeTag(i) }}
              className="flex items-center justify-center w-3.5 h-3.5 rounded-full hover:bg-[var(--Brand-Light)] transition-colors"
              aria-label={`${tag} を削除`}
            >
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <path d="M1 1l6 6M7 1L1 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </span>
      ))}
      <input
        ref={attachInput}
        id={id}
        name={name}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          if (skipBlurRef.current) { skipBlurRef.current = false; return }
          if (input.trim()) addTag(input)
        }}
        disabled={disabled || (max !== undefined && value.length >= max)}
        placeholder={value.length === 0 ? placeholder : ""}
        className="flex-1 min-w-24 bg-transparent focus-visible:outline-hidden typo-body-md text-[var(--Text-High-Emphasis)] placeholder:text-[var(--Text-Low-Emphasis)] disabled:cursor-not-allowed"
        aria-label={resolvedInputLabel}
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
        aria-invalid={ariaInvalid}
      />
    </div>
  )
}

export { TagInput }
export type { TagInputProps }
