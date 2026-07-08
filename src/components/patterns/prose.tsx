import * as React from "react"
import { cn } from "@/lib/utils"

export interface ProseSection {
  title: string
  body: string[]
}

export interface ProseProps extends React.ComponentProps<"div"> {
  /** `{ title, body: string[] }[]` の配列。原稿データだけ渡せば見出し+本文段落を描画する。 */
  sections: ProseSection[]
}

/**
 * Prose — 静的文書（プライバシーポリシー・利用規約等）の本文レンダラー。
 *
 * ネイティブ版（`src/native/components/Prose.tsx`）と対応。props 形は完全一致（`sections`）。
 * セクション見出し（typo-heading-md）＋段落（typo-body-md）を DS トークンで一元化する。
 * `DocumentPage` の子として使う想定だが、単体でも利用できる。
 *
 * @example
 * <Prose sections={[{ title: "1. 収集する情報", body: ["本サービスは...", "..."] }]} />
 */
function Prose({ sections, className, ...props }: ProseProps) {
  return (
    <div data-slot="prose" className={cn("flex flex-col gap-6", className)} {...props}>
      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="flex flex-col gap-2">
          <h2 className="typo-heading-md text-[var(--Text-High-Emphasis)]">{section.title}</h2>
          {section.body.map((paragraph, paragraphIndex) => (
            <p key={paragraphIndex} className="typo-body-md text-[var(--Text-Medium-Emphasis)]">
              {paragraph}
            </p>
          ))}
        </div>
      ))}
    </div>
  )
}

export { Prose }
