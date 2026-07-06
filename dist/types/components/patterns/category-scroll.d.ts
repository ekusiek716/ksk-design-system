export interface CategoryScrollItem {
    /** カテゴリ名 */
    name: string;
    /** リンクURL */
    href: string;
    /** サムネイル画像URL */
    imageUrl: string;
}
export interface CategoryScrollProps {
    /** セクションタイトル */
    title: string;
    /** 「もっと見る」リンクURL */
    moreHref?: string;
    /** カテゴリリスト */
    items: CategoryScrollItem[];
    /** サムネイルサイズ (default: "md") sm=60px, md=100px, lg=120px */
    thumbnailSize?: "sm" | "md" | "lg";
    /** サムネイル形状 (default: "square") square=rounded-lg, circle=rounded-full */
    thumbnailShape?: "square" | "circle";
    /**
     * レイアウト (default: "scroll")
     * - scroll: 横スクロール1行
     * - grid: 列×行のグリッド（横スクロール）
     */
    layout?: "scroll" | "grid";
    /** グリッドの行数 (layout="grid" 時, default: 3) */
    gridRows?: number;
    /** 追加クラス */
    className?: string;
}
/**
 * CategoryScroll — カテゴリスクロールセクション
 *
 * セクションタイトル + カテゴリサムネイル（画像＋ラベル）を横スクロールで表示。
 * トップページ・一覧ページのカテゴリナビゲーションに使用。
 *
 * ### 使用例
 * ```tsx
 * <CategoryScroll
 *   title="カテゴリから探す"
 *   moreHref="/categories"
 *   items={categories}
 *   thumbnailSize="md"
 *   thumbnailShape="square"
 * />
 * ```
 *
 * ### AI 向け使用ルール
 * - thumbnailShape="circle" + thumbnailSize="sm" でクイックアクセスアイコン風
 * - layout="grid" で複数行グリッド表示（本番カテゴリ準拠）
 */
declare function CategoryScroll({ title, moreHref, items, thumbnailSize, thumbnailShape, layout, gridRows, className, }: CategoryScrollProps): import("react").JSX.Element;
export { CategoryScroll };
