import React from "react";
export interface PresenceIndicatorProps {
    /** 表示名。イニシャル（先頭1文字）が Avatar フォールバックに使われる */
    name: string;
    /** 名前の下に表示する補足テキスト（例: "編集中" "〇〇を閲覧中"） */
    statusText?: string;
    /** 指定時、右側に Badge（tone="success"）を表示する */
    badgeLabel?: string;
    /** ステータスドットの色。true: success / false: 中立色（既定 true） */
    online?: boolean;
}
/**
 * PresenceIndicator — web 版と同じ構成（Avatar + ステータスドット + statusText + Badge）の native 実装。
 */
export declare function PresenceIndicator({ name, statusText, badgeLabel, online }: PresenceIndicatorProps): React.JSX.Element;
