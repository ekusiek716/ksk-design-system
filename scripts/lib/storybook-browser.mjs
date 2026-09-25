import { chromium } from 'playwright'

export async function openBrowser() {
  return chromium.launch({ headless: true })
}

export async function inspectDocs(page, url, timeout = 30000) {
  const errors = []
  const onError = error => errors.push(error.message)
  page.on('pageerror', onError)
  const start = performance.now()
  try {
    const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout })
    if (!response?.ok()) throw new Error(`HTTP ${response?.status() ?? 'no response'}`)
    const root = page.locator('#storybook-docs')
    await root.waitFor({ state: 'visible', timeout })
    await root.locator('h1, h2').first().waitFor({ state: 'visible', timeout })
    // React/Storybook can replace a provisional Docs tree after its heading
    // first paints. Poll one visible-body predicate through the settle window
    // and return that same accepted snapshot; do not re-read after a fixed sleep.
    const deadline = performance.now() + timeout
    let readySince = null
    let text = null
    while (performance.now() < deadline) {
      const snapshot = await page.evaluate(() => {
        const root = document.querySelector('#storybook-docs')
        if (!root || !root.getClientRects().length || getComputedStyle(root).visibility === 'hidden') return null
        const heading = [...root.querySelectorAll('h1, h2')].some(element => element.getClientRects().length && getComputedStyle(element).visibility !== 'hidden' && element.innerText.trim())
        if (!heading) return null
        const text = root.innerText.trim()
        return text.length > 80 && root.querySelector('p, table, .sbdocs-preview') ? text : null
      })
      if (errors.length) throw new Error(errors.join('\n'))
      if (snapshot !== null) {
        readySince ??= performance.now()
        if (performance.now() - readySince >= 500) { text = snapshot; break }
      } else readySince = null
      await page.waitForTimeout(50)
    }
    if (text === null) throw new Error('Docs has no stable meaningful visible body before timeout')
    const errorDisplay = page.locator('.sb-errordisplay, .sb-nopreview')
    for (const element of await errorDisplay.all()) if (await element.isVisible()) errors.push(await element.innerText())
    if (/No Preview|Error rendering story|Failed to fetch dynamically imported module/.test(text)) errors.push(text.slice(0, 300))
    if (errors.length) throw new Error(errors.join('\n'))
    return { ok: true, durationMs: Math.round(performance.now() - start), characters: text.length }
  } catch (error) {
    return { ok: false, durationMs: Math.round(performance.now() - start), error: error.message, runtimeErrors: errors }
  } finally { page.off('pageerror', onError) }
}
