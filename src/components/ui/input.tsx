import * as React from "react"
import { cn } from "@/lib/utils"
import { useValueLength } from "@/lib/use-value-length"
import { UNSTYLED_FOCUS_RING } from "@/lib/server-variants/unstyled"

interface InputProps extends Omit<React.ComponentProps<"input">, "prefix"> {
  /**
   * 入力フィールド左側の装飾。テキスト・アイコン・単位記号など。
   * 例: "¥", "@", <SearchIcon />
   */
  startAdornment?: React.ReactNode
  /**
   * 入力フィールド右側の装飾。テキスト・アイコン・ボタンなど。
   * 例: "%", "kg", クリアボタン, パスワード表示ボタン
   * インタラクティブ要素（ボタン等）を渡す場合はこちら（pointer-events 有効）。
   */
  endAdornment?: React.ReactNode
  /**
   * 文字数カウンタを表示する。maxLength とセットで使うと
   * 右下に「現在/max」を表示し、上限到達時は caution 色になる。
   * controlled / uncontrolled と IME 入力の両方に追従する。
   */
  showCount?: boolean
  /**
   * 視覚クラスを一切出さず、挙動と a11y だけを提供する（issue #420）。
   *
   * `h-* / w-full / border-* / bg-* / px-* / typo-* / placeholder:*` などの
   * 寸法・枠・背景・タイポ系クラスを出力しない。維持されるのは
   * showCount の文字数カウント（controlled / uncontrolled / IME 追従）、
   * adornment のレイアウト土台、そして a11y のための focus-visible ring。
   *
   * adornment を併用した場合、ラッパー div の `relative flex items-center` と
   * 装飾側の `absolute / inset-y-0 / left-3 / right-3` は **機能の土台**なので
   * 残す（外すと装飾の絶対配置が別の祖先を基準にして壊れる）。ただし
   * ラッパーの `w-full` と装飾側の `typo-body-md` / 文字色は出さない。
   * input 側の `pl-9` / `pr-9` は装飾と重ならないための同じ機能の一部なので残す
   * （手書き CSS が padding を宣言していれば非レイヤー側が勝つ）。
   *
   * showCount のカウンタ自体は手書き CSS が知らない DS 固有の追加 DOM なので、
   * `w-full` を除き DS の見た目のままにする。
   */
  unstyled?: boolean
}

// 高さ・横 padding・角丸は product theme の公開変数（`--Field-*`）を参照する。
// 既定値は従来の h-12 / px-3 / rounded-lg と同値（issue #364）。
const inputBaseClass = [
  "flex h-[var(--Field-Height-Md)] w-full rounded-[var(--Field-Radius)] border border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)] px-[var(--Field-Padding-X-Md)] typo-body-md text-[var(--Text-High-Emphasis)] transition-colors",
  "file:border-0 file:bg-transparent file:typo-body-md",
  "placeholder:text-[var(--Text-Low-Emphasis)]",
  "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50 focus-visible:border-[var(--Border-Accent-Primary)]",
  "disabled:cursor-not-allowed disabled:opacity-50",
  "aria-invalid:border-[var(--Border-Caution)] aria-invalid:ring-[var(--Caution-Base)]/20",
].join(" ")

function Input({
  className,
  type,
  startAdornment,
  endAdornment,
  showCount,
  unstyled = false,
  maxLength,
  value,
  defaultValue,
  onChange,
  onCompositionStart,
  onCompositionEnd,
  ref,
  ...props
}: InputProps) {
  const {
    ref: countRef,
    length,
    syncFromDom,
    beginComposition,
    endComposition,
  } = useValueLength<HTMLInputElement>({
    enabled: showCount === true,
    value,
    defaultValue,
    forwardedRef: ref,
  })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    syncFromDom()
    onChange?.(event)
  }

  const input = (
    <input
      type={type}
      data-slot="input"
      ref={countRef}
      value={value}
      defaultValue={defaultValue}
      maxLength={maxLength}
      onChange={showCount ? handleChange : onChange}
      onCompositionStart={(event) => {
        beginComposition()
        onCompositionStart?.(event)
      }}
      onCompositionEnd={(event) => {
        endComposition()
        onCompositionEnd?.(event)
      }}
      className={cn(
        unstyled ? UNSTYLED_FOCUS_RING : inputBaseClass,
        startAdornment && "pl-9",
        endAdornment && "pr-9",
        className,
      )}
      {...props}
    />
  )

  const control =
    startAdornment || endAdornment ? (
      <div
        data-slot="input-group"
        className={
          unstyled
            ? "relative flex items-center"
            : "relative flex w-full items-center"
        }
      >
        {startAdornment && (
          <div
            className={
              unstyled
                ? "pointer-events-none absolute left-3 inset-y-0 flex items-center select-none"
                : "pointer-events-none absolute left-3 inset-y-0 flex items-center text-[var(--Text-Low-Emphasis)] typo-body-md select-none"
            }
          >
            {startAdornment}
          </div>
        )}
        {input}
        {endAdornment && (
          <div
            className={
              unstyled
                ? "absolute right-3 inset-y-0 flex items-center"
                : "absolute right-3 inset-y-0 flex items-center text-[var(--Text-Low-Emphasis)] typo-body-md"
            }
          >
            {endAdornment}
          </div>
        )}
      </div>
    ) : (
      input
    )

  if (!showCount) return control

  const atLimit = maxLength != null && length >= maxLength

  return (
    <div data-slot="input-with-count" className={unstyled ? undefined : "w-full"}>
      {control}
      <div className="mt-1 flex justify-end">
        <span
          data-slot="input-count"
          className={cn(
            "typo-caption tabular-nums",
            atLimit
              ? "text-[var(--Text-Caution)]"
              : "text-[var(--Text-Low-Emphasis)]",
          )}
        >
          {length}
          {maxLength != null ? `/${maxLength}` : ""}
        </span>
      </div>
    </div>
  )
}

export { Input }
export type { InputProps }
