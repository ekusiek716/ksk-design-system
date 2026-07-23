import * as React from "react";
export interface ProseSection {
    title: string;
    body: string[];
}
export interface ProseProps extends React.ComponentProps<"div"> {
    /** `{ title, body: string[] }[]` の配列。原稿データだけ渡せば見出し+本文段落を描画する。 */
    sections: ProseSection[];
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
declare function Prose({ sections, className, ...props }: ProseProps): React.JSX.Element;
export { Prose };
