import { cn } from "@/lib/utils"
import { SectionHeader } from "@/components/patterns/section-header"

export interface CategoryScrollItem {
  /** カテゴリ名 */
  name: string
  /** リンクURL */
  href: string
  /** サムネイル画像URL */
  imageUrl: string
}

export interface CategoryScrollProps {
  /** セクションタイトル */
  title: string
  /** 「もっと見る」リンクURL */
  moreHref?: string
  /** カテゴリリスト */
  items: CategoryScrollItem[]
  /** サムネイルサイズ (default: "md") sm=60px, md=100px, lg=120px */
  thumbnailSize?: "sm" | "md" | "lg"
  /** サムネイル形状 (default: "square") square=rounded-lg, circle=rounded-full */
  thumbnailShape?: "square" | "circle"
  /**
   * レイアウト (default: "scroll")
   * - scroll: 横スクロール1行
   * - grid: 列×行のグリッド（横スクロール）
   */
  layout?: "scroll" | "grid"
  /** グリッドの行数 (layout="grid" 時, default: 3) */
  gridRows?: number
  /** 追加クラス */
  className?: string
}

const sizeClasses = {
  sm: "size-[60px]",
  md: "size-[100px]",
  lg: "size-[120px]",
} as const

const maxWidthClasses = {
  sm: "max-w-[60px]",
  md: "max-w-[100px]",
  lg: "max-w-[120px]",
} as const

const gridAutoColsCalc = {
  sm: "calc((100vw - 32px) / 4.05)",
  md: "calc((100vw - 32px) / 3.5)",
  lg: "calc((100vw - 32px) / 3.0)",
} as const

/**
 * CategoryScroll — カテゴリスクロールセクション
 *
 * セクションタイトル + カテゴリサムネイル（画像＋ラベル）を横スクロールで表示。
 * トップページ・一覧ページのカテゴリナビゲーションに使用。
 *
 * ### 使用例
 * ```tsx
 * <CategoryScroll
 *   title="カテゴリから探す"
 *   moreHref="/categories"
 *   items={categories}
 *   thumbnailSize="md"
 *   thumbnailShape="square"
 * />
 * ```
 *
 * ### AI 向け使用ルール
 * - thumbnailShape="circle" + thumbnailSize="sm" でクイックアクセスアイコン風
 * - layout="grid" で複数行グリッド表示（本番カテゴリ準拠）
 */
function CategoryScroll({
  title,
  moreHref,
  items,
  thumbnailSize = "md",
  thumbnailShape = "square",
  layout = "scroll",
  gridRows = 3,
  className,
}: CategoryScrollProps) {
  const shapeClass = thumbnailShape === "circle" ? "rounded-full" : "rounded-lg"

  const itemEl = (item: CategoryScrollItem, gridMode?: boolean) => (
    <a
      key={item.href}
      href={item.href}
      className="group flex shrink-0 flex-col items-center gap-1.5"
    >
      <div
        className={cn(
          "shrink-0 overflow-hidden",
          gridMode ? "aspect-square w-full" : sizeClasses[thumbnailSize],
          shapeClass
        )}
      >
        <img
          src={item.imageUrl}
          alt={item.name}
          className="size-full object-cover transition-opacity group-hover:opacity-80"
          loading="lazy"
        />
      </div>
      <span
        className={cn(
          "text-center typo-label-sm text-[var(--Text-High-Emphasis)]",
          gridMode ? "w-full" : maxWidthClasses[thumbnailSize]
        )}
      >
        {item.name}
      </span>
    </a>
  )

  return (
    <section data-slot="category-scroll" className={cn("py-4", className)}>
      <SectionHeader
        title={title}
        action={
          moreHref ? (
            <a
              href={moreHref}
              className="typo-body-sm text-[var(--Text-Accent-Primary)] hover:underline shrink-0"
            >
              もっと見る
            </a>
          ) : undefined
        }
      />

      {layout === "grid" ? (
        <div className="mt-3 overflow-x-auto pl-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div
            className="grid gap-2"
            style={{
              gridTemplateRows: `repeat(${gridRows}, auto)`,
              gridAutoFlow: "column",
              gridAutoColumns: gridAutoColsCalc[thumbnailSize],
            }}
          >
            {items.map((item) => itemEl(item, true))}
          </div>
          <div className="w-4 shrink-0" aria-hidden="true" />
        </div>
      ) : (
        <div className="mt-3 flex gap-3 overflow-x-auto pl-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((item) => itemEl(item))}
          <div className="w-4 shrink-0" aria-hidden="true" />
        </div>
      )}
    </section>
  )
}

export { CategoryScroll }
