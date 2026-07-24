import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  AutoPrompt,
  PromptCoordinatorProvider,
} from "@/components/patterns/prompt-coordinator"

const PromptCoordinatorDemo = () => {
  const [paywall, setPaywall] = React.useState(false)
  const [review, setReview] = React.useState(false)

  return (
    <PromptCoordinatorProvider gapMs={400}>
      <div className="flex gap-3">
        <Button onClick={() => setReview(true)}>レビュー訴求を予約</Button>
        <Button onClick={() => setPaywall(true)}>ペイウォールを予約</Button>
      </div>
      <AutoPrompt id="review" priority={30} when={review}>
        {({ open, status, close }) => (
          <div aria-live="polite">
            review: {status}
            {open ? (
              <Button
                onClick={() => {
                  setReview(false)
                  close()
                }}
              >
                レビュー訴求を閉じる
              </Button>
            ) : null}
          </div>
        )}
      </AutoPrompt>
      <AutoPrompt id="paywall" priority={50} when={paywall}>
        {({ open, status, close }) => (
          <div aria-live="polite">
            paywall: {status}
            {open ? (
              <Button
                onClick={() => {
                  setPaywall(false)
                  close()
                }}
              >
                ペイウォールを閉じる
              </Button>
            ) : null}
          </div>
        )}
      </AutoPrompt>
    </PromptCoordinatorProvider>
  )
}

const meta = {
  title: "Patterns/PromptCoordinator",
  component: PromptCoordinatorDemo,
  parameters: {
    docs: {
      description: {
        component:
          "自動表示プロンプトを priority 降順・FIFO で1件ずつ表示する headless 調停プリミティブ。",
      },
    },
  },
} satisfies Meta<typeof PromptCoordinatorDemo>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
