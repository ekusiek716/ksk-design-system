import * as React from "react"
import { cn } from "@/lib/utils"

type PhotoHeroOverlay = "none" | "medium" | "dark"
type PhotoHeroAlign = "bottom" | "center"

interface PhotoHeroProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  src: string
  alt?: string
  /** 文字可読性のための暗化 */
  overlay?: PhotoHeroOverlay
  /** コンテンツの縦配置 */
  align?: PhotoHeroAlign
  children: React.ReactNode
  imageClassName?: string
  contentClassName?: string
  loading?: React.ImgHTMLAttributes<HTMLImageElement>["loading"]
}

const OVERLAY_CLASS: Record<PhotoHeroOverlay, string> = {
  none: "bg-transparent",
  medium: "bg-[var(--Surface-VideoOverlay-Medium)]",
  dark: "bg-[var(--Surface-VideoOverlay-Strong)]",
}

const ALIGN_CLASS: Record<PhotoHeroAlign, string> = {
  bottom: "justify-end pt-24 pb-[calc(env(safe-area-inset-bottom,0px)_+_3rem)]",
  center: "justify-center py-16",
}

function PhotoHeroRoot({
  src,
  alt = "",
  overlay = "medium",
  align = "bottom",
  children,
  className,
  imageClassName,
  contentClassName,
  loading = "lazy",
  ...props
}: PhotoHeroProps) {
  return (
    <section
      data-slot="photo-hero"
      data-overlay={overlay}
      data-align={align}
      className={cn(
        "relative isolate flex h-full min-h-[100dvh] overflow-hidden bg-[var(--Surface-Inverse)] text-[var(--Text-on-Media)]",
        className,
      )}
      {...props}
    >
      <img
        src={src}
        alt={alt}
        aria-hidden={alt ? undefined : true}
        loading={loading}
        className={cn("absolute inset-0 size-full object-cover", imageClassName)}
      />
      <div className={cn("absolute inset-0 z-0", OVERLAY_CLASS[overlay])} />
      <div
        data-slot="photo-hero-content"
        className={cn(
          "relative z-10 flex min-h-[inherit] w-full flex-col px-6",
          ALIGN_CLASS[align],
          contentClassName,
        )}
      >
        <div className="flex w-full flex-col gap-4">
          {children}
        </div>
      </div>
    </section>
  )
}

function PhotoHeroEyebrow({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      data-slot="photo-hero-eyebrow"
      className={cn("typo-label-sm text-[var(--Text-on-Media-Secondary)] typo-on-image", className)}
      {...props}
    >
      {children}
    </p>
  )
}

function PhotoHeroTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      data-slot="photo-hero-title"
      className={cn("max-w-xl typo-heading-3xl text-[var(--Text-on-Media)] typo-on-image", className)}
      {...props}
    >
      {children}
    </h1>
  )
}

function PhotoHeroBody({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      data-slot="photo-hero-body"
      className={cn("max-w-xl typo-body-md text-[var(--Text-on-Media-Secondary)] typo-on-image", className)}
      {...props}
    >
      {children}
    </p>
  )
}

function PhotoHeroActions({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="photo-hero-actions"
      className={cn("mt-2 flex flex-col gap-3", className)}
      {...props}
    >
      {children}
    </div>
  )
}

const PhotoHero = Object.assign(PhotoHeroRoot, {
  Eyebrow: PhotoHeroEyebrow,
  Title: PhotoHeroTitle,
  Body: PhotoHeroBody,
  Actions: PhotoHeroActions,
})

export { PhotoHero }
export type { PhotoHeroAlign, PhotoHeroOverlay, PhotoHeroProps }
