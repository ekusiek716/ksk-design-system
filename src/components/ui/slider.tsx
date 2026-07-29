import * as React from "react"
import { Slider as SliderPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"

type SliderProps = Omit<
  React.ComponentProps<typeof SliderPrimitive.Root>,
  "aria-labelledby"
> & {
  /**
   * range スライダー（2ハンドル）のとき、外部の `<label>` 等を指す
   * `aria-labelledby` を単一の id（string）で渡すと両方の thumb に同じ id が
   * 付き、スクリーンリーダー上で2つの thumb を区別できなくなる。
   * thumb ごとに区別したい場合は id の配列（`[開始のid, 終了のid]`）を渡す
   * こと。単一 thumb のときは string のままでよい。
   */
  "aria-labelledby"?: string | string[]
}

/**
 * Slider — 数値スライダー
 *
 * Radix UI Slider ラッパー。範囲スライダー（2ハンドル）にも対応。
 *
 * ### 使用例
 * ```tsx
 * <Slider defaultValue={[50]} min={0} max={100} step={1} />
 * // range（2ハンドル）: 呼び出し側で thumb を区別できる aria-label を渡す
 * <Slider defaultValue={[20, 80]} min={0} max={100} aria-label="価格" />
 * // 外部ラベルを thumb ごとに紐付けたい場合は配列で渡す
 * <Slider defaultValue={[20, 80]} aria-labelledby={["price-min-label", "price-max-label"]} />
 * ```
 */
function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  ...props
}: SliderProps) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max]
  )

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className="relative grow overflow-hidden rounded-full bg-[var(--Surface-Tertiary)] data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className="absolute bg-[var(--Brand-Primary)] data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => {
        const isRange = _values.length > 1
        const suffix = index === 0 ? "開始" : "終了"

        // aria-labelledby が配列なら thumb ごとの id を割り当てる。
        // 単一 string の場合、range（2ハンドル）に同じ id を両方へ付けると
        // 区別できなくなるため、その場合は使わず aria-label 側の既定
        // （開始/終了サフィックス付き）にフォールバックする。単一 thumb なら
        // そのまま使える。
        const thumbLabelledby = Array.isArray(ariaLabelledby)
          ? ariaLabelledby[index]
          : isRange
            ? undefined
            : ariaLabelledby

        // role="slider" の実体はこの Thumb 側。呼び出し側が aria-label /
        // aria-labelledby を渡さない場合の既定値（axe: aria-input-field-name）。
        // range（2ハンドル）のときは常に開始/終了で区別できる名前にする
        // （thumbLabelledby がある場合はそちらが優先されるため、この
        // aria-label は labelledby 未解決時のフォールバックとして機能する）。
        const thumbLabel = ariaLabel
          ? isRange
            ? `${ariaLabel}（${suffix}）`
            : ariaLabel
          : thumbLabelledby
            ? undefined
            : isRange
              ? `スライダー（${suffix}）`
              : "スライダー"

        return (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            aria-label={thumbLabel}
            aria-labelledby={thumbLabelledby}
            className="block size-5 shrink-0 rounded-full border-2 border-[var(--Brand-Primary)] bg-[var(--Surface-Primary)] shadow-[var(--shadow-sm)] ring-[var(--Brand-Primary)]/20 transition-[color,box-shadow,transform] hover:ring-4 hover:scale-125 focus-visible:ring-4 focus-visible:outline-hidden active:scale-110 active:ring-6 active:shadow-[var(--shadow-md)] disabled:pointer-events-none disabled:opacity-50"
          />
        )
      })}
    </SliderPrimitive.Root>
  )
}

export { Slider }
