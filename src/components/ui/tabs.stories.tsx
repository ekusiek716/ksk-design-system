/**
 * @file Tabs のストーリー
 * @description タブナビゲーションコンポーネント。3タブの例をコンテンツ付きで表示
 */
import type { Meta, StoryObj } from "@storybook/react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs"

const meta: Meta<typeof Tabs> = {
  title: "UI/Tabs",
  component: Tabs,
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
