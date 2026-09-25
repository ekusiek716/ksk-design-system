import { SemanticIcon as NativeSemanticIcon } from "@/native/components/SemanticIcon"
import { ThemeProvider } from "@/native/theme/ThemeProvider"
import type { Meta, StoryObj } from "@storybook/react"
import { SemanticIcon, SEMANTIC_ICONS, type SemanticIconName } from "../ui/semantic-icon"

const meta = {
  title: "Foundation/Semantic Icons",
  component: SemanticIcon,
  tags: ["autodocs"],
  parameters: { layout: "padded", docs: { description: { component: "名前ではなく用途と実物から選びます。選択は枠なしtick、完了はTickCircle、情報はi、警告は感嘆符です。装飾は読み上げず、アイコンだけの操作にはButtonのaria-labelを指定します。" } } },
  args: { name: "selected" },
} satisfies Meta<typeof SemanticIcon>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Meanings: Story = {
  render: () => <div className="flex flex-col gap-4 bg-[var(--Surface-Primary)] text-[var(--Text-High-Emphasis)]">
    {(Object.keys(SEMANTIC_ICONS) as SemanticIconName[]).map(name => <div key={name} className="flex items-center gap-4">
      <SemanticIcon name={name} size={24} />
      <div className="min-w-0 flex-1"><p className="typo-label-md">{SEMANTIC_ICONS[name].label}</p><p className="typo-body-sm text-[var(--Text-Medium-Emphasis)]">{SEMANTIC_ICONS[name].use}</p></div>
    </div>)}
  </div>,
}

/** Browser preview uses react-native-web, not device verification. */
export const WebAndNative: Story = {
  render: () => <ThemeProvider><div className="flex flex-col gap-4 bg-[var(--Surface-Primary)] text-[var(--Text-High-Emphasis)]">
    <p className="typo-body-sm text-[var(--Text-Medium-Emphasis)]">左がWeb、右がNativeのブラウザ表示です。警告は描画素材に合わせて器の形が異なります。</p>
    {(Object.keys(SEMANTIC_ICONS) as SemanticIconName[]).map(name => <div key={name} className="flex items-center gap-4">
      <SemanticIcon name={name} size={24} />
      <NativeSemanticIcon name={name} size={24} />
      <span className="typo-label-md">{SEMANTIC_ICONS[name].label}</span>
    </div>)}
  </div></ThemeProvider>,
}
