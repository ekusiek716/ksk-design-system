import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { replaceBaselines } from '../../scripts/lib/visual-baselines.mjs'

test('failed staging keeps the entire previous baseline set unchanged', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ksk-baseline-test-'))
  const baseline = path.join(root, 'baselines')
  await fs.mkdir(baseline)
  await fs.writeFile(path.join(baseline, 'chip.png'), 'previous image')
  await fs.writeFile(path.join(baseline, 'environment.json'), 'previous environment')
  try {
    // The first image writes to staging; the second intentionally fails before
    // promotion. This must not overwrite even that first existing image.
    await assert.rejects(replaceBaselines(baseline, new Map([
      ['chip.png', Buffer.from('new image')], ['sheet.png', Symbol('unwritable image')],
    ]), { browser: 'new browser' }), { code: 'ERR_INVALID_ARG_TYPE' })
    assert.equal(await fs.readFile(path.join(baseline, 'chip.png'), 'utf8'), 'previous image')
    assert.equal(await fs.readFile(path.join(baseline, 'environment.json'), 'utf8'), 'previous environment')
    assert.deepEqual(await fs.readdir(root), ['baselines'])
    await replaceBaselines(baseline, new Map([['chip.png', Buffer.from('new image')]]), { browser: 'new browser' })
    assert.equal(await fs.readFile(path.join(baseline, 'chip.png'), 'utf8'), 'new image')
    assert.equal(JSON.parse(await fs.readFile(path.join(baseline, 'environment.json'))).browser, 'new browser')
    assert.deepEqual(await fs.readdir(root), ['baselines'])
  } finally { await fs.rm(root, { recursive: true, force: true }) }
})

test('container wrapper ignores failed partial updates and accepts --update after other arguments', async () => {
  const { execFileSync } = await import('node:child_process')
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ksk-wrapper-test-'))
  const baseline = path.join(root, 'test/visual/baselines')
  const bin = path.join(root, 'bin')
  await fs.mkdir(baseline, { recursive: true })
  await fs.mkdir(bin)
  await fs.mkdir(path.join(root, 'scripts/lib'), { recursive: true })
  await fs.writeFile(path.join(root, 'package.json'), '{"type":"module"}')
  await fs.writeFile(path.join(root, 'package-lock.json'), '{}')
  await fs.copyFile(new URL('../../scripts/lib/visual-baselines.mjs', import.meta.url), path.join(root, 'scripts/lib/visual-baselines.mjs'))
  await fs.writeFile(path.join(baseline, 'chip.png'), 'previous image')
  await fs.writeFile(path.join(baseline, 'environment.json'), '{}')
  await fs.writeFile(path.join(bin, 'npm'), '#!/bin/bash\nexit 0\n', { mode: 0o755 })
  await fs.writeFile(path.join(bin, 'node'), `#!/bin/bash
case "$1" in
  */serve-storybook.mjs) exit 0 ;;
  scripts/check-visual.mjs)
    mkdir -p artifacts test/visual/baselines
    printf 'new image' > test/visual/baselines/chip.png
    printf '{}' > test/visual/baselines/environment.json
    exit "$KSK_STUB_VISUAL_STATUS" ;;
esac
exec "${process.execPath}" "$@"
`, { mode: 0o755 })
  const script = new URL('../../scripts/run-visual-container.sh', import.meta.url).pathname
  const env = { ...process.env, PATH: `${bin}:${process.env.PATH}`, KSK_STUB_VISUAL_STATUS: '7' }
  try {
    assert.throws(() => execFileSync('bash', [script, '--probe-regression', '--update'], { cwd: root, env, stdio: 'pipe' }), { status: 7 })
    assert.equal(await fs.readFile(path.join(baseline, 'chip.png'), 'utf8'), 'previous image')
    execFileSync('bash', [script, '--probe-regression', '--update'], { cwd: root, env: { ...env, KSK_STUB_VISUAL_STATUS: '0' }, stdio: 'pipe' })
    assert.equal(await fs.readFile(path.join(baseline, 'chip.png'), 'utf8'), 'new image')
  } finally { await fs.rm(root, { recursive: true, force: true }) }
})
