/**
 * @file Tabs のストーリー
 * @description タブナビゲーションコンポーネント。3タブの例をコンテンツ付きで表示
 */
import type { Meta, StoryObj } from "@storybook/react"
import { expect, userEvent, within } from "storybook/test"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs"

const meta: Meta<typeof Tabs> = {
  title: "Components/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
}
export default meta

type Story = StoryObj<typeof Tabs>

export const ThreeTabs: Story = {
  tags: ["vrt"],
  render: () => (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">概要</TabsTrigger>
        <TabsTrigger value="members">メンバー</TabsTrigger>
        <TabsTrigger value="settings">設定</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <div className="p-4">
          <p className="typo-body-md text-[var(--Text-High-Emphasis)]">
            プロジェクトの概要がここに表示されます。
          </p>
        </div>
      </TabsContent>
      <TabsContent value="members">
        <div className="p-4">
          <p className="typo-body-md text-[var(--Text-High-Emphasis)]">
            メンバー一覧がここに表示されます。
          </p>
        </div>
      </TabsContent>
      <TabsContent value="settings">
        <div className="p-4">
          <p className="typo-body-md text-[var(--Text-High-Emphasis)]">
            設定フォームがここに表示されます。
          </p>
        </div>
      </TabsContent>
    </Tabs>
  ),
}

export const WithDisabledTab: Story = {
  render: () => (
    <Tabs defaultValue="tab1">
      <TabsList>
        <TabsTrigger value="tab1">有効</TabsTrigger>
        <TabsTrigger value="tab2">有効</TabsTrigger>
        <TabsTrigger value="tab3" disabled>無効</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <div className="p-4">
          <p className="typo-body-md text-[var(--Text-High-Emphasis)]">タブ1のコンテンツ</p>
        </div>
      </TabsContent>
      <TabsContent value="tab2">
        <div className="p-4">
          <p className="typo-body-md text-[var(--Text-High-Emphasis)]">タブ2のコンテンツ</p>
        </div>
      </TabsContent>
    </Tabs>
  ),
}

/**
 * 縦向き（`orientation="vertical"`）。タブを左に縦に並べ、パネルは右の残りを取る。
 * タブの列は Tabs の幅の半分までで、長いラベルはタブの中で折り返す。矢印キーは上下で移動する。
 */
export const Vertical: Story = {
  tags: ["interaction"],
  render: () => (
    <Tabs defaultValue="account" orientation="vertical">
      <TabsList>
        <TabsTrigger value="account">アカウント</TabsTrigger>
        <TabsTrigger value="notice">通知</TabsTrigger>
        <TabsTrigger value="privacy">プライバシーとセキュリティ</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <p className="typo-body-md text-[var(--Text-High-Emphasis)]">アカウントの設定</p>
      </TabsContent>
      <TabsContent value="notice">
        <p className="typo-body-md text-[var(--Text-High-Emphasis)]">通知の設定</p>
      </TabsContent>
      <TabsContent value="privacy">
        <p className="typo-body-md text-[var(--Text-High-Emphasis)]">プライバシーの設定</p>
      </TabsContent>
    </Tabs>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const tabs = canvas.getAllByRole("tab")
    // 縦に並ぶ（左端がそろい、下へ積み重なる）
    const [a, b] = tabs.map((t) => t.getBoundingClientRect())
    await expect(Math.round(b.left)).toBe(Math.round(a.left))
    await expect(b.top).toBeGreaterThanOrEqual(a.bottom)
    // パネルはタブの列の右
    const list = canvas.getByRole("tablist").getBoundingClientRect()
    await expect(canvas.getByRole("tabpanel").getBoundingClientRect().left).toBeGreaterThanOrEqual(list.right)
    // 下矢印で次のタブへ
    await userEvent.click(tabs[0])
    await userEvent.keyboard("{ArrowDown}")
    await expect(tabs[1]).toHaveAttribute("data-state", "active")
    await expect(canvas.getByRole("tabpanel")).toHaveTextContent("通知の設定")
  },
}

// ─────────────────────────────────────────────────────────────
// interaction 回帰テスト（issue #256 / `npm run test:interaction`）
// ─────────────────────────────────────────────────────────────

/** クリックと矢印キーの両方でタブが切り替わり、パネルが入れ替わる。 */
export const SwitchesByClickAndArrowKeys: Story = {
  tags: ["interaction", "!autodocs"],
  render: () => (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">概要</TabsTrigger>
        <TabsTrigger value="members">メンバー</TabsTrigger>
        <TabsTrigger value="settings">設定</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">概要パネル</TabsContent>
      <TabsContent value="members">メンバーパネル</TabsContent>
      <TabsContent value="settings">設定パネル</TabsContent>
    </Tabs>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const overview = canvas.getByRole("tab", { name: "概要" })
    const members = canvas.getByRole("tab", { name: "メンバー" })
    const settings = canvas.getByRole("tab", { name: "設定" })

    await expect(overview).toHaveAttribute("aria-selected", "true")
    await expect(canvas.getByText("概要パネル")).toBeInTheDocument()

    // クリックで切替
    await userEvent.click(members)
    await expect(members).toHaveAttribute("aria-selected", "true")
    await expect(overview).toHaveAttribute("aria-selected", "false")
    await expect(canvas.getByText("メンバーパネル")).toBeInTheDocument()
    await expect(canvas.queryByText("概要パネル")).toBeNull()

    // 矢印キーで切替（WAI-ARIA tabs パターン）
    await userEvent.keyboard("{ArrowRight}")
    await expect(settings).toHaveAttribute("aria-selected", "true")
    await expect(settings).toHaveFocus()

    await userEvent.keyboard("{ArrowLeft}")
    await expect(members).toHaveAttribute("aria-selected", "true")
  },
}
