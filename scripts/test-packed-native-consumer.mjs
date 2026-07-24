import { execFileSync } from "node:child_process"
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)))
const rootPackageJson = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
)
const temp = mkdtempSync(join(tmpdir(), "ksk-native-consumer-"))

const versionOf = (name) =>
  rootPackageJson.devDependencies[name] ??
  rootPackageJson.dependencies?.[name] ??
  rootPackageJson.peerDependencies[name]

const run = (command, args) => {
  execFileSync(command, args, {
    cwd: temp,
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
    `${JSON.stringify({ name: "ksk-empty-native-consumer", private: true }, null, 2)}\n`,
  )
  run("npm", [
    "install",
    "--ignore-scripts",
    tarball,
    `react@${versionOf("react")}`,
    `react-native@${versionOf("react-native")}`,
    `react-native-svg@${versionOf("react-native-svg")}`,
    `@react-navigation/bottom-tabs@${versionOf("@react-navigation/bottom-tabs")}`,
    `@types/react@${versionOf("@types/react")}`,
    `typescript@${versionOf("typescript")}`,
  ])

  writeFileSync(
    join(temp, "tsconfig.json"),
    `${JSON.stringify(
      {
        compilerOptions: {
          strict: true,
          noEmit: true,
          jsx: "react-jsx",
          module: "ESNext",
          moduleResolution: "Bundler",
          target: "ES2022",
          lib: ["ES2022"],
          types: ["react", "react-native"],
          skipLibCheck: true,
        },
        include: ["consumer.tsx"],
      },
      null,
      2,
    )}\n`,
  )
  writeFileSync(
    join(temp, "consumer.tsx"),
    [
      'import { Button, ThemeProvider } from "ksk-design-system/native/ui"',
      'import { getTheme, themes } from "ksk-design-system/native"',
      "",
      'const defaultTheme = getTheme("default", "light")',
      "void themes",
      "void defaultTheme",
      "",
      "export function Consumer() {",
      '  return <ThemeProvider initialName="default"><Button>確認する</Button></ThemeProvider>',
      "}",
      "",
    ].join("\n"),
  )
  run(process.execPath, [
    join(temp, "node_modules/typescript/bin/tsc"),
    "--project",
    "tsconfig.json",
  ])

  const installedPackage = JSON.parse(
    readFileSync(join(temp, "node_modules/ksk-design-system/package.json"), "utf8"),
  )
  console.log(
    `✓ 空 Native consumer で ksk-design-system@${installedPackage.version} を install → typecheck できました`,
  )
} finally {
  rmSync(temp, { recursive: true, force: true })
}
