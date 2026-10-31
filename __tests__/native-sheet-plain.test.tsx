import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { Sheet } from "../src/native/components/Sheet"
import { SafeAreaInsetsProvider } from "../src/native/theme/SafeAreaInsetsProvider"
import { ThemeProvider } from "../src/native/theme/ThemeProvider"

// RN hosts only are replaced: the real Sheet (plain mode = snapPoints なし) runs
// and the props each host receives are captured.
const hosts = vi.hoisted(() => ({
  platform: { OS: "ios" as string },
  pressables: [] as { onPress?: () => void }[],
  keyboardAvoiders: [] as Record<string, unknown>[],
  animatedStyles: [] as Record<string, unknown>[],
}))

vi.mock("react-native", () => {
  class Value {
    interpolate() {
      return 0
    }
    setValue() {}
    stopAnimation() {}
  }
  const passthrough = ({ children }: { children?: React.ReactNode }) => <>{children}</>
  return {
    Animated: {
      Value,
      View: ({ children, style }: { children?: React.ReactNode; style?: Record<string, unknown> }) => {
        hosts.animatedStyles.push(style ?? {})
        return <>{children}</>
      },
      timing: () => ({ start: () => {} }),
    },
    Dimensions: { get: () => ({ width: 402, height: 874 }) },
    Easing: { out: () => () => 0, cubic: () => 0 },
    Modal: passthrough,
    KeyboardAvoidingView: ({ children, ...props }: { children?: React.ReactNode }) => {
      hosts.keyboardAvoiders.push(props)
      return <>{children}</>
    },
    Keyboard: { addListener: () => ({ remove: () => {} }) },
    TextInput: { State: {} },
    Platform: hosts.platform,
    PanResponder: { create: () => ({ panHandlers: {} }) },
    Pressable: (props: { onPress?: () => void; children?: React.ReactNode }) => {
      hosts.pressables.push({ onPress: props.onPress })
      return <>{props.children}</>
    },
    ScrollView: passthrough,
    Text: passthrough,
    View: passthrough,
  }
})

beforeEach(() => {
  hosts.platform.OS = "ios"
  hosts.pressables = []
  hosts.keyboardAvoiders = []
  hosts.animatedStyles = []
})

function render(node: React.ReactElement) {
  return renderToStaticMarkup(<ThemeProvider>{node}</ThemeProvider>)
}

describe("native Sheet plain mode — dismissible (#823)", () => {
  it("dismissible={false} なら背景（scrim）を押しても onClose を呼ばない", () => {
    const onClose = vi.fn()
    render(
      <Sheet open onClose={onClose} dismissible={false}>
        <span>本文</span>
      </Sheet>,
    )
    // 先頭の Pressable が全面の背景（scrim）
    const scrim = hosts.pressables[0]
    scrim.onPress?.()
    expect(onClose).not.toHaveBeenCalled()
  })

  it("dismissible を省略したら従来どおり背景タップで閉じる", () => {
    const onClose = vi.fn()
    render(
      <Sheet open onClose={onClose}>
        <span>本文</span>
      </Sheet>,
    )
    hosts.pressables[0].onPress?.()
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})

// #791: snapPoints なしの通常版にキーボード回避が無く、iOS で入力欄と送信ボタンが
// キーボードの裏に入った（BottomSheetForm / スマホ幅の ResponsiveDialog / Combobox /
// ReviewOverlay がすべて通常版）。
describe("native Sheet plain mode — キーボード回避 (#791)", () => {
  const form = (side?: "bottom" | "top" | "left" | "right") => (
    <Sheet open onClose={() => {}} side={side} title="t">
      <span>入力欄</span>
    </Sheet>
  )

  it("iOS の side=bottom は KeyboardAvoidingView（padding）でパネルをキーボードの上に置く", () => {
    hosts.platform.OS = "ios"
    render(form())
    expect(hosts.keyboardAvoiders).toHaveLength(1)
    const kav = hosts.keyboardAvoiders[0]
    expect(kav.behavior).toBe("padding")
    expect(kav.enabled).toBe(true)
    // 余白部分のタップは背景（scrim）へ通す
    expect(kav.pointerEvents).toBe("box-none")
    expect(kav.style).toMatchObject({ flex: 1, justifyContent: "flex-end" })
  })

  it("Android は Modal が adjustResize 済みなので回避を無効にする（二重に引かない）", () => {
    hosts.platform.OS = "android"
    render(form())
    expect(hosts.keyboardAvoiders).toHaveLength(1)
    expect(hosts.keyboardAvoiders[0].enabled).toBe(false)
    expect(hosts.keyboardAvoiders[0].behavior).toBeUndefined()
  })

  it("side=top / left / right は従来どおり回避ラッパーを挟まない", () => {
    for (const side of ["top", "left", "right"] as const) {
      hosts.keyboardAvoiders = []
      render(form(side))
      expect(hosts.keyboardAvoiders).toHaveLength(0)
    }
  })

  it("キーボード分で収まらないときは bottom パネルが縮み、本文の ScrollView に高さを譲る", () => {
    render(form())
    const panel = hosts.animatedStyles[0]
    expect(panel.flexShrink).toBe(1)
  })

  it("縮んだパネルがステータスバーの下に潜らないよう上端に safe-area 分を空ける", () => {
    render(
      <SafeAreaInsetsProvider insets={{ top: 62, bottom: 34 }}>{form()}</SafeAreaInsetsProvider>,
    )
    expect(hosts.keyboardAvoiders[0].style).toMatchObject({ paddingTop: 62 })
  })
})
