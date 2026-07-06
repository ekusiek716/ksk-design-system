interface PresenceIndicatorProps {
    /** 表示名。イニシャル（先頭1文字）が Avatar フォールバックに使われる */
    name: string;
    /** 名前の下に表示する補足テキスト（例: "編集中" "〇〇を閲覧中"） */
    statusText?: string;
    /** 指定時、右側に Badge（variant="success"）を表示する */
    badgeLabel?: string;
    /** ステータスドットの色。true: --Object-Success / false: 中立色（既定 true） */
    online?: boolean;
    className?: string;
}
/**
 * PresenceIndicator — 「誰か（何か）が今いる/見ている」ことを示す汎用インジケーター。
 *
 * belle-todo の PartnerPresenceIndicator を汎用化。Supabase realtime・
 * タブラベル辞書・i18n・420px 未満の自動非表示は持ち込まず、表示に必要な
 * 値（name/statusText/badgeLabel/online）のみを props で受ける。
 * null ガード（presence オブジェクト全体を受けて null なら非描画）もやめ、
 * 呼び出し側が条件付きレンダリングするかどうかを判断する。
 */
declare function PresenceIndicator({ name, statusText, badgeLabel, online, className }: PresenceIndicatorProps): import("react").JSX.Element;
export { PresenceIndicator };
export type { PresenceIndicatorProps };
