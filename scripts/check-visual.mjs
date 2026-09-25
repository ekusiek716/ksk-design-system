#!/usr/bin/env node
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { openBrowser } from './lib/storybook-browser.mjs'
import { comparePng } from './lib/visual-compare.mjs'
import { replaceBaselines } from './lib/visual-baselines.mjs'

if (process.argv.includes('--help')) {
  console.log('node scripts/check-visual.mjs [--url http://127.0.0.1:6010] [--update] [--probe-regression]\nRun inside the pinned Playwright Linux container (see docs/visual-and-docs-checks.md). --update requires VISUAL_BASELINE_REVIEW=1 and never runs in CI.'); process.exit(0)
}
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const update = process.argv.includes('--update')
if (update && (process.env.CI || process.env.VISUAL_BASELINE_REVIEW !== '1')) throw new Error('Baseline update requires an explicit local VISUAL_BASELINE_REVIEW=1; review all changed PNGs in the PR')
if (process.platform !== 'linux' || process.arch !== 'x64' || process.env.KSK_VISUAL_ENV !== 'playwright-1.62.0-noble') throw new Error('Use the pinned Linux visual container; host-generated images cannot become baselines')
const urlIndex = process.argv.indexOf('--url')
const base = (urlIndex < 0 ? process.env.STORYBOOK_URL ?? 'http://127.0.0.1:6010' : process.argv[urlIndex + 1]).replace(/\/$/, '')
const scenarios = JSON.parse(await fs.readFile(path.join(root, 'test/visual/scenarios.json')))
const baseline = path.join(root, 'test/visual/baselines')
const artifacts = path.join(root, 'artifacts/visual')
await fs.mkdir(artifacts, { recursive: true })
const browser = await openBrowser()
const manifest = { environment: process.env.KSK_VISUAL_ENV, arch: process.arch, browser: browser.version(), deviceScaleFactor: 1, locale: 'ja-JP', timezoneId: 'Asia/Tokyo' }
let failed = false
const results = []
const pendingBaselines = new Map()
try {
  if (!update) {
    const expected = JSON.parse(await fs.readFile(path.join(baseline, 'environment.json')))
    if (JSON.stringify(manifest) !== JSON.stringify(expected)) throw new Error('Baseline environment differs. Use pinned container/browser; review a baseline refresh if upgrading.')
  }
  for (const s of scenarios) {
    const page = await browser.newPage({ viewport: { width: s.width, height: s.height }, deviceScaleFactor: 1, locale: manifest.locale, timezoneId: manifest.timezoneId, reducedMotion: 'reduce', colorScheme: s.mode })
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    try {
      await page.goto(`${base}/iframe.html?id=${s.story}&viewMode=story&globals=kskDark:${s.mode};kskHostile:${s.hostile ?? 'off'}`, { waitUntil: 'networkidle' })
      await page.locator(s.dialog ? '[role="dialog"]' : '#storybook-root').waitFor({ state: 'visible' })
      await page.waitForFunction(() => document.querySelector('#storybook-root')?.textContent.trim().length > 0 || document.querySelector('[role="dialog"]'))
      await page.evaluate(() => document.fonts.ready)
      if (errors.length) throw new Error(errors.join('\n'))
      const actual = await page.screenshot({ animations: 'disabled', caret: 'hide' })
      if (process.argv.includes('--probe-regression') && s === scenarios[0]) {
        // Prove the whole browser pipeline detects a real layout regression.
        await page.locator('#storybook-root').evaluate(element => { element.style.paddingLeft = '40px' })
        const shifted = await page.screenshot({ animations: 'disabled', caret: 'hide' })
        const probe = comparePng(actual, shifted)
        if (probe.ok) throw new Error('Negative probe failed: a 40px component shift was not detected')
        console.log(`PASS regression-probe: shifted real Chip rejected (ratio ${probe.ratio})`)
      }
      const file = path.join(baseline, `${s.name}.png`)
      if (update) { pendingBaselines.set(file, actual); results.push({ name: s.name, updated: false, staged: true }) }
      else {
        const result = comparePng(await fs.readFile(file), actual)
        results.push({ name: s.name, ...result, diff: undefined })
        if (!result.ok) {
          failed = true
          await fs.writeFile(path.join(artifacts, `${s.name}-actual.png`), actual)
          if (result.diff) await fs.writeFile(path.join(artifacts, `${s.name}-diff.png`), result.diff)
        }
        console.log(`${result.ok ? 'PASS' : 'FAIL'} ${s.name} ${result.ratio ?? result.reason}`)
      }
    } catch (error) { failed = true; results.push({ name: s.name, ok: false, error: error.message }); console.error(`FAIL ${s.name}: ${error.message}`) }
    finally { await page.close() }
  }
  if (update && !failed) {
    await replaceBaselines(baseline, pendingBaselines, manifest)
    for (const result of results) result.updated = true
  }
} finally { await browser.close() }
await fs.writeFile(path.join(artifacts, 'report.json'), JSON.stringify(results, null, 2) + '\n')
process.exitCode = failed ? 1 : 0
