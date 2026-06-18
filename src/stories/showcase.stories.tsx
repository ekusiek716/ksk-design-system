/**
 * @file UI Kit ショーケース（プレゼン用ポスター）
 * @description 主要コンポーネントを 1 枚のポスターとして並べて魅せるページ。
 *   遷移は行わない（実物をその場で見せる）。プレゼン・営業資料・チームへの
 *   全体像共有用。Gallery は「全件タイル + 遷移」、こちらは「映える縮図」。
 *
 *   背景色・枠線を持たないフラットなレイアウト。骨組み（番号付き見出し等）は
 *   story 専用の装飾なので token 付き inline style / typo-* で組み、中身は必ず
 *   実 DS コンポーネントを使う（手書き UI は置かない）。
 */
import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import {
  Eye, Star1, Heart, Location, Bus, Coffee, Setting4, Notification,
  ShoppingCart, Calendar as CalendarIcon, SearchNormal1, Filter, Home2, User,
} from "iconsax-reactjs"

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
import { Textarea } from "@/components/ui/textarea"
import { NumberInput } from "@/components/ui/number-input"
import { SearchBar } from "@/components/patterns/search-bar"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Combobox } from "@/components/ui/combobox"
import { MultiSelect } from "@/components/ui/multi-select"
import { DatePicker } from "@/components/ui/date-picker"
import { TimePicker } from "@/components/ui/time-picker"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import { PillToggle } from "@/components/ui/pill-toggle"
import { SubNav } from "@/components/ui/sub-nav"
import { DropdownFilter } from "@/components/ui/dropdown-filter"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { SimplePagination } from "@/components/patterns/simple-pagination"
import { ProgressSteps } from "@/components/patterns/progress-steps"
import { StatusTabs } from "@/components/patterns/admin/status-tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { NotificationBadge } from "@/components/patterns/notification-badge"
import { SyncStatusBadge } from "@/components/ui/sync-status-badge"
import { FilterChip } from "@/components/patterns/filter-chip"
import { Progress } from "@/components/ui/progress"
import { ProgressRing } from "@/components/ui/progress-ring"
import { Spinner } from "@/components/ui/spinner"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { StatCard } from "@/components/patterns/stat-card"
import { PriceDisplay } from "@/components/patterns/commerce/price-display"
import { RatingDisplay } from "@/components/patterns/commerce/rating-display"
import { QuantitySelector } from "@/components/patterns/commerce/quantity-selector"
import { ReviewSummary } from "@/components/patterns/commerce/review-summary"
import { OrderSummary } from "@/components/patterns/commerce/order-summary"
import { ProductCard } from "@/components/patterns/commerce/product-card"
import { EmptyState } from "@/components/patterns/empty-state"
import { ListItem } from "@/components/patterns/list-item"
import { SectionHeader } from "@/components/patterns/section-header"
import { CountdownTimer } from "@/components/ui/countdown-timer"
import { SocialLoginButton } from "@/components/ui/social-login-button"
import { SocialIcon } from "@/components/ui/social-icon"

/* ─────────────────────────────────────────────
 * 骨組み（poster scaffolding）— 背景色・枠線なし
 * ───────────────────────────────────────────── */

/** 番号付きセクション。枠線なし、見出し下に細いルールのみ */
function Panel({
  no,
  title,
  span = 1,
  children,
}: {
  no: string
  title: string
  span?: 1 | 2
  children: React.ReactNode
}) {
  return (
    <section
      style={{
        gridColumn: `span ${span}`,
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 8,
          paddingBottom: 8,
          borderBottom: "1px solid var(--Border-Low-Emphasis)",
        }}
      >
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

const Stack = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{children}</div>
)

/** カラースウォッチ（色そのものが内容なので塗りは残す。枠線はなし） */
function Swatch({ token, label }: { token: string; label: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 72 }}>
      <div style={{ height: 44, borderRadius: 10, background: `var(${token})` }} />
      <span className="typo-label-xs" style={{ color: "var(--Text-High-Emphasis)" }}>
        {label}
      </span>
    </div>
  )
}

/* ─────────────────────────────────────────────
 * インタラクティブな小パネル（実物として動かす）
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
          <GroupLabel>Switch</GroupLabel>
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
            <label className="typo-body-sm" style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <RadioGroupItem value="standard" /> 標準
            </label>
            <label className="typo-body-sm" style={{ display: "flex", gap: 6, alignItems: "center" }}>
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

function InputsPanel() {
  const [num, setNum] = React.useState(2)
  return (
    <Panel no="07" title="Text Inputs">
      <Input placeholder="お名前を入力" />
      <Textarea placeholder="メッセージを入力…" rows={2} />
      <Row>
        <div>
          <GroupLabel>Number</GroupLabel>
          <NumberInput value={num} onChange={setNum} min={0} max={99} />
        </div>
      </Row>
      <SearchBar placeholder="キーワードで検索…" />
    </Panel>
  )
}

function SelectsPanel() {
  const [combo, setCombo] = React.useState("react")
  const [multi, setMulti] = React.useState<string[]>(["a", "b"])
  const fw = [
    { value: "react", label: "React" },
    { value: "vue", label: "Vue" },
    { value: "svelte", label: "Svelte" },
  ]
  const tags = [
    { value: "a", label: "デザイン" },
    { value: "b", label: "開発" },
    { value: "c", label: "運用" },
  ]
  return (
    <Panel no="08" title="Selects">
      <div>
        <GroupLabel>Select</GroupLabel>
        <Select defaultValue="tokyo">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tokyo">東京</SelectItem>
            <SelectItem value="osaka">大阪</SelectItem>
            <SelectItem value="fukuoka">福岡</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <GroupLabel>Combobox</GroupLabel>
        <Combobox options={fw} value={combo} onChange={setCombo} />
      </div>
      <div>
        <GroupLabel>MultiSelect</GroupLabel>
        <MultiSelect options={tags} value={multi} onChange={setMulti} />
      </div>
    </Panel>
  )
}

function DateTimePanel() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [time, setTime] = React.useState("10:30")
  return (
    <Panel no="09" title="Date & Time">
      <div>
        <GroupLabel>Date Picker</GroupLabel>
        <DatePicker value={date} onChange={setDate} />
      </div>
      <div>
        <GroupLabel>Time Picker</GroupLabel>
        <TimePicker value={time} onChange={setTime} />
      </div>
    </Panel>
  )
}

function TogglesPanel() {
  const [pill, setPill] = React.useState("list")
  const [nav, setNav] = React.useState("all")
  return (
    <Panel no="12" title="Tooltip & Toggles">
      <div>
        <GroupLabel>Tooltip</GroupLabel>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="secondary">ホバーしてみて</Button>
            </TooltipTrigger>
            <TooltipContent>ツールチップの説明</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div>
        <GroupLabel>Pill Toggle</GroupLabel>
        <PillToggle
          value={pill}
          onChange={setPill}
          options={[
            { value: "list", label: "リスト" },
            { value: "grid", label: "グリッド" },
          ]}
        />
      </div>
      <div>
        <GroupLabel>Sub Nav</GroupLabel>
        <SubNav
          value={nav}
          onChange={setNav}
          items={[
            { value: "all", label: "すべて" },
            { value: "new", label: "新着" },
            { value: "popular", label: "人気" },
          ]}
        />
      </div>
    </Panel>
  )
}

function NavigationPanel() {
  const [page, setPage] = React.useState(2)
  const [filter, setFilter] = React.useState<string>("all")
  return (
    <Panel no="13" title="Navigation">
      <div>
        <GroupLabel>Breadcrumb</GroupLabel>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">ホーム</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">商品</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>詳細</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div>
        <GroupLabel>Pagination</GroupLabel>
        <SimplePagination page={page} totalPages={10} onPageChange={setPage} />
      </div>
      <div>
        <GroupLabel>Dropdown Filter</GroupLabel>
        <DropdownFilter
          label="ステータス"
          value={filter}
          onSelect={(v) => setFilter(v)}
          options={[
            { key: "active", label: "公開中" },
            { key: "draft", label: "下書き" },
          ]}
        />
      </div>
    </Panel>
  )
}

function FiltersChipPanel() {
  const [active, setActive] = React.useState(true)
  return (
    <Panel no="24" title="Filter Chips & Misc">
      <div>
        <GroupLabel>Filter Chip</GroupLabel>
        <Row>
          <FilterChip label="エリア" value="東京" isActive={active} onClick={() => setActive((v) => !v)} />
          <FilterChip label="価格" onClick={() => {}} />
        </Row>
      </div>
      <div>
        <GroupLabel>Countdown</GroupLabel>
        <CountdownTimer targetDate={new Date(Date.now() + 1000 * 60 * 60 * 26)} />
      </div>
      <div>
        <GroupLabel>Label + Separator</GroupLabel>
        <Label>区切り線</Label>
        <Separator />
      </div>
    </Panel>
  )
}

function CommercePanel() {
  const [qty, setQty] = React.useState(2)
  return (
    <Panel no="18" title="Commerce — Price & Rating">
      <Row>
        <PriceDisplay price={4800} originalPrice={6000} />
        <PriceDisplay price={1200} size="lg" />
      </Row>
      <Row>
        <RatingDisplay rating={4.3} reviewCount={156} />
        <StarRating value={5} size="sm" />
      </Row>
      <div>
        <GroupLabel>Quantity</GroupLabel>
        <QuantitySelector value={qty} onChange={setQty} />
      </div>
    </Panel>
  )
}

/* ─────────────────────────────────────────────
 * ポスター本体
 * ───────────────────────────────────────────── */

function Showcase() {
  return (
    <div style={{ fontFamily: "var(--font-sans, system-ui, sans-serif)" }}>
      {/* ヘッダー（背景なし） */}
      <header
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "40px 24px 24px",
        }}
      >
        <h1 className="typo-display-lg" style={{ margin: 0, color: "var(--Brand-Primary)" }}>
          KSK Design System
        </h1>
        <p
          className="typo-body-lg"
          style={{ margin: "8px 0 0", color: "var(--Text-Medium-Emphasis)" }}
        >
          UI Kit — マルチテーマ対応の統合デザインシステム。Brand 色を差し替えるだけで全体が切り替わります。
        </p>
      </header>

      {/* グリッド */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: 24,
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 32,
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
          <div className="typo-display-lg" style={{ color: "var(--Text-High-Emphasis)" }}>Display</div>
          <div className="typo-heading-xl" style={{ color: "var(--Text-High-Emphasis)" }}>Heading XL</div>
          <div className="typo-heading-md" style={{ color: "var(--Text-High-Emphasis)" }}>Heading MD</div>
          <div className="typo-body-md" style={{ color: "var(--Text-Medium-Emphasis)" }}>
            Body — 本文用テキスト。読みやすさを優先した行間・字間。
          </div>
          <div className="typo-label-md" style={{ color: "var(--Text-High-Emphasis)" }}>Label — ボタン・タグ</div>
          <div className="typo-caption" style={{ color: "var(--Text-Low-Emphasis)" }}>Caption — 補足・注釈</div>
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
              <Chip selected count={156}>すべて</Chip>
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
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 16,
              color: "var(--Text-High-Emphasis)",
            }}
          >
            {[
              { Icon: Eye, label: "View" },
              { Icon: Bus, label: "Transit" },
              { Icon: Coffee, label: "Cafe" },
              { Icon: Location, label: "Location" },
              { Icon: Star1, label: "Rating" },
              { Icon: Heart, label: "Save" },
              { Icon: Setting4, label: "Settings" },
              { Icon: Notification, label: "Notify" },
              { Icon: ShoppingCart, label: "Cart" },
              { Icon: SearchNormal1, label: "Search" },
              { Icon: Filter, label: "Filter" },
              { Icon: CalendarIcon, label: "Date" },
              { Icon: Home2, label: "Home" },
              { Icon: User, label: "User" },
            ].map(({ Icon, label }, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <Icon size={24} />
                <span className="typo-caption" style={{ color: "var(--Text-Low-Emphasis)" }}>{label}</span>
              </div>
            ))}
          </div>
        </Panel>

        {/* 06 Controls */}
        <ControlsPanel />

        {/* 07 Text Inputs */}
        <InputsPanel />

        {/* 08 Selects */}
        <SelectsPanel />

        {/* 09 Date & Time */}
        <DateTimePanel />

        {/* 10 Tabs */}
        <Panel no="10" title="Tabs">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">概要</TabsTrigger>
              <TabsTrigger value="members">メンバー</TabsTrigger>
              <TabsTrigger value="settings">設定</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <p className="typo-body-sm" style={{ color: "var(--Text-Medium-Emphasis)" }}>
                概要タブの内容です。
              </p>
            </TabsContent>
          </Tabs>
        </Panel>

        {/* 11 Accordion */}
        <Panel no="11" title="Accordion">
          <Accordion type="single" collapsible>
            <AccordionItem value="a1">
              <AccordionTrigger>KSK Design System とは？</AccordionTrigger>
              <AccordionContent>
                <span className="typo-body-sm">複数案件を 1 つの DS で回すための統合デザインシステムです。</span>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="a2">
              <AccordionTrigger>テーマは切り替えられる？</AccordionTrigger>
              <AccordionContent>
                <span className="typo-body-sm">Brand 色 10 行を差し替えるだけで全体が連動します。</span>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Panel>

        {/* 12 Tooltip & Toggles */}
        <TogglesPanel />

        {/* 13 Navigation */}
        <NavigationPanel />

        {/* 14 Steps & Status */}
        <Panel no="14" title="Steps & Status">
          <div>
            <GroupLabel>Progress Steps</GroupLabel>
            <ProgressSteps steps={["カート", "情報入力", "確認", "完了"]} currentStep={1} />
          </div>
          <div>
            <GroupLabel>Status Tabs</GroupLabel>
            <StatusTabs
              items={[
                { label: "すべて", count: 128 },
                { label: "公開中", count: 84 },
                { label: "下書き", count: 12 },
              ]}
            />
          </div>
        </Panel>

        {/* 15 Feedback */}
        <Panel no="15" title="Feedback / Alert">
          <Alert variant="success">
            <AlertTitle>送信完了</AlertTitle>
            <AlertDescription>内容を保存しました。</AlertDescription>
          </Alert>
          <Alert variant="warning">
            <AlertTitle>メンテナンス予定</AlertTitle>
            <AlertDescription>1/1 0:00〜3:00 は利用できません。</AlertDescription>
          </Alert>
        </Panel>

        {/* 16 Loading */}
        <Panel no="16" title="Loading & Progress">
          <div>
            <GroupLabel>Progress</GroupLabel>
            <Progress value={64} />
          </div>
          <Row>
            <ProgressRing value={72} />
            <Spinner />
          </Row>
          <div>
            <GroupLabel>Skeleton</GroupLabel>
            <Stack>
              <Skeleton style={{ height: 12, width: "80%" }} />
              <Skeleton style={{ height: 12, width: "60%" }} />
            </Stack>
          </div>
        </Panel>

        {/* 17 Avatars & Status Badges */}
        <Panel no="17" title="Avatars & Status">
          <div>
            <GroupLabel>Avatar + Notification</GroupLabel>
            <Row>
              <span style={{ position: "relative", display: "inline-flex" }}>
                <Avatar className="size-12"><AvatarFallback>KS</AvatarFallback></Avatar>
                <NotificationBadge count={5} style={{ position: "absolute", top: -4, right: -4 }} />
              </span>
              <Avatar className="size-10"><AvatarFallback>YT</AvatarFallback></Avatar>
              <Avatar className="size-8"><AvatarFallback>+9</AvatarFallback></Avatar>
            </Row>
          </div>
          <div>
            <GroupLabel>Sync Status</GroupLabel>
            <Row>
              <SyncStatusBadge state="success" />
              <SyncStatusBadge state="syncing" />
              <SyncStatusBadge state="error" errorCount={2} />
            </Row>
          </div>
        </Panel>

        {/* 18 Commerce — Price & Rating */}
        <CommercePanel />

        {/* 19 Product Card */}
        <Panel no="19" title="Product Card">
          <div style={{ maxWidth: 280 }}>
            <ProductCard
              name="ハンドメイド・レザーバッグ"
              imageUrl="https://picsum.photos/seed/ksk-bag/400/300"
              price={12800}
              originalPrice={16000}
              rating={4.5}
              reviewCount={89}
            />
          </div>
        </Panel>

        {/* 20 Reviews & Orders */}
        <Panel no="20" title="Reviews & Orders">
          <ReviewSummary averageRating={4.3} totalCount={312} distribution={[180, 90, 25, 12, 5]} />
          <OrderSummary
            lineItems={[
              { label: "小計", value: "¥12,800" },
              { label: "送料", value: "¥500" },
            ]}
            totalValue="¥13,300"
            ctaLabel="購入手続きへ"
          />
        </Panel>

        {/* 21 Cards & Stats */}
        <Panel no="21" title="Cards & Stats" span={2}>
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
            <StatCard label="コンバージョン率" value="3.4%" variant="success" trend={{ value: 1.1, label: "前月比" }} />
          </div>
        </Panel>

        {/* 22 Lists & Sections */}
        <Panel no="22" title="Lists & Sections">
          <SectionHeader title="おすすめ" description="あなた向けの一覧" />
          <ListItem
            title="田中 太郎"
            description="フロントエンドエンジニア"
            leftSlot={<Avatar className="size-9"><AvatarFallback>田</AvatarFallback></Avatar>}
            rightSlot={<Badge variant="subtle">招待中</Badge>}
          />
          <ListItem
            title="佐藤 花子"
            description="プロダクトデザイナー"
            leftSlot={<Avatar className="size-9"><AvatarFallback>佐</AvatarFallback></Avatar>}
            rightSlot={<Badge variant="success">参加</Badge>}
          />
        </Panel>

        {/* 23 Empty State & Social */}
        <Panel no="23" title="Empty State & Social">
          <EmptyState
            icon={<SearchNormal1 size={32} />}
            title="結果が見つかりません"
            description="条件を変えて再度お試しください。"
            action={<Button variant="secondary" size="sm">条件をリセット</Button>}
          />
          <div>
            <GroupLabel>Social Login</GroupLabel>
            <Stack>
              <SocialLoginButton provider="google" />
              <SocialLoginButton provider="line" />
            </Stack>
          </div>
          <div>
            <GroupLabel>Social Icons</GroupLabel>
            <Row>
              <SocialIcon platform="x-ex-twitter" size={24} />
              <SocialIcon platform="instagram" size={24} />
              <SocialIcon platform="youtube" size={24} />
              <SocialIcon platform="github" size={24} />
            </Row>
          </div>
        </Panel>

        {/* 24 Filter Chips & Misc */}
        <FiltersChipPanel />
      </div>

      {/* フッター */}
      <footer
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "8px 24px 48px",
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
  tags: ["!autodocs"],
}
export default meta

export const UIKit: StoryObj = {
  name: "UI Kit（ショーケース）",
  render: () => <Showcase />,
}
