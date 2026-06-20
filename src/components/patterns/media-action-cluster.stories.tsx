import type { Meta, StoryObj } from "@storybook/react"
import type * as React from "react"
import { Bookmark, Heart, MessageText, Share } from "iconsax-reactjs"
import { MediaActionCluster } from "./media-action-cluster"

const meta: Meta<typeof MediaActionCluster> = {
  title: "Components/MediaActionCluster",
  component: MediaActionCluster,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
}
export default meta
type Story = StoryObj<typeof MediaActionCluster>

const ITEMS = [
  { label: "いいね", icon: <Heart size={22} />, active: true, badge: 128 },
  { label: "コメント", icon: <MessageText size={22} />, badge: 24 },
  { label: "保存", icon: <Bookmark size={22} /> },
  { label: "シェア", icon: <Share size={22} /> },
]

function MediaFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--Surface-Inverse)]">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, rgba(20,20,28,0.98) 0%, rgba(35,42,58,0.88) 45%, rgba(94,45,90,0.86) 100%)",
        }}
      />
      <div className="absolute inset-x-0 top-0 h-40 media-scrim-top" />
      <div className="absolute inset-x-0 bottom-0 h-56 media-scrim-bottom" />
      <div className="relative z-10 flex min-h-screen flex-col justify-end p-6 pb-24">
        <p className="typo-label-sm text-on-media-secondary">予告編</p>
        <h2 className="mt-2 max-w-sm typo-heading-xl text-on-media">週末の上映ラインナップ</h2>
        <p className="mt-2 max-w-sm typo-body-md text-on-media-secondary">
          花火と音楽に包まれる夜、会場の熱気を短いクリップで振り返ります。
        </p>
      </div>
      {children}
    </div>
  )
}

export const Vertical: Story = {
  render: () => (
    <MediaFrame>
      <MediaActionCluster items={ITEMS} orientation="vertical" anchor="bottom-right" />
    </MediaFrame>
  ),
}

export const Horizontal: Story = {
  render: () => (
    <MediaFrame>
      <MediaActionCluster
        items={ITEMS.slice(0, 3)}
        orientation="horizontal"
        anchor="bottom-left"
        labelPosition="side"
      />
    </MediaFrame>
  ),
}

export const AutoLandscape: Story = {
  name: "Auto orientation",
  render: () => (
    <MediaFrame>
      <MediaActionCluster items={ITEMS} orientation="auto" anchor="center-right" />
    </MediaFrame>
  ),
}

export const WithoutAutoHide: Story = {
  name: "No auto-hide",
  render: () => (
    <MediaFrame>
      <MediaActionCluster items={ITEMS.slice(0, 3)} autoHideMs={null} anchor="top-right" />
    </MediaFrame>
  ),
}
