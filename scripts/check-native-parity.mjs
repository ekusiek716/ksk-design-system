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
    webOnly: ["asChild", "haptic"],
    nativeOnly: ["variant", "elevation", "containerStyle", "pressedContainerStyle", "textStyle", "leadingIcon", "trailingIcon", "loading", "loadingLabel", "children"],
    reason: `asChild (Radix Slot) has no RN equivalent, native composition wraps components directly; haptic (navigator.vibrate) is Web-only mobile-browser API. ${R_VARIANT_ARTIFACT}. Native additionally exposes RN-only styling (containerStyle/pressedContainerStyle/textStyle), icon slots, and an async loading state not yet ported to Web.`,
  }],
  ["PillToggle", {
    webOnly: ["onValueChange", "size", "className"],
    nativeOnly: ["disabled"],
    reason: `onValueChange is a deprecated backward-compat alias for onChange (issue #264⑥), intentionally Web-only. size/className are Web CSS sizing/styling. Native's disabled (whole-group disable) has no Web port yet — tracked as a real follow-up, not urgent.`,
  }],
  ["ActionTile", { webOnly: [], nativeOnly: ["disabled", "onPress", "style"], reason: R_INTERACTION + "; " + R_STYLE }],
  ["Alert", { webOnly: ["icon", "action"], nativeOnly: ["tone", "children"], reason: R_INDEPENDENT + " (Web: icon/action prop API; Native: tone + children composition API)" }],
  ["AppHeader", { webOnly: ["layout", "logo", "centerSlot", "rightSlot", "nav", "bottomSlot", "sticky", "bordered", "variant", "className"], nativeOnly: ["onBack", "centered"], reason: R_INDEPENDENT + " (Web: slot-composition header; Native: simpler back-button header)" }],
  ["AppShell", { webOnly: ["topBar", "mainId", "skipLink", "skipLinkLabel"], nativeOnly: ["header", "footer", "scrollable", "children"], reason: R_INDEPENDENT + "; mainId/skipLink are DOM landmark features with no RN equivalent" }],
  ["AutoGrowTextarea", { webOnly: ["value", "onChange", "placeholder", "minRows", "maxLength", "showCount", "className"], nativeOnly: ["invalid", "disabled", "minHeight", "maxHeight"], reason: R_STYLE + "; both sides implement auto-grow but exact prop set diverged independently (minRows vs minHeight/maxHeight)" }],
  ["Banner", { webOnly: ["icon", "action"], nativeOnly: ["image", "onPress", "tone", "height"], reason: R_INDEPENDENT + " (Web: icon/action API; Native: image banner API)" }],
  ["BannerCarousel", { webOnly: ["title", "items", "moreLabel", "onMore", "itemAspectRatio", "className"], nativeOnly: ["banners", "height", "showIndicator"], reason: R_INDEPENDENT + " (items vs banners naming; Native adds fixed height/indicator)" }],
  ["BottomSheetForm", { webOnly: ["onOpenChange", "submitLabel", "cancelLabel", "onSubmit", "loading", "className"], nativeOnly: ["onClose", "footer"], reason: R_INTERACTION + "; Native uses a footer slot instead of Web's submit/cancel label props" }],
  ["BottomSheetFrame", { webOnly: [], nativeOnly: ["header", "footer", "scrollable", "children", "style", "bodyStyle"], reason: R_STYLE + "; Native-only slot props (header/footer) have no Web counterpart in this file" }],
  ["BottomTabBar", { webOnly: ["centerAction", "showLabels", "tone", "maxWidth", "variant", "pillPosition", "floatingPosition", "scrollEdge"], nativeOnly: ["value", "onChange", "keyboardLiftOffset"], reason: R_INDEPENDENT + " (Web: Liquid Glass visual variants; Native: controlled value/onChange + keyboard-avoidance)" }],
  ["Breadcrumb", { webOnly: ["label"], nativeOnly: ["title", "onBack", "backLabel", "rightSlot"], reason: R_INDEPENDENT + " (Web: DOM breadcrumb trail; Native: single-level back header)" }],
  ["Calendar", { webOnly: [], nativeOnly: ["value", "onChange", "minDate", "maxDate", "locale"], reason: "Web Calendar wraps react-day-picker (props flow through DayPicker's own types, invisible to this own-props extractor); Native declares its own controlled props directly" }],
  ["Card", { webOnly: [], nativeOnly: ["padding", "elevation", "children"], reason: R_VARIANT_ARTIFACT }],
  ["CategoryNav", { webOnly: ["className"], nativeOnly: ["value", "onChange"], reason: R_STYLE + "; Native adds controlled selection not yet ported to Web" }],
  ["CategoryScroll", { webOnly: ["title", "moreHref", "thumbnailSize", "thumbnailShape", "layout", "gridRows", "className"], nativeOnly: ["value", "onChange"], reason: R_INDEPENDENT + " (Web: richer layout options; Native: controlled selection)" }],
  ["Celebration", { webOnly: [], nativeOnly: ["style", "cardStyle", "testID"], reason: R_STYLE }],
  ["CelebrationDialog", { webOnly: ["className"], nativeOnly: ["testID"], reason: R_STYLE }],
  ["Checkbox", { webOnly: ["label", "description", "count", "containerClassName"], nativeOnly: ["checked", "onChange", "disabled", "size"], reason: "Web Checkbox extends Radix CheckboxPrimitive.Root (checked/onChange/disabled are inherited via extends, invisible to this extractor) and adds a polymorphic label/description/count API (v1.16.0); Native declares the base props directly and hasn't grown the polymorphic API yet" }],
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
  ["DropdownFilter", { webOnly: ["onSelect", "hideAll", "allLabel", "getDisplayLabel", "valueOnly", "pristineValue", "className"], nativeOnly: ["onChange"], reason: "onSelect vs onChange naming; Web has a richer all/pristine-value API not yet ported to Native" }],
  ["EmptyState", { webOnly: ["actionLabel", "actionIcon", "actionLayout", "actionButtonProps", "onAction", "size", "iconClassName"], nativeOnly: [], reason: "Native EmptyState composes children/action as ReactNode slots rather than a labeled-action prop API (no distinct own props left to diff)" }],
  ["ErrorBoundary", { webOnly: ["onReset", "className"], nativeOnly: ["onRetry"], reason: "onReset vs onRetry naming diverged independently for the same callback" }],
  ["ErrorState", { webOnly: ["kind", "onRetry", "retryLabel"], nativeOnly: [], reason: "Native ErrorState doesn't yet have the kind=notFound variant added to Web (issue #264③ ErrorState guidance) — tracked as a real follow-up, not urgent" }],
  ["FileUpload", { webOnly: ["accept", "maxSize", "multiple", "maxFiles", "onUpload", "className", "dragLabel", "orLabel", "browseLabel", "maxSizeLabel", "maxFilesLabel", "removeLabel"], nativeOnly: ["title", "description", "onPress"], reason: R_INDEPENDENT + " (Web: drag-and-drop multi-file DOM uploader; Native: opens OS picker via Pressable, single-file)" }],
  ["FilterBar", { webOnly: ["resultCount", "sortOptions", "selectedSort", "onSortSelect", "onSortClick", "onMoreFilters", "activeFilterCount"], nativeOnly: ["onPressSort"], reason: "Web has a richer sort/result-count toolbar API not yet ported to Native's simpler onPressSort" }],
  ["FilterChip", { webOnly: ["label", "value", "isActive", "onClick", "className"], nativeOnly: ["count"], reason: R_INTERACTION + "; Native adds a count badge not yet ported to Web" }],
  ["Footer", { webOnly: ["logo", "linkGroups", "paymentIcons", "socialLinks", "className"], nativeOnly: ["links"], reason: R_INDEPENDENT + " (Web: full marketing footer; Native: simplified single links array)" }],
  ["FormField", { webOnly: ["htmlFor", "requiredStyle", "endLabel"], nativeOnly: ["children"], reason: "htmlFor is a DOM label-association attribute with no RN equivalent; Native renders its input via children instead" }],
  ["GridSkeleton", { webOnly: ["loadingLabel", "className"], nativeOnly: [], reason: R_STYLE }],
  ["IconBadge", { webOnly: [], nativeOnly: ["size", "children", "style"], reason: R_STYLE }],
  ["ImageAttachmentPicker", { webOnly: ["accept"], nativeOnly: [], reason: "accept (MIME filter) is a DOM <input> attribute with no RN equivalent; Native relies on the OS picker's own image-only mode" }],
  ["ImageCarousel", { webOnly: ["aspectRatio", "showArrows", "autoPlay"], nativeOnly: ["height", "showCounter"], reason: R_INDEPENDENT + " (Web: arrow/autoplay controls; Native: fixed-height with a counter overlay)" }],
  ["ImageGallery", { webOnly: ["indicatorType", "aspectRatio", "onImageClick", "className", "prevLabel", "nextLabel", "imageLabel"], nativeOnly: ["initialIndex", "thumbnailSize"], reason: R_INDEPENDENT + " (Web: richer indicator/label i18n API; Native: initialIndex + thumbnail sizing)" }],
  ["Input", { webOnly: ["startAdornment", "endAdornment", "showCount"], nativeOnly: ["invalid", "disabled", "leading", "trailing"], reason: "startAdornment/endAdornment (Web) vs leading/trailing (Native) naming diverged independently for the same adornment-slot feature; invalid/disabled are inherited via extends on Web (invisible to this extractor)" }],
  ["KeyboardAwareSheetFooter", { webOnly: [], nativeOnly: ["children", "style"], reason: R_STYLE }],
  ["ListItem", { webOnly: [], nativeOnly: ["leading", "title", "description", "trailing", "showChevron", "onPress", "disabled"], reason: "Web ListItem is contracts-only documentation of a DataTable/list row convention with no single reusable component body to diff against; Native has a standalone component" }],
  ["ListSkeleton", { webOnly: ["loadingLabel", "className"], nativeOnly: [], reason: R_STYLE }],
  ["MarketingShell", { webOnly: ["mainId", "skipLink", "skipLinkLabel"], nativeOnly: ["cta", "children"], reason: "mainId/skipLink are DOM landmark features with no RN equivalent; Native adds a cta slot not yet ported to Web" }],
  ["MediaActionCluster", { webOnly: [], nativeOnly: ["accessibilityLabel", "style"], reason: R_STYLE + "; accessibilityLabel is RN's aria-label equivalent" }],
  ["MenuDrawer", { webOnly: ["banner", "footerLinks", "width", "className"], nativeOnly: ["side", "header", "footer"], reason: R_INDEPENDENT + " (Web: banner/footerLinks marketing drawer; Native: generic header/footer/side slots)" }],
  ["MobileAppHeader", { webOnly: ["sticky", "landmark"], nativeOnly: ["children", "style"], reason: R_STYLE + "; landmark is the DOM banner-role toggle added for MobileAppShell nesting (issue #271), no RN landmark equivalent" }],
  ["MobileAppShell", { webOnly: ["mainClassName", "contentClassName", "bottomNavMode", "maxWidth", "centeredPreview"], nativeOnly: ["scrollable", "children", "style", "contentStyle"], reason: R_STYLE + "; Web has a richer desktop-sidebar-handoff API (bottomNavMode/maxWidth) with no RN equivalent" }],
  ["MobileFloatingActionButton", { webOnly: ["mobileOnly"], nativeOnly: ["style"], reason: R_STYLE + "; mobileOnly (CSS breakpoint visibility) is a Web-only responsive concept" }],
  ["MultiSelect", { webOnly: ["value", "emptyLabel", "className", "maxDisplay", "clearable"], nativeOnly: ["values"], reason: "value vs values naming diverged independently; Web has a richer display-truncation/clearable API not yet ported to Native" }],
  ["NavigationBar", { webOnly: ["title", "leftIcon", "onLeft", "leftLabel", "rightSlot", "onShare", "shareLabel", "glass", "transparent", "className"], nativeOnly: ["items", "value", "onChange"], reason: R_INDEPENDENT + " (Web: single-screen back/share header; Native: this file implements a segmented nav bar, a different pattern entirely)" }],
  ["NotificationBadge", { webOnly: ["size"], nativeOnly: ["dot", "children"], reason: "Native adds a dot-only mode and children composition not yet ported to Web" }],
  ["NumberInput", { webOnly: ["format", "placeholder", "size", "className", "decrementLabel", "incrementLabel"], nativeOnly: [], reason: "Native NumberInput hasn't grown Web's i18n label/format API yet — tracked as a real follow-up, not urgent" }],
  ["OrderSummary", { webOnly: ["lineItems", "totalLabel", "totalValue", "ctaLabel", "onCTAClick", "ctaDisabled", "fixed"], nativeOnly: ["lines", "currency"], reason: "lineItems vs lines naming diverged independently; Web adds a sticky CTA footer not yet ported to Native" }],
  ["PhotoHero", { webOnly: ["imageClassName", "contentClassName", "loading"], nativeOnly: ["style", "imageStyle", "contentStyle"], reason: R_STYLE + "; loading (native img loading attr) is DOM-only" }],
  ["PresenceIndicator", { webOnly: ["className"], nativeOnly: [], reason: R_STYLE }],
  ["PriceDisplay", { webOnly: ["maxPrice", "showTaxLabel"], nativeOnly: ["size", "showTax"], reason: R_VARIANT_ARTIFACT + "; Web adds a price-range (maxPrice) mode not yet ported to Native" }],
  ["ProductCard", { webOnly: ["name", "imageUrl", "imageAlt", "shopName", "tags", "isFavorite", "onFavoriteToggle", "href", "onCardClick", "ranking", "deliveryLabel", "orientation", "showCartButton", "onCartAdd", "cartButtonLabel"], nativeOnly: ["image", "title", "badge", "soldOut", "onPress", "layout"], reason: R_INDEPENDENT + " (Web: full commerce card with favorite/cart/ranking; Native: a simpler card, field names renamed independently e.g. name/title, imageUrl/image)" }],
  ["ProductCarousel", { webOnly: ["subtitle", "moreHref", "moreLabel", "onMoreClick", "cardSize", "showRanking", "showCartButton"], nativeOnly: ["action", "cardWidth"], reason: R_INDEPENDENT + " (Web: richer header/ranking/cart-toggle API; Native: generic action slot + fixed cardWidth)" }],
  ["Progress", { webOnly: ["transitionDuration", "className", "id"], nativeOnly: ["max", "height", "tone"], reason: R_STYLE + "; max/tone are inherited via extends on Web (invisible to this extractor) and declared directly on Native" }],
  ["ProgressRing", { webOnly: ["label", "className"], nativeOnly: ["max", "thickness"], reason: R_STYLE + "; max is inherited via extends on Web" }],
  ["ProgressSteps", { webOnly: ["currentStep"], nativeOnly: ["current"], reason: "currentStep vs current naming diverged independently for the same value" }],
  ["QuantitySelector", { webOnly: ["value", "max", "onChange", "disabled", "size", "showTrash", "onDelete"], nativeOnly: [], reason: "Native QuantitySelector hasn't grown Web's max/trash-delete API yet — tracked as a real follow-up, not urgent" }],
  ["QuickActionGrid", { webOnly: [], nativeOnly: ["children", "style"], reason: R_STYLE }],
  ["RatingDisplay", { webOnly: ["reviewCount", "showCount", "showValue"], nativeOnly: ["count", "layout"], reason: "reviewCount vs count naming diverged independently; Native adds a layout option not yet ported to Web" }],
  ["ResponsiveDialog", { webOnly: ["open", "onOpenChange", "children"], nativeOnly: ["breakpoint"], reason: R_INTERACTION + "; Native exposes an explicit breakpoint override Web doesn't need (uses CSS media queries internally)" }],
  ["ReviewCard", { webOnly: ["reviewer", "avatarChar", "avatarSrc", "body", "onHelpful", "helpful", "className"], nativeOnly: ["authorName", "authorAvatar", "comment"], reason: "field names diverged independently (reviewer/authorName, body/comment); Web adds a helpful-vote feature not yet ported to Native" }],
  ["ReviewOverlay", { webOnly: ["active", "onPinCreate", "pins", "onPinClick", "holdDuration", "onHaptic", "className", "children"], nativeOnly: ["open", "onClose", "title", "onSubmit"], reason: R_INDEPENDENT + " (Web: long-press pin-drop annotation overlay; Native: this file implements a plain form-submit overlay, a different pattern entirely)" }],
  ["ReviewSummary", { webOnly: ["averageRating", "totalCount", "className"], nativeOnly: ["average", "total"], reason: "averageRating/totalCount vs average/total naming diverged independently for the same values" }],
  ["Screen", { webOnly: ["bodyClassName", "headerClassName", "footerClassName", "mainId", "skipLink", "skipLinkLabel"], nativeOnly: ["style", "bodyStyle", "headerStyle", "footerStyle", "contentContainerStyle"], reason: R_STYLE + "; mainId/skipLink are DOM landmark features with no RN equivalent" }],
  ["SearchBar", { webOnly: ["onSearch"], nativeOnly: ["value", "onChange", "placeholder", "onSubmit", "onClear", "autoFocus"], reason: "Web SearchBar is a thin onSearch-callback wrapper around a shared Input; Native declares its own full controlled-input prop surface directly" }],
  ["SectionHeader", { webOnly: [], nativeOnly: ["variant"], reason: R_VARIANT_ARTIFACT }],
  ["SettingsListRow", { webOnly: ["interactive", "onClick"], nativeOnly: ["children", "onPress", "style"], reason: R_INTERACTION + "; Native composes via children instead of Web's interactive/onClick pair" }],
  ["SettingsSection", { webOnly: [], nativeOnly: ["children", "style", "contentStyle"], reason: R_STYLE }],
  ["ShareButtons", { webOnly: ["providers", "region", "layout", "className", "onShare", "onCopy", "copiedLabel", "copyErrorLabel", "feedbackDuration"], nativeOnly: ["message", "extra"], reason: R_INDEPENDENT + " (Web: multi-provider Web Share API wrapper with copy feedback; Native: simpler RN Share.share message/extra passthrough)" }],
  ["Sheet", { webOnly: ["activeSnapPoint", "setActiveSnapPoint", "fadeFromIndex", "overlay", "defaultOpen", "onOpenChange", "modal"], nativeOnly: ["onClose", "side", "title", "initialSnap", "footer"], reason: R_INTERACTION + "; Web wraps vaul (snap-point drag sheet) while Native implements its own simpler snap sheet, so the underlying prop surfaces diverge" }],
  ["SimplePagination", { webOnly: [], nativeOnly: ["page", "total", "onChange"], reason: "Web SimplePagination composes the shared Pagination component's own props (no distinct own SimplePaginationProps body to diff); Native declares its controlled props directly" }],
  ["Skeleton", { webOnly: ["rounded"], nativeOnly: ["radius", "style"], reason: R_STYLE + "; rounded (Tailwind token, e.g. \"2xl\") vs radius (RN pixel number) diverged independently for the same corner-radius feature" }],
  ["Slider", { webOnly: [], nativeOnly: ["value", "onChange", "min", "max", "step", "disabled"], reason: "Web Slider extends Radix SliderPrimitive.Root (value/onChange/min/max/step/disabled inherited via extends, invisible to this extractor); Native declares them directly" }],
  ["SocialIcon", { webOnly: ["platform", "tone"], nativeOnly: ["brand"], reason: "platform vs brand naming diverged independently for the same selector prop" }],
  ["SocialLoginButton", { webOnly: ["loading", "fullWidth"], nativeOnly: ["label", "onPress", "disabled"], reason: R_INTERACTION + "; Web adds a loading/fullWidth layout API not yet ported to Native" }],
  ["Spinner", { webOnly: ["label"], nativeOnly: ["color"], reason: "label (aria-label text) vs color (RN tint override) address different concerns that both diverged independently from a shared base" }],
  ["StarRating", { webOnly: ["showLabel", "className"], nativeOnly: ["readOnly"], reason: "Native's readOnly is equivalent to Web's onChange-omitted display-only mode (different API shape for the same behavior)" }],
  ["StatCard", { webOnly: ["unit", "icon", "variant", "interactive", "onClick"], nativeOnly: ["delta"], reason: R_VARIANT_ARTIFACT + "; Web adds a unit/interactive-click API and Native adds a delta (trend) display, neither ported to the other side yet" }],
  ["StatusActionBadge", { webOnly: [], nativeOnly: ["style"], reason: R_STYLE }],
  ["StickyActionBar", { webOnly: ["bordered"], nativeOnly: ["children"], reason: R_STYLE + "; Native composes via children instead of a bordered visual toggle" }],
  ["SubNav", { webOnly: ["variant", "sticky", "className"], nativeOnly: [], reason: "sticky positioning and CVA variant are Web/CSS-only concepts; Native has no SubNav-specific own props left after that" }],
  ["SwipeRow", { webOnly: ["actions", "side", "className"], nativeOnly: ["rightActions", "actionWidth"], reason: "actions vs rightActions naming diverged independently for the same swipe-action-list feature" }],
  ["SyncStatusBadge", { webOnly: ["state", "errorCount", "onRetry", "syncingLabel", "successLabel", "errorLabel", "offlineLabel", "retryLabel", "className"], nativeOnly: ["status", "label"], reason: "state vs status naming diverged independently; Web has a richer per-state i18n label API not yet ported to Native" }],
  ["TagInput", { webOnly: ["disabled", "max", "allowDuplicates", "className", "inputLabel"], nativeOnly: ["maxTags"], reason: "max vs maxTags naming diverged independently for the same limit" }],
  ["Textarea", { webOnly: ["autoGrow", "showCount"], nativeOnly: ["invalid", "disabled", "minHeight"], reason: "invalid/disabled are inherited via extends on Web (invisible to this extractor); autoGrow/showCount are Web-only features not yet ported to Native's separate AutoGrowTextarea component" }],
  ["TimePicker", { webOnly: ["id", "className", "triggerLabel"], nativeOnly: [], reason: R_STYLE }],
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
  const webOnly = webProps.filter((p) => !nativeSet.has(p) && !allowedWebOnly.has(p))
  const nativeOnly = nativeProps.filter((p) => !webSet.has(p) && !allowedNativeOnly.has(p))

  if (webOnly.length === 0 && nativeOnly.length === 0) return null
  return { webOnly, nativeOnly }
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
let propsChecked = 0

for (const name of contractNames) {
  if (INTENTIONAL_NATIVE_GAPS.has(name)) continue // no native counterpart at all
  const webPath = webPathByName.get(name)
  const nativeFile = nativeFileByName.get(name)
  if (!webPath || !nativeFile) continue

  const diff = diffProps(name, webPath, nativeFile)
  if (diff === undefined) continue
  propsChecked += 1
  if (diff) propMismatches.push({ name, ...diff })
}

const staleProGaps = [...INTENTIONAL_PROP_GAPS.keys()].filter((name) => !contractNames.includes(name))
if (staleProGaps.length > 0) {
  console.warn(`[native-parity] stale prop-gap allowlist entries: ${staleProGaps.join(", ")}`)
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

console.log(
  `[native-parity] OK: ${contractNames.length} contract names checked, ${INTENTIONAL_NATIVE_GAPS.size} intentional native gaps, ${propsChecked} components prop-diffed (${INTENTIONAL_PROP_GAPS.size} intentional prop gaps)`,
)
