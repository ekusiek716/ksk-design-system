# KSK Design System Native Recipes

Native / Expo consumer は、新規 UI を作る前に `ksk-design-system/native/ui` の既存コンポーネントを確認してください。ローカル `ds/` に独自 wrapper を増やす前に、`src/native/COMPONENT_LOOKUP.md` とこのファイルの recipe を使います。

## Tailwind バージョンの前提

`tailwindcss` の peer 範囲は `^3.4.17 || ^4.1.0` です（issue #296）。

- **Web consumer**: `preset.css` が Tailwind v4 構文（`@import "tailwindcss"`）前提のため **v4 系が必須**。3 系はインストールできても preset が機能しません。
- **Expo / NativeWind consumer**: NativeWind のコンパイラ都合で `^3.4.x` に固定して構いません。`native/ui` entrypoint は Tailwind 4 の機能を要求しないため、この組み合わせが公式サポート範囲です。peer 範囲から 3 系を落とすと consumer の `npm install` が壊れるので、範囲は `__tests__/native-package-contract.test.ts` で契約として固定しています。

## Component lookup

RN 側の公開 export 一覧は `src/native/COMPONENT_LOOKUP.md` で確認できます。Web 側の `src/components/COMPONENT_LOOKUP.md` と同じく、consumer 実装前の DS-first チェックに使います。

```tsx
import { Button, Screen, PhotoHero } from "ksk-design-system/native/ui"
```

## Expo Router / React Navigation bottom tabs

Expo Router の `<Tabs>` では `createExpoRouterTabBar` を渡します。アイコンは各 screen の `tabBarIcon` をそのまま使えるため、consumer 側で floating tab bar を組み直す必要はありません。

```tsx
import { Tabs } from "expo-router"
import { createExpoRouterTabBar } from "ksk-design-system/native/ui"

const tabBar = createExpoRouterTabBar({
  glass: true,
  floating: true,
  keyboardBehavior: "hide",
  hiddenRouteNames: ["modal"],
})

export default function Layout() {
  return (
    <Tabs tabBar={tabBar}>
      <Tabs.Screen name="index" options={{ title: "ホーム" }} />
      <Tabs.Screen name="settings" options={{ title: "設定" }} />
      <Tabs.Screen name="modal" options={{ href: null }} />
    </Tabs>
  )
}
```

個別画面で tab bar を隠す場合は `options={{ tabBarStyle: { display: "none" } }}` を使います。画面をルーティング対象から隠す場合は Expo Router の `href: null` を使います。

React Navigation でも同じ factory を `tabBar` に渡せます。

```tsx
<Tab.Navigator tabBar={createExpoRouterTabBar({ glass: true, floating: true })}>
  {/* screens */}
</Tab.Navigator>
```

## iOS 26 Liquid Glass

`GlassView` は `expo-glass-effect` が使える iOS 26 環境では native Liquid Glass を使い、未導入または非対応環境では `expo-blur`、最後に tokenized surface へフォールバックします。

```bash
npx expo install expo-glass-effect expo-blur
```

```tsx
import { GlassView } from "ksk-design-system/native/ui"

<GlassView
  nativeGlass
  fallback="blur"
  glassEffectStyle="regular"
  tint="system"
  intensity="regular"
  borderRadius={28}
  interactive
>
  {/* tab bar, composer, floating action surface */}
</GlassView>
```

`nativeGlass` を有効にしても Android / web / 非対応 iOS では自動で fallback します。feature check が必要な場合は `isNativeLiquidGlassAvailable()` を使います。

## Button loading and icon slots

Native `Button` は `loading`、`loadingLabel`、`leadingIcon`、`trailingIcon` を持ちます。loading 中は disabled 扱いになり、`ActivityIndicator` は `Text` に包まれません。

```tsx
<Button
  variant="primary"
  loading={saving}
  loadingLabel="保存中"
  leadingIcon={<SaveIcon />}
  onPress={save}
>
  保存する
</Button>
```

## Mobile app shell

`MobileAppShell` は header / main / bottom nav / global FAB / desktop sidebar の基本 geometry を DS 側に寄せる recipe です。consumer 側で main padding や fixed nav の重なりを毎回計算しません。

```tsx
import {
  BottomTabBar,
  MobileAppShell,
  MobileFloatingActionButton,
} from "ksk-design-system/native/ui"

<MobileAppShell
  header={<AppHeader title="Belle" />}
  bottomNav={<BottomTabBar items={items} glass />}
  fab={<MobileFloatingActionButton label="追加" onPress={openCreate} />}
>
  <HomeScreen />
</MobileAppShell>
```

Web/PWA consumer は `ksk-design-system` の `MobileAppShell` と `BottomTabBar variant="pill"` / `MobileFloatingActionButton` を組み合わせます。`bottomNavMode="fixed"` では shell が fixed wrapper と safe-area padding を持ちます。既に fixed な nav を渡す場合は `bottomNavMode="external"` を指定します。

### Liquid Glass の FAB

写真・地図・リストの上に FAB を浮かせるときは `variant="glass"` を使います。`GlassView` にブランド色をほぼ不透明（light 95%）で敷いた Liquid Glass で、web の `Button variant="glass-accent"` と同じ質感です。塗り・縁・上辺ハイライトの色は `src/native/glass-accent-fill.ts` の純関数がテーマの `brand.primary` から導出するので、テーマを差し替えれば自動で追従します。

```tsx
<MobileFloatingActionButton label="追加" variant="glass" onPress={openCreate} />
```

- 既定は `variant="default"`（ブランド色のソリッド塗り）。既存画面の見た目は変わりません。
- 塗りを薄くしないでください。低透明度ティントにすると明るい背景で白前景（`text.on-inverse`）が読めなくなります。
- `glass` に外側の `shadow` を重ねないでください。glass 側が縁・ハイライトを内包しており、影が二重になります。
- 実際のぼかしは `GlassView` の 4-tier（iOS 26 Liquid Glass → expo-blur → RN Web の backdrop-filter → 半透明 surface）に従います。Android / optional peer 未導入でも塗りは成立します。

## Fullscreen screen / photo onboarding

`Screen` は header / internal scroll body / footer CTA の骨組みです。写真背景のオンボーディングや入口画面は `PhotoHero` の compound slots を使います。consumer 側で safe-area footer や写真上 typography を再実装しません。

```tsx
import { Button, PhotoHero, Screen } from "ksk-design-system/native/ui"

<Screen scroll={false} padding="none">
  <PhotoHero src={{ uri: heroUrl }} overlay="dark" align="bottom">
    <PhotoHero.Eyebrow>WELCOME</PhotoHero.Eyebrow>
    <PhotoHero.Title>今日の準備を始める</PhotoHero.Title>
    <PhotoHero.Body>写真の上でも読める DS typography と overlay をまとめて扱います。</PhotoHero.Body>
    <PhotoHero.Actions>
      <Button variant="glass" onPress={start}>始める</Button>
    </PhotoHero.Actions>
  </PhotoHero>
</Screen>
```

## Media action cluster

動画・写真上の Like / Share / Save などの操作群は `MediaActionCluster` を使います。`position="fixed"` は RN では absolute と同等に扱い、`href` は `Linking.openURL` に委譲します。

```tsx
<View style={{ flex: 1 }}>
  <PhotoHero src={{ uri: mediaUrl }} overlay="medium">
    <MediaActionCluster
      anchor="bottom-right"
      items={[
        { label: "いいね", icon: <HeartIcon />, active: liked, onPress: toggleLike },
        { label: "シェア", icon: <ShareIcon />, onPress: share },
      ]}
    />
  </PhotoHero>
</View>
```

## Settings screens

設定画面は `SettingsSection` と `SettingsListRow` を使います。`Card + SectionHeader + ListItem` のローカル wrapper を consumer 側で複製しないでください。

```tsx
<SettingsSection title="通知" variant="card">
  <SettingsListRow title="プッシュ通知" rightSlot={<Switch value={enabled} />} />
  <SettingsListRow title="通知時間" description="毎日 9:00" rightSlot={<Badge>ON</Badge>} />
</SettingsSection>
```

## Attachments

Web では `CompactFilePicker` / `ImageAttachmentPicker` が hidden file input、trigger、preview、remove affordance を持ちます。Native では DocumentPicker / ImagePicker の起動だけ consumer が渡し、trigger と preview は DS が持ちます。

```tsx
<ImageAttachmentPicker
  multiple
  images={images}
  onFilesChange={setFiles}
  onRemove={removeImage}
/>
```

## Bottom sheet frames

`BottomSheetFrame` は `SheetContent` の外枠 preset です。中身は `DetailSheetScaffold` と `KeyboardAwareSheetFooter` をそのまま組み合わせます。

```tsx
<Sheet open={open} onOpenChange={setOpen}>
  <BottomSheetFrame preset="mobile-form">
    <DetailSheetScaffold header={<DetailSheetHeader title="編集" />} footer={<KeyboardAwareSheetFooter />}>
      {/* fields */}
    </DetailSheetScaffold>
  </BottomSheetFrame>
</Sheet>
```

## Caption / attribution text

出典・著作権表示など、控えめな注釈は `Text` の `variant="caption-strong"` を使います（11px・font-semibold 相当）。`text-[11px] font-semibold leading-4 text-hint` のようなマジックナンバーをローカルに書きません。色は未指定なら自動で hint 相当（`text.low-emphasis`）になります。

```tsx
import { Text } from "ksk-design-system/native/ui"

{citationOf(question) && (
  <Text variant="caption-strong" style={{ marginTop: 12 }}>
    {citationOf(question)}
  </Text>
)}
```

通常の注釈（強調不要）には既存の `variant="caption"`（11px・通常ウェイト）を使います。

## Masked / teaser progress bars

未課金ユーザー向けのティザー表示など、実データを見せたくない進捗バーは `Progress` の `masked` を使います。`masked=true` の間はバー幅・色ともに `value`/`autoColor` を無視し固定表示になるため、幅から実データを逆算されません。

```tsx
import { Progress, Text } from "ksk-design-system/native/ui"

<Text variant="body.sm">{masked ? "🔒 ??%" : `${accuracy}%（${correct}/${answered}）`}</Text>
<Progress value={accuracy} masked={masked} />
```

Web 版 `Progress`（`ksk-design-system` の `Progress`）にも同じ `masked` prop があります。

## Static document viewer (privacy policy / terms)

プライバシーポリシー・利用規約などの静的文書画面は `DocumentScreen` + `Prose` を使います。見出し・本文・最終更新日・戻るヘッダのタイポとスペーシングは DS 側で一元管理されるため、consumer は `sections` の原稿データだけ持てば済みます。

```tsx
import { DocumentScreen, Prose } from "ksk-design-system/native/ui"

const POLICY_SECTIONS = [
  { title: "個人情報の取得", body: ["本アプリは以下の情報を取得します。", "…"] },
  { title: "個人情報の利用目的", body: ["取得した情報は次の目的で利用します。"] },
]

<DocumentScreen title="プライバシーポリシー" lastUpdated="2026年7月7日" onBack={() => navigation.goBack()}>
  <Prose sections={POLICY_SECTIONS} />
</DocumentScreen>
```

## Tappable icon buttons

押せる円形/角丸アイコンは `IconButton` を使います。`IconBadge` は装飾専用（非タップ）なので、ヘッダの設定ギア・カード右上の閉じる・一覧行のアクションを `Button` + `containerStyle` で自作しないでください。Web 側の相当物は `<Button size="icon">` です。

`accessibilityLabel` は必須（型で強制）。視覚サイズが 44pt 未満の `size="sm"` でも、実タップ領域は `hitSlop` で 44pt 以上が確保されます。`icon` に関数を渡すと variant/tone/size から解決済みの色とサイズを受け取れるため、consumer 側で色をハードコードしません。

```tsx
import { IconButton } from "ksk-design-system/native/ui"

// ヘッダの設定ギア（薄いサーフェス背景）
<IconButton
  accessibilityLabel="設定"
  variant="tertiary"
  size="sm"
  icon={({ color, size }) => <SettingIcon color={color} size={size} />}
  onPress={() => navigation.navigate("Settings")}
/>

// カード右上の閉じる（地の上、背景なし）
<IconButton
  accessibilityLabel={`${offer.title}の提案を閉じる`}
  variant="ghost"
  icon={({ color, size }) => <CloseIcon color={color} size={size} />}
  onPress={dismiss}
/>
```

`variant` は `ghost`（既定・背景なし）/ `tertiary`（薄いサーフェス背景）/ `outline`（境界線）/ `primary`（ブランド色の塗り）で、名前は `Button` の variant 語彙に揃えています。`tone` は `neutral` / `accent` / `caution`（`primary` では無視）、`shape` は `circle`（既定）/ `square` です。

## Controlled disclosure (Collapsible / Accordion)

`Collapsible` と `Accordion` は制御・非制御の両対応です。外部 state（他セクションとの排他、解答表示との連動、アナリティクス送信）と同期したいときは `open` / `openKeys` を渡します。渡している間は内部 state を無視するため、二重管理になりません。

トグル右端の `trailing` スロットは開閉状態を受け取る関数も渡せるので、「表示する / 閉じる」のラベル切り替えを consumer 側で自作しなくて済みます。

```tsx
import { Accordion, Collapsible } from "ksk-design-system/native/ui"

const [open, setOpen] = useState(false)

<Collapsible
  title="他の選択肢はなぜ違う？"
  open={open}
  onOpenChange={setOpen}
  trailing={(isOpen) => (isOpen ? "閉じる" : "表示する")}
>
  <Text variant="body.md">{otherWrongChoices.map((c) => c.whyWrong).join("\n")}</Text>
</Collapsible>

<Accordion
  type="multiple"
  openKeys={openSections}
  onOpenChange={setOpenSections}
  items={[
    { key: "field", title: "分野別の正答率", content: <Text variant="body.md">分野別の内訳</Text>, trailing: (o) => (o ? "閉じる" : "表示する") },
  ]}
/>
```

`defaultOpen` / `defaultOpenKeys` だけを渡した場合は従来どおり非制御で動きます。

## Composed accessibility labels

`ListItem` / `ActionTile` / `EmptyState` / `ErrorState` は `AccessibilityProps` を継承しているため、`accessibilityLabel` / `accessibilityHint` をそのまま渡せます。「タイトル＋状態」を合成した読み上げラベル（例: 「模試2（要解放）」）を付けたいときに使います。

```tsx
<ListItem
  title="模試2"
  description="未受験"
  accessibilityLabel="模試2（要解放）"
  accessibilityHint="タップで解放画面へ移動します"
  onPress={openPaywall}
/>
```

`EmptyState` / `ErrorState` では、ラベル指定時に icon / title / description だけが1要素にまとまり、`action` のボタンは個別にフォーカスできる位置に残ります。

## Japanese calendars

`Calendar` は日本のカレンダー慣習に必要な表現を prop で持ちます。曜日の色分け（日=赤 / 土=青）は既存の見た目を変えないよう opt-in（`weekendTone`）です。

```tsx
import { Calendar } from "ksk-design-system/native/ui"

<Calendar
  value={examDate}
  onChange={setExamDate}
  weekendTone           // 日=赤 / 土=青
  todayEmphasis="dot"   // "ring"（既定）| "dot" | "none"
  disablePast           // 今日より前を選択不可（minDate と併用時は遅い方が効く）
  dayAccessibilityLabel={(day) =>
    `${day.date.getFullYear()}年${day.date.getMonth() + 1}月${day.date.getDate()}日を受験日に設定`
  }
/>
```

セルの見た目を丸ごと差し替えたい場合は `renderDay` を使います。`renderDay` は `{ date, weekday, selected, today, disabled, tone }` を受け取ります（タップ・読み上げ・選択不可制御は DS 側が持ったままです）。月移動ボタンは `minDate` / `maxDate` / `disablePast` の範囲外へは自動で disabled になります。

### ブランド色を注入する（ThemeProvider を使わない consumer 向け）

`ThemeProvider` を使わず、アプリごとのブランドトークンを props で流し込む設計（exam-kit 系が app/theme/brand.ts から各コンポーネントへ色を渡している方式）では、`colors` で日セルの色だけを差し替えられます。指定しなかったキーは DS theme の既定色に落ちるので、既存の呼び出しは見た目が変わりません。

```tsx
<Calendar
  value={examDate}
  onChange={setExamDate}
  weekendTone
  colors={{
    selected: brand.primary,        // 選択セルの背景
    selectedText: brand.onPrimary,  // 選択セルの文字
    today: brand.accent,            // today リング / ドット
    sunday: brand.caution,          // weekendTone=true のときだけ効く
    saturday: brand.primary,
  }}
/>
```

`colors` で足りない見た目（角丸・枠線の太さ・影など）は `dayStyle` で器ごと差し替えます。DS の既定 style の**後ろに**合成されるので確実に勝ちます。

```tsx
<Calendar
  dayStyle={(day) => (day.selected ? { borderRadius: 8, borderWidth: 2, borderColor: brand.primary } : null)}
/>
```

`renderDay` がセルの「中身」、`dayStyle` がセルの「器」です。色だけなら `colors` で足ります。
