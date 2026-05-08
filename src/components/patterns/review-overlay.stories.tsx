import type { Meta, StoryObj } from "@storybook/react"
import React, { useState } from "react"
import { ReviewOverlay, ReviewPin } from "./review-overlay"

const meta: Meta<typeof ReviewOverlay> = {
  title: "Patterns/ReviewOverlay",
  component: ReviewOverlay,
  parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof ReviewOverlay>

export const Default: Story = {
  render: () => {
    const [active, setActive] = useState(false)
    const [pins, setPins] = useState<ReviewPin[]>([])
    return (
      <div className="space-y-3">
        <button
          onClick={() => setActive((v) => !v)}
          className={`px-4 py-2 rounded-lg typo-label-sm font-medium ${active ? "bg-red-500 text-white" : "bg-[var(--Surface-Secondary)] text-[var(--Text-High-Emphasis)]"}`}
        >
          {active ? "レビューモード ON" : "レビューモード OFF"}
        </button>
        <ReviewOverlay
          active={active}
          pins={pins}
          onPinCreate={(pos) =>
            setPins((prev) => [...prev, { id: crypto.randomUUID(), ...pos }])
          }
          onPinClick={(pin) => alert(`ピン: x=${pin.x.toFixed(2)}, y=${pin.y.toFixed(2)}`)}
          className="w-[300px] h-[200px] rounded-2xl overflow-hidden"
        >
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
            <p className="typo-body-sm text-[var(--Text-Medium-Emphasis)]">
              {active ? "長押しでピンを追加" : "上のボタンでレビューモードを開始"}
            </p>
          </div>
        </ReviewOverlay>
        {pins.length > 0 && (
          <p className="typo-body-xs text-[var(--Text-Low-Emphasis)]">{pins.length}件のピン</p>
        )}
      </div>
    )
  },
}

export const WithPins: Story = {
  render: () => (
    <ReviewOverlay
      active
      pins={[
        { id: "1", x: 0.2, y: 0.3, comment: "ここのフォントが小さい" },
        { id: "2", x: 0.7, y: 0.6, comment: "ボタンの色を変えたい" },
      ]}
      onPinClick={(pin) => alert(pin.comment)}
      className="w-[300px] h-[200px] rounded-2xl overflow-hidden"
    >
      <div className="w-full h-full bg-gradient-to-br from-green-100 to-blue-100" />
    </ReviewOverlay>
  ),
}
