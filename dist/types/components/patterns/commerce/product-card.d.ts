import * as React from "react";
interface ProductCardTag {
    label: string;
    variant?: "default" | "brand" | "caution" | "success";
}
interface ProductCardProps extends React.ComponentProps<"div"> {
    name: string;
    imageUrl: string;
    imageAlt?: string;
    price: number;
    originalPrice?: number;
    rating?: number;
    reviewCount?: number;
    shopName?: string;
    tags?: ProductCardTag[];
    isFavorite?: boolean;
    onFavoriteToggle?: () => void;
    href?: string;
    onCardClick?: () => void;
    ranking?: number;
    /** @deprecated v1.30.0 以降は表示しません。既存 consumer の型互換のために残しています。 */
    deliveryLabel?: string;
    orientation?: "vertical" | "horizontal";
    showCartButton?: boolean;
    onCartAdd?: () => void;
    cartButtonLabel?: string;
}
/**
 * ProductCard — 商品表示カード（EC 系の中核）。
 *
 * orientation:
 * - `vertical`（既定）: グリッド表示。商品一覧・カルーセル向け。
 * - `horizontal`: リスト表示。カート・検索結果・履歴向け。
 *
 * stretched-link パターン:
 *   `href` または `onCardClick` を渡すとカード全体が 1 つのクリッカブル領域に
 *   なる（`<a class="absolute inset-0">` を内側に重ねる）。
 *   FavoriteButton / CartButton は z-index で上に重ねつつ、
 *   `e.stopPropagation()` で外側リンクの伝播を止めている。
 *
 * 機能:
 * - `ranking`: ランキングバッジ表示（左上）
 * - `tags`: TagBadge を画像下部に表示
 * - `discountPercent`: `originalPrice > price` から自動算出
 * - `isFavorite` / `onFavoriteToggle`: ハート（重ね・トグル）
 * - `showCartButton`: カート追加 CTA（vertical のみ）
 */
declare function ProductCard({ className, name, imageUrl, imageAlt, price, originalPrice, rating, reviewCount, shopName, tags, isFavorite, onFavoriteToggle, href, onCardClick, ranking, deliveryLabel: _deliveryLabel, orientation, showCartButton, onCartAdd, cartButtonLabel, ...props }: ProductCardProps): React.JSX.Element;
export { ProductCard };
export type { ProductCardProps, ProductCardTag };
