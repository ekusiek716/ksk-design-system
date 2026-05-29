import { cn } from "@/lib/utils"

export interface CategoryNavItem {
  /** カテゴリ名 */
  name: string
  /** リンクURL */
  href?: string
  /** アイコン画像URL */
  imageUrl: string
  /** アイコンの代替テキスト */
  imageAlt?: string
  /** 選択中フラグ */
  isSelected?: boolean
  /** クリックハンドラ */
  onClick?: () => void
}

export interface CategoryNavProps {
  /** カテゴリリスト */
  items: CategoryNavItem[]
  /** 追加クラス */
  className?: string
}

/**
 * CategoryIconStrip — カテゴリアイコンフィルター行
 *
 * 商品一覧・検索結果ページ上部に設置するコンパクトなカテゴリフィルター。
 * 小さな円アイコン（40px）＋ラベルを横スクロールで並べる。
 *
 * CategoryScroll との違い:
 * - セクションタイトルなし（フィルターとして使用）
 * - アイコンが小さい（40px）
 * - isSelected で選択状態を持てる
 *
 * ### 使用例
 * ```tsx
 * <CategoryIconStrip
 *   items={[
 *     { name: "バースデー", imageUrl: "/cat1.jpg", isSelected: true, onClick: () => setFilter("birthday") },
 *     { name: "記念日", imageUrl: "/cat2.jpg", onClick: () => setFilter("anniversary") },
 *   ]}
 * />
 * ```
 */
function CategoryNav({ items, className }: CategoryNavProps) {
  return (
    <div
      data-slot="category-nav"
      className={cn(
        "flex gap-3 overflow-x-auto px-4 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className
      )}
    >
      {items.map((item, i) => {
        const isInteractive = !!item.href || !!item.onClick

        if (item.href) {
          return (
            <a
              key={i}
              href={item.href}
              className={cn(
                "flex shrink-0 flex-col items-center gap-1 rounded-lg p-1 transition-colors",
                isInteractive && "hover:bg-[var(--Surface-Secondary)]",
                item.isSelected && "bg-[var(--Surface-Accent-Primary-Light)]"
              )}
            >
              <div
                className={cn(
                  "size-10 overflow-hidden rounded-full border",
                  item.isSelected
                    ? "border-[var(--Brand-Primary)]"
                    : "border-[var(--Border-Low-Emphasis)]"
                )}
              >
                <img
                  src={item.imageUrl}
                  alt={item.imageAlt ?? item.name}
                  className="size-full object-cover"
                  loading="lazy"
                />
              </div>
              <span
                className={cn(
                  "w-14 text-center typo-body-xs leading-tight line-clamp-2",
                  item.isSelected
                    ? "text-[var(--Text-Accent-Primary)]"
                    : "text-[var(--Text-High-Emphasis)]"
                )}
              >
                {item.name}
              </span>
            </a>
          )
        }

        return (
          <button
            key={i}
            type="button"
            onClick={item.onClick}
            className={cn(
              "flex shrink-0 flex-col items-center gap-1 rounded-lg p-1 transition-colors",
              isInteractive && "hover:bg-[var(--Surface-Secondary)]",
              item.isSelected && "bg-[var(--Surface-Accent-Primary-Light)]"
            )}
          >
            <div
              className={cn(
                "size-10 overflow-hidden rounded-full border",
                item.isSelected
                  ? "border-[var(--Brand-Primary)]"
                  : "border-[var(--Border-Low-Emphasis)]"
              )}
            >
              <img
                src={item.imageUrl}
                alt={item.imageAlt ?? item.name}
                className="size-full object-cover"
                loading="lazy"
              />
            </div>
            <span
              className={cn(
                "w-14 text-center typo-body-xs leading-tight line-clamp-2",
                item.isSelected
                  ? "text-[var(--Text-Accent-Primary)]"
                  : "text-[var(--Text-High-Emphasis)]"
              )}
            >
              {item.name}
            </span>
          </button>
        )
      })}
      <div className="w-2 shrink-0" aria-hidden="true" />
    </div>
  )
}

export { CategoryNav }
