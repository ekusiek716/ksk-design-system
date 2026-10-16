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
  extends Omit<React.ComponentProps<"div">, "onClick">,
    VariantProps<typeof cardVariants> {
  /**
   * 指定するとカード全体が押せるボタンになる（issue #665）。
   *
   * カード全面を覆う不可視の `<button>`（stretched link・ListItem の secondaryAction /
   * ThumbnailCard と同じ構造）を重ねる。Enter / Space で発火し、フォーカスリング・hover・
   * 押下表現を DS が持つ。名前は `aria-label`（指定時）か `CardTitle`（自動で結ぶ）、
   * 説明は `CardDescription`。
   *
   * カード内に別の操作（メニュー・削除ボタン等）を置くときは `CardAction` に入れる。
   * `CardAction` は押せる面より前面に出るので、押してもカードの onClick は発火せず、
   * button の入れ子にもならない。**それ以外の場所に置いた操作子は押せる面に覆われる。**
   *
   * 後方互換の注意: 以前は onClick が素の div に付くだけだった（role / キー操作 / フォーカス
   * 無し）。ハンドラは引き続きクリックで呼ばれる。
   */
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  /** 指定するとカード全体が遷移リンクになる（issue #665）。`onClick` と併用しない */
  href?: string
  /** 押せるとき（onClick / href）に操作を止める（issue #665） */
  disabled?: boolean
}

/**
 * 押せる Card の CardTitle / CardDescription を押せる面の名前・説明へ結ぶための id（issue #665）。
 * 子が実際に描画されたときだけ aria-labelledby / aria-describedby を出す（存在しない id を
 * 参照しない）ため、子は mount 時に register する。
 */
type CardPressableSlot = "title" | "description"
interface CardPressableContextValue {
  titleId: string
  descriptionId: string
  register: (slot: CardPressableSlot) => () => void
}
const CardPressableContext = React.createContext<CardPressableContextValue | null>(null)

function useRegisterCardSlot(slot: CardPressableSlot, ownId: string | undefined) {
  const pressable = React.useContext(CardPressableContext)
  React.useEffect(() => {
    // consumer が自前の id を付けた場合は既定 id で結べないので登録しない（aria-label を使う）
    if (!pressable || ownId) return
    return pressable.register(slot)
  }, [pressable, slot, ownId])
  return pressable
}

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
 * 押せるカード（issue #665）:
 *   `onClick` / `href` を渡すとカード全体が 1 つのボタン / リンクになる（全面を覆う不可視の
 *   button / a を重ねる stretched link）。名前は `CardTitle`、説明は `CardDescription` に自動で
 *   結ばれる（`CardTitle` が無いときは `aria-label` を渡す）。別操作は `CardAction` に置く。
 *   `<Button unstyled>` にカード風の枠・角丸・影を被せて自作しない。
 *
 *   ```tsx
 *   <Card onClick={() => open(task.id)}>
 *     <CardHeader>
 *       <CardTitle><s>{task.title}</s></CardTitle>
 *       <CardAction><KebabMenu … /></CardAction>
 *     </CardHeader>
 *     <CardDescription>期限 10/20・担当 ふたり</CardDescription>
 *   </Card>
 *   ```
 *
 * Note: 商品の表示は `ProductCard`（patterns/commerce）を使う。
 */
function Card({ className, variant, onClick, href, disabled = false, children, ...props }: CardProps) {
  const baseId = React.useId()
  const actionable = Boolean(onClick || href)
  const [slots, setSlots] = React.useState({ title: 0, description: 0 })
  const ids = React.useMemo<CardPressableContextValue>(
    () => ({
      titleId: `${baseId}-title`,
      descriptionId: `${baseId}-description`,
      register: (slot) => {
        setSlots((prev) => ({ ...prev, [slot]: prev[slot] + 1 }))
        return () => setSlots((prev) => ({ ...prev, [slot]: prev[slot] - 1 }))
      },
    }),
    [baseId]
  )

  if (!actionable) {
    return (
      <div
        data-slot="card"
        data-variant={variant ?? "default"}
        className={cn(cardVariants({ variant }), className)}
        {...props}
      >
        {children}
      </div>
    )
  }

  const { "aria-label": ariaLabel, ...rootProps } = props
  const overlayClassName = cn(
    "absolute inset-0 z-[1] rounded-[inherit]",
    // ring-inset: media variant の overflow-hidden でリングが切れないように内側に描く
    "focus-visible:outline-hidden focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-[var(--Focus-High-Emphasis)]/50",
    disabled ? "cursor-not-allowed" : "cursor-pointer",
  )
  const a11yProps = {
    ...(ariaLabel
      ? { "aria-label": ariaLabel }
      : slots.title > 0
        ? { "aria-labelledby": ids.titleId }
        : {}),
    ...(slots.description > 0 ? { "aria-describedby": ids.descriptionId } : {}),
  }

  return (
    <CardPressableContext.Provider value={ids}>
      <div
        data-slot="card"
        data-variant={variant ?? "default"}
        data-interactive="true"
        className={cn(
          cardVariants({ variant }),
          "relative",
          // CardAction は押せる面より前面に出す（別操作が overlay に吸われない・入れ子にならない）
          "[&_[data-slot=card-action]]:relative [&_[data-slot=card-action]]:z-[2]",
          // hover / 押下は押せる面（overlay）に乗ったときだけ（CardAction の操作では反応しない）。
          // ListItem と同じ Surface-Secondary の hover、StatCard と同じ 0.98 の押下。
          !disabled &&
            "transition-[background-color,scale] duration-[var(--Motion-Duration-Fast)] ease-[var(--Motion-Easing-Standard)] has-[>[data-slot=card-overlay]:hover]:bg-[var(--Surface-Secondary)] has-[>[data-slot=card-overlay]:active]:scale-[0.98]",
          disabled && "opacity-50",
          className
        )}
        {...rootProps}
      >
        {children}
        {href ? (
          <a
            href={href}
            data-slot="card-overlay"
            {...a11yProps}
            aria-disabled={disabled || undefined}
            className={overlayClassName}
            onClick={(event) => {
              if (disabled) event.preventDefault()
            }}
          />
        ) : (
          <button
            type="button"
            data-slot="card-overlay"
            {...a11yProps}
            disabled={disabled}
            className={overlayClassName}
            onClick={onClick}
          />
        )}
      </div>
    </CardPressableContext.Provider>
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

function CardTitle({ className, id, ...props }: React.ComponentProps<"div">) {
  const pressable = useRegisterCardSlot("title", id)
  return (
    <div
      data-slot="card-title"
      id={id ?? pressable?.titleId}
      className={cn("typo-heading-lg", className)}
      {...props}
    />
  )
}

function CardDescription({ className, id, ...props }: React.ComponentProps<"div">) {
  const pressable = useRegisterCardSlot("description", id)
  return (
    <div
      data-slot="card-description"
      id={id ?? pressable?.descriptionId}
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
