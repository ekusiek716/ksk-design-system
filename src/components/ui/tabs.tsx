import * as React from "react"
import { Tabs as TabsPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"

type TabsVariant = "default" | "pill"

// TabsList が variant を子の TabsTrigger に配るための context。
// （PillToggle は variant="pill" の Tabs として実装される）
const TabsVariantContext = React.createContext<TabsVariant>("default")

// 縦向き（orientation="vertical"）は data-orientation で並びだけを切り替える（opt-in）。
// これまでは矢印キーだけが上下に変わり、見た目は横並びのまま・パネルはタブの下だった。
// 横向き（既定）の見た目は変えない。
const VERTICAL_ROOT = "data-[orientation=vertical]:flex-row data-[orientation=vertical]:items-start"
// タブの列は Tabs の幅の半分まで。長いラベルはタブの中で折り返し、パネルを潰さない。
const VERTICAL_LIST =
  "data-[orientation=vertical]:h-auto data-[orientation=vertical]:max-w-[50%] data-[orientation=vertical]:shrink-0 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch"
const VERTICAL_TRIGGER =
  "data-[orientation=vertical]:justify-start data-[orientation=vertical]:whitespace-normal data-[orientation=vertical]:text-left"
// パネルは行の残りを取る（タブの下に回り込ませない）。
const VERTICAL_CONTENT =
  "data-[orientation=vertical]:mt-0 data-[orientation=vertical]:min-w-0 data-[orientation=vertical]:flex-1"

/**
 * Tabs — 同一コンテキスト内のビュー切り替え。
 *
 * `orientation="vertical"` で縦向き: タブの列を左（幅は Tabs の半分まで）、パネルを右に置く。
 * 設定画面など PC 幅でタブが多い・ラベルが長いときに使う。幅 390px 前後では横向き（既定）を選ぶ。
 */
function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root data-slot="tabs" className={cn("flex flex-col gap-2", VERTICAL_ROOT, className)} {...props} />
}

function TabsList({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & {
  /**
   * - "default": 角丸 lg のセグメント（パネル切替タブ）
   * - "pill": 完全な丸。フィルタ/トグル的なセグメントコントロール。
   *   PillToggle はこの variant を内部利用する。
   */
  variant?: TabsVariant
}) {
  return (
    <TabsVariantContext.Provider value={variant}>
      <TabsPrimitive.List
        data-slot="tabs-list"
        data-variant={variant}
        className={cn(
          "inline-flex w-fit max-w-full overflow-x-auto items-center gap-1 bg-[var(--Surface-Tertiary)] p-1 text-[var(--Text-Medium-Emphasis)]",
          // 高さ・角丸は product theme の公開変数を参照する（issue #364 追補）。
          // pill(44px)は Control スケール（40/48px）のどちらとも一致しないため
          // Chip の縦タッチターゲットと同じ理由（WCAG 2.5.5 相当の当たり判定）で
          // 固定値のまま据え置き、角丸だけ Button と同じ --Control-Radius を共有する。
          variant === "pill"
            ? "h-11 rounded-[var(--Control-Radius)]"
            : "h-[var(--Control-Height-Md)] rounded-[var(--Field-Radius)]",
          VERTICAL_LIST,
          className
        )}
        {...props}
      />
    </TabsVariantContext.Provider>
  )
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const variant = React.useContext(TabsVariantContext)
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      data-variant={variant}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap typo-label-sm transition-all",
        // 横 padding・角丸も product theme の公開変数を参照する（issue #364 追補）。
        variant === "pill"
          ? "relative rounded-[var(--Control-Radius)] px-[var(--Control-Padding-X-Md)] py-1.5 gap-1.5"
          : "rounded-[var(--Field-Radius)] px-[var(--Control-Padding-X-Sm)] py-1.5",
        // pill は見た目の高さ(h-9/h-8)を維持したまま、当たり判定だけをトラック全高(44px)まで
        // 透明な before 擬似要素で拡張する。本体の height は変更しない（belle-todo 事例の再発防止）。
        variant === "pill" &&
          "before:absolute before:inset-x-0 before:top-1/2 before:-translate-y-1/2 before:min-h-11 before:content-['']",
        "focus-visible:outline-hidden focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50",
        "disabled:pointer-events-none disabled:opacity-50",
        "data-[state=active]:bg-[var(--Surface-Primary)] data-[state=active]:text-[var(--Text-High-Emphasis)] data-[state=active]:shadow-sm",
        // forced-colors（Windows ハイコントラスト）では背景色・box-shadow が消え、選択中の
        // 白地（Surface-Primary + shadow-sm）が描画されず、どのタブが選択中か分からなくなる。
        // 選択中だけ OS の選択色（Highlight / HighlightText）で反転させる。通常表示には当たらない。
        "forced-colors:data-[state=active]:bg-[Highlight] forced-colors:data-[state=active]:text-[HighlightText]",
        variant === "default" && "hover:text-[var(--Text-High-Emphasis)]",
        variant === "pill" && "data-[state=inactive]:hover:text-[var(--Text-High-Emphasis)]",
        VERTICAL_TRIGGER,
        className
      )}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("mt-2 rounded-sm focus-visible:outline-hidden focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50", VERTICAL_CONTENT, className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
