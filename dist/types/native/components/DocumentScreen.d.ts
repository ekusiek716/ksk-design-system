import React from "react";
export interface DocumentScreenProps {
    /** 画面タイトル（例: "プライバシーポリシー"）。24px 相当の見出しで描画する。 */
    title: string;
    /** 最終更新日（例: "2026年7月7日"）。指定時のみ表示する。 */
    lastUpdated?: string;
    /** 指定時は戻るヘッダ（AppHeader）を表示する。 */
    onBack?: () => void;
    /** 本文（通常は `<Prose sections={...} />`）。末尾の同意文等も含めて自由に渡せる。 */
    children: React.ReactNode;
}
/**
 * DocumentScreen — プライバシーポリシー・利用規約などストア審査要件の静的文書画面スキャフォールド。
 * 見出し（24px）・最終更新日・戻るヘッダのタイポとスペーシングを DS トークンで一元化する。
 * 本文は `Prose` に `sections` を渡すだけで描画できる。
 *
 * @example
 * <DocumentScreen title="プライバシーポリシー" lastUpdated="2026年7月7日" onBack={() => nav.goBack()}>
 *   <Prose sections={POLICY_SECTIONS} />
 * </DocumentScreen>
 */
export declare function DocumentScreen({ title, lastUpdated, onBack, children }: DocumentScreenProps): React.JSX.Element;
