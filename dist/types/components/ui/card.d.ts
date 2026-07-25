import * as React from "react";
import { type VariantProps } from "class-variance-authority";
declare const cardVariants: (props?: {
    variant?: "default" | "media";
} & import("class-variance-authority/types").ClassProp) => string;
interface CardProps extends React.ComponentProps<"div">, VariantProps<typeof cardVariants> {
}
/**
 * Card — 情報をまとめる汎用カード。
 *
 * バリアント:
 * - `default`: `p-6` + `gap-6`。情報を持つカード（テキスト / ボタン構成）。
 * - `media`: padding/gap なし。サムネを端まで広げる用途。オーバーレイ配置時に。
 *
 * 構成パーツ: `CardHeader` / `CardTitle` / `CardDescription` / `CardAction` /
 *   `CardContent` / `CardFooter`。`@container` クエリで内部レスポンシブ。
 *
 * 地と同色になるとき（`--card-surface`）:
 *   Card の既定背景は `--Surface-Primary`。`AppShell` / `MarketingShell` の
 *   ルートも同じ `--Surface-Primary` なので、その直下に置いた Card は
 *   **地と完全に同色**になり、区切りは罫線（+ light では 8% の shadow）だけになる。
 *   地を描く側が `--card-surface` を宣言すると、配下の Card が指定なしで
 *   その色に切り替わる。カード 1 枚ずつ prop を付けて回る方式と違い、
 *   あとからカードを足したときの付け忘れが起きない。
 *
 *   ```tsx
 *   <div className="bg-[var(--Surface-Primary)] [--card-surface:var(--Surface-Secondary)]">
 *     <Card>…</Card>  // 指定なしで Surface-Secondary になる
 *   </div>
 *   ```
 *
 *   例外的に地に馴染ませたいときは `className="bg-[var(--Surface-Primary)]"` で
 *   上書きする（tailwind-merge で後勝ち）。
 *
 *   入れ子カードは `--card-surface` を引き継がない（Card の直下で `initial` に
 *   戻す）。外側が宣言色・内側が既定色になるので階層が潰れない。
 *   `contracts/composition.json` の cardHierarchy どおり内側を一段沈めたい
 *   場合は、内側を包む要素で `[--card-surface:var(--Surface-Tertiary)]` を宣言する。
 *
 * Note: 商品の表示は `ProductCard`（patterns/commerce）を使う。
 */
declare function Card({ className, variant, ...props }: CardProps): React.JSX.Element;
declare function CardHeader({ className, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare function CardTitle({ className, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare function CardDescription({ className, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare function CardAction({ className, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare function CardContent({ className, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare function CardFooter({ className, ...props }: React.ComponentProps<"div">): React.JSX.Element;
export { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter, cardVariants };
export type { CardProps };
