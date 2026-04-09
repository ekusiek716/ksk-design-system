import * as React from "react"
import { cn } from "@/lib/utils"

interface ImageUploaderImage {
  src: string
  alt: string
}

interface ImageUploaderProps extends React.ComponentProps<"div"> {
  images?: ImageUploaderImage[]
  onAdd?: () => void
  onRemove?: (index: number) => void
  maxImages?: number
  columns?: number
}

function ImageUploader({ images = [], onAdd, onRemove, maxImages = 10, columns = 4, className, ...props }: ImageUploaderProps) {
  return (
    <div data-slot="image-uploader" className={cn("grid gap-3", className)} style={{ gridTemplateColumns: `repeat(${Math.min(columns, 6)}, minmax(0, 1fr))` }} {...props}>
      {/* アップロード済み画像一覧 */}
      {images.map((img, i) => (
        <div key={i} className="relative aspect-square rounded-lg bg-[var(--Surface-Tertiary)] border border-[var(--Border-Low-Emphasis)] overflow-hidden group">
          <img src={img.src} alt={img.alt} className="absolute inset-0 size-full object-cover" />
          {/* ホバー時の削除オーバーレイ */}
          <div className="absolute inset-0 bg-[var(--Overlay-Medium)] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button type="button" className="size-8 rounded-full bg-[var(--Surface-Primary)]/80 flex items-center justify-center" aria-label={`${img.alt}を削除`} onClick={() => onRemove?.(i)}>
              {/* ゴミ箱アイコン */}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 4h10M6 4V3a1 1 0 011-1h2a1 1 0 011 1v1M5 4v8a1 1 0 001 1h4a1 1 0 001-1V4" stroke="var(--Caution-Base)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
          {/* 画像番号 */}
          <div className="absolute top-1 left-1 size-5 rounded bg-[var(--Overlay-Dark)] text-[var(--Text-on-Inverse)] flex items-center justify-center typo-label-xs">{i + 1}</div>
        </div>
      ))}
      {/* 追加ボタン */}
      {images.length < maxImages && (
        <button type="button" className="aspect-square rounded-lg border-2 border-dashed border-[var(--Border-Medium-Emphasis)] flex flex-col items-center justify-center gap-1 hover:border-[var(--Border-Accent-Primary)] hover:bg-[var(--Surface-Accent-Primary-Light)] transition-colors cursor-pointer" onClick={onAdd} aria-label="画像を追加">
          {/* プラスアイコン */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          <span className="typo-label-xs text-[var(--Text-Low-Emphasis)]">追加</span>
        </button>
      )}
    </div>
  )
}

export { ImageUploader }
