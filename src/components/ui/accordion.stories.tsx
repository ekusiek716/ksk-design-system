/**
 * @file Accordion のストーリー
 * @description アコーディオンコンポーネント。3アイテムの例で開閉動作を確認
 */
import type { Meta, StoryObj } from "@storybook/react"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./accordion"

const meta: Meta<typeof Accordion> = {
  title: "Components/Accordion",
  component: Accordion,
}
export default meta

type Story = StoryObj<typeof Accordion>

export const ThreeItems: Story = {
  render: () => (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>KSK Design System とは？</AccordionTrigger>
        <AccordionContent>
          フリーランスデザイナー / エンジニア / PdM が複数クライアント案件を1つのDSで高速に回すために設計された統合デザインシステムです。
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>マルチテーマ対応とは？</AccordionTrigger>
        <AccordionContent>
          Brand色の10行を差し替えるだけで、全コンポーネントの見た目が自動的に切り替わります。
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>どのようなプリセットテーマがありますか？</AccordionTrigger>
        <AccordionContent>
          Default (Blue)、Orange、Green、Violet の4つのプリセットテーマが用意されています。
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

export const MultipleOpen: Story = {
  render: () => (
    <Accordion type="multiple" defaultValue={["item-1"]}>
      <AccordionItem value="item-1">
        <AccordionTrigger>セクション A</AccordionTrigger>
        <AccordionContent>複数のアイテムを同時に開くことができます。</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>セクション B</AccordionTrigger>
        <AccordionContent>type=&quot;multiple&quot; を指定すると複数開閉が可能です。</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>セクション C</AccordionTrigger>
        <AccordionContent>各セクションは独立して開閉します。</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

/**
 * issue #600: LP の「よくある質問」のような大きめの見せ方。
 * size="lg" を Accordion ルートに指定すると、Trigger / Content へ
 * context 経由で伝わり、個別に className を上書きしなくてよくなる。
 */
export const Large: Story = {
  render: () => (
    <Accordion type="single" collapsible size="lg" defaultValue="item-1">
      <AccordionItem value="item-1">
        <AccordionTrigger>プレハナビは無料で使えますか？</AccordionTrigger>
        <AccordionContent>
          基本機能は無料でご利用いただけます。一部のプレミアム機能は有料プランでご提供しています。
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>複数人で編集できますか？</AccordionTrigger>
        <AccordionContent>
          招待リンクを共有することで、パートナーや家族と同じ準備リストを編集できます。
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

/**
 * Trigger / Content だけ個別に size を上書きできることの確認
 * （Accordion ルートの size を既定のままにし、1項目だけ lg にする）。
 */
export const MixedSizeOverride: Story = {
  render: () => (
    <Accordion type="single" collapsible defaultValue="item-1">
      <AccordionItem value="item-1">
        <AccordionTrigger size="lg">この項目だけ lg</AccordionTrigger>
        <AccordionContent size="lg">
          Trigger / Content に直接 size を渡すと、Accordion ルートの既定値より
          優先される。
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>他の項目は既定（default）のまま</AccordionTrigger>
        <AccordionContent>個別指定しなければ Accordion ルートの size に従う。</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}
