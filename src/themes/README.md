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

### A. CLI で生成する（推奨）

ブランド色 1 色から Brand-50〜900 を生成し、コントラストを検査して theme CSS を書き出します。

```bash
# ブランド色（# はシェルでコメント扱いになるので引用符で囲む）を Brand-500 に置く
npx ksk-ds theme "#0EA5E9" --name my-client --out ./themes/my-client.css

# 結果を JSON で受け取る（ランプ・補正内容・コントラスト値）
npx ksk-ds theme "#0EA5E9" --json

# 手で作った・既存のテーマ CSS を検査だけする（default は src/styles/primitive.css を指定）
npx ksk-ds theme --check ./themes/my-client.css
```

- 色相はブランド色のまま、明度は既存テーマの傾向に合わせ、彩度は sRGB に収まるまで縮めます。
  Brand-500 は指定した色そのものです。
- 検査するのは、白文字 on 600（ボタン面）・600 の文字 on 白 / 50・白文字 on 700 / 800（hover / active）、
  ダークの 400 の文字 / 面です（いずれも WCAG AA 4.5:1）。600 が足りなければ 600〜900 を暗くして
  補正し、警告を出します。補正しても通らない必須ペアがあれば exit 1 で CSS は出しません。
- 注意表示（exit code に影響しない）: フォーカス 400 on 白（3:1）・ダークの hover / active の面・
  ダークの 400 on 900。ライトの 600 が白文字 4.5:1 を満たす条件とダークの 600 が濃色文字 4.5:1 を満たす
  条件は同時に成り立たないため、ダークの active は多くの色で注意表示になります。
- 出力を `@import` して使う手順は下の 3 と同じです。

### B. 手作業で作る

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
