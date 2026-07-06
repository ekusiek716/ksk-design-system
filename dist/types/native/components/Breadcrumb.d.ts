import React from "react";
export interface BreadcrumbProps {
    title: string;
    onBack?: () => void;
    backLabel?: string;
    rightSlot?: React.ReactNode;
}
/**
 * Webの Breadcrumb を RN の BackHeader 風に意味変換。
 * モバイルでは多段ナビパンくずは無いので「← 戻る・タイトル」の最小形に。
 */
export declare function Breadcrumb({ title, onBack, backLabel, rightSlot }: BreadcrumbProps): React.JSX.Element;
