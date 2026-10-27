import * as React from "react"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

export type RadioGroupVariant = "default" | "card"
const RadioGroupVariantContext = React.createContext<RadioGroupVariant>("default")

/** card はラベルを左、装飾の丸印を右に置いた、行全体を押せる単一選択。 */
function RadioGroup({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root> & { variant?: RadioGroupVariant }) {
  return (
    <RadioGroupVariantContext.Provider value={variant}>
      <RadioGroupPrimitive.Root data-slot="radio-group" data-variant={variant} className={cn("grid", variant === "card" ? "gap-2" : "gap-3", className)} {...props} />
    </RadioGroupVariantContext.Provider>
  )
}

/**
 * RadioGroupItem — ラジオ 1 項目
 *
 * 2 つの使い方:
 * 1. **素のラジオ** — `children` を渡さない場合は円のみ描画。外側で
 *    `<Label>` と組み合わせる従来の使い方（後方互換）。
 * 2. **ラベル内包** — `children`（＋任意の `description`）を渡すと、
 *    CheckboxGroupItem と同じ「ラジオ + ラベル」の行型レイアウトで描画。
 *    ```tsx
 *    <RadioGroup defaultValue="s">
 *      <RadioGroupItem value="s">Small</RadioGroupItem>
 *      <RadioGroupItem value="m" description="標準サイズ">Medium</RadioGroupItem>
 *    </RadioGroup>
 *    ```
 */
function RadioGroupItem({
  className,
  children,
  description,
  id,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item> & {
  description?: React.ReactNode
}) {
  const generatedId = React.useId()
  const itemId = id ?? generatedId
  const variant = React.useContext(RadioGroupVariantContext)

  // 既存の丸だけの用法は card 親でも維持する。card 行には children のラベルを渡す。
  if (variant === "card" && children != null) {
    const labelId = `${itemId}-label`
    const descriptionId = description != null ? `${itemId}-description` : undefined
    return (
      <RadioGroupPrimitive.Item
        id={itemId}
        data-slot="radio-group-card"
        {...props}
        aria-labelledby={props["aria-labelledby"] ?? (props["aria-label"] == null ? labelId : undefined)}
        aria-describedby={props["aria-describedby"] ?? descriptionId}
        className={cn(
          "group flex w-full min-h-[max(44px,var(--Control-Height-Lg))] items-center gap-[var(--Control-Gap)] rounded-[var(--Radius-Surface)] border border-[var(--Surface-Secondary)] bg-[var(--Surface-Secondary)] px-[var(--Control-Padding-X-Md)] py-3 text-left text-[var(--Text-High-Emphasis)]",
          "cursor-pointer transition-colors duration-[var(--Motion-Duration-Fast)] ease-[var(--Motion-Easing-Standard)] hover:bg-[var(--Surface-Tertiary)]",
          "focus-visible:outline-hidden focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--Surface-Primary)]",
          "data-[state=checked]:border-[var(--Brand-Primary)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[var(--Surface-Secondary)]",
          className,
        )}
      >
        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span id={labelId} className="typo-body-md text-[var(--Text-High-Emphasis)]">{children}</span>
          {description != null && <span id={descriptionId} className="typo-body-sm text-[var(--Text-Medium-Emphasis)]">{description}</span>}
        </span>
        <span aria-hidden="true" className="flex size-5 shrink-0 items-center justify-center rounded-full border border-[var(--Border-Control,var(--Border-Medium-Emphasis))] text-[var(--Brand-Primary)] group-data-[state=checked]:border-[var(--Brand-Primary)]">
          <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
            <span className="size-2 rounded-full bg-[var(--Brand-Primary)]" />
          </RadioGroupPrimitive.Indicator>
        </span>
      </RadioGroupPrimitive.Item>
    )
  }

  const control = (
    <RadioGroupPrimitive.Item
      id={itemId}
      data-slot="radio-group-item"
      className={cn(
        "relative aspect-square size-5 shrink-0 rounded-full border border-[var(--Border-Control,var(--Border-Medium-Emphasis))]",
        "text-[var(--Brand-Primary)] cursor-pointer transition-colors",
        // 見た目の円は 20px のまま、当たり判定だけを透明な before 擬似要素で 44px に広げる
        // （Chip / pill TabsTrigger と同じ手法）。本体の width/height は変えないので
        // レイアウトに影響しない。消費側で `[role="radio"] { min-height: 44px }` のような
        // グローバル上書きを足すと円が縦長に潰れるため禁止（issue #470）。
        "before:absolute before:left-1/2 before:top-1/2 before:size-11 before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']",
        // 未チェック時のみ hover で枠線をアクセント色に。チェック済みは既に
        // アクセント枠なので変化なし。disabled は hover を打ち消す（誤反応防止）。
        "hover:border-[var(--Brand-Primary)]",
        "focus-visible:outline-hidden focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]",
        // 選択中の枠が Brand-Primary で、リング（Brand-600）と同色になるため枠から 2px 離す
        "focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--Surface-Primary)]",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-[var(--Border-Control,var(--Border-Medium-Emphasis))]",
        "data-[state=checked]:border-[var(--Brand-Primary)]",
        // ラベル内包時は複数行テキストとの頭揃えのため少し下げる
        (children != null || description != null) && "mt-0.5",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <svg width="10" height="10" viewBox="0 0 10 10">
          <circle cx="5" cy="5" r="5" fill="currentColor" />
        </svg>
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )

  // 後方互換: children も description も無ければ従来通り円のみ返す
  if (children == null && description == null) {
    return control
  }

  return (
    <div
      data-slot="radio-group-item-row"
      data-disabled={props.disabled || undefined}
      className="group flex items-start gap-2"
    >
      {control}
      <div className="flex flex-col gap-0.5 group-data-[disabled]:opacity-50">
        {children != null && (
          <Label
            htmlFor={itemId}
            className="typo-body-md cursor-pointer group-data-[disabled]:cursor-not-allowed"
          >
            {children}
          </Label>
        )}
        {description != null && (
          <span className="typo-body-sm text-[var(--Text-Medium-Emphasis)]">
            {description}
          </span>
        )}
      </div>
    </div>
  )
}

export { RadioGroup, RadioGroupItem }
