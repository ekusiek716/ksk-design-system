#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const data = JSON.parse(execFileSync(process.execPath, [path.join(root, 'scripts/check-native-parity.mjs'), '--report-json'], { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 }))
const verification = JSON.parse(fs.readFileSync(path.join(root, 'contracts/native-device-verification.json')))
for (const observation of verification.observations) {
  for (const field of ['checkId', 'platform', 'os', 'device', 'revision', 'checkedAt', 'status', 'evidence']) {
    if (typeof observation[field] !== 'string' || !observation[field].trim()) throw new Error(`Native observation missing ${field}`)
  }
  if (!verification.checks.some(check => check.id === observation.checkId)) throw new Error(`Unknown device check: ${observation.checkId}`)
  if (!['passed', 'failed'].includes(observation.status)) throw new Error('Device status must be passed or failed')
  if (!Array.isArray(observation.components) || !observation.components.length) throw new Error('Device observation requires components')
}
const cell = value => String(value ?? '—').replaceAll('|', '\\|').replaceAll('\n', ' ')
const lines = ['# Web / Native 対応表', '', '<!-- AUTO-GENERATED: node scripts/generate-native-support.mjs -->', '', '正本: contracts/components.json / src/index.ts / src/native/components/index.ts / scripts/check-native-parity.mjs / contracts/native-device-verification.json。', '', '**対応ありは export の存在を示します。機能・見た目・実機の同等性を保証しません。**', 'props は直接宣言分のみ。継承props・型・複合部品の子propsは含みません。「抽出不可」を「差なし」と解釈しないでください。', '', '| 部品 | Web | Native | Webのみの直接props | Nativeのみの直接props | 意図した差・注意 | 実OSの検証記録 |', '|---|---|---|---|---|---|---|']
for (const r of data.records) {
  const records = verification.observations.filter(o => o.components?.includes(r.name))
  const note = [r.intentionalDifference, r.documentedPropDifference?.reason, r.documentedDefaultDifference ? `既定値差: ${JSON.stringify(r.documentedDefaultDifference)}` : null].filter(Boolean).join(' / ')
  lines.push(`| ${cell(r.name)} | ${r.webExport ? 'あり' : 'なし'} | ${r.nativeExport ? 'あり' : 'なし'} | ${cell(r.propDifference?.webOnly.join(', ') ?? '抽出不可')} | ${cell(r.propDifference?.nativeOnly.join(', ') ?? '抽出不可')} | ${cell(note)} | ${cell(records.length ? records.map(o => `${o.platform} ${o.os} ${o.status} (${o.revision})`).join(', ') : '未検証')} |`)
}
lines.push('', '## 実OS検証', '', '[検証アプリと手順](../examples/native-device-review/README.md)を使い、OS・端末・コミット・確認項目・結果・証拠パスを台帳へ残します。未確認を完了として表示しません。', '')
const file = path.join(root, 'docs/native-support.md')
const text = lines.join('\n')
if (process.argv.includes('--check')) {
  if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== text) {console.error('native-support.md is stale; run node scripts/generate-native-support.mjs'); process.exitCode = 1}
} else fs.writeFileSync(file, text)
