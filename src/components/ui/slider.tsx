import * as React from "react"
import { Slider as SliderPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"
import { formatKskLabel, useKskLabels } from "./ksk-labels"

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

function getDecimalCount(value: number) {
  return (String(value).split(".")[1] || "").length
}

/**
 * Slider — 数値スライダー
 *
 * Radix UI Slider ラッパー。範囲スライダー（2ハンドル）にも対応。
 *
 * 範囲スライダーの Home / End は WAI-ARIA APG の Multi-Thumb Slider に合わせ、
 * 「フォーカス中のつまみ」をそのつまみが動ける範囲の端（隣のつまみ ± `minStepsBetweenThumbs` × `step`、
 * 無ければ `min` / `max`）へ動かす。Radix の既定は先頭 / 末尾のつまみを動かしてしまうため、
 * 各つまみの keydown で横取りする（preventDefault 済みの keydown を Radix は無視する）。
 * 値の更新は onValueChange / onValueCommit に流す。つまみが 1 つのときは Radix の既定のまま。
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
  step = 1,
  minStepsBetweenThumbs = 0,
  onValueChange,
  onValueCommit,
  disabled,
  ...props
}: SliderProps) {
  const defaultLabels = useKskLabels()
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max]
  )

  // 範囲かどうかは、実際に渡された value / defaultValue 配列の長さで判定する
  // （どちらも無い <Slider /> は Radix の既定 [min] の単一つまみのまま）
  const providedLength = Array.isArray(value)
    ? value.length
    : Array.isArray(defaultValue)
      ? defaultValue.length
      : 1
  const isRange = providedLength > 1
  const isControlled = Array.isArray(value)
  // 範囲スライダーの非制御時だけ、Home / End で値を Radix へ反映するための内部 state を持つ。
  const [innerValue, setInnerValue] = React.useState<number[]>(
    Array.isArray(defaultValue) ? defaultValue : [min, max]
  )
  const currentValues = isControlled ? (value as number[]) : innerValue

  const moveThumbToEdge = (index: number, edge: "start" | "end") => {
    const gap = minStepsBetweenThumbs * step
    const target =
      edge === "start"
        ? index === 0
          ? min
          : (currentValues[index - 1] ?? min) + gap
        : index === currentValues.length - 1
          ? max
          : (currentValues[index + 1] ?? max) - gap
    const decimals = Math.max(getDecimalCount(step), getDecimalCount(gap))
    const nextValue = Number(target.toFixed(decimals))
    if (nextValue === currentValues[index]) return
    const next = currentValues.map((v, i) => (i === index ? nextValue : v))
    if (!isControlled) setInnerValue(next)
    onValueChange?.(next)
    onValueCommit?.(next)
  }

  const handleThumbKeyDown = (index: number) => (event: React.KeyboardEvent<HTMLSpanElement>) => {
    if (!isRange || disabled || (event.key !== "Home" && event.key !== "End")) return
    event.preventDefault()
    moveThumbToEdge(index, event.key === "Home" ? "start" : "end")
  }

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      step={step}
      minStepsBetweenThumbs={minStepsBetweenThumbs}
      disabled={disabled}
      // 範囲スライダーは常に値を Radix へ渡す（非制御なら内部 state で保持）。1 つまみは Radix に任せる。
      defaultValue={isRange ? undefined : defaultValue}
      value={isRange ? currentValues : value}
      onValueChange={(next) => {
        if (isRange && !isControlled) setInnerValue(next)
        onValueChange?.(next)
      }}
      onValueCommit={onValueCommit}
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
        className="relative grow overflow-hidden rounded-full bg-[var(--Surface-Slider-Track,var(--Surface-Tertiary))] data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className="absolute bg-[var(--Brand-Primary)] data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => {
        const isRange = _values.length > 1
        const suffix = index === 0 ? defaultLabels.sliderStart : defaultLabels.sliderEnd

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
            ? formatKskLabel(defaultLabels.sliderThumbPosition, { label: ariaLabel, position: suffix })
            : ariaLabel
          : thumbLabelledby
            ? undefined
            : isRange
              ? formatKskLabel(defaultLabels.sliderThumbPosition, { label: defaultLabels.sliderThumb, position: suffix })
              : defaultLabels.sliderThumb

        return (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            aria-label={thumbLabel}
            aria-labelledby={thumbLabelledby}
            onKeyDown={handleThumbKeyDown(index)}
            className="block size-5 shrink-0 rounded-full border-2 border-[var(--Brand-Primary)] bg-[var(--Surface-Primary)] shadow-[var(--shadow-sm)] hover:ring-[var(--Brand-Primary)]/20 active:ring-[var(--Brand-Primary)]/20 transition-[color,box-shadow,transform] hover:ring-4 hover:scale-125 focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--Surface-Primary)] focus-visible:outline-hidden active:scale-110 active:ring-6 active:shadow-[var(--shadow-md)] disabled:pointer-events-none disabled:opacity-50"
          />
        )
      })}
    </SliderPrimitive.Root>
  )
}

export { Slider }
