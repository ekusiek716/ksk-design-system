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
  "bg-[var(--card-surface,var(--Surface-Primary))] [&>*]:[--card-surface:initial] text-[var(--Text-High-Emphasis)] flex flex-col rounded-[var(--Radius-Surface)] ksk-squircle border border-[var(--Border-Low-Emphasis)] @container",
  {
    variants: {
      /**
       * 影の強さ（issue #689）。既定 md（従来どおり）。面の中に置くカード（Card / Section の中の
       * 入れ子）は `none` にする（composition.json の cardHierarchy）。`!shadow-none` で消さない。
       * native Card の elevation と同じ語彙（native は未指定 = 影なし）。
       */
      elevation: {
        none: "",
        sm: "shadow-[var(--shadow-sm)]",
        md: "shadow-[var(--shadow-md)]",
        lg: "shadow-[var(--shadow-lg)]",
      },
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
    defaultVariants: { variant: "default", elevation: "md" },
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
   * 無し）。ハンドラは引き続きクリックで呼ばれる。型は `HTMLElement` の MouseEventHandler にして
   * あるので、以前の `(e: React.MouseEvent<HTMLDivElement>) => …` のハンドラもそのまま渡せる
   * （実際の currentTarget は押せる面の button）。
   */
  onClick?: React.MouseEventHandler<HTMLElement>
  /** 指定するとカード全体が遷移リンクになる（issue #665）。`onClick` と併用しない */
  href?: string
  /** 押せるとき（onClick / href）に操作を止める（issue #665） */
  disabled?: boolean
  /**
   * 選択中（issue #677）。複数のカードから 1 つ（または複数）を選ぶ画面（配席の卓・プラン選択等）で使う。
   *
   * 見た目は ActionTile の selected と同じ Surface-Accent-Primary-Light の面 + Border-Accent-Primary の枠で、
   * 枠を 2px 相当に太くして色以外でも区別できるようにする。`onClick` の押せる Card では押せる面
   * （button）に `aria-pressed` を出す（トグルボタンとして読まれる）。`href` のリンクでは
   * `aria-current="true"`（一覧の中の現在の項目）として出す。押せない Card では見た目だけ変わり、
   * 開発ビルドで 1 回 warn する。
   */
  selected?: boolean
}

/** 選択中の面・枠（issue #677）。ActionTile の selected と同じトークン。ring-1 で枠を 2px 相当に太くする */
const SELECTED_CLASS =
  "border-[var(--Border-Accent-Primary)] ring-1 ring-inset ring-[var(--Border-Accent-Primary)] bg-[var(--Surface-Accent-Primary-Light)]"

/**
 * 押せる Card の CardTitle / CardDescription を押せる面の名前・説明へ結ぶための id（issue #665）。
 * 子が実際に描画されたときだけ aria-labelledby / aria-describedby を出す（存在しない id を
 * 参照しない）ため、子は mount 時に「実際に付けた id」（自前の id でも既定 id でも）を register する。
 *
 * 押せない Card は context に null を流す。これで入れ子の Card の CardTitle が外側の押せる
 * Card に登録されない（外側の名前が内側のカードの見出しになる事故を防ぐ）。
 */
type CardPressableSlot = "title" | "description"
interface CardPressableContextValue {
  titleId: string
  descriptionId: string
  register: (slot: CardPressableSlot, id: string) => () => void
}
const CardPressableContext = React.createContext<CardPressableContextValue | null>(null)

function useRegisterCardSlot(slot: CardPressableSlot, ownId: string | undefined) {
  const pressable = React.useContext(CardPressableContext)
  const id = ownId ?? (pressable ? (slot === "title" ? pressable.titleId : pressable.descriptionId) : undefined)
  React.useEffect(() => {
    if (!pressable || !id) return
    return pressable.register(slot, id)
  }, [pressable, slot, id])
  return id
}

/** 開発ビルド判定（ChipSelector と同じ形）。process が無い環境では本番扱い。 */
let warnedSelectedWithoutAction = false

const isDev = () => {
  const proc = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process
  return Boolean(proc) && proc!.env?.NODE_ENV !== "production"
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
function Card({
  className,
  variant,
  elevation,
  selected,
  onClick,
  href,
  disabled = false,
  children,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  ...props
}: CardProps) {
  const baseId = React.useId()
  const actionable = Boolean(onClick || href)
  const [slots, setSlots] = React.useState<Record<CardPressableSlot, string[]>>({ title: [], description: [] })
  // 名前なし警告の判定用（子の effect は親の effect より先に走るので、親の effect 時点で登録済み）
  const titleCountRef = React.useRef(0)
  const ids = React.useMemo<CardPressableContextValue>(
    () => ({
      titleId: `${baseId}-title`,
      descriptionId: `${baseId}-description`,
      register: (slot, id) => {
        if (slot === "title") titleCountRef.current += 1
        setSlots((prev) => ({ ...prev, [slot]: [...prev[slot], id] }))
        return () => {
          if (slot === "title") titleCountRef.current -= 1
          setSlots((prev) => ({ ...prev, [slot]: prev[slot].filter((x) => x !== id) }))
        }
      },
    }),
    [baseId]
  )

  // 押せるのに名前（aria-label / aria-labelledby / CardTitle）が無いと、名前の無いボタンになる。
  React.useEffect(() => {
    if (!actionable || ariaLabel || ariaLabelledby || titleCountRef.current > 0 || !isDev()) return
    console.warn(
      "[ksk-ds] Card: onClick / href を渡した押せる Card にアクセシブルネームがありません。CardTitle を置くか aria-label を指定してください。"
    )
  }, [actionable, ariaLabel, ariaLabelledby])

  // 押せない Card の selected は見た目だけで、読み上げに状態が伝わらない。開発ビルドで 1 回知らせる。
  React.useEffect(() => {
    if (actionable || selected === undefined || !isDev() || warnedSelectedWithoutAction) return
    warnedSelectedWithoutAction = true
    console.warn(
      "[ksk-ds] Card: selected は onClick（aria-pressed）/ href（aria-current）を渡した押せる Card でだけ状態として読み上げられます。押せない Card では見た目しか変わりません。"
    )
  }, [actionable, selected])

  if (!actionable) {
    return (
      <CardPressableContext.Provider value={null}>
        <div
          data-slot="card"
          data-variant={variant ?? "default"}
          data-selected={selected || undefined}
          className={cn(cardVariants({ variant, elevation }), selected && SELECTED_CLASS, className)}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          {...props}
        >
          {children}
        </div>
      </CardPressableContext.Provider>
    )
  }

  const overlayClassName = cn(
    "absolute inset-0 z-[1] rounded-[inherit]",
    // ring-inset: media variant の overflow-hidden でリングが切れないように内側に描く
    "focus-visible:outline-hidden focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-[var(--Focus-High-Emphasis)]/50",
    disabled ? "cursor-not-allowed" : "cursor-pointer",
  )
  const a11yProps = {
    ...(ariaLabel
      ? { "aria-label": ariaLabel }
      : ariaLabelledby
        ? { "aria-labelledby": ariaLabelledby }
        : slots.title.length > 0
          ? { "aria-labelledby": slots.title.join(" ") }
          : {}),
    ...(slots.description.length > 0 ? { "aria-describedby": slots.description.join(" ") } : {}),
  }

  return (
    <CardPressableContext.Provider value={ids}>
      <div
        data-slot="card"
        data-variant={variant ?? "default"}
        data-interactive="true"
        data-selected={selected || undefined}
        className={cn(
          cardVariants({ variant, elevation }),
          selected && SELECTED_CLASS,
          "relative",
          // CardAction は押せる面より前面に出す（別操作が overlay に吸われない・入れ子にならない）
          "[&_[data-slot=card-action]]:relative [&_[data-slot=card-action]]:z-[2]",
          // hover / 押下は押せる面（overlay）に乗ったときだけ（CardAction の操作では反応しない）。
          // ListItem と同じ Surface-Secondary の hover、StatCard と同じ 0.98 の押下。
          !disabled &&
            "transition-[background-color,scale] duration-[var(--Motion-Duration-Fast)] ease-[var(--Motion-Easing-Standard)] has-[>[data-slot=card-overlay]:active]:scale-[0.98]",
          // 選択中は面の色が選択を表すので、hover で Surface-Secondary に戻さない
          !disabled && !selected && "has-[>[data-slot=card-overlay]:hover]:bg-[var(--Surface-Secondary)]",
          disabled && "opacity-50",
          className
        )}
        {...props}
      >
        {/* 押せる面は DOM の先頭に置く: Tab 順を視覚順（カード本体 → 内側の CardAction）にする。
            absolute + z-[1] なので、DOM 順に関係なく通常フローの中身より前面に描かれる */}
        {href ? (
          <a
            href={href}
            data-slot="card-overlay"
            {...a11yProps}
            aria-disabled={disabled || undefined}
            // リンクの「選ばれている」は現在の項目として aria-current="true" で伝える（aria-pressed はボタン専用）
            aria-current={selected ? "true" : undefined}
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
            aria-pressed={selected === undefined ? undefined : selected}
            className={overlayClassName}
            onClick={onClick}
          />
        )}
        {children}
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
  const resolvedId = useRegisterCardSlot("title", id)
  return (
    <div
      data-slot="card-title"
      id={resolvedId}
      className={cn("typo-heading-lg", className)}
      {...props}
    />
  )
}

function CardDescription({ className, id, ...props }: React.ComponentProps<"div">) {
  const resolvedId = useRegisterCardSlot("description", id)
  return (
    <div
      data-slot="card-description"
      id={resolvedId}
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
