import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

/**
 * CompactFilePicker の native loadingLabel 橋渡し（issue #539）。
 *
 * web は既定値 "処理中" を持ち、loading 中はトリガーボタンの文言そのものを
 * 差し替える（web の Button は spinner を持たないため）。native は
 * loadingLabel/loading を native Button へそのまま橋渡しするだけで、
 * 文言の組み立ては Button.loading 側（ActivityIndicator + 任意の
 * loadingLabel テキスト）に委ねる。そのため native には既定値が無く、
 * 未指定なら spinner のみが表示される — web/native で意図的に非対称
 * （scripts/check-native-parity.mjs の INTENTIONAL_DEFAULT_GAPS 参照）。
 *
 * RN のレンダリングテスト基盤がリポジトリに無いため、native-chip-a11y と
 * 同じソーススキャン方式で「未指定なら文言なし＝spinner のみ・指定時は
 * Button にそのまま渡る」ことを契約として固定する。
 */
const compactFilePickerSource = readFileSync(
  join(__dirname, "..", "src/native/components/CompactFilePicker.tsx"),
  "utf8",
)
const buttonSource = readFileSync(join(__dirname, "..", "src/native/components/Button.tsx"), "utf8")

describe("CompactFilePicker の native loadingLabel 橋渡し（#539）", () => {
  it("loadingLabel に destructure default を持たない（未指定は undefined のまま Button へ渡る）", () => {
    expect(compactFilePickerSource).toMatch(/loadingLabel,\s*\n\s*icon,/)
  })

  it("loading と loadingLabel をそのまま native Button へ橋渡しする", () => {
    expect(compactFilePickerSource).toMatch(/loading=\{loading\}\s*\n\s*loadingLabel=\{loadingLabel\}/)
  })

  it("Button.loading は loadingLabel 未指定なら文言なし（spinner のみ）、指定時のみテキストを表示する", () => {
    // ButtonContent の分岐: loadingLabel が falsy なら ActivityIndicator だけ、
    // truthy なら併せてテキストを表示する。CompactFilePicker はここへ
    // loadingLabel をそのまま渡すだけなので、この分岐がそのまま既定挙動になる。
    expect(buttonSource).toContain("<ActivityIndicator size=\"small\" color={spinnerColor ?? color} />")
    expect(buttonSource).toContain("{loadingLabel ? <RNText style={labelStyle}>{loadingLabel}</RNText> : null}")
  })
})
