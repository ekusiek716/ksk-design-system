import * as React from "react"
import { Label as LabelPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"

interface LabelProps extends React.ComponentProps<typeof LabelPrimitive.Root> {
  /**
   * 視覚クラスを一切出さず、Radix Label の挙動（クリックで対象コントロールへ
   * フォーカス移動等）だけを提供する（issue #420 の続き・#443）。
   *
   * `typo-label-md`（letter-spacing 0.52px / line-height）と
   * `text-[var(--Text-High-Emphasis)]`、`peer-disabled:cursor-not-allowed
   * peer-disabled:opacity-50` を含め、**視覚クラスは全て出力されない**。
   *
   * 既存の手書き CSS ラベル（font-size / font-weight / color は宣言するが
   * letter-spacing / line-height は未宣言）を DS の Label に置き換えると、
   * typo-label-md の字間・行高だけが素通りして文字幅が広がる事例
   * （aikoibito web 実測 +4.1%）が想定ユースケース。
   */
  unstyled?: boolean
}

function Label({
  className,
  unstyled = false,
  ...props
}: LabelProps) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={
        unstyled
          ? className
          : cn(
              "typo-label-md text-[var(--Text-High-Emphasis)] peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
              className
            )
      }
      {...props}
    />
  )
}

export { Label }
export type { LabelProps }
