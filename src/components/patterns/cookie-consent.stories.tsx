/**
 * @file CookieConsent のストーリー
 * @description GDPR / APPI 準拠のクッキー同意バナー。showDelay=0 で即時表示して確認する。
 */
import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { CookieConsent } from "./cookie-consent"

const meta: Meta<typeof CookieConsent> = {
  title: "Patterns/CookieConsent",
  component: CookieConsent,
  tags: ["autodocs"],
  args: {
    showDelay: 0,
  },
  // localStorage に同意済みが記録されると showDelay 後も表示されなくなるため、
  // 各ストーリーの読み込み前に該当キーをクリアして常に未決定状態から確認できるようにする。
  loaders: [
    async (context) => {
      if (typeof localStorage !== "undefined") {
        const storageKey = (context.args as { storageKey?: string }).storageKey
        if (storageKey) localStorage.removeItem(storageKey)
      }
      return {}
    },
  ],
}
export default meta

type Story = StoryObj<typeof CookieConsent>

export const Default: Story = {
  args: {
    storageKey: "storybook-cookie-consent-default",
  },
}

export const CustomLabels: Story = {
  args: {
    storageKey: "storybook-cookie-consent-custom",
    labels: {
      title: "Cookie の利用について",
      description:
        "本サイトはアクセス解析・機能改善のために Cookie を使用します。必要なもののみか、すべて許可するかを選択できます。",
      essentialOnly: "必要なもののみ許可",
      accept: "すべて許可する",
      ariaLabel: "Cookie 同意バナー",
    },
  },
}

export const OnDecideCallback: Story = {
  args: {
    storageKey: "storybook-cookie-consent-callback",
  },
  render: (args) => {
    const [choice, setChoice] = React.useState<string | null>(null)
    return (
      <div>
        <p
          data-testid="decision-readout"
          className="typo-body-sm text-[var(--Text-Medium-Emphasis)] mb-4"
        >
          決定結果: {choice ?? "（未決定）"}
        </p>
        <CookieConsent
          {...args}
          onDecide={(c) => setChoice(c)}
        />
      </div>
    )
  },
}
