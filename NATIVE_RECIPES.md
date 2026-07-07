# KSK Design System Native Recipes

Native / Expo consumer は、新規 UI を作る前に `ksk-design-system/native/ui` の既存コンポーネントを確認してください。ローカル `ds/` に独自 wrapper を増やす前に、`src/native/COMPONENT_LOOKUP.md` とこのファイルの recipe を使います。

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
