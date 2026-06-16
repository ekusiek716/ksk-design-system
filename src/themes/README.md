# KSK Design System — テーマガイド

## 概要

KSK DS のテーマシステムは **Primitive Layer の Brand 色を差し替えるだけ** で、
全 Semantic トークン → 全コンポーネントの見た目が自動的に切り替わる設計です。

## プリセットテーマ

| テーマ | ファイル | Brand-500 | 想定業種 |
|--------|---------|-----------|---------|
| Default (Blue) | `default.css` | `#3B82F6` | 汎用・SaaS・BtoB |
| Orange | `orange.css` | `#E04B00` | EC・フード・エンタメ |
| Blue | `blue.css` | `#3B82F6` | リクルート・HR・建設 |
| Green | `green.css` | `#16A34A` | ヘルスケア・サステナ・金融 |
| Violet | `violet.css` | `#7C3AED` | プレミアム・クリエイティブ・教育 |

## 新しいクライアントテーマの作り方

1. `default.css` をコピーして `{client-name}.css` を作成
2. `--Primitive-Brand-*` の 50〜900 をクライアントのブランドカラーに置換
3. プロジェクトの CSS で `@import` する

```css
/* クライアントプロジェクト側 */
@import "ksk-design-system/preset";
@import "./themes/my-client.css";
```

## テーマ切替の仕組み

```
Brand色を差し替え
  ↓
Primitive Layer（primitive.css の Brand-50〜900）
  ↓ 参照
Semantic Layer（semantic.css の Brand-Primary, Hover-*, Active-* 等）
  ↓ 参照
Bridge Layer（preset.css の --primary, --ring 等 shadcn 互換）
  ↓ 参照
全コンポーネント（Button, Input, Card 等）
```

**変更は Brand 色の 10 行だけ。** 残り全てが CSS 変数の連鎖で自動反映されます。
