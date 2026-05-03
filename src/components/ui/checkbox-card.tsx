import * as React from "react"
import { TickSquare } from "iconsax-reactjs"
import { Checkbox as CheckboxPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"

/**
 * CheckboxCardGroup / CheckboxCardItem — カード型チェックボックス
 *
 * 複数選択のカード型 UI に使用。単一選択には RadioGroup を使用。
 *
 * ### 使用例
 * ```tsx
 * <CheckboxCardGroup>
 *   <CheckboxCardItem description="月500円">ライトプラン</CheckboxCardItem>
 *   <CheckboxCardItem description="月1,000円" badge={<Badge>人気</Badge>}>
 *     スタンダードプラン
 *   </CheckboxCardItem>
 * </CheckboxCardGroup>
 * ```
 */

function CheckboxCardGroup({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="checkbox-card-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  )
}

function CheckboxCardItem({
  className,
  children,
  description,
  expandedContent,
  badge,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root> & {
  /** ラベルテキスト */
  children?: React.ReactNode
  /** 補足説明テキスト */
  description?: React.ReactNode
  /** 選択時に展開表示するコンテンツ */
  expandedContent?: React.ReactNode
  /** タグバッジ（例: "20%OFF"） */
  badge?: React.ReactNode
}) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox-card-item"
      className={cn(
        "group flex cursor-pointer gap-2 rounded-lg border-2 border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)] p-[15px] text-left outline-none transition-colors",
        expandedContent ? "flex-col items-stretch" : "items-center",
        "hover:border-[var(--Text-High-Emphasis)] hover:bg-[var(--Surface-Secondary)]",
        "data-[state=checked]:border-[var(--Object-Accent-Primary)] data-[state=checked]:bg-[var(--Surface-Primary)]",
        "focus-visible:border-[var(--Object-Accent-Primary)] focus-visible:ring-2 focus-visible:ring-[var(--Object-Accent-Primary)]/20",
        "aria-invalid:border-[var(--Border-Caution)]",
        "disabled:cursor-not-allowed disabled:border-[var(--Border-Medium-Emphasis)] disabled:bg-[var(--Surface-Secondary)]",
        "disabled:hover:border-[var(--Border-Medium-Emphasis)] disabled:hover:bg-[var(--Surface-Secondary)]",
        className
      )}
      {...props}
    >
      {/* Top row: checkbox indicator + label */}
      <span className={cn("flex items-center gap-2", expandedContent && "w-full")}>
        <span
          data-slot="checkbox-card-icon"
          className={cn(
            "flex size-5 shrink-0 items-center justify-center rounded-[5px] border-2 border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)] transition-colors",
            "group-data-[state=checked]:border-transparent group-data-[state=checked]:bg-transparent",
            "group-data-[disabled]:border-[var(--Border-Medium-Emphasis)] group-data-[disabled]:bg-[var(--Surface-Secondary)]"
          )}
        >
          <CheckboxPrimitive.Indicator className="flex items-center justify-center">
            <TickSquare
              size={24}
              variant="Bold"
              className="text-[var(--Object-Accent-Primary)]"
            />
          </CheckboxPrimitive.Indicator>
        </span>

        {(children || description || badge) && (
          <span className="flex min-w-0 flex-1 flex-col">
            {(children || badge) && (
              <span className="flex items-center gap-1.5">
                {children && (
                  <span
                    data-slot="checkbox-card-label"
                    className={cn(
                      "typo-body-lg text-[var(--Text-High-Emphasis)]",
                      "group-data-[disabled]:text-[var(--Text-Low-Emphasis)]"
                    )}
                  >
                    {children}
                  </span>
                )}
                {badge && (
                  <span data-slot="checkbox-card-badge">{badge}</span>
                )}
              </span>
            )}
            {description && (
              <span
                data-slot="checkbox-card-description"
                className={cn(
                  "typo-body-sm text-[var(--Text-Medium-Emphasis)]",
                  "group-data-[disabled]:text-[var(--Text-Low-Emphasis)]"
                )}
              >
                {description}
              </span>
            )}
          </span>
        )}
      </span>

      {/* Expanded content (visible only when checked) */}
      {expandedContent && (
        <span
          data-slot="checkbox-card-expanded"
          className="hidden border-t border-[var(--Border-Medium-Emphasis)] pt-3 group-data-[state=checked]:block"
        >
          {expandedContent}
        </span>
      )}
    </CheckboxPrimitive.Root>
  )
}

export { CheckboxCardGroup, CheckboxCardItem }
