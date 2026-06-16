/**
 * ESLint プラグイン: ksk-design-system 無色ボーダー検出 (P032)
 *
 * Tailwind v4 で border-color の既定が currentColor に変わったため、
 * `border` / `border-b` 等を色なしで書くと要素の文字色が枠線に透けて出る
 * （消費側が濃色テキストを敷くと枠線が黒ずむ）。preset.css の base layer に
 * --border へのフォールバック保険は入れたが、コンポーネントは明示が原則。
 * このルールはその dev/CI ガード。
 *
 * 肝: 1 要素に到達しうる className 文字列を「統合」してからクラス集合に分解し、
 *     集合内に裸の border 幅トークンがあり、かつ border-color トークンが
 *     一切無い要素のみ報告する。CVA は base + 全 variant 値、cn()/三項は
 *     各引数・両枝をまとめて 1 集合とみなす。これにより
 *       - badge: base に `border`、別 variant に border-transparent / border-[var]
 *       - 入力系: open/closed 三項で border-[var] を供給
 *     のような「正当な無色 border」を誤検知しない。
 *
 * lint-scratch.sh は ui/patterns を検査対象外にしているため、こちらで補う。
 *
 * 使い方 (eslint.config.js):
 *   import kskNoColorlessBorder from "./eslint/no-colorless-border.js"
 *   plugins: { "ksk-border": kskNoColorlessBorder }
 *   rules: { "ksk-border/no-colorless-border": "warn" }
 */

// 裸の border 幅トークン（色を供給せず currentColor に依存する＝問題の本体）:
//   border / border-t..y / border-[Npx] / border-b-[3px]
// マッチしない（＝裸とみなさない）: border-0|2|4|8（幅のみ・色は別管理に委ねる）,
//   border-[var(...)] 等の色, border-none|collapse|separate|solid|dashed|dotted,
//   状態接頭辞付き（file:border-0 等は別要素/別 state なので集合判定に乗せない）。
const NAKED_BORDER_WIDTH = /^border(-[tblrxy])?(-\[\d+(?:\.\d+)?px\])?$/

// border-color トークン（集合内に 1 つでもあれば報告しない）:
//   border-[var(...)] / border-[#hex] / border-[rgb(...)]（px 幅 [Npx] は除外）,
//   border-transparent / border-current / border-white|black/inherit,
//   側指定付き（border-l-[var] / border-t-transparent）,
//   状態接頭辞付き（hover:/focus*:/aria-*:/data-[...]:/group-*:/peer-*:/[&...]: 等）,
//   不透明度サフィックス（border-[var(...)]/20 / border-white/10）。
const BORDER_COLOR =
  /(^|:)border(-[tblrxy])?-(\[(?!\d+(?:\.\d+)?px\])[^\]]*\]|transparent|current|inherit|white|black)(\/\d+)?$/

// クラス結合ユーティリティ（この呼び出しの引数は className 断片とみなして再帰する）。
const CLASS_UTILS = new Set([
  "cn",
  "clsx",
  "cx",
  "cva",
  "tv",
  "twMerge",
  "twJoin",
  "classNames",
])

function calleeName(node) {
  const c = node.callee
  if (!c) return null
  if (c.type === "Identifier") return c.name
  if (c.type === "MemberExpression" && c.property?.type === "Identifier") {
    return c.property.name
  }
  return null
}

/** スコープを遡って識別子の定義（const x = <init>）の init 式を返す。 */
function variableInit(scope, name) {
  let s = scope
  while (s) {
    const v = s.variables.find((vv) => vv.name === name)
    if (v) {
      for (const def of v.defs) {
        if (def.node?.type === "VariableDeclarator" && def.node.init) {
          return def.node.init
        }
      }
      return null
    }
    s = s.upper
  }
  return null
}

/**
 * AST 式を再帰的に辿り、到達しうる className 文字列断片を out へ集める。
 * - 三項: test を無視し consequent / alternate の両枝を集める
 * - && / || / ??: 両辺
 * - cn()/cva() 等: 全引数（cva は base 文字列 + variants オブジェクト値）
 * - object/array: 値・要素を辿る（cva variants, compoundVariants の class 等）
 * - 識別子 / メンバ参照: スコープから定義を解決して辿る。
 *   lookup テーブル（const variantStyles = {...}; styles = variantStyles[variant];
 *   className={cn("...border...", styles.card)}）経由で色が供給されるケースを拾う。
 *   メンバの key は動的でありうるので、解決先オブジェクトの全文字列を集める
 *   （集合に色を足す方向にしか働かないため誤検知＝過剰報告を防ぐ保守側）。
 */
function collect(node, out, ctx) {
  if (!node || ctx.depth > 12) return
  switch (node.type) {
    case "Literal":
      if (typeof node.value === "string") out.push(node.value)
      break
    case "TemplateLiteral":
      for (const q of node.quasis) out.push(q.value.cooked ?? q.value.raw ?? "")
      for (const e of node.expressions) collect(e, out, ctx)
      break
    case "ConditionalExpression":
      collect(node.consequent, out, ctx)
      collect(node.alternate, out, ctx)
      break
    case "LogicalExpression":
      collect(node.left, out, ctx)
      collect(node.right, out, ctx)
      break
    case "CallExpression":
      if (CLASS_UTILS.has(calleeName(node))) {
        for (const arg of node.arguments) collect(arg, out, ctx)
      }
      break
    case "ArrayExpression":
      for (const el of node.elements) collect(el, out, ctx)
      break
    case "ObjectExpression":
      for (const prop of node.properties) {
        if (prop.type === "Property") collect(prop.value, out, ctx)
      }
      break
    case "JSXExpressionContainer":
      collect(node.expression, out, ctx)
      break
    case "SpreadElement":
      collect(node.argument, out, ctx)
      break
    case "TSAsExpression":
    case "TSNonNullExpression":
      collect(node.expression, out, ctx)
      break
    case "Identifier": {
      if (ctx.seen.has(node.name)) break
      const init = variableInit(ctx.scope, node.name)
      if (init) {
        ctx.seen.add(node.name)
        collect(init, out, { ...ctx, depth: ctx.depth + 1 })
      }
      break
    }
    case "MemberExpression":
      // key は動的でありうるため、ベースとなるオブジェクト全体を辿る。
      collect(node.object, out, { ...ctx, depth: ctx.depth + 1 })
      break
    default:
      break
  }
}

function hasNakedBorder(classes) {
  return classes.some((c) => NAKED_BORDER_WIDTH.test(c))
}

function hasBorderColor(classes) {
  return classes.some((c) => BORDER_COLOR.test(c))
}

/** @type {import('eslint').Rule.RuleModule} */
const noColorlessBorder = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Warn on Tailwind border width classes that omit a border color (P032)",
    },
    schema: [],
    messages: {
      colorlessBorder:
        "[ksk-ds] 色を併記しないボーダー幅クラス（border / border-b 等）。Tailwind v4 では border-color の既定が currentColor になり、要素の文字色が枠線に透けて出る（消費側の濃色テキストで黒ずむ）。border-[var(--Border-Low-Emphasis)] 等を併記するか、状態で出し分ける場合は border-transparent を初期色に置き data-[state=active]:border-[var(--Brand-Primary)] 等で上書きする。(P032)",
    },
  },
  create(context) {
    const filename = context.filename ?? context.getFilename?.() ?? ""
    if (/\.stories\.[tj]sx?$/.test(filename)) return {}

    const sourceCode = context.sourceCode ?? context.getSourceCode?.()

    function check(node) {
      const scope = sourceCode?.getScope?.(node)
      const fragments = []
      collect(node, fragments, { scope, seen: new Set(), depth: 0 })
      if (fragments.length === 0) return
      const classes = fragments
        .join(" ")
        .split(/\s+/)
        .filter(Boolean)
      if (hasNakedBorder(classes) && !hasBorderColor(classes)) {
        context.report({ node, messageId: "colorlessBorder" })
      }
    }

    return {
      // 要素単位: 1 つの className 属性に到達する全文字列（cn/三項/テンプレ含む）を統合。
      JSXAttribute(node) {
        if (node.name?.name !== "className") return
        if (!node.value) return
        check(node.value)
      },

      // CVA 定義単位: base + 全 variant 値を統合（badge.tsx の base border + variant 色対策）。
      // cn() が JSX 属性内にある場合は JSXAttribute 側で処理済みなので、ここでは cva のみ扱い二重報告を避ける。
      CallExpression(node) {
        if (calleeName(node) !== "cva") return
        check(node)
      },
    }
  },
}

export default {
  rules: {
    "no-colorless-border": noColorlessBorder,
  },
}
