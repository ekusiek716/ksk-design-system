/**
 * @file CodeInput のストーリー
 * @description 認証コード（OTP）・招待コードの固定桁入力（issue #669）。
 */
import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { expect, userEvent } from "storybook/test"
import { CodeInput } from "./code-input"
import { Label } from "./label"

const meta: Meta<typeof CodeInput> = {
  title: "Components/CodeInput",
  component: CodeInput,
  tags: ["autodocs"],
}
export default meta

type Story = StoryObj<typeof CodeInput>

/**
 * メールや SMS で届く 6 桁の認証コード。貼り付けで全桁が埋まり、Backspace で前の桁へ戻る。
 * `autocomplete="one-time-code"` なので iOS / Android の SMS コード自動入力がそのまま入る。
 */
export const Otp: Story = {
  tags: ["interaction"],
  render: () => {
    const [code, setCode] = React.useState("")
    const [done, setDone] = React.useState("")
    return (
      <div className="flex max-w-sm flex-col gap-3 p-4">
        <p id="otp-label" className="typo-label-md text-[var(--Text-High-Emphasis)]">
          認証コード（6 桁）
        </p>
        <CodeInput length={6} value={code} onChange={setCode} onComplete={setDone} aria-labelledby="otp-label" />
        <p className="typo-label-xs text-[var(--Text-Low-Emphasis)]" data-testid="done">
          {done ? `確認中: ${done}` : "コードを入力してください"}
        </p>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const cells = () => [...canvasElement.querySelectorAll<HTMLInputElement>('[data-slot="code-input-cell"]')]
    await userEvent.click(cells()[0])
    await userEvent.keyboard("123")
    await expect(cells().map((c) => c.value).join("")).toBe("123")
    await userEvent.keyboard("{Backspace}")
    await expect(cells().map((c) => c.value).join("")).toBe("12")
    await userEvent.paste("987654")
    await expect(cells().map((c) => c.value).join("")).toBe("987654")
    await expect(canvasElement.querySelector('[data-testid="done"]')!.textContent).toBe("確認中: 987654")
  },
}

/** エラー表示。各セルが aria-invalid になり、枠が Caution 色になる。 */
export const Invalid: Story = {
  render: () => {
    const [code, setCode] = React.useState("1234")
    return (
      <div className="flex max-w-sm flex-col gap-2 p-4">
        <CodeInput length={4} value={code} onChange={setCode} invalid aria-label="認証コード" aria-describedby="otp-error" />
        <p id="otp-error" className="typo-body-sm text-[var(--Text-Caution)]">
          コードが違います。もう一度入力してください。
        </p>
      </div>
    )
  },
}

/**
 * 24 桁の招待コードのような長いコードは `variant="single"`。等幅・大きめ・字間広めの 1 入力で、
 * `pattern="alphanumeric"` + `uppercase` で英字を大文字にそろえ、ハイフン・空白は自動で落とす。
 * Input に `typo-heading-2xl tracking-wider` を被せて自作しない。
 */
export const LongInviteCode: Story = {
  render: () => {
    const [invite, setInvite] = React.useState("")
    return (
      <div className="flex max-w-sm flex-col gap-2 p-4">
        <Label htmlFor="invite-code">招待コード</Label>
        <CodeInput
          id="invite-code"
          variant="single"
          length={24}
          pattern="alphanumeric"
          uppercase
          value={invite}
          onChange={setInvite}
          placeholder="A1B2C3D4E5F60718293A4B5C"
        />
      </div>
    )
  },
}

export const Disabled: Story = {
  render: () => (
    <div className="max-w-sm p-4">
      <CodeInput length={6} defaultValue="123" disabled aria-label="認証コード" />
    </div>
  ),
}
