import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

/**
 * native SwipeRow の支援技術向け既定値（issue #342）。
 *
 * PanResponder によるドラッグ開閉は VoiceOver / TalkBack から実行できず、
 * rightActions へ到達する手段が無かった。RN のレンダリングテスト基盤が
 * リポジトリに無いため、native-chip-a11y と同じソーススキャン方式で
 * 「既定値を持つ実装であること」を契約として固定する。
 */
const swipeRowSource = readFileSync(
  join(__dirname, "..", "src/native/components/SwipeRow.tsx"),
  "utf8",
)

describe("SwipeRow の a11y 既定値（#342）", () => {
  it("rightActions から accessibilityActions を自動生成する", () => {
    expect(swipeRowSource).toContain("const defaultAccessibilityActions: AccessibilityActionInfo[] = rightActions.map((a) => ({")
    expect(swipeRowSource).toContain("name: a.label,")
  })

  it("onAccessibilityAction の既定ハンドラが actionName で対象アクションの onPress を呼ぶ", () => {
    expect(swipeRowSource).toContain("const defaultOnAccessibilityAction = (event: AccessibilityActionEvent) => {")
    expect(swipeRowSource).toContain("rightActions.find((a) => a.label === event.nativeEvent.actionName)")
  })

  it("行本体（Animated.View）に accessibilityActions / onAccessibilityAction の既定を適用する", () => {
    expect(swipeRowSource).toContain("accessibilityActions={")
    expect(swipeRowSource).toContain("accessibilityActions ?? defaultAccessibilityActions")
    expect(swipeRowSource).toContain("onAccessibilityAction ?? defaultOnAccessibilityAction")
  })

  it("呼び出し側が accessibilityActions / onAccessibilityAction を明示した場合はそちらを優先する", () => {
    expect(swipeRowSource).toMatch(/accessibilityActions\s*\?\?\s*defaultAccessibilityActions/)
    expect(swipeRowSource).toMatch(/onAccessibilityAction\s*\?\?\s*defaultOnAccessibilityAction/)
  })

  it("アクションの Pressable に accessibilityRole=button と既定ラベルを持つ", () => {
    expect(swipeRowSource).toContain('accessibilityRole="button"')
    expect(swipeRowSource).toContain("accessibilityLabel={a.accessibilityLabel ?? a.label}")
  })
})
