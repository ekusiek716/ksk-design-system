import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// 背景は `--card-surface` が宣言されていればそれを、無ければ従来どおり
// `--Surface-Primary` を使う。地を描く側（Section / 各シェルのルート等）が
// `--card-surface` を宣言すると、その配下の Card が**指定なしで**地から
// 浮く色に切り替わる。伝播は CSS カスタムプロパティのカスケードのみで、
// React context を使わないので Server Component のまま使え、DS の Card 以外
// （consumer 自前の <article> 等）には一切影響しない。
// 明示指定（className の bg-*）は tailwind-merge で後勝ちのまま。
//
// `[&>*]:[--card-surface:initial]` は**入れ子カードの潰れ防止**。
// カスタムプロパティはそのまま継承されるので、これが無いと外側の Card と
// 内側の Card が同じ色になり、せっかく作った境界がまた消える。
// 自分自身ではなく直下の子で `initial`（＝ guaranteed-invalid）に戻すことで、
// 「自分の背景は継承値を使い、子孫はフォールバックに戻す」を両立する
// （同じ要素で再宣言すると自分の背景まで巻き戻ってしまう）。
const cardVariants = cva(
  "bg-[var(--card-surface,var(--Surface-Primary))] [&>*]:[--card-surface:initial] text-[var(--Text-High-Emphasis)] flex flex-col rounded-[var(--Radius-Surface)] ksk-squircle border border-[var(--Border-Low-Emphasis)] shadow-[var(--shadow-md)] @container",
  {
    variants: {
      variant: {
        /** 既定: 内側に p-6 と gap-6 相当（情報を持つカード向け）。
         *  実値は product theme の公開変数 `--Product-Card-Padding` / `--Product-Card-Gap`
         *  で、既定値は従来の p-6 / gap-6 と同値（issue #364）。 */
        default: "gap-[var(--Product-Card-Gap)] p-[var(--Product-Card-Padding)]",
        /** メディアカード: padding/gap なし。サムネ等を端まで広げる用途。
         *  オーバーレイで title/badge を絶対配置するときに p-6 が邪魔だったケースに。 */
        media: "gap-0 p-0 overflow-hidden",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

interface CardProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof cardVariants> {}

/**
 * Card — 情報をまとめる汎用カード。
 *
 * バリアント:
 * - `default`: `p-6` + `gap-6`。情報を持つカード（テキスト / ボタン構成）。
 * - `media`: padding/gap なし。サムネを端まで広げる用途。オーバーレイ配置時に。
 *
 * 構成パーツ: `CardHeader` / `CardTitle` / `CardDescription` / `CardAction` /
 *   `CardContent` / `CardFooter`。`@container` クエリで内部レスポンシブ。
 *
 * 地と同色になるとき（`--card-surface`）:
 *   Card の既定背景は `--Surface-Primary`。`AppShell` / `MarketingShell` の
 *   ルートも同じ `--Surface-Primary` なので、その直下に置いた Card は
 *   **地と完全に同色**になり、区切りは罫線（+ light では 8% の shadow）だけになる。
 *   地を描く側が `--card-surface` を宣言すると、配下の Card が指定なしで
 *   その色に切り替わる。カード 1 枚ずつ prop を付けて回る方式と違い、
 *   あとからカードを足したときの付け忘れが起きない。
 *
 *   ```tsx
 *   <div className="bg-[var(--Surface-Primary)] [--card-surface:var(--Surface-Secondary)]">
 *     <Card>…</Card>  // 指定なしで Surface-Secondary になる
 *   </div>
 *   ```
 *
 *   例外的に地に馴染ませたいときは `className="bg-[var(--Surface-Primary)]"` で
 *   上書きする（tailwind-merge で後勝ち）。
 *
 *   入れ子カードは `--card-surface` を引き継がない（Card の直下で `initial` に
 *   戻す）。外側が宣言色・内側が既定色になるので階層が潰れない。
 *   `contracts/composition.json` の cardHierarchy どおり内側を一段沈めたい
 *   場合は、内側を包む要素で `[--card-surface:var(--Surface-Tertiary)]` を宣言する。
 *
 * Note: 商品の表示は `ProductCard`（patterns/commerce）を使う。
 */
function Card({ className, variant, ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      data-variant={variant ?? "default"}
      className={cn(cardVariants({ variant }), className)}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "flex flex-col gap-1.5 @sm:flex-row @sm:items-center",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("typo-heading-lg", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("typo-body-sm text-[var(--Text-Medium-Emphasis)]", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn("@sm:ml-auto", className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="card-content" className={cn("", className)} {...props} />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  )
}

export { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter, cardVariants }
export type { CardProps }
