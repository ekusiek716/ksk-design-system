import { execFileSync } from "node:child_process"
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)))
const temp = mkdtempSync(join(tmpdir(), "ksk-web-consumer-"))

const run = (command, args, cwd = temp) => {
  execFileSync(command, args, {
    cwd,
    env: { ...process.env, npm_config_audit: "false", npm_config_fund: "false" },
    stdio: "inherit",
  })
}

try {
  const packOutput = execFileSync(
    "npm",
    ["pack", "--ignore-scripts", "--json", "--pack-destination", temp],
    { cwd: root, encoding: "utf8" },
  )
  const [{ filename }] = JSON.parse(packOutput)
  const tarball = join(temp, filename)

  writeFileSync(
    join(temp, "package.json"),
    `${JSON.stringify({ name: "ksk-empty-web-consumer", private: true, type: "module" }, null, 2)}\n`,
  )
  run("npm", ["install", "--ignore-scripts", tarball])

  mkdirSync(join(temp, "src"))
  writeFileSync(
    join(temp, "index.html"),
    '<div id="root"></div><script type="module" src="/src/main.js"></script>\n',
  )
  writeFileSync(
    join(temp, "src/main.js"),
    [
      'import React from "react"',
      'import { createRoot } from "react-dom/client"',
      'import { Button } from "ksk-design-system"',
      "",
      'createRoot(document.getElementById("root")).render(',
      '  React.createElement(Button, null, "確認する"),',
      ")",
      "",
    ].join("\n"),
  )

  const viteCli = join(root, "node_modules/vite/bin/vite.js")
  run(process.execPath, [viteCli, "build"])

  const installedPackage = JSON.parse(
    readFileSync(join(temp, "node_modules/ksk-design-system/package.json"), "utf8"),
  )
  console.log(`✓ 空 Web consumer で ksk-design-system@${installedPackage.version} を install → build できました`)
} finally {
  rmSync(temp, { recursive: true, force: true })
}
