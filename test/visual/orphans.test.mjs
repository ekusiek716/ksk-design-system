import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { allScenarios, findOrphanBaselines, taggedScenarios } from '../../scripts/lib/visual-scenarios.mjs'

const entries = {
  'components-button--all-variants': { id: 'components-button--all-variants', type: 'story', tags: ['autodocs', 'vrt'] },
  'components-button--default': { id: 'components-button--default', type: 'story', tags: ['autodocs'] },
  'components-button--docs': { id: 'components-button--docs', type: 'docs', tags: ['vrt'] },
}

test('only stories tagged "vrt" become light/dark scenarios', () => {
  assert.deepEqual(taggedScenarios(entries).map(s => s.name), [
    'components-button--all-variants--light',
    'components-button--all-variants--dark',
  ])
})

test('duplicate scenario names are rejected instead of overwriting a baseline', () => {
  assert.throws(() => allScenarios([{ name: 'components-button--all-variants--light' }], entries), /重複/)
})

test('orphan detection flags baselines of removed or untagged stories', () => {
  const scenarios = allScenarios([{ name: 'chip-narrow-light' }], entries)
  const files = ['chip-narrow-light.png', 'components-button--all-variants--light.png', 'components-button--all-variants--dark.png', 'components-button--default--light.png', 'environment.json']
  assert.deepEqual(findOrphanBaselines(files, scenarios), ['components-button--default--light.png'])
})

// Real check against the built Storybook. CI builds storybook-static before the
// guards; locally the test is skipped until `npm run build-storybook` has run.
const indexPath = new URL('../../storybook-static/index.json', import.meta.url)
test('committed baselines all belong to a current scenario', { skip: !existsSync(indexPath) && !process.env.CI && 'storybook-static/index.json not built' }, () => {
  const scenarios = allScenarios(JSON.parse(readFileSync(new URL('./scenarios.json', import.meta.url))), JSON.parse(readFileSync(indexPath)).entries)
  const orphans = findOrphanBaselines(readdirSync(new URL('./baselines', import.meta.url)), scenarios)
  assert.deepEqual(orphans, [], `unused baselines (delete them or re-run the baseline update): ${orphans.join(', ')}`)
  const ledger = JSON.parse(readFileSync(new URL('../known-exceptions.json', import.meta.url)))
  const unknown = (ledger.visual ?? []).filter(entry => !scenarios.some(s => s.name === entry.scenario)).map(entry => entry.scenario)
  assert.deepEqual(unknown, [], `test/known-exceptions.json "visual" lists scenarios that no longer exist: ${unknown.join(', ')}`)
})
