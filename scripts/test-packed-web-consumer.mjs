import { execFileSync, spawnSync } from "node:child_process"
import { existsSync, mkdtempSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync, copyFileSync, realpathSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import assert from "node:assert/strict"
import { build, preview } from "vite"
import tailwindcss from "@tailwindcss/vite"
import { chromium } from "playwright"
import { readReadmeConsumerExample } from "./readme-consumer-example.mjs"

const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)))
const lock = JSON.parse(readFileSync(join(root, "package-lock.json"), "utf8"))
// Use the tested exact versions; independent caret ranges can resolve mismatched React renderers.
const lockedVersion = (name) => {
  const version = lock.packages[`node_modules/${name}`]?.version
  assert.ok(version, `Missing locked consumer dependency: ${name}`)
  return version
}
const temp = realpathSync(mkdtempSync(join(tmpdir(), "ksk-web-consumer-")))
let browser
let server
const run = (command, args, cwd = temp) => execFileSync(command, args, {
  cwd, env: { ...process.env, npm_config_audit: "false", npm_config_fund: "false" }, stdio: "pipe",
})
const write = (path, content) => writeFileSync(join(temp, path), content)
const viteOptions = () => ({ root: temp, configFile: false, plugins: [tailwindcss()], logLevel: "warn", esbuild: { jsx: "automatic" } })
async function mustFail(label, action, expected) {
  let error
  try { await action() } catch (caught) { error = caught }
  assert.ok(error, `${label}: broken fixture unexpectedly passed`)
  const detail = `${error}\n${error.stdout ?? ""}\n${error.stderr ?? ""}`
  assert.match(detail, expected, `${label}: failed for an unrelated reason`)
  console.log(`✓ negative control: ${label}`)
}
try {
  const [{ filename }] = JSON.parse(run("npm", ["pack", "--ignore-scripts", "--json", "--pack-destination", temp], root).toString())
  write("package.json", JSON.stringify({ name: "ksk-empty-web-consumer", private: true, type: "module" }))
  run("npm", ["install", "--ignore-scripts", join(temp, filename), ...["react", "react-dom", "@types/react", "@types/react-dom", "tailwindcss"].map((name) => `${name}@${lockedVersion(name)}`)])
  mkdirSync(join(temp, "src/styles"), { recursive: true })
  // #827: preset が読み込む tw-animate-css は consumer が別途入れなくても届くこと。
  const packedManifest = JSON.parse(readFileSync(join(temp, "node_modules/ksk-design-system/package.json"), "utf8"))
  assert.ok(packedManifest.dependencies?.["tw-animate-css"], "packed dependencies must include tw-animate-css (#827)")
  assert.ok(existsSync(join(temp, "node_modules/tw-animate-css/package.json")), "tw-animate-css must be installed with ksk-design-system (#827)")
  const readme =readFileSync(join(temp, "node_modules/ksk-design-system/README.md"), "utf8")
  const tsx = readReadmeConsumerExample(readme, "tsx")
  const css = readReadmeConsumerExample(readme, "css")
  write("src/readme-example.tsx", tsx)
  write("src/styles/app.css", css)
  write("tsconfig.json", JSON.stringify({ compilerOptions: { target: "ES2022", module: "ESNext", moduleResolution: "Bundler", jsx: "react-jsx", strict: true, skipLibCheck: false, noEmit: true }, include: ["src/readme-example.tsx"] }))
  const typecheck = () => run(process.execPath, [join(root, "node_modules/typescript/bin/tsc"), "--noEmit"])
  typecheck()
  for (const file of ["consumer-hydration.mjs", "consumer-hydration-client.mjs"]) {
    copyFileSync(join(root, "scripts/fixtures", file), join(temp, "src", file))
  }
  write("render.mjs", `import React from 'react';\nimport { renderToString } from 'react-dom/server';\nimport { ConsumerFixture } from './src/consumer-hydration.mjs';\nif (typeof window !== 'undefined' || typeof document !== 'undefined') throw new Error('SSR requires real Node without DOM');\nprocess.stdout.write(renderToString(React.createElement(ConsumerFixture)));\n`)
  const rendered = spawnSync(process.execPath, ["render.mjs"], { cwd: temp, encoding: "utf8" })
  assert.equal(rendered.status, 0, `Node SSR failed: ${rendered.error ?? rendered.stderr}`)
  assert.equal(rendered.stderr, "", "Node SSR must not emit warnings")
  const html = rendered.stdout
  assert.ok(html.includes('id="fixture"'), "Node SSR must produce the fixture")
  // #828: consumer の react-hook-form と DS の Form 部品が同じ Context を共有すること。
  assert.ok(existsSync(join(temp, "node_modules/react-hook-form/package.json")), "react-hook-form must be installed with ksk-design-system (#828)")
  copyFileSync(join(root, "scripts/fixtures/consumer-react-hook-form.mjs"), join(temp, "src/consumer-react-hook-form.mjs"))
  write("render-rhf.mjs", `import { renderReactHookFormCases } from './src/consumer-react-hook-form.mjs';\nprocess.stdout.write(JSON.stringify(renderReactHookFormCases()));\n`)
  const rhf = spawnSync(process.execPath, ["render-rhf.mjs"], { cwd: temp, encoding: "utf8" })
  assert.equal(rhf.status, 0, `react-hook-form consumer SSR failed (#828): ${rhf.error ?? rhf.stderr}`)
  assert.equal(rhf.stderr, "", "react-hook-form consumer SSR must not emit warnings (#828)")
  const rhfCases = JSON.parse(rhf.stdout)
  assert.match(rhfCases.dsForm, /data-consumer-context="shared"[^>]*>山田</, "consumer useFormContext() must see the DS <Form> (#828)")
  assert.match(rhfCases.consumerProvider, /data-slot="form-label"/, "DS FormLabel must render under consumer <FormProvider> (#828)")
  assert.match(rhfCases.consumerProvider, /value="佐藤"/, "DS RhfFormField must read the consumer form (#828)")
  const bundledDistJs = readFileSync(join(temp, "node_modules/ksk-design-system/dist/index.js"), "utf8")
  for (const dependency of ["react-hook-form", "react-day-picker"]) {
    assert.ok(!bundledDistJs.includes(`//#region node_modules/${dependency}/`), `${dependency} must not be bundled into dist (#828)`)
    assert.match(bundledDistJs, new RegExp(`from\\s*["']${dependency}["']`), `${dependency} must stay a bare import (#828)`)
  }
  write("index.html", `<!doctype html><html lang="ja"><head><meta charset="utf-8"><link rel="icon" href="data:,"></head><body><div id="root">${html}</div><script type="module" src="/src/consumer-hydration-client.mjs"></script></body></html>`)
  await build(viteOptions())
  // Prove the real consumer compiler/build detects the failures this gate claims to catch.
  await mustFail("missing README marker", () => readReadmeConsumerExample(readme.replace("<!-- consumer-example:tsx:start -->", ""), "tsx"), /exactly one/)
  try {
    write("src/readme-example.tsx", `${tsx}\nimport { MissingConsumerExport } from 'ksk-design-system';\nexport const broken = MissingConsumerExport;\n`)
    await mustFail("invalid README public export", typecheck, /MissingConsumerExport/)
  } finally { write("src/readme-example.tsx", tsx) }
  try {
    write("src/styles/app.css", `${css}\n@import "ksk-design-system/missing-consumer-style";\n`)
    await mustFail("invalid README CSS import", () => build(viteOptions()), /missing-consumer-style/)
  } finally { write("src/styles/app.css", css) }
  // The negative CSS build can clear output before failing; restore the valid artifact.
  await build(viteOptions())
  // #827: README の CSS 例（tailwindcss + preset）だけで開閉アニメの CSS が作られること。
  const builtCss = readdirSync(join(temp, "dist/assets")).filter((name) => name.endsWith(".css"))
    .map((name) => readFileSync(join(temp, "dist/assets", name), "utf8")).join("\n")
  for (const selector of [
    /\.animate-in[{,]/,
    /\.fade-in-0[{,]/,
    /\.zoom-in-95[{,]/,
    /\.data-\\\[state\\=open\\\]\\:animate-accordion-down\[data-state=["']?open["']?\]/,
    /\.data-\\\[state\\=closed\\\]\\:animate-accordion-up\[data-state=["']?closed["']?\]/,
    /@keyframes enter\{/,
    /@keyframes accordion-down\{/,
  ]) {
    assert.match(builtCss, selector, `README consumer CSS must define ${selector} (#827)`)
  }
  server = await preview({ root: temp, configFile: false, logLevel: "warn", preview: { host: "127.0.0.1", port: 0, strictPort: true } })
  const address = server.httpServer.address()
  assert.ok(address && typeof address !== "string")
  const url = `http://127.0.0.1:${address.port}`
  browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ locale: "ja-JP", timezoneId: "Asia/Tokyo" })
  const diagnostics = []
  page.on("pageerror", (error) => diagnostics.push(String(error)))
  page.on("console", (message) => {
    if (["warning", "error"].includes(message.type())) diagnostics.push(message.text())
  })
  await page.goto(url)
  await page.waitForFunction(() => window.__hydrated === true)
  assert.deepEqual(await page.evaluate(() => window.__recoverable), [])
  assert.equal(await page.evaluate(() => document.getElementById("fixture") === window.__serverMain && document.querySelector("input") === window.__serverInput), true)
  const input = page.getByLabel("名前", { exact: true })
  assert.equal(await input.inputValue(), "山田", "hydration preserves the initial input value")
  await input.fill("佐藤")
  assert.equal(await input.inputValue(), "佐藤")
  await page.getByRole("button", { name: "詳細を開く" }).click()
  await page.getByRole("dialog").waitFor({ state: "visible" })
  await page.keyboard.press("Escape")
  await page.getByRole("dialog").waitFor({ state: "hidden" })
  assert.match(await page.getByRole("combobox", { name: "種類" }).innerText(), /選択肢A/, "hydration preserves the initial selection")
  await page.getByRole("combobox", { name: "種類" }).click()
  await page.getByRole("option", { name: "選択肢B" }).click()
  assert.match(await page.getByRole("combobox", { name: "種類" }).innerText(), /選択肢B/)
  await page.getByRole("button", { name: "通知する" }).click()
  await page.getByText("保存しました", { exact: true }).first().waitFor()
  assert.deepEqual(await page.evaluate(() => window.__recoverable), [])
  assert.deepEqual(diagnostics, [], "positive hydration and interactions must not emit warnings/errors")
  const brokenPage = await browser.newPage({ locale: "ja-JP", timezoneId: "Asia/Tokyo" })
  await brokenPage.goto(`${url}/?mismatch=1`)
  await brokenPage.waitForFunction(() => window.__hydrated === true && window.__recoverable.length > 0)
  assert.match((await brokenPage.evaluate(() => window.__recoverable)).join("\n"), /hydration|hydrated|server rendered|errors\/418/i)
  console.log("✓ README TSX/CSS and real Node → Chromium hydration passed; broken fixtures rejected")
} catch (error) {
  if (error.stdout) process.stderr.write(error.stdout)
  if (error.stderr) process.stderr.write(error.stderr)
  throw error
} finally {
  try { await browser?.close() } finally {
    try {
      await server?.close()
    } finally { rmSync(temp, { recursive: true, force: true }) }
  }
}
