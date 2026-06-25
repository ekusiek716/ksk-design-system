# Native Marathon TODO — 完了

## ✅ 全Phase 完走

`npm run check` → エラー 0 / 警告 52 (既存Web側のみ・native側ゼロ)
`tsc -p tsconfig.native.json --noEmit` → 通過

### Phase 1: 単純表示（13）✅
Avatar / Chip / Tag / Spinner / Separator / Skeleton(+SkeletonText) / Progress / ProgressRing / StarRating / NotificationBadge / StatCard / SyncStatusBadge / CountdownTimer

### Phase 2: 基本フォーム（13）✅
Label / Input / Textarea / AutoGrowTextarea / Switch / Checkbox / CheckboxField / CheckboxCard / CheckboxGroup / RadioGroup / Slider / NumberInput / FormField

### Phase 3: オーバーレイ（14）✅
Alert / Dialog / AlertDialog / Sheet / ResponsiveDialog / Popover / DropdownMenu / Toast(+ToastProvider/useToast) / MenuDrawer / ConfirmDialog / BottomSheetForm / ReviewOverlay / CoachMark / CoachMarkOverlay

### Phase 4: 選択（13）✅
Select / Combobox / MultiSelect / DropdownFilter / PillToggle / Tabs(+List/Trigger/Content) / Calendar / DatePicker / TimePicker / Accordion / Collapsible / ScrollArea / Pagination / SimplePagination

### Phase 5: ナビゲーション意味変換（3）✅
NavigationBar (BottomTabs風) / SubNav (SegmentedTabs風) / Breadcrumb (BackHeader風)

### Phase 6: pattern汎用（追加 parity 含む）✅
AppHeader / Banner / BannerCarousel / SearchBar / ListItem / EmptyState / ErrorState / SectionHeader / StickyActionBar / SwipeRow / Footer / FileUpload / Screen / PhotoHero / MediaActionCluster / CompactFilePicker / ImageAttachmentPicker / ActionTile / QuickActionGrid / ChipSelector / CategoryNav / CategoryScroll / ProgressSteps / TagInput / ShareButtons / FilterChip / ImageGallery / SocialLoginButton / SocialIcon / ListSkeletons / ListSkeleton / GridSkeleton

### Phase 7: commerce（11）✅
BottomTabBar / FilterBar / ImageCarousel / PriceDisplay / QuantitySelector / RatingDisplay / ProductCard / ProductCarousel / OrderSummary / ReviewCard / ReviewSummary

### Phase 8: shells（2）✅
AppShell / MarketingShell

## 仕上げ
- [x] examples/native-sandbox の App.tsx に NewComponentsShowcase 追加
- [x] tsc -p tsconfig.native.json --noEmit 通過
- [x] npm run check エラー 0
- [x] lint-scratch 対策（SocialIcon の brand hex を social-icon-data.ts に分離）
- [x] Screen / PhotoHero / MediaActionCluster / ListSkeleton / GridSkeleton の Web/RN parity 追加
- [x] scripts/check-native-parity.mjs と src/native/COMPONENT_LOOKUP.md で RN 差分の再発を検出

## スキップ
- cookie-consent / hover-card / tooltip（hover非対応/Web専用）
- 管理画面系（patterns/admin/* / shells/admin-shell）
- error-boundary（Web依存）
- Form (RHF) → FormField + 各入力で代用
- AdminShell → 対象外

## 既知の限界
- ProgressRing は SVG 非依存の簡易表現（角度の境界で見た目が荒い場合あり、後で react-native-svg 導入なら差し替え推奨）
- SocialIcon は SVG ロゴでなく頭文字 + ブランド色での簡略表現
- Sheet/Popover は基本Modal実装。Gesture-handler/Reanimated を入れたら滑らかにできる
- Calendar は JS のみ自前実装（locale=ja のみ十分対応）
