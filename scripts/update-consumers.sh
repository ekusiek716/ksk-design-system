#!/bin/bash
# =============================================================
# KSK Design System — 消費リポを npm registry 経由で一括 bump
#
# 使い方: bash scripts/update-consumers.sh <version> [repo...]
#   例:   bash scripts/update-consumers.sh 1.46.0
#         bash scripts/update-consumers.sh 1.46.0 belle-todo
#         bash scripts/update-consumers.sh 1.46.0 "$HOME/LocalDev/pawly"
#         DRY_RUN=1 bash scripts/update-consumers.sh 1.46.0 belle-todo
#
# 前提: ksk-design-system@<version> が npm registry に publish 済み
#
# 対象リポ（既定）:
#   引数を省略すると下の DEFAULT_REPOS（フルパス16箇所）が対象。
#   単体リポと monorepo が混在し、~/LocalDev/ 直下と ~/LocalDev/Examination/
#   配下にまたがる。ディレクトリ名が日本語でも、PR は各リポ内で
#   `gh pr create` するため GitHub remote から英語リポ名が自動解決される。
#
# 引数で repo を渡した場合の解決:
#   - "/" を含む or 実在ディレクトリ → そのままパスとして扱う
#   - それ以外 → $HOME/LocalDev/<name>、次に $HOME/LocalDev/Examination/<name>
#     の順で探索。見つからなければ FAIL 記録して次へ。
#
# 処理方式（stash 方式は廃止・origin/main の一時 worktree 方式）:
#   ローカルの作業ツリー（dirty 状態）には一切触れない。各リポで
#     git fetch origin main
#     git worktree add -B chore/bump-ds-<version> <tmp> <安全な開始点>
#   と一時 worktree を切り、その中で全作業を行う。remote に同名 branch が
#   ある場合はその HEAD から再開し、人手の追い commit を保持したまま通常の
#   fast-forward push を行う。無い場合だけ origin/main から開始する。
#   成功・失敗どちらでも worktree を必ず掃除する。
#
# monorepo 対応:
#   worktree 内の `git ls-files '*package.json'` を全走査し、
#   dependencies/devDependencies/peerDependencies に ksk-design-system
#   （旧名 @ksk/design-system 含む）を持つ package.json を全部書き換える。
#   ただし値が "*" や "workspace:" で始まるものは触らない
#   （例: okuno-todo-suite の packages/todo-shared が "*" 参照）。
#
# DRY_RUN=1:
#   push / gh pr create をスキップ。package.json 書換・npm install・commit
#   までは実行し、`git show --stat HEAD` 相当を表示して worktree を掃除。
# =============================================================

set -uo pipefail

VERSION="${1:?usage: update-consumers.sh <version> [repos...]}"
shift || true
ARGS=("$@")

# ── 既定対象リポ（フルパス16箇所）──
DEFAULT_REPOS=(
  "$HOME/LocalDev/belle-todo"
  "$HOME/LocalDev/trip_todo"
  "$HOME/LocalDev/ninshin-todo"
  "$HOME/LocalDev/yokoku-app"
  "$HOME/LocalDev/pawly"
  "$HOME/LocalDev/Examination/exam-kit"
  "$HOME/LocalDev/Examination/ITパスポート用"
  "$HOME/LocalDev/Examination/HCD基礎検定用"
  "$HOME/LocalDev/Examination/denki1-app"
  "$HOME/LocalDev/Examination/電気工事士用"
  "$HOME/LocalDev/Examination/応用情報用"
  "$HOME/LocalDev/Examination/基本情報用"
  "$HOME/LocalDev/Examination/情報セキュリティマネジメント用"
  "$HOME/LocalDev/Examination/社労士用"
  "$HOME/LocalDev/aikoibito"
  "$HOME/LocalDev/okuno-todo-suite"
)

GREEN='\033[0;32m'; RED='\033[0;31m'; CYAN='\033[0;36m'; YELLOW='\033[0;33m'; NC='\033[0m'
RESULTS=()

# 中断（Ctrl-C 等）時も処理中リポの一時 worktree を残さない。
# cleanup はループ内で毎回 $repo / $wt を掴んで再定義される。
cleanup() { :; }
trap 'cleanup' EXIT
trap 'cleanup; trap - INT TERM EXIT; exit 130' INT TERM

# ── 引数 → 対象リポのパス解決 ──
resolve_repo() {
  local arg="$1"
  # "/" を含む or 実在ディレクトリならそのまま
  if [[ "$arg" == */* ]] || [ -d "$arg" ]; then
    printf '%s' "$arg"
    return 0
  fi
  if [ -d "$HOME/LocalDev/$arg" ]; then
    printf '%s' "$HOME/LocalDev/$arg"
    return 0
  fi
  if [ -d "$HOME/LocalDev/Examination/$arg" ]; then
    printf '%s' "$HOME/LocalDev/Examination/$arg"
    return 0
  fi
  return 1
}

REPOS=()
if [ ${#ARGS[@]} -eq 0 ]; then
  REPOS=("${DEFAULT_REPOS[@]}")
else
  for arg in "${ARGS[@]}"; do
    if path="$(resolve_repo "$arg")"; then
      REPOS+=("$path")
    else
      echo -e "${RED}FAIL: '$arg' が見つからない（LocalDev / Examination 配下に無い）${NC}"
      RESULTS+=("$arg: FAIL (not found)")
    fi
  done
fi

for repo in "${REPOS[@]}"; do
  # 前リポの cleanup（$repo/$wt/$branch を掴んだまま）が trap 経由で誤発火しないよう毎回リセット
  cleanup() { :; }
  name="$(basename "$repo")"
  echo ""
  echo -e "${CYAN}=== $name ===${NC}"
  echo "   $repo"

  # monorepo worktree 対策で -d でなく -e（.git はファイルの場合もある）
  if [ ! -e "$repo/.git" ]; then
    echo -e "${YELLOW}→ SKIP (no git)${NC}"
    RESULTS+=("$name: SKIP (no git)")
    continue
  fi

  # ── origin/main から一時 worktree を切る ──
  if ! git -C "$repo" fetch origin main >/dev/null 2>&1; then
    echo -e "${RED}FAIL: git fetch origin main${NC}"
    RESULTS+=("$name: FAIL (fetch)")
    continue
  fi

  branch="chore/bump-ds-$VERSION"
  start_point="origin/main"
  remote_head=""
  if remote_head="$(git -C "$repo" ls-remote --heads origin "refs/heads/$branch" | awk '{print $1}')"; then
    if [ -n "$remote_head" ]; then
      if ! git -C "$repo" fetch origin "$branch:refs/remotes/origin/$branch" >/dev/null 2>&1; then
        echo -e "${RED}FAIL: existing branch fetch${NC}"
        RESULTS+=("$name: FAIL (existing branch fetch)")
        continue
      fi
      start_point="origin/$branch"
      echo "→ 既存 branch を $remote_head から再開"
    fi
  fi
  wt="$(mktemp -d "${TMPDIR:-/tmp}/ds-bump-XXXXXX")"

  cleanup() {
    git -C "$repo" worktree remove --force "$wt" >/dev/null 2>&1
    git -C "$repo" worktree prune >/dev/null 2>&1
    # worktree add -B で作ったローカルブランチも残さない（push 済みなら remote にある）
    git -C "$repo" branch -D "$branch" >/dev/null 2>&1
    rm -rf "$wt"
  }

  if ! git -C "$repo" worktree add -B "$branch" "$wt" "$start_point" >/dev/null 2>&1; then
    echo -e "${RED}FAIL: worktree add${NC}"
    cleanup
    RESULTS+=("$name: FAIL (worktree)")
    continue
  fi

  # ── package.json 群を書き換え（monorepo 対応）──
  # ksk-design-system / 旧名 @ksk/design-system を deps/devDeps/peerDeps に
  # 持つファイルを全部書き換え。値が "*" / "workspace:" 始まりは除外。
  CHANGED_COUNT=0
  while IFS= read -r pkgrel; do
    [ -z "$pkgrel" ] && continue
    if node -e '
      const fs = require("fs");
      const [file, version] = process.argv.slice(1);
      const pkg = JSON.parse(fs.readFileSync(file, "utf8"));
      let changed = false;
      for (const k of ["dependencies", "devDependencies", "peerDependencies"]) {
        if (!pkg[k]) continue;
        const cur = pkg[k]["ksk-design-system"];
        const old = pkg[k]["@ksk/design-system"];
        // 値が "*" / "workspace:" 始まりのものは触らない
        const skip = (v) => typeof v === "string" && (v === "*" || v.startsWith("workspace:"));
        if (old !== undefined) {
          if (skip(old)) continue;
          delete pkg[k]["@ksk/design-system"];
          pkg[k]["ksk-design-system"] = "^" + version;
          changed = true;
        } else if (cur !== undefined) {
          if (skip(cur)) continue;
          pkg[k]["ksk-design-system"] = "^" + version;
          changed = true;
        }
      }
      if (!changed) process.exit(2);
      fs.writeFileSync(file, JSON.stringify(pkg, null, 2) + "\n");
    ' "$wt/$pkgrel" "$VERSION" 2>/dev/null; then
      CHANGED_COUNT=$((CHANGED_COUNT + 1))
      echo "→ 書換: $pkgrel"
    fi
  done < <(git -C "$wt" ls-files '*package.json')

  if [ "$CHANGED_COUNT" -eq 0 ]; then
    echo -e "${RED}FAIL: ksk-design-system 依存を持つ package.json が無い${NC}"
    cleanup
    RESULTS+=("$name: FAIL (deps)")
    continue
  fi
  echo "→ $CHANGED_COUNT 個の package.json を書き換え"

  # ── vendor tgz 削除（worktree ルート）──
  REMOVED=$(find "$wt/vendor" -maxdepth 1 -name 'ksk-design-system-*.tgz' 2>/dev/null | wc -l | tr -d ' ')
  if [ "$REMOVED" -gt 0 ]; then
    find "$wt/vendor" -maxdepth 1 -name 'ksk-design-system-*.tgz' -exec git -C "$wt" rm -f {} \; >/dev/null 2>&1
    echo "→ $REMOVED 個の vendor/ksk-design-system-*.tgz を削除"
  fi

  # ── npm install（worktree ルート）──
  echo "→ npm install (npm registry から取得)"
  if ! (cd "$wt" && npm install --no-audit --no-fund >/dev/null 2>&1); then
    echo -e "${RED}FAIL: npm install${NC}"
    cleanup
    RESULTS+=("$name: FAIL (npm install)")
    continue
  fi

  # ── インストール検証 ──
  # monorepo は root node_modules に hoist されるのでまずルートで確認。
  # 無ければ書き換えた package.json のあるディレクトリでも試す。
  INSTALLED="$(cd "$wt" && node -p "require('ksk-design-system/package.json').version" 2>/dev/null)"
  if [ "$INSTALLED" != "$VERSION" ]; then
    while IFS= read -r pkgrel; do
      [ -z "$pkgrel" ] && continue
      pkgdir="$wt/$(dirname "$pkgrel")"
      INSTALLED="$(cd "$pkgdir" && node -p "require('ksk-design-system/package.json').version" 2>/dev/null)"
      [ "$INSTALLED" = "$VERSION" ] && break
    done < <(git -C "$wt" ls-files '*package.json')
  fi
  if [ "$INSTALLED" != "$VERSION" ]; then
    echo -e "${RED}FAIL: 期待 $VERSION / 実際 ${INSTALLED:-未検出}${NC}"
    cleanup
    RESULTS+=("$name: FAIL (version mismatch: ${INSTALLED:-none})")
    continue
  fi
  echo "→ ksk-design-system@$INSTALLED 取得確認"

  # ── stage / commit ──
  # 書き換えた package.json 群・全 lockfile・vendor の git rm はいずれも
  # 追跡ファイルの変更なので git add -u で拾える。
  git -C "$wt" add -u >/dev/null 2>&1
  # lockfile が新規生成された場合は -u で拾えないので明示的に add
  git -C "$wt" add -- 'package-lock.json' ':(glob)**/package-lock.json' >/dev/null 2>&1
  if git -C "$wt" diff --staged --quiet; then
    existing_pr="$(cd "$wt" && gh pr list --state open --head "$branch" --json url -q '.[0].url' 2>/dev/null)"
    echo -e "${YELLOW}→ 変更なし${NC} ${existing_pr:-}"
    cleanup
    RESULTS+=("$name: SKIP (no-op${existing_pr:+: $existing_pr})")
    continue
  fi

  if ! git -C "$wt" commit -m "chore: ksk-design-system を v$VERSION に bump

- package.json の ksk-design-system 依存を ^$VERSION に更新（monorepo は全 package.json）
- package-lock.json を npm registry のメタ情報で更新
- vendor/ksk-design-system-*.tgz が残っていれば削除（過去版は git history で追える）" >/dev/null 2>&1; then
    echo -e "${RED}FAIL: commit（pre-commit hook / git identity 等）${NC}"
    cleanup
    RESULTS+=("$name: FAIL (commit)")
    continue
  fi

  # ── DRY_RUN: push/PR せず要約して掃除 ──
  if [ -n "${DRY_RUN:-}" ]; then
    echo -e "${YELLOW}→ DRY_RUN: push / gh pr create はスキップ${NC}"
    git -C "$wt" show --stat HEAD | sed 's/^/   /'
    cleanup
    RESULTS+=("$name: DRY_RUN (commit のみ・push なし)")
    continue
  fi

  # ── push ──
  # 既存 branch から開始しているため、通常 push が fast-forward の場合だけ更新する。
  # 実行中に remote が進んだ場合は失敗させ、force-push で人手の commit を潰さない。
  if ! git -C "$wt" push -u origin "$branch" >/dev/null 2>&1; then
    existing_pr="$(cd "$wt" && gh pr list --state open --head "$branch" --json url -q '.[0].url' 2>/dev/null)"
    echo -e "${RED}FAIL: push（remote が進んだ可能性。再実行で安全に再開）${NC} ${existing_pr:-}"
    cleanup
    RESULTS+=("$name: FAIL (non-fast-forward push${existing_pr:+: $existing_pr})")
    continue
  fi

  # ── PR 作成 ──
  pr_body_file="$(mktemp)"
  cat > "$pr_body_file" <<'EOF'
ksk-design-system を v__VERSION__ に bump。

## 変更
- `package.json` の `ksk-design-system` 依存を `^__VERSION__` に更新（monorepo は対象の全 `package.json`）
- `package-lock.json` を npm registry のメタ情報で更新
- `vendor/ksk-design-system-*.tgz` が残っていれば削除（過去版は git history で復元可能）

## メリット
- 配布が npm 標準フローに統一（dependabot / renovate も使える）
- ロールバックは `npm install ksk-design-system@<旧バージョン>` で可能

詳細は DS リポのリリースノート参照。
EOF
  node -e '
    const fs = require("fs");
    const [file, version] = process.argv.slice(1);
    fs.writeFileSync(file, fs.readFileSync(file, "utf8").replaceAll("__VERSION__", version));
  ' "$pr_body_file" "$VERSION"

  pr_url="$(cd "$wt" && gh pr list --state open --head "$branch" --json url -q '.[0].url' 2>/dev/null)"
  if [ -z "$pr_url" ]; then
    pr_url="$(cd "$wt" && gh pr create \
      --title "chore: ksk-design-system v${VERSION} に bump" \
      --body-file "$pr_body_file" \
      2>/dev/null | tail -1)"
  fi
  rm -f "$pr_body_file"

  # 既に同ブランチの PR がある場合 gh は失敗するので既存 PR URL を拾う
  if [ -z "$pr_url" ]; then
    pr_url="$(cd "$wt" && gh pr list --head "$branch" --json url -q '.[0].url' 2>/dev/null)"
  fi

  cleanup
  RESULTS+=("$name: OK ${pr_url:-（PR URL 未取得・branch は push 済）}")
  echo -e "${GREEN}OK${NC} ${pr_url:-}"
done

echo ""
echo "======================================="
for r in "${RESULTS[@]}"; do echo "$r"; done
