import * as React from "react"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

function RadioGroup({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return <RadioGroupPrimitive.Root data-slot="radio-group" className={cn("grid gap-3", className)} {...props} />
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

  const control = (
    <RadioGroupPrimitive.Item
      id={itemId}
      data-slot="radio-group-item"
      className={cn(
        "aspect-square size-5 shrink-0 rounded-full border border-[var(--Border-Medium-Emphasis)]",
        "text-[var(--Brand-Primary)] cursor-pointer transition-colors",
        // 未チェック時のみ hover で枠線をアクセント色に。チェック済みは既に
        // アクセント枠なので変化なし。disabled は hover を打ち消す（誤反応防止）。
        "hover:border-[var(--Brand-Primary)]",
        "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-[var(--Border-Medium-Emphasis)]",
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
