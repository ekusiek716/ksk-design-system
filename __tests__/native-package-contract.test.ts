import { existsSync, readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

const packageJson = JSON.parse(readFileSync("package.json", "utf8"))

describe("native package contract", () => {
  it("native public exports point to shipped JS and type files", () => {
    expect(packageJson.exports["./native"]).toMatchObject({
      types: "./dist/types/tokens/native/index.d.ts",
      import: "./dist/native.js",
      default: "./dist/native.js",
    })
    expect(packageJson.exports["./native/ui"]).toMatchObject({
      types: "./dist/types/native/index.d.ts",
      import: "./dist/native/ui.js",
      default: "./dist/native/ui.js",
    })

    for (const path of [
      "dist/native.js",
      "dist/native/ui.js",
      "dist/types/tokens/native/index.d.ts",
      "dist/types/native/index.d.ts",
    ]) {
      expect(existsSync(path), `${path} must be present in packed releases`).toBe(true)
    }
  })

  it("native-only peers stay optional for Expo installs", () => {
    for (const peer of [
      "expo-blur",
      "expo-glass-effect",
      "react-dom",
      "react-native",
      "tailwindcss",
    ]) {
      expect(packageJson.peerDependenciesMeta[peer]?.optional, peer).toBe(true)
    }
  })

  it("tailwindcss peer keeps allowing Tailwind 3 for NativeWind consumers (issue #296)", () => {
    // Expo consumer は NativeWind の都合で Tailwind ^3.4.x に固定している。
    // native entrypoint のみの利用では Tailwind 4 機能を要求しないため、
    // peer 範囲から 3 系を落とすと consumer の npm install が壊れる。
    expect(packageJson.peerDependencies.tailwindcss).toBe("^3.4.17 || ^4.1.0")
  })

  it("web bundle runtime packages are installed or required peers", () => {
    for (const dependency of [
      "@radix-ui/react-slot",
      "iconsax-reactjs",
      "radix-ui",
    ]) {
      expect(packageJson.dependencies[dependency], dependency).toBeTypeOf("string")
      expect(packageJson.peerDependenciesMeta[dependency], dependency).toBeUndefined()
    }

    expect(packageJson.peerDependencies["react-dom"]).toBeTypeOf("string")
    expect(packageJson.peerDependenciesMeta["react-dom"]?.optional).toBe(true)
  })

  // 配布物に optional peer のスタブが残ると、利用側が実際にインストールしていても
  // require が必ず失敗し、コンポーネントが黙ってフォールバック描画になる。
  // ProgressRing の SVG 描画（#540 / #559）がどの consumer でも動かず、
  // 中央の円板と butt の線端のまま出ていたのはこれが原因（#565 で実機から発見）。
  it("native bundle keeps optional peers as real imports, not throwing stubs", () => {
    const bundle = readFileSync("dist/native/ui.js", "utf8")
    expect(
      bundle.includes("__vite-optional-peer-dep"),
      "external 未指定の optional peer が「必ず throw するスタブ」に置き換わっている。" +
        "vite.config.lib.ts の rollupOptions.external へ追加すること",
    ).toBe(false)
  })

  it("native bundle requires optional peers with a literal require Metro can see", () => {
    const bundle = readFileSync("dist/native/ui.js", "utf8")
    for (const peer of ["react-native-svg", "expo-blur", "expo-glass-effect"]) {
      const calls = [...bundle.matchAll(new RegExp(`([\\w$.]+)\\(["']${peer}["']\\)`, "g"))]
      expect(calls.length, `${peer} の require が出力に無い`).toBeGreaterThan(0)
      for (const [, callee] of calls) {
        expect(
          callee,
          `${peer} が補助関数経由で読まれている。Metro が依存を拾えず実行時に unknown module になる`,
        ).toBe("require")
      }
    }
  })

  it("native optional peers are declared external in the library build", () => {
    const viteConfig = readFileSync("vite.config.lib.ts", "utf8")
    for (const peer of ["react-native-svg", "expo-blur", "expo-glass-effect"]) {
      expect(viteConfig.includes(`"${peer}"`), `${peer} must be external`).toBe(true)
    }
  })
})
