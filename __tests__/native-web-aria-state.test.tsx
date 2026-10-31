/**
 * @vitest-environment jsdom
 *
 * issue #808: react-native-web 0.21 は `accessibilityState` を `aria-*` に変換しない。
 * native 部品が状態を `accessibilityState` だけで渡していると、Web ビルド（Expo web・Storybook）では
 * スイッチやチェックが常に「オフ」、選択中のチップ・タブが「どれが選択中か不明」と読み上げられる。
 *
 * ここでは react-native を react-native-web に差し替えて実物の DOM を描き、
 * 各部品が状態どおりの `aria-*` を出すことを固定する。
 */
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

vi.hoisted(() => {
  // react-native-web の AccessibilityInfo / Dimensions が読み込み時に参照する。設定オフ・スマホ幅として与える。
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList
})
vi.mock("react-native", async () => await vi.importActual("react-native-web"))

import { Switch } from "../src/native/components/Switch"
import { Checkbox } from "../src/native/components/Checkbox"
import { Chip } from "../src/native/components/Chip"
import { ChipSelector } from "../src/native/components/ChipSelector"
import { PillToggle } from "../src/native/components/PillToggle"
import { CollapsibleChipField } from "../src/native/components/CollapsibleChipField"
import { Accordion } from "../src/native/components/Accordion"
import { Collapsible } from "../src/native/components/Collapsible"
import { Card } from "../src/native/components/Card"
import { MediaActionCluster } from "../src/native/components/MediaActionCluster"
import { Pagination } from "../src/native/components/Pagination"
import { SubNav } from "../src/native/components/SubNav"
import { Tabs, TabsList, TabsTrigger } from "../src/native/components/Tabs"
import { IconButton } from "../src/native/components/IconButton"
import { Button } from "../src/native/components/Button"
import { ThemeProvider } from "../src/native/theme/ThemeProvider"

let container: HTMLElement
let root: Root

beforeEach(() => {
  ;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => {
    root.unmount()
  })
  container.remove()
})

function render(node: React.ReactElement) {
  act(() => {
    root.render(<ThemeProvider>{node}</ThemeProvider>)
  })
}

const all = (selector: string) => Array.from(container.querySelectorAll<HTMLElement>(selector))
const one = (selector: string) => {
  const found = all(selector)
  expect(found).toHaveLength(1)
  return found[0]
}
const byText = (role: string, text: string) => {
  const el = all(`[role="${role}"]`).find((e) => e.textContent?.includes(text))
  if (!el) throw new Error(`role=${role} で「${text}」を含む要素が無い`)
  return el
}

describe("Switch / Checkbox は aria-checked を出す（#808）", () => {
  it("Switch: オン / オフ / 無効", () => {
    render(<Switch value accessibilityLabel="通知" onValueChange={() => {}} />)
    expect(one('[role="switch"]').getAttribute("aria-checked")).toBe("true")
    render(<Switch value={false} disabled accessibilityLabel="通知" />)
    const sw = one('[role="switch"]')
    expect(sw.getAttribute("aria-checked")).toBe("false")
    expect(sw.getAttribute("aria-disabled")).toBe("true")
  })

  it("Checkbox: チェック状態を出し、decorative では role も aria-checked も出さない", () => {
    render(<Checkbox checked onChange={() => {}} />)
    expect(one('[role="checkbox"]').getAttribute("aria-checked")).toBe("true")
    render(<Checkbox checked={false} disabled />)
    const cb = one('[role="checkbox"]')
    expect(cb.getAttribute("aria-checked")).toBe("false")
    expect(cb.getAttribute("aria-disabled")).toBe("true")
    render(<Checkbox checked decorative />)
    expect(all("[role]")).toHaveLength(0)
    expect(all("[aria-checked]")).toHaveLength(0)
  })
})

describe("Chip / ChipSelector / PillToggle（#808）", () => {
  it("Chip（button）は選択状態を aria-pressed で出す", () => {
    render(
      <>
        <Chip selected>選択中</Chip>
        <Chip>未選択</Chip>
      </>,
    )
    expect(byText("button", "選択中").getAttribute("aria-pressed")).toBe("true")
    expect(byText("button", "未選択").getAttribute("aria-pressed")).toBe("false")
    expect(byText("button", "選択中").hasAttribute("aria-checked")).toBe(false)
  })

  it("Chip: 呼び出し側の accessibilityState が aria-* にも反映される", () => {
    render(
      <Chip selected accessibilityRole="radio" accessibilityState={{ checked: false, selected: undefined }}>
        上書き
      </Chip>,
    )
    const radio = byText("radio", "上書き")
    expect(radio.getAttribute("aria-checked")).toBe("false")
    expect(radio.hasAttribute("aria-pressed")).toBe(false)
  })

  it("Chip: removable の削除ボタンは無効状態を出す", () => {
    render(
      <Chip removable disabled onRemove={() => {}}>
        タグ
      </Chip>,
    )
    const remove = all('[role="button"]').find((e) => e.getAttribute("aria-label") === "削除: タグ")!
    expect(remove.getAttribute("aria-disabled")).toBe("true")
  })

  it("ChipSelector（単一選択）は radio + aria-checked", () => {
    render(
      <ChipSelector
        selectionMode="single"
        values={["a"]}
        options={[
          { value: "a", label: "選択肢A" },
          { value: "b", label: "選択肢B" },
        ]}
        onChange={() => {}}
      />,
    )
    expect(byText("radio", "選択肢A").getAttribute("aria-checked")).toBe("true")
    expect(byText("radio", "選択肢B").getAttribute("aria-checked")).toBe("false")
  })

  it("ChipSelector（複数選択）は button + aria-pressed", () => {
    render(
      <ChipSelector
        selectionMode="multiple"
        values={["a"]}
        options={[
          { value: "a", label: "選択肢A" },
          { value: "b", label: "選択肢B", disabled: true },
        ]}
        onChange={() => {}}
      />,
    )
    expect(byText("button", "選択肢A").getAttribute("aria-pressed")).toBe("true")
    const b = byText("button", "選択肢B")
    expect(b.getAttribute("aria-pressed")).toBe("false")
    expect(b.getAttribute("aria-disabled")).toBe("true")
  })

  it("PillToggle は aria-pressed と aria-disabled", () => {
    render(
      <PillToggle
        options={[
          { value: "all", label: "すべて" },
          { value: "done", label: "完了" },
        ]}
        value="all"
        disabled
      />,
    )
    const selected = byText("button", "すべて")
    expect(selected.getAttribute("aria-pressed")).toBe("true")
    expect(selected.getAttribute("aria-disabled")).toBe("true")
    expect(byText("button", "完了").getAttribute("aria-pressed")).toBe("false")
  })
})

describe("CollapsibleChipField（#808）", () => {
  const base = {
    options: ["easy", "hard"] as ("easy" | "hard")[],
    getLabel: (k: string) => (k === "easy" ? "やさしい" : "むずかしい"),
    onSelect: () => {},
    label: "難易度",
  }

  it("展開中のチップは radio + aria-checked", () => {
    render(<CollapsibleChipField {...base} selected="" />)
    expect(byText("radio", "やさしい").getAttribute("aria-checked")).toBe("false")
    expect(byText("radio", "むずかしい").getAttribute("aria-checked")).toBe("false")
  })

  it("畳まれた選択中チップ（開閉トリガ）は aria-expanded=false", () => {
    render(<CollapsibleChipField {...base} selected="easy" />)
    const trigger = byText("button", "やさしい")
    expect(trigger.getAttribute("aria-expanded")).toBe("false")
    expect(trigger.hasAttribute("aria-pressed")).toBe(false)
  })

  it("常時展開では選択中が aria-checked=true", () => {
    render(<CollapsibleChipField {...base} selected="hard" alwaysExpanded />)
    expect(byText("radio", "むずかしい").getAttribute("aria-checked")).toBe("true")
    expect(byText("radio", "やさしい").getAttribute("aria-checked")).toBe("false")
  })
})

describe("棚卸しで見つかった同じ型の部品（#808）", () => {
  it("Accordion / Collapsible は aria-expanded", () => {
    render(
      <>
        <Accordion
          items={[
            { key: "a", title: "開いた項目", content: null },
            { key: "b", title: "閉じた項目", content: null },
          ]}
          defaultOpenKeys={["a"]}
        />
        <Collapsible title="詳細" defaultOpen={false}>
          {null}
        </Collapsible>
      </>,
    )
    expect(byText("button", "開いた項目").getAttribute("aria-expanded")).toBe("true")
    expect(byText("button", "閉じた項目").getAttribute("aria-expanded")).toBe("false")
    expect(byText("button", "詳細").getAttribute("aria-expanded")).toBe("false")
  })

  it("Card（押せる・selected）は aria-pressed", () => {
    render(
      <Card onPress={() => {}} selected>
        {null}
      </Card>,
    )
    expect(one('[role="button"]').getAttribute("aria-pressed")).toBe("true")
  })

  it("MediaActionCluster の active は aria-pressed", () => {
    render(
      <MediaActionCluster
        items={[
          { label: "ミュート", icon: null, active: true, onPress: () => {} },
          { label: "共有", icon: null, active: false, onPress: () => {} },
        ]}
      />,
    )
    expect(all('[aria-label="ミュート"]')[0].getAttribute("aria-pressed")).toBe("true")
    expect(all('[aria-label="共有"]')[0].getAttribute("aria-pressed")).toBe("false")
  })

  it("Pagination の現在ページは aria-current=page（Web の Pagination と同じ）", () => {
    render(<Pagination page={2} total={3} onChange={() => {}} />)
    const current = all('[role="button"]').filter((e) => e.getAttribute("aria-current") === "page")
    expect(current).toHaveLength(1)
    expect(current[0].textContent).toBe("2")
    expect(all("[aria-pressed]")).toHaveLength(0)
  })

  it("SubNav / Tabs の tab は aria-selected", () => {
    render(
      <>
        <SubNav
          items={[
            { key: "a", label: "サブA" },
            { key: "b", label: "サブB" },
          ]}
          value="a"
        />
        <Tabs value="x" onChange={() => {}}>
          <TabsList>
            <TabsTrigger value="x">タブX</TabsTrigger>
            <TabsTrigger value="y" disabled>
              タブY
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </>,
    )
    expect(byText("tab", "サブA").getAttribute("aria-selected")).toBe("true")
    expect(byText("tab", "サブB").getAttribute("aria-selected")).toBe("false")
    expect(byText("tab", "タブX").getAttribute("aria-selected")).toBe("true")
    const y = byText("tab", "タブY")
    expect(y.getAttribute("aria-selected")).toBe("false")
    expect(y.getAttribute("aria-disabled")).toBe("true")
  })

  it("IconButton / Button は呼び出し側の selected / busy を aria-* に出す", () => {
    render(
      <>
        <IconButton icon={null} accessibilityLabel="お気に入り" accessibilityState={{ selected: true }} onPress={() => {}} />
        <Button loading onPress={() => {}}>
          保存
        </Button>
      </>,
    )
    expect(one('[aria-label="お気に入り"]').getAttribute("aria-pressed")).toBe("true")
    // loading 中の Button は文字の代わりにスピナーを出すので、aria-busy で引く
    const busy = one('[aria-busy="true"]')
    expect(busy.getAttribute("role")).toBe("button")
    expect(busy.getAttribute("aria-disabled")).toBe("true")
  })
})
