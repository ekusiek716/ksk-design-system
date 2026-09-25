import React, { useState } from 'react'
import { Keyboard, Platform, ScrollView, View, useWindowDimensions } from 'react-native'
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context'
import { ThemeProvider, useTheme } from '../../src/native/theme/ThemeProvider'
import { SafeAreaInsetsProvider } from '../../src/native/theme/SafeAreaInsetsProvider'
import { Button } from '../../src/native/components/Button'
import { Input } from '../../src/native/components/Input'
import { Text } from '../../src/native/components/Text'
import { Stack } from '../../src/native/components/Stack'
import { Sheet } from '../../src/native/components/Sheet'
import { KeyboardAwareSheetFooter } from '../../src/native/components/KeyboardAwareSheetFooter'

function Review() {
  const insets = useSafeAreaInsets()
  const { fontScale, width, height } = useWindowDimensions()
  const { theme, scales, mode, toggleMode } = useTheme()
  const [open, setOpen] = useState(false)
  const [values, setValues] = useState(['', '', '', '', '', ''])
  const [saved, setSaved] = useState(false)
  const space = scales.spacing.scale[4]
  return <SafeAreaInsetsProvider insets={insets}>
    <View style={{ flex: 1, backgroundColor: theme.surface.primary, paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <ScrollView contentContainerStyle={{ padding: space, gap: space }}>
        <Text variant="heading.md" accessibilityRole="header">実OSの表示・操作確認</Text>
        <Text>この画面は検証用です。保存はこの画面内だけで、外部へ送信しません。</Text>
        <Text>OS: {Platform.OS} / {String(Platform.Version)}　画面: {Math.round(width)} × {Math.round(height)}　文字倍率: {fontScale.toFixed(2)}</Text>
        <Text>Safe area 上: {insets.top} / 下: {insets.bottom}</Text>
        <Button variant="secondary" onPress={toggleMode}>{mode === 'light' ? 'ダーク表示にする' : 'ライト表示にする'}</Button>
        <Text variant="heading.sm" accessibilityRole="header">文字拡大と折り返し</Text>
        <Text>端末のアクセシビリティ設定で文字を最大まで拡大してください。日本語の長い説明文が途中で欠けず、下の操作へスクロールできることを確認します。</Text>
        <Button onPress={() => { setSaved(false); setOpen(true) }}>入力とシートを確認する</Button>
        <Text accessibilityLiveRegion="polite">{saved ? '入力内容をこの画面内に保存しました。' : '未保存'}</Text>
        <Text>確認順: シートを開く → 最後の項目へ入力 → キーボードを閉じる → 上下にドラッグ → 閉じて再表示。</Text>
        <Text>VoiceOver / TalkBackでも、項目名と閉じる操作を確認してください。</Text>
      </ScrollView>
    </View>
    <Sheet open={open} onClose={() => setOpen(false)} title="申込内容" snapPoints={[0.5, 0.9]} initialSnap={0.9} safeArea footer={<KeyboardAwareSheetFooter behavior="fixed"><Stack gap={2} style={{ flex: 1 }}>
      <Button variant="secondary" onPress={() => Keyboard.dismiss()}>キーボードを閉じる</Button>
      <Button onPress={() => { Keyboard.dismiss(); setSaved(true); setOpen(false) }}>入力内容を保存する</Button>
      <Button variant="secondary" onPress={() => setOpen(false)}>シートを閉じる</Button>
    </Stack></KeyboardAwareSheetFooter>}>
        <Stack gap={4}>
          <Text>最初と最後の入力欄をタップし、ソフトキーボード表示中も入力欄と操作へ到達できるか確認してください。</Text>
          {values.map((value, index) => <Stack key={index} gap={2}>
            <Text>項目 {index + 1}</Text>
            <Input accessibilityLabel={`項目 ${index + 1}`} value={value} onChangeText={next => setValues(current => current.map((item, i) => i === index ? next : item))} placeholder="入力してください" />
          </Stack>)}
        </Stack>
    </Sheet>
  </SafeAreaInsetsProvider>
}
export default function App() {
  return <SafeAreaProvider><ThemeProvider><Review /></ThemeProvider></SafeAreaProvider>
}
