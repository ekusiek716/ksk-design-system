import * as React from "react";
export interface StickyActionBarProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * 上部ボーダーを表示する（デフォルト: true）
     */
    bordered?: boolean;
}
/**
 * BottomAction — モバイル下部操作バー
 *
 * 画面下部に sticky で固定される CTA エリア。iOS の safe-area-inset-bottom に対応。
 * カートに追加・購入するなどの主要アクションボタンを配置する。
 *
 * ### 使用例
 * ```tsx
 * <BottomAction>
 *   <Button className="w-full" size="xl">カートに追加</Button>
 * </BottomAction>
 * ```
 *
 * ### AI 向け使用ルール
 * - 商品詳細・確認画面など、画面内の最重要CTAに使用
 * - SheetContent 内では sticky ではなく absolute 配置になるため注意
 * - 子要素には Button w-full を推奨
 */
declare function StickyActionBar({ className, bordered, children, ...props }: StickyActionBarProps): import("react/jsx-runtime").JSX.Element;
export { StickyActionBar };
