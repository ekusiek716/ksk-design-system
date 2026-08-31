import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  ResponsiveDialog,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "@/components/ui/responsive-dialog"
import { DetailSheetHeader, DetailSheetScaffold } from "./detail-sheet-scaffold"
import { ResponsiveOverlayFooter, ResponsiveOverlayFrame } from "./responsive-overlay-frame"
import type { BottomSheetFramePreset } from "./bottom-sheet-frame"
import type { ResponsiveOverlayBreakpoint } from "@/components/ui/responsive-dialog"

const meta: Meta<typeof ResponsiveOverlayFrame> = {
  title: "Patterns/ResponsiveOverlayFrame",
  component: ResponsiveOverlayFrame,
  parameters: {
    docs: {
      description: {
        component:
          "モバイルでは BottomSheetFrame の preset を保ち、デスクトップでは中央モーダル（DialogContent）として出す overlay frame（issue #472）。切り替え境界は <ResponsiveDialog breakpoint> で決める。Storybook のビューポートを切り替えると分岐が確認できる。",
      },
    },
  },
}
export default meta

type Story = StoryObj<typeof ResponsiveOverlayFrame>

function ShortForm({
  preset = "mobile-form",
  breakpoint = "md",
}: {
  preset?: BottomSheetFramePreset
  breakpoint?: ResponsiveOverlayBreakpoint
}) {
  const [open, setOpen] = React.useState(false)
  const id = React.useId()
  return (
    <ResponsiveDialog open={open} onOpenChange={setOpen} breakpoint={breakpoint}>
      <ResponsiveDialogTrigger asChild>
        <Button>{`${preset} / ${breakpoint} で開く`}</Button>
      </ResponsiveDialogTrigger>
      <ResponsiveOverlayFrame preset={preset} description="予定の内容を編集します">
        <DetailSheetScaffold
          header={
            <DetailSheetHeader
              title={<ResponsiveDialogTitle>予定を編集</ResponsiveDialogTitle>}
              description="モバイルはボトムシート、デスクトップは中央モーダルになります。"
            />
          }
          footer={
            <ResponsiveOverlayFooter className="flex gap-3 [&>*]:flex-1">
              <Button variant="secondary" onClick={() => setOpen(false)}>
                キャンセル
              </Button>
              <Button onClick={() => setOpen(false)}>保存する</Button>
            </ResponsiveOverlayFooter>
          }
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${id}-title`}>タイトル</Label>
              <Input id={`${id}-title`} defaultValue="検診" />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${id}-memo`}>メモ</Label>
              <Input id={`${id}-memo`} defaultValue="持ち物を確認" />
            </div>
          </div>
        </DetailSheetScaffold>
      </ResponsiveOverlayFrame>
    </ResponsiveDialog>
  )
}

/** 短いフォーム。既定の mobile-form / md 境界。 */
export const ShortFormExample: Story = {
  name: "Short form (mobile-form)",
  render: () => <ShortForm />,
}

/** 長いキーボード対応フォーム。本文はスクロールし、フッタは追従して残る。 */
export const LongKeyboardAwareForm: Story = {
  name: "Long keyboard-aware form (mobile-page)",
  render: function Render() {
    const [open, setOpen] = React.useState(false)
    const id = React.useId()
    return (
      <ResponsiveDialog open={open} onOpenChange={setOpen} breakpoint="md">
        <ResponsiveDialogTrigger asChild>
          <Button>長いフォームを開く</Button>
        </ResponsiveDialogTrigger>
        <ResponsiveOverlayFrame
          preset="mobile-page"
          description="項目の多いフォームを編集します"
        >
          <DetailSheetScaffold
            header={
              <DetailSheetHeader
                title={<ResponsiveDialogTitle>申込内容</ResponsiveDialogTitle>}
                description="入力中はフッタがソフトキーボードの上に追従します。"
              />
            }
            footer={
              <ResponsiveOverlayFooter className="flex gap-3 [&>*]:flex-1">
                <Button variant="secondary" onClick={() => setOpen(false)}>
                  あとで
                </Button>
                <Button onClick={() => setOpen(false)}>送信する</Button>
              </ResponsiveOverlayFooter>
            }
          >
            <div className="space-y-4">
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} className="space-y-2">
                  <Label htmlFor={`${id}-field-${i}`}>{`項目 ${i + 1}`}</Label>
                  <Input id={`${id}-field-${i}`} placeholder="入力してください" />
                </div>
              ))}
              <div className="space-y-2">
                <Label htmlFor={`${id}-note`}>備考</Label>
                <Textarea id={`${id}-note`} placeholder="補足があれば記入してください" />
              </div>
            </div>
          </DetailSheetScaffold>
        </ResponsiveOverlayFrame>
      </ResponsiveDialog>
    )
  },
}

/** 全画面級 preset。デスクトップでは背の高い中央モーダルになる。 */
export const MobileFullPreset: Story = {
  name: "mobile-full preset",
  render: () => <ShortForm preset="mobile-full" />,
}

/** 境界を lg（1024px）へ広げた例。タブレット幅でもシートのまま。 */
export const LargeBreakpoint: Story = {
  name: "breakpoint=lg",
  render: () => <ShortForm breakpoint="lg" />,
}

/**
 * product theme の `--Overlay-Desktop-Breakpoint` に従う例。
 * この変数は `document.documentElement`（`:root`）から読むため、
 * 消費プロダクトは product-theme.css で `:root` に置く。
 */
export const ProductThemeBreakpoint: Story = {
  name: "breakpoint=product-theme",
  render: function Render() {
    React.useEffect(() => {
      const root = document.documentElement
      const previous = root.style.getPropertyValue("--Overlay-Desktop-Breakpoint")
      root.style.setProperty("--Overlay-Desktop-Breakpoint", "1280px")
      return () => {
        if (previous) root.style.setProperty("--Overlay-Desktop-Breakpoint", previous)
        else root.style.removeProperty("--Overlay-Desktop-Breakpoint")
      }
    }, [])
    return <ShortForm breakpoint="product-theme" />
  },
}

/**
 * snap point 付きシートは境界を越えてもシートのまま（issue #472 の受け入れ条件）。
 * snap は「掴んで高さを変える」操作そのものが機能なので、中央モーダルへ
 * 変換すると意味が失われる。デスクトップ幅でも下部シートで表示される。
 */
export const SnapSheetStaysSheet: Story = {
  name: "snapPoints は dialog に変換されない",
  render: function Render() {
    const [open, setOpen] = React.useState(false)
    return (
      <ResponsiveDialog
        open={open}
        onOpenChange={setOpen}
        breakpoint="md"
        snapPoints={[0.4, 0.9]}
      >
        <ResponsiveDialogTrigger asChild>
          <Button>snap シートを開く</Button>
        </ResponsiveDialogTrigger>
        <ResponsiveOverlayFrame preset="mobile-page" description="高さを掴んで変えられます">
          <DetailSheetScaffold
            header={
              <DetailSheetHeader
                title={<ResponsiveDialogTitle>候補一覧</ResponsiveDialogTitle>}
                description="デスクトップ幅でもシートのままです。"
              />
            }
          >
            <div className="space-y-3">
              {Array.from({ length: 12 }, (_, i) => (
                <div
                  key={i}
                  className="typo-body-md rounded-[var(--Radius-Surface)] border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] px-4 py-3 text-[var(--Text-High-Emphasis)]"
                >
                  {`候補 ${i + 1}`}
                </div>
              ))}
            </div>
          </DetailSheetScaffold>
        </ResponsiveOverlayFrame>
      </ResponsiveDialog>
    )
  },
}

/**
 * `side="float"`（issue #479）。モバイルは左右・下に余白を持つカード型のまま、
 * デスクトップでは同じ寸法（32rem / min(85dvh,46rem)）の中央モーダルになる。
 * preset ではなく `padding` が効く。
 */
export const FloatSide: Story = {
  name: "float サイド（カード型）",
  render: function Render() {
    const [open, setOpen] = React.useState(false)
    return (
      <ResponsiveDialog open={open} onOpenChange={setOpen} breakpoint="lg">
        <ResponsiveDialogTrigger asChild>
          <Button>float シートを開く</Button>
        </ResponsiveDialogTrigger>
        <ResponsiveOverlayFrame side="float" description="操作を確認します">
          <div className="space-y-4">
            <ResponsiveDialogTitle>この予定を削除しますか？</ResponsiveDialogTitle>
            <p className="typo-body-md text-[var(--Text-Medium-Emphasis)]">
              削除すると元に戻せません。関連するメモも一緒に削除されます。
            </p>
            <div className="flex gap-3 [&>*]:flex-1">
              <Button variant="secondary" onClick={() => setOpen(false)}>
                キャンセル
              </Button>
              <Button onClick={() => setOpen(false)}>削除する</Button>
            </div>
          </div>
        </ResponsiveOverlayFrame>
      </ResponsiveDialog>
    )
  },
}

/** `side="float-glass"`。float の Liquid Glass 版。両分岐で同じ素材になる。 */
export const FloatGlassSide: Story = {
  name: "float-glass サイド（ガラス素材）",
  render: function Render() {
    const [open, setOpen] = React.useState(false)
    return (
      <div className="min-h-64 rounded-[var(--Radius-Surface)] bg-[var(--Surface-Accent-Primary-Light)] p-6">
        <ResponsiveDialog open={open} onOpenChange={setOpen} breakpoint="lg">
          <ResponsiveDialogTrigger asChild>
            <Button>float-glass シートを開く</Button>
          </ResponsiveDialogTrigger>
          <ResponsiveOverlayFrame side="float-glass" description="共有の設定">
            <div className="space-y-4">
              <ResponsiveDialogTitle>共有リンクを作成</ResponsiveDialogTitle>
              <p className="typo-body-md text-[var(--Text-Medium-Emphasis)]">
                リンクを知っている人が閲覧できます。あとから無効にできます。
              </p>
              <div className="flex gap-3 [&>*]:flex-1">
                <Button variant="secondary" onClick={() => setOpen(false)}>
                  やめる
                </Button>
                <Button onClick={() => setOpen(false)}>作成する</Button>
              </div>
            </div>
          </ResponsiveOverlayFrame>
        </ResponsiveDialog>
      </div>
    )
  },
}

/**
 * `preset="plain"`（issue #486）。preset を使わない素の bottom シート。
 * モバイルは全幅・下端固定・`p-6` のまま（タブレット幅でもフロートカード化
 * しない）で、デスクトップだけ中央モーダルになる。
 * 既存の素の `<SheetContent side="bottom">` をデスクトップ対応させる用。
 */
export const PlainBottomPreset: Story = {
  name: "plain preset（素の bottom シート）",
  render: function Render() {
    const [open, setOpen] = React.useState(false)
    return (
      <ResponsiveDialog open={open} onOpenChange={setOpen} breakpoint="lg">
        <ResponsiveDialogTrigger asChild>
          <Button>plain シートを開く</Button>
        </ResponsiveDialogTrigger>
        <ResponsiveOverlayFrame preset="plain" description="ログアウトの確認">
          <div className="space-y-4">
            <ResponsiveDialogTitle>ログアウトしますか？</ResponsiveDialogTitle>
            <p className="typo-body-md text-[var(--Text-Medium-Emphasis)]">
              この端末の表示は消えますが、サーバのデータは残ります。
            </p>
            <div className="flex gap-3 [&>*]:flex-1">
              <Button variant="secondary" onClick={() => setOpen(false)}>
                キャンセル
              </Button>
              <Button onClick={() => setOpen(false)}>ログアウト</Button>
            </div>
          </div>
        </ResponsiveOverlayFrame>
      </ResponsiveDialog>
    )
  },
}

