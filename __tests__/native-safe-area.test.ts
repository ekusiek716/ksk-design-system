import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

import {
  APP_HEADER_IOS_FALLBACK_PADDING_TOP,
  hasInsetEdge,
  resolveAppHeaderPaddingTop,
  resolveBottomSheetTopInset,
  resolveFullscreenDialogPadding,
  resolveInsetEdge,
  resolveTopSheetPaddingTop,
} from "../src/native/safe-area"

/**
 * native の safe-area 対応（issue #351 / web #339 の native 追随）。
 *
 * 依存（react-native-safe-area-context）を増やさず、DS 側は inset を受け取る口だけ
 * 持つ設計（issue の案A）。数値の解決は純関数に切り出してあるので、そこは通常の
 * ユニットテストで固定し、コンポーネント側の結線は（RN のレンダリング基盤が
 * リポジトリに無いため）native-card-radius と同じソーススキャンで固定する。
 *
 * **最重要の契約は後方互換**: inset が供給されていない既存 consumer は
 * 無変更で従来と同じ余白になること。
 */
describe("resolveInsetEdge / hasInsetEdge", () => {
  it("供給値をそのまま返す", () => {
    expect(resolveInsetEdge({ top: 59 }, "top")).toBe(59)
  })

  it("未供給・null・非有限・負値は 0 として扱う", () => {
    expect(resolveInsetEdge(null, "top")).toBe(0)
    expect(resolveInsetEdge(undefined, "top")).toBe(0)
    expect(resolveInsetEdge({}, "top")).toBe(0)
    expect(resolveInsetEdge({ top: Number.NaN }, "top")).toBe(0)
    expect(resolveInsetEdge({ top: -10 }, "top")).toBe(0)
  })

  it("enabled=false（safeArea オプトアウト）では常に 0", () => {
    expect(resolveInsetEdge({ top: 59 }, "top", false)).toBe(0)
  })

  it("hasInsetEdge は 0 を「供給された値」として扱う", () => {
    expect(hasInsetEdge({ top: 0 }, "top")).toBe(true)
    expect(hasInsetEdge({}, "top")).toBe(false)
    expect(hasInsetEdge(null, "top")).toBe(false)
  })
})

describe("resolveAppHeaderPaddingTop", () => {
  const fallbackSpacing = 12

  it("【後方互換】inset 未供給の iOS は従来の決め打ち 48 のまま", () => {
    expect(
      resolveAppHeaderPaddingTop({ insets: null, safeArea: true, isIOS: true, fallbackSpacing }),
    ).toBe(APP_HEADER_IOS_FALLBACK_PADDING_TOP)
    expect(APP_HEADER_IOS_FALLBACK_PADDING_TOP).toBe(48)
  })

  it("【後方互換】inset 未供給の iOS 以外は従来の通常余白のまま", () => {
    expect(
      resolveAppHeaderPaddingTop({ insets: null, safeArea: true, isIOS: false, fallbackSpacing }),
    ).toBe(fallbackSpacing)
  })

  it("inset が供給されていれば決め打ちより優先される（機種ごとの実測値）", () => {
    for (const top of [44, 47, 59, 62]) {
      expect(
        resolveAppHeaderPaddingTop({ insets: { top }, safeArea: true, isIOS: true, fallbackSpacing }),
      ).toBe(top)
    }
  })

  it("inset 0 の端末でも通常余白を下回らない", () => {
    expect(
      resolveAppHeaderPaddingTop({ insets: { top: 0 }, safeArea: true, isIOS: false, fallbackSpacing }),
    ).toBe(fallbackSpacing)
  })

  it("safeArea=false は inset を無視して通常余白になる", () => {
    expect(
      resolveAppHeaderPaddingTop({ insets: { top: 59 }, safeArea: false, isIOS: true, fallbackSpacing }),
    ).toBe(fallbackSpacing)
  })
})

describe("resolveTopSheetPaddingTop", () => {
  it("基準余白に上端 inset を足す", () => {
    expect(resolveTopSheetPaddingTop(16, { top: 47 }, true)).toBe(63)
  })

  it("【後方互換】inset 未供給・オプトアウト時は基準余白のまま", () => {
    expect(resolveTopSheetPaddingTop(16, null, true)).toBe(16)
    expect(resolveTopSheetPaddingTop(16, { top: 47 }, false)).toBe(16)
  })
})

describe("resolveBottomSheetTopInset", () => {
  it("パネル上端が safe-area に食い込む分だけ返す", () => {
    // 画面 800 / パネル 780 → 上端は y=20。inset 47 のうち 27 が足りない
    expect(resolveBottomSheetTopInset({ top: 47 }, true, 800, 780)).toBe(27)
  })

  it("画面いっぱいのパネルでは inset 全量を退避する", () => {
    expect(resolveBottomSheetTopInset({ top: 47 }, true, 800, 800)).toBe(47)
  })

  it("ハーフシート（上端が safe-area に届かない）では 0", () => {
    expect(resolveBottomSheetTopInset({ top: 47 }, true, 800, 440)).toBe(0)
  })

  it("【後方互換】inset 未供給・オプトアウト時は 0", () => {
    expect(resolveBottomSheetTopInset(null, true, 800, 800)).toBe(0)
    expect(resolveBottomSheetTopInset({ top: 47 }, false, 800, 800)).toBe(0)
  })
})

describe("resolveFullscreenDialogPadding", () => {
  it("四辺すべてに inset を加算する", () => {
    expect(
      resolveFullscreenDialogPadding(20, { top: 59, bottom: 34, left: 8, right: 4 }, true),
    ).toEqual({ paddingTop: 79, paddingBottom: 54, paddingLeft: 28, paddingRight: 24 })
  })

  it("【後方互換】inset 未供給・オプトアウト時は基準余白のみ", () => {
    const base = { paddingTop: 20, paddingBottom: 20, paddingLeft: 20, paddingRight: 20 }
    expect(resolveFullscreenDialogPadding(20, null, true)).toEqual(base)
    expect(resolveFullscreenDialogPadding(20, { top: 59 }, false)).toEqual(base)
  })
})

/* ─────────────────────────── 結線（ソーススキャン） */

const read = (p: string) => readFileSync(join(__dirname, "..", p), "utf8")
const providerSource = read("src/native/theme/SafeAreaInsetsProvider.tsx")
const appHeaderSource = read("src/native/components/AppHeader.tsx")
const sheetSource = read("src/native/components/Sheet.tsx")
const dialogSource = read("src/native/components/Dialog.tsx")
const nativeIndexSource = read("src/native/index.ts")

describe("供給の仕組み", () => {
  it("依存を増やさず、消費側が inset を流し込む Provider を持つ", () => {
    expect(providerSource).toContain("export function SafeAreaInsetsProvider")
    expect(providerSource).toContain("export function useSafeAreaInsets")
    // react-native-safe-area-context を DS から import しない（案A）。
    // JSDoc の使用例には出てくるので、行頭の実 import 文だけを見る
    const importsSafeAreaContext = /^[^*\n]*from ["']react-native-safe-area-context["']/m
    expect(providerSource).not.toMatch(importsSafeAreaContext)
    expect(sheetSource).not.toMatch(importsSafeAreaContext)
    expect(dialogSource).not.toMatch(importsSafeAreaContext)
    expect(appHeaderSource).not.toMatch(importsSafeAreaContext)
  })

  it("Provider の外で useSafeAreaInsets を呼んでも例外を投げない（未供給は null）", () => {
    expect(providerSource).toContain("return useContext(SafeAreaInsetsContext)")
    expect(providerSource).not.toContain("throw new Error")
  })

  it("public native エントリから export されている", () => {
    expect(nativeIndexSource).toContain("SafeAreaInsetsProvider")
    expect(nativeIndexSource).toContain("useSafeAreaInsets")
    expect(nativeIndexSource).toContain("type SafeAreaInsets")
  })
})

describe("コンポーネントの結線", () => {
  it("AppHeader は決め打ち 48 を直書きせず純関数経由で解決する", () => {
    expect(appHeaderSource).toContain("resolveAppHeaderPaddingTop({")
    expect(appHeaderSource).not.toMatch(/\?\s*48\s*:/)
  })

  it("AppHeader / Sheet / Dialog は safeArea prop（既定 true）を持つ", () => {
    expect(appHeaderSource).toContain("safeArea = true")
    expect(appHeaderSource).toContain("safeArea?: boolean")
    expect(sheetSource).toContain("safeArea = true")
    expect(sheetSource).toContain("safeArea?: boolean")
    expect(dialogSource).toContain("safeArea = true")
    expect(dialogSource).toContain("safeArea?: boolean")
  })

  it("Sheet は top と全画面級 bottom の両方で inset を見る", () => {
    expect(sheetSource).toContain("resolveTopSheetPaddingTop(")
    expect(sheetSource).toContain("resolveBottomSheetTopInset(")
  })

  it("Dialog は position を持ち、既定は従来どおり center", () => {
    expect(dialogSource).toContain(
      'export type DialogPosition = "center" | "top" | "fullscreen"',
    )
    expect(dialogSource).toMatch(/position = "center"/)
    expect(dialogSource).toContain("resolveFullscreenDialogPadding(")
  })
})
