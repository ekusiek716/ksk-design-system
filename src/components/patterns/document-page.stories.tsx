/**
 * @file DocumentPage のストーリー
 * @description プライバシーポリシー・利用規約などの静的文書ページ。プライバシーポリシー風のダミー文で確認
 */
import type { Meta, StoryObj } from "@storybook/react"
import { DocumentPage } from "./document-page"
import { Prose } from "./prose"

const meta: Meta<typeof DocumentPage> = {
  title: "Patterns/DocumentPage",
  component: DocumentPage,
}
export default meta

type Story = StoryObj<typeof DocumentPage>

const POLICY_SECTIONS = [
  {
    title: "1. 収集する情報",
    body: [
      "本サービスは、氏名・メールアドレス・利用履歴など、サービス提供に必要な範囲で情報を収集します。",
      "収集した情報は、本ポリシーに定める目的以外には利用しません。",
    ],
  },
  {
    title: "2. 情報の利用目的",
    body: [
      "収集した情報は、本サービスの提供・改善、お問い合わせへの対応、重要なお知らせの送付のために利用します。",
    ],
  },
  {
    title: "3. 第三者提供",
    body: ["法令に基づく場合を除き、ご本人の同意なく個人情報を第三者に提供することはありません。"],
  },
]

export const PrivacyPolicy: Story = {
  args: {
    title: "プライバシーポリシー",
    lastUpdated: "2026年7月7日",
    children: <Prose sections={POLICY_SECTIONS} />,
  },
}

export const WithoutLastUpdated: Story = {
  args: {
    title: "利用規約",
    children: <Prose sections={POLICY_SECTIONS.slice(0, 1)} />,
  },
}
