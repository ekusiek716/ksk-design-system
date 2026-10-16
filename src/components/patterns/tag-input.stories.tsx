import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { TagInput } from "./tag-input"
import { FormField } from "./form-field"

const meta: Meta<typeof TagInput> = {
  title: "Components/TagInput",
  component: TagInput,
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof TagInput>

function Demo(props: Partial<React.ComponentProps<typeof TagInput>>) {
  const [tags, setTags] = React.useState<string[]>(props.value ?? [])
  return <div className="w-80"><TagInput {...props} value={tags} onChange={setTags} /></div>
}

export const Default: Story = {
  render: () => <Demo />,
}

export const WithInitialTags: Story = {
  render: () => <Demo value={["React", "TypeScript", "Tailwind"]} />,
}

export const WithMax: Story = {
  render: () => <Demo max={3} placeholder="最大3つまで" />,
}

export const Disabled: Story = {
  // 無効状態の見た目デモ。inactive UI component は WCAG 1.4.3 の
  // コントラスト要件対象外だが、axe は chip(span) の無効文脈を判定できないため除外する。
  parameters: {
    a11y: { config: { rules: [{ id: "color-contrast", enabled: false }] } },
  },
  render: () => <Demo value={["タグA", "タグB"]} disabled />,
}

/**
 * FormField の label と結ぶ（issue #693）。`id` を渡すと `<FormField htmlFor>` の label が
 * 入力欄の名前になり、description / error は aria-describedby・aria-invalid として自動で渡る。
 */
export const WithFormField: Story = {
  render: function Render() {
    const [tags, setTags] = React.useState<string[]>(["前撮り"])
    return (
      <div className="w-80">
        <FormField label="タグ" htmlFor="task-tags" description="Enter で追加できます">
          <TagInput id="task-tags" value={tags} onChange={setTags} />
        </FormField>
      </div>
    )
  },
}
