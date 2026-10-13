import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
// usage: node scripts/serve-storybook.mjs [dir=storybook-static] [port=6010]
// port 0 lets the OS pick a free port, so parallel runs never collide. The
// bound URL is printed as `KSK_STORYBOOK_URL=http://127.0.0.1:<port>` once the
// server accepts connections (scripts/run-visual-container.sh waits for it).
const root = path.resolve(process.argv[2] ?? 'storybook-static')
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2' }
const server = createServer(async (req, res) => {
  try {
    const name = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
    const file = path.resolve(root, '.' + (name === '/' ? '/index.html' : name))
    if (!file.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return }
    const body = await readFile(file)
    res.setHeader('Content-Type', types[path.extname(file)] ?? 'application/octet-stream')
    res.end(body)
  } catch { res.writeHead(404); res.end('Not found') }
})
server.listen(Number(process.argv[3] ?? 6010), '0.0.0.0', () => {
  console.log(`KSK_STORYBOOK_URL=http://127.0.0.1:${server.address().port}`)
})
