import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { BottomTabBar, type BottomTabBarItem } from "@/components/patterns/commerce/bottom-tab-bar"

/**
 * issue #627: NavItem の件数バッジ（badgeCount）がスクリーンリーダーに正しく
 * 伝わらなかった不具合の回帰テスト。
 *
 * - ラベル非表示時: `aria-label = ariaLabel ?? label` が中身を上書きし件数が消えていた
 * - ラベル表示時: aria-label が無く中身から名前が組まれ「4ホーム」の順になっていた
 * - ariaLabel 指定時もバッジが落ちていた
 *
 * 修正後は表示形態に関わらず部品が `ariaLabel ?? label` + 件数バッジ（SidebarNav
 * の collapsed 表示と同じ書式）を aria-label に組み立て、バッジの span 自体は
 * aria-hidden にする。
 */
function itemsWith(overrides: Partial<BottomTabBarItem>): BottomTabBarItem[] {
  return [{ label: "ホーム", icon: <svg data-icon="home" />, ...overrides }]
}

describe("BottomTabBar NavItem の件数バッジ a11y (issue #627)", () => {
  it("ラベル表示・badge無し・ariaLabel無し → aria-label はラベルのみ", () => {
    const html = renderToStaticMarkup(
      <BottomTabBar variant="pill" showLabels items={itemsWith({})} />
    )
    expect(html).toContain('aria-label="ホーム"')
  })

  it("ラベル表示・badge有り → aria-label に件数を含める（「4ホーム」順にならない）", () => {
    const html = renderToStaticMarkup(
      <BottomTabBar variant="pill" showLabels items={itemsWith({ badgeCount: 4 })} />
    )
    expect(html).toContain('aria-label="ホーム（4）"')
  })

  it("ラベル非表示・badge無し → aria-label はラベルのみ（中身を上書きしない）", () => {
    const html = renderToStaticMarkup(
      <BottomTabBar variant="pill" showLabels={false} items={itemsWith({})} />
    )
    expect(html).toContain('aria-label="ホーム"')
  })

  it("ラベル非表示・badge有り → aria-label に件数を含める（従来は消えていた）", () => {
    const html = renderToStaticMarkup(
      <BottomTabBar variant="pill" showLabels={false} items={itemsWith({ badgeCount: 4 })} />
    )
    expect(html).toContain('aria-label="ホーム（4）"')
  })

  it("ariaLabel 指定時も badgeCount を落とさない", () => {
    const html = renderToStaticMarkup(
      <BottomTabBar
        variant="pill"
        showLabels={false}
        items={itemsWith({ ariaLabel: "お気に入り一覧", badgeCount: 4 })}
      />
    )
    expect(html).toContain('aria-label="お気に入り一覧（4）"')
  })

  it("100件以上は 99+ と読み上げる", () => {
    const html = renderToStaticMarkup(
      <BottomTabBar variant="pill" showLabels items={itemsWith({ badgeCount: 120 })} />
    )
    expect(html).toContain('aria-label="ホーム（99+）"')
  })

  it("badgeCount が 0 のときは件数を含めない", () => {
    const html = renderToStaticMarkup(
      <BottomTabBar variant="pill" showLabels items={itemsWith({ badgeCount: 0 })} />
    )
    expect(html).toContain('aria-label="ホーム"')
    expect(html).not.toContain("（0）")
  })

  it("バッジの span 自体は aria-hidden で二重読み上げを防ぐ", () => {
    const html = renderToStaticMarkup(
      <BottomTabBar variant="pill" showLabels items={itemsWith({ badgeCount: 4 })} />
    )
    expect(html).toMatch(/<span aria-hidden="true"[^>]*>4<\/span>/)
  })

  it("default variant（常時ラベル表示）でも件数を aria-label に含める", () => {
    const html = renderToStaticMarkup(<BottomTabBar items={itemsWith({ badgeCount: 4 })} />)
    expect(html).toContain('aria-label="ホーム（4）"')
  })
})
