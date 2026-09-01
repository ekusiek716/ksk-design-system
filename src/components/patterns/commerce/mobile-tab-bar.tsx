import * as React from "react"
import { Add } from "iconsax-reactjs"
import { BottomTabBar } from "./bottom-tab-bar"
import type { BottomTabBarFloatingPosition } from "./bottom-tab-bar"

interface MobileTabItem<T extends string> {
  key: T
  label: string
  /** iconsax-reactjs のアイコンコンポーネント。Linear（非アクティブ）/ Bulk（アクティブ）を自動切替する */
  Icon: React.ElementType
}

interface MobileTabBarAddAction {
  label: string
  ariaLabel?: string
  onClick: () => void
}

interface MobileTabBarProps<T extends string> {
  tabs: MobileTabItem<T>[]
  activeTab: T
  onSelect: (tab: T) => void
  /** 指定するとブランド色丸背景 + iconsax Add アイコンを中央 CTA として表示する */
  addAction?: MobileTabBarAddAction
  /**
   * pill の水平フロート位置（デフォルト "center"）。
   * addAction と併用しない片側フロート + FAB 併置レイアウトで使う。
   */
  floatingPosition?: BottomTabBarFloatingPosition
  /**
   * デスクトップ幅（`lg` = 1024px 以上）でもナビを表示するか（issue #486）。
   * BottomTabBar へそのままパススルーする。@default false
   */
  showOnDesktop?: boolean
  className?: string
}

function AddTabIcon() {
  // ボタン本体（BottomTabBar の CenterActionItem がラベル無し時に正円 FAB になる）が
  // ブランド色の円を担うため、ここではアイコンのみを渡す。
  // data-global-nav-add-icon は belle-todo 互換の後方互換フック。**公開契約ではない**。
  // 中央アクションのアイコンを狙うなら data-slot="bottom-nav-center-action-icon" を
  // 使うこと（CenterActionItem がこのラッパーの外側に付ける。issue #471）。
  // 既存消費側の CSS を黙って壊さないため残しているだけで、新規参照は増やさない。
  return (
    <span data-global-nav-add-icon aria-hidden="true" className="flex items-center justify-center">
      <Add size={24} variant="Linear" color="currentColor" />
    </span>
  )
}

/**
 * MobileTabBar — BottomTabBar の consumer-friendly ラッパー。
 * belle-todo の MobileTabBar（src/components/MobileTabBar.tsx 36-77行）を移植。
 *
 * - iconsax の variant="Linear"（非アクティブ）/ "Bulk"（アクティブ）を自動切替
 * - addAction 指定時はブランド色丸背景 + Add アイコンを centerAction として渡す
 * - onPointerUpCapture でタップ後のフォーカスリング残留を防ぐ（closest("button, a")?.blur()）
 * - 内部は BottomTabBar（variant="pill", pillPosition="fixed", showLabels,
 *   keyboardBehavior="hide"）の薄いラッパー。floatingPosition はパススルー。
 */
function MobileTabBar<T extends string>({
  tabs,
  activeTab,
  onSelect,
  addAction,
  floatingPosition = "center",
  showOnDesktop = false,
  className,
}: MobileTabBarProps<T>) {
  const handlePointerUpCapture = React.useCallback((event: React.PointerEvent<HTMLElement>) => {
    const target = event.target
    if (!(target instanceof Element)) return

    target.closest<HTMLElement>("button, a")?.blur()
  }, [])

  const tabItems = tabs.map((item) => {
    const active = item.key === activeTab
    const Icon = item.Icon
    return {
      label: item.label,
      icon: <Icon size={20} variant="Linear" />,
      activeIcon: <Icon size={20} variant="Bulk" />,
      isActive: active,
      onClick: () => onSelect(item.key),
      tabKey: item.key,
    }
  })

  const centerAction = addAction
    ? {
        label: "",
        ariaLabel: addAction.ariaLabel ?? addAction.label,
        icon: <AddTabIcon />,
        activeIcon: <AddTabIcon />,
        onClick: addAction.onClick,
      }
    : undefined

  return (
    <BottomTabBar
      // showOnDesktop 時に lg:hidden を残すと BottomTabBar 側の lg:flex と
      // 同じ詳細度でぶつかり、CSS の記述順で勝敗が決まってしまうので落とす。
      // （ここは cn() を通していないため tailwind-merge も効かない）
      className={
        showOnDesktop
          ? className
          : className
            ? `lg:hidden ${className}`
            : "lg:hidden"
      }
      variant="pill"
      pillPosition="fixed"
      floatingPosition={floatingPosition}
      showLabels
      keyboardBehavior="hide"
      onPointerUpCapture={handlePointerUpCapture}
      items={tabItems}
      centerAction={centerAction}
      showOnDesktop={showOnDesktop}
    />
  )
}

export { MobileTabBar }
export type { MobileTabBarAddAction, MobileTabBarProps, MobileTabItem }
