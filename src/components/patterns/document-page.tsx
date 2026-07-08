import * as React from "react"
import { cn } from "@/lib/utils"

export interface DocumentPageProps extends React.ComponentProps<"main"> {
  /** 画面タイトル（例: "プライバシーポリシー"）。typo-heading-2xl で描画する。 */
  title: string
  /** 最終更新日（例: "2026年7月7日"）。指定時のみ表示する。 */
  lastUpdated?: string
  /** 本文（通常は `<Prose sections={...} />`）。末尾の同意文等も含めて自由に渡せる。 */
  children: React.ReactNode
}

/**
 * DocumentPage — プライバシーポリシー・利用規約などの静的文書ページ。
 *
 * ネイティブ版 `DocumentScreen`（`src/native/components/DocumentScreen.tsx`）に対応する
 * web 版。native はアプリ画面（Screen + AppHeader）としてスキャフォールドするが、
 * web では単体の文書ページなので命名を `DocumentPage` とした。
 * 戻るナビは native の `onBack` 相当を持たず、呼び出し側のレイアウトシェル
 * （ヘッダー・パンくず等）に委ねる。
 *
 * 見出し（typo-heading-2xl）・最終更新日・本文のスペーシングを DS トークンで一元化する。
 * 本文は `Prose` に `sections` を渡すだけで描画できる。読みやすい行長として
 * `max-w-2xl`（既存 DS の文書系コンポーネントの慣習に合わせた幅）に本文を収める。
 *
 * @example
 * <DocumentPage title="プライバシーポリシー" lastUpdated="2026年7月7日">
 *   <Prose sections={POLICY_SECTIONS} />
 * </DocumentPage>
 */
function DocumentPage({ title, lastUpdated, children, className, ...props }: DocumentPageProps) {
  return (
    <main
      data-slot="document-page"
      className={cn("mx-auto flex w-full max-w-2xl flex-col px-4 py-10", className)}
      {...props}
    >
      <div className="flex flex-col gap-1">
        <h1 className="typo-heading-2xl text-[var(--Text-High-Emphasis)]">{title}</h1>
        {lastUpdated && (
          <p className="typo-label-sm text-[var(--Text-Low-Emphasis)]">最終更新日：{lastUpdated}</p>
        )}
      </div>
      <div className="mt-6">{children}</div>
    </main>
  )
}

export { DocumentPage }
