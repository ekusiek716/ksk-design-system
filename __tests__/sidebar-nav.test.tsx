import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import type { BottomTabBarItem } from "../src/components/patterns/commerce/bottom-tab-bar"
import { SidebarNav, type SidebarNavItem } from "../src/components/patterns/sidebar-nav"

/**
 * issue #611: サイドバー用のナビ項目部品。
 *
 * - 選択状態の a11y（aria-current="page"）を部品が持ち、role=tab / aria-selected は出さない
 * - BottomTabBar と同じ items 配列をそのまま渡せる（型の互換）
 * - collapsed ではラベルが aria-label / title に移る
 */
const items: SidebarNavItem[] = [
  { label: "ホーム", icon: <svg data-icon="home" />, activeIcon: <svg data-icon="home-bold" />, isActive: true, tabKey: "home" },
  { label: "タスク", icon: <svg data-icon="tasks" />, badgeCount: 120, href: "/tasks" },
]

describe("SidebarNav (issue #611)", () => {
  it("選択中の項目にだけ aria-current=page を付け、role=tab / aria-selected を使わない", () => {
    const html = renderToStaticMarkup(<SidebarNav items={items} />)
    expect(html.match(/aria-current="page"/g)).toHaveLength(1)
    expect(html).not.toContain('role="tab"')
    expect(html).not.toContain("aria-selected")
    expect(html).toContain('aria-label="サイドナビゲーション"')
  })

  it("選択中は activeIcon に差し替え、data-tab-key を出す", () => {
    const html = renderToStaticMarkup(<SidebarNav items={items} />)
    expect(html).toContain('data-icon="home-bold"')
    expect(html).not.toContain('data-icon="home"')
    expect(html).toContain('data-tab-key="home"')
  })

  it("href があれば a、無ければ type=button の button で描く", () => {
    const html = renderToStaticMarkup(<SidebarNav items={items} />)
    expect(html).toContain('<a data-slot="sidebar-nav-item"')
    expect(html).toContain('href="/tasks"')
    expect(html).toMatch(/<button[^>]*type="button"/)
  })

  it("行の高さ 44px を部品が持つ", () => {
    const html = renderToStaticMarkup(<SidebarNav items={items} />)
    expect(html.match(/min-h-11/g)).toHaveLength(2)
  })

  it("件数バッジは 99 を超えると 99+", () => {
    const html = renderToStaticMarkup(<SidebarNav items={items} />)
    expect(html).toContain(">99+<")
  })

  it("collapsed ではラベルを描かず aria-label / title に移す", () => {
    const html = renderToStaticMarkup(<SidebarNav items={items} collapsed />)
    expect(html).not.toContain('data-slot="sidebar-nav-item-label"')
    expect(html).toContain('aria-label="ホーム"')
    expect(html).toContain('title="タスク"')
  })

  it("collapsed ではバッジ件数をアクセシブルネームに含める", () => {
    const html = renderToStaticMarkup(<SidebarNav items={items} collapsed />)
    expect(html).toContain('aria-label="タスク（99+）"')
  })

  it("BottomTabBar の items 配列をそのまま渡せる", () => {
    const tabItems: BottomTabBarItem[] = [{ label: "ホーム", icon: <svg />, isActive: true }]
    const html = renderToStaticMarkup(<SidebarNav items={tabItems} />)
    expect(html).toContain("ホーム")
  })
})
