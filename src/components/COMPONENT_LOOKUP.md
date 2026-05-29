# Component Lookup（AI必読）

> **このファイルは `node scripts/generate-component-lookup.mjs` で自動生成されています。手動編集しないでください。**

コンポーネントを使う前に必ずこのファイルを確認し、既存コンポーネントを再利用すること。
独自でコンポーネントを定義する前に、ここに同等品がないか確認すること。

---

## UI Components（src/components/ui/）

| Component | Import | Variants | Stories |
|-----------|--------|----------|---------|
| Accordion, AccordionItem, AccordionTrigger, AccordionContent | `@/components/ui/accordion` | — | ThreeItems, MultipleOpen |
| AlertDialog, AlertDialogTrigger, AlertDialogPortal, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel | `@/components/ui/alert-dialog` | — | Default, Small |
| Alert, AlertTitle, AlertDescription | `@/components/ui/alert` | **variant**: `success`, `info`, `error`, `warning`, `inline-info`, `inline-caution`, `inline-warning`<br>**variant**: `success`, `info`, `error`, `warning`, `inline-info`, `inline-caution`, `inline-warning` | Info, Success, Error, Warning, InlineInfo, InlineCaution, InlineWarning, AllVariants, Prop-based API (auto icon), Prop-based + action |
| AutoGrowTextarea | `@/components/ui/auto-grow-textarea` | — | — |
| Avatar, AvatarImage, AvatarFallback | `@/components/ui/avatar` | — | WithImage, Fallback, Sizes, Group |
| Badge | `@/components/ui/badge` | **variant**: `default`, `secondary`, `outline`, `destructive`, `success`, `warning`, `info`, `subtle`, `ghost` | Default, Secondary, Outline, Destructive, Success, Warning, Info, Subtle, Ghost, AllVariants |
| Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis | `@/components/ui/breadcrumb` | — | ThreeLevel, WithEllipsis |
| Button | `@/components/ui/button` | — | Default, Secondary, SecondarySwitch, Tertiary, Ghost, Destructive, Link, AllVariants, AllSizes, Inverse on Dark Background, Inverse on Dark Background, Real UI — Hero Section CTAs, Disabled, DisabledAllVariants, IconButton, Glass — Liquid Glass (iOS 26), WithIcon |
| Calendar | `@/components/ui/calendar` | — | Single, Range |
| Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter | `@/components/ui/card` | **variant**: `default`, `media` | FullCard, MinimalCard, HeaderOnly |
| CheckboxCardGroup, CheckboxCardItem | `@/components/ui/checkbox-card` | — | Default, WithDescription, WithExpandedContent, Disabled |
| CheckboxGroup, CheckboxGroupItem | `@/components/ui/checkbox-group` | — | Default, Required, WithError, SingleColumn |
| Checkbox | `@/components/ui/checkbox` | — | Default, Checked, Disabled, DisabledChecked, WithLabel, MultipleOptions, Row Layout (label/description/count), Real UI — Filter Sidebar |
| CoachMark | `@/components/ui/coach-mark` | — | Default, Brand, Placements, Onboarding, Hover |
| Collapsible, CollapsibleTrigger, CollapsibleContent | `@/components/ui/collapsible` | — | Default, FAQ |
| Combobox | `@/components/ui/combobox` | — | Default, WithDisabledOption |
| CountdownTimer | `@/components/ui/countdown-timer` | — | Filled, Ghost, Compact, Ended, AllVariants |
| DatePicker, DateRangePicker | `@/components/ui/date-picker` | — | Default, WithInitialValue, Disabled, RangePicker, CalendarOnly, CalendarRange |
| Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger | `@/components/ui/dialog` | — | WithTrigger, WithForm |
| DropdownFilter | `@/components/ui/dropdown-filter` | — | Default, ActiveFilter, MultipleFilters |
| DropdownMenu, DropdownMenuPortal, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent | `@/components/ui/dropdown-menu` | — | Default, WithCheckbox, WithRadio, WithSubmenu |
| ErrorBoundary | `@/components/ui/error-boundary` | — | — |
| Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormField | `@/components/ui/form` | — | BasicForm, WithSelect |
| HoverCard, HoverCardTrigger, HoverCardContent | `@/components/ui/hover-card` | — | Default |
| ImageGallery | `@/components/ui/image-gallery` | — | Thumbnail, Dot, Square, Single |
| Input | `@/components/ui/input` | — | Default, WithPlaceholder, Disabled, Error, WithLabel, FileInput |
| Label | `@/components/ui/label` | — | Default, WithRequiredMarker, DisabledState |
| MultiSelect | `@/components/ui/multi-select` | — | Default |
| NavigationBar, IconClose, IconBack, IconShareIos | `@/components/ui/navigation-bar` | — | Default, WithCloseButton, TitleOnly, CustomRightSlot, Liquid Glass — over gradient, Liquid Glass — over photo tone |
| NumberInput | `@/components/ui/number-input` | — | Default, WithMinMax, WithStep, CurrencyFormat, Disabled |
| Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis | `@/components/ui/pagination` | — | FivePages, WithEllipsis |
| PillToggle | `@/components/ui/pill-toggle` | — | Default, TwoState, Small |
| Popover, PopoverTrigger, PopoverContent, PopoverAnchor | `@/components/ui/popover` | — | ClickToShow, SimpleContent |
| ProgressRing | `@/components/ui/progress-ring` | — | Default, Empty, Full, AllSizes, CustomLabel, Animated |
| Progress | `@/components/ui/progress` | — | Default, Empty, Half, Full, AllStates |
| RadioGroup, RadioGroupItem | `@/components/ui/radio-group` | — | ThreeOptions, WithDisabled |
| ResponsiveDialog, ResponsiveDialogTrigger, ResponsiveDialogContent, ResponsiveDialogHeader, ResponsiveDialogTitle, ResponsiveDialogDescription, ResponsiveDialogFooter, ResponsiveDialogClose | `@/components/ui/responsive-dialog` | — | Default |
| ScrollArea, ScrollBar | `@/components/ui/scroll-area` | — | VerticalScroll, LongText |
| Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue | `@/components/ui/select` | **size**: `sm`, `default`, `lg` | WithPlaceholder, WithGroups, WithDisabledItem, DisabledSelect |
| Separator | `@/components/ui/separator` | — | Horizontal, Vertical |
| Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription, SheetDragIndicator | `@/components/ui/sheet` | **side**: `top`, `bottom`, `left`, `right`, `float` | BottomSheet, FloatSheet, RightSheet, Float Glass (Liquid Glass), Bottom Glass (Liquid Glass), BottomSheet — swipeToClose, BottomSheet — Snap 0.4/0.9, BottomSheet — Snap (push-up layout) |
| Skeleton | `@/components/ui/skeleton` | — | CardSkeleton, TextSkeleton, AvatarWithText |
| Slider | `@/components/ui/slider` | — | Default, Range, WithLabel, Disabled |
| SocialLoginButton | `@/components/ui/social-login-button` | — | Line, Google, Apple, Amazon, AllProviders, Loading |
| Spinner | `@/components/ui/spinner` | — | Default, AllSizes |
| StarRating | `@/components/ui/star-rating` | — | Interactive, ReadOnly, Sizes |
| SubNav | `@/components/ui/sub-nav` | — | Underline, Chip, WithBadge |
| Switch | `@/components/ui/switch` | — | Default, Checked, Disabled, DisabledChecked, WithLabel, SettingsList |
| SyncStatusBadge | `@/components/ui/sync-status-badge` | — | Syncing, Success, Error, Offline, AllStates |
| Tabs, TabsList, TabsTrigger, TabsContent | `@/components/ui/tabs` | — | ThreeTabs, WithDisabledTab |
| Textarea | `@/components/ui/textarea` | — | Default, WithPlaceholder, Disabled, Error, AutoGrow |
| TimePicker | `@/components/ui/time-picker` | — | Default, 15分刻み |
| Toaster | `@/components/ui/toast` | **variant**: `default`, `success`, `caution`, `warning`, `info` | Default, Success, Caution, Warning, Info, AllVariants, Fire-and-forget (no <Toaster />) |
| Tooltip, TooltipTrigger, TooltipContent, TooltipProvider | `@/components/ui/tooltip` | — | HoverToShow, OnIconButton |

---

## Pattern Components（src/components/patterns/）

### patterns/admin/

| Component | Import | Variants | Stories |
|-----------|--------|----------|---------|
| BulkActions | `@/components/patterns/admin/bulk-actions` | — | Default, ManySelected |
| ChartControls | `@/components/patterns/admin/chart-controls` | — | Default, PeriodOnly |
| DataTable, DataTableTable, DataTableHeader, DataTableBody, DataTableRow, DataTableHead, DataTableCell, DataTableAvatarCell, DataTableImageCell, DataTableCheckboxCell, DataTableActionCell, DataTableInputCell, DataTableSelectCell, DataTableNumberCell, DataTableDragHandleCell, DataTableLinkCell, DataTableBulkActions, DataTableSectionRow, DataTableAddRow, DataTableEmptyState | `@/components/patterns/admin/data-table` | — | Default, Empty, WithSections, CellVariants, Sticky Columns (左端固定) |
| ImageUploader | `@/components/patterns/admin/image-uploader` | — | Default, Empty |
| KebabMenu | `@/components/patterns/admin/kebab-menu` | — | Default |
| NotificationList | `@/components/patterns/admin/notification-list` | — | Vertical, Horizontal, Empty |
| SearchPanel | `@/components/patterns/admin/search-panel` | — | Default |
| StatusTabs | `@/components/patterns/admin/status-tabs` | — | Default |

### patterns/（汎用）

| Component | Import | Variants | Stories |
|-----------|--------|----------|---------|
| AppHeader | `@/components/patterns/app-header` | — | Default, WithBack, WithSubtitle, WithMenu, Sticky, Glass — Liquid Glass (over gradient), Transparent — scrollable reveal |
| BannerCarousel | `@/components/patterns/banner-carousel` | — | Default, NoHeader, Tall |
| Banner | `@/components/patterns/banner` | **variant**: `info`, `success`, `warning`, `caution` | Info, Success, Warning, Caution, WithAction, AllVariants |
| BottomSheetForm | `@/components/patterns/bottom-sheet-form` | — | Default, WithLoading |
| CategoryNav | `@/components/patterns/category-nav` | — | Default, WithSelection |
| CategoryScroll | `@/components/patterns/category-scroll` | — | Default, CircleShape, GridLayout |
| ChipSelector | `@/components/patterns/chip-selector` | — | MultiSelect, SingleSelect, WithMax |
| Chip | `@/components/patterns/chip` | **variant**: `filled`, `accent`, `outline`<br>**size**: `sm`, `md`, `lg`, `tile`<br>**shape**: `pill`, `square` | Filled, Accent, Outline, AllVariants, AllSizes, Selected, Removable, SquareShape, WithCount, TileAndSoldOut, AsLink, Real UI — Filters & Status |
| CoachMarkOverlay | `@/components/patterns/coach-mark-overlay` | — | — |
| ConfirmDialog | `@/components/patterns/confirm-dialog` | — | Default, Destructive, WithLoading |
| CookieConsent | `@/components/patterns/cookie-consent` | — | — |
| EmptyState | `@/components/patterns/empty-state` | — | WithAction, Minimal, WithIconOnly, With dual action (recommended layout) |
| ErrorState | `@/components/patterns/error-state` | — | DefaultWithRetry, CustomMessages, WithoutRetry |
| FileUpload | `@/components/patterns/file-upload` | — | Default, Multiple |
| FilterChip | `@/components/patterns/filter-chip` | — | — |
| Footer | `@/components/patterns/footer` | — | Default, Minimal |
| FormField | `@/components/patterns/form-field` | — | WithInput, Required, WithError, WithDescription, WithTextarea, WithSelect, CompleteForm |
| FormRoot, FormSection, FormActions | `@/components/patterns/form` | — | Default |
| ListItem | `@/components/patterns/list-item` | — | WithSlots, Interactive, WithBottomSlot |
| ListSkeleton, GridSkeleton | `@/components/patterns/list-skeletons` | — | — |
| MenuDrawer | `@/components/patterns/menu-drawer` | — | Default, NoBanner |
| NotificationBadge | `@/components/patterns/notification-badge` | — | SingleDigit, DoubleDigit, MaxOverflow, CustomMax, Zero, VariousCounts, WithIcon |
| ProgressSteps | `@/components/patterns/progress-steps` | — | Step2Active, FirstStep, ThirdStep, AllComplete, ThreeSteps |
| ReviewOverlay | `@/components/patterns/review-overlay` | — | Default, WithPins |
| SearchBar | `@/components/patterns/search-bar` | — | Default, WithValue, Disabled, WithOnSearch |
| SectionHeader | `@/components/patterns/section-header` | — | WithAction, WithoutAction, TitleOnly, WithGhostButton |
| ShareButtons | `@/components/patterns/share-buttons` | — | Circle, Inline, SelectiveProviders |
| SimplePagination | `@/components/patterns/simple-pagination` | — | アイテム数指定 (items), ページ数指定 (pages), compact (モバイル省略表示), 境界での disabled, 0 件 |
| StatCard | `@/components/patterns/stat-card` | — | TrendUp, TrendDown, NoTrend, Variants, MultipleCards |
| StickyActionBar | `@/components/patterns/sticky-action-bar` | — | Default, TwoButtons, NoBorder |
| SwipeRow | `@/components/patterns/swipe-row` | — | Default, SingleAction |
| TagInput | `@/components/patterns/tag-input` | — | Default, WithInitialTags, WithMax, Disabled |
| Tag | `@/components/patterns/tag` | **variant**: `default`, `brand`, `caution`, `success`, `warning`, `info` | Default, Brand, Caution, Success, Warning, Info, AllVariants |

### patterns/commerce/

| Component | Import | Variants | Stories |
|-----------|--------|----------|---------|
| BottomTabBar | `@/components/patterns/commerce/bottom-tab-bar` | — | Default, Pill — iOS 26 Liquid Glass, Pill — on light background |
| FilterBar | `@/components/patterns/commerce/filter-bar` | — | Default, Interactive |
| ImageCarousel | `@/components/patterns/commerce/image-carousel` | — | Banner, Square, Video, AutoPlay |
| OrderSummary | `@/components/patterns/commerce/order-summary` | — | Default, Simple |
| PriceDisplay | `@/components/patterns/commerce/price-display` | — | Default, Sale, Range, AllSizes |
| ProductCard | `@/components/patterns/commerce/product-card` | — | Vertical, VerticalWithDiscount, VerticalWithCart, VerticalWithRanking, Horizontal, Grid |
| ProductCarousel | `@/components/patterns/commerce/product-carousel` | — | Default, WithRanking, WithCartButton, LargeCards |
| QuantitySelector | `@/components/patterns/commerce/quantity-selector` | — | Medium, Small, WithTrash, Disabled |
| RatingDisplay | `@/components/patterns/commerce/rating-display` | — | Default, AllSizes, ValueOnly |
| ReviewCard, StarRow | `@/components/patterns/commerce/review-card` | — | Default, LowRating, WithSummary |
| ReviewSummary | `@/components/patterns/commerce/review-summary` | — | Default, HighRating |

### patterns/shells/

| Component | Import | Variants | Stories |
|-----------|--------|----------|---------|
| AdminShell | `@/components/patterns/shells/admin-shell` | — | Default |
| AppShell | `@/components/patterns/shells/app-shell` | — | Default |
| MarketingShell | `@/components/patterns/shells/marketing-shell` | — | Default |

---

## よくある間違い

| 禁止（手書き） | 正しい書き方 |
|---|---|
| `<button className="...">` | `<Button variant="..." size="...">` |
| `<input className="...">` | `<Input>` |
| `<textarea className="...">` | `<Textarea>` |
| `<select>...</select>` | `<Select><SelectItem>` |
| `function SectionHeader()` をページ内で定義 | `import { SectionHeader }` |
| `function FormField()` をページ内で定義 | `import { FormField }` |
| `<div className="rounded-xl border p-4">` | `<Card><CardContent>` |
| `text-blue-500` 等 Tailwind 標準色 | `text-[var(--Brand-Primary)]` 等セマンティックトークン |
| `font-bold` 直書き | `typo-body-md-bold` 等 typo-* クラス |

---

## 「DSにない」と誤解されやすいコンポーネント対応表

> **新規コンポーネントを提案・実装する前に必ずこの表を確認すること。**

| やりたいこと | 正しい使い方 | インポート |
|---|---|---|
| アイコンだけのボタン | `<Button size="icon">` / `"icon-sm"` / `"icon-lg"` | `Button` |
| リンク見た目のボタン | `<Button variant="link">` | `Button` |
| チェックボックス | `<Checkbox>` | `Checkbox` |
| ラジオボタン | `<RadioGroup><RadioGroupItem>` | `RadioGroup, RadioGroupItem` |
| Badge の色違い | `<Badge variant="success">` / `"caution"` / `"warning"` / `"info"` | `Badge` |
| 空状態の表示 | `<EmptyState>` | `EmptyState` |
| 数値カード | `<StatCard>` | `StatCard` |
| トースト通知 | `<Toaster>` + `useToast()` | `Toaster, useToast` |
| スケルトン | `<Skeleton>` | `Skeleton` |
| 下部ナビゲーション | `<BottomTabBar>` | `BottomTabBar` |
| プログレスバー | `<Progress>` | `Progress` |
| フォームフィールド | `<FormField>` | `FormField` |
| ケバブメニュー | `<KebabMenu>` | `KebabMenu` |
| モーダル（PC） | `<Dialog>` | `Dialog, DialogContent, ...` |
| ドロワー（モバイル） | `<Sheet side="bottom">` | `Sheet, SheetContent, ...` |
| PC/モバイル自動切替モーダル | `<ResponsiveDialog>` | `ResponsiveDialog, ...` |
