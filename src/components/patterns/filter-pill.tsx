import * as React from "react"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

/** ピルの高さ。行内に並べる密度に合わせて選ぶ。 */
type FilterPillSize = "sm" | "md"

interface FilterPillProps {
  /** ピルに表示するラベル（例: "エリア"）。 */
  label: string
  /**
   * 適用中の値の表示テキスト。指定すると `ラベル: 値` 形式で表示し、
   * ピルが適用中（Brand 配色）になる。未指定 = 未適用。
   *
   * 「適用中かどうか」の正本はこの prop（`active` を別に持たない）。
   * 値の整形（複数選択の "渋谷 他2件" 等）は呼び出し側の責務。
   */
  value?: string
  /**
   * 適用中の値をクリアする操作。渡した場合のみ、適用中のピル内に
   * クリアボタン（×）が表示される。
   *
   * クリアボタンは Popover トリガーの**入れ子ではなく兄弟**として配置される
   * （button の入れ子は不正な HTML になるため。ListItem の secondaryAction と同じ構造）。
   * 押しても Popover は開かない。
   */
  onClear?: () => void
  /** クリアボタンの aria-label。既定は `{label}をクリア`。 */
  clearLabel?: string
  /**
   * Popover の中身。フィルタ UI は自由スロット（チェックリスト・スライダー・
   * カレンダー等、任意の ReactNode を置ける）。
   *
   * 閉じる操作は Popover 側（Esc / 外側クリック）に任せるか、
   * `open` / `onOpenChange` で制御する。
   */
  children: React.ReactNode
  /** Popover の開閉（制御モード）。未指定なら内部 state。 */
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** Popover の初期開閉（非制御モード）。 */
  defaultOpen?: boolean
  /**
   * Popover パネル（role="dialog"）の accessible name。
   * 既定は `{label}のフィルタ`。パネル内に見出しがある場合はそれと揃える。
   */
  panelLabel?: string
  /** Popover の寄せ。既定は `start`（トリガーの左端揃え）。 */
  align?: "start" | "center" | "end"
  /** Popover パネルに渡す className（幅の上書き等）。 */
  contentClassName?: string
  /**
   * ラベルの左に出すアイコン（iconsax の size=16 相当を想定）。
   * 装飾なので aria-hidden で描画される。
   */
  icon?: React.ReactNode
  size?: FilterPillSize
  disabled?: boolean
  className?: string
}

const SIZE_CLASS: Record<FilterPillSize, string> = {
  sm: "h-[var(--Control-Height-Sm)] typo-label-xs",
  md: "h-[var(--Control-Height-Sm)] sm:h-[var(--Control-Height-Md)] typo-label-sm",
}

/**
 * FilterPill — 任意コンテンツの Popover を開くフィルタピル。適用中は
 * ピル内にクリアボタンを持つ。
 *
 * 使い分け:
 * - `FilterChip`: 押すたびに on/off が切り替わるだけの単純トグル。パネルを持たない。
 * - `DropdownFilter`: 選択肢が「単一選択のリスト」に収まるとき。
 * - `FilterPill`: パネルの中身が任意（複数選択・範囲スライダー・日付など）で、
 *   適用中の値を明示的にクリアさせたいとき。
 *
 * 構造:
 *   ルートは `<div>`（ピルの面）で、その中に Popover トリガーの `<button>` と
 *   クリアの `<button>` を**兄弟**として置く。トリガー内部にクリアを入れると
 *   button の入れ子になり不正な HTML になるため（ListItem の secondaryAction と同じ方針）。
 *
 * a11y:
 *   トリガーは `aria-expanded` / `aria-haspopup="dialog"` を部品側で持つ。
 *   クリアボタンには常に `aria-label`（既定 `{label}をクリア`）が付く。
 *   タップ領域は sm でも 32px 高 + 44px 幅相当の padding を確保する。
 *
 * @example
 * <FilterPill label="エリア" value={area ?? undefined} onClear={() => setArea(null)}>
 *   <CheckboxGroup ... />
 * </FilterPill>
 */
function FilterPill({
  label,
  value,
  onClear,
  clearLabel,
  children,
  open,
  onOpenChange,
  defaultOpen,
  panelLabel,
  align = "start",
  contentClassName,
  icon,
  size = "md",
  disabled = false,
  className,
}: FilterPillProps) {
  const isActive = value != null && value !== ""
  const showClear = isActive && Boolean(onClear)

  return (
    <div
      data-slot="filter-pill"
      data-active={isActive || undefined}
      className={cn(
        "inline-flex shrink-0 items-center rounded-full border border-[var(--Border-Low-Emphasis)] transition-colors duration-[var(--Motion-Duration-Base)]",
        isActive
          ? "border-[var(--Brand-Primary)] bg-[var(--Brand-Primary)] text-[var(--Text-on-Inverse)]"
          : "border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] text-[var(--Text-Medium-Emphasis)]",
        disabled && "cursor-not-allowed opacity-50",
        SIZE_CLASS[size],
        className,
      )}
    >
      <Popover open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            aria-haspopup="dialog"
            className={cn(
              "flex h-full min-w-0 flex-1 items-center gap-1.5 rounded-full pl-4",
              // 文脈非依存: 親の継承に頼らずボタン自身が文字色を明示する
              isActive
                ? "text-[var(--Text-on-Inverse)]"
                : "text-[var(--Text-Medium-Emphasis)]",
              showClear ? "pr-1.5" : "pr-4",
              "cursor-pointer focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50",
              "disabled:cursor-not-allowed disabled:pointer-events-none",
            )}
          >
            {icon && (
              <span aria-hidden="true" className="shrink-0 inline-flex">
                {icon}
              </span>
            )}
            <span className="truncate">{isActive ? `${label}: ${value}` : label}</span>
            <ChevronDownIcon />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align={align}
          aria-label={panelLabel ?? `${label}のフィルタ`}
          className={cn("w-72", contentClassName)}
        >
          {children}
        </PopoverContent>
      </Popover>
      {showClear && (
        <button
          type="button"
          disabled={disabled}
          aria-label={clearLabel ?? `${label}をクリア`}
          onClick={(event) => {
            event.stopPropagation()
            onClear?.()
          }}
          className={cn(
            // クリアは isActive のときだけ表示されるため、文字色は on-Inverse を明示
            "mr-1 flex size-7 shrink-0 items-center justify-center rounded-full text-[var(--Text-on-Inverse)]",
            "cursor-pointer transition-colors duration-[var(--Motion-Duration-Fast)]",
            "hover:bg-[var(--Text-on-Inverse)]/20",
            "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50",
            "disabled:cursor-not-allowed disabled:pointer-events-none",
          )}
        >
          <CloseIcon />
        </button>
      )}
    </div>
  )
}

function ChevronDownIcon() {
  return (
    <svg aria-hidden className="size-3 shrink-0" viewBox="0 0 12 12" fill="none">
      <path
        d="M3 4.5L6 7.5L9 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg aria-hidden className="size-3" viewBox="0 0 12 12" fill="none">
      <path
        d="M3 3L9 9M9 3L3 9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export { FilterPill }
export type { FilterPillProps, FilterPillSize }
