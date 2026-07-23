#!/usr/bin/env node

import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  rmSync,
} from "node:fs"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { spawnSync } from "node:child_process"
import { createRequire } from "node:module"

const root = resolve(fileURLToPath(new URL("..", import.meta.url)))
const fixture = join(root, "test/fixtures/jest-consumer")
const temporaryRoot = mkdtempSync(join(tmpdir(), "ksk-jest-consumer-"))
const require = createRequire(import.meta.url)

function verifyTransformIgnorePatterns() {
  const { transformIgnorePatterns } = require(
    join(fixture, "jest.config.cjs"),
  )
  const consumerRoot = "/consumer"
  const isIgnored = (path) =>
    transformIgnorePatterns.some((pattern) =>
      new RegExp(pattern.replaceAll("<rootDir>", consumerRoot)).test(path),
    )
  const mustTransform = [
    "/consumer/node_modules/ksk-design-system/dist/index.js",
    "/consumer/node_modules/.pnpm/ksk-design-system@1.45.0/node_modules/ksk-design-system/dist/index.js",
    "/consumer/node_modules/.pnpm/@radix-ui+react-slot@1.2.0/node_modules/@radix-ui/react-slot/dist/index.mjs",
  ]
  for (const path of mustTransform) {
    if (isIgnored(path)) {
      throw new Error(`Jest が ESM dependency を変換対象から外します: ${path}`)
    }
  }
  const unrelated =
    "/consumer/node_modules/.pnpm/lodash@4.17.21/node_modules/lodash/lodash.js"
  if (!isIgnored(unrelated)) {
    throw new Error(`Jest が無関係な dependency まで変換します: ${unrelated}`)
  }
}

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
  verifyTransformIgnorePatterns()

  const packRoot = join(temporaryRoot, "pack")
  const consumerRoot = join(temporaryRoot, "consumer")
  mkdirSync(packRoot)
  cpSync(fixture, consumerRoot, { recursive: true })

  run(
    "npm",
    ["pack", "--pack-destination", packRoot],
    root,
  )
  const tarball = readdirSync(packRoot)
    .filter((name) => name.endsWith(".tgz"))
    .map((name) => join(packRoot, name))[0]
  if (!tarball) throw new Error("npm pack の tgz が見つかりません")

  run(
    "npm",
    ["ci", "--ignore-scripts", "--no-audit", "--no-fund"],
    consumerRoot,
  )
  run(
    "npm",
    [
      "install",
      "--ignore-scripts",
      "--no-audit",
      "--no-fund",
      "--no-save",
      tarball,
    ],
    consumerRoot,
  )
  run("npm", ["test"], consumerRoot)
  process.stdout.write("✓ packed tgz を Jest 29 から mock なしで render できました\n")
} finally {
  rmSync(temporaryRoot, { recursive: true, force: true })
}
