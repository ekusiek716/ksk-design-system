# Migration Guide — `ksk-design-system`

メジャーバージョン間の移行ガイド。
patch / minor は原則破壊変更なし、自動アップグレード可（例外: **v1.34.0 で npm パッケージ名を変更**。import の置換が必要。下記参照）。

<!-- deprecations:start（自動生成・手で編集しない） -->

## 非推奨 API 一覧

正本は [`contracts/deprecations.json`](./contracts/deprecations.json)。この節はそこから生成しています。

消費側での残存件数は次のコマンドで数えられます（read-only・残件があれば exit 1）:

```bash
npx ksk-ds check-migration ./src
```

| API | 使われ方 | 移行先 | 非推奨にした版 | 削除予定 |
| --- | --- | --- | --- | --- |
| `ListItem.interactive` | `<ListItem interactive>` | href または onClick を ListItem 自体へ渡す | 1.46.0 | v2.0.0 |
| `ChipSelector.multiple` | `<ChipSelector multiple>` | selectionMode（multiple={false} は selectionMode="single"、multiple は selectionMode="multiple"） | unreleased | v2.0.0 |
| `PillToggle.onValueChange` | `<PillToggle onValueChange>` | onChange | 1.49.0 | v2.0.0 |
| `ProductCard.deliveryLabel` | `<ProductCard deliveryLabel>` | なし（v1.30.0 以降は描画されないため、渡している箇所は削除する） | 1.30.1 | v2.0.0 |
| `Progress.tone` | `<Progress tone>` | variant | 1.40.1 | v2.0.0 |

各エントリの補足:

- **ListItem.interactive**（issue #207） — 外側の Link / button でラップする既存コードの視覚互換用に残している。 実装: src/components/patterns/list-item.tsx
- **ChipSelector.multiple**（issue #352） — 既定が true（複数選択）で「渡し忘れると静かに壊れる側」に倒れているため新規実装では使わない。 実装: src/components/patterns/chip-selector.tsx / src/native/components/ChipSelector.tsx
- **PillToggle.onValueChange**（issue #264） — 後方互換エイリアス。onChange を併せて渡した場合は onChange が優先される。 実装: src/components/ui/pill-toggle.tsx
- **ProductCard.deliveryLabel** — 既存 consumer の型互換のためだけに残している no-op prop。 実装: src/components/patterns/commerce/product-card.tsx
- **Progress.tone** — React Native 版のみ。既存 RN consumer 向けの互換。 実装: src/native/components/Progress.tsx

削除は「全消費リポで `check-migration` の残件が 0」を条件に、`削除予定` のメジャーリリースで行います。

<!-- deprecations:end -->

---

## v2.0 (未リリース)

まだメジャー破壊変更の予定はなし。

破壊変更を入れる際にはここに以下を書く:
1. 削除した識別子 / prop の一覧（rename テーブル）
2. before / after コード例
3. 自動移行コマンド: `npx ksk-design-system codemod <name> ./src`（`<name>` は
   そのリリースで追加した `scripts/codemod/<name>.mjs`。利用できる名前は
   `npx ksk-design-system codemod` で一覧できる）
4. 手動対応が必要な項目（codemod では拾えないケース）

---

## v1 系内の minor 変更（参考）

### 次のリリース — `ResponsiveOverlayFrame` に `preset="plain"` を追加（issue #486）

`side="bottom"` の経路は必ず `BottomSheetFrame` の preset を通るため、
`sm:`（640px 以上）でフロートカード化し、内側 padding も落ちる（`p-0`）。
「タブレット幅でも全幅の下部シートのままでよい」面——素の
`<SheetContent side="bottom">` で組んである確認シート等——には強すぎて、
移行すると 640〜1023px の見た目が変わってしまう。

`preset="plain"` はその橋渡し。モバイルは素の `<SheetContent side="bottom">`
そのまま（全幅・下端固定・`p-6`・`max-h-[90dvh]`）で、デスクトップだけ
中央モーダル（32rem × `min(90dvh, 46rem)`）になる。

**before**

```tsx
<Sheet open={open} onOpenChange={setOpen}>
  <SheetContent side="bottom" className="max-w-md mx-auto pb-8">
    …
  </SheetContent>
</Sheet>
```

**after**

```tsx
<ResponsiveDialog open={open} onOpenChange={setOpen} breakpoint="lg">
  <ResponsiveOverlayFrame preset="plain" className="max-w-md mx-auto pb-8">
    …
  </ResponsiveOverlayFrame>
</ResponsiveDialog>
```

注意点:

- `preset="plain"` では `padding`（既定 `true` = `p-6`）が使える。他の preset は
  preset 自身が余白を持つため `padding` は型エラーになる。
- デスクトップの角丸は `--Radius-Modal`（1.5rem）。消費側 CSS で 1rem 等に
  していた場合は `desktopClassName` で明示する。
- 高さは `min(90dvh, 46rem)`。モバイルの `max-h-[90dvh]` を引き継いだ値で、
  縦 866px 以上の画面では 46rem が効く。
- 幅の 32rem は `sm:`（640px 以上）で効く。`breakpoint` を 640px 未満に解決する
  設定では DialogContent 既定の `max-w-[calc(100%_-_3rem)]` が残る。
  `breakpoint="md"` / `"lg"` 運用なら影響しない。
- `desktopPosition` は `"center"` / `"top"` のみ。`"fullscreen"` は plain の
  幅指定と噛み合わないため型で禁止している。

### 次のリリース — `ResponsiveOverlayFrame` が float / float-glass シートを受けられるようになった（issue #479）

#472 で入った `ResponsiveOverlayFrame` は内部で `BottomSheetFrame`（`side="bottom"` 固定）を
使うため、左右・下に余白を持つカード型のシート（`side="float"` / `"float-glass"`）を
受けられなかった。消費側はその形のシートだけ、デスクトップ中央モーダル化の
global CSS（`!important`）を残す必要があった。

`side` prop を足したので、float 系も同じ 1 つの API で切り替えられる。

**before**（`Sheet` + `SheetContent side="float"` + 消費側 global CSS）

```tsx
<Sheet open={open} onOpenChange={setOpen}>
  <SheetContent side="float" className="w-full max-w-md mx-auto p-6">
    …
  </SheetContent>
</Sheet>
```

```css
/* 消費側 global CSS — 削除する */
@media (min-width: 1024px) {
  [data-slot="sheet-content"][data-side="float"]:not([data-snap-active]) {
    left: 50% !important; top: 50% !important;
    transform: translate(-50%, -50%) !important;
    width: min(32rem, calc(100vw - 4rem)) !important;
    max-height: min(85vh, 46rem) !important;
    border-radius: var(--Radius-Modal) !important;
  }
}
```

**after**

```tsx
<ResponsiveDialog open={open} onOpenChange={setOpen} breakpoint="lg">
  <ResponsiveOverlayFrame side="float" className="max-w-md">
    …
  </ResponsiveOverlayFrame>
</ResponsiveDialog>
```

注意点:

- `side` ごとに効く prop が違い、**効かない組み合わせは型エラーになる**（黙って無視されない）。
  - `side="bottom"`（既定）: `preset` / `surface` / `desktopPosition` が使える。`padding` は不可
    （preset が余白を持つため）。
  - `side="float"` / `"float-glass"`: `padding`（既定 `true` = `p-6`）が使える。
    `preset` / `surface` / `desktopPosition` は不可。
- `"float-glass"` の素材は `side` 自身が決める（`glass` + `glass-specular`）。
  `surface="glass"`（`glass-strong`）とは別物で、二重に重ねると glass.css の記述順でしか
  勝敗が決まらないため型で禁止している。
- デスクトップの寸法は幅 `32rem`（`sm:max-w-lg`）× 高さ `min(85dvh, 46rem)`。上の global CSS が
  当てていた値と実質同じだが、厳密には次の差がある:
  - 高さの単位が `dvh`（DS）と `vh`（旧 CSS）で、アドレスバーが伸縮する環境では一致しない。
  - 幅の上限は `sm:`（640px 以上）で効く。`breakpoint` を 640px 未満に解決する設定
    （`product-theme` で小さい値を入れた場合）では DialogContent 既定の
    `max-w-[calc(100%_-_3rem)]` が残る。`breakpoint="md"` / `"lg"` 運用なら差は出ない。
- デスクトップでは overlay（背景の暗転）がガラスにならない（`glassOverlay` はシート固有の
  prop なので落ちる）。面だけガラス、背景は通常の暗転になる。
- snap point 付きのシートは #472 と同じくシートのまま。ただし DS の snap は
  `side="bottom"` 専用なので、`snapPoints` と float 系の併用は snap もデスクトップ変換も
  効かない「何も起きない」組み合わせになる。どちらかに寄せること。

### 次のリリース — `ResponsiveOverlayFrame` 追加（`BottomSheetFrame` + 消費側デスクトップ CSS からの移行 / issue #472）

`BottomSheetFrame` はモバイルの preset（`mobile-full` / `mobile-page` /
`mobile-form`）を持つ一方でデスクトップでは中央モーダルにならず、消費側は
global CSS で `position` / `transform` / `width` / `max-height` / `radius` を
`!important` 上書きしてシートをデスクトップモーダルへ変換していた
（belle-todo で 25 箇所 + 変換ルール1本）。この上書きは DS 内部の `data-slot` /
`data-side` / class 名の substring に依存するため、Sheet の内部変更で静かに壊れる。

`ResponsiveOverlayFrame` は同じ preset をモバイルで保ったまま、デスクトップでは
`DialogContent`（中央モーダル）として描画する。上書き用の CSS は不要になる。

**before**（`Sheet` + `BottomSheetFrame` + 消費側 global CSS）

```tsx
<Sheet open={open} onOpenChange={setOpen}>
  <BottomSheetFrame preset="mobile-form">
    <DetailSheetScaffold header={…} footer={<KeyboardAwareSheetFooter>…</KeyboardAwareSheetFooter>}>
      …
    </DetailSheetScaffold>
  </BottomSheetFrame>
</Sheet>
```

```css
/* 消費側 global CSS — 削除する */
@media (min-width: 768px) {
  [data-slot="sheet-content"][data-side="bottom"]:not([data-snap]) {
    position: fixed !important;
    left: 50% !important;
    top: 50% !important;
    transform: translate(-50%, -50%) !important;
    width: min(32rem, calc(100% - 3rem)) !important;
    max-height: 85dvh !important;
    border-radius: var(--Radius-Modal) !important;
  }
}
```

**after**

```tsx
<ResponsiveDialog open={open} onOpenChange={setOpen} breakpoint="md">
  <ResponsiveOverlayFrame preset="mobile-form" description="タスクを編集します">
    <DetailSheetScaffold header={…} footer={<ResponsiveOverlayFooter>…</ResponsiveOverlayFooter>}>
      …
    </DetailSheetScaffold>
  </ResponsiveOverlayFrame>
</ResponsiveDialog>
```

移行の手順:

1. `<Sheet>` を `<ResponsiveDialog>` に、`<BottomSheetFrame>` を
   `<ResponsiveOverlayFrame>` に置き換える（`preset` / `surface` はそのまま）。
2. `<KeyboardAwareSheetFooter>` を `<ResponsiveOverlayFooter>` に置き換える
   （モバイルでは従来どおりソフトキーボードに追従し、デスクトップでは静的フッタになる）。
3. 消費側 global CSS のデスクトップ変換ルールを削除する。
4. 切り替え境界が 768px でよければ指定不要。変えたい場合は
   `breakpoint="lg"` などを指定するか、`breakpoint="product-theme"` にして
   `:root { --Overlay-Desktop-Breakpoint: 1024px }` を product theme 側に置く。
5. `<Sheet snapPoints={…}>` の snap シートは**変換しない**。`ResponsiveDialog` に
   `snapPoints` を渡した場合は境界を越えてもシートのまま描画される。

`description` / `autoFocus` / `restoreFocusOnClose` / `closeOnEsc` /
`bodyScrollLock` / `zIndex` は両分岐へそのまま渡る。`container` /
`overlayClassName` / `glassOverlay` / `swipeToClose` はシート固有なので
デスクトップでは無視される。

既存の `BottomSheetFrame` / `ResponsiveDialogContent` は非推奨ではない
（モバイル専用面・preset 不要の面では引き続きそのまま使う）。

### 次のリリース — `typescript` が必須依存から optional peer dependency になった（issue #409）

CLI の1ルール（P046）のためだけに typescript（24MB）が全 consumer の
node_modules に入っていたのを解消した。install サイズが減り、`ksk-ds lint` の
起動も速くなる（実測 655ms → 407ms）。

- **通常の TypeScript プロジェクト**: 自前で typescript を持っているので影響なし
- **typescript を持たないプロジェクト**: P046（card-child-spacing）だけが
  「typescript が無いため skip」の1行案内つきでスキップされる。他の全ルールは動く
- DS の typescript に transitive 依存していた場合のみ、自分の devDependencies に
  typescript を追加すること


### 次のリリース — `ksk-ds lint` の severity 語彙が `warn` → `warning` に統一（要確認）

`--format json` の `results[].severity` と text 出力の severity 表記が、これまで
`"warn"` と `"warning"` で不統一だった（contract の `contracts/rules.json` は
`"warning"`、CLI 出力は `"warn"`）。**CLI 出力側を `"warning"` に揃えた**（issue #406）。

CI で JSON をフィルタしている場合は置き換えが必要:

```bash
# before
jq '[.results[] | select(.severity == "warn")] | length'
# after
jq '[.results[] | select(.severity == "warning")] | length'
```

text 出力の要約行も `0 error / 3 warn` → `0 error / 3 warning` に変わる。

あわせて `ksk-ds lint` に次を追加した:

- `--strict` … warning があれば exit 1
- `--max-warnings N` … warning が N 件を超えたら exit 1
- **未知のオプションはエラー終了**（従来は黙って捨てられ、CI に書いた
  `--strict` が無言で効かないまま緑になっていた）

### 次のリリース — `ksk-ds lint` の escape がルール単位・行単位で書けるようになった

ファイル全体・全ルールを無期限に外す `// ksk-ds-allow-custom-ui: 理由` は
後方互換で残るが**非推奨**。新規はルール単位を使う（issue #405）:

```tsx
// ksk-ds-lint-ignore P008 -- ブランドロゴの規定色のため     ← 直下 2 行以内に効く
// ksk-ds-lint-ignore-file P008 -- ブランド定数ファイル      ← そのファイル全体・P008 のみ
```

理由は **5 文字以上が必須**。空虚な理由は `ESCAPE001` / `ESCAPE002` として報告され、
ignore は効かない。あわせて escape マーカーは**文字列リテラルの中では発火しなくなった**
（ドキュメント URL に `ksk-ds-allow-custom-ui` が含まれるだけで lint 全体が黙って
無効化されていた）。既に short な理由を書いていたファイルは lint が復活するので、
理由を書き足すか違反を直すこと。

### 次のリリース — 自動生成物と DS 自身のトークン CSS を lint 対象外にした

- 先頭 12 行に自動生成マーカー（`AUTO-GENERATED` / `DO NOT EDIT` / `自動生成` 等）を
  持つファイルは全ルールを skip する（issue #408）。直す先は生成物ではなく生成元。
- P049（product theme の無許可上書き）は、DS 自身 / ベンダリングされた DS の
  トークン定義 CSS を対象外にする（issue #407）。`vendor/ksk-design-system/**` のように
  DS を再梱包しているリポで P049 が大量に出ていたのが解消する。

### 次のリリース — `Footer` の `paymentIcons` 既定値が空になった（挙動変更）

`Footer` は `paymentIcons` を省略すると `["VISA", "Master", "JCB", "AmEx", "PayPay", "LINE Pay"]`
の決済バッジを既定で描画していた。EC 以外のプロダクトでも「取り扱っていない決済手段」が
出てしまうため、**既定値を `[]`（非表示）に変更**した。

従来の表示を維持したい場合は明示的に渡す:

```tsx
<Footer
  paymentIcons={["VISA", "Master", "JCB", "AmEx", "PayPay", "LINE Pay"]}
  copyright="© 2026 KSK Inc."
/>
```

`paymentIcons` を明示的に渡していた箇所は影響なし。

### 次のリリース — `postinstall` による AI ルールファイル自動設置を廃止（要確認）

これまで `npm install ksk-design-system` の `postinstall` フックが、消費側の
プロジェクトルートに `CLAUDE.md` / `AGENTS.md`（`node_modules` 内の DS ルールを指す
薄いポインタ）を自動設置していた。**この自動設置を廃止し、明示コマンドに一本化した。**

```bash
npx ksk-ds init          # 設置（既存ファイルはスキップ）
npx ksk-ds init --force  # 既存ファイルを最新テンプレートで上書き
```

**既に設置済みの消費リポは対応不要。** 元々 `postinstall` は既存ファイルを上書きしない
仕様だったため、設置済みのプロジェクトでは実質 no-op だった。影響を受けるのは
**新規に DS を導入するプロジェクトの初回だけ**で、`npm install` の後に上記を 1 回実行する。

廃止の理由は、install 時にプロジェクトルートへ AI エージェント向け指示ファイルを書き込む
挙動が、サプライチェーン検査で「同意なき AI エージェント制御面の設置」として Critical 判定
されるため。LPM Firewall が 1.49.2 / 1.51.1 をこの理由でブロック判定しており、
`postinstall` を持つ限りバージョンを上げても判定が引き継がれる。あわせて
`INIT_CWD` 参照も削除し、書き込み先はコマンドを実行したディレクトリに固定した。

### 次のリリース — PillToggle の onChange/onValueChange 統一（破壊変更なし）

`PillToggle` のみ他コンポーネント（Switch 等の native 系を除く）と異なり `onValueChange`
を主 API として案内していたため、`onChange` に統一した（issue #264⑥）。
`onValueChange` は非推奨エイリアスとして両対応するため、**既存コードの書き換えは不要**。

```tsx
// Before（引き続き動作するが非推奨）
<PillToggle options={options} value={value} onValueChange={setValue} />

// After（推奨）
<PillToggle options={options} value={value} onChange={setValue} />
```

`onChange` と `onValueChange` を両方渡した場合は `onChange` が優先される。
`onValueChange` は将来のメジャーバージョンで削除予定。

### 次のリリース — Tailwind 4.1 以上が必要（要確認）

preset に DS 内部ユーティリティの safelist（`src/styles/source-safelist.css`・自動生成）を同梱した（issue #258）。
これにより、消費側の `@source ".../ksk-design-system/dist"` の設定漏れやパスずれで
DS 内部クラスの CSS が生成されず消費側でだけ壊れる問題（#132/#134/#138/#143）が構造的に解消する。

safelist は **Tailwind 4.1 で導入された `@source inline()`** を使うため、
peerDependencies を `tailwindcss@^4.0.0` → `^4.1.0` に引き上げた。
API の破壊変更はないが、Tailwind 4.0.x のままだと preset の読み込みに失敗する:

```bash
# DS を上げる前に Tailwind を先に上げる
npm install -D tailwindcss@^4.1
```

`@source` の記述は引き続き推奨（消費側自身のコードは消費側の走査対象のため）。

### v1.34.0 — パッケージ名変更（要対応）＋ RN/Expo 対応

**npm パッケージ名を `@ksk/design-system` → `ksk-design-system` に変更**（npm スコープ除去・OSS 公開準備）。機能面の破壊はないが、**import の一括置換が必要**:

- TS/JS: `from "@ksk/design-system"` → `from "ksk-design-system"`
- CSS: `@import "@ksk/design-system/preset"` → `@import "ksk-design-system/preset"`（`/themes/*` も同様）
- 依存名: package.json の `@ksk/design-system` → `ksk-design-system`（vendoring の tgz 差し替え時）

消費リポでの一括置換例:

```bash
git grep -lz '@ksk/design-system' -- src \
  | xargs -0 sed -i '' 's#@ksk/design-system#ksk-design-system#g'
```

あわせて追加（いずれも破壊変更なし）:

- **RN/Expo 対応**: `ksk-design-system/native`（解決済みトークン）と `ksk-design-system/native/ui`（RN コンポーネント）を新設
- **CheckboxField** コンポーネント追加
- 角丸トークンに `md`(6px) / `xl`(12px) を許可セットへ追加

### v1.16.0 (予定)

新機能追加のみ・破壊変更なし:

- **Button** に `inverse` / `ghost-inverse` バリアント追加
- **Button** に `hero` サイズ追加
- **Checkbox** に `label` / `description` / `count` props 追加（polymorphic 化）
- **Alert** に prop ベース API 追加（`title` / `description` / `icon` / `action`）
- **Chip** に `soldOut` / `count` / `href` 状態追加
- **Storybook** で autodocs グローバル化、guidelines.mdx 追加
- **scripts/check-deps.sh** で ui → patterns 階層の逆依存を CI でブロック
- **Vitest** 最小導入 + backwards-compat スイート
- 全コンポーネントに `data-slot` / `data-variant` / `data-size` を徹底
- **preset.css**: Tailwind v4 の `currentColor` 既定対策として、border-color / outline-color のベースレイヤ保険を追加。`@import "ksk-design-system/preset"` するだけで有効。破壊変更なし — 明示色を持つ枠線は不変で、色未指定の枠線のフォールバックのみ `--border` / `--ring` に固定される（消費側で枠線が黒ずむ不具合を防止）

何もしなくても既存コードはそのまま動く。

### v1.15.x

過去の minor / patch 履歴は GitHub Releases を参照。

---

## 移行作業の進め方

### Step 1. Codemod を dry-run

```bash
npx ksk-design-system codemod vX-to-vY ./src --dry
```

書き換え対象ファイル一覧が表示される。

### Step 2. 実際に適用

```bash
npx ksk-design-system codemod vX-to-vY ./src
git diff
```

`git diff` で意図通りか確認。

### Step 3. ESLint で残骸チェック

`eslint.config.js` に:

```js
import kskDeprecated from "ksk-design-system/eslint/deprecated"

export default [
  {
    plugins: { "ksk-deprecated": kskDeprecated },
    rules: { "ksk-deprecated/no-deprecated": "error" },
  },
]
```

これで codemod が拾えなかった旧 API の使用を検出できる。

### Step 3.5. 非推奨 API の残存を数える

```bash
npx ksk-ds check-migration ./src
```

`contracts/deprecations.json` の非推奨 API が何件残っているかを、識別子別・ファイル別に出す
（read-only・残件があれば exit 1 なので CI にも置ける）。

### Step 4. 動作確認

```bash
npm run test
npm run build
```

それから本番デプロイへ。

## 関連

- [UPDATING.md](./UPDATING.md) — 消費側（DS を npm 依存に持つプロジェクト）向けのアップデート手順（バージョンの読み方・PR 作業手順）
