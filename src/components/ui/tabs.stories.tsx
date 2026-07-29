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
