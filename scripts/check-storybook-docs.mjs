#!/usr/bin/env node
import fs from 'node:fs/promises'
import path from 'node:path'
import { openBrowser, inspectDocs } from './lib/storybook-browser.mjs'

if (process.argv.includes('--help')) {
  console.log('node scripts/check-storybook-docs.mjs [--url http://127.0.0.1:6010] [--filter text] [--timeout 30000] [--output artifacts/docs-report.json]\nStart Storybook first (npm run storybook -- --ci --no-open), or serve storybook-static. Every docs entry in index.json is checked.'); process.exit(0)
}
const arg = (name, fallback) => process.argv.includes(name) ? process.argv[process.argv.indexOf(name) + 1] : fallback
const base = arg('--url', process.env.STORYBOOK_URL ?? 'http://127.0.0.1:6010').replace(/\/$/, '')
const timeout = Number(arg('--timeout', '30000'))
const output = arg('--output', 'artifacts/docs-report.json')
const response = await fetch(`${base}/index.json`)
if (!response.ok) throw new Error(`index.json: HTTP ${response.status}`)
const index = await response.json()
const entries = Object.values(index.entries).filter(entry => entry.type === 'docs' && entry.id.includes(arg('--filter', '')))
if (!entries.length) throw new Error('No Docs entries found; refusing an empty successful run')
const browser = await openBrowser()
const results = []
try {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } })
  for (const entry of entries) {
    const page = await context.newPage()
    const url = `${base}/iframe.html?id=${encodeURIComponent(entry.id)}&viewMode=docs`
    const result = { id: entry.id, title: entry.title, url, ...await inspectDocs(page, url, timeout) }
    results.push(result)
    await page.close()
    console.log(`${result.ok ? 'PASS' : 'FAIL'} ${entry.id} ${result.durationMs}ms${result.error ? ` ${result.error.split('\n')[0]}` : ''}`)
  }
} finally { await browser.close() }
await fs.mkdir(path.dirname(output), { recursive: true })
await fs.writeFile(output, JSON.stringify({ base, checkedAt: new Date().toISOString(), total: results.length, failed: results.filter(r => !r.ok).length, results }, null, 2) + '\n')
process.exitCode = results.some(r => !r.ok) ? 1 : 0
