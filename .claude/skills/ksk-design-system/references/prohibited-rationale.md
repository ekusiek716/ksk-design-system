# 禁止パターン全43件＋AIアンチパターン10件 — なぜ禁止か

> 正規表現・excludes の正本は `contracts/rules.json`。本ファイルは各ルールの
> **rationale（防ぐ失敗）** を言語化した参照資料。ID は rules.json と対応。

## component — 生タグ・自作の禁止（P001–P007）

すべて同じ失敗を防ぐ: **生タグは DS のトークン・状態・a11y 実装を全部持っていない**。
生 `<button>` はフォーカスリング・disabled 表現・タッチターゲット 44px を欠き、
画面ごとに微妙に違うボタンが増殖して DS の意味が消える。

- **P001 `<button>`** → `<Button variant size>`。variant/size の語彙で意図が仕様化される
- **P002 `<input>`** → `<Input>`。高さ48px・border色・focus 実装込み
- **P003 `<textarea>`** → `<Textarea>`
- **P004 `<select>`** → `<Select><SelectItem>`。ネイティブ select はスタイル不能でOS毎に見た目が割れる
- **P005 `<table>`** → `DataTable`。生 table は CLS（レイアウトシフト）とスタイル崩れの実績あり
- **P006 `<a href>`** → `<Button variant="link">` または `<Button asChild><a>`。リンクの見た目が野良化するのを防ぐ
- **P007 `div.fixed.inset-0` 自作モーダル** → `<Dialog>`/`<Sheet>`。自作はフォーカストラップ・ESC・スクロールロック・aria が全部欠落する（a11y 事故の定番）
- **P029 テンプレートリテラルで className 組み立て** → `cn()`/CVA。文字列連結は Tailwind の競合解決がされず、`false`/`undefined` が class 文字列に混入する

## color — 生値・非セマンティック色の禁止（P008–P010, P015, P018）

すべて同じ失敗を防ぐ: **マルチテーマ DS の生命線はセマンティック層経由**。
生値は Brand 差し替え（10行）とダークモード反転の両方から取り残される。

- **P008 生 `#hex`** → `var(--...)`。テーマ切替・dark 反転に追随しない死に色になる
- **P009 Tailwind 標準色（`bg-blue-500` 等）** → 同上。しかも「たまたま今のテーマと似た色」が選ばれるため、テーマを替えた瞬間だけ破綻して発見が遅れる
- **P010 `text-white` / `bg-white`** → `text-[var(--Text-on-Inverse)]` / `bg-[var(--Surface-Primary)]`。dark モードで白背景が残留する典型源
- **P015 `--Primitive-Brand` 直接使用** <!-- docs-drift-ignore: shade省略のファミリー名表記 --> → `var(--Brand-Primary)` 等。Primitive 直参照は「どの shade を使うか」の判断が画面ごとにバラけ、hover/active の段階設計（600/700/800）を破壊する
- **P018 `text-black`** → `text-[var(--Text-High-Emphasis)]`。純黒 #000 は DS に存在しない（最暗は Gray-900）。dark でも反転しない

## typography（P011, P016, P017）

- **P011 `text-[14px]` 直書き** → `typo-*`。サイズだけ合わせても line-height/weight/tracking が欠け、行間バラバラの画面になる
- **P016 `font-bold` 等の直書き** → `typo-*` に weight は内包済み。二重指定は typo クラス側の設計（例: label-sm は 500）と衝突する
- **P017 `tracking-tight`** → 禁止。英文デザインの真似で日本語に適用すると可読性が著しく落ちる。和文の letter-spacing は typo-* 側で最適化済み（見出し +0.04em）

## spacing / layout（P012, P019–P022, P028, P031）

- **P012 任意値スペーシング `p-[17px]`** → 4px グリッド外の値は隣接要素とリズムが合わず「1px ズレ」の温床。標準クラスのみ
- **P019 `rounded-3xl` 等の許可外角丸** → 許可7値（none/sm/md/lg/xl/2xl/full）のみ。場当たりの角丸は面/モーダル/シートの「丸さの階層」（8<24<32）を壊す
- **P020 Tailwind 標準 shadow（`shadow-md` 等）** → `var(--shadow-*)` 5段のみ。標準 shadow は DS の「影＋1px罫線で境界」設計より濃く、浮きすぎる
- **P021 `bg-gradient-to-`** → DS にグラデーション定義なし。AI が「それっぽさ」で入れる定番で、テーマ色と無関係な紫青グラデが混入する
- **P022 `z-[9999]`** → z-50 まで。z-index インフレは overlay 系（Dialog/Toast/Tooltip）の重なり順契約を破壊する
- **P028 インラインstyleの余白** → Tailwind クラス。style 属性は lint の検出網の外に逃げるため禁止
- **P031 固定デバイス幅 `w-[375px]`** → `w-full + max-w-*`。特定端末決め打ちは他端末で必ず破綻する

## theme / token（P032）

- **P032 色を併記しない `border`** → **実害あり（job board）**。Tailwind v4 で border 既定色が currentColor になったため、無色 border は消費側の濃色テキストを透過して黒ずむ。`border-[var(--Border-Low-Emphasis)]` を必ず併記。状態切替系は `border-transparent` ＋ `data-[state=active]:border-[...]` のペアで

## accessibility / form（P023–P027）

- **P023 `outline-none`** → フォーカスリング削除はキーボード利用者に「今どこにいるか」を消す WCAG 違反。`focus-visible:ring-[3px] ring-[var(--Focus-High-Emphasis)]/50` に置換
- **P024 `<div onClick>`** → キーボード・スクリーンリーダーから操作不能。`<Button>`
- **P025 `<img>` alt なし** → SR が読めない。装飾は `alt=""` を明示
- **P026 placeholder のみでラベル省略** → SR は placeholder を読まない。入力中に説明が消える。`<Label>` 必須
- **P027 メール欄に `type="text"`** → モバイルのメール用キーボードが出ない・ブラウザ検証が効かない

## ai-pattern / animation（P013, P014, P030）

- **P013 片側太ボーダー（`border-l-4`）** → AI 生成の定番「カラーバー」。DS の視覚言語（全周1px罫線＋Badge でステータス）と異質。全周ボーダー＋Badge に置換
- **P014 pravatar.cc** → 外部依存・不安定。DiceBear shapes を使用
- **P030 300ms 以上の duration** → 操作フィードバックが「もっさり」する。150/200ms 上限（motion 契約）

## component-adoption — ローカル再実装の禁止（P033–P043）

すべて同じ失敗を防ぐ: **DS に既にある合成パターンを画面側で手組みすると、
微妙に違う亜種が増えて後の全画面修正が地獄になる**（v1.41.1 のシート追従バグ修正のような
一括修正は、消費側が部品を使っている場合にだけ効く）。
例外を作るときは `ksk-ds-allow-custom-ui` コメントで理由を残す。

- **P033 Button 並べた自作 toggle** → `PillToggle`（2–4択）/ `Tabs`（5択+）/ `RadioGroup`
- **P034 一時的な操作結果を Banner 表示** → `toast.*`。Banner は持続状態用、トーストは瞬間フィードバック用という役割分担
- **P035 icon button の自作 utility class** → `<Button size="icon*" aria-label>`
- **P036 EmptyState CTA の className 手組み** → `actionLabel + actionLayout`
- **P037 SheetHeader + KebabMenu の手配置** → `<DetailSheetHeader trailing={...}>`。grid 契約なしで置くとケバブがズレる（実績あり）
- **P038 SettingsSection/ListRow の再実装** → DS の `<SettingsSection>` / `<SettingsListRow>`
- **P039 hidden file input + trigger の再実装** → `<CompactFilePicker>` / `<ImageAttachmentPicker>`
- **P040 ActionTile/QuickActionGrid の再実装** → DS 版を使用
- **P041 mobile bottom nav / FAB geometry の手書き CSS** → `<MobileAppShell>` + `<BottomTabBar>` + `<MobileFloatingActionButton>`。safe-area 対応が画面ごとに割れるのを防ぐ
- **P042 Bottom sheet の外枠 class recipe 手組み** → `<BottomSheetFrame preset>`
- **P043 Expo Router tabBar の再実装** → `createExpoRouterTabBar(...)` / `<LiquidBottomTabBar>`

## AIアンチパターン（AI1–AI10）

AI1–AI9 は上記 P013/P021/P019/P017/P020/P009/P015/P007 の再掲（AI が特に犯しやすい順の索引）。
**AI9（常時ループアニメ）**: `animate-spin/bounce/pulse` はローディング状態限定。静的 UI に常時動く要素を置かない。
**AI10（文脈非依存違反）**が固有で最重要:

> テキスト・背景・border の色を明示せず親の継承や currentColor に委ねると、
> 消費側が濃色テキスト・色付き背景を敷いた瞬間に枠線・アイコン・文字が化ける（job board で実際に発生）。
> コンポーネントは見た目を自前で固定する: テキスト要素に `text-[var(--Text-*)]`、
> サーフェスに `bg-[var(--Surface-*)]`＋`border-[var(--Border-*)]`。
> 検出: Storybook ツールバーの **Hostile ctx** を loud にして、マゼンタ化・背景透けが無いか目視。
