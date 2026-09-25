# Web / Native 対応表

<!-- AUTO-GENERATED: node scripts/generate-native-support.mjs -->

正本: contracts/components.json / src/index.ts / src/native/components/index.ts / scripts/check-native-parity.mjs / contracts/native-device-verification.json。

**対応ありは export の存在を示します。機能・見た目・実機の同等性を保証しません。**
props は直接宣言分のみ。継承props・型・複合部品の子propsは含みません。「抽出不可」を「差なし」と解釈しないでください。

| 部品 | Web | Native | Webのみの直接props | Nativeのみの直接props | 意図した差・注意 | 実OSの検証記録 |
|---|---|---|---|---|---|---|
| Accordion | あり | あり | 抽出不可 | 抽出不可 |  | 未検証 |
| AccordionContent | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| AccordionItem | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| AccordionTrigger | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| ActionTile | あり | あり |  | disabled, onPress, style | DOM event naming (onClick/onOpenChange/onSearch) vs RN naming (onPress/onClose/onChange) is each platform's idiomatic convention, not a functional gap; className/CSS (Web) vs RN style/StyleSheet (Native) is each platform's idiomatic styling prop, not a functional gap | 未検証 |
| AdminShell | あり | なし | 抽出不可 | 抽出不可 | admin shell is Web dashboard layout; native apps use AppShell or MarketingShell | 未検証 |
| Alert | あり | あり | icon, action | tone, children | Web and Native implementations were designed independently for this component (pre-dates this check); prop vocabulary diverges by design and is tracked here as the established baseline, not a new regression (Web: icon/action prop API; Native: tone + children composition API) | 未検証 |
| AlertDescription | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| AlertDialog | あり | あり | 抽出不可 | 抽出不可 |  | 未検証 |
| AlertDialogAction | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| AlertDialogCancel | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| AlertDialogContent | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| AlertDialogDescription | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| AlertDialogFooter | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| AlertDialogHeader | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| AlertDialogOverlay | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| AlertDialogPortal | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| AlertDialogTitle | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| AlertDialogTrigger | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| AlertTitle | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| AppHeader | あり | あり | layout, logo, centerSlot, rightSlot, nav, bottomSlot, sticky, bordered, variant, className | onBack, centered, safeArea | Web and Native implementations were designed independently for this component (pre-dates this check); prop vocabulary diverges by design and is tracked here as the established baseline, not a new regression (Web: slot-composition header; Native: simpler back-button header). safeArea (issue #351) is Native-only because the Web header is a plain in-page element with no status-bar overlap — the notch avoidance lives in the Web page shell's CSS env(safe-area-inset-*), while RN headers draw under the status bar and need the inset themselves | 未検証 |
| AppShell | あり | あり | topBar, mainId, skipLink, skipLinkLabel | header, footer, scrollable, children | Web and Native implementations were designed independently for this component (pre-dates this check); prop vocabulary diverges by design and is tracked here as the established baseline, not a new regression; mainId/skipLink are DOM landmark features with no RN equivalent | 未検証 |
| AutoGrowTextarea | あり | あり | value, onChange, placeholder, minRows, maxLength, showCount, className | invalid, disabled, minHeight, maxHeight | className/CSS (Web) vs RN style/StyleSheet (Native) is each platform's idiomatic styling prop, not a functional gap; both sides implement auto-grow but exact prop set diverged independently (minRows vs minHeight/maxHeight) | 未検証 |
| AutoPrompt | あり | あり | 抽出不可 | 抽出不可 |  | 未検証 |
| Avatar | あり | あり | 抽出不可 | 抽出不可 |  | 未検証 |
| AvatarFallback | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| AvatarImage | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| Badge | あり | あり | 抽出不可 | 抽出不可 |  | 未検証 |
| Banner | あり | あり | icon, action | image, onPress, tone, height | Web and Native implementations were designed independently for this component (pre-dates this check); prop vocabulary diverges by design and is tracked here as the established baseline, not a new regression (Web: icon/action API; Native: image banner API) | 未検証 |
| BannerCarousel | あり | あり | title, items, moreLabel, onMore, itemAspectRatio, className, regionLabel | banners, height, showIndicator | Web and Native implementations were designed independently for this component (pre-dates this check); prop vocabulary diverges by design and is tracked here as the established baseline, not a new regression (items vs banners naming; Native adds fixed height/indicator). regionLabel (issue #428) labels the Web-only role="region" scroll strip, which has no Native equivalent element / 既定値差: [{"prop":"itemWidth","reason":"Web defaults to a fixed 200px card width; Native intentionally has no destructure default and instead computes a responsive width (`Dimensions.get(\"window\").width - 32`) inside the function body so cards fit the device screen — a deliberate platform difference, not a missed port"}] | 未検証 |
| BottomSheetForm | あり | あり | onOpenChange, submitLabel, cancelLabel, onSubmit, loading, className | onClose, footer | DOM event naming (onClick/onOpenChange/onSearch) vs RN naming (onPress/onClose/onChange) is each platform's idiomatic convention, not a functional gap; Native uses a footer slot instead of Web's submit/cancel label props | 未検証 |
| BottomSheetFrame | あり | あり |  | height, maxHeight, safeArea, handle, header, footer, scrollable, children, style, bodyStyle | className/CSS (Web) vs RN style/StyleSheet (Native) is each platform's idiomatic styling prop, not a functional gap; Native-only slot props (header/footer) have no Web counterpart in this file. height/maxHeight (issue #448) let Native size the frame to its content — Web achieves the same with `h-auto`/`max-h-*` utility classes on the same element, so no Web prop is needed. safeArea/handle are likewise Native-only: Web reads env(safe-area-inset-bottom) in CSS and the Web sheet draws its grab handle in the vaul-based Sheet layer | 未検証 |
| BottomTabBar | あり | あり | centerAction, showLabels, tone, maxWidth, variant, pillPosition, floatingPosition, scrollEdge, navLabel, showOnDesktop | value, onChange, keyboardLiftOffset | Web and Native implementations were designed independently for this component (pre-dates this check); prop vocabulary diverges by design and is tracked here as the established baseline, not a new regression (Web: Liquid Glass visual variants; Native: controlled value/onChange + keyboard-avoidance). navLabel (issue #428) labels the Web-only <nav> landmark; Native tab bars don't render a DOM nav element. showOnDesktop (issue #486) toggles the Web-only `lg:` breakpoint that hides the bar at desktop widths — RN has no CSS media query layer and the native tab bar is always visible, so there is nothing to opt out of | 未検証 |
| Breadcrumb | あり | あり | label | title, onBack, backLabel, rightSlot | Web and Native implementations were designed independently for this component (pre-dates this check); prop vocabulary diverges by design and is tracked here as the established baseline, not a new regression (Web: DOM breadcrumb trail; Native: single-level back header) | 未検証 |
| BreadcrumbEllipsis | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| BreadcrumbItem | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| BreadcrumbLink | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| BreadcrumbList | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| BreadcrumbPage | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| BreadcrumbSeparator | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| BulkActions | あり | なし | 抽出不可 | 抽出不可 | admin table bulk action toolbar is Web-only | 未検証 |
| Button | あり | あり | asChild, haptic, unstyled | variant, elevation, containerStyle, pressedContainerStyle, textStyle, leadingIcon, trailingIcon, loading, loadingLabel, spinnerColor, children | asChild (Radix Slot) has no RN equivalent, native composition wraps components directly; haptic (navigator.vibrate) is Web-only mobile-browser API; unstyled (issue #420) strips the Web Tailwind layer for gradual migration — Native has no CSS layer to strip (styles are StyleSheet/inline). variant/size/tone are declared via `extends VariantProps<typeof ...Variants>` on Web (inherited, so invisible to this own-props-only extractor) but declared directly in Native's own Props interface — an extraction-method artifact, not a real gap. Native additionally exposes RN-only styling (containerStyle/pressedContainerStyle/textStyle), icon slots, and an async loading state not yet ported to Web. spinnerColor (issue #450) overrides the loading ActivityIndicator's color; Web has no spinner concept to diverge from since it has no built-in loading state yet. | 未検証 |
| Calendar | あり | あり |  | value, onChange, minDate, maxDate, locale, weekendTone, todayEmphasis, disablePast, today, defaultMonth, onMonthChange, colors, dayStyle, renderDay, dayAccessibilityLabel, previousMonthLabel, nextMonthLabel, style | Web Calendar wraps react-day-picker (props flow through DayPicker's own types, invisible to this own-props extractor); Native declares its own controlled props directly. The day-presentation props (weekendTone/todayEmphasis/disablePast/renderDay/dayAccessibilityLabel, issue #298④) are react-day-picker's modifiers/formatters/components API on Web, so they are inherited there rather than declared. colors/dayStyle (issue #304) are the Native-only色注入点: Web consumers restyle day cells with CSS variables and the .rdp-* class hooks, so no Web prop is needed | 未検証 |
| Card | あり | あり |  | padding, elevation, radius, children | variant/size/tone are declared via `extends VariantProps<typeof ...Variants>` on Web (inherited, so invisible to this own-props-only extractor) but declared directly in Native's own Props interface — an extraction-method artifact, not a real gap; radius (issue #332) lets Native pick a borderRadius scale key because Native has no className escape hatch — Web achieves the same effect with a `rounded-*` utility class on the same element, so no Web prop is needed | 未検証 |
| CardAction | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| CardContent | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| CardDescription | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| CardFooter | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| CardHeader | あり | あり | 抽出不可 | 抽出不可 |  | 未検証 |
| CardTitle | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| CategoryNav | あり | あり | className | value, onChange | className/CSS (Web) vs RN style/StyleSheet (Native) is each platform's idiomatic styling prop, not a functional gap; Native adds controlled selection not yet ported to Web | 未検証 |
| CategoryScroll | あり | あり | title, moreHref, thumbnailSize, thumbnailShape, layout, gridRows, className | value, onChange | Web and Native implementations were designed independently for this component (pre-dates this check); prop vocabulary diverges by design and is tracked here as the established baseline, not a new regression (Web: richer layout options; Native: controlled selection) | 未検証 |
| Celebration | あり | あり | dismissLabel | style, cardStyle, testID | className/CSS (Web) vs RN style/StyleSheet (Native) is each platform's idiomatic styling prop, not a functional gap; dismissLabel (issue #428) labels the Web-only invisible tap-dismiss overlay button | 未検証 |
| CelebrationDialog | あり | あり | className | testID | className/CSS (Web) vs RN style/StyleSheet (Native) is each platform's idiomatic styling prop, not a functional gap | 未検証 |
| ChartControls | あり | なし | 抽出不可 | 抽出不可 | admin analytics controls are Web-only | 未検証 |
| Checkbox | あり | あり | label, description, count, containerClassName | checked, onChange, disabled, size, decorative | Web Checkbox extends Radix CheckboxPrimitive.Root (checked/onChange/disabled are inherited via extends, invisible to this extractor) and adds a polymorphic label/description/count API (v1.16.0); Native declares the base props directly and hasn't grown the polymorphic API yet. decorative is Native-only: react-native-web doesn't honor accessibilityElementsHidden/importantForAccessibility, so a nested decorative Checkbox (e.g. inside CheckboxField) needs an explicit opt-out of its own role/state/tabIndex to avoid a second role=checkbox and aria-hidden-focus violations; Web's Radix CheckboxPrimitive has no equivalent nesting case | 未検証 |
| CheckboxCard | なし | あり | 抽出不可 | 抽出不可 |  | 未検証 |
| CheckboxCardGroup | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| CheckboxCardItem | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| CheckboxField | あり | あり | error, className | checked, onChange, disabled, accessibilityLabel, accessibilityHint | Web CheckboxField spreads Radix Checkbox props (inherited, invisible to this extractor); Native declares them directly and adds RN accessibility props | 未検証 |
| CheckboxGroup | あり | あり | label, required, helpText, error, columns, children, className | options, values, onChange, disabled | Web and Native implementations were designed independently for this component (pre-dates this check); prop vocabulary diverges by design and is tracked here as the established baseline, not a new regression (Web: FormField-style group with children; Native: options/values controlled list) | 未検証 |
| CheckboxGroupItem | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| Chip | あり | あり | href, soldOut | variant, size, shape, disabled | variant/size/tone are declared via `extends VariantProps<typeof ...Variants>` on Web (inherited, so invisible to this own-props-only extractor) but declared directly in Native's own Props interface — an extraction-method artifact, not a real gap; href (renders as <a>) has no RN navigation equivalent baked in; soldOut is a Web-only commerce visual state not yet ported / 既定値差: [{"prop":"selected","reason":"Web leaves `selected` without a destructure default (omitted ⇒ `undefined`, falsy in the `selected ? … : …` checks — same runtime behavior as Native's explicit `false`). required-vs-optional (or shape) differs by design between the two platforms' own Props type, so only one side needs a fallback default — a deliberate API surface difference, not a missed port"},{"prop":"removable","reason":"Same as `selected`: Web's omitted/undefined behaves identically to Native's explicit `false` default. required-vs-optional (or shape) differs by design between the two platforms' own Props type, so only one side needs a fallback default — a deliberate API surface difference, not a missed port"}] | 未検証 |
| ChipFilterBar | あり | あり | sticky, stickyOffset, bare, className |  | sticky positioning is a Web/CSS-only concept; Native scroll containers handle this differently at the screen level | 未検証 |
| ChipSelector | あり | あり | value, size, className, max | values | single (value) vs multi (values) selection API diverged independently between platforms | 未検証 |
| CoachMark | あり | あり | content, children, placement, variant, open, onOpenChange, totalSteps, showClose, onClose, ariaLabel, delayDuration, className | title, description, total, onSkip | Web and Native implementations were designed independently for this component (pre-dates this check); prop vocabulary diverges by design and is tracked here as the established baseline, not a new regression (Web: Radix Popover-anchored tooltip with content slot; Native: title+description fields with its own overlay). ariaLabel (issue #477) overrides the aria-label Radix renders in its visually-hidden role="tooltip" copy of the balloon — a Radix Tooltip implementation detail with no Native counterpart (RN reads the Text nodes directly) / 既定値差: [{"prop":"nextLabel","reason":"Web's default text carries the trailing arrow (\"次へ →\") because the Web balloon's next button is a text-only link-ish control where the arrow is the only affordance; Native's button is a filled pill with its own visual affordance, so its default is the bare \"次へ\" (issue #477). Consumers passing an i18n string replace the whole label on either platform."}] | 未検証 |
| CoachMarkOverlay | あり | あり | steps, onComplete, onSkip, variant, ringColor, maxWidth, labels, autoFocus, restoreFocusOnClose, closeOnEsc | onClose, highlight, children | Web and Native implementations were designed independently for this component (pre-dates this check); prop vocabulary diverges by design and is tracked here as the established baseline, not a new regression (Web: querySelector-driven DOM spotlight tour; Native has its own targeting model). autoFocus/restoreFocusOnClose/closeOnEsc (issue #504) are the DOM focus-trap controls: RN has no Tab traversal or document.activeElement to trap, and its overlay renders no controls of its own. labels (issue #477) i18n's the tour's own next/done/skip buttons and aria-label — Native's overlay renders no buttons of its own (it only dims around a highlight and hosts children), so the labels live on the Native CoachMark (nextLabel/skipLabel) instead | 未検証 |
| Collapsible | あり | あり | 抽出不可 | 抽出不可 |  | 未検証 |
| CollapsibleChipField | あり | あり |  |  |  | 未検証 |
| CollapsibleContent | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| CollapsibleTrigger | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| Combobox | あり | あり | emptyLabel, className, triggerLabel | emptyMessage | emptyLabel/emptyMessage naming diverged independently for the same feature | 未検証 |
| CommitAutoGrowTextarea | あり | あり |  |  |  | 未検証 |
| CommitInput | あり | あり |  |  |  | 未検証 |
| CommitTextarea | あり | あり |  |  |  | 未検証 |
| CompactFilePicker | あり | あり | onFilesChange, inputClassName | disabled, onPress, style | DOM event naming (onClick/onOpenChange/onSearch) vs RN naming (onPress/onClose/onChange) is each platform's idiomatic convention, not a functional gap; Web uses a hidden <input type=file>, Native opens the OS picker via Pressable / 既定値差: [{"prop":"loadingLabel","reason":"Web's default \"処理中\" (issue #539) is required because this file's Web Button has no spinner concept at all (see the Button entry above: loading/loadingLabel are Native-only) — CompactFilePicker swaps the trigger's own text for `loadingLabel` while loading, so an unset default would render a blank-looking button. Native instead forwards loading/loadingLabel straight into Native Button's own `loading` prop, whose ButtonContent renders an ActivityIndicator and only appends a text node when `loadingLabel` is explicitly passed (src/native/components/Button.tsx) — the spinner alone already signals busy state there, so no default caption is needed. Each platform's own Button loading API decides whether a default is required, not a missed port."}] | 未検証 |
| ConfirmDialog | あり | あり | open, onOpenChange, title, description, loadingLabel, variant, onConfirm, loading |  | Native ConfirmDialog composes AlertDialog directly rather than re-declaring its own prop surface (extraction sees no distinct own ConfirmDialogProps body on Native side worth diffing) | 未検証 |
| Container | あり | なし | 抽出不可 | 抽出不可 | responsive max-width and CSS gutter primitive is Web-only; native uses View layout | 未検証 |
| ContentCarousel | あり | なし | 抽出不可 | 抽出不可 | arbitrary ReactNode slides and DOM scroll-snap are Web-only; native consumers use FlatList paging | 未検証 |
| CookieConsent | あり | なし | 抽出不可 | 抽出不可 | browser cookie consent is Web-only | 未検証 |
| CountdownHero | あり | あり | dateLabel, todayValue, className | style, testID | className/CSS (Web) vs RN style/StyleSheet (Native) is each platform's idiomatic styling prop, not a functional gap | 未検証 |
| CountdownTimer | あり | あり | targetDate, granularity, label, endedLabel, todayLabel, variant, compact, className, onEnd, dayUnit, hourUnit, minuteUnit, secondUnit | target, onComplete, tone | Web and Native implementations were designed independently for this component (pre-dates this check); prop vocabulary diverges by design and is tracked here as the established baseline, not a new regression (Web has richer i18n unit-label props; Native uses a simpler target/onComplete/tone API) | 未検証 |
| DataTable | あり | なし | 抽出不可 | 抽出不可 | complex admin table editing is Web-only | 未検証 |
| DataTableActionCell | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| DataTableAddRow | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| DataTableAvatarCell | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| DataTableBody | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| DataTableBulkActions | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| DataTableCell | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| DataTableCheckboxCell | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| DataTableDateCell | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| DataTableDragHandleCell | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| DataTableEmptyState | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| DataTableHead | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| DataTableHeader | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| DataTableImageCell | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| DataTableInputCell | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| DataTableLinkCell | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| DataTableNumberCell | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| DataTableRow | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| DataTableSectionRow | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| DataTableSelectCell | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| DataTableTable | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| DateField | あり | あり | className, dateFormat, triggerLabel | formatter, accessibilityLabel | dateFormat (format string) vs formatter (function) diverged independently for the same feature; accessibilityLabel/triggerLabel (issue #426) are the same trigger label in platform-native vocabulary | 未検証 |
| DatePicker | あり | あり | id, className, dateFormat, triggerLabel, defaultMonth, min, max | minDate, maxDate, formatter, accessibilityLabel | min/max vs minDate/maxDate naming and dateFormat-string vs formatter-function diverged independently; accessibilityLabel/triggerLabel (issue #426) are the same trigger label in platform-native vocabulary | 未検証 |
| DateRangePicker | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| DateTimePicker | あり | あり | min, max, datePlaceholder, timePlaceholder, dateTriggerLabel, timeTriggerLabel | minDate, maxDate, style | className/CSS (Web) vs RN style/StyleSheet (Native) is each platform's idiomatic styling prop, not a functional gap; min/max vs minDate/maxDate naming diverged independently | 未検証 |
| DetailSheetBody | あり | あり | 抽出不可 | 抽出不可 |  | 未検証 |
| DetailSheetHeader | あり | あり |  | children, style |  | 未検証 |
| DetailSheetScaffold | あり | あり |  | children, style | className/CSS (Web) vs RN style/StyleSheet (Native) is each platform's idiomatic styling prop, not a functional gap | 未検証 |
| Dialog | あり | あり | 抽出不可 | 抽出不可 |  | 未検証 |
| DialogClose | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| DialogContent | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| DialogDescription | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| DialogFooter | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| DialogHeader | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| DialogOverlay | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| DialogPortal | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| DialogTitle | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| DialogTrigger | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| DocumentPage | あり | なし | 抽出不可 | 抽出不可 | web naming of the static document page; native provides the same role as DocumentScreen (Screen+AppHeader scaffold) | 未検証 |
| DocumentScreen | なし | あり | 抽出不可 | 抽出不可 |  | 未検証 |
| DropdownFilter | あり | あり | onSelect, hideAll, allLabel, getDisplayLabel, valueOnly, pristineValue, closeLabel, className | onChange | onSelect vs onChange naming; Web has a richer all/pristine-value API not yet ported to Native; closeLabel (issue #417) labels the Web-only close overlay button, no Native equivalent element | 未検証 |
| DropdownMenu | あり | あり | 抽出不可 | 抽出不可 |  | 未検証 |
| DropdownMenuCheckboxItem | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| DropdownMenuContent | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| DropdownMenuGroup | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| DropdownMenuItem | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| DropdownMenuLabel | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| DropdownMenuPortal | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| DropdownMenuRadioGroup | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| DropdownMenuRadioItem | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| DropdownMenuSeparator | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| DropdownMenuShortcut | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| DropdownMenuSub | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| DropdownMenuSubContent | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| DropdownMenuSubTrigger | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| DropdownMenuTrigger | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| EmptyState | あり | あり | actionLabel, actionIcon, actionLayout, actionButtonProps, onAction, size, iconClassName |  | Native EmptyState composes children/action as ReactNode slots rather than a labeled-action prop API (no distinct own props left to diff) | 未検証 |
| ErrorBoundary | あり | あり | onReset, className | onRetry | onReset vs onRetry naming diverged independently for the same callback | 未検証 |
| ErrorState | あり | あり | kind, onRetry, retryLabel |  | Native ErrorState doesn't yet have the kind=notFound variant added to Web (issue #264③ ErrorState guidance) — tracked as a real follow-up, not urgent / 既定値差: [{"prop":"title","reason":"Web has no destructure default but falls back to the *same* text (\"エラーが発生しました\") via `title ?? (notFound ? … : \"エラーが発生しました\")` inside the function body. Web computes this default with an inline `??` fallback inside the function body (not in the destructured parameter), which this destructure-only extractor can't see; the *effective* default is documented here for the record, not a real behavioral gap — verified identical effective text, not just a shape artifact."},{"prop":"description","reason":"Web has no destructure default but falls back (non-notFound case) to `description ?? \"しばらくしてからもう一度お試しください\"` inside the function body; Native's destructure default was aligned to the identical text (2026-08-10, previously \"時間をおいて再度お試しください。\"). Web computes this default with an inline `??` fallback inside the function body (not in the destructured parameter), which this destructure-only extractor can't see; the *effective* default is documented here for the record, not a real behavioral gap — verified identical effective text after alignment."}] | 未検証 |
| FieldDescription | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| FieldError | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| FieldGroup | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| FieldLegend | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| FieldSeparator | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| FieldSet | あり | なし | 抽出不可 | 抽出不可 | fieldset/legend/group semantics are Web-only; native uses FormSection and FormField for the same visual hierarchy | 未検証 |
| FileUpload | あり | あり | accept, maxSize, multiple, maxFiles, onUpload, className, dragLabel, orLabel, browseLabel, maxSizeLabel, maxFilesLabel, removeLabel | title, description, onPress | Web and Native implementations were designed independently for this component (pre-dates this check); prop vocabulary diverges by design and is tracked here as the established baseline, not a new regression (Web: drag-and-drop multi-file DOM uploader; Native: opens OS picker via Pressable, single-file) | 未検証 |
| FilterBar | あり | あり | resultCount, sortOptions, selectedSort, onSortSelect, onSortClick, onMoreFilters, activeFilterCount, navLabel, moreFiltersLabel | onPressSort | Web has a richer sort/result-count toolbar API not yet ported to Native's simpler onPressSort. navLabel/moreFiltersLabel (issue #428) label the Web-only <nav> landmark and its 絞り込み icon button, no Native equivalent elements / 既定値差: [{"prop":"sortLabel","reason":"Web has no destructure default but falls back to \"並べ替え\" via `sortLabel ?? \"並べ替え\"` at each render site (it also gates whether the result-count/sort row renders at all, so it deliberately can't become a Web destructure default without changing that visibility check); Native's destructure default was aligned to the identical \"並べ替え\" text (2026-08-10, previously \"並び替え\"). Web computes this default with an inline `??` fallback inside the function body (not in the destructured parameter), which this destructure-only extractor can't see; the *effective* default is documented here for the record, not a real behavioral gap — verified identical effective text after alignment."}] | 未検証 |
| FilterChip | あり | あり | label, value, isActive, onClick, className | count | DOM event naming (onClick/onOpenChange/onSearch) vs RN naming (onPress/onClose/onChange) is each platform's idiomatic convention, not a functional gap; Native adds a count badge not yet ported to Web | 未検証 |
| FilterPill | あり | なし | 抽出不可 | 抽出不可 | 任意コンテンツの Popover（Radix Popover + DOM アンカー配置）に依存する Web 専用のフィルタピル。native の同等 UX は BottomSheetFrame + Chip で、アンカー付き popover ではなくボトムシートで開く | 未検証 |
| FloatingTabBar | なし | あり | 抽出不可 | 抽出不可 |  | 未検証 |
| Footer | あり | あり | logo, linkGroups, paymentIcons, socialLinks, extra, className | links | Web and Native implementations were designed independently for this component (pre-dates this check); prop vocabulary diverges by design and is tracked here as the established baseline, not a new regression (Web: full marketing footer with an extra content slot; Native: simplified single links array) | 未検証 |
| Form | あり | なし | 抽出不可 | 抽出不可 | contracts name 'Form' at src/components/patterns/form.tsx is a label, not an export — Web itself only exports FormRoot/FormSection/FormActions (no `Form` symbol). Native mirrors this with FormRoot/FormSection/FormActions in src/native/components/Form.tsx; the RHF form root at src/components/ui/form.tsx (also named 'Form' in contracts) has no native equivalent by design (native uses FormField plus native inputs instead) | 未検証 |
| FormActions | あり | あり | 抽出不可 | 抽出不可 |  | 未検証 |
| FormControl | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| FormDescription | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| FormField | あり | あり | htmlFor, requiredStyle, endLabel | children | htmlFor is a DOM label-association attribute with no RN equivalent; Native renders its input via children instead | 未検証 |
| FormItem | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| FormLabel | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| FormMessage | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| FormRoot | あり | あり | preventDefault | children |  | 未検証 |
| FormSection | あり | あり |  | children |  | 未検証 |
| GlassView | なし | あり | 抽出不可 | 抽出不可 |  | 未検証 |
| GradientSurface | なし | あり | 抽出不可 | 抽出不可 |  | 未検証 |
| GridSkeleton | あり | あり | loadingLabel, className |  | className/CSS (Web) vs RN style/StyleSheet (Native) is each platform's idiomatic styling prop, not a functional gap | 未検証 |
| HoverCard | あり | なし | 抽出不可 | 抽出不可 | hover interaction is Web-only | 未検証 |
| HoverCardContent | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| HoverCardTrigger | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| IconBadge | あり | あり |  | size, children, style | className/CSS (Web) vs RN style/StyleSheet (Native) is each platform's idiomatic styling prop, not a functional gap | 未検証 |
| IconButton | なし | あり | 抽出不可 | 抽出不可 |  | 未検証 |
| ImageAttachmentPicker | あり | あり | accept |  | accept (MIME filter) is a DOM <input> attribute with no RN equivalent; Native relies on the OS picker's own image-only mode | 未検証 |
| ImageCarousel | あり | あり | aspectRatio, showArrows, autoPlay, regionLabel, previousLabel, nextLabel | height, showCounter | Web and Native implementations were designed independently for this component (pre-dates this check); prop vocabulary diverges by design and is tracked here as the established baseline, not a new regression (Web: arrow/autoplay controls; Native: fixed-height with a counter overlay). regionLabel/previousLabel/nextLabel (issue #428) label the Web-only role="region" scroll strip and its arrow buttons, no Native equivalent elements | 未検証 |
| ImageGallery | あり | あり | indicatorType, aspectRatio, onImageClick, className, prevLabel, nextLabel, imageLabel | initialIndex, thumbnailSize | Web and Native implementations were designed independently for this component (pre-dates this check); prop vocabulary diverges by design and is tracked here as the established baseline, not a new regression (Web: richer indicator/label i18n API; Native: initialIndex + thumbnail sizing) | 未検証 |
| ImageOverlayAction | あり | なし | 抽出不可 | 抽出不可 | 画像上のオーバーレイ操作。native には同役割の MediaActionCluster（44pt ヒットエリア + glass 面）が既にあり、こちらは backdrop-blur / absolute 配置という Web の重ね方に特化しているため移植しない | 未検証 |
| ImageUploader | あり | なし | 抽出不可 | 抽出不可 | admin image uploader is Web-only; native uses CompactFilePicker/ImageAttachmentPicker adapters | 未検証 |
| InfoCircleIcon | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| Input | あり | あり | startAdornment, endAdornment, showCount, unstyled | invalid, disabled, leading, trailing, style, inputStyle | startAdornment/endAdornment (Web) vs leading/trailing (Native) naming diverged independently for the same adornment-slot feature; invalid/disabled are inherited via extends on Web (invisible to this extractor); unstyled (issue #420) strips the Web Tailwind layer for gradual migration — Native has no CSS layer to strip (styles are StyleSheet/inline). style/inputStyle (issue #447) are RN's className-equivalent styling escape hatches (container vs inner TextInput) — Web achieves the same with `className`, which is intentionally Web-only here (see startAdornment/endAdornment note, className itself was already omitted from this diff historically as R_STYLE). | 未検証 |
| KebabMenu | あり | なし | 抽出不可 | 抽出不可 | admin action menu is Web-only; native uses MenuDrawer/DropdownMenu patterns | 未検証 |
| KeyboardAwareSheetFooter | あり | あり |  | children, style | className/CSS (Web) vs RN style/StyleSheet (Native) is each platform's idiomatic styling prop, not a functional gap | 未検証 |
| Label | あり | あり | unstyled | required, children | unstyled (issue #443, follow-up to #420) strips the Web Tailwind layer (typo-label-md / text color / peer-disabled classes) for gradual migration — Native has no CSS layer to strip (styles are StyleSheet/inline). Native's required renders an inline "*" marker Text node not yet ported to Web (Web consumers compose the marker as a child span instead, see label.stories.tsx WithRequiredMarker). | 未検証 |
| LiquidBottomTabBar | なし | あり | 抽出不可 | 抽出不可 |  | 未検証 |
| ListItem | あり | あり |  | leading, title, description, titleTone, descriptionTone, divider, trailing, footerSlot, showChevron, onPress, disabled, align, density | Native titleTone/descriptionTone preserve string typography; divider owns density-dependent insets (#572/#573). Web uses slot styling and border classes. Web ListItem's props live in a discriminated union (ListItemLinkProps \| ListItemButtonProps \| ListItemStaticProps) built from a separate ListItemCommonProps interface, so this `${Name}Props`-interface-body extractor sees no own props on the Web side and reports every Native prop as Native-only. footerSlot/align/density (issue #355) exist on BOTH platforms with the same vocabulary and semantics — an extraction artifact, not a real gap. leading/trailing are Native's naming for Web's leftSlot/rightSlot (independent naming drift predating this check); showChevron/onPress/disabled are likewise declared directly on Native and inside the union on Web | 未検証 |
| ListSkeleton | あり | あり | loadingLabel, className |  | className/CSS (Web) vs RN style/StyleSheet (Native) is each platform's idiomatic styling prop, not a functional gap | 未検証 |
| ListSkeletons | なし | あり | 抽出不可 | 抽出不可 |  | 未検証 |
| MarketingShell | あり | あり | mainId, skipLink, skipLinkLabel | cta, children | mainId/skipLink are DOM landmark features with no RN equivalent; Native adds a cta slot not yet ported to Web | 未検証 |
| MediaActionCluster | あり | あり |  | accessibilityLabel, style | className/CSS (Web) vs RN style/StyleSheet (Native) is each platform's idiomatic styling prop, not a functional gap; accessibilityLabel is RN's aria-label equivalent | 未検証 |
| MenuDrawer | あり | あり | banner, footerLinks, width, className | side, header, footer | Web and Native implementations were designed independently for this component (pre-dates this check); prop vocabulary diverges by design and is tracked here as the established baseline, not a new regression (Web: banner/footerLinks marketing drawer; Native: generic header/footer/side slots) | 未検証 |
| MobileAppHeader | あり | あり | sticky, landmark | children, style | className/CSS (Web) vs RN style/StyleSheet (Native) is each platform's idiomatic styling prop, not a functional gap; landmark is the DOM banner-role toggle added for MobileAppShell nesting (issue #271), no RN landmark equivalent | 未検証 |
| MobileAppShell | あり | あり | mainClassName, contentClassName, bottomNavMode, maxWidth, centeredPreview | scrollable, children, style, contentStyle | className/CSS (Web) vs RN style/StyleSheet (Native) is each platform's idiomatic styling prop, not a functional gap; Web has a richer desktop-sidebar-handoff API (bottomNavMode/maxWidth) with no RN equivalent | 未検証 |
| MobileFloatingActionButton | あり | あり | mobileOnly, fullWidth | style | className/CSS (Web) vs RN style/StyleSheet (Native) is each platform's idiomatic styling prop, not a functional gap; mobileOnly (CSS breakpoint visibility) is a Web-only responsive concept; fullWidth relies on CSS env(safe-area-inset-*) insets and has no Native port yet | 未検証 |
| MobileTabBar | あり | なし | 抽出不可 | 抽出不可 | web-only BottomTabBar wrapper; native uses LiquidBottomTabBar / createExpoRouterTabBar instead | 未検証 |
| MultiSelect | あり | あり | value, emptyLabel, className, maxDisplay, clearable, clearLabel, triggerLabel | values, accessibilityLabel | value vs values naming diverged independently; Web has a richer display-truncation/clearable API not yet ported to Native. clearLabel (issue #428) labels the Web-only clear button; triggerLabel vs accessibilityLabel (issue #426) are the same trigger label in platform vocabulary | 未検証 |
| NavigationBar | あり | あり | title, leftIcon, onLeft, leftLabel, rightSlot, onShare, shareLabel, glass, transparent, className | items, value, onChange | Web and Native implementations were designed independently for this component (pre-dates this check); prop vocabulary diverges by design and is tracked here as the established baseline, not a new regression (Web: single-screen back/share header; Native: this file implements a segmented nav bar, a different pattern entirely) | 未検証 |
| NotFoundIllustration | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| NotificationBadge | あり | あり | size | dot, children | Native adds a dot-only mode and children composition not yet ported to Web / 既定値差: [{"prop":"count","reason":"Web declares `count: number` as required (no default — callers must always pass a value); Native declares `count?: number` optional with a `0` fallback for looser call sites. required-vs-optional (or shape) differs by design between the two platforms' own Props type, so only one side needs a fallback default — a deliberate API surface difference, not a missed port"}] | 未検証 |
| NotificationList | あり | なし | 抽出不可 | 抽出不可 | admin notification list is Web-only | 未検証 |
| NumberInput | あり | あり | format, placeholder, size, className, decrementLabel, incrementLabel |  | Native NumberInput hasn't grown Web's i18n label/format API yet — tracked as a real follow-up, not urgent | 未検証 |
| OrderSummary | あり | あり | lineItems, totalLabel, totalValue, ctaLabel, onCTAClick, ctaDisabled, fixed | lines, currency | lineItems vs lines naming diverged independently; Web adds a sticky CTA footer not yet ported to Native | 未検証 |
| Pagination | あり | あり | navLabel | page, total, onChange, windowSize | Web wraps the DOM nav/ul/li composition (navLabel, issue #428, is the nav's aria-label); Native declares its own controlled page/total/onChange/windowSize props directly, a different composition model entirely | 未検証 |
| PaginationContent | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| PaginationEllipsis | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| PaginationItem | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| PaginationLink | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| PaginationNext | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| PaginationPrevious | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| PhotoHero | あり | あり | imageClassName, contentClassName, loading | style, imageStyle, contentStyle | className/CSS (Web) vs RN style/StyleSheet (Native) is each platform's idiomatic styling prop, not a functional gap; loading (native img loading attr) is DOM-only | 未検証 |
| PillToggle | あり | あり | size, className, onValueChange | disabled | onValueChange is a deprecated backward-compat alias for onChange (issue #264⑥), intentionally Web-only. size/className are Web CSS sizing/styling. Native's disabled (whole-group disable) has no Web port yet — tracked as a real follow-up, not urgent. | 未検証 |
| Popover | あり | あり | 抽出不可 | 抽出不可 |  | 未検証 |
| PopoverAnchor | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| PopoverContent | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| PopoverTrigger | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| PortalContainerProvider | あり | なし | 抽出不可 | 抽出不可 | DOM Portal の描画先を差し替えるための Provider。React Native に DOM Portal は無く、RN の Modal は常にネイティブのルートへ描画されるため Web 専用 | 未検証 |
| PresenceIndicator | あり | あり | className |  | className/CSS (Web) vs RN style/StyleSheet (Native) is each platform's idiomatic styling prop, not a functional gap | 未検証 |
| PriceDisplay | あり | あり | maxPrice, showTaxLabel | size, showTax | variant/size/tone are declared via `extends VariantProps<typeof ...Variants>` on Web (inherited, so invisible to this own-props-only extractor) but declared directly in Native's own Props interface — an extraction-method artifact, not a real gap; Web adds a price-range (maxPrice) mode not yet ported to Native | 未検証 |
| ProductCard | あり | あり | name, imageUrl, imageAlt, shopName, tags, isFavorite, onFavoriteToggle, href, onCardClick, ranking, deliveryLabel, orientation, showCartButton, onCartAdd, cartButtonLabel | image, title, badge, soldOut, onPress, layout | Web and Native implementations were designed independently for this component (pre-dates this check); prop vocabulary diverges by design and is tracked here as the established baseline, not a new regression (Web: full commerce card with favorite/cart/ranking; Native: a simpler card, field names renamed independently e.g. name/title, imageUrl/image) | 未検証 |
| ProductCarousel | あり | あり | subtitle, moreHref, moreLabel, onMoreClick, cardSize, showRanking, showCartButton | action, cardWidth | Web and Native implementations were designed independently for this component (pre-dates this check); prop vocabulary diverges by design and is tracked here as the established baseline, not a new regression (Web: richer header/ranking/cart-toggle API; Native: generic action slot + fixed cardWidth) | 未検証 |
| Progress | あり | あり | transitionDuration, className, id | max, height, tone | className/CSS (Web) vs RN style/StyleSheet (Native) is each platform's idiomatic styling prop, not a functional gap; max/tone are inherited via extends on Web (invisible to this extractor) and declared directly on Native / 既定値差: [{"prop":"variant","reason":"Web's destructure default is the literal \"default\"; Native has no destructure default, but `resolveProgressVariant` falls back to `toneToVariant(tone)` where `tone` defaults to \"accent\" → also resolves to \"default\" (see src/native/progress-logic.ts). Web computes this default with an inline `??` fallback inside the function body (not in the destructured parameter), which this destructure-only extractor can't see; the *effective* default is documented here for the record, not a real behavioral gap — verified the two effective defaults are the same value."}] | 未検証 |
| ProgressRing | あり | あり | color, trackColor, className | max, thickness, colors, accessible, accessibilityLabel, accessibilityRole, accessibilityValue, accessibilityElementsHidden, importantForAccessibility, testID | className/CSS (Web) vs RN style/StyleSheet (Native) is each platform's idiomatic styling prop, not a functional gap; max is inherited via extends on Web. label と tone は issue #559 で Web / Native 両方に同名・同義で揃えた（label は中央スロット、tone は意味名の色指定）。thickness (issue #495) is Native's deprecated alias for `strokeWidth`, kept for backward compatibility and tracked in contracts/deprecations.json (removeIn 2.0.0) — Native declares `strokeWidth` as of #495, so only the legacy name remains Native-only. color/trackColor (issue #480) take semantic CSS `var(--...)` strings, which React Native cannot resolve — Native reads the same roles from ThemeProvider (`theme.brand.primary` / `theme.surface.tertiary`), so a var()-string prop has no meaning there. Web keeps them as a token-level escape hatch on top of the shared `tone`. colors (issue #559) is the Native-only色注入点 matching Calendar.colors (#304) / Sheet.surfaceColor (#448): consumers own their brand palette (AGENTS.md §8 theme contract) and some semantic colors (e.g. a quiz app's `correct` green) are not DS tokens at all, so Native needs a raw-value hatch where Web uses the var()-string color/trackColor. The accessibility props (accessible/accessibilityLabel/accessibilityRole/accessibilityValue/accessibilityElementsHidden/importantForAccessibility/testID, issue #559) are Native-only because Web's ring already renders its own role="progressbar" + aria-label on the root element, while the RN root View carries no a11y semantics at all — consumers whose surrounding card owns the spoken description need to collapse or silence the ring's own text nodes, and RN expresses that through these platform props (declared explicitly rather than spread via ...rest) / 既定値差: [{"prop":"size","reason":"Web's token default \"md\" and Native's pixel default 64 represent the platforms' own size scales. the two defaults render the same visual result — Web's string size/spacing token and Native's raw pixel number are just different unit representations of one shared design value, not a functional gap"},{"prop":"lineCap","reason":"lineCap (issue #559) was added to both platforms with the same vocabulary, but each keeps its own pre-existing default so no consumer's rendering changes: Web has always drawn strokeLinecap=\"round\", Native has always drawn \"butt\". Aligning them would be a silent visual change on one platform; consumers pick explicitly when they need parity."}] | 未検証 |
| ProgressSteps | あり | あり | currentStep | current | currentStep vs current naming diverged independently for the same value | 未検証 |
| PromptCoordinatorProvider | あり | あり | 抽出不可 | 抽出不可 |  | 未検証 |
| Prose | あり | あり |  |  |  | 未検証 |
| QuantitySelector | あり | あり | value, max, onChange, disabled, size, showTrash, onDelete, groupLabel, decreaseLabel, increaseLabel, deleteLabel |  | Native QuantitySelector hasn't grown Web's max/trash-delete API yet — tracked as a real follow-up, not urgent. groupLabel/decreaseLabel/increaseLabel/deleteLabel (issue #428) label Web-only role="group" and button elements | 未検証 |
| QuickActionGrid | あり | あり |  | children, style | className/CSS (Web) vs RN style/StyleSheet (Native) is each platform's idiomatic styling prop, not a functional gap / 既定値差: [{"prop":"gap","reason":"Web's token default \"md\" maps to Tailwind's `gap-3` (12px); Native's own default is the literal 12 (px). the two defaults render the same visual result — Web's string size/spacing token and Native's raw pixel number are just different unit representations of one shared design value, not a functional gap — verified same 12px value, not just a same-category guess."}] | 未検証 |
| Radio | なし | あり | 抽出不可 | 抽出不可 |  | 未検証 |
| RadioGroup | あり | あり | 抽出不可 | 抽出不可 |  | 未検証 |
| RadioGroupItem | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| RatingDisplay | あり | あり | reviewCount, showCount, showValue | count, layout | reviewCount vs count naming diverged independently; Native adds a layout option not yet ported to Web / 既定値差: [{"prop":"size","reason":"Web's \"sm\" token resolves to a 12px star icon (see sizeMap in rating-display.tsx); Native's own default was aligned to the literal 12 (px) (2026-08-10, previously 16 — Web is the reference implementation with more consumers, so Native was changed to match). the two defaults render the same visual result — Web's string size/spacing token and Native's raw pixel number are just different unit representations of one shared design value, not a functional gap"}] | 未検証 |
| ResponsiveDialog | あり | あり | children | breakpoint | DOM event naming (onClick/onOpenChange/onSearch) vs RN naming (onPress/onClose/onChange) is each platform's idiomatic convention, not a functional gap; breakpoint は issue #472 で Web にも入った（own prop ではなく ResponsiveOverlayBreakpointOptions 経由なのでこの抽出には出ない）が型が異なる（Web = "sm"\|"md"\|"lg"\|"xl"\|"product-theme" のトークンで CSS メディアクエリに解決 / Native = number px を Dimensions と比較）。Web は加えて breakpointQuery で生のメディアクエリを受ける | 未検証 |
| ResponsiveDialogClose | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| ResponsiveDialogContent | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| ResponsiveDialogDescription | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| ResponsiveDialogFooter | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| ResponsiveDialogHeader | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| ResponsiveDialogTitle | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| ResponsiveDialogTrigger | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| ResponsiveOverlayFooter | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| ResponsiveOverlayFrame | あり | なし | 抽出不可 | 抽出不可 | viewport 幅でボトムシート↔中央モーダルを切り替える Web 専用 frame（issue #472）。matchMedia と CSS のブレークポイントに依存し、native は画面幅に関わらずボトムシート（BottomSheetFrame）で統一するため移植しない | 未検証 |
| ReviewCard | あり | あり | reviewer, avatarChar, avatarSrc, body, onHelpful, helpful, className | authorName, authorAvatar, comment | field names diverged independently (reviewer/authorName, body/comment); Web adds a helpful-vote feature not yet ported to Native / 既定値差: [{"prop":"helpfulCount","reason":"Not aligned by design: Web always renders the \"参考になった\" helpful-vote *button* (gated by the separate `onHelpful` prop, which Native doesn't have) and only uses `helpfulCount` to decide whether to print the `(N)` suffix inside that button — defaulting it to 0 is safe there because 0 just means \"no suffix\". Native has no press affordance at all; it's a static `参考になった {count}` text line whose *entire visibility* is controlled by `helpfulCount !== undefined`. Giving Native a `0` default would make every ReviewCard permanently show \"参考になった 0\", which is a real behavior regression, not parity. Keeping this optional-with-no-default on Native is the correct API for its no-button design."}] | 未検証 |
| ReviewOverlay | あり | あり | active, onPinCreate, pins, onPinClick, holdDuration, onHaptic, className, children | open, onClose, title, onSubmit | Web and Native implementations were designed independently for this component (pre-dates this check); prop vocabulary diverges by design and is tracked here as the established baseline, not a new regression (Web: long-press pin-drop annotation overlay; Native: this file implements a plain form-submit overlay, a different pattern entirely) | 未検証 |
| ReviewSummary | あり | あり | averageRating, totalCount, className | average, total | averageRating/totalCount vs average/total naming diverged independently for the same values | 未検証 |
| RhfFormField | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| Screen | あり | あり | bodyClassName, headerClassName, footerClassName, mainId, skipLink, skipLinkLabel | style, bodyStyle, headerStyle, footerStyle, contentContainerStyle | className/CSS (Web) vs RN style/StyleSheet (Native) is each platform's idiomatic styling prop, not a functional gap; mainId/skipLink are DOM landmark features with no RN equivalent | 未検証 |
| Scrim | なし | あり | 抽出不可 | 抽出不可 |  | 未検証 |
| ScrollArea | あり | あり | 抽出不可 | 抽出不可 |  | 未検証 |
| ScrollBar | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| SearchBar | あり | あり | onSearch, asForm | value, onChange, placeholder, onSubmit, onClear, autoFocus | Web SearchBar is a thin onSearch-callback wrapper around a shared Input; Native declares its own full controlled-input prop surface directly. asForm (issue #362) toggles the Web root between <div> and <form role=search> to opt into native browser form submission (Enter / submit button, autofill, password-manager integration); RN has no DOM <form> concept — onSubmitEditing + returnKeyType="search" (mirrored by Web's enterKeyHint="search", not a distinct prop) already give Native the equivalent Enter-to-search behavior without a form wrapper | 未検証 |
| SearchPanel | あり | なし | 抽出不可 | 抽出不可 | admin search panel is Web-only | 未検証 |
| Section | あり | なし | 抽出不可 | 抽出不可 | full-width CSS background band and responsive vertical rhythm primitive is Web-only; native uses View layout | 未検証 |
| SectionHeader | あり | あり |  | variant | variant/size/tone are declared via `extends VariantProps<typeof ...Variants>` on Web (inherited, so invisible to this own-props-only extractor) but declared directly in Native's own Props interface — an extraction-method artifact, not a real gap | 未検証 |
| SectionNav | あり | なし | 抽出不可 | 抽出不可 | hash-anchor navigation and aria-current=location are Web-only; native screens use SectionList or explicit scroll handlers | 未検証 |
| Select | あり | あり | 抽出不可 | 抽出不可 |  | 未検証 |
| SelectContent | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| SelectGroup | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| SelectItem | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| SelectLabel | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| SelectSeparator | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| SelectTrigger | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| SelectValue | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| SemanticIcon | あり | あり |  |  |  | 未検証 |
| Separator | あり | あり | 抽出不可 | 抽出不可 |  | 未検証 |
| SettingsListRow | あり | あり | interactive, onClick | children, onPress, style | DOM event naming (onClick/onOpenChange/onSearch) vs RN naming (onPress/onClose/onChange) is each platform's idiomatic convention, not a functional gap; Native composes via children instead of Web's interactive/onClick pair | 未検証 |
| SettingsSection | あり | あり |  | children, style, contentStyle | className/CSS (Web) vs RN style/StyleSheet (Native) is each platform's idiomatic styling prop, not a functional gap | 未検証 |
| ShareButtons | あり | あり | providers, region, layout, className, onShare, onCopy, copiedLabel, copyErrorLabel, feedbackDuration, groupLabel | message, extra | Web and Native implementations were designed independently for this component (pre-dates this check); prop vocabulary diverges by design and is tracked here as the established baseline, not a new regression (Web: multi-provider Web Share API wrapper with copy feedback; Native: simpler RN Share.share message/extra passthrough). groupLabel (issue #428) labels the Web-only role="group" wrapper | 未検証 |
| Sheet | あり | あり | activeSnapPoint, setActiveSnapPoint, fadeFromIndex, overlay, defaultOpen, onOpenChange, modal | onClose, side, title, initialSnap, footer, safeArea, surfaceColor | DOM event naming (onClick/onOpenChange/onSearch) vs RN naming (onPress/onClose/onChange) is each platform's idiomatic convention, not a functional gap; safeArea exists on BOTH platforms (Web #339 / Native #351) but Web declares it on `SheetContentProps` while this extractor only reads `SheetProps` — an extraction artifact, not a real gap; Web wraps vaul (snap-point drag sheet) while Native implements its own simpler snap sheet, so the underlying prop surfaces diverge. surfaceColor (issue #448) is the Native-only面色注入点: Web consumers restyle the sheet surface with CSS variables / a className on SheetContent, so no Web prop is needed | 未検証 |
| SheetClose | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| SheetContent | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| SheetDescription | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| SheetDragIndicator | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| SheetFooter | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| SheetHeader | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| SheetTitle | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| SheetTrigger | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| SideDrawerFrame | あり | なし | 抽出不可 | 抽出不可 | side detail drawer is a desktop/web layout; native mobile uses BottomSheetFrame snap sheet instead | 未検証 |
| SimplePagination | あり | あり |  | page, total, onChange | Web SimplePagination composes the shared Pagination component's own props (no distinct own SimplePaginationProps body to diff); Native declares its controlled props directly | 未検証 |
| Skeleton | あり | あり | rounded | radius, style | className/CSS (Web) vs RN style/StyleSheet (Native) is each platform's idiomatic styling prop, not a functional gap; rounded (Tailwind token, e.g. "2xl") vs radius (RN pixel number) diverged independently for the same corner-radius feature / 既定値差: [{"prop":"width","reason":"Web still has no destructure default for `width` (the legacy `className`-only compat mode described in the JSDoc example must keep working), but as of 2026-08-10 the component's base `className` now always includes `h-4 w-full` ahead of the caller's `className` in `cn()` — so an unstyled `<Skeleton />` renders at the same 16px/100% size as Native's `height=16`/`width=\"100%\"` defaults, and `tailwind-merge` still lets an explicit caller `className` (e.g. `h-4 w-32`) override it exactly as before. Visually resolved; not a real gap, just invisible to this destructure-only extractor because the fix lives in `className`, not a prop default."},{"prop":"height","reason":"Same resolution as `width`: the new base `h-4` class (see above) matches Native's `height=16` default. Visually resolved via `className`, invisible to this extractor."}] | 未検証 |
| SkeletonText | あり | あり | 抽出不可 | 抽出不可 |  | 未検証 |
| SkipLink | あり | なし | 抽出不可 | 抽出不可 | skip navigation targets DOM landmarks and is Web-only | 未検証 |
| Slider | あり | あり |  | value, onChange, min, max, step, disabled | Web Slider extends Radix SliderPrimitive.Root (value/onChange/min/max/step/disabled inherited via extends, invisible to this extractor); Native declares them directly | 未検証 |
| SocialIcon | あり | あり | platform, tone | brand | platform vs brand naming diverged independently for the same selector prop | 未検証 |
| SocialLoginButton | あり | あり | loading, fullWidth | label, onPress, disabled | DOM event naming (onClick/onOpenChange/onSearch) vs RN naming (onPress/onClose/onChange) is each platform's idiomatic convention, not a functional gap; Web adds a loading/fullWidth layout API not yet ported to Native | 未検証 |
| Spinner | あり | あり |  | color | Native adds a color (RN tint override) prop not present on Web; label (a11y text, default "読み込み中") is now shared on both sides (issue: native axe aria-progressbar-name fix) | 未検証 |
| Stack | なし | あり | 抽出不可 | 抽出不可 |  | 未検証 |
| StarRating | あり | あり | showLabel, allowClear, label, valueLabel, starLabel, className | readOnly | Native's readOnly is equivalent to Web's onChange-omitted display-only mode (different API shape for the same behavior); allowClear/label/valueLabel (issues #416 #417) are not ported to Native yet / 既定値差: [{"prop":"size","reason":"Web's \"md\" token is Tailwind's `size-5` = 20px (1.25rem); Native's own default is the literal 20 (px). the two defaults render the same visual result — Web's string size/spacing token and Native's raw pixel number are just different unit representations of one shared design value, not a functional gap — verified same 20px value."}] | 未検証 |
| StatCard | あり | あり | unit, icon, variant, interactive, onClick | delta | variant/size/tone are declared via `extends VariantProps<typeof ...Variants>` on Web (inherited, so invisible to this own-props-only extractor) but declared directly in Native's own Props interface — an extraction-method artifact, not a real gap; Web adds a unit/interactive-click API and Native adds a delta (trend) display, neither ported to the other side yet / 既定値差: [{"prop":"trend","reason":"Web `trend?: { value: number; label?: string }` (numeric delta object, no default) vs Native `trend?: \"up\" \| \"down\" \| \"neutral\"` (enum, defaults to \"neutral\") are entirely different prop shapes designed independently for this component — not a missed port of the same feature."}] | 未検証 |
| StatusActionBadge | あり | あり |  | style | className/CSS (Web) vs RN style/StyleSheet (Native) is each platform's idiomatic styling prop, not a functional gap | 未検証 |
| StatusTabs | あり | なし | 抽出不可 | 抽出不可 | admin status tabs are Web-only | 未検証 |
| StickyActionBar | あり | あり | bordered | children | className/CSS (Web) vs RN style/StyleSheet (Native) is each platform's idiomatic styling prop, not a functional gap; Native composes via children instead of a bordered visual toggle | 未検証 |
| SubNav | あり | あり | variant, sticky, className |  | sticky positioning and CVA variant are Web/CSS-only concepts; Native has no SubNav-specific own props left after that | 未検証 |
| SwipeRow | あり | あり | actions, side, className, actionsLabel | rightActions, actionWidth, accessibilityActions, onAccessibilityAction, accessible | actions vs rightActions naming diverged independently for the same swipe-action-list feature. accessibilityActions/onAccessibilityAction (issue #342) are RN's accessibility-actions API (VoiceOver rotor / TalkBack custom actions) with no DOM equivalent; Web's parity fix instead makes the always-rendered action `<button>`s focus-reveal via onFocus/onBlur on the actions group (native-parity.mjs can't see this since it isn't a props-interface change). actionsLabel labels that Web-only group wrapper (native has no equivalent grouping element; each action carries its own accessibilityLabel). accessible is RN's own prop, needed because iOS custom actions attach to an accessibility element — Web has no counterpart. | 未検証 |
| Switch | あり | あり | 抽出不可 | 抽出不可 |  | 未検証 |
| SyncStatusBadge | あり | あり | state, errorCount, onRetry, syncingLabel, successLabel, errorLabel, offlineLabel, retryLabel, className | status, label | state vs status naming diverged independently; Web has a richer per-state i18n label API not yet ported to Native | 未検証 |
| SyncStatusButton | あり | あり | 抽出不可 | 抽出不可 |  | 未検証 |
| Tabs | あり | あり | 抽出不可 | 抽出不可 |  | 未検証 |
| TabsContent | あり | あり | 抽出不可 | 抽出不可 |  | 未検証 |
| TabsList | あり | あり | 抽出不可 | 抽出不可 |  | 未検証 |
| TabsTrigger | あり | あり | 抽出不可 | 抽出不可 |  | 未検証 |
| Tag | あり | あり |  | tone, variant, children | Web and Native implementations were designed independently for this component (pre-dates this check); prop vocabulary diverges by design and is tracked here as the established baseline, not a new regression (Web: variant + categorical palette props; Native: tone + children). categorical/dot (issue #445) are now ported to Native with matching prop names, reading scales.categorical (generated from tokens.json colors.semantic.categorical — same hex as Web's --Categorical-* CSS variables) | 未検証 |
| TagInput | あり | あり | disabled, max, allowDuplicates, className, inputLabel | maxTags | max vs maxTags naming diverged independently for the same limit | 未検証 |
| Text | なし | あり | 抽出不可 | 抽出不可 |  | 未検証 |
| Textarea | あり | あり | autoGrow, showCount, unstyled | invalid, disabled, minHeight | invalid/disabled are inherited via extends on Web (invisible to this extractor); autoGrow/showCount are Web-only features not yet ported to Native's separate AutoGrowTextarea component; unstyled (issue #420) strips the Web Tailwind layer for gradual migration — Native has no CSS layer to strip (styles are StyleSheet/inline) | 未検証 |
| ThumbnailCard | あり | なし | 抽出不可 | 抽出不可 | カード全体クリックを stretched link（絶対配置の不可視 a/button を重ねる）で実現する Web 専用パターン。native は Pressable でカードごと押せるため、この構造自体が不要 | 未検証 |
| TimePicker | あり | あり | id, className, triggerLabel |  | className/CSS (Web) vs RN style/StyleSheet (Native) is each platform's idiomatic styling prop, not a functional gap | 未検証 |
| Toast | なし | なし | 抽出不可 | 抽出不可 | native exposes ToastProvider/useToast instead of a Toast component export | 未検証 |
| ToastProvider | なし | あり | 抽出不可 | 抽出不可 |  | 未検証 |
| Toaster | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| Tooltip | あり | なし | 抽出不可 | 抽出不可 | hover/focus tooltip is Web-only | 未検証 |
| TooltipContent | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| TooltipProvider | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |
| TooltipTrigger | あり | なし | 抽出不可 | 抽出不可 |  | 未検証 |

## 実OS検証

[検証アプリと手順](../examples/native-device-review/README.md)を使い、OS・端末・コミット・確認項目・結果・証拠パスを台帳へ残します。未確認を完了として表示しません。
