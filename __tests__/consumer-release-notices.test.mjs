import test from 'node:test';
import assert from 'node:assert/strict';
import { DS_REPO, run, parseArgs, parseConsumerIssue, validateRelease, validateContract, noticeMarker } from '../templates/consumer-release-notices/check-ds-release.mjs';

const repo = 'ekusiek716/trip-todo';
const head = 'a'.repeat(40);
const merge = 'b'.repeat(40);
const token = 'secret-test-token';
const bumpPr = `https://github.com/${repo}/pull/200`;
const owner = { id: 42, login: 'ekusiek716', type: 'User' };
const entry = (number = 168, app = repo) => ({ dsIssue: 531, consumerIssue: `https://github.com/${app}/issues/${number}`, fixPr: 532 });
const marker = noticeMarker(531, 168);
const botComment = { user: { login: 'github-actions[bot]', type: 'Bot' }, body: marker };
function fixture(options = {}) {
  const calls = [];
  const comments = new Map();
  const labels = new Map();
  let labelExists = options.labelExists ?? false;
  let failures = options.labelFailures ?? 0;
  const json = (data, status = 200, headers = {}) => new Response(status === 204 ? null : JSON.stringify(data), { status, headers });
  const fetchImpl = async (url, init) => {
    const u = new URL(url);
    const path = u.pathname;
    const method = init.method;
    const body = init.body ? JSON.parse(init.body) : undefined;
    calls.push({ url, path, method, body, headers: init.headers });
    assert.equal(init.redirect, 'error');
    assert.ok(init.signal instanceof AbortSignal);
    if (options.intercept) {
      const response = await options.intercept({ url, path, method, body, init, json });
      if (response) return response;
    }
    if (u.hostname === 'registry.npmjs.org') {
      assert.equal(init.headers.Authorization, undefined);
      assert.equal(path, `/ksk-design-system/${options.release?.version ?? '1.99.0'}`);
      return json(options.release ?? { version: '1.99.0', gitHead: head, dist: { integrity: 'sha512-YWJjZA==' } });
    }
    assert.equal(u.origin, 'https://api.github.com');
    assert.equal(init.headers.Authorization, `Bearer ${token}`);
    if (path === '/user') return json(options.author ?? owner);
    if (path === `/repos/${repo}/pulls/200`) return json(options.bump ?? { state: 'open', merged: false,
      head: { ref: `chore/bump-ds-${options.release?.version ?? '1.99.0'}`, sha: head, repo: { full_name: repo } },
      base: { ref: 'main', repo: { full_name: repo } } });
    if (path === `/repos/${repo}/pulls/200/files`) return json(options.files ?? [{ filename: 'package.json' }, { filename: 'package-lock.json' }]);
    if (path === `/repos/${repo}/contents/package.json` || path === `/repos/${repo}/contents/package-lock.json`) {
      assert.equal(u.searchParams.get('ref'), head);
      const version = options.release?.version ?? '1.99.0';
      const pkg = path.endsWith('package-lock.json')
        ? options.lock ?? { packages: { 'node_modules/ksk-design-system': { version, integrity: 'sha512-YWJjZA==' } } }
        : options.package ?? { dependencies: { 'ksk-design-system': `^${version}` } };
      return json({ encoding: 'base64', content: Buffer.from(JSON.stringify(pkg)).toString('base64') });
    }
    if (method !== 'GET') assert.ok(path.startsWith(`/repos/${repo}/issues/`) || path === `/repos/${repo}/labels`);
    if (path === `/repos/${DS_REPO}/contents/contracts/consumer-requests.json`) {
      assert.equal(u.searchParams.get('ref'), options.release?.gitHead ?? head);
      if (options.legacy) return json({}, 404);
      return json({ encoding: 'base64', content: Buffer.from(JSON.stringify(options.contract ?? { schemaVersion: 1, requests: options.entries ?? [entry()] })).toString('base64') });
    }
    if (path === `/repos/${DS_REPO}/commits/${options.release?.gitHead ?? head}`) return json({ sha: options.release?.gitHead ?? head });
    if (path === `/repos/${DS_REPO}/pulls/532`) return json(options.pr ?? { merged: true, merge_commit_sha: merge });
    if (path === `/repos/${DS_REPO}/compare/${merge}...${options.release?.gitHead ?? head}`) return json({ status: options.comparison ?? 'ahead' });
    if (path === `/repos/${repo}/labels/ds%3Areleased`) return json({ name: 'ds:released' }, labelExists ? 200 : 404);
    if (path === `/repos/${repo}/labels` && method === 'POST') { labelExists = true; return json(body, 201); }
    const issueMatch = new RegExp(`^/repos/${repo}/issues/(\\d+)(.*)$`).exec(path);
    if (issueMatch) {
      const number = Number(issueMatch[1]);
      const suffix = issueMatch[2];
      if (!comments.has(number)) comments.set(number, structuredClone(options.comments ?? []));
      if (!labels.has(number)) labels.set(number, structuredClone(options.labels ?? [{ name: 'ds:waiting' }]));
      if (!suffix && method === 'GET') return json(options.issue ?? { state: 'open' });
      if (suffix === '/comments' && method === 'GET') {
        const page = Number(u.searchParams.get('page'));
        return json(comments.get(number).slice((page - 1) * 100, page * 100));
      }
      if (suffix === '/comments' && method === 'POST') { comments.get(number).push({ user: owner, body: body.body }); return json({}, 201); }
      if (suffix === '/labels' && method === 'GET') {
        const page = Number(u.searchParams.get('page'));
        return json(labels.get(number).slice((page - 1) * 100, page * 100));
      }
      if (suffix === '/labels' && method === 'POST') {
        if (failures-- > 0) return json({ message: token }, 500);
        labels.get(number).push({ name: 'ds:released' }); return json(labels.get(number));
      }
      if (suffix === '/labels/ds%3Awaiting' && method === 'DELETE') {
        labels.set(number, labels.get(number).filter((label) => label.name !== 'ds:waiting')); return json({}, 200);
      }
    }
    assert.fail(`Unexpected request: ${method} ${url}`);
  };
  return { calls, comments, labels, fetchImpl, exec: (overrides = {}) => run({ repo, version: options.release?.version ?? '1.99.0', bumpPr, apply: true, env: { GH_TOKEN: token, GITHUB_REPOSITORY: repo }, fetchImpl, ...overrides }) };
}
const writes = (f) => f.calls.filter((call) => call.method !== 'GET');
const posts = (f) => f.calls.filter((call) => call.method === 'POST' && call.path.endsWith('/comments'));

test('公開commit検証後に日本語通知・ラベル追加とwaiting削除。issueはcloseしない', async () => {
  const f = fixture();
  assert.equal((await f.exec()).exitCode, 0);
  assert.equal(posts(f).length, 1);
  const text = posts(f)[0].body.body;
  for (const value of [marker, 'DS側の修正がv1.99.0で公開済み。アプリ取り込み・動作確認待ち', `/issues/531`, `/pull/532`, merge, head, 'sha512-YWJjZA==']) assert.ok(text.includes(value));
  assert.deepEqual(f.labels.get(168), [{ name: 'ds:released' }]);
  assert.ok(!f.calls.some((call) => call.method === 'PATCH'));
});

for (const comparison of ['behind', 'diverged']) test(`未公開commit ${comparison} は待機`, async () => {
  const f = fixture({ comparison });
  assert.equal((await f.exec()).results[0].status, 'unreleased');
  assert.equal(writes(f).length, 0);
});
test('同一commitも公開済み', async () => {
  const f = fixture({ comparison: 'identical' });
  assert.equal((await f.exec()).results[0].status, 'notified');
});
test('closedでもmergedでないPRは待機', async () => {
  const f = fixture({ pr: { state: 'closed', merged: false, merge_commit_sha: merge } });
  assert.equal((await f.exec()).results[0].status, 'unmerged');
  assert.equal(writes(f).length, 0);
  assert.ok(!f.calls.some((call) => call.path.includes('/compare/')));
});
test('fixPr nullは未修正として待機', async () => {
  const f = fixture({ entries: [{ ...entry(), fixPr: null }] });
  assert.equal((await f.exec()).results[0].status, 'unfixed');
  assert.equal(writes(f).length, 0);
});
test('複数appのうち対象repoのみ処理', async () => {
  const f = fixture({ entries: [entry(99, 'ekusiek716/other-app'), entry(), entry(169)] });
  assert.equal((await f.exec()).exitCode, 0);
  assert.equal(posts(f).length, 2);
  assert.ok(!f.calls.some((call) => call.path.includes('/other-app/')));
});
test('対象外repoだけならDS PRも読まない', async () => {
  const f = fixture({ entries: [entry(99, 'ekusiek716/other-app')] });
  assert.deepEqual((await f.exec()).results, []);
  assert.ok(!f.calls.some((call) => call.path === `/repos/${DS_REPO}/pulls/532`));
});
test('旧版・登録なし・unfixedのみはpackage変更のないPRでも検証前にno-op', async () => {
  for (const options of [{ legacy: true }, { entries: [] },
    { entries: [entry(99, 'ekusiek716/other-app')] },
    { entries: [{ ...entry(), fixPr: null }] }]) {
    const f = fixture({ ...options, files: [{ filename: 'package-lock.json' }],
      package: { dependencies: { 'ksk-design-system': '*' } } });
    const result = await f.exec();
    assert.equal(result.exitCode, 0);
    assert.equal(writes(f).length, 0);
    assert.ok(!f.calls.some((call) => call.path.startsWith(`/repos/${repo}/`) || call.path === '/user'));
  }
});
test('対象依頼がなくても未知schemaや不正entryを成功扱いしない', async () => {
  for (const contract of [{ schemaVersion: 2, requests: [] }, { schemaVersion: 1, requests: [{ ...entry(), fixPr: -1 }] }]) {
    const f = fixture({ contract });
    assert.equal((await f.exec()).exitCode, 1);
    assert.equal(writes(f).length, 0);
  }
});
test('コメントを全ページ走査し、次のversionでも重複しない', async () => {
  const release = { version: '1.99.0', gitHead: head, dist: { integrity: 'sha512-YWJjZA==' } };
  const f = fixture({ release, comments: [...Array.from({ length: 100 }, () => ({ body: 'hello' })), botComment] });
  assert.equal((await f.exec()).exitCode, 0);
  release.version = '2.0.0';
  assert.equal((await f.exec()).exitCode, 0);
  assert.equal(posts(f).length, 1);
  assert.ok(posts(f)[0].body.body.includes('<!-- ksk-ds-bump-pr-notice:531:168 -->'));
  assert.ok(posts(f)[0].body.body.includes(bumpPr));
  assert.ok(f.calls.some((call) => call.url.includes('/comments?per_page=100&page=2')));
});
test('PRリンク付き通知は補足不要、他人の偽補足markerは無効', async () => {
  const complete = fixture({ comments: [{ ...botComment, body: `${marker}\nアプリ取り込みPR: ${bumpPr}` }] });
  assert.equal((await complete.exec()).exitCode, 0);
  assert.equal(posts(complete).length, 0);
  const forged = fixture({ comments: [botComment, { user: { id: 999, login: 'someone', type: 'User' }, body: '<!-- ksk-ds-bump-pr-notice:531:168 -->' }] });
  assert.equal((await forged.exec()).exitCode, 0);
  assert.equal(posts(forged).length, 1);
});
test('旧通知補足後のラベル失敗も補足を重複させず修復する', async () => {
  const f = fixture({ comments: [botComment], labelFailures: 1 });
  assert.equal((await f.exec()).exitCode, 1);
  assert.equal(posts(f).length, 1);
  assert.equal((await f.exec()).exitCode, 0);
  assert.equal(posts(f).length, 1);
});
test('旧通知の補足はdry-runで書き込まない', async () => {
  const f = fixture({ comments: [botComment] });
  const result = await f.exec({ apply: false });
  assert.equal(result.results[0].status, 'would-supplement-bump-pr');
  assert.equal(writes(f).length, 0);
});
test('人が書いた偽markerは重複扱いしない', async () => {
  const f = fixture({ comments: [{ body: marker, user: { login: 'ekusiek716', type: 'User' } }] });
  await f.exec();
  assert.equal(posts(f).length, 1);
});
test('コメント投稿後のラベル失敗を次回修復・他entryは継続', async () => {
  const f = fixture({ entries: [entry(), entry(169)], labelFailures: 1 });
  const first = await f.exec();
  assert.equal(first.exitCode, 1);
  assert.equal(first.results[0].consumerIssue, 169);
  assert.ok(!JSON.stringify(first).includes(token));
  assert.equal(posts(f).length, 2);
  assert.equal((await f.exec()).exitCode, 0);
  assert.equal(posts(f).length, 2);
  assert.deepEqual(f.labels.get(168), [{ name: 'ds:released' }]);
});
test('台帳内の重複entryは不正としてexit1、コメントは一度', async () => {
  const f = fixture({ entries: [entry(), entry()] });
  assert.equal((await f.exec()).exitCode, 1);
  assert.equal(posts(f).length, 1);
});
test('exportしたcontract検証はpending重複もreject、別DS依頼は許可', () => {
  const pending = { ...entry(), fixPr: null };
  assert.throws(() => validateContract({ schemaVersion: 1, requests: [pending, pending] }), /重複/);
  assert.throws(() => validateContract({ schemaVersion: 2, requests: [] }), /schema/);
  assert.throws(() => validateContract({ schemaVersion: 1, requests: [{ ...entry(), fixPr: -1 }] }));
  assert.doesNotThrow(() => validateContract({ schemaVersion: 1, requests: [entry(), { ...entry(), dsIssue: 533 }] }));
});
test('同じapp issueでも別dsIssueならそれぞれ通知する', async () => {
  const f = fixture({ entries: [entry(), { ...entry(), dsIssue: 533 }] });
  assert.equal((await f.exec()).exitCode, 0);
  assert.equal(posts(f).length, 2);
});
test('ownerのローカルPATでapplyでき再実行は重複しない', async () => {
  const f = fixture();
  const env = { GH_TOKEN: token, GITHUB_REPOSITORY: repo };
  const result = await f.exec({ env });
  assert.equal(result.exitCode, 0);
  assert.equal((await f.exec({ env })).exitCode, 0);
  assert.equal(posts(f).length, 1);
});
test('closed app issueはskip、PRはreject', async () => {
  for (const [issue, exitCode, status] of [[{ state: 'closed' }, 0, 'closed'], [{ state: 'closed', pull_request: {} }, 1, undefined]]) {
    const f = fixture({ issue });
    const result = await f.exec();
    assert.equal(result.exitCode, exitCode);
    assert.equal(result.results[0]?.status, status);
    assert.equal(writes(f).length, 0);
  }
});
test('不正URLをrejectし、残りのentryは続行', async () => {
  const invalid = ['http://github.com/ekusiek716/a/issues/1', 'https://github.com/evil/a/issues/1', 'https://github.com/ekusiek716/a/pull/1', 'https://github.com/ekusiek716/a/issues/1?x=1', 'https://github.com/ekusiek716/../issues/1', 'https://github.com/ekusiek716/a/issues/9007199254740992'];
  for (const url of invalid) assert.throws(() => parseConsumerIssue(url));
  const f = fixture({ entries: [{ ...entry(), consumerIssue: invalid[0] }, entry()] });
  assert.equal((await f.exec()).exitCode, 1);
  assert.equal(posts(f).length, 1);
});
test('不正SHA・prerelease・integrityをreject', async () => {
  const valid = { version: '1.0.0', gitHead: head, dist: { integrity: 'sha512-YWJjZA==' } };
  for (const release of [{ ...valid, gitHead: 'main' }, { ...valid, gitHead: 'abc123' }, { ...valid, version: '1.0.0-beta.1' }, { ...valid, dist: {} }]) {
    assert.throws(() => validateRelease(release));
    const f = fixture({ release });
    assert.equal((await f.exec()).exitCode, 1);
    assert.ok(f.calls.length <= 1);
  }
  const f = fixture({ pr: { merged: true, merge_commit_sha: 'main' } });
  assert.equal((await f.exec()).exitCode, 1);
  assert.equal(writes(f).length, 0);
});
test('旧公開版contract 404はno-op、未知schemaは失敗', async () => {
  const old = fixture({ legacy: true });
  assert.equal((await old.exec()).results[0].status, 'legacy-release');
  assert.ok(old.calls.some((call) => call.path === `/repos/${DS_REPO}/commits/${head}`));
  assert.equal(writes(old).length, 0);
  const unknown = fixture({ contract: { schemaVersion: 2, requests: [] } });
  assert.equal((await unknown.exec()).exitCode, 1);
});
test('contract 404でもgitHead不明・repoアクセス不可なら失敗する', async () => {
  for (const status of [404, 401, 403]) {
    const f = fixture({ legacy: true, intercept: ({ path, json }) => path.includes('/commits/') ? json({ message: token }, status) : undefined });
    const result = await f.exec();
    assert.equal(result.exitCode, 1);
    assert.deepEqual(result.results, []);
    assert.ok(!JSON.stringify(result).includes(token));
    assert.equal(writes(f).length, 0);
  }
});
test('commit APIのSHA欠落・不一致もlegacy成功にしない', async () => {
  for (const commit of [{}, { sha: merge }]) {
    const f = fixture({ legacy: true, intercept: ({ path, json }) => path.includes('/commits/') ? json(commit) : undefined });
    assert.equal((await f.exec()).exitCode, 1);
    assert.equal(writes(f).length, 0);
  }
});
test('versionは文字列のみ許可し暗黙の型変換を拒否する', () => {
  for (const version of [null, 1, ['1.0.0'], { toString: () => '1.0.0' }]) {
    assert.throws(() => validateRelease({ version, gitHead: head, dist: { integrity: 'sha512-YWJjZA==' } }));
  }
});
test('認証エラーを404扱いせずtokenを出さない', async () => {
  for (const status of [401, 403]) {
    const f = fixture({ intercept: ({ path, json }) => path.includes('/contents/') ? json({ message: token }, status) : undefined });
    const result = await f.exec();
    assert.equal(result.exitCode, 1);
    assert.ok(!JSON.stringify(result).includes(token));
    assert.equal(writes(f).length, 0);
  }
});
test('dry-runは通知/修復とも一切書き込まない', async () => {
  for (const comments of [[], [botComment]]) {
    const f = fixture({ comments });
    assert.equal((await f.exec({ apply: false })).exitCode, 0);
    assert.equal(writes(f).length, 0);
  }
  const args = ['--repo', repo, '--version', '1.99.0', '--bump-pr', bumpPr];
  assert.deepEqual(parseArgs(args), { repo, version: '1.99.0', bumpPr, apply: false });
  assert.deepEqual(parseArgs([...args, '--apply']), { repo, version: '1.99.0', bumpPr, apply: true });
  for (const args of [[], ['--repo', repo, '--unknown'], ['--repo', 'evil/app']]) assert.throws(() => parseArgs(args));
});
test('GITHUB_REPOSITORY不一致・owner違反・tokenなしは通信前にreject', async () => {
  for (const overrides of [{ env: { GH_TOKEN: token, GITHUB_REPOSITORY: 'ekusiek716/other' } }, { repo: 'evil/app' }, { env: {} }]) {
    const f = fixture();
    assert.equal((await f.exec(overrides)).exitCode, 1);
    assert.equal(f.calls.length, 0);
  }
});
test('タイムアウトとfetch例外は安全なエラー', async () => {
  const f = fixture();
  const timeout = await f.exec({ timeoutMs: 5, fetchImpl: (_url, init) => new Promise((_resolve, reject) => init.signal.addEventListener('abort', () => reject(new Error(token)))) });
  assert.equal(timeout.exitCode, 1);
  assert.match(timeout.errors[0].message, /タイムアウト/);
  const result = await f.exec({ fetchImpl: async () => { throw new Error(token); } });
  assert.equal(result.exitCode, 1);
  assert.ok(!JSON.stringify(result).includes(token));
});
test('issue labelsも全ページ取得しwaitingを削除', async () => {
  const f = fixture({ labels: [...Array.from({ length: 100 }, (_, i) => ({ name: `label-${i}` })), { name: 'ds:waiting' }] });
  assert.equal((await f.exec()).exitCode, 0);
  assert.ok(f.calls.some((call) => call.url.includes('/labels?per_page=100&page=2')));
  assert.ok(!f.labels.get(168).some((label) => label.name === 'ds:waiting'));
});

test('versionとbump PRは必須、不正URLは通信前に拒否', async () => {
  for (const overrides of [{ version: undefined }, { bumpPr: undefined }, { bumpPr: 'https://github.com/ekusiek716/other/pull/200' }, { version: 'latest' }]) {
    const f = fixture();
    assert.equal((await f.exec(overrides)).exitCode, 1);
    assert.equal(f.calls.length, 0);
  }
});
test('registryが別versionを返したら書き込まない', async () => {
  const f = fixture({ intercept: ({ url, json }) => url.includes('registry.npmjs.org')
    ? json({ version: '2.0.0', gitHead: head, dist: { integrity: 'sha512-YWJjZA==' } }) : undefined });
  assert.equal((await f.exec()).exitCode, 1);
  assert.equal(writes(f).length, 0);
});
test('bump PRのrepo/branch/base/未merge closeが不正なら書き込まない', async () => {
  const valid = { state: 'open', merged: false, head: { ref: 'chore/bump-ds-1.99.0', sha: head, repo: { full_name: repo } }, base: { ref: 'main', repo: { full_name: repo } } };
  for (const bump of [{ ...valid, state: 'closed' }, { ...valid, head: { ...valid.head, ref: 'feature/x' } },
    { ...valid, head: { ...valid.head, repo: { full_name: 'evil/fork' } } }, { ...valid, base: { ...valid.base, ref: 'develop' } }]) {
    const f = fixture({ bump });
    assert.equal((await f.exec()).exitCode, 1);
    assert.equal(writes(f).length, 0);
  }
  const merged = fixture({ bump: { ...valid, state: 'closed', merged: true } });
  assert.equal((await merged.exec()).exitCode, 0);
  assert.ok(posts(merged)[0].body.body.includes(bumpPr));
});
test('実PRのpackage/lock version・integrity不一致や変更欠落を拒否', async () => {
  for (const options of [{ package: { dependencies: { 'ksk-design-system': '^1.0.0' } } },
    { lock: { packages: { 'node_modules/ksk-design-system': { version: '1.0.0', integrity: 'sha512-YWJjZA==' } } } },
    { lock: { packages: { 'node_modules/ksk-design-system': { version: '1.99.0', integrity: 'sha512-ZA==' } } } }, { files: [] }]) {
    const f = fixture(options);
    assert.equal((await f.exec()).exitCode, 1);
    assert.equal(writes(f).length, 0);
  }
});
test('owner以外のPATは拒否・中央DS環境からowner PATは許可', async () => {
  const other = fixture({ author: { id: 999, login: 'other', type: 'User' } });
  assert.equal((await other.exec()).exitCode, 1);
  assert.equal(writes(other).length, 0);
  const central = fixture();
  assert.equal((await central.exec({ env: { GH_TOKEN: token, GITHUB_REPOSITORY: DS_REPO } })).exitCode, 0);
});
test('同一app issueに未修正依頼が残ればwaitingを保持', async () => {
  const f = fixture({ entries: [entry(), { ...entry(), dsIssue: 533, fixPr: null }] });
  assert.equal((await f.exec()).exitCode, 0);
  assert.equal(posts(f).length, 1);
  assert.ok(f.labels.get(168).some((label) => label.name === 'ds:waiting'));
  assert.ok(!f.calls.some((call) => call.method === 'DELETE'));
});
