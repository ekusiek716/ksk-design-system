---
name: ksk-design-system
description: KSK Design System で UI を実装・修正・レビューするとき必ず適用する判断ルール。トークン設計（semantic のみ・生値禁止）・禁止パターン43件・HIG/M3 基準・コンポーネント選択の判断基準を定義する。React + Tailwind v4 + TypeScript の UI コードを書く前に読むこと。
---

# KSK Design System — 判断Skill

KSK は Brand 色10行の差し替えで全コンポーネントが切り替わるマルチテーマ DS。
全ルールは「テーマ切替・ダークモード・消費側の色文脈のどれかで壊れる書き方を排除する」ために存在する。

## 0. 正本の読み順（このSkillは索引。複製ではない）

実データは必ず正本を読む。Skill と正本が食い違ったら**正本が勝つ**。

1. `src/components/COMPONENT_LOOKUP.md` — 既存132コンポーネントの索引。**UI を書く前に必ず確認**
2. `contracts/rules.json` — 禁止パターン43件＋AIアンチパターン10件の正規表現つき正本
3. `tokens.json` / `src/preset.css` — トークン値の正本
4. `contracts/components.json` — variant・使用ルールの正本

コンポーネントの **props の正確な形は推測しない**。使う直前に `contracts/components.json` か
該当コンポーネントの `.tsx`（COMPONENT_LOOKUP.md の import パス先）を読んで確認する。

## 1. 絶対原則（5つ。違反は書き直し）

### 原則1: 色はセマンティックトークンのみ
生 `#hex`・Tailwind 標準色・`--Primitive-*` 直参照は、Brand 差し替えとダーク反転の両方から取り残される。
- 良い例: `bg-[var(--Surface-Primary)] text-[var(--Text-High-Emphasis)]`
- **絶対やるな**: `bg-blue-500`, `text-white`, `#3B82F6`, `var(--Primitive-Brand-500)`

### 原則2: DS コンポーネントを使う（生タグ・再実装禁止）
生タグはフォーカスリング・44px ターゲット・aria を持たない。合成パターン（sheet 骨組み・設定行・toggle 等）も DS にある。
- 良い例: `<Button variant="secondary" size="sm">` / `<Select><SelectItem>`
- **絶対やるな**: `<button>`, `<a href>`, `<div onClick>`, `div.fixed.inset-0` 自作モーダル, Button 並べた自作トグル

### 原則3: 文脈非依存 — 色を継承に任せない
Tailwind v4 は border/ring/outline の既定が currentColor。消費側が濃色テキストを敷くと無指定の枠線・文字が化ける（実害あり）。テキスト要素に `text-[var(--Text-*)]`、サーフェスに `bg-[var(--Surface-*)]` を明示し、**border は必ず色を併記**する。
- 良い例: `border border-[var(--Border-Low-Emphasis)]`。状態切替は `border-transparent` ＋ `data-[state=active]:border-[var(--Brand-Primary)]` のペア
- **絶対やるな**: 色なしの `border` 単独、bg 未指定のカード/ポップオーバー（親の背景が透ける）

### 原則4: タイポは typo-* クラスのみ
size/weight/line-height/tracking は typo-* に内包済み（和文最適化）。個別指定は行間バラバラと日本語可読性低下を招く。色だけ別指定する。
- 良い例: `className="typo-body-sm text-[var(--Text-Low-Emphasis)]"`
- **絶対やるな**: `text-sm font-bold`, `text-[14px]`, `tracking-tight`。本文に typo-body-xs(10px)/caption(11px)（本文下限12px）

### 原則5: アイコンは iconsax-reactjs のみ
DS 全体でアイコンの線幅・スタイルを統一するため。
- 良い例: `import { Add } from "iconsax-reactjs"`
- **絶対やるな**: `lucide-react`, `heroicons`, インライン SVG の手書きアイコン

## 2. 検証可能ルール（クラス設計）

各行は grep で機械検証できる形で守ること。

- **gap を使う**: 兄弟間の間隔は flex/grid ＋ `gap-*`。`space-x-*`/`space-y-*` は使わない（divider や条件レンダリングで余白が壊れ、gap と混在すると余白が二重になる）。
  良い例: `<div className="flex flex-col gap-2">` / 絶対やるな: `space-y-2`
- **正方形は size-***: 幅=高さの要素は `size-*` 1つで書く。`w-* h-*` 併記は片方だけ変更されて歪む事故の元。
  良い例: `size-10` / 絶対やるな: `w-10 h-10`
- **className 合成は cn()**: 条件付き・props 併合は必ず `cn()`（`@/lib/utils`）。テンプレートリテラル連結は Tailwind の競合解決がされず false が文字列化する。
  良い例: `cn("flex gap-2", isActive && "bg-[var(--Surface-Accent-Primary-Light)]", className)` / 絶対やるな: `` className={`flex ${extra}`} ``
- **variant/size prop 優先**: 見た目の変更はまず variant・size の語彙で表現し、className 上書きは DS に語彙が無いときの最終手段（上書きが2回続いたら variant 追加を検討・提案する）。
  良い例: `<Button variant="destructive" size="sm">` / 絶対やるな: `<Button className="bg-red-500 h-8">`
- **スペーシングは 4px グリッド**: Tailwind 標準クラスの**整数ステップのみ**（高頻度は gap/p 1–6）。任意値 `p-[17px]` に加え、小数ステップ `gap-1.5`/`p-2.5`（6px/10px = グリッド外）も禁止。
  良い例: `gap-2`（8px） / 絶対やるな: `gap-1.5`, `p-[10px]`
- **角丸の使い分け**: 面/モーダル/シートは意味トークン `rounded-[var(--Radius-Surface|Modal|Sheet)]`（8/24/32px）。その他の小要素は `rounded-{none|sm|md|lg|xl|2xl|full}` の7値のみ。Button/Chip/Badge はピル（full）。
- **影は5段のみ**: `shadow-[var(--shadow-sm|md|lg|dialog|tooltip)]`。Tailwind 標準 shadow 禁止。境界は「影＋1px罫線」で表現。
- **motion は 150/200ms ease-out**（sheet は 280ms spring）。300ms 以上禁止。常時ループアニメはローディング限定。
- **ベンダープレフィックスは `-webkit-` を先、標準形を後**（逆順だと消費側 minifier の dedupe で Firefox で静かに無効化）。

## 3. 禁止パターン Top10（全43件は rules.json、rationale は references/）

| # | 禁止 | なぜ |
|---|---|---|
| P008/P009 | 生 hex・Tailwind 標準色 | テーマ切替・dark で死ぬ |
| P015 | Primitive 直参照 | hover/active の段階設計（600/700/800）を破壊 |
| P032 | 色なし border | v4 の currentColor 既定で黒ずむ（実害あり） |
| P007 | 自作モーダル | フォーカストラップ・ESC・aria が全欠落 |
| P011/P016 | フォント直書き | 行間・weight の設計が画面ごとに割れる |
| P012 | 任意値スペーシング | 4px グリッドのリズム崩壊 |
| P013/P021 | カラーバー・グラデーション | AI 生成の定番。DS の視覚言語と異質 |
| P023 | outline-none | キーボード利用者の現在地を消す a11y 違反 |
| P026 | placeholder のみ | SR が読まない・入力中に説明が消える |
| P033–P043 | 合成パターンの再実装 | 亜種が増え一括修正が効かなくなる。例外は `ksk-ds-allow-custom-ui` コメント必須 |

## 4. HIG/M3 チェックリスト（衝突時は厳しい方）

実装後、以下を Yes/No で点検する:

- [ ] タッチターゲット: 操作要素の実効ヒット領域 ≥44px（推奨48px）。チップは hitSlop で実効44px
- [ ] フォーカスリング: 全操作要素に `focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50`
- [ ] モーダリティ: 作業面=Dialog / 割り込み確認=AlertDialog・ConfirmDialog（外タップで閉じない）/ 軽い補助=Sheet。確認を素の Dialog で組んでいないか
- [ ] elevation: 影が5段トークンに収まり「浮く高さと影の強さ」が対応しているか（Card=md、Popover=lg、Dialog=dialog）
- [ ] コントラスト: 通常文字 ≥4.5:1、UI 要素 ≥3:1。状態表現は色＋アイコン＋テキストの3点セット
- [ ] `<img>` に alt、アイコンボタンに aria-label、入力に `<Label>`
- [ ] `prefers-reduced-motion` を壊す常時アニメが無い

## 5. 実装後の機械検証（必須）

```bash
bash scripts/lint-scratch.sh   # .tsx を編集したら毎回
npm run check                  # コンポーネント増減時（tsc+lint+drift+lookup）
```

Storybook ツールバーの **Hostile ctx** を loud にして、マゼンタ化・背景透け（文脈非依存違反）が無いか目視確認。

**コンポーネントを増減したら**、コードだけでは完了しない。次の連鎖を全部更新する:
`src/index.ts` → `contracts/components.json`（定義＋`meta.counts`）→ `.stories.tsx` →
`npm run generate:lookup` → `bash scripts/check-drift.sh`（一括なら `npm run check`）。
contracts と実装の drift は静かに壊れるため、レビューでは counts 差分も見る。

## 5.5 レビュー手順（PR / 差分を見る順）

壊れ方が深刻な順に見る:

1. **テーマ切替で壊れないか**（error 級）: 生 hex / Tailwind 標準色 / `--Primitive-*` 直参照 / `text-white`。4テーマ全部で成立するか
2. **消費側文脈で壊れないか**（error 級）: 無色 border・継承依存・bg 未指定サーフェス。「Storybook では正しく見える」は合格条件でない
3. **a11y**: フォーカスリング削除・`<div onClick>`・aria-label なし icon button・placeholder のみ・色のみのステータス区別
4. **DS スケール逸脱**（warning 級）: 角丸・shadow・spacing の許可セット外、300ms 超アニメ
5. **ライティング**: §7 参照

**severity の読み方**: rules.json の `error` は無条件で直す。`warning` は「消費側テーマ・日本語文脈で壊れる可能性」の警告 — 直さない場合は理由を PR に書く。

**例外の作法**: 禁止パターンを意図的に破る正当な理由がある場合のみ `// ksk-ds-allow-custom-ui: <理由>` を該当行近くに残す。理由なしの suppress は差し戻し対象。

## 6. references/ の分岐

| 状況 | 読む |
|---|---|
| 禁止パターンに引っかかった・例外を検討したい | `references/prohibited-rationale.md`（43件の why） |
| トークン名がわからない・色/typo/spacing の選択に迷う | `references/tokens-reference.md` |
| どのコンポーネントを使うか迷う（モーダル/通知/切替/フォーム） | `references/component-decisions.md` |
| タッチターゲット・elevation・motion・type scale の根拠が必要 | `references/hig-m3-mapping.md` |

## 7. ライティング（UI コピー）

日本語・敬体・簡潔。和文全角/欧文半角、見出しに「。」なし、日付 YYYY/M/D、
ボタンは動詞（「保存する」）、エラーは次の行動を明示。正本: `contracts/rules.json` の `writing`。
