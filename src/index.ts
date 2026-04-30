// =============================================================
// KSK Design System — Public API
// =============================================================

// ─── UI Components ───
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./components/ui/accordion"
export { Avatar, AvatarImage, AvatarFallback } from "./components/ui/avatar"
export { Badge, badgeVariants } from "./components/ui/badge"
export { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis } from "./components/ui/breadcrumb"
export { Button, buttonVariants } from "./components/ui/button"
export { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter } from "./components/ui/card"
export { Checkbox } from "./components/ui/checkbox"
export { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger } from "./components/ui/dialog"
export { Input } from "./components/ui/input"
export { Calendar } from "./components/ui/calendar"
export type { CalendarProps } from "./components/ui/calendar"
export { DatePicker, DateRangePicker } from "./components/ui/date-picker"
export type { DatePickerProps, DateRangePickerProps } from "./components/ui/date-picker"
export { Label } from "./components/ui/label"
export { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "./components/ui/pagination"
export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor } from "./components/ui/popover"
export { Progress } from "./components/ui/progress"
export { RadioGroup, RadioGroupItem } from "./components/ui/radio-group"
export { ScrollArea, ScrollBar } from "./components/ui/scroll-area"
export { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "./components/ui/select"
export { Separator } from "./components/ui/separator"
export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription } from "./components/ui/sheet"
export { Skeleton } from "./components/ui/skeleton"
export { Switch } from "./components/ui/switch"
export { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/tabs"
export { Textarea } from "./components/ui/textarea"
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "./components/ui/tooltip"
export { ProgressRing } from "./components/ui/progress-ring"
export type { ProgressRingProps } from "./components/ui/progress-ring"
export { NumberInput } from "./components/ui/number-input"
export type { NumberInputProps } from "./components/ui/number-input"
export { PillToggle } from "./components/ui/pill-toggle"
export type { PillToggleProps, PillToggleOption } from "./components/ui/pill-toggle"
export { StarRating } from "./components/ui/star-rating"
export type { StarRatingProps } from "./components/ui/star-rating"

// ─── Pattern Components ───
export { AppHeader } from "./components/patterns/app-header"
export type { AppHeaderProps } from "./components/patterns/app-header"
export { TagInput } from "./components/patterns/tag-input"
export type { TagInputProps } from "./components/patterns/tag-input"
export { SwipeRow } from "./components/patterns/swipe-row"
export type { SwipeRowProps, SwipeAction } from "./components/patterns/swipe-row"
export { ConfirmDialog } from "./components/patterns/confirm-dialog"
export type { ConfirmDialogProps } from "./components/patterns/confirm-dialog"
export { BottomSheetForm } from "./components/patterns/bottom-sheet-form"
export type { BottomSheetFormProps } from "./components/patterns/bottom-sheet-form"
export { ChipSelector } from "./components/patterns/chip-selector"
export type { ChipSelectorProps, ChipSelectorOption } from "./components/patterns/chip-selector"
export { Banner, bannerVariants } from "./components/patterns/banner"
export { Chip, chipVariants } from "./components/patterns/chip"
export { EmptyState } from "./components/patterns/empty-state"
export { ErrorState } from "./components/patterns/error-state"
export { FormField } from "./components/patterns/form-field"
export { ListItem } from "./components/patterns/list-item"
export { NotificationBadge } from "./components/patterns/notification-badge"
export { ProgressSteps } from "./components/patterns/progress-steps"
export { SearchBar } from "./components/patterns/search-bar"
export { SectionHeader } from "./components/patterns/section-header"
export { StatCard } from "./components/patterns/stat-card"
export { Tag, tagVariants } from "./components/patterns/tag"
export { ResponsiveDialog, ResponsiveDialogTrigger, ResponsiveDialogContent, ResponsiveDialogHeader, ResponsiveDialogTitle, ResponsiveDialogDescription, ResponsiveDialogFooter, ResponsiveDialogClose, useMediaQuery } from "./components/ui/responsive-dialog"
export { Toaster, useToast } from "./components/ui/toast"
export type { Toast, ToastVariant } from "./components/ui/toast"
export { AdminShell } from "./components/patterns/shells/admin-shell"
export { AppShell } from "./components/patterns/shells/app-shell"
export { MarketingShell } from "./components/patterns/shells/marketing-shell"
export { FormRoot, FormSection, FormActions } from "./components/patterns/form"

// ─── Commerce Components ───
export { PriceDisplay, priceVariants } from "./components/patterns/commerce/price-display"
export { RatingDisplay } from "./components/patterns/commerce/rating-display"
export { QuantitySelector } from "./components/patterns/commerce/quantity-selector"
export { OrderSummary } from "./components/patterns/commerce/order-summary"
export { ProductCard } from "./components/patterns/commerce/product-card"
export type { ProductCardProps, ProductCardTag } from "./components/patterns/commerce/product-card"
export { ProductCarousel } from "./components/patterns/commerce/product-carousel"
export { ImageCarousel } from "./components/patterns/commerce/image-carousel"
export { BottomNav } from "./components/patterns/commerce/bottom-nav"
export { FilterBar } from "./components/patterns/commerce/filter-bar"

// ─── Admin Components ───
export { KebabMenu } from "./components/patterns/admin/kebab-menu"
export type { KebabMenuItem } from "./components/patterns/admin/kebab-menu"
export { BulkActionBar } from "./components/patterns/admin/bulk-action-bar"
export { StatusTabs } from "./components/patterns/admin/status-tabs"
export type { StatusTabItem } from "./components/patterns/admin/status-tabs"
export { SearchPanel } from "./components/patterns/admin/search-panel"
export { ImageUploader } from "./components/patterns/admin/image-uploader"
export { NotificationList } from "./components/patterns/admin/notification-list"
export type { NotificationItem } from "./components/patterns/admin/notification-list"
export {
  DataTable,
  DataTableTable,
  DataTableHeader,
  DataTableBody,
  DataTableRow,
  DataTableHead,
  DataTableCell,
  DataTableAvatarCell,
  DataTableImageCell,
  DataTableCheckboxCell,
  DataTableActionCell,
  DataTableInputCell,
  DataTableSelectCell,
  DataTableNumberCell,
  DataTableDragHandleCell,
  DataTableLinkCell,
  DataTableBulkActions,
  DataTableSectionRow,
  DataTableAddRow,
  DataTableEmptyState,
} from "./components/patterns/admin/data-table"
export type { SortDirection, DataTableActionMenuItem } from "./components/patterns/admin/data-table"

// ─── Utilities ───
export { cn } from "./lib/utils"
