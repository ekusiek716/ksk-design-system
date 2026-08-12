/**
 * @file Dialog のストーリー
 * @description モーダルダイアログコンポーネント。トリガーボタン、ヘッダー、説明、フッターアクション付き
 */
import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, fn, userEvent, waitFor, within } from "storybook/test"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "./dialog"
import { Button } from "./button"
import { Checkbox } from "./checkbox"
import { Input } from "./input"
import { Label } from "./label"
import { RadioGroup, RadioGroupItem } from "./radio-group"
import { Sheet, SheetContent, SheetTitle } from "./sheet"
import { ConfirmDialog } from "../patterns/confirm-dialog"

const meta: Meta<typeof Dialog> = {
  title: "Components/Dialog",
  component: Dialog,
}
export default meta

type Story = StoryObj<typeof Dialog>

export const WithTrigger: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>ダイアログを開く</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>確認</DialogTitle>
          <DialogDescription>
            この操作を実行してもよろしいですか？この操作は取り消せません。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">キャンセル</Button>
          </DialogClose>
          <Button variant="destructive">削除する</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

export const WithForm: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>プロジェクトを作成</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新規プロジェクト</DialogTitle>
          <DialogDescription>
            プロジェクトの基本情報を入力してください。
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="project-name">プロジェクト名</Label>
            <Input id="project-name" placeholder="プロジェクト名を入力" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="project-desc">説明</Label>
            <Input id="project-desc" placeholder="プロジェクトの説明" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">キャンセル</Button>
          </DialogClose>
          <Button>作成する</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

export const FocusOptions: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>フォーカス制御を開く</Button>
      </DialogTrigger>
      <DialogContent
        autoFocus="first-input"
        closeOnEsc={false}
        restoreFocusOnClose
        bodyScrollLock
        description="初期フォーカスと閉じた後のフォーカス復帰を指定したダイアログです。"
      >
        <DialogHeader>
          <DialogTitle>招待メールを送信</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="invite-email">メールアドレス</Label>
          <Input id="invite-email" type="email" placeholder="name@example.com" />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">キャンセル</Button>
          </DialogClose>
          <Button>送信する</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

export const TopPositionLongList: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>チェックリストを開く</Button>
      </DialogTrigger>
      <DialogContent
        position="top"
        autoFocus="title"
        description="長いチェックリストを上部寄せで表示します。"
      >
        <DialogHeader>
          <DialogTitle>公開前チェック</DialogTitle>
          <DialogDescription>必要な項目を確認してください。</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          {[
            "画像の表示崩れがない",
            "価格と在庫数が一致している",
            "公開日時が正しい",
            "通知文面を確認した",
            "利用規約リンクが有効",
            "タグとカテゴリが適切",
            "モバイル表示を確認した",
            "管理者コメントを確認した",
          ].map((label) => (
            <label key={label} className="flex items-center gap-3">
              <Checkbox />
              <span className="typo-body-md text-[var(--Text-High-Emphasis)]">{label}</span>
            </label>
          ))}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">キャンセル</Button>
          </DialogClose>
          <Button>完了</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

/**
 * position="fullscreen"（Issue #339）。inset-0 で画面いっぱいに広がり、
 * モバイルのウィザード/エディタ等 Dialog をページ代わりに使う場面向け。
 * 既定 (safeArea=true) で上下に env(safe-area-inset-top/bottom) を確保し、
 * ノッチ・ステータスバー・ホームインジケータの下にコンテンツが潜らない。
 */
export const Fullscreen: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>全画面で開く</Button>
      </DialogTrigger>
      <DialogContent
        position="fullscreen"
        autoFocus="title"
        description="全画面ダイアログのサンプルです。"
      >
        <DialogHeader>
          <DialogTitle>プロフィールを編集</DialogTitle>
          <DialogDescription>
            四辺の余白は safe-area(ノッチ/ステータスバー等)を自動で回避します。
            ルートはスクロールせず、この本文領域だけがスクロールします。
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto">
          <div className="flex flex-col gap-2">
            <Label htmlFor="fullscreen-name">名前</Label>
            <Input id="fullscreen-name" placeholder="山田 太郎" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="fullscreen-bio">自己紹介</Label>
            <Input id="fullscreen-bio" placeholder="自己紹介を入力" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">キャンセル</Button>
          </DialogClose>
          <Button>保存する</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

/**
 * position="fullscreen" かつ safeArea=false（オプトアウト）。
 * consumer が自前でヘッダー/フッターの safe-area を管理したい場合に使う。
 */
export const FullscreenSafeAreaOptOut: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">全画面で開く（safeArea無効）</Button>
      </DialogTrigger>
      <DialogContent
        position="fullscreen"
        safeArea={false}
        autoFocus="title"
        description="safeArea を無効化した全画面ダイアログのサンプルです。"
      >
        <DialogHeader>
          <DialogTitle>safeArea={"false"}</DialogTitle>
          <DialogDescription>
            上下の safe-area 回避を無効化しています。consumer 側で管理する場合に使います。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">閉じる</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

/**
 * 既定の `orientation="split"`。2 アクションを均等幅（各 flex-1）で横並びにする。
 * モバイルのボトムシートやアプリ風 UI 向け。左=セカンダリ / 右=プライマリ。
 */
export const ReportShop: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>ショップを報告</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ショップを報告</DialogTitle>
          <DialogDescription>報告する理由を選択してください。</DialogDescription>
        </DialogHeader>
        <RadioGroup defaultValue="misleading">
          <div className="flex items-center gap-3">
            <RadioGroupItem value="misleading" id="report-misleading" />
            <Label htmlFor="report-misleading">誤解を招く内容</Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem value="inappropriate" id="report-inappropriate" />
            <Label htmlFor="report-inappropriate">不適切なコンテンツ</Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem value="other" id="report-other" />
            <Label htmlFor="report-other">その他</Label>
          </div>
        </RadioGroup>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">キャンセル</Button>
          </DialogClose>
          <Button>次へ</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

/**
 * `orientation="stacked"` で旧来のレイアウトに戻す。モバイルは縦積み、
 * デスクトップは右寄せの hug 幅。3 つ以上のアクションや、右寄せにしたい
 * フォーム系ダイアログで使う。
 */
export const StackedFooter: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>ダイアログを開く</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>変更を保存</DialogTitle>
          <DialogDescription>
            編集内容を保存しますか？保存せずに閉じると変更は失われます。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter orientation="stacked">
          <DialogClose asChild>
            <Button variant="secondary">キャンセル</Button>
          </DialogClose>
          <Button>保存する</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

// ─────────────────────────────────────────────────────────────
// interaction 回帰テスト（issue #256 / `npm run test:interaction`）
// ─────────────────────────────────────────────────────────────

/**
 * 開いた直後にすぐ操作できることの回帰テスト。
 *
 * 由来: v1.48.1 `fix(native): Modal 表示前の入口アニメーションで操作不能`(eba450b)。
 * 入場アニメーションの最中に pointer-events: none が残ると、
 * 「開いているのに押せない」状態になる。
 */
export const OpensAndIsImmediatelyInteractive: Story = {
  tags: ["interaction", "!autodocs"],
  render: () => {
    const onConfirm = fn()
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button data-testid="open">開く</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>確認</DialogTitle>
            <DialogDescription>入場アニメーション直後の操作性を検証します。</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button data-testid="confirm" onClick={onConfirm}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)

    await userEvent.click(canvas.getByTestId("open"))

    const dialog = await body.findByRole("dialog")
    // 入場アニメーション中は opacity 0 なので toBeVisible は使わない。
    // ここで見たいのは「描画されているか」ではなく「操作できるか」。
    await expect(dialog).toBeInTheDocument()

    // 入場アニメーションの完了を待たずに操作できること。
    // pointer-events が塞がっていれば userEvent.click がここで失敗する。
    const confirm = within(dialog).getByTestId("confirm")
    await expect(getComputedStyle(dialog).pointerEvents).not.toBe("none")
    await userEvent.click(confirm)
  },
}

/** Esc キーで閉じる。 */
export const ClosesOnEscape: Story = {
  tags: ["interaction", "!autodocs"],
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button data-testid="open">開く</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Esc で閉じる</DialogTitle>
          <DialogDescription>Escape キーでダイアログが閉じることを検証します。</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)

    await userEvent.click(canvas.getByTestId("open"))
    await expect(await body.findByRole("dialog")).toBeInTheDocument()

    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(body.queryByRole("dialog")).toBeNull())

    // 閉じたあとフォーカスがトリガーに戻ること
    await expect(canvas.getByTestId("open")).toHaveFocus()
  },
}

/** フォーカスがダイアログ内にトラップされる。 */
export const TrapsFocus: Story = {
  tags: ["interaction", "!autodocs"],
  render: () => (
    <div>
      <Button data-testid="outside">ダイアログ外のボタン</Button>
      <Dialog>
        <DialogTrigger asChild>
          <Button data-testid="open">開く</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>フォーカストラップ</DialogTitle>
            <DialogDescription>Tab を回してもダイアログ外に出ないことを検証します。</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button data-testid="a">A</Button>
            <Button data-testid="b">B</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)

    await userEvent.click(canvas.getByTestId("open"))
    const dialog = await body.findByRole("dialog")

    // 何度 Tab しても、フォーカスは常にダイアログの内側に留まる
    for (let i = 0; i < 8; i++) {
      await userEvent.tab()
      await expect(
        dialog.contains(document.activeElement),
        `Tab ${i + 1} 回目でフォーカスがダイアログ外（${document.activeElement?.outerHTML?.slice(0, 80)}）に出た`
      ).toBe(true)
    }
  },
}

/**
 * Sheet（多段含む）の上に開いた Dialog が最前面に来る回帰テスト（issue #340）。
 *
 * 由来: Dialog が Sheet の「開いた順スタック」に参加しておらず z が --Z-Modal
 * 固定だったため、多段 Sheet（content = 60 + 段数*20）の上では後から開いた
 * Dialog が確実に覆われていた。ここでは z 値ではなく「その座標で実際に最前面に
 * 居るか」（elementFromPoint）を見る。
 */
export const StacksAboveNestedSheets: Story = {
  tags: ["interaction", "!autodocs"],
  render: function DialogOverNestedSheets() {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Sheet open>
          <SheetContent side="bottom">
            <SheetTitle>1 枚目のシート</SheetTitle>
          </SheetContent>
        </Sheet>
        <Sheet open>
          <SheetContent side="bottom">
            <SheetTitle>2 枚目のシート</SheetTitle>
            <Button data-testid="open" onClick={() => setOpen(true)}>
              ダイアログを開く
            </Button>
          </SheetContent>
        </Sheet>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent description="多段シートの上から確認します">
            <DialogHeader>
              <DialogTitle>シートの上のダイアログ</DialogTitle>
            </DialogHeader>
            <DialogFooter>
              <Button data-testid="confirm">確認する</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    )
  },
  play: async () => {
    const body = within(document.body)
    await userEvent.click(await body.findByTestId("open"))

    const confirm = await body.findByTestId("confirm")
    // 入場アニメーションが終わり、実際にその座標の最前面が確認ボタンになること。
    await waitFor(() => {
      const r = confirm.getBoundingClientRect()
      const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)
      expect(confirm.contains(top)).toBe(true)
    })
    await userEvent.click(confirm)
  },
}

/**
 * Sheet の上に開いた ConfirmDialog（AlertDialog 基盤）が最前面に来る回帰テスト
 * （issue #340 の元症状）。Alert 層は基底が --Z-Alert-* のまま、スタック段数ぶんを
 * 加算する。
 */
export const ConfirmDialogStacksAboveSheet: Story = {
  tags: ["interaction", "!autodocs"],
  render: function ConfirmOverSheet() {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Sheet open>
          <SheetContent side="bottom">
            <SheetTitle>下地のシート</SheetTitle>
            <Button data-testid="open" onClick={() => setOpen(true)}>
              削除する
            </Button>
          </SheetContent>
        </Sheet>
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          title="削除しますか"
          description="この操作は取り消せません。"
          variant="destructive"
          confirmLabel="削除する"
          onConfirm={() => {}}
        />
      </>
    )
  },
  play: async () => {
    const body = within(document.body)
    await userEvent.click(await body.findByTestId("open"))

    const alert = await body.findByRole("alertdialog")
    const confirm = within(alert).getByRole("button", { name: "削除する" })

    await waitFor(() => {
      const r = confirm.getBoundingClientRect()
      const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)
      expect(confirm.contains(top)).toBe(true)
    })
    await userEvent.click(confirm)
  },
}
