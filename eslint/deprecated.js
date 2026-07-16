/**
 * ESLint プラグイン: ksk-design-system 非推奨 API 検出
 *
 * 段階的廃止のために、特定の identifier / import パスを警告する。
 * codemod (scripts/codemod/*.mjs) と組み合わせて使う:
 *   1. 新版リリース時: ここに deprecated エントリを追加 → warning
 *   2. 利用側に codemod を案内
 *   3. 次のメジャー: severity を "error" に昇格
 *   4. 完全削除: ここから削除
 *
 * 使い方 (利用側の eslint.config.js):
 *   import kskDeprecated from "ksk-design-system/eslint/deprecated"
 *   export default [
 *     {
 *       plugins: { "ksk-deprecated": kskDeprecated },
 *       rules: { "ksk-deprecated/no-deprecated": "warn" },
 *     },
 *   ]
 */

/**
 * 非推奨エントリ:
 * - identifier: そのままの名前で使われたら警告
 * - kind: "import" だと from ksk-design-system からの import のみ警告
 * - replacement: 置換先（codemod 名と一致させると親切）
 * - removeIn: 削除予定バージョン
 *
 * 例:
 * {
 *   identifier: "Banner",
 *   kind: "import",
 *   replacement: "Alert (variant=\"warning\")",
 *   removeIn: "2.0.0",
 * },
 */
export const DEPRECATED = [
  // 現時点で deprecated エントリなし。
  // 破壊変更時にここに追加し、codemod とセットでリリースする。
]

/** @type {import('eslint').Rule.RuleModule} */
const noDeprecated = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Warn on deprecated ksk-design-system APIs",
    },
    schema: [],
    messages: {
      deprecated:
        "[ksk-ds] {{name}} は非推奨です。{{replacement}} を使ってください{{removeIn}}。",
    },
  },
  create(context) {
    const importedDeprecated = new Map()

    return {
      ImportDeclaration(node) {
        if (node.source.value !== "ksk-design-system") return
        for (const spec of node.specifiers) {
          if (spec.type !== "ImportSpecifier") continue
          const name = spec.imported.name
          const entry = DEPRECATED.find((d) => d.identifier === name)
          if (entry) {
            importedDeprecated.set(spec.local.name, entry)
            context.report({
              node: spec,
              messageId: "deprecated",
              data: {
                name: entry.identifier,
                replacement: entry.replacement || "新 API",
                removeIn: entry.removeIn ? ` (v${entry.removeIn} で削除予定)` : "",
              },
            })
          }
        }
      },

      // identifier として使用された場合（kind === undefined のエントリのみ）
      Identifier(node) {
        const entry = DEPRECATED.find(
          (d) => d.identifier === node.name && d.kind !== "import"
        )
        if (entry) {
          context.report({
            node,
            messageId: "deprecated",
            data: {
              name: entry.identifier,
              replacement: entry.replacement || "新 API",
              removeIn: entry.removeIn ? ` (v${entry.removeIn} で削除予定)` : "",
            },
          })
        }
      },
    }
  },
}

export default {
  rules: {
    "no-deprecated": noDeprecated,
  },
}
