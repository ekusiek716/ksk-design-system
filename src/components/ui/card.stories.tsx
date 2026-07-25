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

/**
 * 地と同色になるケースと `--card-surface` による解決。
 *
 * Card の既定背景は `--Surface-Primary`。`AppShell` / `MarketingShell` の
 * ルートも同じ `--Surface-Primary` なので、その直下の Card は地と完全に同色になり、
 * 区切りは罫線と light の 8% shadow だけになる（dark では暗い shadow がほぼ見えない）。
 *
 * 右のブロックのように、地を描く側が `--card-surface` を宣言すると、
 * 配下の Card が**指定なしで**その色に切り替わる。カード 1 枚ずつ prop を
 * 付けて回る方式と違い、あとからカードを足したときの付け忘れが起きない。
 *
 * dark / light の両方をツールバーの Dark トグルで確認すること。
 */
export const OnSameColorGround: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="grid gap-0 sm:grid-cols-2">
      <div className="bg-[var(--Surface-Primary)] p-6 flex flex-col gap-4">
        <p className="typo-label-sm text-[var(--Text-Medium-Emphasis)]">
          宣言なし（地とカードが同色 / 罫線と影だけが区切り）
        </p>
        <Card>
          <CardContent>
            <p className="typo-body-md text-[var(--Text-High-Emphasis)]">Surface-Primary の地</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="typo-body-md text-[var(--Text-High-Emphasis)]">2 枚目も同色</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-[var(--Surface-Primary)] p-6 flex flex-col gap-4 [--card-surface:var(--Surface-Secondary)]">
        <p className="typo-label-sm text-[var(--Text-Medium-Emphasis)]">
          地が --card-surface を宣言（Card 側は指定なし）
        </p>
        <Card>
          <CardContent>
            <p className="typo-body-md text-[var(--Text-High-Emphasis)]">指定なしで地から浮く</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="typo-body-md text-[var(--Text-High-Emphasis)]">
              入れ子カードは宣言を引き継がない（階層が潰れない）
            </p>
            <Card className="mt-4">
              <CardContent>
                <p className="typo-body-sm text-[var(--Text-Medium-Emphasis)]">内側のカード</p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        <Card className="bg-[var(--Surface-Primary)]">
          <CardContent>
            <p className="typo-body-md text-[var(--Text-High-Emphasis)]">
              明示指定で地に馴染ませることもできる
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  ),
}
