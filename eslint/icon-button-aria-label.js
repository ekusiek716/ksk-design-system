/**
 * ESLint プラグイン: icon-only ボタンの aria-label 検出 (A006 / issue #264④)
 *
 * `<Button size="icon" | "icon-sm" | "icon-lg" | "icon-xl">` はアイコンのみを表示する
 * バリアントで、スクリーンリーダー利用者向けのラベルが子要素のテキストとして
 * 存在しない。`aria-label` / `aria-labelledby` の付与が必須（rules.json A006）。
 *
 * axe-core（addon-a11y の自動検査）は実際にレンダリングされた DOM の
 * accessible name を見るため、Storybook に載っているケースは axe 側でも
 * 拾える。本ルールは Storybook を経由しない実装コード（消費側ページ・
 * プロトタイプ等）でも書いた瞬間に検出するための静的な先取りガード。
 *
 * 使い方 (eslint.config.js):
 *   import kskIconButtonAriaLabel from "./eslint/icon-button-aria-label.js"
 *   plugins: { "ksk-a11y": kskIconButtonAriaLabel }
 *   rules: { "ksk-a11y/icon-button-aria-label": "error" }
 */

const ICON_SIZE = /^icon(-sm|-lg|-xl)?$/

function literalSize(node) {
  if (!node) return null
  if (node.type === "Literal" && typeof node.value === "string") return node.value
  if (node.type === "JSXExpressionContainer" && node.expression?.type === "Literal") {
    return typeof node.expression.value === "string" ? node.expression.value : null
  }
  return null
}

function hasAttr(openingElement, names) {
  return openingElement.attributes.some((attr) => {
    if (attr.type !== "JSXAttribute") return false
    const name = attr.name?.name
    return names.includes(name)
  })
}

/** aria-label / aria-labelledby がスプレッド経由で来ている可能性がある場合は誤検知を避けて見逃す。 */
function hasSpread(openingElement) {
  return openingElement.attributes.some((attr) => attr.type === "JSXSpreadAttribute")
}

/** @type {import('eslint').Rule.RuleModule} */
const iconButtonAriaLabel = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Require aria-label/aria-labelledby on icon-only Button (size=icon*) (A006)",
    },
    schema: [],
    messages: {
      missingAriaLabel:
        "[ksk-ds] アイコンのみの Button（size=\"icon\" 系）には aria-label（または aria-labelledby）が必須（A006）。スクリーンリーダー利用者がボタンの目的を認識できない。",
    },
  },
  create(context) {
    const filename = context.filename ?? context.getFilename?.() ?? ""
    if (/\.stories\.[tj]sx?$/.test(filename)) return {}

    return {
      JSXOpeningElement(node) {
        const nameNode = node.name
        if (!nameNode || nameNode.type !== "JSXIdentifier") return
        if (nameNode.name !== "Button") return

        const sizeAttr = node.attributes.find(
          (attr) => attr.type === "JSXAttribute" && attr.name?.name === "size"
        )
        if (!sizeAttr) return
        const size = literalSize(sizeAttr.value)
        if (!size || !ICON_SIZE.test(size)) return

        if (hasSpread(node)) return
        if (hasAttr(node, ["aria-label", "aria-labelledby"])) return

        context.report({ node, messageId: "missingAriaLabel" })
      },
    }
  },
}

export default {
  rules: {
    "icon-button-aria-label": iconButtonAriaLabel,
  },
}
