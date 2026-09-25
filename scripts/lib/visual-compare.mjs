import { PNG } from 'pngjs'

// Pinned Linux/browser/font runs reproduce all six baselines with zero changed
// pixels. Keep that observed budget: a viewport-wide ratio alone can hide a
// missing small icon (the Chip close glyph occupies only 34 changed pixels).
// The per-channel tolerance still absorbs <=8/255 color noise. Any pixel above
// that tolerance must be reviewed, regardless of how large the viewport is.
// Alpha, shape and dimensions are included; no silently resized baselines.
export function comparePng(expected, actual, maxRatio = 0.001) {
  const a = PNG.sync.read(expected), b = PNG.sync.read(actual)
  if (a.width !== b.width || a.height !== b.height) return { ok: false, reason: 'dimensions', expected: [a.width, a.height], actual: [b.width, b.height] }
  let pixels = 0
  const diff = new PNG({ width: a.width, height: a.height })
  for (let i = 0; i < a.data.length; i += 4) {
    const changed = [0, 1, 2, 3].some(channel => Math.abs(a.data[i + channel] - b.data[i + channel]) > 8)
    if (changed) pixels++
    diff.data[i] = changed ? 255 : b.data[i]
    diff.data[i + 1] = changed ? 0 : b.data[i + 1]
    diff.data[i + 2] = changed ? 128 : b.data[i + 2]
    diff.data[i + 3] = 255
  }
  const ratio = pixels / (a.width * a.height)
  return { ok: pixels === 0 && ratio <= maxRatio, pixels, ratio, maxChangedPixels: 0, diff: PNG.sync.write(diff) }
}
