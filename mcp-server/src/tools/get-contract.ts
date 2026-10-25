import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { projectRoot } from "../utils/loader.js";

/**
 * MCP resources / get_contract で配信する正本ファイルの一覧。
 *
 * 配信対象は npm パッケージ（package.json の "files"）に同梱されるファイルだけに限る。
 * 同梱されない開発用ファイルを配信すると、パッケージ経由で使う環境では読めずに壊れるため。
 * 一覧と "files" の整合、contracts/*.json の登録漏れは __tests__/get-contract.test.ts が検査する。
 */
export type ContractKind = "json" | "markdown";

export interface ContractDefinition {
  /** get_contract の name（ファイル名ベース） */
  name: string;
  kind: ContractKind;
  /** リポジトリルートからの相対パス */
  file: string;
  description: string;
  /** MCP resource の URI */
  uri: string;
  mimeType: "application/json" | "text/markdown";
}

const json = (name: string, file: string, description: string): ContractDefinition => ({
  name,
  kind: "json",
  file,
  description,
  uri: `ksk-ds://contracts/${name}`,
  mimeType: "application/json",
});

const markdown = (name: string, file: string, description: string): ContractDefinition => ({
  name,
  kind: "markdown",
  file,
  description,
  uri: `ksk-ds://docs/${name}`,
  mimeType: "text/markdown",
});

export const CONTRACT_DEFINITIONS: readonly ContractDefinition[] = [
  json("components", "contracts/components.json", "全コンポーネントの定義（variant・size・a11y・ルール・import 名）"),
  json("rules", "contracts/rules.json", "禁止パターン・AI アンチパターン・a11y 要件"),
  json("tokens", "tokens.json", "カラー・タイポ・スペーシング・シャドウ等のデザイントークン"),
  json("token-hex-cache", "contracts/token-hex-cache.json", "semantic トークンのデフォルトテーマ解決済み hex"),
  json("product-theme-overrides", "contracts/product-theme-overrides.json", "プロダクト単位で上書きしてよい CSS 変数の許可リスト"),
  json("composition", "contracts/composition.json", "画面内の並べ方（骨格構造・余白リズム・カード階層・CTA 優先度）"),
  json("screen-patterns", "contracts/screen-patterns.json", "画面実装前にシェル/パターンを選ぶ decisionTree"),
  json("design-context", "contracts/design-context.json", "DESIGN.md と正本ファイルの関係・AI 向け検査方針"),
  json("deprecations", "contracts/deprecations.json", "非推奨 API の台帳（移行先・削除予定）"),
  json("component-docs-guidance", "contracts/component-docs-guidance.json", "迷いやすい部品の使い分け"),
  json("native-device-verification", "contracts/native-device-verification.json", "ネイティブ実機検証の観点と記録方針"),
  markdown("design", "DESIGN.md", "AI エージェント向けの視覚言語サマリ（トークン・意図・voice・motion）"),
  markdown("component-lookup", "src/components/COMPONENT_LOOKUP.md", "Web コンポーネントの variant・import パス早見表"),
  markdown("component-lookup-native", "src/native/COMPONENT_LOOKUP.md", "Native コンポーネントの import パス早見表"),
];

/** contracts/ にあるが配信しないファイルと、その理由（登録漏れ検査の許可リスト）。 */
export const UNSERVED_CONTRACT_FILES: Readonly<Record<string, string>> = {
  "contracts/consumer-requests.json": "DS 運用の依頼台帳で、AI の実装判断には使わない",
  "contracts/bundle-size-budget.json": "配布物サイズ予算の CI ゲート用データで、AI の実装判断には使わない",
};

/** `design` / `DESIGN.md` / `rules.json` のような表記ゆれを定義に寄せる。 */
export function findContract(name: string): ContractDefinition | undefined {
  const normalized = name.trim().toLowerCase().replace(/\.(json|md)$/u, "");
  return CONTRACT_DEFINITIONS.find(
    (d) =>
      d.name === normalized ||
      (d.file.split("/").pop() ?? "").toLowerCase().replace(/\.(json|md)$/u, "") === normalized
  );
}

/** resources/read が返す本文（ファイルの中身そのまま）。 */
export function readContractText(definition: ContractDefinition): string {
  return readFileSync(resolve(projectRoot, definition.file), "utf-8");
}

export interface ContractSummary {
  name: string;
  description: string;
  uri: string;
  mimeType: string;
  file: string;
}

export function listContracts(): ContractSummary[] {
  return CONTRACT_DEFINITIONS.map(({ name, description, uri, mimeType, file }) => ({
    name,
    description,
    uri,
    mimeType,
    file,
  }));
}

/** path / section 省略時にこの文字数を超える契約は全文でなく目次を返す。 */
export const FULL_TEXT_LIMIT = 30_000;

export interface GetContractOptions {
  /** JSON 契約のドット区切り部分取得（例: `meta.counts` / `ui.0`） */
  path?: string;
  /** Markdown 契約の見出し部分一致（例: `Colors`） */
  section?: string;
  /** true で大きい契約も全文を返す */
  full?: boolean;
}

export type GetContractResult =
  | { ok: true; text: string }
  | { ok: false; error: string };

const isObject = (v: unknown): v is Record<string, unknown> =>
  v !== null && typeof v === "object" && !Array.isArray(v);

function childKeys(node: unknown): string[] {
  if (Array.isArray(node)) return node.slice(0, 50).map((_, i) => String(i));
  if (isObject(node)) return Object.keys(node);
  return [];
}

/** ドット区切りで値を引く。キー自体に `.` を含む場合に備え、連続するセグメントを結合した候補も試す。 */
export function resolvePath(
  root: unknown,
  path: string
): { found: true; value: unknown } | { found: false; reached: string; available: string[] } {
  const segments = path.split(".").filter((s) => s.length > 0);
  type Result = { found: true; value: unknown } | { found: false; reached: string; available: string[] };
  const walk = (node: unknown, index: number, walked: string[]): Result => {
    if (index >= segments.length) return { found: true, value: node };
    let deepest: Result = { found: false, reached: walked.join("."), available: childKeys(node) };
    for (let end = index + 1; end <= segments.length; end += 1) {
      const key = segments.slice(index, end).join(".");
      const has = Array.isArray(node)
        ? /^\d+$/u.test(key) && node[Number(key)] !== undefined
        : isObject(node) && Object.prototype.hasOwnProperty.call(node, key);
      if (!has) continue;
      const child = Array.isArray(node) ? node[Number(key)] : (node as Record<string, unknown>)[key];
      const result = walk(child, end, [...walked, key]);
      if (result.found) return result;
      if (result.reached.split(".").length >= (deepest as { reached: string }).reached.split(".").length) {
        deepest = result;
      }
    }
    return deepest;
  };
  return walk(root, 0, []);
}

interface Heading {
  level: number;
  heading: string;
  line: number;
}

/** Markdown の見出し一覧。frontmatter とコードフェンス内の `#` は数えない。 */
export function extractHeadings(markdownText: string): Heading[] {
  const lines = markdownText.split("\n");
  const headings: Heading[] = [];
  let index = 0;
  if (lines[0]?.trim() === "---") {
    const close = lines.findIndex((l, i) => i > 0 && l.trim() === "---");
    if (close > 0) index = close + 1;
  }
  // 閉じフェンスは「開きと同じ文字・開き以上の長さ・後ろが空白だけ」の行（CommonMark）
  let fence: { char: string; length: number } | undefined;
  for (; index < lines.length; index += 1) {
    const line = lines[index] ?? "";
    const fenceMatch = /^ {0,3}(`{3,}|~{3,})(.*)$/u.exec(line);
    if (fenceMatch) {
      const run = fenceMatch[1] ?? "";
      if (!fence) {
        fence = { char: run.charAt(0), length: run.length };
        continue;
      }
      if (run.charAt(0) === fence.char && run.length >= fence.length && (fenceMatch[2] ?? "").trim() === "") {
        fence = undefined;
        continue;
      }
    }
    if (fence) continue;
    const m = /^(#{1,6})\s+(.+?)\s*#*\s*$/u.exec(line);
    if (m) headings.push({ level: m[1]?.length ?? 1, heading: m[2] ?? "", line: index });
  }
  return headings;
}

/** 見出しの部分一致（大文字小文字無視）で節を切り出す。節は次の同階層以上の見出しの手前まで。 */
export function extractSections(markdownText: string, query: string): string[] {
  const needle = query.trim().toLowerCase();
  const lines = markdownText.split("\n");
  const headings = extractHeadings(markdownText);
  const sections: string[] = [];
  let coveredUntil = -1;
  headings.forEach((h, i) => {
    if (h.line < coveredUntil) return;
    if (!h.heading.toLowerCase().includes(needle)) return;
    const next = headings.slice(i + 1).find((c) => c.level <= h.level);
    const end = next?.line ?? lines.length;
    coveredUntil = end;
    sections.push(lines.slice(h.line, end).join("\n").trimEnd());
  });
  return sections;
}

/**
 * 契約を 1 件引く。
 * - JSON: path 指定でその部分、省略時は全文（FULL_TEXT_LIMIT 超は目次。full:true で全文）
 * - Markdown: section 指定でその節、省略時は全文（FULL_TEXT_LIMIT 超は見出し一覧）
 */
export function getContract(name: string, options: GetContractOptions = {}): GetContractResult {
  const definition = findContract(name);
  if (!definition) {
    const available = CONTRACT_DEFINITIONS.map((d) => d.name).join(", ");
    return { ok: false, error: `未知の契約: ${name}。使える契約: ${available}` };
  }
  const text = readContractText(definition);

  if (definition.kind === "json") {
    const data: unknown = JSON.parse(text);
    if (options.path) {
      const result = resolvePath(data, options.path);
      if (!result.found) {
        return {
          ok: false,
          error: `path "${options.path}" は "${result.reached}" までしか辿れません。次に指定できるキー: ${result.available.join(", ") || "(なし)"}`,
        };
      }
      const partText = JSON.stringify(result.value, null, 2)
      if (options.full || partText.length <= FULL_TEXT_LIMIT) return { ok: true, text: partText }
      const keys = childKeys(result.value).map((key) => {
        const value = (result.value as Record<string, unknown>)[key]
        const size = Array.isArray(value) ? `array(${value.length})` : isObject(value) ? `object(${Object.keys(value).length})` : typeof value
        return `${key}: ${size}`
      })
      return {
        ok: true,
        text:
          `path "${options.path}" の中身は ${partText.length} 文字あるため、キーの一覧のみ返します。` +
          `より深い path を指定するか、full:true で全量を取得できます。\n\n` +
          keys.join("\n"),
      }
    }
    if (options.full || text.length <= FULL_TEXT_LIMIT) return { ok: true, text };
    const keys = childKeys(data).map((key) => {
      const value = (data as Record<string, unknown>)[key];
      const size = Array.isArray(value) ? `array(${value.length})` : isObject(value) ? `object(${Object.keys(value).length})` : typeof value;
      return `${key}: ${size}`;
    });
    return {
      ok: true,
      text:
        `${definition.name} は ${text.length} 文字あるため目次のみ返します。` +
        `path でドット区切りの部分取得（例: "${childKeys(data)[0] ?? "meta"}"）、full:true で全文を取得できます。\n\n` +
        keys.join("\n"),
    };
  }

  if (options.section) {
    const sections = extractSections(text, options.section);
    if (sections.length === 0) {
      const available = extractHeadings(text).map((h) => h.heading).join(" / ");
      return { ok: false, error: `見出しに "${options.section}" を含む節がありません。見出し: ${available}` };
    }
    return { ok: true, text: sections.join("\n\n") };
  }
  if (options.full || text.length <= FULL_TEXT_LIMIT) return { ok: true, text };
  const outline = extractHeadings(text)
    .map((h) => `${"  ".repeat(h.level - 1)}${"#".repeat(h.level)} ${h.heading}`)
    .join("\n");
  return {
    ok: true,
    text:
      `${definition.name} は ${text.length} 文字あるため見出し一覧のみ返します。` +
      `section で見出しの部分一致による節取得、full:true で全文を取得できます。\n\n${outline}`,
  };
}
