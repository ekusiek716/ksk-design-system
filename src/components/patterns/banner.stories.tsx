/**
 * @file Banner のストーリー
 * @description フィードバックバナーコンポーネント。4つのバリアント（info / success / warning / caution）にタイトルと説明を表示
 */
import type { Meta, StoryObj } from "@storybook/react"
import { Banner } from "./banner"
import { Button } from "../ui/button"

const meta: Meta<typeof Banner> = {
  title: "Components/Banner",
  component: Banner,
  argTypes: {
    variant: {
      control: "select",
      options: ["info", "success", "warning", "caution"],
    },
  },
}
export default meta

type Story = StoryObj<typeof Banner>

export const Info: Story = {
  args: {
    variant: "info",
    title: "お知らせ",
    description: "システムメンテナンスを 2026/4/10 に実施予定です。",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" /><path d="M10 9V14M10 6V6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
    ),
  },
}

export const Success: Story = {
  args: {
    variant: "success",
    title: "保存完了",
    description: "プロジェクトの設定が正常に保存されました。",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" /><path d="M7 10L9.5 12.5L13.5 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
    ),
  },
}

export const Warning: Story = {
  args: {
    variant: "warning",
    title: "注意",
    description: "ストレージの使用量が上限の80%に達しています。",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 3L18 17H2L10 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><path d="M10 8V12M10 14V14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
    ),
  },
}

export const Caution: Story = {
  args: {
    variant: "caution",
    title: "エラー",
    description: "データの取得に失敗しました。しばらくしてからお試しください。",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" /><path d="M7 7L13 13M13 7L7 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
    ),
  },
}

export const WithAction: Story = {
  render: () => (
    <Banner
      variant="info"
      title="新機能のお知らせ"
      description="ダッシュボードにダークモードが追加されました。"
      icon={
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" /><path d="M10 9V14M10 6V6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
      }
      action={<Button variant="ghost" size="sm">詳細を見る</Button>}
    />
  ),
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Banner variant="info" title="Info バナー" description="情報メッセージです。" />
      <Banner variant="success" title="Success バナー" description="成功メッセージです。" />
      <Banner variant="warning" title="Warning バナー" description="警告メッセージです。" />
      <Banner variant="caution" title="Caution バナー" description="エラーメッセージです。" />
    </div>
  ),
}
