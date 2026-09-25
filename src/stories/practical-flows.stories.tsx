import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, userEvent, within } from "storybook/test"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { PillToggle } from "@/components/ui/pill-toggle"
import { Alert } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { FormField } from "@/components/patterns/form-field"
import { SettingsSection, SettingsListRow } from "@/components/patterns/settings-section"
import { SearchBar } from "@/components/patterns/search-bar"
import { EmptyState } from "@/components/patterns/empty-state"
import { ErrorState } from "@/components/patterns/error-state"

const meta = { title: "Guides/操作できる完成例", parameters: { layout: "padded", docs: { description: { component: "画面構成の標準例です。データはこのプレビュー内だけに保存されます。通信の状態は確認用コントロールで再現できます。" } } } } satisfies Meta
export default meta
type Story = StoryObj<typeof meta>
const states = [{ value: "normal", label: "通常" }, { value: "loading", label: "読み込み" }, { value: "error", label: "エラー" }]
function StateControl({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return <div className="flex flex-col gap-2"><p className="typo-body-sm text-[var(--Text-Medium-Emphasis)]">確認用: 通信状態</p><PillToggle options={states} value={value} onChange={onChange} /></div>
}
export const Settings: Story = { name: "代表例 / 設定を保存する", render: function Render() {
  const [enabled, setEnabled] = React.useState(true)
  const [saved, setSaved] = React.useState(true)
  const [status, setStatus] = React.useState("normal")
  const [message, setMessage] = React.useState(false)
  return <div className="flex max-w-xl flex-col gap-6"><StateControl value={status} onChange={setStatus} /><SettingsSection title="通知設定" description="更新のお知らせを受け取るか選べます。" variant="card"><SettingsListRow title="更新のお知らせ" rightSlot={<Switch aria-label="更新のお知らせ" checked={enabled} onCheckedChange={(value) => { setEnabled(value); setMessage(false) }} />} /></SettingsSection>
    {status === "error" && <ErrorState title="保存できませんでした" description="接続を確認して再試行してください。" action={<Button onClick={() => setStatus("normal")}>再試行する</Button>} />}
    {status === "loading" && <div role="status"><Spinner /> 保存中です</div>}
    {message && <Alert variant="success" title="通知設定を保存しました" />}
    <div className="flex gap-3"><Button disabled={status !== "normal" || enabled === saved} onClick={() => { setSaved(enabled); setMessage(true) }}>保存する</Button><Button variant="secondary" onClick={() => { setEnabled(saved); setMessage(false) }}>変更を戻す</Button></div>
  </div>
}, tags: ["interaction"], play: async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const save = canvas.getByRole("button", { name: "保存する" })
  await expect(save).toBeDisabled()
  await userEvent.click(canvas.getByRole("switch", { name: "更新のお知らせ" }))
  await expect(save).toBeEnabled()
  await userEvent.click(canvas.getByRole("tab", { name: "読み込み" }))
  await expect(canvas.getByText("保存中です")).toBeVisible()
  await expect(save).toBeDisabled()
  await userEvent.click(canvas.getByRole("tab", { name: "エラー" }))
  await expect(canvas.getByText("保存できませんでした")).toBeVisible()
  await userEvent.click(canvas.getByRole("button", { name: "再試行する" }))
  await userEvent.click(save)
  await expect(canvas.getByText("通知設定を保存しました")).toBeVisible()
  await expect(save).toBeDisabled()
  await userEvent.click(canvas.getByRole("switch", { name: "更新のお知らせ" }))
  await userEvent.click(canvas.getByRole("button", { name: "変更を戻す" }))
  await expect(canvas.getByRole("switch", { name: "更新のお知らせ" })).not.toBeChecked()
  await userEvent.click(canvas.getByRole("switch", { name: "更新のお知らせ" }))
  await userEvent.click(save)
  await userEvent.click(canvas.getByRole("button", { name: "変更を戻す" }))
} }
export const Search: Story = { name: "代表例 / 検索と絞り込み", render: function Render() {
  const [query, setQuery] = React.useState("")
  const [filter, setFilter] = React.useState("all")
  const [status, setStatus] = React.useState("normal")
  const items = [{ title: "チームの打ち合わせ", type: "work" }, { title: "週末の買い物", type: "home" }].filter((item) => item.title.includes(query) && (filter === "all" || item.type === filter))
  return <div className="flex max-w-xl flex-col gap-6"><StateControl value={status} onChange={setStatus} /><SearchBar aria-label="予定を検索" value={query} onChange={(event) => setQuery(event.target.value)} /><PillToggle value={filter} onChange={setFilter} options={[{ value: "all", label: "すべて" }, { value: "work", label: "仕事" }, { value: "home", label: "家庭" }]} />
    {status === "loading" ? <div role="status"><Spinner />予定を読み込んでいます</div> : status === "error" ? <ErrorState action={<Button onClick={() => setStatus("normal")}>再試行する</Button>} /> : items.length ? <SettingsSection title={`${items.length}件の予定`}>{items.map((item) => <SettingsListRow key={item.title} title={item.title} />)}</SettingsSection> : <EmptyState title="一致する予定がありません" description="別の言葉で検索するか、条件をリセットしてください。" actionLabel="条件をリセットする" onAction={() => { setQuery(""); setFilter("all") }} />}
  </div>
}, tags: ["interaction"], play: async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const search = canvas.getByRole("searchbox", { name: "予定を検索" })
  await userEvent.type(search, "該当しない予定")
  await expect(canvas.getByText("一致する予定がありません")).toBeVisible()
  await userEvent.click(canvas.getByRole("button", { name: "条件をリセットする" }))
  await expect(search).toHaveValue("")
  await expect(canvas.getByText("2件の予定")).toBeVisible()
  await userEvent.click(canvas.getByRole("tab", { name: "仕事" }))
  await expect(canvas.getByText("1件の予定")).toBeVisible()
  await expect(canvas.queryByText("週末の買い物")).not.toBeInTheDocument()
  await userEvent.click(canvas.getByRole("tab", { name: "読み込み" }))
  await expect(canvas.getByText("予定を読み込んでいます")).toBeVisible()
  await userEvent.click(canvas.getByRole("tab", { name: "エラー" }))
  await userEvent.click(canvas.getByRole("button", { name: "再試行する" }))
  await expect(canvas.getByText("チームの打ち合わせ")).toBeVisible()
  await expect(canvas.getByRole("tab", { name: "仕事" })).toHaveAttribute("aria-selected", "true")
  await userEvent.click(canvas.getByRole("tab", { name: "すべて" }))
} }
export const Form: Story = { name: "代表例 / 入力して送信する", render: function Render() {
  const id = React.useId()
  const [name, setName] = React.useState("")
  const [attempted, setAttempted] = React.useState(false)
  const [sent, setSent] = React.useState(false)
  const [status, setStatus] = React.useState("normal")
  return <div className="flex max-w-xl flex-col gap-6"><StateControl value={status} onChange={setStatus} /><form className="flex flex-col gap-4" onSubmit={(event) => { event.preventDefault(); setAttempted(true); if (name.trim() && status === "normal") setSent(true) }}><FormField label="表示名" required htmlFor={id} error={attempted && !name.trim() ? "表示名を入力してください。" : undefined}><Input id={id} value={name} onChange={(event) => { setName(event.target.value); setSent(false) }} /></FormField>
    {status === "loading" && <div role="status"><Spinner />送信中です</div>}
    {status === "error" && <Alert variant="error" title="送信できませんでした" description="入力内容は保持しています。通信状態を通常に戻して再送信してください。" />}
    {sent && <Alert variant="success" title="プロフィールを保存しました" />}
    <Button type="submit" disabled={status !== "normal"}>送信する</Button></form></div>
}, tags: ["interaction"], play: async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const submit = canvas.getByRole("button", { name: "送信する" })
  const input = canvas.getByRole("textbox", { name: /表示名/ })
  await userEvent.click(submit)
  await expect(canvas.getByText("表示名を入力してください。")).toBeVisible()
  await expect(input).toHaveAttribute("aria-invalid", "true")
  await userEvent.type(input, "けいすけ")
  await expect(canvas.queryByText("表示名を入力してください。")).not.toBeInTheDocument()
  await userEvent.click(canvas.getByRole("tab", { name: "読み込み" }))
  await expect(submit).toBeDisabled()
  await expect(canvas.getByText("送信中です")).toBeVisible()
  await userEvent.click(canvas.getByRole("tab", { name: "エラー" }))
  await expect(canvas.getByText("送信できませんでした")).toBeVisible()
  await expect(input).toHaveValue("けいすけ")
  await userEvent.click(canvas.getByRole("tab", { name: "通常" }))
  await userEvent.click(submit)
  await expect(canvas.getByText("プロフィールを保存しました")).toBeVisible()
} }
