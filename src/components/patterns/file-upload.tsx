import * as React from "react"
import { cn } from "@/lib/utils"

export interface UploadedFile {
  file: File
  url: string
}

export interface FileUploadProps {
  /** 受け付けるファイル形式。例: "image/*", ".pdf,.doc" */
  accept?: string
  /** 最大ファイルサイズ（バイト）。例: 5 * 1024 * 1024 = 5MB */
  maxSize?: number
  /** 複数ファイルを許可するか @default false */
  multiple?: boolean
  /** 最大ファイル数（multiple=true 時）@default 10 */
  maxFiles?: number
  onUpload?: (files: File[]) => void
  disabled?: boolean
  className?: string
  // i18n
  /** ドラッグエリアのメインラベル @default "ここにファイルをドロップ" */
  dragLabel?: string
  /** またはテキスト @default "または" */
  orLabel?: string
  /** ブラウズボタンのラベル @default "ファイルを選択" */
  browseLabel?: string
  /** ファイルサイズ超過エラーメッセージ生成関数 */
  maxSizeLabel?: (maxBytes: number) => string
  /** 最大ファイル数超過エラーメッセージ生成関数 */
  maxFilesLabel?: (max: number) => string
  /** 削除ボタンの aria-label @default "削除" */
  removeLabel?: string
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function FileUpload({
  accept,
  maxSize,
  multiple = false,
  maxFiles = 10,
  onUpload,
  disabled = false,
  className,
  dragLabel = "ここにファイルをドロップ",
  orLabel = "または",
  browseLabel = "ファイルを選択",
  maxSizeLabel = (max) => `最大 ${formatBytes(max)} まで`,
  maxFilesLabel = (max) => `最大 ${max} ファイルまで`,
  removeLabel = "削除",
}: FileUploadProps) {
  const [dragging, setDragging] = React.useState(false)
  const [files, setFiles] = React.useState<File[]>([])
  const [error, setError] = React.useState<string | null>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const validate = (incoming: File[]): File[] | null => {
    setError(null)
    if (maxSize) {
      const over = incoming.find((f) => f.size > maxSize)
      if (over) {
        setError(maxSizeLabel(maxSize))
        return null
      }
    }
    const next = multiple ? [...files, ...incoming] : incoming.slice(0, 1)
    if (multiple && next.length > maxFiles) {
      setError(maxFilesLabel(maxFiles))
      return null
    }
    return next
  }

  const addFiles = (incoming: File[]) => {
    const next = validate(incoming)
    if (!next) return
    setFiles(next)
    onUpload?.(next)
  }

  const removeFile = (index: number) => {
    const next = files.filter((_, i) => i !== index)
    setFiles(next)
    onUpload?.(next)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    if (disabled) return
    addFiles(Array.from(e.dataTransfer.files))
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(Array.from(e.target.files))
    e.target.value = ""
  }

  return (
    <div data-slot="file-upload" className={cn("flex flex-col gap-3", className)}>
      {/* Drop zone */}
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={dragLabel}
        onDragOver={(e) => { e.preventDefault(); !disabled && setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") inputRef.current?.click() }}
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 cursor-pointer transition-colors",
          dragging
            ? "border-[var(--Brand-Primary)] bg-[var(--Surface-Accent-Primary-Light)]"
            : "border-[var(--Border-Medium-Emphasis)] hover:border-[var(--Brand-Primary)] hover:bg-[var(--Surface-Secondary)]",
          disabled && "opacity-50 cursor-not-allowed pointer-events-none"
        )}
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-[var(--Object-Low-Emphasis)]" aria-hidden>
          <path d="M16 22V10M10 16L16 10L22 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 26h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span className="typo-body-md text-[var(--Text-Medium-Emphasis)] text-center">{dragLabel}</span>
        <span className="typo-body-sm text-[var(--Text-Low-Emphasis)]">{orLabel}</span>
        <span className="typo-label-sm text-[var(--Text-Accent-Primary)] underline">{browseLabel}</span>
        {(maxSize || (multiple && maxFiles)) && (
          <span className="typo-body-xs text-[var(--Text-Low-Emphasis)]">
            {[
              maxSize && maxSizeLabel(maxSize),
              multiple && maxFilesLabel(maxFiles),
            ].filter(Boolean).join(" / ")}
          </span>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={onInputChange}
        disabled={disabled}
      />

      {/* Error */}
      {error && (
        <p className="typo-body-sm text-[var(--Text-Caution)]" role="alert">{error}</p>
      )}

      {/* File list */}
      {files.length > 0 && (
        <ul className="flex flex-col gap-2">
          {files.map((f, i) => (
            <li
              key={`${f.name}-${i}`}
              className="flex items-center gap-3 rounded-lg border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Secondary)] px-3 py-2"
            >
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="text-[var(--Object-Medium-Emphasis)] shrink-0" aria-hidden>
                <path d="M4 2h8l5 5v11a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5" />
                <path d="M12 2v5h5" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              <div className="flex-1 min-w-0">
                <p className="typo-label-sm text-[var(--Text-High-Emphasis)] truncate">{f.name}</p>
                <p className="typo-body-xs text-[var(--Text-Low-Emphasis)]">{formatBytes(f.size)}</p>
              </div>
              <button
                type="button"
                aria-label={`${f.name} を${removeLabel}`}
                onClick={() => removeFile(i)}
                className="flex size-7 shrink-0 items-center justify-center rounded-full text-[var(--Object-Low-Emphasis)] hover:text-[var(--Object-High-Emphasis)] hover:bg-[var(--Surface-Tertiary)] transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 2L12 12M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export { FileUpload }
export type { FileUploadProps }
