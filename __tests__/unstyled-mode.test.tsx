/**
 * @vitest-environment jsdom
 *
 * unstyled モード（issue #420）
 *
 * 既存の手書き CSS 画面を DS へ段階移行するとき、Button / Input / Textarea の
 * base + variant が持つ寸法・装飾が、手書きクラスが宣言していないプロパティへ
 * 流入して視覚回帰する（aikoibito 実測: CTA 52→40px、チャット入力 43→80px 等）。
 * `unstyled` は挙動と a11y だけを提供し、見た目を一切持たないモード。
 *
 * ここで固定するのは 2 系統:
 *   1. unstyled=true のとき視覚クラスが出ず、挙動・a11y は生きていること
 *   2. unstyled 未指定（既定）の出力クラスが**一字も変わっていない**こと
 *      （2 は段階移行機能の追加で既存 consumer を壊さないための回帰固定。
 *        期待値は本 PR の実装前に renderToStaticMarkup で採取した実出力）
 */
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { renderToStaticMarkup } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"

import { Button } from "../src/components/ui/button"
import { Input } from "../src/components/ui/input"
import { Textarea } from "../src/components/ui/textarea"

/* ------------------------------------------------------------------ */
/*  helpers                                                            */
/* ------------------------------------------------------------------ */

const html = (element: React.ReactElement) => renderToStaticMarkup(element)

/**
 * N 番目の class 属性を取り出す（renderToStaticMarkup は class= で出力する）。
 * `[&_svg]:...` は HTML 実体参照で `[&amp;_svg]:...` になるため元へ戻す。
 */
function classOf(markup: string, occurrence = 0): string {
  const matches = [...markup.matchAll(/class="([^"]*)"/g)]
  return (matches[occurrence]?.[1] ?? "").replace(/&amp;/g, "&")
}

/** クラス列をトークンへ分解する。部分文字列一致だと `--Text-High-Emphasis` の
 *  "h-" のような偽陽性を拾うため、必ずトークン単位で判定する。 */
function tokens(className: string): string[] {
  return className.split(/\s+/).filter(Boolean)
}

/** prefix で始まるクラス（`hover:` 等の variant 付きも含む）を列挙する。 */
function tokensStartingWith(className: string, prefix: string): string[] {
  return tokens(className).filter((t) => {
    const bare = t.includes(":") ? t.slice(t.lastIndexOf(":") + 1) : t
    return bare.startsWith(prefix)
  })
}

let container: HTMLElement | null = null
let root: Root | null = null

function mount(ui: React.ReactElement) {
  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)
  act(() => {
    root!.render(ui)
  })
}

afterEach(() => {
  if (root) {
    act(() => {
      root!.unmount()
    })
    root = null
  }
  container?.remove()
  container = null
  document.body.innerHTML = ""
  vi.restoreAllMocks()
})

/* ------------------------------------------------------------------ */
/*  (a) Button — 視覚クラスを出さず focus ring だけ残す                 */
/* ------------------------------------------------------------------ */

describe("Button unstyled — 視覚クラス", () => {
  it("寸法・背景・角丸・タイポのクラスを一切出さない", () => {
    const className = classOf(html(<Button unstyled>送信</Button>))

    for (const prefix of [
      "h-",
      "min-h-",
      "size-",
      "px-",
      "py-",
      "bg-",
      "rounded-",
      "typo-",
      "gap-",
      "border",
      "text-",
    ]) {
      expect(tokensStartingWith(className, prefix)).toEqual([])
    }
  })

  it("base の flex 配置・折返し禁止・カーソルも出さない", () => {
    const className = classOf(html(<Button unstyled>送信</Button>))

    for (const cls of [
      "inline-flex",
      "items-center",
      "justify-center",
      "whitespace-nowrap",
      "cursor-pointer",
      "transition-colors",
    ]) {
      expect(tokens(className)).not.toContain(cls)
    }
  })

  it("variant / size を明示しても視覚クラスは出ない", () => {
    const className = classOf(
      html(
        <Button unstyled variant="destructive" size="lg">
          削除
        </Button>,
      ),
    )
    expect(tokensStartingWith(className, "h-")).toEqual([])
    expect(tokensStartingWith(className, "bg-")).toEqual([])
    expect(className).not.toContain("Caution-Base")
  })

  it("a11y のための focus-visible ring は既定で残る", () => {
    const className = classOf(html(<Button unstyled>送信</Button>))
    expect(className).toContain("focus-visible:")
    expect(className).toContain("focus-visible:ring-[3px]")
  })

  it("focus ring は className で上書きできる", () => {
    const className = classOf(
      html(
        <Button unstyled className="focus-visible:ring-0">
          送信
        </Button>,
      ),
    )
    expect(tokens(className)).toContain("focus-visible:ring-0")
    expect(tokens(className)).not.toContain("focus-visible:ring-[3px]")
  })

  it("既存クラスはそのまま className に残る（段階移行の主目的）", () => {
    const className = classOf(html(<Button unstyled className="btn btn-primary">送信</Button>))
    expect(tokens(className)).toContain("btn")
    expect(tokens(className)).toContain("btn-primary")
  })

  it("data-variant / data-size は unstyled になる", () => {
    const markup = html(<Button unstyled>送信</Button>)
    expect(markup).toContain('data-variant="unstyled"')
    expect(markup).toContain('data-size="unstyled"')
    expect(markup).toContain('data-slot="button"')
  })

  it("unstyled 属性は DOM へ漏らさない", () => {
    expect(html(<Button unstyled>送信</Button>)).not.toContain("unstyled=")
  })
})

/* ------------------------------------------------------------------ */
/*  (b) Button — 挙動と a11y は unstyled でも維持                       */
/* ------------------------------------------------------------------ */

describe("Button unstyled — 挙動と a11y", () => {
  it("type の既定は button のまま（form 内の暗黙 submit を防ぐ）", () => {
    expect(html(<Button unstyled>送信</Button>)).toContain('type="button"')
    expect(html(<Button unstyled type="submit">送信</Button>)).toContain('type="submit"')
  })

  it("disabled のクリックは preventDefault + stopPropagation される", () => {
    const onClick = vi.fn()
    const onParentClick = vi.fn()
    mount(
      <div onClick={onParentClick}>
        <Button unstyled disabled onClick={onClick}>
          送信
        </Button>
      </div>,
    )

    const button = container!.querySelector("button")!
    expect(button.disabled).toBe(true)
    act(() => {
      button.click()
    })
    expect(onClick).not.toHaveBeenCalled()
    expect(onParentClick).not.toHaveBeenCalled()
  })

  it("aria-disabled のクリックは preventDefault + stopPropagation される", () => {
    const onClick = vi.fn()
    const onParentClick = vi.fn()
    mount(
      <div onClick={onParentClick}>
        <Button unstyled aria-disabled onClick={onClick}>
          送信
        </Button>
      </div>,
    )

    const button = container!.querySelector("button")!
    const event = new MouseEvent("click", { bubbles: true, cancelable: true })
    act(() => {
      button.dispatchEvent(event)
    })

    expect(onClick).not.toHaveBeenCalled()
    expect(onParentClick).not.toHaveBeenCalled()
    expect(event.defaultPrevented).toBe(true)
  })

  it("有効時のクリックは通常どおり onClick を呼ぶ", () => {
    const onClick = vi.fn()
    mount(
      <Button unstyled onClick={onClick}>
        送信
      </Button>,
    )
    act(() => {
      container!.querySelector("button")!.dispatchEvent(
        new MouseEvent("click", { bubbles: true, cancelable: true }),
      )
    })
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("haptic は unstyled でも navigator.vibrate を呼ぶ", () => {
    const vibrate = vi.fn()
    Object.defineProperty(navigator, "vibrate", {
      configurable: true,
      writable: true,
      value: vibrate,
    })
    mount(
      <Button unstyled haptic="light">
        送信
      </Button>,
    )
    act(() => {
      container!.querySelector("button")!.dispatchEvent(
        new MouseEvent("click", { bubbles: true, cancelable: true }),
      )
    })
    expect(vibrate).toHaveBeenCalledWith(10)
  })

  it("asChild は unstyled でも子要素へ委譲する", () => {
    const markup = html(
      <Button unstyled asChild className="back">
        <a href="/talk">戻る</a>
      </Button>,
    )
    expect(markup).toContain("<a")
    expect(markup).toContain('href="/talk"')
    expect(markup).not.toContain("<button")
    expect(tokens(classOf(markup))).toContain("back")
  })
})

/* ------------------------------------------------------------------ */
/*  (c) Input unstyled                                                 */
/* ------------------------------------------------------------------ */

describe("Input unstyled", () => {
  it("h-* / w-full / border / bg / px-* / typo-* / placeholder:* を出さない", () => {
    const className = classOf(html(<Input unstyled />))

    for (const prefix of ["h-", "w-full", "border", "bg-", "px-", "typo-", "text-", "flex"]) {
      expect(tokensStartingWith(className, prefix)).toEqual([])
    }
    expect(tokensStartingWith(className, "placeholder")).toEqual([])
    expect(className).toContain("focus-visible:")
  })

  it("既存クラスを維持したまま focus ring だけが足される", () => {
    const className = classOf(html(<Input unstyled className="text-input" />))
    expect(tokens(className)).toContain("text-input")
  })

  it("adornment のレイアウト土台は残り、装飾のタイポ・文字色は出ない", () => {
    const markup = html(<Input unstyled startAdornment="¥" endAdornment="円" />)
    // ラッパーは absolute 配置の基準なので relative を保つ。w-full は出さない。
    const wrapper = classOf(markup, 0)
    expect(tokens(wrapper)).toContain("relative")
    expect(tokens(wrapper)).not.toContain("w-full")
    // 装飾は DS の typo / 文字色を持たず、consumer のタイポを継承する。
    const start = classOf(markup, 1)
    expect(tokens(start)).toContain("absolute")
    expect(tokensStartingWith(start, "typo-")).toEqual([])
    expect(tokensStartingWith(start, "text-")).toEqual([])
  })

  it("showCount は unstyled でも文字数カウンタを描画する", () => {
    const markup = html(<Input unstyled showCount maxLength={10} defaultValue="あいう" />)
    expect(markup).toContain('data-slot="input-count"')
    expect(markup).toContain("3/10")
    // 外側ラッパーの w-full は出さない
    expect(tokens(classOf(markup, 0))).not.toContain("w-full")
  })

  it("unstyled 属性は DOM へ漏らさない", () => {
    expect(html(<Input unstyled />)).not.toContain("unstyled=")
  })
})

/* ------------------------------------------------------------------ */
/*  (d) Textarea unstyled                                              */
/* ------------------------------------------------------------------ */

describe("Textarea unstyled", () => {
  it("min-h-* を出さない（--Field-Min-Height 流入による 43→80px 回帰の再発防止）", () => {
    const className = classOf(html(<Textarea unstyled />))
    expect(tokensStartingWith(className, "min-h-")).toEqual([])
    expect(className).not.toContain("--Field-Min-Height")
  })

  it("w-full / border / bg / px-* / py-* / typo-* も出さない", () => {
    const className = classOf(html(<Textarea unstyled />))
    for (const prefix of ["w-full", "border", "bg-", "px-", "py-", "typo-", "text-", "flex"]) {
      expect(tokensStartingWith(className, prefix)).toEqual([])
    }
    expect(className).toContain("focus-visible:")
  })

  it("autoGrow の resize-none / overflow-hidden は機能の一部なので残す", () => {
    const className = classOf(html(<Textarea unstyled autoGrow />))
    expect(tokens(className)).toContain("resize-none")
    expect(tokens(className)).toContain("overflow-hidden")
  })

  it("showCount は unstyled でも文字数カウンタを描画する", () => {
    const markup = html(<Textarea unstyled showCount maxLength={20} defaultValue="ab" />)
    expect(markup).toContain('data-slot="textarea-count"')
    expect(markup).toContain("2/20")
    expect(tokens(classOf(markup, 0))).not.toContain("w-full")
  })

  it("unstyled 属性は DOM へ漏らさない", () => {
    expect(html(<Textarea unstyled />)).not.toContain("unstyled=")
  })
})

/* ------------------------------------------------------------------ */
/*  (e) 既定（unstyled 未指定）の出力クラス回帰固定                     */
/* ------------------------------------------------------------------ */

const BUTTON_DEFAULT_CLASS =
  "inline-flex items-center justify-center gap-[var(--Control-Gap)] whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50 disabled:pointer-events-none disabled:opacity-50 aria-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 cursor-pointer bg-[var(--Brand-Primary)] text-[var(--Text-on-Inverse)] hover:bg-[var(--Hover-Primary-Button)] active:bg-[var(--Active-Primary-Button)] rounded-[var(--Control-Radius)] h-[var(--Control-Height-Md)] px-[var(--Control-Padding-X-Md)] typo-label-md"

const BUTTON_GHOST_SM_CLASS =
  "inline-flex items-center justify-center gap-[var(--Control-Gap)] whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50 disabled:pointer-events-none disabled:opacity-50 aria-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 cursor-pointer text-[var(--Text-Accent-Primary)] hover:bg-[var(--Hover-Ghost-Button)] rounded-[var(--Control-Radius)] h-[var(--Control-Height-Sm)] px-[var(--Control-Padding-X-Sm)] typo-label-sm"

const BUTTON_VERTICAL_CLASS =
  "inline-flex items-center justify-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50 disabled:pointer-events-none disabled:opacity-50 aria-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 cursor-pointer bg-[var(--Brand-Primary)] text-[var(--Text-on-Inverse)] hover:bg-[var(--Hover-Primary-Button)] active:bg-[var(--Active-Primary-Button)] px-[var(--Control-Padding-X-Md)] flex-col gap-1 h-[var(--Control-Height-Xl)] rounded-2xl py-2 typo-label-sm w-full"

const INPUT_DEFAULT_CLASS =
  "flex h-[var(--Field-Height-Md)] w-full rounded-[var(--Field-Radius)] border border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)] px-[var(--Field-Padding-X-Md)] typo-body-md text-[var(--Text-High-Emphasis)] transition-colors file:border-0 file:bg-transparent file:typo-body-md placeholder:text-[var(--Text-Low-Emphasis)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50 focus-visible:border-[var(--Border-Accent-Primary)] disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-[var(--Border-Caution)] aria-invalid:ring-[var(--Caution-Base)]/20"

const TEXTAREA_DEFAULT_CLASS =
  "flex min-h-[var(--Field-Min-Height)] w-full rounded-[var(--Field-Radius)] border border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)] px-[var(--Field-Padding-X-Md)] py-[var(--Field-Padding-Y)] typo-body-md text-[var(--Text-High-Emphasis)] transition-colors placeholder:text-[var(--Text-Low-Emphasis)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50 focus-visible:border-[var(--Border-Accent-Primary)] disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-[var(--Border-Caution)]"

describe("既定の出力クラス（unstyled 未指定）を回帰固定する", () => {
  it("Button default / ghost-sm / vertical", () => {
    expect(classOf(html(<Button>x</Button>))).toBe(BUTTON_DEFAULT_CLASS)
    expect(
      classOf(
        html(
          <Button variant="ghost" size="sm">
            x
          </Button>,
        ),
      ),
    ).toBe(BUTTON_GHOST_SM_CLASS)
    expect(
      classOf(
        html(
          <Button layout="vertical" className="w-full">
            x
          </Button>,
        ),
      ),
    ).toBe(BUTTON_VERTICAL_CLASS)
  })

  it("Button の data 属性と type 既定", () => {
    const markup = html(<Button>x</Button>)
    expect(markup).toContain('data-variant="default"')
    expect(markup).toContain('data-size="default"')
    expect(markup).toContain('type="button"')
  })

  it("Input（素 / adornment / showCount）", () => {
    expect(classOf(html(<Input />))).toBe(INPUT_DEFAULT_CLASS)

    const adorned = html(<Input startAdornment="¥" endAdornment="円" />)
    expect(classOf(adorned, 0)).toBe("relative flex w-full items-center")
    expect(classOf(adorned, 1)).toBe(
      "pointer-events-none absolute left-3 inset-y-0 flex items-center text-[var(--Text-Low-Emphasis)] typo-body-md select-none",
    )
    expect(classOf(adorned, 2)).toBe(`${INPUT_DEFAULT_CLASS} pl-9 pr-9`)
    expect(classOf(adorned, 3)).toBe(
      "absolute right-3 inset-y-0 flex items-center text-[var(--Text-Low-Emphasis)] typo-body-md",
    )

    const counted = html(<Input showCount maxLength={10} />)
    expect(classOf(counted, 0)).toBe("w-full")
    expect(classOf(counted, 1)).toBe(INPUT_DEFAULT_CLASS)
  })

  it("Textarea（素 / autoGrow / showCount）", () => {
    expect(classOf(html(<Textarea />))).toBe(TEXTAREA_DEFAULT_CLASS)
    expect(classOf(html(<Textarea autoGrow />))).toBe(
      `${TEXTAREA_DEFAULT_CLASS} resize-none overflow-hidden`,
    )

    const counted = html(<Textarea showCount maxLength={10} />)
    expect(classOf(counted, 0)).toBe("w-full")
    expect(classOf(counted, 1)).toBe(TEXTAREA_DEFAULT_CLASS)
  })
})
