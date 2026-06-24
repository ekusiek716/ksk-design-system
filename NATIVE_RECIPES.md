# KSK Design System Native Recipes

Native / Expo consumer は、新規 UI を作る前に `ksk-design-system/native/ui` の既存コンポーネントを確認してください。ローカル `ds/` に独自 wrapper を増やす前に、このファイルの recipe を使います。

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
