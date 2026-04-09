/**
 * @file Accordion のストーリー
 * @description アコーディオンコンポーネント。3アイテムの例で開閉動作を確認
 */
import type { Meta, StoryObj } from "@storybook/react"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./accordion"

const meta: Meta<typeof Accordion> = {
  title: "UI/Accordion",
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
