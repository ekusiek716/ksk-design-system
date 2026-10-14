import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { readFileSync } from "node:fs"
import { chromium } from "playwright"
import { compile } from "tailwindcss"
import { Scanner } from "@tailwindcss/oxide"
import { describe, expect, it } from "vitest"
import { DataTableRow } from "../src/components/patterns/admin/data-table"
import { Chip } from "../src/components/patterns/chip"
import { Alert } from "../src/components/ui/alert"

const read = (file: string) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8")

async function withPage(html: string, test: (page: import("playwright").Page) => Promise<void>) {
  const candidates = [...html.matchAll(/class="([^"]*)"/g)].flatMap(match => match[1].split(/\s+/))
  const root = fileURLToPath(new URL("../", import.meta.url))
  const css = (await compile('@import "tailwindcss"; @import "./src/preset-core.css";', {
    base: root,
    loadStylesheet: async (id, base) => {
      const file = id === "tailwindcss" ? resolve(root, "node_modules/tailwindcss/index.css") : resolve(base, id)
      return { content: readFileSync(file, "utf8"), base: dirname(file) }
    },
  })).build(candidates)
  const browser = await chromium.launch({ headless: true })
  try {
    const page = await browser.newPage()
    await page.setContent(`<style>${css}</style>${html}`)
    await test(page)
  } finally { await browser.close() }
}

const background = (page: import("playwright").Page, selector: string) => page.locator(selector).evaluate(el => getComputedStyle(el).backgroundColor)

describe("consumer state colors", () => {
  it("preserves selection and limits row hover to interactive rows in light and dark", async () => {
    for (const theme of ["", "dark"]) {
      const html = renderToStaticMarkup(<div className={theme}><table><tbody>
        <DataTableRow id="selected" selected clickable><td>選択中</td></DataTableRow>
        <DataTableRow id="static"><td>参照のみ</td></DataTableRow>
        <DataTableRow id="interactive" onRowClick={() => {}}><td>詳細を開く</td></DataTableRow>
      </tbody></table></div>)
      await withPage(html, async page => {
        for (const id of ["selected", "static"]) {
          const before = await background(page, `#${id}`)
          await page.locator(`#${id}`).hover()
          expect(await background(page, `#${id}`)).toBe(before)
          await page.mouse.move(600, 400)
        }
        const before = await background(page, "#interactive")
        await page.locator("#interactive").hover()
        await page.waitForTimeout(250)
        expect(await background(page, "#interactive")).not.toBe(before)
      })
    }
  })

  it("uses hover contrast and success border tokens in a dark descendant", async () => {
    const html = renderToStaticMarkup(<div className="dark"><Chip id="chip" selected variant="outline">音楽</Chip><Alert id="alert" variant="success" title="保存しました" /></div>)
    await withPage(html, async page => {
      await page.locator("#chip").hover()
      await page.waitForTimeout(250)
      expect(await page.locator("#chip").evaluate(el => getComputedStyle(el).backgroundColor)).toBe("rgb(59, 130, 246)")
      expect(await page.locator("#alert > div").evaluate(el => getComputedStyle(el).borderTopColor)).toBe("rgb(74, 222, 128)")
    })
  })

  it("rebinds every sidebar bridge inside a dark descendant", async () => {
    await withPage('<div class="dark" id="dark"></div>', async page => {
      const pairs = await page.locator("#dark").evaluate(el => {
        const style = getComputedStyle(el)
        return Object.entries({ background: "Surface-Primary", foreground: "Text-High-Emphasis", primary: "Brand-Primary", "primary-foreground": "Text-on-Inverse", accent: "Surface-Accent-Primary-Light", "accent-foreground": "Text-Accent-Primary", border: "Border-Low-Emphasis", ring: "Focus-High-Emphasis" }).map(([name, semantic]) => [style.getPropertyValue(`--sidebar-${name}`).trim(), style.getPropertyValue(`--${semantic}`).trim()])
      })
      for (const [bridge, semantic] of pairs) { expect(bridge).not.toBe(""); expect(bridge).toBe(semantic) }
    })
  })

  it.each(["AGENTS.md", "CLAUDE.md", "templates/AGENTS.md", "templates/CLAUDE.md"])("keeps %s free from wildcard arbitrary CSS candidates", file => {
    const candidates = new Scanner({ sources: [] }).scanFiles([{ content: read(file), extension: "md" }])
    expect(candidates.filter(candidate => candidate.includes("[var(") && candidate.includes("*"))).toEqual([])
  })
})
