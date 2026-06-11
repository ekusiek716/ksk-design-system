# API v2 提案 — 命名・型の一貫性統一

実装レビュー（観点: API 一貫性）で検出した「同じ概念に別名・別語彙が混在している」箇所の統一案。
**いずれも破壊変更**を含むため v2（major）として計画し、`RELEASE.md` のメジャー段取り（T-4w〜）に乗せる。
非破壊で先行できるものは「先行可能」と明記した。

> 配布は vendor tgz vendoring（消費5リポ: belle-todo / trip_todo / ninshin-todo / yokoku-app / pawly）。
> 破壊変更は全消費リポの追従 PR とセットで実施する。codemod を `scripts/codemod/v1-to-v2.mjs` に用意する前提。

---

## 1. 値変更コールバック名の統一（破壊）

同じ「選択値の変更」に3系統が混在:
- `onChange(value)`: Combobox, MultiSelect, PillToggle, StarRating, NumberInput, SubNav, ChipSelector, TagInput, TimePicker, DatePicker/DateRangePicker
- `onSelect`: DropdownFilter（`onSelect(key)`）, FilterBar（`onSelect(value|null)`）, StatusTabs（`onSelect(index)` ← index ベースで二重に異質）
- Radix 透過: Select / Tabs / RadioGroup（`onValueChange`）, Checkbox / Switch（`onCheckedChange`）

**方針**: DS 独自コンポーネントは **`onChange(value)`** に統一。Radix 透過系（`onValueChange` / `onCheckedChange`）は Radix 準拠のため据え置き。StatusTabs は index → value ベースに変更。
**移行**: 旧 prop を deprecated として1マイナー併存→ codemod でリネーム→ v2 で削除。

## 2. `...props` / ref 透過（大半は非破壊・先行可能）

`forwardRef` 不使用かつ `{...props}` spread が無く、ref / data-* / aria-* を root に渡せないコンポーネントが約35件
（SubNav, DropdownFilter, TimePicker, SyncStatusBadge, DatePicker, StarRating, ProgressRing, NumberInput, Combobox,
PillToggle, CoachMark, ImageGallery, MultiSelect, ShareButtons, BottomSheetForm, ConfirmDialog, Footer, ChipSelector,
ReviewOverlay, MenuDrawer, TagInput, FileUpload, CategoryScroll, AppHeader, CategoryNav, SwipeRow,
BannerCarousel, ReviewCard, ReviewSummary, ChartControls ほか）。

**方針**: `extends React.ComponentProps<"div">`（適切な要素）+ root へ `{...props}` spread を標準化。React 19 では spread に ref も含まれるため forwardRef 不要。
**先行可能**: spread 追加は基本**非破壊**（既存利用に影響なし）。v2 を待たず順次入れてよい。要素型が変わる箇所のみ注意。

## 3. size 語彙の統一（破壊）

- "default" 系: Button, Select, AlertDialogContent, NotificationBadge, PaginationLink
- "md" 系: Spinner, StarRating, ProgressRing, NumberInput, PillToggle, Chip, ChipSelector, PriceDisplay, QuantitySelector, RatingDisplay, CategoryScroll
- number 型: SocialIcon（`size?: number`）

**方針**: DS 独自系は **`sm | md | lg`** に統一。shadcn 由来（Button/Select 等）の `default` は互換のため据え置きと明文化。SocialIcon は `size` トークン名（sm/md/lg）+ 数値併用可に。

## 4. ネガティブ状態 variant の統一（破壊）

- Alert: `error`（+ `inline-caution`）
- Toast / Banner / Progress / Tag: `caution`（Toast は `toast.error()` が内部で `"caution"` にマップする隠れエイリアス）
- Badge / Button / DropdownMenuItem / SwipeRow / ConfirmDialog: `destructive`

**方針**: 通知・状態表示系は **`error`** に統一。操作ボタンの `destructive`（取り返しのつかない操作）は意味が異なるため据え置き。

## 5. アクティブ/選択 prop の統一（破壊）

`isActive`（Pagination, FilterChip, AppHeaderNavItem, BottomTabBarItem）/ `isSelected`（CategoryNavItem）/ `selected`（Chip, DataTable 行）/ `active`（ReviewPin）。
**方針**: **`isActive`** に統一。

## 6. 開閉 API の統一（破壊・小）

MenuDrawer のみ `open + onClose`、他（Dialog/Sheet/ConfirmDialog/BottomSheetForm/ResponsiveDialog）は `open + onOpenChange`。CoachMark は両方持つ。
**方針**: **`open + onOpenChange`** に統一。

## 7. 型 export の統一（非破壊・先行可能）

- index.ts から漏れている Props 型: ButtonProps, CardProps, CheckboxProps, ChipProps, DialogContentProps, SelectTriggerProps, FormFieldProps, ListItemProps, ToastAction, AppHeaderNavItem ほか
- そもそも未 export の Props 型: Banner, EmptyState, ErrorState, SearchBar, SectionHeader, NotificationBadge, ProgressSteps, Tag, PriceDisplay, RatingDisplay, QuantitySelector, OrderSummary, ProductCarousel, ImageCarousel, SearchPanel, ImageUploader, AdminShell/AppShell/MarketingShell ほか

**方針**: 全公開コンポーネントで `XxxProps` を export し index.ts で再 export する規約に。**非破壊・先行可能**。

## 8. その他

- option アイテムのキー: `{value,label}` に統一（DropdownFilter のみ `{key,label}`）（破壊）
- `desc` → `description`（CoachStep のみ `desc`）（破壊・小）
- 型名衝突回避: filter-bar の `export interface FilterChip` を `FilterBarChip` にリネーム（FilterChip コンポーネントと衝突）（非破壊）

---

## 実施順の推奨

1. **先行（非破壊・v1 系で随時）**: #2 spread/ref 標準化、#7 型 export、#8 の FilterChip 型リネーム
2. **v2 計画（破壊）**: #1 コールバック名 → #3 size → #4 variant → #5 isActive → #6 onClose → #8 残り
   - T-4w: 本ファイルを確定し MIGRATION.md に統合、`scripts/codemod/v1-to-v2.mjs` 着手
   - 各 prop は1マイナーで deprecated 併存させてから v2 で削除
