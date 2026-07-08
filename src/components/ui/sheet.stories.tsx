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
      <SheetContent side="bottom" className="px-5 pt-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
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
      <SheetContent side="float" className="px-5 pt-5 pb-5">
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

export const A11yOptions: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary">アクセシビリティ設定付きシート</Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        autoFocus="title"
        closeOnEsc={false}
        restoreFocusOnClose
        bodyScrollLock
        description="初期フォーカス、Escキー、フォーカス復帰、スクロールロックを明示したシートです。"
      >
        <SheetHeader className="mb-4">
          <SheetTitle>通知設定</SheetTitle>
        </SheetHeader>
        <p className="typo-body-md text-[var(--Text-Medium-Emphasis)]">
          通知の受信方法と配信頻度を確認します。
        </p>
        <SheetFooter className="mt-6">
          <SheetClose asChild>
            <Button className="w-full">完了</Button>
          </SheetClose>
        </SheetFooter>
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
      // Cap the story container at 720px so the floating sheet at
      // viewport-bottom stays inside Storybook's visible canvas. Without
      // this cap Storybook fills the addon panel area with iframe and
      // `bottom-3` sheet ends up clipped.
      className="relative w-full overflow-hidden flex flex-col items-center justify-center gap-6 p-8"
      style={{
        height: "min(100vh, 720px)",
        background:
          "linear-gradient(160deg, #a8c8f8 0%, #3b82f6 60%, #1e3a8a 100%)",
      }}
    >
      <p className="text-white typo-heading-md opacity-70">背景コンテンツ</p>
      <p className="text-white typo-body-sm opacity-50">ボタンを押してガラスシートを開く</p>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="secondary" size="lg">ガラスシートを開く</Button>
        </SheetTrigger>
        <SheetContent
          side="float-glass"
          // `absolute` (not `fixed`) so it anchors to the story container
          // (which has `position: relative`) instead of the iframe viewport.
          // This is a Storybook-specific override — in real apps the
          // `float-glass` variant still floats relative to the viewport.
          className="absolute! px-5 pt-5 pb-5"
        >
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
        <SheetContent side="bottom-glass" className="px-5 pt-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
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


// ─── Swipe-to-close (non-snap) ────────────────────────────────────────────────
//
// 内容サイズで開く通常の bottom sheet に swipe-to-close を足す例。
// snap 不要だが「バーを引っ張って閉じたい」用途（ログイン・通知・確認）向け。

export const BottomSheetSwipeToClose: Story = {
  name: "BottomSheet — swipeToClose",
  parameters: { layout: "fullscreen" },
  render: () => {
    const [open, setOpen] = React.useState(false)
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center gap-3 bg-[var(--Surface-Secondary)] p-8">
        <p className="typo-body-sm text-[var(--Text-Medium-Emphasis)]">
          シート上のどこでも下にスワイプすると閉じます（ハンドル / 本文どちらでも・30% 以上で dismiss）
        </p>
        <Button onClick={() => setOpen(true)}>シートを開く</Button>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent
            side="bottom"
            swipeToClose
            className="pb-[max(1.5rem,env(safe-area-inset-bottom))]"
          >
            <SheetHeader className="mb-4">
              <SheetTitle>確認</SheetTitle>
              <SheetDescription>
                バーでも本文でも、下にスワイプすれば閉じられます。スクロール領域は先頭にいるときだけ閉じ操作になります。
              </SheetDescription>
            </SheetHeader>
            <p className="typo-body-md text-[var(--Text-Medium-Emphasis)] mb-4">
              ログイン入力や確認ダイアログのような content-sized なシートに最適。
            </p>
            {/*
              実機（Android Chrome / iOS Safari）で textarea にフォーカスして
              仮想キーボードを開いても、シート上端（タイトル / ドラッグハンドル）
              が画面外へ抜けないことを確認する。
            */}
            <textarea
              className="w-full rounded-lg border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] p-3 typo-body-md text-[var(--Text-High-Emphasis)] mb-6"
              rows={3}
              placeholder="ここにフォーカスすると仮想キーボードが開きます"
            />
            <SheetFooter>
              <SheetClose asChild>
                <Button className="w-full" size="lg">確定</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    )
  },
}

// 全画面 + スクロールありの swipeToClose。実機（SP）で全面スワイプ閉じと
// スクロール保護（途中は閉じない／先頭で下スワイプ→閉じる）を確認する用。
export const BottomSheetSwipeFullHeight: Story = {
  name: "BottomSheet — swipeToClose (full height / scrollable)",
  parameters: { layout: "fullscreen" },
  render: () => {
    const [open, setOpen] = React.useState(false)
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center gap-3 bg-[var(--Surface-Secondary)] p-8">
        <p className="typo-body-sm text-[var(--Text-Medium-Emphasis)] text-center max-w-xs">
          SP 確認用。本文どこでも下スワイプで閉じる（スクロールが先頭のとき）。スクロール途中は閉じずスクロール優先。
        </p>
        <Button onClick={() => setOpen(true)}>全画面シートを開く</Button>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="bottom" swipeToClose className="h-[90dvh]">
            <SheetHeader className="mb-4">
              <SheetTitle>タスク詳細</SheetTitle>
              <SheetDescription>
                バー・本文どちらでも下スワイプで閉じます。下までスクロール→先頭に戻すと再び閉じられます。
              </SheetDescription>
            </SheetHeader>
            <div className="flex flex-col gap-3">
              {Array.from({ length: 30 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] p-4 typo-body-md text-[var(--Text-High-Emphasis)]"
                >
                  行 {i + 1} — ここを下スワイプしても（先頭なら）閉じる。スクロール中は閉じない。
                </div>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    )
  },
}

// ─── Snap points ──────────────────────────────────────────────────────────────

export const BottomSheetSnap: Story = {
  name: "BottomSheet — Snap 0.4/0.9",
  parameters: { layout: "fullscreen" },
  render: () => {
    const [open, setOpen] = React.useState(false)
    const [snap, setSnap] = React.useState<number | string | null>(0.9)
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center gap-3 bg-[var(--Surface-Secondary)] p-8">
        <p className="typo-body-sm text-[var(--Text-Medium-Emphasis)]">
          現在の snap: <code>{String(snap)}</code>
        </p>
        <Button onClick={() => setOpen(true)}>2段階シートを開く</Button>
        <Sheet
          open={open}
          onOpenChange={setOpen}
          snapPoints={[0.4, 0.9]}
          activeSnapPoint={snap}
          setActiveSnapPoint={setSnap}
        >
          <SheetContent side="bottom" className="px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            <SheetHeader className="mb-4">
              <SheetTitle>2段階ボトムシート</SheetTitle>
              <SheetDescription>
                ドラッグハンドルを上下にドラッグすると 40% / 90% に吸着します。最下段より下にドラッグすると閉じます。
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-3 typo-body-md">
              {Array.from({ length: 20 }).map((_, i) => (
                <p key={i} className="rounded-lg bg-[var(--Surface-Secondary)] p-3">
                  コンテンツ行 {i + 1}
                </p>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    )
  },
}



// ─── Snap (push-up layout) ────────────────────────────────────────────────────
//
// 上半分が「メディアプレースホルダー」、下半分がスナップ式のシート。
// シート展開に応じてメディア領域の高さを縮め、シートと並ぶように見せる
// "push-up" レイアウト。Sheet 側は `overlay={false}` で背景を出さず、
// `activeSnapPoint` の連続更新を受けて親が `flex` のサイズを動かす。

export const BottomSheetPushUp: Story = {
  name: "BottomSheet — Snap (push-up layout)",
  parameters: { layout: "fullscreen" },
  render: () => {
    const [open, setOpen] = React.useState(true)
    const [snap, setSnap] = React.useState<number | string | null>(0.65)

    // メディア領域の高さ = (1 - 現在の snap) × viewport
    const mediaRatio = React.useMemo(() => {
      if (!open || snap == null) return 1
      const n = typeof snap === "number" ? snap : parseFloat(snap)
      return Math.max(0, Math.min(1, 1 - n))
    }, [open, snap])

    return (
      <div className="w-full h-screen flex flex-col bg-black text-white overflow-hidden">
        {/* メディア領域（snap に追従して縮む） */}
        <div
          className="flex items-center justify-center bg-[linear-gradient(135deg,#1f2937,#4b5563)] transition-[height] duration-150"
          style={{ height: `${mediaRatio * 100}%` }}
        >
          <div className="text-center">
            <p className="typo-heading-md opacity-80">メディアプレースホルダー</p>
            <p className="typo-body-sm opacity-50 mt-1">
              snap に追従して縮みます
            </p>
            {!open && (
              <Button
                className="mt-4"
                onClick={() => {
                  setSnap(0.65)
                  setOpen(true)
                }}
              >
                シートを開く
              </Button>
            )}
          </div>
        </div>

        <Sheet
          open={open}
          onOpenChange={setOpen}
          snapPoints={[0.65, 1]}
          activeSnapPoint={snap}
          setActiveSnapPoint={setSnap}
          overlay={false}
        >
          <SheetContent
            side="bottom"
            className="px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
          >
            <SheetClose asChild>
              <button
                type="button"
                aria-label="閉じる"
                className="absolute top-4 right-4 w-11 h-11 inline-flex items-center justify-center rounded-full bg-[var(--Surface-Secondary)] text-[var(--Text-Medium-Emphasis)] hover:bg-[var(--Surface-Tertiary)] active:opacity-70 transition-opacity"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M4 4L14 14M14 4L4 14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </SheetClose>
            <SheetHeader className="mb-4 pr-14">
              <SheetTitle>詳細</SheetTitle>
              <SheetDescription>
                ハンドルを上下にドラッグして 65% / 100% に吸い寄せ。下に強くドラッグで閉じる。
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-3 typo-body-md">
              {Array.from({ length: 20 }).map((_, i) => (
                <p
                  key={i}
                  className="rounded-lg bg-[var(--Surface-Secondary)] p-3"
                >
                  項目 {i + 1}
                </p>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    )
  },
}

// ─── Nested sheets (#158) ──────────────────────────────────────────────────────
//
// 多段 Sheet: 下のシート（全画面 bottom）の上に、確認用の 2 枚目シートを開く。
// 修正前は overlay z-40 / content z-50 が両インスタンス共通固定だったため、
// 2 枚目の overlay が 1 枚目の全画面 content（同じ z-50）に覆われ暗転しなかった。
// 現在はグローバルスタックの深度に応じて z が繰り上がる
// （1 枚目: overlay 40 / content 50、2 枚目: overlay 60 / content 70）ため、
// 2 枚目の overlay が 1 枚目の content の上に正しく重なって暗転する。
export const NestedSheets: Story = {
  name: "BottomSheet — nested (#158)",
  parameters: { layout: "fullscreen" },
  render: () => {
    const [outerOpen, setOuterOpen] = React.useState(false)
    const [innerOpen, setInnerOpen] = React.useState(false)
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center gap-3 bg-[var(--Surface-Secondary)] p-8">
        <p className="typo-body-sm text-[var(--Text-Medium-Emphasis)] text-center max-w-sm">
          1 枚目（全画面）を開いてから「確認シートを開く」を押すと 2 枚目が重なる。
          2 枚目の背後（1 枚目の内容）が正しく暗転していれば OK。
        </p>
        <Button onClick={() => setOuterOpen(true)}>1 枚目のシートを開く</Button>
        <Sheet open={outerOpen} onOpenChange={setOuterOpen}>
          <SheetContent side="bottom" className="h-[90dvh]">
            <SheetHeader className="mb-4">
              <SheetTitle>1 枚目（全画面）</SheetTitle>
              <SheetDescription>
                ここから 2 枚目の確認シートを開ける。2 枚目が開いている間、この内容がうっすら暗転して見えるはず。
              </SheetDescription>
            </SheetHeader>
            <Button onClick={() => setInnerOpen(true)} className="mb-4">
              確認シートを開く
            </Button>
            <div className="flex flex-col gap-3">
              {Array.from({ length: 15 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] p-4 typo-body-md text-[var(--Text-High-Emphasis)]"
                >
                  1 枚目の行 {i + 1}
                </div>
              ))}
            </div>
          </SheetContent>
        </Sheet>
        {/*
          2 枚目は 1 枚目の <SheetContent> の子として開くトリガーだが、
          Portal 先は共に document.body なので DOM 上は兄弟。
          グローバルスタック（Context ではない）で深度を判定する理由の実例。
        */}
        <Sheet open={innerOpen} onOpenChange={setInnerOpen}>
          <SheetContent
            side="bottom"
            swipeToClose
            className="pb-[max(1.5rem,env(safe-area-inset-bottom))]"
          >
            <SheetHeader className="mb-4">
              <SheetTitle>確認</SheetTitle>
              <SheetDescription>
                この確認シートの overlay が 1 枚目のシート全体を正しく覆って暗転していることを確認する。
              </SheetDescription>
            </SheetHeader>
            <SheetFooter>
              <SheetClose asChild>
                <Button variant="secondary" className="w-full">キャンセル</Button>
              </SheetClose>
              <Button className="w-full" onClick={() => setInnerOpen(false)}>
                確定
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    )
  },
}
