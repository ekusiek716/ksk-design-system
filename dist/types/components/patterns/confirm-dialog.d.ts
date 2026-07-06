import * as React from "react";
interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    /**
     * 処理中に表示するラベル。
     * i18n 対応: 英語では "Processing…" など任意文字列を渡す。
     * @default "処理中…"
     */
    loadingLabel?: string;
    /** destructive にすると確認ボタンが赤くなる */
    variant?: "default" | "destructive";
    onConfirm: () => void | Promise<void>;
    loading?: boolean;
}
/**
 * ConfirmDialog — 「アクションを止める」割り込み確認（破壊操作の二段階確認）。
 *
 * `role="alertdialog"`（AlertDialog 基盤）。タスク面の絞り込み・フォーム等とは
 * 別カテゴリで、支援技術には緊急の確認として通知され、**オーバーレイの外側クリックでは
 * 閉じない**（明示的に確認/キャンセルを選ばせる）。PC/SP とも中央表示の
 * アラート（iOS/Android の確認アラート慣習に準拠）。
 *
 * タスク用の中央モーダル（絞り込み等）が要るときは `Dialog` / `Sheet` /
 * `ResponsiveDialog` を使う。
 */
declare function ConfirmDialog({ open, onOpenChange, title, description, confirmLabel, cancelLabel, loadingLabel, variant, onConfirm, loading, }: ConfirmDialogProps): React.JSX.Element;
export { ConfirmDialog };
export type { ConfirmDialogProps };
