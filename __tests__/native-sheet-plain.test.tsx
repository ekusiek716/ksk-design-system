import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { Sheet } from "../src/native/components/Sheet"
import { ThemeProvider } from "../src/native/theme/ThemeProvider"

// RN hosts only are replaced: the real Sheet (plain mode = snapPoints なし) runs
// and the props each host receives are captured.
const hosts = vi.hoisted(() => ({
  platform: { OS: "ios" as string },
  pressables: [] as { onPress?: () => void }[],
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
      View: passthrough,
      timing: () => ({ start: () => {} }),
    },
    Dimensions: { get: () => ({ width: 402, height: 874 }) },
    Easing: { out: () => () => 0, cubic: () => 0 },
    Modal: passthrough,
    KeyboardAvoidingView: passthrough,
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
