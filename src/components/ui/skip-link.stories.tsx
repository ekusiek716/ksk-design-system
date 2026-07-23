import type { Meta, StoryObj } from "@storybook/react"
import { SkipLink } from "./skip-link"

const meta = {
  title: "Components/SkipLink",
  component: SkipLink,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Tabキーでフォーカスすると画面左上に現れ、主要コンテンツへ移動します。",
      },
    },
  },
} satisfies Meta<typeof SkipLink>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    targetId: "storybook-main-content",
  },
  render: (args) => (
    <div className="flex min-h-64 flex-col gap-6">
      <SkipLink {...args} />
      <p className="typo-body-sm text-[var(--Text-Medium-Emphasis)]">
        Tabキーを押してスキップリンクを表示してください
      </p>
      <main
        id="storybook-main-content"
        tabIndex={-1}
        className="rounded-lg border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] p-6 text-[var(--Text-High-Emphasis)]"
      >
        <h2 className="typo-heading-lg">主要コンテンツ</h2>
      </main>
    </div>
  ),
}
