/**
 * @file CoachMarkOverlay のストーリー
 * @description 複数ステップの onboarding ツアー orchestrator。
 * querySelector で実 DOM 要素を探すため、story 内に target 要素を用意して確認する。
 */
import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { CoachMarkOverlay } from "./coach-mark-overlay"
import { Button } from "@/components/ui/button"

const meta: Meta<typeof CoachMarkOverlay> = {
  title: "Patterns/CoachMarkOverlay",
  component: CoachMarkOverlay,
  tags: ["autodocs"],
}
export default meta

type Story = StoryObj<typeof CoachMarkOverlay>

export const MultiStepTour: Story = {
  render: () => {
    const [open, setOpen] = React.useState(true)
    return (
      <div className="flex flex-col gap-6 p-8">
        <Button id="coach-target-1" variant="secondary" className="w-fit">
          ステップ1のボタン
        </Button>
        <Button id="coach-target-2" className="w-fit">
          ステップ2のボタン
        </Button>
        {!open && (
          <Button variant="ghost" size="sm" className="w-fit" onClick={() => setOpen(true)}>
            ツアーを再表示
          </Button>
        )}
        <CoachMarkOverlay
          open={open}
          steps={[
            {
              selector: "#coach-target-1",
              title: "ここから始めます",
              desc: "このボタンで最初の操作ができます。",
            },
            {
              selector: "#coach-target-2",
              title: "次はこちら",
              desc: "主要な操作はこのボタンから行います。",
            },
          ]}
          onComplete={() => setOpen(false)}
          onSkip={() => setOpen(false)}
        />
      </div>
    )
  },
}

export const BrandVariant: Story = {
  render: () => {
    const [open, setOpen] = React.useState(true)
    return (
      <div className="flex flex-col gap-6 p-8">
        <Button id="coach-target-brand" className="w-fit">
          注目してほしい操作
        </Button>
        {!open && (
          <Button variant="ghost" size="sm" className="w-fit" onClick={() => setOpen(true)}>
            ツアーを再表示
          </Button>
        )}
        <CoachMarkOverlay
          open={open}
          variant="brand"
          steps={[
            {
              selector: "#coach-target-brand",
              title: "新機能のご案内",
              desc: "ここから新しい機能を試せます。",
            },
          ]}
          onComplete={() => setOpen(false)}
        />
      </div>
    )
  },
}

/** 対象要素が見つからない場合は画面中央に dark overlay 付きでフォールバック表示する。 */
export const MissingTarget: Story = {
  render: () => {
    const [open, setOpen] = React.useState(true)
    return (
      <div className="p-8">
        {!open && (
          <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
            ツアーを再表示
          </Button>
        )}
        <CoachMarkOverlay
          open={open}
          steps={[
            {
              selector: "#does-not-exist",
              title: "対象要素が見つからない場合",
              desc: "画面中央にフォールバック表示されます。",
            },
          ]}
          onComplete={() => setOpen(false)}
        />
      </div>
    )
  },
}
