/**
 * @file PortalContainerProvider のストーリー
 * @description Portal（Dialog / Select / DropdownMenu 等）の描画先をテーマスコープ内へ
 * まとめて向けるための Provider。既存アプリの一部サブツリーにだけ DS を導入する
 * 段階導入で、Portal だけがテーマの CSS 変数を継承できない問題を解消する（issue #360）。
 */
import { useState, type CSSProperties, type ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, userEvent, waitFor } from "storybook/test"
import { PortalContainerProvider } from "./portal-container"
import { Button } from "./button"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"

const meta: Meta<typeof PortalContainerProvider> = {
  title: "Components/PortalContainerProvider",
  component: PortalContainerProvider,
}
export default meta

type Story = StoryObj<typeof PortalContainerProvider>

/**
 * スコープ限定テーマ。Brand primitive をこの div だけで Orange に差し替える。
 * Portal が document.body へ出るとこの上書きを継承できず、既定（Blue）に戻る。
 */
const ORANGE_BRAND_600 = "#C2410C"
const scopedThemeStyle = {
  "--Primitive-Brand-500": "#F97316",
  "--Primitive-Brand-600": ORANGE_BRAND_600,
} as CSSProperties

function ScopedTheme({ children }: { children: ReactNode }) {
  // ref は useState の setter で安定させる。インラインのアロー関数だと毎レンダーで
  // container が付け外しされ、開いている Portal が unmount/remount される。
  const [container, setContainer] = useState<HTMLDivElement | null>(null)

  return (
    <div
      ref={setContainer}
      data-testid="portal-theme-scope"
      style={scopedThemeStyle}
      className="bg-[var(--Surface-Primary)] text-[var(--Text-High-Emphasis)] p-4"
    >
      <p className="typo-body-sm text-[var(--Text-Medium-Emphasis)] mb-4">
        この枠内だけ Brand を Orange に差し替えている。Portal もこの中へ描画される。
      </p>
      <PortalContainerProvider container={container}>{children}</PortalContainerProvider>
    </div>
  )
}

/** Portal の中身がスコープ配下にあり、スコープのテーマ変数を継承していることを確認する。 */
async function expectInsideThemeScope(canvasElement: HTMLElement, contentTestId: string) {
  const doc = canvasElement.ownerDocument
  await waitFor(() => {
    const scope = doc.querySelector<HTMLElement>('[data-testid="portal-theme-scope"]')
    const content = doc.querySelector<HTMLElement>(`[data-testid="${contentTestId}"]`)
    expect(scope).toBeTruthy()
    expect(content).toBeTruthy()
    expect(scope!.contains(content!)).toBe(true)
    // Portal がスコープ内に描画されたことで、スコープ div に当てた primitive を
    // そのまま継承できる（document.body 直下だと継承できずテーマ既定値になる）。
    // ⚠️ semantic 層（--Brand-Primary 等）は :root で var(--Primitive-Brand-600) と
    // 解決されるため、スコープ側で primitive を上書きしても semantic は再解決されない。
    // 検証はスコープに直接当てた primitive で行う。
    expect(
      getComputedStyle(content!).getPropertyValue("--Primitive-Brand-600").trim().toUpperCase()
    ).toBe(ORANGE_BRAND_600)
  })
}

export const DialogInScope: Story = {
  name: "Dialog がスコープ内テーマを継承する",
  render: () => (
    <ScopedTheme>
      <Dialog defaultOpen>
        <DialogContent data-testid="scoped-dialog">
          <DialogTitle>テーマ内のダイアログ</DialogTitle>
          <DialogDescription>Portal の描画先がテーマスコープ内へ移動する。</DialogDescription>
          <Button>スコープのブランド色になる</Button>
        </DialogContent>
      </Dialog>
    </ScopedTheme>
  ),
  tags: ["interaction", "!autodocs"],
  play: ({ canvasElement }) => expectInsideThemeScope(canvasElement, "scoped-dialog"),
}

export const DropdownMenuInScope: Story = {
  name: "DropdownMenu がスコープ内テーマを継承する",
  render: () => (
    <ScopedTheme>
      <DropdownMenu defaultOpen modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">操作</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent data-testid="scoped-dropdown-menu">
          <DropdownMenuItem>編集する</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ScopedTheme>
  ),
  tags: ["interaction", "!autodocs"],
  play: ({ canvasElement }) => expectInsideThemeScope(canvasElement, "scoped-dropdown-menu"),
}

export const SelectInScope: Story = {
  name: "Select がスコープ内テーマを継承する",
  render: () => (
    <ScopedTheme>
      <Select defaultOpen defaultValue="pending">
        <SelectTrigger aria-label="ステータス">
          <SelectValue />
        </SelectTrigger>
        <SelectContent data-testid="scoped-select">
          <SelectItem value="pending">対応待ち</SelectItem>
          <SelectItem value="done">対応済み</SelectItem>
        </SelectContent>
      </Select>
    </ScopedTheme>
  ),
  tags: ["interaction", "!autodocs"],
  play: async ({ canvasElement }) => {
    await expectInsideThemeScope(canvasElement, "scoped-select")
    // Radix Select は開いている間、選択肢以外を aria-hidden にする。DOM 観測後に閉じ、
    // a11y の最終スキャンでは通常の閉じた状態を検査させる。
    await userEvent.keyboard("{Escape}")
    await waitFor(() => {
      expect(canvasElement.ownerDocument.querySelector('[data-testid="scoped-select"]')).toBeNull()
    })
  },
}

/**
 * 後方互換の回帰ガード: Provider を置かない既存コードは、従来どおり
 * `document.body` 直下へ Portal が描画され続ける。
 */
export const DefaultsToDocumentBody: Story = {
  name: "Provider 無しでは document.body へ描画する（後方互換）",
  render: () => (
    <Dialog defaultOpen>
      <DialogContent data-testid="unscoped-dialog">
        <DialogTitle>Provider 無しのダイアログ</DialogTitle>
        <DialogDescription>従来どおり document.body 直下へ描画される。</DialogDescription>
      </DialogContent>
    </Dialog>
  ),
  tags: ["interaction", "!autodocs"],
  play: async ({ canvasElement }) => {
    const doc = canvasElement.ownerDocument
    await waitFor(() => {
      const content = doc.querySelector<HTMLElement>('[data-testid="unscoped-dialog"]')
      expect(content).toBeTruthy()
      // Radix Portal は body 直下にラッパー要素を挟み、その深さは Radix の実装詳細
      // なので厳密な親子関係は見ない。「body 配下にあり、Storybook のルート
      // (#storybook-root) の中には無い」＝ body へ portal されたこと、を検証する。
      expect(doc.body.contains(content!)).toBe(true)
      expect(canvasElement.contains(content!)).toBe(false)
    })
  },
}
