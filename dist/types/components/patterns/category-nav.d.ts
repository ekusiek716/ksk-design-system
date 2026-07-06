export interface CategoryNavItem {
    /** カテゴリ名 */
    name: string;
    /** リンクURL */
    href?: string;
    /** アイコン画像URL */
    imageUrl: string;
    /** アイコンの代替テキスト */
    imageAlt?: string;
    /** 選択中フラグ */
    isSelected?: boolean;
    /** クリックハンドラ */
    onClick?: () => void;
}
export interface CategoryNavProps {
    /** カテゴリリスト */
    items: CategoryNavItem[];
    /** 追加クラス */
    className?: string;
}
/**
 * CategoryIconStrip — カテゴリアイコンフィルター行
 *
 * 商品一覧・検索結果ページ上部に設置するコンパクトなカテゴリフィルター。
 * 小さな円アイコン（40px）＋ラベルを横スクロールで並べる。
 *
 * CategoryScroll との違い:
 * - セクションタイトルなし（フィルターとして使用）
 * - アイコンが小さい（40px）
 * - isSelected で選択状態を持てる
 *
 * ### 使用例
 * ```tsx
 * <CategoryIconStrip
 *   items={[
 *     { name: "バースデー", imageUrl: "/cat1.jpg", isSelected: true, onClick: () => setFilter("birthday") },
 *     { name: "記念日", imageUrl: "/cat2.jpg", onClick: () => setFilter("anniversary") },
 *   ]}
 * />
 * ```
 */
declare function CategoryNav({ items, className }: CategoryNavProps): import("react").JSX.Element;
export { CategoryNav };
