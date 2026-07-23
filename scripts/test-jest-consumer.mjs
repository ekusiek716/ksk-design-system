#!/usr/bin/env node

import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  rmSync,
} from "node:fs"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { spawnSync } from "node:child_process"

const root = resolve(fileURLToPath(new URL("..", import.meta.url)))
const fixture = join(root, "test/fixtures/jest-consumer")
const temporaryRoot = mkdtempSync(join(tmpdir(), "ksk-jest-consumer-"))

function run(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    stdio: "inherit",
  })
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed with ${result.status}`)
  }
}

try {
  if (!existsSync(join(root, "dist/index.js"))) {
    throw new Error("dist/index.js がありません。先に npm run build:lib を実行してください。")
  }

  const packRoot = join(temporaryRoot, "pack")
  const consumerRoot = join(temporaryRoot, "consumer")
  mkdirSync(packRoot)
  cpSync(fixture, consumerRoot, { recursive: true })

  run(
    "npm",
    ["pack", "--ignore-scripts", "--pack-destination", packRoot],
    root,
  )
  const tarball = readdirSync(packRoot)
    .filter((name) => name.endsWith(".tgz"))
    .map((name) => join(packRoot, name))[0]
  if (!tarball) throw new Error("npm pack の tgz が見つかりません")

  run(
    "npm",
    [
      "install",
      "--ignore-scripts",
      "--no-audit",
      "--no-fund",
      "--package-lock=false",
      tarball,
    ],
    consumerRoot,
  )
  run("npm", ["test"], consumerRoot)
  process.stdout.write("✓ packed tgz を Jest 29 から mock なしで render できました\n")
} finally {
  rmSync(temporaryRoot, { recursive: true, force: true })
}
