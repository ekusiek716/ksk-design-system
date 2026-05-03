/**
 * @file Card のストーリー
 * @description コンテンツカードコンポーネント。Header / Title / Description / Action / Content / Footer のサブコンポーネントを組み合わせて使用
 */
import type { Meta, StoryObj } from "@storybook/react"
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter } from "./card"
import { Button } from "./button"

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
}
export default meta

type Story = StoryObj<typeof Card>

export const FullCard: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>プロジェクト設定</CardTitle>
          <CardDescription>プロジェクトの基本情報を設定します</CardDescription>
        </div>
        <CardAction>
          <Button variant="ghost" size="sm">編集する</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="typo-body-md text-[var(--Text-Medium-Emphasis)]">
          ここにカードのメインコンテンツが入ります。フォームやリストなど、自由にレイアウトできます。
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="secondary" size="sm">キャンセル</Button>
        <Button size="sm">保存する</Button>
      </CardFooter>
    </Card>
  ),
}

export const MinimalCard: Story = {
  render: () => (
    <Card>
      <CardContent>
        <p className="typo-body-md text-[var(--Text-High-Emphasis)]">
          最小構成のカードです。CardContent のみを使用しています。
        </p>
      </CardContent>
    </Card>
  ),
}

export const HeaderOnly: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>タイトルのみ</CardTitle>
          <CardDescription>説明テキストです</CardDescription>
        </div>
      </CardHeader>
    </Card>
  ),
}
