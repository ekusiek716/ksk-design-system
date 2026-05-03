/**
 * @file SectionHeader のストーリー
 * @description セクション見出しコンポーネント。アクション有無のパターンを網羅
 */
import type { Meta, StoryObj } from "@storybook/react"
import { SectionHeader } from "./section-header"
import { Button } from "../ui/button"

const meta: Meta<typeof SectionHeader> = {
  title: "Components/SectionHeader",
  component: SectionHeader,
}
export default meta

type Story = StoryObj<typeof SectionHeader>

export const WithAction: Story = {
  args: {
    title: "プロジェクト一覧",
    description: "管理中のプロジェクトを表示しています",
    action: <Button size="sm">新規作成</Button>,
  },
}

export const WithoutAction: Story = {
  args: {
    title: "プロジェクト一覧",
    description: "管理中のプロジェクトを表示しています",
  },
}

export const TitleOnly: Story = {
  args: {
    title: "設定",
  },
}

export const WithGhostButton: Story = {
  args: {
    title: "最近のアクティビティ",
    action: <Button variant="ghost" size="sm">すべて見る</Button>,
  },
}
