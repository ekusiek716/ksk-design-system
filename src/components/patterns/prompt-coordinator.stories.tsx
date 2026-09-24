import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"
import { expect, userEvent, within } from "storybook/test"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { Container } from "@/components/ui/container"
import { Section } from "@/components/ui/section"
import {
  AutoPrompt,
  PromptCoordinatorProvider,
  type PromptSlotStatus,
} from "@/components/patterns/prompt-coordinator"

const statusLabels: Record<PromptSlotStatus, string> = {
  idle: "未予約",
  queued: "順番待ち",
  active: "表示中",
}

const statusDescriptions: Record<PromptSlotStatus, string> = {
  idle: "予約すると、ほかの案内と重ならずに表示されます。",
  queued: "表示中の案内が閉じるのを待っています。",
  active: "この案内を表示しています。閉じると次の予約へ進みます。",
}

function PromptDemoCard({
  title,
  actionLabel,
  status,
  requested,
  onRequest,
  onClose,
}: {
  title: string
  actionLabel: string
  status: PromptSlotStatus
  requested: boolean
  onRequest: () => void
  onClose: () => void
}) {
  return (
    <Card role="region" aria-label={title}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <h2 className="min-w-0 flex-1 typo-heading-md text-[var(--Text-High-Emphasis)]">
          {title}
        </h2>
        <Badge role="status" variant={status === "active" ? "info" : "secondary"}>
          {statusLabels[status]}
        </Badge>
      </div>
      <CardContent>
        <CardDescription>{statusDescriptions[status]}</CardDescription>
      </CardContent>
      <CardFooter className="flex-col items-stretch sm:flex-row sm:items-center">
        <Button variant="secondary" disabled={requested} onClick={onRequest}>
          {actionLabel}を予約
        </Button>
        {status === "active" ? (
          <Button onClick={onClose}>{actionLabel}を閉じる</Button>
        ) : null}
      </CardFooter>
    </Card>
  )
}

const PromptCoordinatorDemo = () => {
  const [paywall, setPaywall] = React.useState(false)
  const [review, setReview] = React.useState(false)

  return (
    <PromptCoordinatorProvider gapMs={400}>
      <Section spacing="sm" background="subtle">
        <Container size="narrow" gutter="tight" className="flex flex-col gap-6">
          <header className="flex flex-col gap-2">
            <h1 className="typo-heading-2xl text-[var(--Text-High-Emphasis)]">
              案内の表示順を試す
            </h1>
            <p className="typo-body-sm text-[var(--Text-Medium-Emphasis)]">
              2種類の案内を、1件ずつ表示するデモです。片方の表示中にもう片方を予約すると、閉じた後に切り替わります。
            </p>
          </header>
          <AutoPrompt id="review" priority={30} when={review}>
            {({ status, close }) => (
              <PromptDemoCard
                title="レビューのお願い"
                actionLabel="レビュー"
                status={status}
                requested={review}
                onRequest={() => setReview(true)}
                onClose={() => {
                  setReview(false)
                  close()
                }}
              />
            )}
          </AutoPrompt>
          <AutoPrompt id="paywall" priority={50} when={paywall}>
            {({ status, close }) => (
              <PromptDemoCard
                title="有料プランの案内"
                actionLabel="プラン案内"
                status={status}
                requested={paywall}
                onRequest={() => setPaywall(true)}
                onClose={() => {
                  setPaywall(false)
                  close()
                }}
              />
            )}
          </AutoPrompt>
        </Container>
      </Section>
    </PromptCoordinatorProvider>
  )
}

const meta = {
  title: "Patterns/PromptCoordinator",
  component: PromptCoordinatorDemo,
  parameters: {
    layout: "fullscreen",
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

export const QueuesAndResumes: Story = {
  name: "予約した案内を順番に表示する",
  tags: ["interaction", "!autodocs"],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const reviewCard = within(canvas.getByRole("region", { name: "レビューのお願い" }))
    const paywallCard = within(canvas.getByRole("region", { name: "有料プランの案内" }))
    const reserveReview = reviewCard.getByRole("button", { name: "レビューを予約" })
    const reservePaywall = paywallCard.getByRole("button", { name: "プラン案内を予約" })

    await expect(reviewCard.getByRole("status")).toHaveTextContent("未予約")
    await expect(paywallCard.getByRole("status")).toHaveTextContent("未予約")
    await userEvent.click(reserveReview)
    const closeReview = await reviewCard.findByRole("button", { name: "レビューを閉じる" })
    await expect(reviewCard.getByRole("status")).toHaveTextContent("表示中")
    await expect(reserveReview).toBeDisabled()

    // 優先度の高い候補でも、すでに表示中の案内を中断せず順番を待つ。
    await userEvent.click(reservePaywall)
    await expect(paywallCard.getByRole("status")).toHaveTextContent("順番待ち")
    await expect(reservePaywall).toBeDisabled()
    await expect(paywallCard.queryByRole("button", { name: "プラン案内を閉じる" })).toBeNull()
    await expect(reviewCard.getByRole("status")).toHaveTextContent("表示中")

    await userEvent.click(closeReview)
    const closePaywall = await paywallCard.findByRole("button", { name: "プラン案内を閉じる" })
    await expect(reviewCard.getByRole("status")).toHaveTextContent("未予約")
    await expect(reserveReview).toBeEnabled()
    await expect(paywallCard.getByRole("status")).toHaveTextContent("表示中")
    await expect(reviewCard.queryByRole("button", { name: "レビューを閉じる" })).toBeNull()

    await userEvent.click(closePaywall)
    await expect(paywallCard.getByRole("status")).toHaveTextContent("未予約")
    await expect(reservePaywall).toBeEnabled()
  },
}
