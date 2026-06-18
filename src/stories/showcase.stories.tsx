/**
 * @file UI Kit ショーケース（プレゼン用ポスター）
 * @description 主要コンポーネントを 1 枚のポスターとして並べて魅せるページ。
 *   遷移は行わない（実物をその場で見せる）。プレゼン・営業資料・チームへの
 *   全体像共有用。Gallery は「全件タイル + 遷移」、こちらは「映える縮図」。
 *
 *   レイアウト・見出し等の骨組みは story 専用の装飾なので token 付き inline style /
 *   typo-* で組み、中身は必ず実 DS コンポーネントを使う（手書き UI は置かない）。
 */
import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { Eye, Star1, Heart, Location, Bus, Coffee, Setting4 } from "iconsax-reactjs"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tag } from "@/components/patterns/tag"
import { Chip } from "@/components/patterns/chip"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { StarRating } from "@/components/ui/star-rating"
import { Input } from "@/components/ui/input"
import { SearchBar } from "@/components/patterns/search-bar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { ProgressRing } from "@/components/ui/progress-ring"
import { Spinner } from "@/components/ui/spinner"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { PriceDisplay } from "@/components/patterns/commerce/price-display"
import { StatCard } from "@/components/patterns/stat-card"

/* ─────────────────────────────────────────────
 * 骨組み（poster scaffolding）
 * ───────────────────────────────────────────── */

/** 番号付きセクションカード */
function Panel({
  no,
  title,
  span = 1,
  children,
}: {
  no: string
  title: string
  /** グリッド占有カラム数（1 or 2） */
  span?: 1 | 2
  children: React.ReactNode
}) {
  return (
    <section
      style={{
        gridColumn: `span ${span}`,
        background: "var(--Surface-Primary)",
        border: "1px solid var(--Border-Low-Emphasis)",
        borderRadius: 16,
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <span
          className="typo-label-sm"
          style={{ color: "var(--Brand-Primary)", fontVariantNumeric: "tabular-nums" }}
        >
          {no}
        </span>
        <h2 className="typo-heading-sm" style={{ margin: 0, color: "var(--Text-High-Emphasis)" }}>
          {title}
        </h2>
      </div>
      {children}
    </section>
  )
}

/** 小見出し（パネル内のグルーピング用ラベル） */
function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="typo-label-xs" style={{ color: "var(--Text-Low-Emphasis)", marginBottom: 6 }}>
      {children}
    </div>
  )
}

const Row = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>{children}</div>
)

/** カラースウォッチ */
function Swatch({ token, label }: { token: string; label: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 76 }}>
      <div
        style={{
          height: 48,
          borderRadius: 10,
          background: `var(${token})`,
          border: "1px solid var(--Border-Low-Emphasis)",
        }}
      />
      <span className="typo-label-xs" style={{ color: "var(--Text-High-Emphasis)" }}>
        {label}
      </span>
      <span className="typo-caption" style={{ color: "var(--Text-Low-Emphasis)", marginTop: -4 }}>
        {token.replace("--", "")}
      </span>
    </div>
  )
}

/* ─────────────────────────────────────────────
 * 制御系のローカル state（実物として動かす）
 * ───────────────────────────────────────────── */

function ControlsPanel() {
  const [on, setOn] = React.useState(true)
  const [checked, setChecked] = React.useState(true)
  const [radio, setRadio] = React.useState("standard")
  const [stars, setStars] = React.useState(4)
  return (
    <Panel no="06" title="Controls">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <GroupLabel>Toggle / Switch</GroupLabel>
          <Row>
            <Switch checked={on} onCheckedChange={setOn} />
            <Switch checked={!on} onCheckedChange={(v) => setOn(!v)} />
            <Switch disabled />
          </Row>
        </div>
        <div>
          <GroupLabel>Checkbox</GroupLabel>
          <Row>
            <Checkbox checked={checked} onCheckedChange={(v) => setChecked(v === true)} />
            <Checkbox checked={false} />
            <Checkbox checked disabled />
          </Row>
        </div>
        <div>
          <GroupLabel>Radio</GroupLabel>
          <RadioGroup value={radio} onValueChange={setRadio} style={{ display: "flex", gap: 16 }}>
            <label style={{ display: "flex", gap: 6, alignItems: "center" }} className="typo-body-sm">
              <RadioGroupItem value="standard" /> 標準
            </label>
            <label style={{ display: "flex", gap: 6, alignItems: "center" }} className="typo-body-sm">
              <RadioGroupItem value="express" /> 速達
            </label>
          </RadioGroup>
        </div>
        <div>
          <GroupLabel>Star Rating</GroupLabel>
          <StarRating value={stars} onChange={setStars} />
        </div>
      </div>
      <div>
        <GroupLabel>Slider</GroupLabel>
        <Slider defaultValue={[60]} max={100} step={1} />
      </div>
    </Panel>
  )
}

/* ─────────────────────────────────────────────
 * ポスター本体
 * ───────────────────────────────────────────── */

function Showcase() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--Surface-Secondary)",
        fontFamily: "var(--font-sans, system-ui, sans-serif)",
      }}
    >
      {/* ヒーローバンド */}
      <header
        style={{
          background: "var(--Brand-Primary)",
          color: "var(--Text-on-Inverse)",
          padding: "40px 32px",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h1 className="typo-display-lg" style={{ margin: 0 }}>
            KSK Design System
          </h1>
          <p className="typo-body-lg" style={{ margin: "8px 0 0", opacity: 0.92 }}>
            UI Kit — マルチテーマ対応の統合デザインシステム。Brand 色を差し替えるだけで全体が切り替わります。
          </p>
        </div>
      </header>

      {/* グリッド */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: 24,
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 16,
          alignItems: "start",
        }}
      >
        {/* 01 Buttons */}
        <Panel no="01" title="Buttons" span={2}>
          <div>
            <GroupLabel>Variants</GroupLabel>
            <Row>
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="tertiary">Tertiary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="accent">Accent</Button>
              <Button variant="destructive">Delete</Button>
              <Button variant="link">Link</Button>
            </Row>
          </div>
          <div>
            <GroupLabel>Sizes</GroupLabel>
            <Row>
              <Button size="sm">Small</Button>
              <Button>Default</Button>
              <Button size="lg">Large</Button>
              <Button size="hero">Hero CTA</Button>
              <Button size="icon" aria-label="settings">
                <Setting4 size={18} />
              </Button>
            </Row>
          </div>
        </Panel>

        {/* 02 Color Palette */}
        <Panel no="02" title="Color Palette">
          <GroupLabel>Brand</GroupLabel>
          <Row>
            <Swatch token="--Brand-Primary" label="Primary" />
            <Swatch token="--Brand-Action" label="Action" />
          </Row>
          <GroupLabel>Status</GroupLabel>
          <Row>
            <Swatch token="--Success-Base" label="Success" />
            <Swatch token="--Warning-Base" label="Warning" />
            <Swatch token="--Info-Base" label="Info" />
            <Swatch token="--Caution-Base" label="Caution" />
          </Row>
        </Panel>

        {/* 03 Text Styles */}
        <Panel no="03" title="Text Styles">
          <div className="typo-display-lg" style={{ color: "var(--Text-High-Emphasis)" }}>
            Display
          </div>
          <div className="typo-heading-xl" style={{ color: "var(--Text-High-Emphasis)" }}>
            Heading XL
          </div>
          <div className="typo-body-md" style={{ color: "var(--Text-Medium-Emphasis)" }}>
            Body — 本文用テキスト。読みやすさを優先した行間・字間。
          </div>
          <div className="typo-label-md" style={{ color: "var(--Text-High-Emphasis)" }}>
            Label — ボタン・タグ
          </div>
          <div className="typo-caption" style={{ color: "var(--Text-Low-Emphasis)" }}>
            Caption — 補足・注釈
          </div>
        </Panel>

        {/* 04 Badges / Tags / Chips */}
        <Panel no="04" title="Badges · Tags · Chips">
          <div>
            <GroupLabel>Badge</GroupLabel>
            <Row>
              <Badge>NEW</Badge>
              <Badge variant="success">成功</Badge>
              <Badge variant="warning">注意</Badge>
              <Badge variant="info">情報</Badge>
              <Badge variant="destructive">エラー</Badge>
              <Badge variant="outline">下書き</Badge>
            </Row>
          </div>
          <div>
            <GroupLabel>Tag</GroupLabel>
            <Row>
              <Tag>特集</Tag>
              <Tag>人気</Tag>
              <Tag>期間限定</Tag>
            </Row>
          </div>
          <div>
            <GroupLabel>Chip（選択・件数）</GroupLabel>
            <Row>
              <Chip selected count={156}>
                すべて
              </Chip>
              <Chip>React</Chip>
              <Chip>TypeScript</Chip>
            </Row>
          </div>
        </Panel>

        {/* 05 Icons */}
        <Panel no="05" title="Icons（iconsax）">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 16,
              color: "var(--Text-High-Emphasis)",
            }}
          >
            {[
              { Icon: Eye, label: "Safety" },
              { Icon: Bus, label: "Transit" },
              { Icon: Coffee, label: "Cafe" },
              { Icon: Location, label: "Location" },
              { Icon: Star1, label: "Rating" },
              { Icon: Heart, label: "Save" },
              { Icon: Setting4, label: "Settings" },
              { Icon: Eye, label: "View" },
            ].map(({ Icon, label }, i) => (
              <div
                key={i}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}
              >
                <Icon size={26} />
                <span className="typo-caption" style={{ color: "var(--Text-Low-Emphasis)" }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </Panel>

        {/* 06 Controls（動く） */}
        <ControlsPanel />

        {/* 07 Inputs */}
        <Panel no="07" title="Inputs">
          <Input placeholder="お名前を入力" />
          <SearchBar placeholder="キーワードで検索…" />
        </Panel>

        {/* 08 Avatars */}
        <Panel no="08" title="Avatars">
          <Row>
            <Avatar className="size-14">
              <AvatarFallback>KS</AvatarFallback>
            </Avatar>
            <Avatar className="size-12">
              <AvatarFallback>YT</AvatarFallback>
            </Avatar>
            <Avatar className="size-10">
              <AvatarFallback>AM</AvatarFallback>
            </Avatar>
            <Avatar className="size-8">
              <AvatarFallback>+9</AvatarFallback>
            </Avatar>
          </Row>
        </Panel>

        {/* 09 Feedback */}
        <Panel no="09" title="Feedback">
          <Alert variant="success">
            <AlertTitle>送信完了</AlertTitle>
            <AlertDescription>内容を保存しました。</AlertDescription>
          </Alert>
          <div>
            <GroupLabel>Progress</GroupLabel>
            <Progress value={64} />
          </div>
          <Row>
            <ProgressRing value={72} />
            <Spinner />
          </Row>
        </Panel>

        {/* 10 Card / Commerce */}
        <Panel no="10" title="Card · Commerce" span={2}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            <Card>
              <CardHeader>
                <CardTitle>プレミアムプラン</CardTitle>
                <CardDescription>チーム向けの全機能</CardDescription>
              </CardHeader>
              <CardContent>
                <PriceDisplay price={4800} />
              </CardContent>
              <CardFooter>
                <Button className="w-full">申し込む</Button>
              </CardFooter>
            </Card>
            <StatCard label="月間アクティブ" value="12,480" trend={{ value: 8.2, label: "前月比" }} />
            <StatCard
              label="コンバージョン率"
              value="3.4%"
              variant="success"
              trend={{ value: 1.1, label: "前月比" }}
            />
          </div>
        </Panel>
      </div>

      {/* フッター */}
      <footer
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "8px 24px 40px",
          color: "var(--Text-Low-Emphasis)",
        }}
        className="typo-caption"
      >
        上部ツールバーの Theme を切り替えると、全コンポーネントの色が一括で変わります。
      </footer>
    </div>
  )
}

const meta: Meta = {
  title: "Foundation/Showcase",
  parameters: {
    layout: "fullscreen",
    options: { showPanel: false },
  },
  // ポスターは Docs 自動生成・Controls 不要
  tags: ["!autodocs"],
}
export default meta

export const UIKit: StoryObj = {
  name: "UI Kit（ショーケース）",
  render: () => <Showcase />,
}
