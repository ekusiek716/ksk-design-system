import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Chip } from "@/components/patterns/chip"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

/**
 * Foundation/Product Theme（issue #364）
 *
 * マルチテーマ（Brand 10行差し替え）が扱うのは「色」だけ。ここは**寸法**を
 * プロダクト単位で調整するための公開 CSS 変数のデモ。
 *
 * 各プレビューは `:root` ではなく **scoped div** に変数を当てている。
 * コンポーネントは `h-[var(--Control-Height-Md)]` の形で参照しているため、
 * CSS カスタムプロパティのカスケードだけで配下の見た目が切り替わる
 * （prop も React context も増えない）。
 */
const meta: Meta = {
  title: "Foundation/Product Theme",
  tags: ["autodocs"],
  parameters: { layout: "padded" },
}
export default meta
type Story = StoryObj

/** 上書き例。値は「見て分かる」ように既定から大きく振ってある */
const PRESETS: Array<{ name: string; note: string; vars: React.CSSProperties }> = [
  {
    name: "DS 既定",
    note: "product-theme.css の既定値。従来（v1.57.0）と 1px も変わらない",
    vars: {},
  },
  {
    name: "コンパクト業務画面",
    note: "コントロールを一段低く、カードの余白を詰める。情報密度を上げたい管理画面向け",
    vars: {
      "--Control-Height-Md": "2rem",
      "--Control-Padding-X-Md": "0.75rem",
      "--Field-Height-Md": "2.25rem",
      "--Field-Padding-X-Md": "0.5rem",
      "--Field-Min-Height": "3rem",
      "--Product-Card-Padding": "1rem",
      "--Product-Card-Gap": "0.75rem",
    } as React.CSSProperties,
  },
  {
    name: "角ばった / ゆったり",
    note: "ボタンのピルをやめ、フィールドの角丸を落とし、余白を広げる。硬い印象のプロダクト向け",
    vars: {
      "--Control-Radius": "0.375rem",
      "--Control-Height-Md": "3rem",
      "--Control-Padding-X-Md": "1.5rem",
      "--Field-Radius": "0.25rem",
      "--Field-Height-Md": "3.5rem",
      "--Product-Card-Padding": "2rem",
      "--Radius-Surface": "0",
    } as React.CSSProperties,
  },
]

function Sample() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>お問い合わせ</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Input placeholder="お名前" />
        <Select>
          <SelectTrigger aria-label="種別">
            <SelectValue placeholder="種別を選ぶ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="a">ご相談</SelectItem>
            <SelectItem value="b">不具合の報告</SelectItem>
          </SelectContent>
        </Select>
        <Textarea placeholder="内容" />
        <div className="flex gap-2">
          <Button>送信する</Button>
          <Button variant="secondary">下書き保存</Button>
        </div>
      </CardContent>
    </Card>
  )
}

export const Presets: Story = {
  name: "上書きの効き方",
  render: () => (
    <div className="flex flex-col gap-8">
      <p className="typo-body-md text-[var(--Text-Medium-Emphasis)]">
        同じ JSX を、囲いの div に当てた CSS 変数だけで別の寸法にしている。
        許可された変数の一覧は <code>contracts/product-theme-overrides.json</code>。
      </p>
      <div className="flex flex-wrap items-start gap-8">
        {PRESETS.map((preset) => (
          <div key={preset.name} className="flex w-full max-w-md flex-col gap-3">
            <div>
              <p className="typo-label-md text-[var(--Text-High-Emphasis)]">{preset.name}</p>
              <p className="typo-body-sm text-[var(--Text-Medium-Emphasis)]">{preset.note}</p>
            </div>
            {/* :root ではなくこの div にだけ変数を当てる（スコープの確認を兼ねる） */}
            <div style={preset.vars}>
              <Sample />
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
}

export const ControlScale: Story = {
  name: "Control スケール（Button）",
  render: () => (
    <div className="flex flex-col gap-6">
      <p className="typo-body-md text-[var(--Text-Medium-Emphasis)]">
        Button の size は <code>--Control-Height-*</code> / <code>--Control-Padding-X-*</code> を
        読む。既定値は従来の <code>h-6 / h-8 / h-10 / h-12 / h-14</code> と同値。
      </p>
      {[
        { label: "既定", vars: {} as React.CSSProperties },
        {
          label: "全段を 8px 低く",
          vars: {
            "--Control-Height-Xs": "1rem",
            "--Control-Height-Sm": "1.5rem",
            "--Control-Height-Md": "2rem",
            "--Control-Height-Lg": "2.5rem",
            "--Control-Height-Xl": "3rem",
          } as React.CSSProperties,
        },
      ].map((row) => (
        <div key={row.label} className="flex flex-col gap-2">
          <p className="typo-label-sm text-[var(--Text-Medium-Emphasis)]">{row.label}</p>
          <div style={row.vars} className="flex flex-wrap items-center gap-3">
            <Button size="xs">xs</Button>
            <Button size="sm">sm</Button>
            <Button size="default">default</Button>
            <Button size="lg">lg</Button>
            <Button size="xl">xl</Button>
          </div>
        </div>
      ))}
    </div>
  ),
}

export const TabsScale: Story = {
  name: "Tabs（Control / Field 変数）",
  render: () => (
    <div className="flex flex-col gap-6">
      <p className="typo-body-md text-[var(--Text-Medium-Emphasis)]">
        default variant は <code>--Control-Height-Md</code> / <code>--Control-Padding-X-Sm</code> /{" "}
        <code>--Field-Radius</code>、pill variant は <code>--Control-Padding-X-Md</code> /{" "}
        <code>--Control-Radius</code> を参照する。pill の高さ（44px）はタッチターゲット確保のため
        固定値のまま product theme の対象外。
      </p>
      {[
        { label: "既定", vars: {} as React.CSSProperties },
        {
          label: "角ばった Control-Radius + 広めの padding",
          vars: {
            "--Control-Radius": "0.375rem",
            "--Control-Padding-X-Sm": "1rem",
            "--Control-Padding-X-Md": "1.5rem",
            "--Field-Radius": "0.25rem",
          } as React.CSSProperties,
        },
      ].map((row) => (
        <div key={row.label} className="flex flex-col gap-2">
          <p className="typo-label-sm text-[var(--Text-Medium-Emphasis)]">{row.label}</p>
          <div style={row.vars} className="flex flex-wrap items-center gap-4">
            {/* TabsContent が無いと Radix の aria-controls が存在しない id を指し、
                axe の aria-valid-attr-value に落ちる。プレビュー用でも panel を置く */}
            <Tabs defaultValue="a">
              <TabsList>
                <TabsTrigger value="a">概要</TabsTrigger>
                <TabsTrigger value="b">詳細</TabsTrigger>
              </TabsList>
              <TabsContent value="a" className="sr-only">概要</TabsContent>
              <TabsContent value="b" className="sr-only">詳細</TabsContent>
            </Tabs>
            <Tabs defaultValue="a">
              <TabsList variant="pill">
                <TabsTrigger value="a">すべて</TabsTrigger>
                <TabsTrigger value="b">未読</TabsTrigger>
              </TabsList>
              <TabsContent value="a" className="sr-only">すべて</TabsContent>
              <TabsContent value="b" className="sr-only">未読</TabsContent>
            </Tabs>
          </div>
        </div>
      ))}
    </div>
  ),
}

export const ChipRadius: Story = {
  name: "Chip（--Chip-Radius）",
  render: () => (
    <div className="flex flex-col gap-6">
      <p className="typo-body-md text-[var(--Text-Medium-Emphasis)]">
        pill の角丸は <code>--Chip-Radius</code> を参照する。Button の <code>--Control-Radius</code>{" "}
        とは独立させてあるため、ボタンだけ角ばらせてチップはピルのまま、といった組み合わせが可能。
        高さ・横 padding は配線していない（sm/md/lg の縦 margin が 44px タッチターゲットぶんの
        手計算値のため）。
      </p>
      {[
        { label: "既定", vars: {} as React.CSSProperties },
        { label: "角ばった Chip-Radius", vars: { "--Chip-Radius": "0.375rem" } as React.CSSProperties },
      ].map((row) => (
        <div key={row.label} className="flex flex-col gap-2">
          <p className="typo-label-sm text-[var(--Text-Medium-Emphasis)]">{row.label}</p>
          <div style={row.vars} className="flex flex-wrap items-center gap-2">
            <Chip>キーワード</Chip>
            <Chip selected>選択済み</Chip>
            <Chip removable onRemove={() => {}}>削除可能</Chip>
          </div>
        </div>
      ))}
    </div>
  ),
}

export const AdminShellPagePadding: Story = {
  name: "AdminShell ページ余白（--Product-Page-Padding-Y）",
  render: () => (
    <div className="flex flex-col gap-6">
      <p className="typo-body-md text-[var(--Text-Medium-Emphasis)]">
        AdminShell の <code>&lt;main&gt;</code> 縦 padding は <code>--Product-Page-Padding-Y</code>{" "}
        を参照する（既定 py-6 と同値）。AppShell / MarketingShell / MobileAppShell は本文 padding を
        シェル自身が持たないため対象外（Container の gutter か呼び出し側の contentClassName に委ねている）。
      </p>
      {[
        { label: "既定（24px）", vars: {} as React.CSSProperties },
        { label: "詰めた業務画面（12px）", vars: { "--Product-Page-Padding-Y": "0.75rem" } as React.CSSProperties },
      ].map((row) => (
        <div key={row.label} className="flex flex-col gap-2">
          <p className="typo-label-sm text-[var(--Text-Medium-Emphasis)]">{row.label}</p>
          <div style={row.vars} className="border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Secondary)]">
            <div className="bg-[var(--Surface-Primary)] px-6 py-[var(--Product-Page-Padding-Y)]">
              <p className="typo-body-sm text-[var(--Text-High-Emphasis)]">
                AdminShell の main 相当（実際は Container 経由）
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  ),
}

export const FieldScale: Story = {
  name: "Field スケール（Input / Select / Textarea）",
  render: () => (
    <div className="flex flex-col gap-6">
      <p className="typo-body-md text-[var(--Text-Medium-Emphasis)]">
        フィールドは Button と別スケール（<code>--Field-*</code>）。ksk のフィールドは
        元々ボタンより背が高いので、同じ変数に畳むとどちらかの実寸が変わってしまう。
      </p>
      {[
        { label: "既定", vars: {} as React.CSSProperties },
        {
          label: "角丸ゼロ + 低め",
          vars: {
            "--Field-Radius": "0",
            "--Field-Height-Sm": "2rem",
            "--Field-Height-Md": "2.5rem",
            "--Field-Height-Lg": "3rem",
          } as React.CSSProperties,
        },
      ].map((row) => (
        <div key={row.label} className="flex flex-col gap-2">
          <p className="typo-label-sm text-[var(--Text-Medium-Emphasis)]">{row.label}</p>
          <div style={row.vars} className="flex w-full max-w-sm flex-col gap-3">
            <Input placeholder="Input" />
            <Select>
              <SelectTrigger size="sm" aria-label="sm">
                <SelectValue placeholder="SelectTrigger sm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="a">選択肢</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger aria-label="default">
                <SelectValue placeholder="SelectTrigger default" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="a">選択肢</SelectItem>
              </SelectContent>
            </Select>
            <Textarea placeholder="Textarea" />
          </div>
        </div>
      ))}
    </div>
  ),
}
