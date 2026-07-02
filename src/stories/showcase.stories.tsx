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
import { AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog"
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "@/components/ui/sheet"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { KebabMenu } from "@/components/patterns/admin/kebab-menu"
import { ConfirmDialog } from "@/components/patterns/confirm-dialog"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import { Calendar } from "@/components/ui/calendar"
import { DateRangePicker } from "@/components/ui/date-picker"
import { Banner } from "@/components/patterns/banner"
import { ErrorState } from "@/components/patterns/error-state"
import { ReviewCard } from "@/components/patterns/commerce/review-card"
import { CategoryNav } from "@/components/patterns/category-nav"
import { CategoryScroll } from "@/components/patterns/category-scroll"
import { TagInput } from "@/components/patterns/tag-input"
import { CheckboxGroup, CheckboxGroupItem } from "@/components/ui/checkbox-group"
import { CheckboxCardGroup, CheckboxCardItem } from "@/components/ui/checkbox-card"
import { CheckboxField } from "@/components/ui/checkbox-field"
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext, PaginationEllipsis } from "@/components/ui/pagination"
import { ShareButtons } from "@/components/patterns/share-buttons"
import { BottomTabBar } from "@/components/patterns/commerce/bottom-tab-bar"
import { ProductCarousel } from "@/components/patterns/commerce/product-carousel"
import { ImageCarousel } from "@/components/patterns/commerce/image-carousel"
import { ImageGallery } from "@/components/ui/image-gallery"
import { FileUpload } from "@/components/patterns/file-upload"
import { ChartControls } from "@/components/patterns/admin/chart-controls"
import { Footer } from "@/components/patterns/footer"
import { NavigationBar } from "@/components/ui/navigation-bar"

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

// render 中の Date.now() 呼び出しは react-hooks/purity 違反になるため
// module 読込時に一度だけ算出する（26時間後 = 「1日と2時間」表示のデモ用）
const countdownTarget = new Date(Date.now() + 1000 * 60 * 60 * 26)

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
        <CountdownTimer targetDate={countdownTarget} />
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

function ConfirmDialogPanel() {
  const [open, setOpen] = React.useState(false)
  return (
    <Panel no="28" title="Confirm Dialog">
      <Row>
        <Button variant="destructive" onClick={() => setOpen(true)}>削除する</Button>
      </Row>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="本当に削除しますか？"
        description="この操作は元に戻せません。"
        confirmLabel="削除"
        variant="destructive"
        onConfirm={() => setOpen(false)}
      />
    </Panel>
  )
}

function CollapsiblePanel() {
  const [open, setOpen] = React.useState(false)
  return (
    <Panel no="29" title="Collapsible">
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">{open ? "閉じる" : "詳細を開く"}</Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <p className="typo-body-sm" style={{ color: "var(--Text-Medium-Emphasis)", marginTop: 8 }}>
            折りたたみ可能な領域。開閉アニメーション付き。
          </p>
        </CollapsibleContent>
      </Collapsible>
    </Panel>
  )
}

function CalendarPanel() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [range, setRange] = React.useState<{ from?: Date; to?: Date }>({})
  return (
    <Panel no="30" title="Calendar & Range">
      <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "flex-start" }}>
        <Calendar mode="single" selected={date} onSelect={setDate} />
        <div>
          <GroupLabel>Date Range Picker</GroupLabel>
          <DateRangePicker value={range} onChange={(r) => setRange(r ?? {})} />
        </div>
      </div>
    </Panel>
  )
}

function TagInputPanel() {
  const [tags, setTags] = React.useState<string[]>(["React", "TypeScript"])
  return (
    <Panel no="35" title="Tag Input">
      <TagInput value={tags} onChange={setTags} />
    </Panel>
  )
}

function ChartControlsPanel() {
  const [g, setG] = React.useState<"hour" | "day" | "week" | "month">("day")
  const [p, setP] = React.useState<"7d" | "30d" | "90d" | "1y" | "custom">("30d")
  return (
    <Panel no="42" title="Chart Controls">
      <ChartControls granularity={g} onGranularityChange={setG} period={p} onPeriodChange={setP} />
    </Panel>
  )
}

const DEMO_PRODUCT = {
  name: "サンプル商品",
  imageUrl: "https://picsum.photos/seed/ksk-p/300/300",
  price: 2980,
  rating: 4.4,
  reviewCount: 52,
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

        {/* 25 Overlays — Dialog / AlertDialog / Sheet */}
        <Panel no="25" title="Overlays（モーダル）">
          <Row>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary">Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>確認</DialogTitle>
                  <DialogDescription>この内容で保存しますか？</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="secondary">キャンセル</Button>
                  </DialogClose>
                  <Button>保存</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">AlertDialog</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>
                  <AlertDialogDescription>この操作は元に戻せません。</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>キャンセル</AlertDialogCancel>
                  <AlertDialogAction variant="destructive">削除する</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="secondary">Sheet</Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="px-5 pt-5 pb-6">
                <SheetHeader className="mb-4">
                  <SheetTitle>ボトムシート</SheetTitle>
                  <SheetDescription>下からスライドインします。</SheetDescription>
                </SheetHeader>
                <SheetFooter>
                  <SheetClose asChild>
                    <Button className="w-full" size="lg">閉じる</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </Row>
        </Panel>

        {/* 26 Menus — Popover / HoverCard / DropdownMenu / Kebab */}
        <Panel no="26" title="Menus & Popovers">
          <Row>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="secondary">Popover</Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="typo-body-sm" style={{ color: "var(--Text-High-Emphasis)" }}>
                  ポップオーバーの内容です。
                </div>
              </PopoverContent>
            </Popover>

            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="link">@ksk_ds</Button>
              </HoverCardTrigger>
              <HoverCardContent>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <Avatar><AvatarFallback>KS</AvatarFallback></Avatar>
                  <span className="typo-body-sm">KSK Design System</span>
                </div>
              </HoverCardContent>
            </HoverCard>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary">Dropdown</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>アクション</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>編集</DropdownMenuItem>
                <DropdownMenuItem>複製</DropdownMenuItem>
                <DropdownMenuItem variant="destructive">削除</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <KebabMenu items={[{ label: "編集" }, { label: "複製" }, { label: "削除", destructive: true }]} />
          </Row>
        </Panel>

        {/* 27 Confirm Dialog */}
        <ConfirmDialogPanel />

        {/* 28 Collapsible */}
        <CollapsiblePanel />

        {/* 29 Calendar & Range */}
        <CalendarPanel />

        {/* 30 Banner & Error State */}
        <Panel no="31" title="Banner & Error State">
          <Banner variant="info" title="お知らせ" description="新機能がリリースされました。" />
          <Banner variant="success" title="完了" description="設定を保存しました。" />
          <Banner variant="warning" title="注意" description="まもなくメンテナンスを行います。" />
          <ErrorState
            title="読み込みに失敗しました"
            description="通信環境を確認してください。"
            onRetry={() => {}}
          />
        </Panel>

        {/* 32 Review Card */}
        <Panel no="32" title="Review Card">
          <ReviewCard
            reviewer="山田 太郎"
            rating={5}
            title="期待以上でした"
            body="作りがしっかりしていて、毎日使っています。リピート確定です。"
            date="2026-06-10"
          />
        </Panel>

        {/* 33 Category Nav & Scroll */}
        <Panel no="33" title="Category Nav & Scroll" span={2}>
          <div>
            <GroupLabel>Category Nav</GroupLabel>
            <CategoryNav
              items={[
                { name: "ファッション", imageUrl: "https://picsum.photos/seed/c1/80", isSelected: true },
                { name: "家電", imageUrl: "https://picsum.photos/seed/c2/80" },
                { name: "食品", imageUrl: "https://picsum.photos/seed/c3/80" },
                { name: "本", imageUrl: "https://picsum.photos/seed/c4/80" },
                { name: "スポーツ", imageUrl: "https://picsum.photos/seed/c5/80" },
              ]}
            />
          </div>
          <div>
            <GroupLabel>Category Scroll</GroupLabel>
            <CategoryScroll
              title="カテゴリ"
              items={[
                { name: "新着", href: "#", imageUrl: "https://picsum.photos/seed/s1/80" },
                { name: "セール", href: "#", imageUrl: "https://picsum.photos/seed/s2/80" },
                { name: "人気", href: "#", imageUrl: "https://picsum.photos/seed/s3/80" },
                { name: "限定", href: "#", imageUrl: "https://picsum.photos/seed/s4/80" },
              ]}
            />
          </div>
        </Panel>

        {/* 34 Tag Input */}
        <TagInputPanel />

        {/* 36 Checkbox family */}
        <Panel no="36" title="Checkbox Variants">
          <div>
            <GroupLabel>Checkbox Group</GroupLabel>
            <CheckboxGroup label="配送方法">
              <CheckboxGroupItem defaultChecked>通常配送</CheckboxGroupItem>
              <CheckboxGroupItem>速達配送</CheckboxGroupItem>
              <CheckboxGroupItem>置き配</CheckboxGroupItem>
            </CheckboxGroup>
          </div>
          <div>
            <GroupLabel>Checkbox Card</GroupLabel>
            <CheckboxCardGroup>
              <CheckboxCardItem description="月額 ¥500">ライト</CheckboxCardItem>
              <CheckboxCardItem description="月額 ¥1,000" badge={<Badge>人気</Badge>} defaultChecked>スタンダード</CheckboxCardItem>
            </CheckboxCardGroup>
          </div>
          <div>
            <GroupLabel>Checkbox Field</GroupLabel>
            <CheckboxField label="利用規約に同意する" description="続行するには同意が必要です。" />
          </div>
        </Panel>

        {/* 37 Pagination (full) */}
        <Panel no="37" title="Pagination">
          <Pagination>
            <PaginationContent>
              <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
              <PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem>
              <PaginationItem><PaginationLink href="#" isActive>2</PaginationLink></PaginationItem>
              <PaginationItem><PaginationLink href="#">3</PaginationLink></PaginationItem>
              <PaginationItem><PaginationEllipsis /></PaginationItem>
              <PaginationItem><PaginationNext href="#" /></PaginationItem>
            </PaginationContent>
          </Pagination>
        </Panel>

        {/* 38 Share Buttons */}
        <Panel no="38" title="Share Buttons">
          <ShareButtons url="https://example.com" title="KSK Design System" />
        </Panel>

        {/* 39 Bottom Tab Bar */}
        <Panel no="39" title="Bottom Tab Bar">
          <div
            style={{
              position: "relative",
              height: 72,
              overflow: "hidden",
              borderRadius: 12,
              transform: "translateZ(0)",
            }}
          >
            <BottomTabBar
              items={[
                { label: "ホーム", icon: <Home2 size={22} /> },
                { label: "検索", icon: <SearchNormal1 size={22} /> },
                { label: "お気に入り", icon: <Heart size={22} /> },
                { label: "マイページ", icon: <User size={22} /> },
              ]}
            />
          </div>
        </Panel>

        {/* 40 Carousels & Gallery */}
        <Panel no="40" title="Carousels & Gallery" span={2}>
          <ProductCarousel
            title="おすすめ商品"
            products={[
              { ...DEMO_PRODUCT, name: "商品 A", imageUrl: "https://picsum.photos/seed/pa/300/300" },
              { ...DEMO_PRODUCT, name: "商品 B", imageUrl: "https://picsum.photos/seed/pb/300/300", price: 5400 },
              { ...DEMO_PRODUCT, name: "商品 C", imageUrl: "https://picsum.photos/seed/pc/300/300", price: 1980 },
              { ...DEMO_PRODUCT, name: "商品 D", imageUrl: "https://picsum.photos/seed/pd/300/300", price: 8800 },
            ]}
          />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 8 }}>
            <div>
              <GroupLabel>Image Carousel</GroupLabel>
              <ImageCarousel
                images={[
                  { src: "https://picsum.photos/seed/ic1/600/300", alt: "1" },
                  { src: "https://picsum.photos/seed/ic2/600/300", alt: "2" },
                  { src: "https://picsum.photos/seed/ic3/600/300", alt: "3" },
                ]}
              />
            </div>
            <div>
              <GroupLabel>Image Gallery</GroupLabel>
              <ImageGallery
                images={[
                  { src: "https://picsum.photos/seed/ig1/600/600", alt: "1" },
                  { src: "https://picsum.photos/seed/ig2/600/600", alt: "2" },
                  { src: "https://picsum.photos/seed/ig3/600/600", alt: "3" },
                ]}
              />
            </div>
          </div>
        </Panel>

        {/* 41 File Upload */}
        <Panel no="41" title="File Upload">
          <FileUpload multiple />
        </Panel>

        {/* 42 Chart Controls */}
        <ChartControlsPanel />

        {/* 43 Navigation Bar */}
        <Panel no="43" title="Navigation Bar">
          <div style={{ border: "1px solid var(--Border-Low-Emphasis)", borderRadius: 12, overflow: "hidden" }}>
            <NavigationBar title="設定" leftIcon="back" onLeft={() => {}} onShare={() => {}} />
          </div>
        </Panel>

        {/* 44 Footer */}
        <Panel no="44" title="Footer" span={2}>
          <Footer
            linkGroups={[
              { title: "サービス", links: [{ label: "機能", href: "#" }, { label: "料金", href: "#" }] },
              { title: "会社情報", links: [{ label: "会社概要", href: "#" }, { label: "採用", href: "#" }] },
              { title: "サポート", links: [{ label: "ヘルプ", href: "#" }, { label: "お問い合わせ", href: "#" }] },
            ]}
            copyright="© 2026 KSK Design System"
          />
        </Panel>

        {/* 45 Avatar with image */}
        <Panel no="45" title="Avatar (image)">
          <Row>
            <Avatar className="size-12">
              <AvatarImage src="https://picsum.photos/seed/av1/80" alt="user" />
              <AvatarFallback>KS</AvatarFallback>
            </Avatar>
            <Avatar className="size-12">
              <AvatarImage src="https://picsum.photos/seed/av2/80" alt="user" />
              <AvatarFallback>YT</AvatarFallback>
            </Avatar>
            <Avatar className="size-12">
              <AvatarImage src="https://picsum.photos/seed/av3/80" alt="user" />
              <AvatarFallback>AM</AvatarFallback>
            </Avatar>
          </Row>
        </Panel>
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
