import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { CommitInput } from "./commit-input"
import { CommitTextarea } from "./commit-textarea"
import { CommitAutoGrowTextarea } from "./commit-auto-grow-textarea"

/**
 * Commit 系入力 — IME(日本語変換)を壊さない「確定時コミット」入力。
 *
 * IME 変換は Storybook では自動再現できないため、各 story は
 * 「入力中の draft(= DOM の値)」と「commit 済みの外部 value」を並べて表示する。
 * 通常タイピングでは両者が一致し、変換中だけ commit 済みが遅れて追従する
 * (実ブラウザで composition イベントを発行して確認する) 挙動を可視化する。
 */
const meta: Meta<typeof CommitInput> = {
  title: "Components/CommitInputs",
  component: CommitInput,
  tags: ["autodocs"],
}
export default meta

type Story = StoryObj<typeof CommitInput>

/**
 * CommitInput の commit タイミングを可視化するデモ。
 * - 上: 入力欄（draft = DOM の値）
 * - 下: onCommit で受け取った「確定値」と commit 回数
 * - 「外部から値を変更」ボタン: store 側の value 変更が draft に反映されるか確認
 */
export const InputCommitTiming: Story = {
  render: () => {
    const [committed, setCommitted] = React.useState("初期値")
    const countRef = React.useRef(0)
    const [count, setCount] = React.useState(0)

    return (
      <div className="w-full max-w-md space-y-3">
        <Label htmlFor="commit-input-demo">名前（確定時コミット）</Label>
        <CommitInput
          id="commit-input-demo"
          value={committed}
          onCommit={(v) => {
            countRef.current += 1
            setCount(countRef.current)
            setCommitted(v)
          }}
          placeholder="名前を入力"
        />
        <div
          data-testid="readout"
          className="rounded-lg border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Secondary)] p-3 typo-body-sm text-[var(--Text-Medium-Emphasis)]"
        >
          <div>
            commit 済み値:{" "}
            <span
              data-testid="committed"
              className="typo-body-sm text-[var(--Text-High-Emphasis)]"
            >
              {committed === "" ? "（空）" : committed}
            </span>
          </div>
          <div className="mt-1">
            commit 回数:{" "}
            <span data-testid="commit-count" className="tabular-nums">
              {count}
            </span>
          </div>
        </div>
        <Button
          data-testid="external-change"
          variant="secondary"
          size="sm"
          onClick={() => setCommitted("外部から変更 " + Date.now())}
        >
          外部から値を変更（store 同期）
        </Button>
      </div>
    )
  },
}

/** CommitTextarea 版。挙動は CommitInput と同じ。 */
export const TextareaCommitTiming: StoryObj<typeof CommitTextarea> = {
  render: () => {
    const [committed, setCommitted] = React.useState("メモの初期値")
    const [count, setCount] = React.useState(0)

    return (
      <div className="w-full max-w-md space-y-3">
        <Label htmlFor="commit-textarea-demo">メモ（確定時コミット）</Label>
        <CommitTextarea
          id="commit-textarea-demo"
          value={committed}
          onCommit={(v) => {
            setCount((c) => c + 1)
            setCommitted(v)
          }}
          placeholder="メモを入力"
        />
        <div
          data-testid="readout"
          className="rounded-lg border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Secondary)] p-3 typo-body-sm text-[var(--Text-Medium-Emphasis)]"
        >
          <div>
            commit 済み値:{" "}
            <span
              data-testid="committed"
              className="typo-body-sm text-[var(--Text-High-Emphasis)] whitespace-pre-wrap"
            >
              {committed === "" ? "（空）" : committed}
            </span>
          </div>
          <div className="mt-1">
            commit 回数:{" "}
            <span data-testid="commit-count" className="tabular-nums">
              {count}
            </span>
          </div>
        </div>
      </div>
    )
  },
}

/** CommitAutoGrowTextarea 版。高さ自動伸縮 + 確定時コミット。 */
export const AutoGrowCommitTiming: StoryObj<typeof CommitAutoGrowTextarea> = {
  render: () => {
    const [committed, setCommitted] = React.useState("自動伸縮メモ")
    const [count, setCount] = React.useState(0)

    return (
      <div className="w-full max-w-md space-y-3">
        <Label htmlFor="commit-autogrow-demo">メモ（自動伸縮・確定時コミット）</Label>
        <CommitAutoGrowTextarea
          id="commit-autogrow-demo"
          value={committed}
          onCommit={(v) => {
            setCount((c) => c + 1)
            setCommitted(v)
          }}
          minRows={2}
          placeholder="メモを入力"
        />
        <div
          data-testid="readout"
          className="rounded-lg border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Secondary)] p-3 typo-body-sm text-[var(--Text-Medium-Emphasis)]"
        >
          <div>
            commit 済み値:{" "}
            <span
              data-testid="committed"
              className="typo-body-sm text-[var(--Text-High-Emphasis)] whitespace-pre-wrap"
            >
              {committed === "" ? "（空）" : committed}
            </span>
          </div>
          <div className="mt-1">
            commit 回数:{" "}
            <span data-testid="commit-count" className="tabular-nums">
              {count}
            </span>
          </div>
        </div>
      </div>
    )
  },
}
