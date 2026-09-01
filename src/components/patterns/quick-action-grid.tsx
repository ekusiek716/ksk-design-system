import * as React from "react"
// iconsax の `Check` は「小切手（checkbook）」のアイコンで、チェックマークではない。
// 選択済みの印には TickSquare（チェックボックス）を使う。
import { TickSquare } from "iconsax-reactjs"
import { cn } from "@/lib/utils"
import { useComposedRef } from "@/lib/compose-ref"
import { IconBadge } from "@/components/ui/icon-badge"
import { Spinner } from "@/components/ui/spinner"

type ActionTileVariant = "neutral" | "selected" | "success" | "info" | "caution"
type QuickActionGridColumns = 2 | 3 | 4 | "auto"
type QuickActionGridGap = "sm" | "md"
/**
 * タイル群の選択意味論（issue #318）。
 * - `"single"`: 排他選択。grid が `role="radiogroup"`、タイルが `role="radio"` + `aria-checked`
 * - `"multiple"`: 複数選択。タイルは `aria-pressed`（トグルボタン）
 *
 * 未指定は「選択の集合ではない（クイックアクションの起動ボタン）」扱いで、
 * 従来どおり grid は role を持たず、タイルは `aria-pressed` のみを出す。
 */
type QuickActionGridSelectionMode = "single" | "multiple"

/** grid → tile へ選択意味論を渡す。grid 外で使った ActionTile は null を受ける（＝従来挙動）。 */
const QuickActionGridSelectionContext = React.createContext<QuickActionGridSelectionMode | null>(null)

/**
 * 開発ビルド判定。DS は node の型を持たないので globalThis 経由で参照する。
 * `proc` の存在を先に必須にする（error-boundary と同じ形）。省略して
 * `proc?.env?.NODE_ENV !== "production"` と書くと、process 自体が無い環境
 * （バンドラが NODE_ENV を静的置換しない素のブラウザ配布など）で undefined
 * との比較が true になり、本番でも警告が出続ける。
 */
const isDev = () => {
  const proc = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process
  return Boolean(proc) && proc!.env?.NODE_ENV !== "production"
}

interface ActionTileProps extends Omit<React.ComponentProps<"button">, "children"> {
  icon?: React.ReactNode
  emoji?: React.ReactNode
  label: React.ReactNode
  description?: React.ReactNode
  /** カード下段の右端に置く補足情報(例:「所要5分」「要解放」)。選択インジケータには使わない — `indicator` を使う。 */
  meta?: React.ReactNode
  /**
   * 選択状態などを示す小さな表示。**ラベル行の右端**(loading 時に Spinner が入る位置)に置かれる。
   * 省略時、選択状態なら DS 標準のチェックを表示する。表示自体を消したい場合の口は用意していない
   * (選択を色だけで伝えると WCAG 1.4.1 に反するため)。
   */
  indicator?: React.ReactNode
  selected?: boolean
  loading?: boolean
  variant?: ActionTileVariant
  /**
   * 選択意味論を明示する（issue #318）。通常は親 `QuickActionGrid` の `selectionMode` から
   * 受け取るので指定不要。指定した場合は親より優先される（grid 外の単体使用や、
   * 1 つの grid に意味の違うタイルが混ざる場合の逃げ道）。
   */
  selectionMode?: QuickActionGridSelectionMode
}

interface QuickActionGridProps extends React.ComponentProps<"div"> {
  columns?: QuickActionGridColumns
  gap?: QuickActionGridGap
  /**
   * 配下 `ActionTile` の選択意味論（issue #318）。
   * - 未指定（既定）: 起動ボタンの集まりとして扱う。grid は role を持たず、タイルは `aria-pressed`
   * - `"single"`: `role="radiogroup"` + `role="radio"`。矢印キー移動と roving tabindex が有効になる
   * - `"multiple"`: タイルは `aria-pressed`（トグルボタンであることを明示的に選んだ状態）
   */
  selectionMode?: QuickActionGridSelectionMode
}

const actionTileVariants: Record<ActionTileVariant, string> = {
  neutral: "border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] text-[var(--Text-High-Emphasis)]",
  selected: "border-[var(--Brand-Primary)] bg-[var(--Surface-Accent-Primary-Light)] text-[var(--Text-High-Emphasis)]",
  success: "border-[var(--Success-Base)] bg-[var(--Surface-Success-Subtle)] text-[var(--Text-High-Emphasis)]",
  info: "border-[var(--Info-Base)] bg-[var(--Surface-Info-Subtle)] text-[var(--Text-High-Emphasis)]",
  caution: "border-[var(--Caution-Base)] bg-[var(--Surface-Caution-Subtle)] text-[var(--Text-High-Emphasis)]",
}

const gridColumns: Record<QuickActionGridColumns, string> = {
  2: "grid-cols-2",
  3: "grid-cols-2 sm:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-4",
  auto: "grid-cols-[repeat(auto-fit,minmax(8rem,1fr))]",
}

function ActionTile({
  className,
  icon,
  emoji,
  label,
  description,
  meta,
  indicator,
  selected = false,
  loading = false,
  variant = selected ? "selected" : "neutral",
  disabled,
  type,
  selectionMode,
  ...props
}: ActionTileProps) {
  const contextSelectionMode = React.useContext(QuickActionGridSelectionContext)
  // 明示 prop > 親 grid > 未指定（従来挙動）
  const mode = selectionMode ?? contextSelectionMode
  const isDisabled = disabled || loading
  const isSelected = selected || variant === "selected"
  const isRadio = mode === "single"
  const hasIndicator = indicator !== undefined && indicator !== null && indicator !== false
  // 下段（description / meta）を描くかどうか。下の JSX の描画条件と必ず一致させる
  const hasBottomRow = Boolean(description || meta)
  return (
    <button
      data-slot="action-tile"
      data-variant={variant}
      // single では排他選択（radio）、それ以外は従来どおりトグルボタン（aria-pressed）。
      // radio に aria-pressed を併記すると意味論が二重になるので排他にする。
      role={isRadio ? "radio" : undefined}
      aria-checked={isRadio ? isSelected : undefined}
      aria-pressed={isRadio ? undefined : isSelected || undefined}
      type={type ?? "button"}
      disabled={isDisabled}
      className={cn(
        // ラベルと説明の間隔は gap トークンだけで決める。justify-between にすると
        // 高さの下限ぶん両者が最大まで引き離され gap が無視された見た目になる（issue #309 の原因2）
        "relative flex flex-col items-start justify-center gap-2 rounded-xl border border-[var(--Border-Low-Emphasis)] px-3 text-left transition-colors",
        // 下段があるタイルだけ 96px の下限を持つ。グリッドで情報量の違うタイルが並ぶときに
        // 高さを揃えるための下限なので、ラベルだけのタイルには効かせない（中身に対して余る）。
        // ラベルのみのときは上下 16px のパディングで内容にフィットさせる
        hasBottomRow ? "min-h-24 py-3" : "py-4",
        "focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50 focus-visible:outline-none",
        "hover:bg-[var(--Surface-Secondary)]",
        actionTileVariants[variant],
        isDisabled && "cursor-not-allowed opacity-50",
        className
      )}
      {...props}
    >
      {/*
        items-center: ラベルは常に1行（truncate）なので、インジケータ/Spinner を
        上端揃えにするとラベルの文字中心より数 px 高い位置に浮いて見える。
        行の中で縦中央に揃える。
      */}
      <span className="flex w-full items-center justify-between gap-3">
        <span className="flex min-w-0 flex-1 items-center gap-2">
          {emoji && (
            <span className="typo-heading-md shrink-0" aria-hidden>
              {emoji}
            </span>
          )}
          {icon && (
            <IconBadge
              appearance="plain"
              className="size-6 text-[var(--Object-Medium-Emphasis)]"
            >
              {icon}
            </IconBadge>
          )}
          <span className="typo-label-md min-w-0 truncate">{label}</span>
        </span>
        {loading ? (
          <Spinner size="sm" label="処理中" />
        ) : hasIndicator ? (
          <span
            className={cn(
              "shrink-0",
              // 文字列・数値は native 側が resolveTypo("label.md") + text.high-emphasis を当てるので web も揃える。
              // 色は継承に頼らず明示する（消費側の色文脈で崩れるため）
              (typeof indicator === "string" || typeof indicator === "number") &&
                "typo-label-md text-[var(--Text-High-Emphasis)]"
            )}
          >
            {indicator}
          </span>
        ) : isSelected ? (
          // 文字の「✓」グリフはフォント依存で DS のアイコンと太さ・比率が揃わないため
          // iconsax を使う（native は icon ライブラリを持たないので同形を View で描画）
          <span className="shrink-0 text-[var(--Text-Accent-Primary)]" aria-hidden>
            <TickSquare size={16} />
          </span>
        ) : null}
      </span>
      {hasBottomRow && (
        <span className="flex w-full flex-wrap items-end justify-between gap-x-2 gap-y-1">
          {description && (
            <span className="typo-body-sm min-w-[60%] flex-1 text-[var(--Text-Medium-Emphasis)]">
              {description}
            </span>
          )}
          {meta && (
            <span className="typo-label-sm ml-auto shrink-0 text-[var(--Text-Low-Emphasis)]">
              {meta}
            </span>
          )}
        </span>
      )}
    </button>
  )
}

/**
 * grid 直下に限らない（consumer が div でラップしても拾う）タイル収集。
 * ただし**入れ子の QuickActionGrid の中は拾わない** — 内側のタイルは内側の
 * グリッドが管理するもので、外側の roving tabindex に混ぜると Tab の止まり方が
 * 壊れる。disabled は移動対象外（呼び出し側でフィルタする）。
 */
function collectTiles(container: HTMLElement): HTMLButtonElement[] {
  return Array.from(
    container.querySelectorAll<HTMLButtonElement>('[data-slot="action-tile"]')
  ).filter((tile) => tile.closest('[data-slot="quick-action-grid"]') === container)
}

function QuickActionGrid({
  className,
  columns = 3,
  gap = "md",
  selectionMode,
  role,
  onKeyDown,
  ref,
  children,
  ...props
}: QuickActionGridProps) {
  const innerRef = React.useRef<HTMLDivElement | null>(null)
  // 内部の innerRef（ロービング tabindex の走査に使う）と consumer の ref に
  // 同じ node を渡す。インラインのアロー ref だと毎 render で ref 関数の
  // identity が変わり、React が detach → attach を繰り返してしまう。
  const setInnerElement = React.useCallback((node: HTMLDivElement | null) => {
    innerRef.current = node
  }, [])
  const mergedRef = useComposedRef(setInnerElement, ref)
  const isSingle = selectionMode === "single"

  // roving tabindex: 選択中のタイルだけ tabIndex=0（未選択なら先頭）。
  // 依存配列を持たせず毎レンダー同期する（子の選択状態は grid の props に現れないため）。
  React.useEffect(() => {
    const container = innerRef.current
    if (!isSingle || !container) return
    const tiles = collectTiles(container)
    const selectedIndex = tiles.findIndex((t) => t.getAttribute("aria-checked") === "true")
    const activeIndex = selectedIndex >= 0 ? selectedIndex : tiles.findIndex((t) => !t.disabled)
    tiles.forEach((tile, index) => {
      tile.tabIndex = index === activeIndex ? 0 : -1
    })
    if (isDev()) {
      const checkedCount = tiles.filter((t) => t.getAttribute("aria-checked") === "true").length
      if (checkedCount > 1) {
        // ChipSelector の既定モード問題と同じ「静かな誤動作」を開発時に見えるようにする（issue #318）
        console.warn(
          `[ksk-ds] QuickActionGrid: selectionMode="single" は排他選択ですが、選択中の ActionTile が ${checkedCount} 個あります。selected を 1 つに絞るか selectionMode="multiple" を使ってください。`
        )
      }
    }
  })

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event)
    if (!isSingle || event.defaultPrevented) return
    const delta =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? 1
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? -1
          : 0
    if (delta === 0) return
    const container = innerRef.current
    if (!container) return
    const tiles = collectTiles(container).filter((tile) => !tile.disabled)
    const current = (event.target as HTMLElement | null)?.closest<HTMLButtonElement>(
      '[data-slot="action-tile"]'
    )
    const currentIndex = current ? tiles.indexOf(current) : -1
    if (currentIndex < 0 || tiles.length === 0) return
    event.preventDefault()
    // radiogroup は端で折り返す（WAI-ARIA APG の radio group パターン）
    const next = tiles[(currentIndex + delta + tiles.length) % tiles.length]
    tiles.forEach((tile) => {
      tile.tabIndex = tile === next ? 0 : -1
    })
    next.focus()
    // 移動先を選択する（radio group では移動と選択が一体）
    next.click()
  }

  return (
    <div
      data-slot="quick-action-grid"
      ref={mergedRef}
      role={role ?? (isSingle ? "radiogroup" : undefined)}
      data-selection-mode={selectionMode}
      onKeyDown={handleKeyDown}
      className={cn(
        "grid",
        gridColumns[columns],
        gap === "sm" ? "gap-2" : "gap-3",
        className
      )}
      {...props}
    >
      {/*
        selectionMode 未指定でも必ず Provider を置いて null を流す。置かないと、
        selectionMode="single" のグリッドの中に入れ子にした「ただの起動ボタンの
        グリッド」が外側の文脈を引き継ぎ、勝手に role="radio" になる。
      */}
      <QuickActionGridSelectionContext.Provider value={selectionMode ?? null}>
        {children}
      </QuickActionGridSelectionContext.Provider>
    </div>
  )
}

export { ActionTile, QuickActionGrid }
export type {
  ActionTileProps,
  ActionTileVariant,
  QuickActionGridColumns,
  QuickActionGridGap,
  QuickActionGridProps,
  QuickActionGridSelectionMode,
}
