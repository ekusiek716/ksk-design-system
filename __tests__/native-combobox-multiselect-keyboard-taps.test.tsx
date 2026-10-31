/**
 * issue #815: native の Combobox / MultiSelect は、検索欄に文字を入れてソフトキーボードが
 * 出ている状態で候補を 1 回押すと、キーボードが閉じるだけで選ばれなかった。
 * 候補の FlatList に keyboardShouldPersistTaps の指定が無く、RN の ScrollView が
 * 「最初のタップはキーボードを閉じるだけ」に使っていたため。
 *
 * jest / vitest では ScrollView のタッチ捕捉が働かないので挙動そのものは再現できない。
 * ここでは候補の FlatList に keyboardShouldPersistTaps="handled" が渡ることを固定し、
 * 実機の確認手順は contracts/native-device-verification.json の keyboard 項目に置く。
 */
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { beforeEach, describe, expect, it, vi } from "vitest"

const captured = vi.hoisted(() => ({ flatLists: [] as Record<string, unknown>[] }))
vi.mock("react-native", async () => {
  const R = await import("react")
  const host = ({ children }: { children?: React.ReactNode }) => R.createElement(R.Fragment, null, children)
  return {
    View: host,
    Text: host,
    Pressable: host,
    TextInput: host,
    FlatList: (props: Record<string, unknown>) => {
      captured.flatLists.push(props)
      return null
    },
    useWindowDimensions: () => ({ width: 402, height: 874, scale: 3, fontScale: 1 }),
  }
})
// Sheet は Modal / Animated を使うため、中身をそのまま描く代用品にする（open に関係なく描く）
vi.mock("../src/native/components/Sheet", () => ({
  Sheet: ({ children }: { children?: React.ReactNode }) => children,
}))
vi.mock("../src/native/components/Input", () => ({ Input: () => null }))
vi.mock("../src/native/components/Button", () => ({ Button: () => null }))

import { Combobox } from "../src/native/components/Combobox"
import { MultiSelect } from "../src/native/components/MultiSelect"
import { ThemeProvider } from "../src/native/theme/ThemeProvider"

const options = [
  { value: "a", label: "東京" },
  { value: "b", label: "大阪" },
]

beforeEach(() => {
  captured.flatLists = []
})

describe("native の検索付き選択部品: キーボード表示中でも候補を 1 回で選べる (#815)", () => {
  it("Combobox の候補一覧は keyboardShouldPersistTaps=handled", () => {
    renderToStaticMarkup(
      <ThemeProvider>
        <Combobox options={options} onChange={() => {}} />
      </ThemeProvider>,
    )
    expect(captured.flatLists).toHaveLength(1)
    expect(captured.flatLists[0].keyboardShouldPersistTaps).toBe("handled")
  })

  it("MultiSelect の候補一覧は keyboardShouldPersistTaps=handled", () => {
    renderToStaticMarkup(
      <ThemeProvider>
        <MultiSelect options={options} onChange={() => {}} />
      </ThemeProvider>,
    )
    expect(captured.flatLists).toHaveLength(1)
    expect(captured.flatLists[0].keyboardShouldPersistTaps).toBe("handled")
  })
})
