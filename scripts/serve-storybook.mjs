import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
const root = path.resolve(process.argv[2] ?? 'storybook-static')
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2' }
createServer(async (req, res) => {
  try {
    const name = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
    const file = path.resolve(root, '.' + (name === '/' ? '/index.html' : name))
    if (!file.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return }
    const body = await readFile(file)
    res.setHeader('Content-Type', types[path.extname(file)] ?? 'application/octet-stream')
    res.end(body)
  } catch { res.writeHead(404); res.end('Not found') }
}).listen(Number(process.argv[3] ?? 6010), '0.0.0.0')
