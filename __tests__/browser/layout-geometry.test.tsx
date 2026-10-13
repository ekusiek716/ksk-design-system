import { describe, expect, it, afterEach } from "vitest"
import { createRoot, type Root } from "react-dom/client"
import { act } from "react"
import * as React from "react"
import { cdp, page } from "vitest/browser"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { SkipLink } from "@/components/ui/skip-link"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination"
import { Spinner } from "@/components/ui/spinner"
import { Skeleton } from "@/components/ui/skeleton"
import { SyncStatusBadge } from "@/components/ui/sync-status-badge"
import { StatusActionBadge } from "@/components/ui/status-action-badge"
import { SocialLoginButton } from "@/components/ui/social-login-button"
import "@/index.css"

/**
 * 部品の寸法・位置を実ブラウザ（chromium）で固定する回帰テスト。
 *
 * baseconnect DS #197（Storybook の点検で見つかった崩れ 97 件）の再発パターンを
 * KSK で実測し、該当したものを直した。ここでは直した寸法を固定する:
 * - 文章中の Checkbox が選ぶたびに上下しない（✓ を外さず visibility で出し入れ）
 * - 親の行間（2.4 など）を受け継いでも Checkbox の行が 44px のまま
 * - 幅 390px の画面で Select / DropdownMenu / Popover の一覧が画面外へはみ出さない
 * - 隠れている SkipLink が長いラベルでも画面の上端から覗かない
 * - 縦向き Tabs がタブを縦に並べ、パネルを右に置く（横向きの既定は従来どおり）
 * - Pagination のページ番号が 4〜5 桁でも枠からはみ出さない（1〜2 桁は 40px のまま）
 * - 動きを減らす設定で、スピナー類と Skeleton の無限アニメーションが止まる
 *
 * 敵対的な親（Storybook の Hostile ctx 相当）は、文字色に加えて行間・字間・文字サイズも
 * 崩した HOSTILE で再現する。
 */

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const HOSTILE: React.CSSProperties = { lineHeight: 2.4, letterSpacing: "0.1em", fontSize: 20, color: "#E5007A" }
const LONG = "とても長い項目名がここに入りますとても長い項目名がここに入りますとても長い項目名がここに入ります"

let root: Root | undefined
let container: HTMLDivElement | undefined

afterEach(async () => {
  await cdp().send("Emulation.setEmulatedMedia", { features: [] })
  if (root) act(() => root!.unmount())
  container?.remove()
  root = undefined
  container = undefined
})

async function mount(node: React.ReactElement, width = 960) {
  await page.viewport(width, 800)
  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)
  await act(async () => {
    root!.render(node)
  })
  // Radix の開閉アニメーション（zoom-in-95 など）が終わってから測る
  await new Promise((resolve) => setTimeout(resolve, 400))
}

const rect = (selector: string) => {
  const el = document.querySelector(selector)
  if (!el) throw new Error(`not found: ${selector}`)
  return el.getBoundingClientRect()
}

describe("Checkbox", () => {
  it("文章中に置いた Checkbox は、選択の有無で箱の位置と行の高さが変わらない", async () => {
    await mount(
      <div>
        <p id="off">前 <Checkbox aria-label="未選択" /> 後</p>
        <p id="on">前 <Checkbox aria-label="選択済み" defaultChecked /> 後</p>
        <p id="off-h" style={HOSTILE}>前 <Checkbox aria-label="未選択" /> 後</p>
        <p id="on-h" style={HOSTILE}>前 <Checkbox aria-label="選択済み" defaultChecked /> 後</p>
      </div>,
    )
    const offset = (id: string) => rect(`#${id} [data-slot=checkbox]`).top - rect(`#${id}`).top
    // 修正前: 通常 0px / 2px、敵対的な親 12px / 15px と選ぶたびに動いていた
    expect(offset("on")).toBeCloseTo(offset("off"), 1)
    expect(rect("#on").height).toBeCloseTo(rect("#off").height, 1)
    expect(offset("on-h")).toBeCloseTo(offset("off-h"), 1)
    expect(rect("#on-h").height).toBeCloseTo(rect("#off-h").height, 1)
  })

  it("未選択の ✓ は描画されず、選択すると見える", async () => {
    await mount(
      <div>
        <Checkbox aria-label="未選択" />
        <Checkbox aria-label="選択済み" defaultChecked />
      </div>,
    )
    const [off, on] = [...document.querySelectorAll("[data-slot=checkbox-indicator]")]
    expect(getComputedStyle(off).visibility).toBe("hidden")
    expect(getComputedStyle(on).visibility).toBe("visible")
  })

  it("label 付きの行は、親の行間・文字サイズを受け継いでも 44px のまま", async () => {
    await mount(
      <div>
        <div id="normal"><Checkbox label="正社員" /></div>
        <div id="hostile" style={HOSTILE}><Checkbox label="正社員" /></div>
      </div>,
    )
    // 修正前: 敵対的な親（行間 2.4・20px）で 64px に伸びていた
    expect(rect("#normal [data-slot=checkbox-row]").height).toBe(44)
    expect(rect("#hostile [data-slot=checkbox-row]").height).toBe(44)
  })
})

describe("幅 390px の画面でのポップアップ", () => {
  const within = (selector: string) => {
    const r = rect(selector)
    expect(r.left).toBeGreaterThanOrEqual(0)
    expect(r.right).toBeLessThanOrEqual(window.innerWidth)
  }

  it("DropdownMenu は長い項目があっても画面外へはみ出さない", async () => {
    await mount(
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <DropdownMenu open>
          <DropdownMenuTrigger>開く</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>短い項目</DropdownMenuItem>
            <DropdownMenuItem>{LONG}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>,
      390,
    )
    // 修正前: 幅 740px で右へ 350px はみ出していた
    within("[data-slot=dropdown-menu-content]")
  })

  it("Select は長い選択肢があっても画面外へはみ出さない", async () => {
    await mount(
      <div style={{ display: "flex", justifyContent: "flex-end", padding: 16 }}>
        <Select open value="a">
          <SelectTrigger aria-label="並び順" className="w-32"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="a">{LONG}</SelectItem>
          </SelectContent>
        </Select>
      </div>,
      390,
    )
    // 修正前: 幅 641px で右へはみ出していた
    within("[data-slot=select-content]")
  })

  it("Popover は className で広い幅を渡しても画面外へはみ出さない。既定の幅は 288px のまま", async () => {
    await mount(
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Popover open><PopoverTrigger>既定</PopoverTrigger><PopoverContent data-testid="default">既定の幅</PopoverContent></Popover>
        <Popover open><PopoverTrigger>広い</PopoverTrigger><PopoverContent data-testid="wide" className="w-[480px]">広い幅</PopoverContent></Popover>
      </div>,
      390,
    )
    expect(rect("[data-testid=default]").width).toBe(288)
    // 修正前: 幅 480px のまま左端から右へ 90px はみ出していた
    within("[data-testid=wide]")
  })
})

describe("SkipLink", () => {
  it("隠れている間は、3 行に折り返す長いラベルでも影ごと画面の上端より上にある", async () => {
    await mount(
      <div>
        <SkipLink targetId="main" />
        <SkipLink
          targetId="main"
          label="本文へ移動する（とても長いラベルの例。翻訳でラベルが長くなった場合を想定しています。さらに長くなることもあります）"
        />
        <main id="main" tabIndex={-1}>本文</main>
      </div>,
      390,
    )
    const links = [...document.querySelectorAll("[data-slot=skip-link]")]
    expect(links[1].getBoundingClientRect().height).toBeGreaterThan(80)
    for (const link of links) {
      // 影（0 12px 32px -4px）は下端から 40px 広がる。修正前は長いラベルで下端が +1px だった
      expect(link.getBoundingClientRect().bottom + 40).toBeLessThanOrEqual(0)
    }
  })

  it("フォーカスすると top 16px の位置に出る", async () => {
    await mount(
      <div>
        <SkipLink targetId="main" />
        <main id="main" tabIndex={-1}>本文</main>
      </div>,
      390,
    )
    const link = document.querySelector<HTMLAnchorElement>("[data-slot=skip-link]")!
    link.style.transition = "none"
    link.focus()
    expect(link.getBoundingClientRect().top).toBe(16)
  })
})

describe("Tabs", () => {
  const items = (
    <>
      <TabsList>
        <TabsTrigger value="a">アカウント</TabsTrigger>
        <TabsTrigger value="b">通知</TabsTrigger>
        <TabsTrigger value="c">プライバシーとセキュリティの詳しい設定</TabsTrigger>
      </TabsList>
      <TabsContent value="a">パネル</TabsContent>
    </>
  )

  it("横向き（既定）はタブを 1 行に並べ、パネルを下に置く", async () => {
    await mount(<Tabs id="h" defaultValue="a">{items}</Tabs>, 390)
    const triggers = [...document.querySelectorAll("#h [data-slot=tabs-trigger]")].map((t) => t.getBoundingClientRect())
    expect(new Set(triggers.map((t) => t.top)).size).toBe(1)
    expect(rect("#h [data-slot=tabs-list]").height).toBe(40)
    expect(rect("#h [data-slot=tabs-content]").top).toBeGreaterThan(rect("#h [data-slot=tabs-list]").bottom)
  })

  it("縦向きはタブを縦に並べ、列は幅の半分まで、パネルは右の残りを取る", async () => {
    await mount(<Tabs id="v" defaultValue="a" orientation="vertical">{items}</Tabs>, 390)
    const triggers = [...document.querySelectorAll("#v [data-slot=tabs-trigger]")].map((t) => t.getBoundingClientRect())
    // 修正前: 3 つとも同じ行（top 5px）に横並びで、パネルはタブの下だった
    expect(new Set(triggers.map((t) => t.left)).size).toBe(1)
    expect(triggers[1].top).toBeGreaterThanOrEqual(triggers[0].bottom)
    expect(triggers[2].top).toBeGreaterThanOrEqual(triggers[1].bottom)
    const list = rect("#v [data-slot=tabs-list]")
    const tabs = rect("#v")
    expect(list.width).toBeLessThanOrEqual(tabs.width / 2 + 0.5)
    const content = rect("#v [data-slot=tabs-content]")
    expect(content.left).toBeGreaterThanOrEqual(list.right)
    expect(content.right).toBeCloseTo(tabs.right, 0)
    // 長いラベルはタブの中で折り返し、列からはみ出さない
    for (const t of triggers) expect(t.right).toBeLessThanOrEqual(list.right)
  })
})

describe("Pagination", () => {
  it("ページ番号は 1〜2 桁で 40px の正方形、4〜5 桁でも文字が枠からはみ出さない", async () => {
    await mount(
      <Pagination>
        <PaginationContent>
          {["1", "99", "1000", "10000"].map((n) => (
            <PaginationItem key={n}>
              <PaginationLink href="#" isActive={n === "1"} data-testid={`p${n}`}>{n}</PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationLink href="#" size="default" data-testid="pdefault">前のページ</PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>,
    )
    // 1〜2 桁はどのフォントでも 40px に収まる。4 桁以上の幅はフォント次第
    // （macOS で 40px、CI の ubuntu で約 41px）なので、はみ出さないことだけを見る
    for (const n of ["1", "99"]) {
      expect(rect(`[data-testid=p${n}]`).width).toBe(40)
      expect(rect(`[data-testid=p${n}]`).height).toBe(40)
    }
    for (const n of ["1000", "10000"]) {
      const el = document.querySelector<HTMLElement>(`[data-testid=p${n}]`)!
      // 修正前: 5 桁で幅 40px に対して中身が 44px あり、はみ出していた
      expect(el.scrollWidth).toBeLessThanOrEqual(el.clientWidth)
      expect(el.getBoundingClientRect().height).toBe(40)
    }
    // min-w-fit はページ番号（size="icon"）にだけ付く
    expect(document.querySelector("[data-testid=p1]")!.classList.contains("min-w-fit")).toBe(true)
    expect(document.querySelector("[data-testid=pdefault]")!.classList.contains("min-w-fit")).toBe(false)
  })
})

describe("Badge（該当なしの確認）", () => {
  it("variant が違っても、敵対的な親の中でも高さは 24px でそろう", async () => {
    const variants = ["default", "secondary", "outline", "destructive", "success", "warning", "info", "subtle", "ghost"] as const
    await mount(
      <div style={HOSTILE}>
        {variants.map((v) => <Badge key={v} variant={v}>{v}</Badge>)}
      </div>,
    )
    const heights = [...document.querySelectorAll("[data-slot=badge]")].map((b) => b.getBoundingClientRect().height)
    expect(new Set(heights)).toEqual(new Set([24]))
  })
})

describe("動きを減らす設定（prefers-reduced-motion）", () => {
  const tree = (
    <div>
      <Spinner />
      <Skeleton />
      <SyncStatusBadge state="syncing" />
      <StatusActionBadge state="syncing" label="同期" />
      <SocialLoginButton provider="google" loading />
    </div>
  )
  const animated = () => [
    document.querySelector("[data-slot=spinner]")!,
    document.querySelector("[data-slot=skeleton]")!,
    document.querySelector("[data-slot=sync-status-badge] > span[aria-hidden]")!,
    document.querySelector("[data-slot=status-action-badge] .animate-spin")!,
    document.querySelector("[data-slot=social-login-button] .animate-spin")!,
  ]

  it("通常はスピナー類・Skeleton がアニメーションする", async () => {
    await mount(tree)
    for (const el of animated()) expect(getComputedStyle(el).animationName).not.toBe("none")
  })

  it("reduce ではアニメーションを止め、Spinner は role=status を保つ", async () => {
    await cdp().send("Emulation.setEmulatedMedia", {
      features: [{ name: "prefers-reduced-motion", value: "reduce" }],
    })
    await mount(tree)
    for (const el of animated()) expect(getComputedStyle(el).animationName).toBe("none")
    const spinner = document.querySelector("[data-slot=spinner]")!
    expect(spinner.getAttribute("role")).toBe("status")
    // 止めても上辺だけブランド色の欠けた輪で、処理中と分かる
    const style = getComputedStyle(spinner)
    expect(style.borderTopColor).not.toBe(style.borderRightColor)
  })
})
