import * as React from "react"
import { CloseCircle, DocumentUpload, Gallery } from "iconsax-reactjs"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface CompactFilePickerProps
  extends Omit<React.ComponentProps<"input">, "children" | "onChange" | "type"> {
  label?: React.ReactNode
  description?: React.ReactNode
  triggerLabel?: React.ReactNode
  icon?: React.ReactNode
  loading?: boolean
  onFilesChange?: (files: File[]) => void
  inputClassName?: string
}

interface ImageAttachment {
  id: string
  src: string
  alt?: string
  name?: string
}

interface ImageAttachmentPickerProps
  extends Omit<CompactFilePickerProps, "accept" | "icon"> {
  images?: ImageAttachment[]
  accept?: string
  onRemove?: (id: string) => void
  removeLabel?: (image: ImageAttachment) => string
  previewVariant?: "grid" | "list"
}

function CompactFilePicker({
  className,
  inputClassName,
  label = "ファイル",
  description,
  triggerLabel = "選択する",
  icon,
  loading = false,
  disabled,
  id,
  multiple,
  onFilesChange,
  ...inputProps
}: CompactFilePickerProps) {
  const generatedId = React.useId()
  const inputId = id ?? generatedId
  const inputRef = React.useRef<HTMLInputElement>(null)
  const isDisabled = disabled || loading

  return (
    <div data-slot="compact-file-picker" className={cn("flex items-center gap-3", className)}>
      <input
        {...inputProps}
        ref={inputRef}
        id={inputId}
        type="file"
        multiple={multiple}
        disabled={isDisabled}
        className={cn("sr-only", inputClassName)}
        onChange={(event) => {
          const files = Array.from(event.currentTarget.files ?? [])
          onFilesChange?.(files)
          event.currentTarget.value = ""
        }}
      />
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[var(--Surface-Secondary)] text-[var(--Object-Medium-Emphasis)]">
          {icon ?? <DocumentUpload size={20} aria-hidden />}
        </span>
        <label htmlFor={inputId} className="min-w-0 flex-1">
          <span className="typo-label-md block truncate text-[var(--Text-High-Emphasis)]">
            {label}
          </span>
          {description && (
            <span className="typo-body-sm mt-1 block text-[var(--Text-Medium-Emphasis)]">
              {description}
            </span>
          )}
        </label>
      </div>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        disabled={isDisabled}
        onClick={() => inputRef.current?.click()}
      >
        {loading ? "処理中" : triggerLabel}
      </Button>
    </div>
  )
}

function ImageAttachmentPicker({
  className,
  images = [],
  accept = "image/*",
  previewVariant = "grid",
  triggerLabel = "画像を追加",
  label = "画像",
  description = "JPG / PNG / WebP",
  onRemove,
  removeLabel = (image) => `${image.name ?? "画像"}を削除`,
  ...props
}: ImageAttachmentPickerProps) {
  return (
    <div data-slot="image-attachment-picker" className={cn("flex flex-col gap-3", className)}>
      <CompactFilePicker
        {...props}
        accept={accept}
        label={label}
        description={description}
        triggerLabel={triggerLabel}
        icon={<Gallery size={20} aria-hidden />}
      />
      {images.length > 0 && (
        <ul
          data-slot="image-attachment-preview-list"
          className={cn(
            previewVariant === "grid"
              ? "grid grid-cols-3 gap-2"
              : "flex flex-col gap-2"
          )}
        >
          {images.map((image) => (
            <li
              key={image.id}
              className={cn(
                "relative overflow-hidden rounded-xl border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)]",
                previewVariant === "list" && "flex items-center gap-3 p-2"
              )}
            >
              <img
                src={image.src}
                alt={image.alt ?? image.name ?? ""}
                className={cn(
                  "block object-cover",
                  previewVariant === "grid" ? "aspect-square w-full" : "size-14 rounded-lg"
                )}
              />
              {previewVariant === "list" && (
                <span className="typo-label-sm min-w-0 flex-1 truncate text-[var(--Text-High-Emphasis)]">
                  {image.name ?? image.alt ?? "画像"}
                </span>
              )}
              {onRemove && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={removeLabel(image)}
                  className={cn(
                    previewVariant === "grid" && "absolute right-1 top-1 bg-[var(--Surface-Primary)]"
                  )}
                  onClick={() => onRemove(image.id)}
                >
                  <CloseCircle size={16} aria-hidden />
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export { CompactFilePicker, ImageAttachmentPicker }
export type { CompactFilePickerProps, ImageAttachment, ImageAttachmentPickerProps }
