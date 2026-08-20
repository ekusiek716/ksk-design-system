#!/usr/bin/env node
/**
 * Guardrail for Web/RN component parity.
 *
 * contracts/components.json is the source of truth for reusable component names.
 * Native does not mirror every Web implementation: admin data grids, hover-only
 * surfaces, browser-only persistence, and RHF form roots are intentionally
 * Web-only. Everything else should have a native export or an explicit gap here.
 *
 * Part 2 (issue #264①): existence parity alone doesn't catch prop-level drift
 * (a Web-only prop that was never ported, or vice versa). This adds a lightweight
 * — not type-level — check that extracts the *own* prop names declared directly
 * in each component's `${Name}Props` interface/type (not props inherited via
 * `extends React.ComponentProps<...>` / `PressableProps` / `VariantProps<...>`,
 * which differ by platform on purpose) and diffs the Web set against the Native
 * set. Genuine gaps are tracked in INTENTIONAL_PROP_GAPS, following the same
 * documented-allowlist convention as INTENTIONAL_NATIVE_GAPS above.
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, "..")
const CONTRACTS = path.join(ROOT, "contracts/components.json")
const NATIVE_INDEX = path.join(ROOT, "src/native/components/index.ts")

const INTENTIONAL_NATIVE_GAPS = new Map([
  ["AdminShell", "admin shell is Web dashboard layout; native apps use AppShell or MarketingShell"],
  ["BulkActions", "admin table bulk action toolbar is Web-only"],
  ["ChartControls", "admin analytics controls are Web-only"],
  ["Container", "responsive max-width and CSS gutter primitive is Web-only; native uses View layout"],
  ["ContentCarousel", "arbitrary ReactNode slides and DOM scroll-snap are Web-only; native consumers use FlatList paging"],
  ["CookieConsent", "browser cookie consent is Web-only"],
  ["DataTable", "complex admin table editing is Web-only"],
  ["DocumentPage", "web naming of the static document page; native provides the same role as DocumentScreen (Screen+AppHeader scaffold)"],
  ["FieldSet", "fieldset/legend/group semantics are Web-only; native uses FormSection and FormField for the same visual hierarchy"],
  ["Form", "contracts name 'Form' at src/components/patterns/form.tsx is a label, not an export — Web itself only exports FormRoot/FormSection/FormActions (no `Form` symbol). Native mirrors this with FormRoot/FormSection/FormActions in src/native/components/Form.tsx; the RHF form root at src/components/ui/form.tsx (also named 'Form' in contracts) has no native equivalent by design (native uses FormField plus native inputs instead)"],
  ["HoverCard", "hover interaction is Web-only"],
  ["ImageUploader", "admin image uploader is Web-only; native uses CompactFilePicker/ImageAttachmentPicker adapters"],
  ["KebabMenu", "admin action menu is Web-only; native uses MenuDrawer/DropdownMenu patterns"],
  ["MobileTabBar", "web-only BottomTabBar wrapper; native uses LiquidBottomTabBar / createExpoRouterTabBar instead"],
  ["NotificationList", "admin notification list is Web-only"],
  ["PortalContainerProvider", "DOM Portal の描画先を差し替えるための Provider。React Native に DOM Portal は無く、RN の Modal は常にネイティブのルートへ描画されるため Web 専用"],
  ["SearchPanel", "admin search panel is Web-only"],
  ["Section", "full-width CSS background band and responsive vertical rhythm primitive is Web-only; native uses View layout"],
  ["SectionNav", "hash-anchor navigation and aria-current=location are Web-only; native screens use SectionList or explicit scroll handlers"],
  ["SkipLink", "skip navigation targets DOM landmarks and is Web-only"],
  ["SideDrawerFrame", "side detail drawer is a desktop/web layout; native mobile uses BottomSheetFrame snap sheet instead"],
  ["StatusTabs", "admin status tabs are Web-only"],
  ["Toast", "native exposes ToastProvider/useToast instead of a Toast component export"],
  ["Tooltip", "hover/focus tooltip is Web-only"],
])

const REQUIRED_NATIVE_EXPORTS = [
  "Screen",
  "PhotoHero",
  "MediaActionCluster",
  "ListSkeleton",
  "GridSkeleton",
  "SettingsSection",
  "SettingsListRow",
  "CompactFilePicker",
  "ImageAttachmentPicker",
  "ActionTile",
  "QuickActionGrid",
  "MobileAppShell",
  "MobileFloatingActionButton",
  "MobileAppHeader",
  "StatusActionBadge",
  "SyncStatusButton",
  "DetailSheetScaffold",
  "KeyboardAwareSheetFooter",
  "BottomSheetFrame",
]

/**
 * Intentional Web ⇄ Native prop-name gaps found by the check below.
 * Keyed by component name. Each entry documents props that exist on one
 * platform's `${Name}Props` only, with a one-line reason. Update this when
 * the extractor below flags a *new* diff that is a deliberate platform
 * difference (not a missed port) — genuine drift should be fixed in code
 * instead of allowlisted here.
 */
// Shared reason strings for common, recurring categories of divergence found on
// the first run (2026-07-29). Kept as constants so the per-component reasons
// below stay short while remaining greppable.
const R_STYLE =
  "className/CSS (Web) vs RN style/StyleSheet (Native) is each platform's idiomatic styling prop, not a functional gap"
const R_INTERACTION =
  "DOM event naming (onClick/onOpenChange/onSearch) vs RN naming (onPress/onClose/onChange) is each platform's idiomatic convention, not a functional gap"
const R_VARIANT_ARTIFACT =
  "variant/size/tone are declared via `extends VariantProps<typeof ...Variants>` on Web (inherited, so invisible to this own-props-only extractor) but declared directly in Native's own Props interface — an extraction-method artifact, not a real gap"
const R_INDEPENDENT =
  "Web and Native implementations were designed independently for this component (pre-dates this check); prop vocabulary diverges by design and is tracked here as the established baseline, not a new regression"

const INTENTIONAL_PROP_GAPS = new Map([
  ["Button", {
    webOnly: ["asChild", "haptic", "unstyled"],
    nativeOnly: ["variant", "elevation", "containerStyle", "pressedContainerStyle", "textStyle", "leadingIcon", "trailingIcon", "loading", "loadingLabel", "children"],
    reason: `asChild (Radix Slot) has no RN equivalent, native composition wraps components directly; haptic (navigator.vibrate) is Web-only mobile-browser API; unstyled (issue #420) strips the Web Tailwind layer for gradual migration — Native has no CSS layer to strip (styles are StyleSheet/inline). ${R_VARIANT_ARTIFACT}. Native additionally exposes RN-only styling (containerStyle/pressedContainerStyle/textStyle), icon slots, and an async loading state not yet ported to Web.`,
  }],
  ["PillToggle", {
    webOnly: ["onValueChange", "size", "className"],
    nativeOnly: ["disabled"],
    reason: `onValueChange is a deprecated backward-compat alias for onChange (issue #264⑥), intentionally Web-only. size/className are Web CSS sizing/styling. Native's disabled (whole-group disable) has no Web port yet — tracked as a real follow-up, not urgent.`,
  }],
  ["ActionTile", { webOnly: [], nativeOnly: ["disabled", "onPress", "style"], reason: R_INTERACTION + "; " + R_STYLE }],
  ["Alert", { webOnly: ["icon", "action"], nativeOnly: ["tone", "children"], reason: R_INDEPENDENT + " (Web: icon/action prop API; Native: tone + children composition API)" }],
  ["AppHeader", { webOnly: ["layout", "logo", "centerSlot", "rightSlot", "nav", "bottomSlot", "sticky", "bordered", "variant", "className"], nativeOnly: ["onBack", "centered", "safeArea"], reason: R_INDEPENDENT + " (Web: slot-composition header; Native: simpler back-button header). safeArea (issue #351) is Native-only because the Web header is a plain in-page element with no status-bar overlap — the notch avoidance lives in the Web page shell's CSS env(safe-area-inset-*), while RN headers draw under the status bar and need the inset themselves" }],
  ["AppShell", { webOnly: ["topBar", "mainId", "skipLink", "skipLinkLabel"], nativeOnly: ["header", "footer", "scrollable", "children"], reason: R_INDEPENDENT + "; mainId/skipLink are DOM landmark features with no RN equivalent" }],
  ["AutoGrowTextarea", { webOnly: ["value", "onChange", "placeholder", "minRows", "maxLength", "showCount", "className"], nativeOnly: ["invalid", "disabled", "minHeight", "maxHeight"], reason: R_STYLE + "; both sides implement auto-grow but exact prop set diverged independently (minRows vs minHeight/maxHeight)" }],
  ["Banner", { webOnly: ["icon", "action"], nativeOnly: ["image", "onPress", "tone", "height"], reason: R_INDEPENDENT + " (Web: icon/action API; Native: image banner API)" }],
  ["BannerCarousel", { webOnly: ["title", "items", "moreLabel", "onMore", "itemAspectRatio", "className", "regionLabel"], nativeOnly: ["banners", "height", "showIndicator"], reason: R_INDEPENDENT + " (items vs banners naming; Native adds fixed height/indicator). regionLabel (issue #428) labels the Web-only role=\"region\" scroll strip, which has no Native equivalent element" }],
  ["BottomSheetForm", { webOnly: ["onOpenChange", "submitLabel", "cancelLabel", "onSubmit", "loading", "className"], nativeOnly: ["onClose", "footer"], reason: R_INTERACTION + "; Native uses a footer slot instead of Web's submit/cancel label props" }],
  ["BottomSheetFrame", { webOnly: [], nativeOnly: ["header", "footer", "scrollable", "children", "style", "bodyStyle"], reason: R_STYLE + "; Native-only slot props (header/footer) have no Web counterpart in this file" }],
  ["BottomTabBar", { webOnly: ["centerAction", "showLabels", "tone", "maxWidth", "variant", "pillPosition", "floatingPosition", "scrollEdge", "navLabel"], nativeOnly: ["value", "onChange", "keyboardLiftOffset"], reason: R_INDEPENDENT + " (Web: Liquid Glass visual variants; Native: controlled value/onChange + keyboard-avoidance). navLabel (issue #428) labels the Web-only <nav> landmark; Native tab bars don't render a DOM nav element" }],
  ["Breadcrumb", { webOnly: ["label"], nativeOnly: ["title", "onBack", "backLabel", "rightSlot"], reason: R_INDEPENDENT + " (Web: DOM breadcrumb trail; Native: single-level back header)" }],
  ["Calendar", { webOnly: [], nativeOnly: ["value", "onChange", "minDate", "maxDate", "locale", "weekendTone", "todayEmphasis", "disablePast", "today", "defaultMonth", "onMonthChange", "colors", "dayStyle", "renderDay", "dayAccessibilityLabel", "previousMonthLabel", "nextMonthLabel", "style"], reason: "Web Calendar wraps react-day-picker (props flow through DayPicker's own types, invisible to this own-props extractor); Native declares its own controlled props directly. The day-presentation props (weekendTone/todayEmphasis/disablePast/renderDay/dayAccessibilityLabel, issue #298④) are react-day-picker's modifiers/formatters/components API on Web, so they are inherited there rather than declared. colors/dayStyle (issue #304) are the Native-only色注入点: Web consumers restyle day cells with CSS variables and the .rdp-* class hooks, so no Web prop is needed" }],
  ["Card", { webOnly: [], nativeOnly: ["padding", "elevation", "children", "radius"], reason: R_VARIANT_ARTIFACT + "; radius (issue #332) lets Native pick a borderRadius scale key because Native has no className escape hatch — Web achieves the same effect with a `rounded-*` utility class on the same element, so no Web prop is needed" }],
  ["CategoryNav", { webOnly: ["className"], nativeOnly: ["value", "onChange"], reason: R_STYLE + "; Native adds controlled selection not yet ported to Web" }],
  ["CategoryScroll", { webOnly: ["title", "moreHref", "thumbnailSize", "thumbnailShape", "layout", "gridRows", "className"], nativeOnly: ["value", "onChange"], reason: R_INDEPENDENT + " (Web: richer layout options; Native: controlled selection)" }],
  ["Celebration", { webOnly: ["dismissLabel"], nativeOnly: ["style", "cardStyle", "testID"], reason: R_STYLE + "; dismissLabel (issue #428) labels the Web-only invisible tap-dismiss overlay button" }],
  ["CelebrationDialog", { webOnly: ["className"], nativeOnly: ["testID"], reason: R_STYLE }],
  ["Checkbox", { webOnly: ["label", "description", "count", "containerClassName"], nativeOnly: ["checked", "onChange", "disabled", "size", "decorative"], reason: "Web Checkbox extends Radix CheckboxPrimitive.Root (checked/onChange/disabled are inherited via extends, invisible to this extractor) and adds a polymorphic label/description/count API (v1.16.0); Native declares the base props directly and hasn't grown the polymorphic API yet. decorative is Native-only: react-native-web doesn't honor accessibilityElementsHidden/importantForAccessibility, so a nested decorative Checkbox (e.g. inside CheckboxField) needs an explicit opt-out of its own role/state/tabIndex to avoid a second role=checkbox and aria-hidden-focus violations; Web's Radix CheckboxPrimitive has no equivalent nesting case" }],
  ["CheckboxField", { webOnly: ["error", "className"], nativeOnly: ["checked", "onChange", "disabled", "accessibilityLabel", "accessibilityHint"], reason: "Web CheckboxField spreads Radix Checkbox props (inherited, invisible to this extractor); Native declares them directly and adds RN accessibility props" }],
  ["CheckboxGroup", { webOnly: ["label", "required", "helpText", "error", "columns", "children", "className"], nativeOnly: ["options", "values", "onChange", "disabled"], reason: R_INDEPENDENT + " (Web: FormField-style group with children; Native: options/values controlled list)" }],
  ["Chip", { webOnly: ["href", "soldOut"], nativeOnly: ["disabled", "variant", "size", "shape"], reason: R_VARIANT_ARTIFACT + "; href (renders as <a>) has no RN navigation equivalent baked in; soldOut is a Web-only commerce visual state not yet ported" }],
  ["ChipFilterBar", { webOnly: ["sticky", "stickyOffset", "bare", "className"], nativeOnly: [], reason: "sticky positioning is a Web/CSS-only concept; Native scroll containers handle this differently at the screen level" }],
  ["ChipSelector", { webOnly: ["value", "max", "size", "className"], nativeOnly: ["values"], reason: "single (value) vs multi (values) selection API diverged independently between platforms" }],
  ["CoachMark", { webOnly: ["content", "children", "placement", "variant", "open", "onOpenChange", "totalSteps", "showClose", "onClose", "delayDuration", "className"], nativeOnly: ["title", "description", "total", "onSkip", "nextLabel", "skipLabel"], reason: R_INDEPENDENT + " (Web: Radix Popover-anchored tooltip with content slot; Native: title+description fields with its own overlay)" }],
  ["CoachMarkOverlay", { webOnly: ["steps", "onComplete", "onSkip", "variant", "ringColor", "maxWidth"], nativeOnly: ["onClose", "highlight", "children"], reason: R_INDEPENDENT + " (Web: querySelector-driven DOM spotlight tour; Native has its own targeting model)" }],
  ["Combobox", { webOnly: ["emptyLabel", "className", "triggerLabel"], nativeOnly: ["emptyMessage"], reason: "emptyLabel/emptyMessage naming diverged independently for the same feature" }],
  ["CompactFilePicker", { webOnly: ["onFilesChange", "inputClassName"], nativeOnly: ["disabled", "onPress", "style"], reason: R_INTERACTION + "; Web uses a hidden <input type=file>, Native opens the OS picker via Pressable" }],
  ["ConfirmDialog", { webOnly: ["open", "onOpenChange", "title", "description", "loadingLabel", "variant", "onConfirm", "loading"], nativeOnly: [], reason: "Native ConfirmDialog composes AlertDialog directly rather than re-declaring its own prop surface (extraction sees no distinct own ConfirmDialogProps body on Native side worth diffing)" }],
  ["CountdownHero", { webOnly: ["dateLabel", "todayValue", "className"], nativeOnly: ["style", "testID"], reason: R_STYLE }],
  ["CountdownTimer", { webOnly: ["targetDate", "granularity", "label", "endedLabel", "todayLabel", "variant", "compact", "className", "onEnd", "dayUnit", "hourUnit", "minuteUnit", "secondUnit"], nativeOnly: ["target", "onComplete", "tone"], reason: R_INDEPENDENT + " (Web has richer i18n unit-label props; Native uses a simpler target/onComplete/tone API)" }],
  ["DateField", { webOnly: ["className", "dateFormat"], nativeOnly: ["formatter"], reason: "dateFormat (format string) vs formatter (function) diverged independently for the same feature" }],
  ["DatePicker", { webOnly: ["id", "className", "dateFormat", "triggerLabel", "defaultMonth", "min", "max"], nativeOnly: ["minDate", "maxDate", "formatter"], reason: "min/max vs minDate/maxDate naming and dateFormat-string vs formatter-function diverged independently" }],
  ["DateTimePicker", { webOnly: ["min", "max", "datePlaceholder", "timePlaceholder", "dateTriggerLabel", "timeTriggerLabel"], nativeOnly: ["minDate", "maxDate", "style"], reason: R_STYLE + "; min/max vs minDate/maxDate naming diverged independently" }],
  ["DetailSheetScaffold", { webOnly: [], nativeOnly: ["children", "style"], reason: R_STYLE }],
  ["DropdownFilter", { webOnly: ["onSelect", "hideAll", "allLabel", "getDisplayLabel", "valueOnly", "pristineValue", "className", "closeLabel"], nativeOnly: ["onChange"], reason: "onSelect vs onChange naming; Web has a richer all/pristine-value API not yet ported to Native; closeLabel (issue #417) labels the Web-only close overlay button, no Native equivalent element" }],
  ["EmptyState", { webOnly: ["actionLabel", "actionIcon", "actionLayout", "actionButtonProps", "onAction", "size", "iconClassName"], nativeOnly: [], reason: "Native EmptyState composes children/action as ReactNode slots rather than a labeled-action prop API (no distinct own props left to diff)" }],
  ["ErrorBoundary", { webOnly: ["onReset", "className"], nativeOnly: ["onRetry"], reason: "onReset vs onRetry naming diverged independently for the same callback" }],
  ["ErrorState", { webOnly: ["kind", "onRetry", "retryLabel"], nativeOnly: [], reason: "Native ErrorState doesn't yet have the kind=notFound variant added to Web (issue #264③ ErrorState guidance) — tracked as a real follow-up, not urgent" }],
  ["FileUpload", { webOnly: ["accept", "maxSize", "multiple", "maxFiles", "onUpload", "className", "dragLabel", "orLabel", "browseLabel", "maxSizeLabel", "maxFilesLabel", "removeLabel"], nativeOnly: ["title", "description", "onPress"], reason: R_INDEPENDENT + " (Web: drag-and-drop multi-file DOM uploader; Native: opens OS picker via Pressable, single-file)" }],
  ["FilterBar", { webOnly: ["resultCount", "sortOptions", "selectedSort", "onSortSelect", "onSortClick", "onMoreFilters", "activeFilterCount", "navLabel", "moreFiltersLabel"], nativeOnly: ["onPressSort"], reason: "Web has a richer sort/result-count toolbar API not yet ported to Native's simpler onPressSort. navLabel/moreFiltersLabel (issue #428) label the Web-only <nav> landmark and its 絞り込み icon button, no Native equivalent elements" }],
  ["FilterChip", { webOnly: ["label", "value", "isActive", "onClick", "className"], nativeOnly: ["count"], reason: R_INTERACTION + "; Native adds a count badge not yet ported to Web" }],
  ["Footer", { webOnly: ["logo", "linkGroups", "paymentIcons", "socialLinks", "extra", "className"], nativeOnly: ["links"], reason: R_INDEPENDENT + " (Web: full marketing footer with an extra content slot; Native: simplified single links array)" }],
  ["FormField", { webOnly: ["htmlFor", "requiredStyle", "endLabel"], nativeOnly: ["children"], reason: "htmlFor is a DOM label-association attribute with no RN equivalent; Native renders its input via children instead" }],
  ["GridSkeleton", { webOnly: ["loadingLabel", "className"], nativeOnly: [], reason: R_STYLE }],
  ["IconBadge", { webOnly: [], nativeOnly: ["size", "children", "style"], reason: R_STYLE }],
  ["ImageAttachmentPicker", { webOnly: ["accept"], nativeOnly: [], reason: "accept (MIME filter) is a DOM <input> attribute with no RN equivalent; Native relies on the OS picker's own image-only mode" }],
  ["ImageCarousel", { webOnly: ["aspectRatio", "showArrows", "autoPlay", "regionLabel", "previousLabel", "nextLabel"], nativeOnly: ["height", "showCounter"], reason: R_INDEPENDENT + " (Web: arrow/autoplay controls; Native: fixed-height with a counter overlay). regionLabel/previousLabel/nextLabel (issue #428) label the Web-only role=\"region\" scroll strip and its arrow buttons, no Native equivalent elements" }],
  ["ImageGallery", { webOnly: ["indicatorType", "aspectRatio", "onImageClick", "className", "prevLabel", "nextLabel", "imageLabel"], nativeOnly: ["initialIndex", "thumbnailSize"], reason: R_INDEPENDENT + " (Web: richer indicator/label i18n API; Native: initialIndex + thumbnail sizing)" }],
  ["Input", { webOnly: ["startAdornment", "endAdornment", "showCount", "unstyled"], nativeOnly: ["invalid", "disabled", "leading", "trailing"], reason: "startAdornment/endAdornment (Web) vs leading/trailing (Native) naming diverged independently for the same adornment-slot feature; invalid/disabled are inherited via extends on Web (invisible to this extractor); unstyled (issue #420) strips the Web Tailwind layer for gradual migration — Native has no CSS layer to strip (styles are StyleSheet/inline)" }],
  ["KeyboardAwareSheetFooter", { webOnly: [], nativeOnly: ["children", "style"], reason: R_STYLE }],
  ["ListItem", { webOnly: [], nativeOnly: ["leading", "title", "description", "trailing", "footerSlot", "showChevron", "onPress", "disabled", "align", "density"], reason: "Web ListItem's props live in a discriminated union (ListItemLinkProps | ListItemButtonProps | ListItemStaticProps) built from a separate ListItemCommonProps interface, so this `${Name}Props`-interface-body extractor sees no own props on the Web side and reports every Native prop as Native-only. footerSlot/align/density (issue #355) exist on BOTH platforms with the same vocabulary and semantics — an extraction artifact, not a real gap. leading/trailing are Native's naming for Web's leftSlot/rightSlot (independent naming drift predating this check); showChevron/onPress/disabled are likewise declared directly on Native and inside the union on Web" }],
  ["ListSkeleton", { webOnly: ["loadingLabel", "className"], nativeOnly: [], reason: R_STYLE }],
  ["MarketingShell", { webOnly: ["mainId", "skipLink", "skipLinkLabel"], nativeOnly: ["cta", "children"], reason: "mainId/skipLink are DOM landmark features with no RN equivalent; Native adds a cta slot not yet ported to Web" }],
  ["MediaActionCluster", { webOnly: [], nativeOnly: ["accessibilityLabel", "style"], reason: R_STYLE + "; accessibilityLabel is RN's aria-label equivalent" }],
  ["MenuDrawer", { webOnly: ["banner", "footerLinks", "width", "className"], nativeOnly: ["side", "header", "footer"], reason: R_INDEPENDENT + " (Web: banner/footerLinks marketing drawer; Native: generic header/footer/side slots)" }],
  ["MobileAppHeader", { webOnly: ["sticky", "landmark"], nativeOnly: ["children", "style"], reason: R_STYLE + "; landmark is the DOM banner-role toggle added for MobileAppShell nesting (issue #271), no RN landmark equivalent" }],
  ["MobileAppShell", { webOnly: ["mainClassName", "contentClassName", "bottomNavMode", "maxWidth", "centeredPreview"], nativeOnly: ["scrollable", "children", "style", "contentStyle"], reason: R_STYLE + "; Web has a richer desktop-sidebar-handoff API (bottomNavMode/maxWidth) with no RN equivalent" }],
  ["MobileFloatingActionButton", { webOnly: ["mobileOnly", "fullWidth"], nativeOnly: ["style"], reason: R_STYLE + "; mobileOnly (CSS breakpoint visibility) is a Web-only responsive concept; fullWidth relies on CSS env(safe-area-inset-*) insets and has no Native port yet" }],
  ["MultiSelect", { webOnly: ["value", "emptyLabel", "className", "maxDisplay", "clearable", "clearLabel"], nativeOnly: ["values"], reason: "value vs values naming diverged independently; Web has a richer display-truncation/clearable API not yet ported to Native. clearLabel (issue #428) labels the Web-only clear button" }],
  ["NavigationBar", { webOnly: ["title", "leftIcon", "onLeft", "leftLabel", "rightSlot", "onShare", "shareLabel", "glass", "transparent", "className"], nativeOnly: ["items", "value", "onChange"], reason: R_INDEPENDENT + " (Web: single-screen back/share header; Native: this file implements a segmented nav bar, a different pattern entirely)" }],
  ["NotificationBadge", { webOnly: ["size"], nativeOnly: ["dot", "children"], reason: "Native adds a dot-only mode and children composition not yet ported to Web" }],
  ["NumberInput", { webOnly: ["format", "placeholder", "size", "className", "decrementLabel", "incrementLabel"], nativeOnly: [], reason: "Native NumberInput hasn't grown Web's i18n label/format API yet — tracked as a real follow-up, not urgent" }],
  ["OrderSummary", { webOnly: ["lineItems", "totalLabel", "totalValue", "ctaLabel", "onCTAClick", "ctaDisabled", "fixed"], nativeOnly: ["lines", "currency"], reason: "lineItems vs lines naming diverged independently; Web adds a sticky CTA footer not yet ported to Native" }],
  ["Pagination", { webOnly: ["navLabel"], nativeOnly: ["page", "total", "onChange", "windowSize"], reason: "Web wraps the DOM nav/ul/li composition (navLabel, issue #428, is the nav's aria-label); Native declares its own controlled page/total/onChange/windowSize props directly, a different composition model entirely" }],
  ["PhotoHero", { webOnly: ["imageClassName", "contentClassName", "loading"], nativeOnly: ["style", "imageStyle", "contentStyle"], reason: R_STYLE + "; loading (native img loading attr) is DOM-only" }],
  ["PresenceIndicator", { webOnly: ["className"], nativeOnly: [], reason: R_STYLE }],
  ["PriceDisplay", { webOnly: ["maxPrice", "showTaxLabel"], nativeOnly: ["size", "showTax"], reason: R_VARIANT_ARTIFACT + "; Web adds a price-range (maxPrice) mode not yet ported to Native" }],
  ["ProductCard", { webOnly: ["name", "imageUrl", "imageAlt", "shopName", "tags", "isFavorite", "onFavoriteToggle", "href", "onCardClick", "ranking", "deliveryLabel", "orientation", "showCartButton", "onCartAdd", "cartButtonLabel"], nativeOnly: ["image", "title", "badge", "soldOut", "onPress", "layout"], reason: R_INDEPENDENT + " (Web: full commerce card with favorite/cart/ranking; Native: a simpler card, field names renamed independently e.g. name/title, imageUrl/image)" }],
  ["ProductCarousel", { webOnly: ["subtitle", "moreHref", "moreLabel", "onMoreClick", "cardSize", "showRanking", "showCartButton"], nativeOnly: ["action", "cardWidth"], reason: R_INDEPENDENT + " (Web: richer header/ranking/cart-toggle API; Native: generic action slot + fixed cardWidth)" }],
  ["Progress", { webOnly: ["transitionDuration", "className", "id"], nativeOnly: ["max", "height", "tone"], reason: R_STYLE + "; max/tone are inherited via extends on Web (invisible to this extractor) and declared directly on Native" }],
  ["ProgressRing", { webOnly: ["label", "className"], nativeOnly: ["max", "thickness"], reason: R_STYLE + "; max is inherited via extends on Web" }],
  ["ProgressSteps", { webOnly: ["currentStep"], nativeOnly: ["current"], reason: "currentStep vs current naming diverged independently for the same value" }],
  ["QuantitySelector", { webOnly: ["value", "max", "onChange", "disabled", "size", "showTrash", "onDelete", "groupLabel", "decreaseLabel", "increaseLabel", "deleteLabel"], nativeOnly: [], reason: "Native QuantitySelector hasn't grown Web's max/trash-delete API yet — tracked as a real follow-up, not urgent. groupLabel/decreaseLabel/increaseLabel/deleteLabel (issue #428) label Web-only role=\"group\" and button elements" }],
  ["QuickActionGrid", { webOnly: [], nativeOnly: ["children", "style"], reason: R_STYLE }],
  ["RatingDisplay", { webOnly: ["reviewCount", "showCount", "showValue"], nativeOnly: ["count", "layout"], reason: "reviewCount vs count naming diverged independently; Native adds a layout option not yet ported to Web" }],
  ["ResponsiveDialog", { webOnly: ["open", "onOpenChange", "children"], nativeOnly: ["breakpoint"], reason: R_INTERACTION + "; Native exposes an explicit breakpoint override Web doesn't need (uses CSS media queries internally)" }],
  ["ReviewCard", { webOnly: ["reviewer", "avatarChar", "avatarSrc", "body", "onHelpful", "helpful", "className"], nativeOnly: ["authorName", "authorAvatar", "comment"], reason: "field names diverged independently (reviewer/authorName, body/comment); Web adds a helpful-vote feature not yet ported to Native" }],
  ["ReviewOverlay", { webOnly: ["active", "onPinCreate", "pins", "onPinClick", "holdDuration", "onHaptic", "className", "children"], nativeOnly: ["open", "onClose", "title", "onSubmit"], reason: R_INDEPENDENT + " (Web: long-press pin-drop annotation overlay; Native: this file implements a plain form-submit overlay, a different pattern entirely)" }],
  ["ReviewSummary", { webOnly: ["averageRating", "totalCount", "className"], nativeOnly: ["average", "total"], reason: "averageRating/totalCount vs average/total naming diverged independently for the same values" }],
  ["Screen", { webOnly: ["bodyClassName", "headerClassName", "footerClassName", "mainId", "skipLink", "skipLinkLabel"], nativeOnly: ["style", "bodyStyle", "headerStyle", "footerStyle", "contentContainerStyle"], reason: R_STYLE + "; mainId/skipLink are DOM landmark features with no RN equivalent" }],
  ["SearchBar", { webOnly: ["onSearch", "asForm"], nativeOnly: ["value", "onChange", "placeholder", "onSubmit", "onClear", "autoFocus"], reason: "Web SearchBar is a thin onSearch-callback wrapper around a shared Input; Native declares its own full controlled-input prop surface directly. asForm (issue #362) toggles the Web root between <div> and <form role=search> to opt into native browser form submission (Enter / submit button, autofill, password-manager integration); RN has no DOM <form> concept — onSubmitEditing + returnKeyType=\"search\" (mirrored by Web's enterKeyHint=\"search\", not a distinct prop) already give Native the equivalent Enter-to-search behavior without a form wrapper" }],
  ["SectionHeader", { webOnly: [], nativeOnly: ["variant"], reason: R_VARIANT_ARTIFACT }],
  ["SettingsListRow", { webOnly: ["interactive", "onClick"], nativeOnly: ["children", "onPress", "style"], reason: R_INTERACTION + "; Native composes via children instead of Web's interactive/onClick pair" }],
  ["SettingsSection", { webOnly: [], nativeOnly: ["children", "style", "contentStyle"], reason: R_STYLE }],
  ["ShareButtons", { webOnly: ["providers", "region", "layout", "className", "onShare", "onCopy", "copiedLabel", "copyErrorLabel", "feedbackDuration", "groupLabel"], nativeOnly: ["message", "extra"], reason: R_INDEPENDENT + " (Web: multi-provider Web Share API wrapper with copy feedback; Native: simpler RN Share.share message/extra passthrough). groupLabel (issue #428) labels the Web-only role=\"group\" wrapper" }],
  ["Sheet", { webOnly: ["activeSnapPoint", "setActiveSnapPoint", "fadeFromIndex", "overlay", "defaultOpen", "onOpenChange", "modal"], nativeOnly: ["onClose", "side", "title", "initialSnap", "footer", "safeArea"], reason: R_INTERACTION + "; safeArea exists on BOTH platforms (Web #339 / Native #351) but Web declares it on `SheetContentProps` while this extractor only reads `SheetProps` — an extraction artifact, not a real gap; Web wraps vaul (snap-point drag sheet) while Native implements its own simpler snap sheet, so the underlying prop surfaces diverge" }],
  ["SimplePagination", { webOnly: [], nativeOnly: ["page", "total", "onChange"], reason: "Web SimplePagination composes the shared Pagination component's own props (no distinct own SimplePaginationProps body to diff); Native declares its controlled props directly" }],
  ["Skeleton", { webOnly: ["rounded"], nativeOnly: ["radius", "style"], reason: R_STYLE + "; rounded (Tailwind token, e.g. \"2xl\") vs radius (RN pixel number) diverged independently for the same corner-radius feature" }],
  ["Slider", { webOnly: [], nativeOnly: ["value", "onChange", "min", "max", "step", "disabled"], reason: "Web Slider extends Radix SliderPrimitive.Root (value/onChange/min/max/step/disabled inherited via extends, invisible to this extractor); Native declares them directly" }],
  ["SocialIcon", { webOnly: ["platform", "tone"], nativeOnly: ["brand"], reason: "platform vs brand naming diverged independently for the same selector prop" }],
  ["SocialLoginButton", { webOnly: ["loading", "fullWidth"], nativeOnly: ["label", "onPress", "disabled"], reason: R_INTERACTION + "; Web adds a loading/fullWidth layout API not yet ported to Native" }],
  ["Spinner", { webOnly: [], nativeOnly: ["color"], reason: "Native adds a color (RN tint override) prop not present on Web; label (a11y text, default \"読み込み中\") is now shared on both sides (issue: native axe aria-progressbar-name fix)" }],
  ["StarRating", { webOnly: ["showLabel", "className", "allowClear", "label", "valueLabel", "starLabel"], nativeOnly: ["readOnly"], reason: "Native's readOnly is equivalent to Web's onChange-omitted display-only mode (different API shape for the same behavior); allowClear/label/valueLabel (issues #416 #417) are not ported to Native yet" }],
  ["StatCard", { webOnly: ["unit", "icon", "variant", "interactive", "onClick"], nativeOnly: ["delta"], reason: R_VARIANT_ARTIFACT + "; Web adds a unit/interactive-click API and Native adds a delta (trend) display, neither ported to the other side yet" }],
  ["StatusActionBadge", { webOnly: [], nativeOnly: ["style"], reason: R_STYLE }],
  ["StickyActionBar", { webOnly: ["bordered"], nativeOnly: ["children"], reason: R_STYLE + "; Native composes via children instead of a bordered visual toggle" }],
  ["SubNav", { webOnly: ["variant", "sticky", "className"], nativeOnly: [], reason: "sticky positioning and CVA variant are Web/CSS-only concepts; Native has no SubNav-specific own props left after that" }],
  ["SwipeRow", { webOnly: ["actions", "side", "className", "actionsLabel"], nativeOnly: ["rightActions", "actionWidth", "accessibilityActions", "onAccessibilityAction", "accessible"], reason: `actions vs rightActions naming diverged independently for the same swipe-action-list feature. accessibilityActions/onAccessibilityAction (issue #342) are RN's accessibility-actions API (VoiceOver rotor / TalkBack custom actions) with no DOM equivalent; Web's parity fix instead makes the always-rendered action \`<button>\`s focus-reveal via onFocus/onBlur on the actions group (native-parity.mjs can't see this since it isn't a props-interface change). actionsLabel labels that Web-only group wrapper (native has no equivalent grouping element; each action carries its own accessibilityLabel). accessible is RN's own prop, needed because iOS custom actions attach to an accessibility element — Web has no counterpart.` }],
  ["SyncStatusBadge", { webOnly: ["state", "errorCount", "onRetry", "syncingLabel", "successLabel", "errorLabel", "offlineLabel", "retryLabel", "className"], nativeOnly: ["status", "label"], reason: "state vs status naming diverged independently; Web has a richer per-state i18n label API not yet ported to Native" }],
  ["Tag", { webOnly: ["categorical", "dot"], nativeOnly: ["tone", "variant", "children"], reason: R_INDEPENDENT + " (Web: variant + categorical palette props; Native: tone + children). categorical/dot map to --Categorical-* CSS variables and are not ported to Native yet" }],
  ["TagInput", { webOnly: ["disabled", "max", "allowDuplicates", "className", "inputLabel"], nativeOnly: ["maxTags"], reason: "max vs maxTags naming diverged independently for the same limit" }],
  ["Textarea", { webOnly: ["autoGrow", "showCount", "unstyled"], nativeOnly: ["invalid", "disabled", "minHeight"], reason: "invalid/disabled are inherited via extends on Web (invisible to this extractor); autoGrow/showCount are Web-only features not yet ported to Native's separate AutoGrowTextarea component; unstyled (issue #420) strips the Web Tailwind layer for gradual migration — Native has no CSS layer to strip (styles are StyleSheet/inline)" }],
  ["TimePicker", { webOnly: ["id", "className", "triggerLabel"], nativeOnly: [], reason: R_STYLE }],
])

/**
 * Intentional Web ⇄ Native *default value* gaps (issue #316 follow-up).
 * Prop-name parity above only catches missing props; it doesn't catch a prop
 * that exists on both sides but was given a different default (e.g. one
 * platform fixed a bug by flipping a default and the other wasn't touched).
 * Same allowlist convention as INTENTIONAL_PROP_GAPS: keyed by component,
 * each entry documents one prop's platform-diverging default with a reason.
 * Update this when the extractor below flags a *new* diff that is a
 * deliberate platform difference — genuine drift should be fixed in code
 * instead of allowlisted here.
 */
// Shared reason strings for recurring categories found on the first run (2026-08-10).
const RD_EQUIVALENT_UNIT =
  "the two defaults render the same visual result — Web's string size/spacing token and Native's raw pixel number are just different unit representations of one shared design value, not a functional gap"
const RD_BLIND_SPOT =
  "Web computes this default with an inline `??` fallback inside the function body (not in the destructured parameter), which this destructure-only extractor can't see; the *effective* default is documented here for the record, not a real behavioral gap"
const RD_TEXT_DRIFT =
  "same-purpose placeholder/label text diverged independently in wording between platforms — cosmetic copy drift, tracked as a real but non-urgent follow-up (harmonize wording), not a functional bug"
const RD_API_SHAPE =
  "required-vs-optional (or shape) differs by design between the two platforms' own Props type, so only one side needs a fallback default — a deliberate API surface difference, not a missed port"

const INTENTIONAL_DEFAULT_GAPS = new Map([
  ["BannerCarousel", [
    { prop: "itemWidth", reason: "Web defaults to a fixed 200px card width; Native intentionally has no destructure default and instead computes a responsive width (`Dimensions.get(\"window\").width - 32`) inside the function body so cards fit the device screen — a deliberate platform difference, not a missed port" },
  ]],
  ["Chip", [
    { prop: "selected", reason: `Web leaves \`selected\` without a destructure default (omitted ⇒ \`undefined\`, falsy in the \`selected ? … : …\` checks — same runtime behavior as Native's explicit \`false\`). ${RD_API_SHAPE}` },
    { prop: "removable", reason: `Same as \`selected\`: Web's omitted/undefined behaves identically to Native's explicit \`false\` default. ${RD_API_SHAPE}` },
  ]],
  ["ErrorState", [
    { prop: "title", reason: `Web has no destructure default but falls back to the *same* text ("エラーが発生しました") via \`title ?? (notFound ? … : "エラーが発生しました")\` inside the function body. ${RD_BLIND_SPOT} — verified identical effective text, not just a shape artifact.` },
    { prop: "description", reason: `Web has no destructure default but falls back (non-notFound case) to \`description ?? "しばらくしてからもう一度お試しください"\` inside the function body; Native's destructure default was aligned to the identical text (2026-08-10, previously "時間をおいて再度お試しください。"). ${RD_BLIND_SPOT} — verified identical effective text after alignment.` },
  ]],
  ["FilterBar", [
    { prop: "sortLabel", reason: `Web has no destructure default but falls back to "並べ替え" via \`sortLabel ?? "並べ替え"\` at each render site (it also gates whether the result-count/sort row renders at all, so it deliberately can't become a Web destructure default without changing that visibility check); Native's destructure default was aligned to the identical "並べ替え" text (2026-08-10, previously "並び替え"). ${RD_BLIND_SPOT} — verified identical effective text after alignment.` },
  ]],
  ["NotificationBadge", [
    { prop: "count", reason: `Web declares \`count: number\` as required (no default — callers must always pass a value); Native declares \`count?: number\` optional with a \`0\` fallback for looser call sites. ${RD_API_SHAPE}` },
  ]],
  ["Progress", [
    { prop: "variant", reason: `Web's destructure default is the literal "default"; Native has no destructure default, but \`resolveProgressVariant\` falls back to \`toneToVariant(tone)\` where \`tone\` defaults to "accent" → also resolves to "default" (see src/native/progress-logic.ts). ${RD_BLIND_SPOT} — verified the two effective defaults are the same value.` },
  ]],
  ["ProgressRing", [
    { prop: "size", reason: `Web's token default "md" and Native's pixel default 64 represent the platforms' own size scales. ${RD_EQUIVALENT_UNIT}` },
  ]],
  ["QuickActionGrid", [
    { prop: "gap", reason: `Web's token default "md" maps to Tailwind's \`gap-3\` (12px); Native's own default is the literal 12 (px). ${RD_EQUIVALENT_UNIT} — verified same 12px value, not just a same-category guess.` },
  ]],
  ["RatingDisplay", [
    { prop: "size", reason: `Web's "sm" token resolves to a 12px star icon (see sizeMap in rating-display.tsx); Native's own default was aligned to the literal 12 (px) (2026-08-10, previously 16 — Web is the reference implementation with more consumers, so Native was changed to match). ${RD_EQUIVALENT_UNIT}` },
  ]],
  ["ReviewCard", [
    { prop: "helpfulCount", reason: "Not aligned by design: Web always renders the \"参考になった\" helpful-vote *button* (gated by the separate `onHelpful` prop, which Native doesn't have) and only uses `helpfulCount` to decide whether to print the `(N)` suffix inside that button — defaulting it to 0 is safe there because 0 just means \"no suffix\". Native has no press affordance at all; it's a static `参考になった {count}` text line whose *entire visibility* is controlled by `helpfulCount !== undefined`. Giving Native a `0` default would make every ReviewCard permanently show \"参考になった 0\", which is a real behavior regression, not parity. Keeping this optional-with-no-default on Native is the correct API for its no-button design." },
  ]],
  ["Skeleton", [
    { prop: "width", reason: "Web still has no destructure default for `width` (the legacy `className`-only compat mode described in the JSDoc example must keep working), but as of 2026-08-10 the component's base `className` now always includes `h-4 w-full` ahead of the caller's `className` in `cn()` — so an unstyled `<Skeleton />` renders at the same 16px/100% size as Native's `height=16`/`width=\"100%\"` defaults, and `tailwind-merge` still lets an explicit caller `className` (e.g. `h-4 w-32`) override it exactly as before. Visually resolved; not a real gap, just invisible to this destructure-only extractor because the fix lives in `className`, not a prop default." },
    { prop: "height", reason: "Same resolution as `width`: the new base `h-4` class (see above) matches Native's `height=16` default. Visually resolved via `className`, invisible to this extractor." },
  ]],
  ["StarRating", [
    { prop: "size", reason: `Web's "md" token is Tailwind's \`size-5\` = 20px (1.25rem); Native's own default is the literal 20 (px). ${RD_EQUIVALENT_UNIT} — verified same 20px value.` },
  ]],
  ["StatCard", [
    { prop: "trend", reason: 'Web `trend?: { value: number; label?: string }` (numeric delta object, no default) vs Native `trend?: "up" | "down" | "neutral"` (enum, defaults to "neutral") are entirely different prop shapes designed independently for this component — not a missed port of the same feature.' },
  ]],
])

function componentEntriesFromContracts() {
  const json = JSON.parse(fs.readFileSync(CONTRACTS, "utf8"))
  const categories = ["ui", "patterns", "commerce", "admin", "shells"]
  const names = []
  const pathByName = new Map()

  for (const category of categories) {
    for (const item of json[category] ?? []) {
      if (!item?.name) continue
      for (const name of item.name.split("/")) {
        const trimmed = name.trim()
        if (!/^[A-Z]/.test(trimmed)) continue
        names.push(trimmed)
        if (item.path && !pathByName.has(trimmed)) pathByName.set(trimmed, item.path)
      }
    }
  }

  return { names: [...new Set(names)].sort(), pathByName }
}

function nativeValueExports() {
  const source = fs.readFileSync(NATIVE_INDEX, "utf8")
  const names = []
  const fileByName = new Map()

  for (const match of source.matchAll(/export\s*\{([\s\S]*?)\}\s*from\s*["']([^"']+)["']/g)) {
    const file = match[2].replace(/^\.\//, "")
    for (const raw of match[1].split(",")) {
      const part = raw.trim()
      if (!part || part.startsWith("type ")) continue
      const name = part.split(/\s+as\s+/).pop().trim()
      if (/^[A-Z]/.test(name)) {
        names.push(name)
        fileByName.set(name, file)
      }
    }
  }

  return { names: new Set(names), fileByName }
}

/**
 * Extracts the prop names declared *directly* in `${typeName}` (an
 * `interface X { ... }` or `type X = { ... }`), ignoring anything pulled in
 * via `extends`/intersection with other types. Nested object-literal prop
 * types are not descended into (only the top-level keys are collected).
 * Returns null if the type declaration isn't found (regex-based; not a full
 * TypeScript parse — acceptable for a lightweight drift signal per issue #264①).
 */
function extractOwnProps(filePath, typeName) {
  if (!fs.existsSync(filePath)) return null
  const source = fs.readFileSync(filePath, "utf8")

  const re = new RegExp(`\\b(?:interface|type)\\s+${typeName}\\b[^{;]*?\\{`)
  const m = re.exec(source)
  if (!m) return null

  const bodyStart = m.index + m[0].length
  let depth = 1
  let i = bodyStart
  for (; i < source.length && depth > 0; i++) {
    if (source[i] === "{") depth++
    else if (source[i] === "}") depth--
  }
  const rawBody = source.slice(bodyStart, i - 1)

  // Strip comments so embedded braces/colons in JSDoc examples don't confuse
  // the depth tracker or prop matcher below.
  const body = rawBody
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*$/gm, "")

  const props = []
  let nestDepth = 0
  for (const line of body.split("\n")) {
    const trimmed = line.trim()
    if (nestDepth === 0 && trimmed) {
      const pm = /^(readonly\s+)?\[?["']?([A-Za-z_$][\w$]*)["']?\]?\??\s*:/.exec(trimmed)
      if (pm) props.push(pm[2])
    }
    for (const ch of line) {
      if (ch === "{" || ch === "(" || ch === "[") nestDepth++
      else if (ch === "}" || ch === ")" || ch === "]") nestDepth--
    }
  }

  return [...new Set(props)]
}

/**
 * Extracts default values assigned via destructuring in `${componentName}`'s
 * own function signature, e.g. `function X({ compact = false, size = 20 }: XProps)`.
 * Only the top-level destructured parameter of a `function Name({ ... })`
 * declaration is read (the codebase's consistent component style — no
 * `forwardRef`/arrow-function components with defaults were found as of
 * 2026-08). Returns null if that signature shape isn't found for this
 * component (e.g. it takes `props` un-destructured), meaning "can't compare"
 * — same convention as `extractOwnProps` returning null.
 *
 * Returns a Map<propName, { kind: "none" | "literal" | "incomparable", value?, raw? }>:
 *   - "none": no default written (`= undefined` counts as "none" too)
 *   - "literal": a string/number/boolean/null default we can safely diff
 *   - "incomparable": a default expression more complex than a literal
 *     (function call, object/array literal, identifier reference, template
 *     with interpolation, etc.) — intentionally not compared (see module doc).
 */
function extractDefaultsFromDestructure(filePath, componentName) {
  if (!fs.existsSync(filePath)) return null
  const source = fs.readFileSync(filePath, "utf8")

  const re = new RegExp(`\\bfunction\\s+${componentName}\\s*\\(\\s*\\{`)
  const m = re.exec(source)
  if (!m) return null

  const bodyStart = m.index + m[0].length
  let depth = 1
  let i = bodyStart
  for (; i < source.length && depth > 0; i++) {
    if (source[i] === "{") depth++
    else if (source[i] === "}") depth--
  }
  const rawBody = source.slice(bodyStart, i - 1)
  const body = rawBody.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "")

  // Split into top-level destructured entries, respecting nesting so commas
  // inside default-value expressions (arrays, objects, calls) don't split.
  const segments = []
  let nestDepth = 0
  let current = ""
  for (const ch of body) {
    if (ch === "{" || ch === "(" || ch === "[") nestDepth++
    else if (ch === "}" || ch === ")" || ch === "]") nestDepth--
    if (ch === "," && nestDepth === 0) {
      segments.push(current)
      current = ""
    } else {
      current += ch
    }
  }
  if (current.trim()) segments.push(current)

  const defaults = new Map()
  for (const rawSegment of segments) {
    const segment = rawSegment.trim()
    if (!segment || segment.startsWith("...")) continue
    // Nested destructuring patterns (e.g. `{ a, b } = {}`) don't expose a
    // single prop name at this level — skip, can't attribute a default.
    if (segment.startsWith("{") || segment.startsWith("[")) continue

    const pm = /^([A-Za-z_$][\w$]*)\s*(?::\s*[A-Za-z_$][\w$]*)?\s*(?:=\s*([\s\S]+))?$/.exec(segment)
    if (!pm) continue
    const propName = pm[1]
    const rawDefault = pm[2]

    if (rawDefault === undefined) {
      defaults.set(propName, { kind: "none" })
      continue
    }
    defaults.set(propName, classifyDefaultExpr(rawDefault.trim()))
  }

  return defaults
}

function classifyDefaultExpr(expr) {
  if (expr === "true") return { kind: "literal", value: true }
  if (expr === "false") return { kind: "literal", value: false }
  if (expr === "null") return { kind: "literal", value: null }
  if (expr === "undefined") return { kind: "none" }
  if (/^-?\d+(\.\d+)?$/.test(expr)) return { kind: "literal", value: Number(expr) }

  const dq = /^"((?:[^"\\]|\\.)*)"$/.exec(expr)
  if (dq) return { kind: "literal", value: dq[1] }
  const sq = /^'((?:[^'\\]|\\.)*)'$/.exec(expr)
  if (sq) return { kind: "literal", value: sq[1] }
  // Template literal without `${...}` interpolation is effectively a string literal.
  const bt = /^`((?:[^`\\$]|\\.)*)`$/.exec(expr)
  if (bt) return { kind: "literal", value: bt[1] }

  return { kind: "incomparable", raw: expr }
}

const NONE_KEY = " none"
function defaultKey(entry) {
  return entry.kind === "none" ? NONE_KEY : JSON.stringify(entry.value)
}

/**
 * Diffs default values for props that are declared on *both* platforms'
 * own `${Name}Props` (uses the same own-prop extraction as diffProps).
 * Props with no default on either side are not a diff (per spec: two
 * "undefined-equivalent" props aren't a mismatch). A default on one side
 * and none on the other IS reported — that's a real behavioral divergence.
 * Props where either side's default isn't a comparable literal are skipped
 * and surfaced separately as "incomparable" so the skip is visible, not silent.
 */
function diffDefaults(name, webPath, nativePath) {
  const nativeFile = nativePath.endsWith(".ts") || nativePath.endsWith(".tsx") ? nativePath : `${nativePath}.tsx`
  const webFile = path.join(ROOT, webPath)
  const nativeFullPath = path.join(ROOT, "src/native/components", nativeFile)

  const webProps = extractOwnProps(webFile, `${name}Props`)
  const nativeProps = extractOwnProps(nativeFullPath, `${name}Props`)
  if (webProps === null || nativeProps === null) return undefined

  const webDefaults = extractDefaultsFromDestructure(webFile, name)
  const nativeDefaults = extractDefaultsFromDestructure(nativeFullPath, name)
  if (webDefaults === null || nativeDefaults === null) return undefined // non-destructured signature — can't compare

  const nativePropSet = new Set(nativeProps)
  const sharedProps = webProps.filter((p) => nativePropSet.has(p))

  const gapEntries = INTENTIONAL_DEFAULT_GAPS.get(name) ?? []
  const allowedProps = new Map(gapEntries.map((g) => [g.prop, g]))

  const rawMismatches = []
  const incomparable = []

  for (const prop of sharedProps) {
    const wd = webDefaults.get(prop) ?? { kind: "none" }
    const nd = nativeDefaults.get(prop) ?? { kind: "none" }

    if (wd.kind === "none" && nd.kind === "none") continue
    if (wd.kind === "incomparable" || nd.kind === "incomparable") {
      incomparable.push({ prop, web: wd.kind === "incomparable" ? wd.raw : undefined, native: nd.kind === "incomparable" ? nd.raw : undefined })
      continue
    }
    if (defaultKey(wd) !== defaultKey(nd)) {
      rawMismatches.push({
        prop,
        web: wd.kind === "none" ? undefined : wd.value,
        native: nd.kind === "none" ? undefined : nd.value,
      })
    }
  }

  const rawMismatchProps = new Set(rawMismatches.map((r) => r.prop))
  const stale = gapEntries.filter((g) => !rawMismatchProps.has(g.prop)).map((g) => g.prop)
  const mismatches = rawMismatches.filter((r) => !allowedProps.has(r.prop))
  // Allowlisted entries marked `followUp: true` are exempt from failing the
  // build, but — unlike a genuinely-equivalent gap (unit conversion, dead-code
  // artifact) — they represent a real, undecided divergence. Surface them as
  // advisories every run so "green" doesn't quietly read as "web/native match".
  const followUps = rawMismatches
    .filter((r) => allowedProps.get(r.prop)?.followUp)
    .map((r) => ({ ...r, note: allowedProps.get(r.prop).note }))

  return { mismatches, incomparable, stale, followUps }
}

function diffProps(name, webPath, nativePath) {
  const nativeFile = nativePath.endsWith(".ts") || nativePath.endsWith(".tsx") ? nativePath : `${nativePath}.tsx`
  const webProps = extractOwnProps(path.join(ROOT, webPath), `${name}Props`)
  const nativeProps = extractOwnProps(path.join(ROOT, "src/native/components", nativeFile), `${name}Props`)
  if (webProps === null || nativeProps === null) return undefined // can't extract from one side — skip (not a full TS parse)

  const gap = INTENTIONAL_PROP_GAPS.get(name)
  const allowedWebOnly = new Set(gap?.webOnly ?? [])
  const allowedNativeOnly = new Set(gap?.nativeOnly ?? [])

  const webSet = new Set(webProps)
  const nativeSet = new Set(nativeProps)
  // Raw diffs, before subtracting the allowlist — used both to report real
  // mismatches and to detect stale allowlist entries (props that no longer
  // actually differ, e.g. because Native caught up and ported them).
  const rawWebOnly = webProps.filter((p) => !nativeSet.has(p))
  const rawNativeOnly = nativeProps.filter((p) => !webSet.has(p))

  const staleWebOnly = [...allowedWebOnly].filter((p) => !rawWebOnly.includes(p))
  const staleNativeOnly = [...allowedNativeOnly].filter((p) => !rawNativeOnly.includes(p))

  const webOnly = rawWebOnly.filter((p) => !allowedWebOnly.has(p))
  const nativeOnly = rawNativeOnly.filter((p) => !allowedNativeOnly.has(p))

  const stale = staleWebOnly.length > 0 || staleNativeOnly.length > 0 ? { staleWebOnly, staleNativeOnly } : null

  if (webOnly.length === 0 && nativeOnly.length === 0) return stale ? { webOnly: [], nativeOnly: [], stale } : null
  return { webOnly, nativeOnly, stale }
}

// ─── Part 1: existence parity (unchanged) ───

const { names: contractNames, pathByName: webPathByName } = componentEntriesFromContracts()
const { names: nativeExportNames, fileByName: nativeFileByName } = nativeValueExports()
const missing = contractNames.filter((name) => !nativeExportNames.has(name) && !INTENTIONAL_NATIVE_GAPS.has(name))
const requiredMissing = REQUIRED_NATIVE_EXPORTS.filter((name) => !nativeExportNames.has(name))

if (missing.length > 0 || requiredMissing.length > 0) {
  if (missing.length > 0) {
    console.error("[native-parity] Missing native exports for contract components:")
    for (const name of missing) console.error(`  - ${name}`)
  }

  if (requiredMissing.length > 0) {
    console.error("[native-parity] Missing required native guardrail exports:")
    for (const name of requiredMissing) console.error(`  - ${name}`)
  }

  console.error("\nAdd a native implementation/export, or document an intentional gap in scripts/check-native-parity.mjs.")
  process.exit(1)
}

const staleAllowlist = [...INTENTIONAL_NATIVE_GAPS.keys()].filter((name) => !contractNames.includes(name))
if (staleAllowlist.length > 0) {
  console.warn(`[native-parity] stale intentional gaps: ${staleAllowlist.join(", ")}`)
}

// ─── Part 2: prop-name parity (issue #264①) ───

const propMismatches = []
const stalePropGapEntries = []
let propsChecked = 0

for (const name of contractNames) {
  if (INTENTIONAL_NATIVE_GAPS.has(name)) continue // no native counterpart at all
  const webPath = webPathByName.get(name)
  const nativeFile = nativeFileByName.get(name)
  if (!webPath || !nativeFile) continue

  const diff = diffProps(name, webPath, nativeFile)
  if (diff === undefined) continue
  propsChecked += 1
  if (diff?.stale) stalePropGapEntries.push({ name, ...diff.stale })
  if (diff && (diff.webOnly.length > 0 || diff.nativeOnly.length > 0)) {
    propMismatches.push({ name, webOnly: diff.webOnly, nativeOnly: diff.nativeOnly })
  }
}

// Components whose contract entry disappeared entirely (name-level staleness,
// same convention as INTENTIONAL_NATIVE_GAPS below).
const staleProGaps = [...INTENTIONAL_PROP_GAPS.keys()].filter((name) => !contractNames.includes(name))
if (staleProGaps.length > 0) {
  console.warn(`[native-parity] stale prop-gap allowlist entries (component no longer in contracts): ${staleProGaps.join(", ")}`)
}

// Prop-level staleness: an allowlisted prop name that no longer actually
// differs between Web and Native (e.g. Native caught up and ported it, or the
// prop was removed from the side it was claimed to be exclusive to). Kept as
// a warning — not a hard failure — to match the existing INTENTIONAL_NATIVE_GAPS
// staleness check's convention above.
if (stalePropGapEntries.length > 0) {
  console.warn("[native-parity] stale INTENTIONAL_PROP_GAPS entries (no longer a real diff — safe to remove):")
  for (const { name, staleWebOnly, staleNativeOnly } of stalePropGapEntries) {
    if (staleWebOnly.length > 0) console.warn(`  - ${name}: webOnly no longer differs: ${staleWebOnly.join(", ")}`)
    if (staleNativeOnly.length > 0) console.warn(`  - ${name}: nativeOnly no longer differs: ${staleNativeOnly.join(", ")}`)
  }
}

if (propMismatches.length > 0) {
  console.error("[native-parity] Prop-name drift between Web and Native (own props on each side's `${Name}Props`):")
  for (const { name, webOnly, nativeOnly } of propMismatches) {
    if (webOnly.length > 0) console.error(`  - ${name}: Web-only props not on Native: ${webOnly.join(", ")}`)
    if (nativeOnly.length > 0) console.error(`  - ${name}: Native-only props not on Web: ${nativeOnly.join(", ")}`)
  }
  console.error(
    "\nPort the missing prop to the other platform, or document an intentional gap in INTENTIONAL_PROP_GAPS (scripts/check-native-parity.mjs).",
  )
  process.exit(1)
}

// ─── Part 3: default-value parity (issue #316 follow-up) ───

const defaultMismatches = []
const staleDefaultGapEntries = []
const incomparableDefaults = []
const followUpDefaults = []
let defaultsChecked = 0

for (const name of contractNames) {
  if (INTENTIONAL_NATIVE_GAPS.has(name)) continue // no native counterpart at all
  const webPath = webPathByName.get(name)
  const nativeFile = nativeFileByName.get(name)
  if (!webPath || !nativeFile) continue

  const diff = diffDefaults(name, webPath, nativeFile)
  if (diff === undefined) continue
  defaultsChecked += 1
  if (diff.stale.length > 0) staleDefaultGapEntries.push({ name, stale: diff.stale })
  if (diff.incomparable.length > 0) incomparableDefaults.push({ name, incomparable: diff.incomparable })
  if (diff.mismatches.length > 0) defaultMismatches.push({ name, mismatches: diff.mismatches })
  if (diff.followUps.length > 0) followUpDefaults.push({ name, followUps: diff.followUps })
}

const staleDefaultGaps = [...INTENTIONAL_DEFAULT_GAPS.keys()].filter((name) => !contractNames.includes(name))
if (staleDefaultGaps.length > 0) {
  console.warn(`[native-parity] stale default-gap allowlist entries (component no longer in contracts): ${staleDefaultGaps.join(", ")}`)
}

if (staleDefaultGapEntries.length > 0) {
  console.warn("[native-parity] stale INTENTIONAL_DEFAULT_GAPS entries (no longer a real diff — safe to remove):")
  for (const { name, stale } of staleDefaultGapEntries) {
    console.warn(`  - ${name}: ${stale.join(", ")}`)
  }
}

if (incomparableDefaults.length > 0) {
  console.warn("[native-parity] default values skipped as incomparable (not a literal — function calls, objects, identifiers, etc.):")
  for (const { name, incomparable } of incomparableDefaults) {
    for (const { prop, web, native } of incomparable) {
      console.warn(`  - ${name}.${prop}: web=${web ?? "(none)"} native=${native ?? "(none)"}`)
    }
  }
}

if (defaultMismatches.length > 0) {
  console.error("[native-parity] Default-value drift between Web and Native (same prop, different default):")
  for (const { name, mismatches } of defaultMismatches) {
    for (const { prop, web, native } of mismatches) {
      console.error(`  - ${name}.${prop}: web default=${JSON.stringify(web)} native default=${JSON.stringify(native)}`)
    }
  }
  console.error(
    "\nAlign the default on both platforms, or document an intentional gap in INTENTIONAL_DEFAULT_GAPS (scripts/check-native-parity.mjs).",
  )
  process.exit(1)
}

// Follow-up defaults: allowlisted (so they don't fail the build — the
// mismatch itself is genuine and undecided, not a false positive) but a
// real, still-unresolved Web⇄Native divergence. `followUp: true` entries in
// INTENTIONAL_DEFAULT_GAPS land here instead of being silently absorbed into
// the "N intentional default gaps" count, so a green run doesn't read as
// "web/native defaults match" when they don't. Same ADVISORY convention as
// scripts/check-flex-shrink.mjs's KFX002 — printed every run, doesn't fail CI.
const followUpCount = followUpDefaults.reduce((sum, f) => sum + f.followUps.length, 0)
if (followUpCount > 0) {
  for (const { name, followUps } of followUpDefaults) {
    for (const { prop, web, native, note } of followUps) {
      console.error(
        `[ADVISORY] ${name}.${prop} DEFAULT-FOLLOWUP web=${JSON.stringify(web)} native=${JSON.stringify(native)} — ${note}`,
      )
    }
  }
}

console.log(
  `[native-parity] OK: ${contractNames.length} contract names checked, ${INTENTIONAL_NATIVE_GAPS.size} intentional native gaps, ${propsChecked} components prop-diffed (${INTENTIONAL_PROP_GAPS.size} intentional prop gaps), ${defaultsChecked} components default-diffed (${INTENTIONAL_DEFAULT_GAPS.size} intentional default gaps / default follow-up ${followUpCount}件 — advisory は助言モード / CI は通過)`,
)
