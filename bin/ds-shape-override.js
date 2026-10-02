import ts from "typescript"

/**
 * P052: DS 部品の className で「形」（角丸・高さ・左右 padding）を上書きしない
 *
 * 由来: belle-todo（2026-10-01）。Button に rounded-2xl / rounded-lg を部品ごとに
 * 被せた結果、同じ画面でボタンの角丸が pill と角丸長方形で混在し、入力欄も
 * TextInput / DateField だけ rounded-2xl で他の欄とずれていた。形は DS が
 * token（--Control-Radius / --Field-Radius / --Field-Height-* / --Field-Padding-X-*）と
 * prop（size / rounded / unstyled / startAdornment）で持っているので、部品単位で被せると
 * 必ず他の部品と揃わなくなる。アプリ全体で変えたいなら product theme override API で
 * 1 箇所だけ変える。
 *
 * 検査範囲（誤検知を出さない方を優先）:
 * - "ksk-design-system"（サブパス含む）から import した部品だけを見る。DS 内部の相対 import や
 *   consumer 自作の同名部品は対象外
 * - className 属性の中の文字列リテラル（cn() / 三項 / テンプレートの固定部分を含む）から
 *   クラスを拾う。変数経由で渡すクラスや実行時に組み立てる文字列は追えない
 * - `unstyled` を付けた部品は DS の見た目を出力しないので対象外
 * - h-auto / h-full / min-h-0 等のレイアウト用の高さ指定は許可
 */

/** 部品 → 検査するクラスの種類（radius: rounded-* / height: h-* min-h-* size-* / padX: px-* pl-* pr-*） */
export const SHAPE_TARGETS = {
  Button: { radius: true, height: true },
  Input: { radius: true, height: true, padX: true },
  Textarea: { radius: true, padX: true },
  AutoGrowTextarea: { radius: true, padX: true },
  CommitInput: { radius: true, height: true, padX: true },
  CommitTextarea: { radius: true, padX: true },
  CommitAutoGrowTextarea: { radius: true, padX: true },
  SelectTrigger: { radius: true, height: true, padX: true },
  DateField: { radius: true, height: true, padX: true },
  DatePicker: { radius: true, height: true, padX: true },
  TimePicker: { radius: true, height: true, padX: true },
  Combobox: { radius: true, height: true, padX: true },
  Chip: { radius: true, height: true },
  ChipSelector: { radius: true },
  SettingsListRow: { radius: true, height: true },
  // Skeleton は rounded prop（sm / lg / 2xl / full）を持つので className で渡さない
  Skeleton: { radius: true, hint: 'rounded prop を使う（例: <Skeleton rounded="2xl" />）' },
}

const DS_MODULE_RE = /^(?:ksk-design-system|@ksk\/design-system)(?:\/.*)?$/
const VARIANT_PREFIX = String.raw`(?:[a-z0-9-]+:|\[[^\]]*\]:)*`
const RADIUS_RE = new RegExp(`^${VARIANT_PREFIX}rounded(?:-[trblxyse]{1,2})?(?:-[a-z0-9]+|-\\[[^\\]]+\\])?$`)
const HEIGHT_RE = new RegExp(`^${VARIANT_PREFIX}(?:h|min-h|size)-\\S+$`)
const LAYOUT_HEIGHT_RE = new RegExp(`^${VARIANT_PREFIX}(?:h|min-h|size)-(?:auto|full|screen|fit|min|max|dvh|svh|lvh|0)$`)
const PAD_X_RE = new RegExp(`^${VARIANT_PREFIX}p[xlr]-\\S+$`)

export function classifyShapeClass(token, rule) {
  if (rule.radius && RADIUS_RE.test(token)) return true
  if (rule.height && HEIGHT_RE.test(token) && !LAYOUT_HEIGHT_RE.test(token)) return true
  if (rule.padX && PAD_X_RE.test(token)) return true
  return false
}

/** import { Button as Btn } from "ksk-design-system" → Map("Btn" => "Button") */
function collectDsImports(sourceFile) {
  const local = new Map()
  for (const statement of sourceFile.statements) {
    if (!ts.isImportDeclaration(statement)) continue
    if (!ts.isStringLiteral(statement.moduleSpecifier)) continue
    if (!DS_MODULE_RE.test(statement.moduleSpecifier.text)) continue
    const bindings = statement.importClause?.namedBindings
    if (!bindings || !ts.isNamedImports(bindings)) continue
    for (const element of bindings.elements) {
      if (element.isTypeOnly) continue
      const imported = (element.propertyName ?? element.name).text
      if (Object.hasOwn(SHAPE_TARGETS, imported)) local.set(element.name.text, imported)
    }
  }
  return local
}

function attributeOf(opening, name) {
  return opening.attributes.properties.find(
    (property) => ts.isJsxAttribute(property) && property.name.getText() === name,
  )
}

/** `unstyled` / `unstyled={true}` なら true。`unstyled={cond}` 等の式は判定できないので true 扱い（誤検知回避） */
function isUnstyled(opening) {
  const attribute = attributeOf(opening, "unstyled")
  if (!attribute) return false
  const init = attribute.initializer
  if (!init) return true
  if (ts.isJsxExpression(init) && init.expression?.kind === ts.SyntaxKind.FalseKeyword) return false
  return true
}

/** className の式から文字列リテラルの中身だけを集める */
function collectClassTokens(attribute) {
  const texts = []
  function visit(node) {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      texts.push(node.text)
      return
    }
    if (ts.isTemplateExpression(node)) {
      texts.push(node.head.text)
      for (const span of node.templateSpans) {
        visit(span.expression)
        texts.push(span.literal.text)
      }
      return
    }
    ts.forEachChild(node, visit)
  }
  const init = attribute.initializer
  if (!init) return []
  if (ts.isStringLiteral(init)) texts.push(init.text)
  else if (ts.isJsxExpression(init) && init.expression) visit(init.expression)
  return texts.join(" ").split(/\s+/).filter(Boolean)
}

export function inspectDsShapeOverrides(source, filePath = "source.tsx") {
  const sourceFile = ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  const local = collectDsImports(sourceFile)
  const findings = []
  if (local.size === 0) return findings

  function check(opening) {
    if (!ts.isIdentifier(opening.tagName)) return
    const component = local.get(opening.tagName.text)
    if (!component) return
    if (isUnstyled(opening)) return
    const classAttribute = attributeOf(opening, "className")
    if (!classAttribute) return
    const rule = SHAPE_TARGETS[component]
    const classes = collectClassTokens(classAttribute).filter((token) => classifyShapeClass(token, rule))
    if (classes.length === 0) return
    const position = sourceFile.getLineAndCharacterOfPosition(opening.getStart(sourceFile))
    findings.push({
      line: position.line + 1,
      tag: component,
      classes,
      detail: `<${component}> ${classes.join(" ")}${rule.hint ? `（${rule.hint}）` : ""}`,
    })
  }

  function walk(node) {
    if (ts.isJsxElement(node)) check(node.openingElement)
    else if (ts.isJsxSelfClosingElement(node)) check(node)
    ts.forEachChild(node, walk)
  }
  walk(sourceFile)
  return findings
}
