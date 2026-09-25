import { test } from 'node:test'
import assert from 'node:assert/strict'
import { PNG } from 'pngjs'
import { comparePng } from '../../scripts/lib/visual-compare.mjs'
import { openBrowser, inspectDocs } from '../../scripts/lib/storybook-browser.mjs'
import { createServer } from 'node:http'
import { readFileSync } from 'node:fs'

test('visual gate rejects a shifted control and a missing baseline-size match', () => {
  const image = offset => { const p = new PNG({ width: 100, height: 50 }); p.data.fill(255); for (let y = 10; y < 40; y++) for (let x = offset; x < offset + 40; x++) {const i = (y * 100 + x) * 4; p.data[i] = 0; p.data[i + 1] = 100} return PNG.sync.write(p) }
  assert.equal(comparePng(image(10), image(10)).ok, true)
  assert.equal(comparePng(image(10), image(20)).ok, false)
  assert.equal(comparePng(image(10), PNG.sync.write(new PNG({ width: 50, height: 50 }))).ok, false)
})

test('visual gate rejects removal of the real Chip close icon at full viewport size', () => {
  const original = readFileSync(new URL('./baselines/chip-narrow-light.png', import.meta.url))
  const removed = PNG.sync.read(original)
  assert.equal(removed.width, 390)
  assert.equal(removed.height, 260)
  // Reproduce the review finding: cover only the close glyph with its adjacent
  // button background. The rest of the full viewport remains byte-identical.
  const sample = (30 * removed.width + 188) * 4
  const background = Buffer.from(removed.data.subarray(sample, sample + 4))
  for (let y = 33; y <= 43; y++) {
    for (let x = 188; x <= 199; x++) background.copy(removed.data, (y * removed.width + x) * 4)
  }
  const result = comparePng(original, PNG.sync.write(removed))
  assert.ok(result.pixels > 0, 'the fixture must actually remove visible pixels')
  assert.ok(result.ratio < 0.001, 'this change must reproduce the old ratio-only false negative')
  assert.equal(result.ok, false, 'a missing close icon must fail even in a mostly empty viewport')
  assert.equal(comparePng(original, original).ok, true, 'identical pinned-environment images still pass')
})

test('Docs gate rejects blank and runtime-failing pages, accepts meaningful docs', async () => {
  const text = '<div id="storybook-docs"><h1>Button</h1><p>' + 'Meaningful documentation. '.repeat(8) + '</p></div>'
  const server = createServer((req, res) => {
    res.setHeader('Content-Type', 'text/html')
    if (req.url === '/blank') { res.end('<div id="storybook-docs"></div>'); return }
    const replacement = req.url === '/transient' || req.url === '/becomes-blank'
      ? `<script>setTimeout(() => { document.querySelector('#storybook-docs').innerHTML = '<h1>Loading</h1>' }, 80);${req.url === '/transient' ? `setTimeout(() => { document.body.innerHTML = ${JSON.stringify(text)} }, 900)` : ''}</script>`
      : ''
    res.end(text + replacement + (req.url === '/error' ? '<script>throw new Error("render failed")</script>' : ''))
  })
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const browser = await openBrowser()
  try {
    const page = await browser.newPage()
    const url = `http://127.0.0.1:${server.address().port}`
    assert.equal((await inspectDocs(page, `${url}/ok`, 1500)).ok, true)
    assert.equal((await inspectDocs(page, `${url}/blank`, 1000)).ok, false)
    assert.match((await inspectDocs(page, `${url}/error`, 1500)).error, /render failed/)
    const transient = await inspectDocs(page, `${url}/transient`, 2500)
    assert.equal(transient.ok, true, transient.error)
    assert.ok(transient.durationMs >= 1300, 'wait through the replacement and a new stable-body window')
    assert.equal((await inspectDocs(page, `${url}/becomes-blank`, 1200)).ok, false, 'an initial populated tree cannot hide a final blank Docs page')
  } finally { await browser.close(); await new Promise(resolve => server.close(resolve)) }
})
