import React from "react";
export interface ProseSection {
    title: string;
    body: string[];
}
export interface ProseProps {
    /** `{ title, body: string[] }[]` の配列。原稿データだけ渡せば見出し+本文段落を描画する。 */
    sections: ProseSection[];
}
/**
 * Prose — 静的文書（プライバシーポリシー・利用規約等）の本文レンダラー。
 * セクション見出し（16px/bold）＋段落（14px/leading-6 相当）を DS トークンで一元化する。
 * `DocumentScreen` の子として使う想定だが、単体でも利用できる。
 */
export declare function Prose({ sections }: ProseProps): React.JSX.Element;
