import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormField } from "@/components/patterns/form-field"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { ResponsiveDialog, ResponsiveDialogTrigger, ResponsiveDialogTitle } from "@/components/ui/responsive-dialog"
import { ResponsiveOverlayFrame } from "@/components/patterns/responsive-overlay-frame"
import { DetailSheetScaffold, DetailSheetHeader } from "@/components/patterns/detail-sheet-scaffold"
import { decisionTree, screenPatterns } from "./component-guide"

const meta = { title: "Guides/用途から選ぶ", parameters: { layout: "padded", docs: { description: { component: "画面の目的を選ぶと、正本の decisionTree から推奨する構成と使い分けを案内します。最初に代表例を確認し、各部品のDocsで状態・境界条件を検証してください。" } } } } satisfies Meta
export default meta
type Story = StoryObj<typeof meta>

function Catalog() {
  const [history, setHistory] = React.useState<Array<number | string>>([1])
  const step = history[history.length - 1]
  const setStep = (next: number | string) => setHistory((previous) => [...previous, next])
  const [docs, setDocs] = React.useState<Record<string, string>>({})
  React.useEffect(() => {
    const controller = new AbortController()
    fetch("./index.json", { signal: controller.signal }).then((response) => response.json()).then((index: { entries: Record<string, { type: string; title: string; id: string }> }) => {
      const links: Record<string, string> = {}
      Object.values(index.entries).filter((entry) => entry.type === "docs" && !entry.title.startsWith("Native/")).forEach((entry) => { links[entry.title.split("/").slice(-1)[0]] = entry.id })
      setDocs(links)
    }).catch(() => { /* Names remain readable if the index is temporarily unavailable. */ })
    return () => controller.abort()
  }, [])
  const question = decisionTree.find((entry) => entry.step === step)
  const result = screenPatterns.find((entry) => entry.id === step)
  return <div className="flex max-w-3xl flex-col gap-6 text-[var(--Text-High-Emphasis)]">
    <h1 className="typo-heading-lg text-[var(--Text-High-Emphasis)]">何をする画面ですか？</h1>
    {question && <><p className="typo-body-lg text-[var(--Text-High-Emphasis)]">{question.question}</p><div className="flex gap-3"><Button onClick={() => setStep(question.yes)}>はい</Button><Button variant="secondary" onClick={() => setStep(question.no)}>いいえ</Button></div></>}
    {result && <Card><CardHeader><CardTitle>{result.name}</CardTitle></CardHeader><CardContent className="flex flex-col gap-4">
      <p>{result.purpose}</p><h2 className="typo-heading-sm text-[var(--Text-High-Emphasis)]">推奨する部品</h2><div className="flex flex-wrap gap-2">{result.dsComponents.map((name) => docs[name] ? <Button key={name} variant="secondary" size="sm" asChild><a href={`./?path=/docs/${docs[name]}`} target="_top">{name}</a></Button> : <span key={name}>{name}</span>)}</div>
      <h2 className="typo-heading-sm text-[var(--Text-High-Emphasis)]">使わない場面</h2><ul>{result.whenNotToUse.map((text) => <li key={text}>{text}</li>)}</ul>
      <p>{result.dsComponentsNote}</p><p>代表例: {result.examples.join("・")}</p>
    </CardContent></Card>}
    {history.length > 1 && <div className="flex gap-3"><Button variant="secondary" onClick={() => setHistory((previous) => previous.slice(0, -1))}>1つ戻る</Button><Button variant="secondary" onClick={() => setHistory([1])}>最初から選ぶ</Button></div>}
  </div>
}
export const DecisionGuide: Story = { name: "代表例 / 用途ナビ", render: () => <Catalog /> }
function ComparisonFields() {
  const id = React.useId()
  return <FormField label="予定の名前" htmlFor={id}><Input id={id} defaultValue="打ち合わせ" /></FormField>
}
export const OverlayComparison: Story = { name: "比較 / Sheet と ResponsiveOverlayFrame", render: () => <div className="flex max-w-3xl flex-col gap-6 text-[var(--Text-High-Emphasis)]">
  <h1 className="typo-heading-lg text-[var(--Text-High-Emphasis)]">同じ入力内容で違いを確認</h1>
  <p>Sheetも画面幅に収まります。ResponsiveDialogが画面幅を判定し、ResponsiveOverlayFrameと組み合わせると「下から出るシート」と「中央のダイアログ」を切り替えます。ビューポート幅を変えて両方を開いてください。</p>
  <div className="flex flex-wrap gap-4"><Sheet><SheetTrigger asChild><Button variant="secondary">Sheetを開く</Button></SheetTrigger><SheetContent side="bottom"><SheetTitle>予定を編集</SheetTitle><SheetDescription>PCでも下から出るシートです。</SheetDescription><ComparisonFields /></SheetContent></Sheet>
  <ResponsiveDialog><ResponsiveDialogTrigger asChild><Button>自動切替を開く</Button></ResponsiveDialogTrigger><ResponsiveOverlayFrame preset="mobile-form" description="予定を編集します"><DetailSheetScaffold header={<DetailSheetHeader title={<ResponsiveDialogTitle>予定を編集</ResponsiveDialogTitle>} description="モバイルは下、PCは中央に表示します。" />}><ComparisonFields /></DetailSheetScaffold></ResponsiveOverlayFrame></ResponsiveDialog></div>
</div> }
