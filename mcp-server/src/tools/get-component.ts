import { loadComponents } from "../utils/loader.js";
import type { ComponentEntry } from "../utils/loader.js";

/** 問い合わせ名がエントリのどのフィールドに当たったか。 */
export type MatchKind =
  | "name"
  | "exportedAs"
  | "subcomponent"
  | "deprecatedAlias"
  | "path";

export interface ComponentResult extends ComponentEntry {
  importPath: string;
  group: string;
  /** 実際にヒットした名前（問い合わせ名の正規表記）。 */
  matchedName: string;
  matchedBy: MatchKind;
  /** `import { matchedName } from "ksk-design-system"` がそのまま書けるか。 */
  importable: boolean;
  /** このエントリで実際に import できる named export の一覧（新規実装で使う名前）。 */
  importableNames: string[];
  /**
   * `PhotoHero.Title` のような複合コンポーネントのメンバー。
   * named export ではなくルートオブジェクトのプロパティなので import はできない。
   */
  compoundMembers?: string[];
  /** `matchedName` が非推奨エイリアスか（import はできるが新規利用は禁止）。 */
  deprecated?: boolean;
  /** import できない / 非推奨のときの注意書き。 */
  note?: string;
}

const IMPORT_PATH = "ksk-design-system";

const normalize = (value: string) => value.toLowerCase().replace(/\s+/g, "-");

/** `PhotoHero.Title` 形式は複合コンポーネントのプロパティ参照で named export ではない。 */
const isCompoundMember = (name: string) => name.includes(".");

/** 複合コンポーネントメンバーの参照元（`PhotoHero.Title` → `PhotoHero`）。 */
const compoundRootOf = (name: string) => name.split(".")[0];

/**
 * エントリ配下で実際に `import { X }` できる名前。
 *
 * exported:false のエントリでは `name` は実装ファイル名 / グループ名なので除外し、
 * subcomponents に列挙された実 export だけが残る。
 * `PhotoHero.Title` のようなドット付きは named export ではないので除外する
 * （ルートの `PhotoHero` を import してプロパティとして使う）。
 * deprecatedAliases は import 自体は通るが新規実装で使う名前ではないので含めない。
 */
function importableNamesOf(entry: ComponentEntry): string[] {
  const names: string[] = [];
  if (entry.exported !== false) names.push(entry.exportedAs ?? entry.name);
  names.push(...(entry.subcomponents ?? []).filter((s) => !isCompoundMember(s)));
  return [...new Set(names)];
}

/** エントリが持つ複合コンポーネントメンバー（import 不可）。 */
function compoundMembersOf(entry: ComponentEntry): string[] {
  return (entry.subcomponents ?? []).filter(isCompoundMember);
}

interface Match {
  matchedName: string;
  matchedBy: MatchKind;
}

/**
 * name / exportedAs / subcomponents / deprecatedAliases の完全一致。
 *
 * `eq` を差し替えて「大文字小文字を区別する一致 → 区別しない一致」の 2 段で回す。
 * JS の export 名は大文字小文字が別物なので、区別する側を先に通さないと
 * 型のみ export の `Toast`（import 不可）と値 export の `toast`（import 可）を取り違える。
 */
function findExactMatch(
  entry: ComponentEntry,
  query: string,
  eq: (a: string, b: string) => boolean
): Match | null {
  if (eq(entry.name, query)) {
    return { matchedName: entry.name, matchedBy: "name" };
  }
  if (entry.exportedAs && eq(entry.exportedAs, query)) {
    return { matchedName: entry.exportedAs, matchedBy: "exportedAs" };
  }
  const sub = entry.subcomponents?.find((s) => eq(s, query));
  if (sub) return { matchedName: sub, matchedBy: "subcomponent" };

  const alias = entry.deprecatedAliases?.find((a) => eq(a, query));
  if (alias) return { matchedName: alias, matchedBy: "deprecatedAlias" };

  return null;
}

/** 部分一致（パス断片・名前の一部）。完全一致が全グループで外れたときだけ使う。 */
function findPartialMatch(entry: ComponentEntry, query: string): Match | null {
  const normalized = normalize(query);
  if (normalize(entry.name).includes(normalized)) {
    return { matchedName: entry.name, matchedBy: "name" };
  }
  if (entry.exportedAs && normalize(entry.exportedAs).includes(normalized)) {
    return { matchedName: entry.exportedAs, matchedBy: "exportedAs" };
  }
  const sub = entry.subcomponents?.find((s) => normalize(s).includes(normalized));
  if (sub) return { matchedName: sub, matchedBy: "subcomponent" };

  const path = entry.path.toLowerCase();
  if (path.endsWith(normalized) || path.includes(normalized)) {
    return { matchedName: entry.name, matchedBy: "path" };
  }
  return null;
}

function buildNote(
  entry: ComponentEntry,
  { matchedName, matchedBy }: Match,
  importable: boolean,
  importableNames: string[]
): string | undefined {
  const available =
    importableNames.length > 0
      // 区切りは "," 固定。エントリ名自体が "ListSkeleton / GridSkeleton" のように
      // " / " を含むため、同じ区切りだと境界が読めなくなる。
      ? `import できる名前: ${importableNames.join(", ")}`
      : "このエントリに import できる named export はない";

  if (matchedBy === "deprecatedAlias") {
    // 互換のため実 export として残っている（contracts-export-integrity が固定）。
    // import は通るので importable:true。ただし新規実装では使わせない。
    return `"${matchedName}" は非推奨エイリアス。互換のため import は通るが新規実装では使わないこと。${available}。`;
  }
  if (isCompoundMember(matchedName)) {
    const root = compoundRootOf(matchedName);
    return `"${matchedName}" は named export ではないので import { } では取れない。import { ${root} } from "${IMPORT_PATH}" して ${matchedName} とプロパティ参照する。`;
  }
  if (!importable) {
    return `"${matchedName}" は import できない（contracts 上の実装ファイル名 / グループ名であり実 export ではない）。${available}。`;
  }
  if (entry.exported === false) {
    // 引き当てた名前自体は import できるが、エントリ名（= 見出し）は import できない。
    return `エントリ名 "${entry.name}" は import できない。"${matchedName}" は import { ${matchedName} } from "${IMPORT_PATH}" で利用できる。`;
  }
  return undefined;
}

function toResult(entry: ComponentEntry, group: string, match: Match): ComponentResult {
  const importableNames = importableNamesOf(entry);
  const compoundMembers = compoundMembersOf(entry);
  const deprecated = match.matchedBy === "deprecatedAlias";
  // 大文字小文字を区別して判定する（`Toast` は型のみ export、`toast` は値 export）。
  // 非推奨エイリアスは「使うべきでない」が「import はできる」ので importable 側に入れる。
  const importable =
    importableNames.includes(match.matchedName) ||
    (deprecated && (entry.deprecatedAliases ?? []).includes(match.matchedName));
  const note = buildNote(entry, match, importable, importableNames);

  return {
    ...entry,
    importPath: IMPORT_PATH,
    group,
    matchedName: match.matchedName,
    matchedBy: match.matchedBy,
    importable,
    importableNames,
    ...(compoundMembers.length > 0 ? { compoundMembers } : {}),
    ...(deprecated ? { deprecated } : {}),
    ...(note ? { note } : {}),
  };
}

/**
 * コンポーネントのメタデータを名前 / パス断片から取得する。
 *
 * 解決対象は `name` だけでなく `exportedAs` / `subcomponents` / `deprecatedAliases` も含む。
 * これがないと、exported:false のエントリ（Toast, CheckboxCard, patterns/Form 等）の
 * 実 export 名（`CheckboxCardGroup` 等）で引いたときに null が返り、
 * MCP 経由ではそのコンポーネントのルールを一切引けなくなる。
 *
 * 解決順は「完全一致（大小区別あり）→ 完全一致（区別なし）→ 部分一致」で、
 * 各段を全グループ横断で走査する。
 * （グループごとに「完全一致 → 部分一致」を回すと ui の部分一致が
 * 他グループの完全一致に勝ってしまう）
 */
export function getComponent(id: string): ComponentResult | null {
  if (!id) return null;

  const data = loadComponents();

  const groups = [
    { key: "ui", items: data.ui },
    { key: "patterns", items: data.patterns },
    { key: "commerce", items: data.commerce },
    { key: "admin", items: data.admin },
    { key: "shells", items: data.shells },
  ] as const;

  const passes: Array<(entry: ComponentEntry) => Match | null> = [
    (entry) => findExactMatch(entry, id, (a, b) => a === b),
    (entry) => findExactMatch(entry, id, (a, b) => normalize(a) === normalize(b)),
    (entry) => findPartialMatch(entry, id),
  ];

  for (const finder of passes) {
    for (const { key, items } of groups) {
      for (const entry of items) {
        const match = finder(entry);
        if (match) return toResult(entry, key, match);
      }
    }
  }

  return null;
}
