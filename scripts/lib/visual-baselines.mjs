import fs from 'node:fs/promises'
import path from 'node:path'

// All images and the environment manifest must be writable before touching the
// existing directory. A failed promotion restores the previous complete set.
export async function replaceBaselines(baseline, images, manifest) {
  const parent = path.dirname(baseline)
  await fs.mkdir(parent, { recursive: true })
  const staging = await fs.mkdtemp(path.join(parent, '.baselines-stage-'))
  const backup = staging + '-previous'
  let previousMoved = false
  let promoted = false
  try {
    for (const [file, image] of images) await fs.writeFile(path.join(staging, path.basename(file)), image)
    await fs.writeFile(path.join(staging, 'environment.json'), JSON.stringify(manifest, null, 2) + '\n')
    try { await fs.rename(baseline, backup); previousMoved = true }
    catch (error) { if (error.code !== 'ENOENT') throw error }
    try { await fs.rename(staging, baseline); promoted = true }
    catch (error) {
      if (previousMoved) { await fs.rename(backup, baseline); previousMoved = false }
      throw error
    }
  } finally {
    await fs.rm(staging, { recursive: true, force: true })
    // Never remove the only preserved copy if restoring it itself failed.
    if (promoted && previousMoved) await fs.rm(backup, { recursive: true, force: true })
  }
}
