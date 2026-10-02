import test from 'node:test';
import assert from 'node:assert/strict';
import { chmodSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// update-consumers.sh を DRY_RUN=1 で実際に走らせ、依存指定の書き換え方を確かめる。
// 2.9.0 の一括配布で、完全固定（"2.8.0"）を CI で検査している camera-app に "^2.9.0" が
// 書かれて落ちた。既存の指定方式（完全固定 / ^ / ~）を保つことを固定する。
// origin は一時 bare repo、npm は PATH 先頭の偽物（書き換え後の package.json を退避し、
// node_modules に指定版を置くだけ）で、ネットワーク・push・PR 作成は行わない。
const script = fileURLToPath(new URL('../scripts/update-consumers.sh', import.meta.url));
const scriptText = readFileSync(script, 'utf8');

function git(cwd, ...args) {
  const r = spawnSync('git', args, { cwd, encoding: 'utf8', env: gitEnv() });
  assert.equal(r.status, 0, `git ${args.join(' ')}: ${r.stderr}`);
}
function gitEnv(extra = {}) {
  return {
    PATH: process.env.PATH,
    GIT_CONFIG_GLOBAL: '/dev/null',
    GIT_CONFIG_NOSYSTEM: '1',
    GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@example.com',
    GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@example.com',
    ...extra,
  };
}
function writeJson(file, value) {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, JSON.stringify(value, null, 2) + '\n');
}

const PACKAGES = {
  'package.json': { name: 'root', dependencies: { 'ksk-design-system': '2.8.0' } },
  'packages/caret/package.json': { name: 'caret', peerDependencies: { 'ksk-design-system': '^2.8.0' } },
  'packages/tilde/package.json': { name: 'tilde', devDependencies: { 'ksk-design-system': '~2.8.0' } },
  'packages/range/package.json': { name: 'range', dependencies: { 'ksk-design-system': '>=2.0.0' } },
  'packages/legacy/package.json': { name: 'legacy', dependencies: { '@ksk/design-system': '1.40.0' } },
  'packages/star/package.json': { name: 'star', dependencies: { 'ksk-design-system': '*' } },
  'packages/ws/package.json': { name: 'ws', dependencies: { 'ksk-design-system': 'workspace:*' } },
};

function setup({ npmRewrites = false } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'ksk-update-consumers-'));
  const origin = join(root, 'origin.git');
  const seed = join(root, 'seed');
  const consumer = join(root, 'consumer');
  const capture = join(root, 'capture');
  const bin = join(root, 'bin');
  mkdirSync(seed); mkdirSync(capture); mkdirSync(bin); mkdirSync(join(root, 'home')); mkdirSync(join(root, 'tmp'));
  git(root, 'init', '-q', '--bare', '-b', 'main', origin);
  git(seed, 'init', '-q', '-b', 'main');
  for (const [rel, pkg] of Object.entries(PACKAGES)) writeJson(join(seed, rel), pkg);
  git(seed, 'add', '-A');
  git(seed, 'commit', '-q', '-m', 'init');
  git(seed, 'remote', 'add', 'origin', origin);
  git(seed, 'push', '-q', 'origin', 'main');
  git(root, 'clone', '-q', origin, consumer);

  // 偽 npm: 引数を記録し、install 時点の package.json 群を退避して node_modules に版を置く
  writeFileSync(join(bin, 'npm'), `#!/bin/bash
printf '%s\\n' "$*" > "$CAPTURE/npm-args"
git ls-files '*package.json' | while read -r f; do
  mkdir -p "$CAPTURE/$(dirname "$f")"; cp "$f" "$CAPTURE/$f"
done
mkdir -p node_modules/ksk-design-system
printf '{"name":"ksk-design-system","version":"%s"}\\n' "$FAKE_DS_VERSION" > node_modules/ksk-design-system/package.json
${npmRewrites ? `node -e 'const fs=require("fs");const p=JSON.parse(fs.readFileSync("package.json","utf8"));p.dependencies["ksk-design-system"]="^"+process.env.FAKE_DS_VERSION;fs.writeFileSync("package.json",JSON.stringify(p,null,2)+"\\n")'` : ''}
`);
  chmodSync(join(bin, 'npm'), 0o755);
  return { root, consumer, capture, bin };
}

function run(env) {
  return spawnSync('bash', ['--noprofile', '--norc', script, '2.9.0', env.consumer], {
    encoding: 'utf8',
    env: gitEnv({
      PATH: `${env.bin}:${process.env.PATH}`,
      HOME: join(env.root, 'home'),
      TMPDIR: join(env.root, 'tmp'),
      DRY_RUN: '1',
      GH_TOKEN: 'dummy',
      CAPTURE: env.capture,
      FAKE_DS_VERSION: '2.9.0',
      KSK_UPDATE_CONSUMERS_LOCK: join(env.root, 'run.lock'),
    }),
  });
}

function depOf(capture, rel) {
  const pkg = JSON.parse(readFileSync(join(capture, rel), 'utf8'));
  for (const k of ['dependencies', 'devDependencies', 'peerDependencies']) {
    if (pkg[k]?.['@ksk/design-system'] !== undefined) return `@ksk:${pkg[k]['@ksk/design-system']}`;
    if (pkg[k]?.['ksk-design-system'] !== undefined) return pkg[k]['ksk-design-system'];
  }
  return undefined;
}

test('DRY_RUN: 既存の指定方式（完全固定 / ^ / ~）を保って新版へ書き換える', () => {
  const env = setup();
  try {
    const r = run(env);
    assert.equal(r.status, 0, r.stdout + r.stderr);
    assert.match(r.stdout, /DRY_RUN \(commit のみ・push なし\)/);
    assert.equal(depOf(env.capture, 'package.json'), '2.9.0');
    assert.equal(depOf(env.capture, 'packages/caret/package.json'), '^2.9.0');
    assert.equal(depOf(env.capture, 'packages/tilde/package.json'), '~2.9.0');
    assert.equal(depOf(env.capture, 'packages/range/package.json'), '^2.9.0');
    // 旧名は新名へ移し、完全固定はそのまま完全固定
    assert.equal(depOf(env.capture, 'packages/legacy/package.json'), '2.9.0');
    // "*" と workspace: は触らない
    assert.equal(depOf(env.capture, 'packages/star/package.json'), '*');
    assert.equal(depOf(env.capture, 'packages/ws/package.json'), 'workspace:*');
    // パッケージ名を渡す install は save-prefix で "^" を付けるので、引数なしの install であること
    assert.equal(readFileSync(join(env.capture, 'npm-args'), 'utf8').trim(), 'install --no-audit --no-fund');
    // commit 本文に実際の書き換え結果が載る（"^x.y.z に更新" の固定文言ではない）
    assert.match(r.stdout, /`package\.json` dependencies: 2\.9\.0/);
    assert.match(r.stdout, /`packages\/tilde\/package\.json` devDependencies: ~2\.9\.0/);
    assert.doesNotMatch(r.stdout, /依存を \^2\.9\.0 に更新/);
  } finally {
    rmSync(env.root, { recursive: true, force: true });
  }
});

test('DRY_RUN: npm install が依存指定を書き換えたら FAIL にする', () => {
  const env = setup({ npmRewrites: true });
  try {
    const r = run(env);
    assert.equal(r.status, 1, r.stdout + r.stderr);
    assert.match(r.stdout, /FAIL \(npm install rewrote package\.json\)/);
  } finally {
    rmSync(env.root, { recursive: true, force: true });
  }
});

test('PR本文テンプレートは "^版" 固定の文言を持たず、実際の書き換え結果を差し込む', () => {
  const body = scriptText.slice(scriptText.indexOf("cat > \"$pr_body_file\" <<'EOF'"), scriptText.indexOf('\nEOF\n'));
  assert.ok(body.length > 0);
  assert.doesNotMatch(body, /\^__VERSION__/);
  assert.match(body, /^__SPECS__$/m);
  // 実際の本文生成部分を走らせ、プレースホルダが残らず書き換え結果が入ることを確かめる
  const start = scriptText.indexOf('  pr_body_file="$(mktemp)"');
  const endMarker = '\' "$pr_body_file" "$VERSION" "$SPEC_LINES"';
  const snippet = scriptText.slice(start, scriptText.indexOf(endMarker) + endMarker.length);
  const r = spawnSync('bash', ['--noprofile', '--norc'], {
    input: `VERSION=2.9.0\nSPEC_LINES=$'- \`package.json\` dependencies: 2.9.0\\n'\n${snippet}\ncat "$pr_body_file"; rm -f "$pr_body_file"`,
    encoding: 'utf8', env: { PATH: process.env.PATH },
  });
  assert.equal(r.status, 0, r.stderr);
  assert.doesNotMatch(r.stdout, /__SPECS__|__VERSION__/);
  assert.match(r.stdout, /接頭辞を維持）\n- `package\.json` dependencies: 2\.9\.0\n- `package-lock\.json`/);
});
