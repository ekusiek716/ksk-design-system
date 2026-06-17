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

  it("web-only peers stay optional for native-only Expo installs", () => {
    for (const peer of [
      "@radix-ui/react-slot",
      "iconsax-reactjs",
      "radix-ui",
      "react-dom",
      "react-native",
      "tailwindcss",
    ]) {
      expect(packageJson.peerDependenciesMeta[peer]?.optional, peer).toBe(true)
    }
  })
})
