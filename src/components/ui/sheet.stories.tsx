import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import {
  Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose,
} from "./sheet"
import { Button } from "./button"

const meta: Meta<typeof Sheet> = {
  title: "Components/Sheet",
  component: Sheet,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof Sheet>

// ─── Standard variants ────────────────────────────────────────────────────────

export const BottomSheet: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>ボトムシートを開く</Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="px-5 pt-0 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <SheetHeader className="mb-4">
          <SheetTitle>シートタイトル</SheetTitle>
          <SheetDescription>下から少しフェードインします。</SheetDescription>
        </SheetHeader>
        <p className="typo-body-md text-[var(--Text-Medium-Emphasis)] mb-6">
          コンテンツ領域です。フォームや一覧など何でも配置できます。
        </p>
        <SheetFooter>
          <SheetClose asChild>
            <Button className="w-full" size="lg">閉じる</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
}

export const FloatSheet: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary">フローティングシートを開く</Button>
      </SheetTrigger>
      <SheetContent side="float" className="px-5 pt-0 pb-5">
        <SheetHeader className="mb-4">
          <SheetTitle>追加する</SheetTitle>
          <SheetDescription>左右・下に余白があるカード型シートです。</SheetDescription>
        </SheetHeader>
        <SheetFooter className="flex-row gap-2">
          <SheetClose asChild>
            <Button variant="secondary" className="flex-1" size="lg">キャンセル</Button>
          </SheetClose>
          <SheetClose asChild>
            <Button className="flex-1" size="lg">追加する</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
}

export const RightSheet: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary">右シートを開く</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader className="mb-4">
          <SheetTitle>サイドパネル</SheetTitle>
          <SheetDescription>右から開くシートです。</SheetDescription>
        </SheetHeader>
        <p className="typo-body-md text-[var(--Text-Medium-Emphasis)]">
          詳細情報や設定パネルに使います。
        </p>
      </SheetContent>
    </Sheet>
  ),
}

// ─── Liquid Glass variants ────────────────────────────────────────────────────

export const FloatGlass: Story = {
  name: "Float Glass (Liquid Glass)",
  parameters: { layout: "fullscreen" },
  render: () => (
    <div
      className="w-full min-h-screen flex flex-col items-center justify-center gap-6 p-8"
      style={{ background: "linear-gradient(160deg, #a8c8f8 0%, #3b82f6 60%, #1e3a8a 100%)" }}
    >
      <p className="text-white typo-heading-md opacity-70">背景コンテンツ</p>
      <p className="text-white typo-body-sm opacity-50">ボタンを押してガラスシートを開く</p>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="secondary" size="lg">ガラスシートを開く</Button>
        </SheetTrigger>
        <SheetContent side="float-glass" className="px-5 pt-0 pb-5">
          <SheetHeader className="mb-4">
            <SheetTitle>Liquid Glass Sheet</SheetTitle>
            <SheetDescription>背景が透けるガラス素材のシートです。</SheetDescription>
          </SheetHeader>
          <SheetFooter className="flex-row gap-2">
            <SheetClose asChild>
              <Button variant="secondary" className="flex-1" size="lg">キャンセル</Button>
            </SheetClose>
            <SheetClose asChild>
              <Button className="flex-1" size="lg">OK</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  ),
}

export const BottomGlass: Story = {
  name: "Bottom Glass (Liquid Glass)",
  parameters: { layout: "fullscreen" },
  render: () => (
    <div
      className="w-full min-h-screen flex flex-col items-center justify-center gap-6 p-8"
      style={{ background: "linear-gradient(160deg, #f8a8c8 0%, #e83b82 60%, #8a1e4a 100%)" }}
    >
      <p className="text-white typo-heading-md opacity-70">背景コンテンツ</p>
      <p className="text-white typo-body-sm opacity-50">ボタンを押してガラスシートを開く</p>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="secondary" size="lg">ガラスボトムシートを開く</Button>
        </SheetTrigger>
        <SheetContent side="bottom-glass" className="px-5 pt-0 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <SheetHeader className="mb-4">
            <SheetTitle>アクション</SheetTitle>
            <SheetDescription>Liquid Glass ボトムシート。</SheetDescription>
          </SheetHeader>
          <SheetFooter>
            <SheetClose asChild>
              <Button className="w-full" size="lg">実行する</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  ),
}
