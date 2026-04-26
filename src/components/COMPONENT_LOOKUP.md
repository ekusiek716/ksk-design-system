# Component Lookup（AI必読）

> **このファイルは `node scripts/generate-component-lookup.mjs` で自動生成されています。手動編集しないでください。**

コンポーネントを使う前に必ずこのファイルを確認し、既存コンポーネントを再利用すること。
独自でコンポーネントを定義する前に、ここに同等品がないか確認すること。

---

## UI Components（src/components/ui/）

| Component | Import | Variants | Stories |
|-----------|--------|----------|---------|
| Accordion, AccordionItem, AccordionTrigger, AccordionContent | `@/components/ui/accordion` | — | ThreeItems, MultipleOpen |
| Avatar, AvatarImage, AvatarFallback | `@/components/ui/avatar` | — | WithImage, Fallback, Sizes, Group |
| Badge | `@/components/ui/badge` | **variant**: `default`, `secondary`, `outline`, `destructive`, `success`, `warning`, `info`, `subtle`, `ghost` | Default, Secondary, Outline, Destructive, Success, Warning, Info, Subtle, Ghost, AllVariants |
| Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis | `@/components/ui/breadcrumb` | — | ThreeLevel, WithEllipsis |
| Button | `@/components/ui/button` | **variant**: `default`, `secondary`, `secondary-switch`, `tertiary`, `ghost`, `destructive`, `link`<br>**size**: `xs`, `sm`, `default`, `lg`, `xl`, `icon`, `icon-sm`, `icon-lg` | Default, Secondary, SecondarySwitch, Tertiary, Ghost, Destructive, Link, AllVariants, AllSizes, Disabled, DisabledAllVariants, IconButton, WithIcon |
| Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter | `@/components/ui/card` | — | FullCard, MinimalCard, HeaderOnly |
| Checkbox | `@/components/ui/checkbox` | — | Default, Checked, Disabled, DisabledChecked, WithLabel, MultipleOptions |
| Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger | `@/components/ui/dialog` | — | WithTrigger, WithForm |
| Input | `@/components/ui/input` | — | Default, WithPlaceholder, Disabled, Error, WithLabel, FileInput |
| Label | `@/components/ui/label` | — | Default, WithRequiredMarker, DisabledState |
| Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis | `@/components/ui/pagination` | — | FivePages, WithEllipsis |
| Popover, PopoverTrigger, PopoverContent, PopoverAnchor | `@/components/ui/popover` | — | ClickToShow, SimpleContent |
| Progress | `@/components/ui/progress` | — | Default, Empty, Half, Full, AllStates |
| RadioGroup, RadioGroupItem | `@/components/ui/radio-group` | — | ThreeOptions, WithDisabled |
| ResponsiveDialog, ResponsiveDialogTrigger, ResponsiveDialogContent, ResponsiveDialogHeader, ResponsiveDialogTitle, ResponsiveDialogDescription, ResponsiveDialogFooter, ResponsiveDialogClose | `@/components/ui/responsive-dialog` | — | Default |
| ScrollArea, ScrollBar | `@/components/ui/scroll-area` | — | VerticalScroll, LongText |
| Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue | `@/components/ui/select` | — | WithPlaceholder, WithGroups, WithDisabledItem, DisabledSelect |
| Separator | `@/components/ui/separator` | — | Horizontal, Vertical |
| Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription | `@/components/ui/sheet` | **side**: `top`, `bottom`, `left`, `right` | RightSide, LeftSide |
| Skeleton | `@/components/ui/skeleton` | — | CardSkeleton, TextSkeleton, AvatarWithText |
| Switch | `@/components/ui/switch` | — | Default, Checked, Disabled, DisabledChecked, WithLabel, SettingsList |
| Tabs, TabsList, TabsTrigger, TabsContent | `@/components/ui/tabs` | — | ThreeTabs, WithDisabledTab |
| Textarea | `@/components/ui/textarea` | — | Default, WithPlaceholder, Disabled, Error |
| Toaster | `@/components/ui/toast` | **variant**: `default`, `success`, `caution`, `warning`, `info` | Default, Success, Caution, Warning, Info, AllVariants |
| Tooltip, TooltipTrigger, TooltipContent, TooltipProvider | `@/components/ui/tooltip` | — | HoverToShow, OnIconButton |

---

## Pattern Components（src/components/patterns/）

### patterns/admin/

| Component | Import | Variants | Stories |
|-----------|--------|----------|---------|
| BulkActionBar | `@/components/patterns/admin/bulk-action-bar` | — | Default, ManySelected |
| DataTable, DataTableTable, DataTableHeader, DataTableBody, DataTableRow, DataTableHead, DataTableCell, DataTableAvatarCell, DataTableImageCell, DataTableCheckboxCell, DataTableActionCell, DataTableInputCell, DataTableSelectCell, DataTableNumberCell, DataTableDragHandleCell, DataTableLinkCell, DataTableBulkActions, DataTableSectionRow, DataTableAddRow, DataTableEmptyState | `@/components/patterns/admin/data-table` | — | Default, Empty, WithSections, CellVariants |
| ImageUploader | `@/components/patterns/admin/image-uploader` | — | Default, Empty |
| KebabMenu | `@/components/patterns/admin/kebab-menu` | — | Default |
| NotificationList | `@/components/patterns/admin/notification-list` | — | Vertical, Horizontal, Empty |
| SearchPanel | `@/components/patterns/admin/search-panel` | — | Default |
| StatusTabs | `@/components/patterns/admin/status-tabs` | — | Default |

### patterns/（汎用）

| Component | Import | Variants | Stories |
|-----------|--------|----------|---------|
| Banner | `@/components/patterns/banner` | **variant**: `info`, `success`, `warning`, `caution` | Info, Success, Warning, Caution, WithAction, AllVariants |
| Chip | `@/components/patterns/chip` | **variant**: `filled`, `accent`, `outline`<br>**size**: `sm`, `md`, `lg`<br>**shape**: `pill`, `square` | Filled, Accent, Outline, AllVariants, AllSizes, Selected, Removable, SquareShape |
| EmptyState | `@/components/patterns/empty-state` | — | WithAction, Minimal, WithIconOnly |
| ErrorState | `@/components/patterns/error-state` | — | DefaultWithRetry, CustomMessages, WithoutRetry |
| FormField | `@/components/patterns/form-field` | — | WithInput, Required, WithError, WithDescription, WithTextarea, WithSelect, CompleteForm |
| FormRoot, FormSection, FormActions | `@/components/patterns/form` | — | Default |
| ListItem | `@/components/patterns/list-item` | — | WithSlots, Interactive, WithBottomSlot |
| NotificationBadge | `@/components/patterns/notification-badge` | — | SingleDigit, DoubleDigit, MaxOverflow, CustomMax, Zero, VariousCounts, WithIcon |
| ProgressSteps | `@/components/patterns/progress-steps` | — | Step2Active, FirstStep, ThirdStep, AllComplete, ThreeSteps |
| SearchBar | `@/components/patterns/search-bar` | — | Default, WithValue, Disabled, WithOnSearch |
| SectionHeader | `@/components/patterns/section-header` | — | WithAction, WithoutAction, TitleOnly, WithGhostButton |
| StatCard | `@/components/patterns/stat-card` | — | TrendUp, TrendDown, NoTrend, MultipleCards |
| Tag | `@/components/patterns/tag` | **variant**: `default`, `brand`, `caution`, `success`, `warning`, `info` | Default, Brand, Caution, Success, Warning, Info, AllVariants |

### patterns/commerce/

| Component | Import | Variants | Stories |
|-----------|--------|----------|---------|
| BottomNav | `@/components/patterns/commerce/bottom-nav` | — | Default |
| FilterBar | `@/components/patterns/commerce/filter-bar` | — | Default, Interactive |
| ImageCarousel | `@/components/patterns/commerce/image-carousel` | — | Banner, Square, Video, AutoPlay |
| OrderSummary | `@/components/patterns/commerce/order-summary` | — | Default, Simple |
| PriceDisplay | `@/components/patterns/commerce/price-display` | — | Default, Sale, Range, AllSizes |
| ProductCard | `@/components/patterns/commerce/product-card` | — | Vertical, VerticalWithDiscount, VerticalWithCart, VerticalWithRanking, Horizontal, Grid |
| ProductCarousel | `@/components/patterns/commerce/product-carousel` | — | Default, WithRanking, WithCartButton, LargeCards |
| QuantitySelector | `@/components/patterns/commerce/quantity-selector` | — | Medium, Small, WithTrash, Disabled |
| RatingDisplay | `@/components/patterns/commerce/rating-display` | — | Default, AllSizes, ValueOnly |

### patterns/shells/

| Component | Import | Variants | Stories |
|-----------|--------|----------|---------|
| AdminShell | `@/components/patterns/shells/admin-shell` | — | — |
| AppShell | `@/components/patterns/shells/app-shell` | — | — |
| MarketingShell | `@/components/patterns/shells/marketing-shell` | — | — |

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
