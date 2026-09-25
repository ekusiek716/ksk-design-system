import { test } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'

test('support report includes compound public exports and intentional platform differences', () => {
  const report = JSON.parse(execFileSync(process.execPath, ['scripts/check-native-parity.mjs', '--report-json'], { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 }))
  const byName = new Map(report.records.map(record => [record.name, record]))
  for (const name of ['DetailSheetHeader', 'DetailSheetBody', 'Button']) {
    assert.equal(byName.get(name).webExport, true, `${name} must not be marked absent because the contract groups it`)
    assert.equal(byName.get(name).nativeExport, true)
  }
  assert.equal(byName.get('ResponsiveOverlayFrame').nativeExport, false)
  assert.match(byName.get('ResponsiveOverlayFrame').intentionalDifference, /Web/)
  assert.equal(byName.has('ButtonProps'), false, 'type-only exports are not components')
})
