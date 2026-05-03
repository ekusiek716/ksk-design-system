/**
 * @file Skeleton のストーリー
 * @description ローディングスケルトンコンポーネント。カードスケルトン、テキストスケルトンを網羅
 */
import type { Meta, StoryObj } from "@storybook/react"
import { Skeleton } from "./skeleton"

const meta: Meta<typeof Skeleton> = {
  title: "Components/Skeleton",
  component: Skeleton,
}
export default meta

type Story = StoryObj<typeof Skeleton>

export const CardSkeleton: Story = {
  render: () => (
    <div className="flex flex-col gap-6 rounded-lg border border-[var(--Border-Low-Emphasis)] p-6">
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-3 w-[150px]" />
        </div>
      </div>
      <Skeleton className="h-[120px] w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20 rounded-full" />
        <Skeleton className="h-8 w-20 rounded-full" />
      </div>
    </div>
  ),
}

export const TextSkeleton: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-5 w-[250px]" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-[80%]" />
    </div>
  ),
}

export const AvatarWithText: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Skeleton className="size-12 rounded-full" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-[160px]" />
        <Skeleton className="h-3 w-[100px]" />
      </div>
    </div>
  ),
}
