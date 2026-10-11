// Provider behavior beyond createCommand: output parsing, stderr surfacing,
// fallbacks, retries and kill semantics — driven entirely through the injected
// command runner, so none of these tests require tmux, screen, zellij, herdr or
// aoe to exist (plan §5).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TmuxProvider } from '../providers/tmux.mjs';
import { ScreenProvider } from '../providers/screen.mjs';
import { ZellijProvider } from '../providers/zellij.mjs';
import { HerdrProvider } from '../providers/herdr.mjs';
import { AoeProvider } from '../providers/aoe.mjs';
import { scriptedRunner, instantDelay, fakeFindBin } from './helpers.mjs';

const make = (Provider, steps, extra = {}) =>
  new Provider({ run: scriptedRunner(steps), findBin: fakeFindBin, delay: instantDelay, ...extra });

const ok = (out = '') => ({ ok: true, out, err: '' });
const fail = (err = 'boom') => ({ ok: false, out: '', err });

// --- tmux -------------------------------------------------------------------

test('tmux list parses trimmed non-empty session names', async () => {
  const p = make(TmuxProvider, [ok('work\n\n   side  \n')]);
  const sessions = await p.list();
  assert.deepEqual(sessions.map((s) => s.name), ['work', 'side']);
  assert.equal(sessions[0].ref, 'work');
  assert.deepEqual(sessions[0].cmd, ['/usr/bin/tmux', 'attach', '-t', 'work']);
});

test('tmux list returns an empty list when list-sessions fails', async () => {
  const p = make(TmuxProvider, [fail('no server running')]);
  assert.deepEqual(await p.list(), []);
});

test('tmux create returns the expected descriptor on success', async () => {
  const p = make(TmuxProvider, [ok()]);
  const d = await p.create('work');
  assert.deepEqual(d, {
    ref: 'work', name: 'work', provider: 'tmux',
    cmd: ['/usr/bin/tmux', 'attach', '-t', 'work'],
  });
});

test('tmux create throws with tmux stderr when creation fails', async () => {
  const p = make(TmuxProvider, [fail('duplicate session: work')]);
  await assert.rejects(() => p.create('work'), /duplicate session: work/);
});

test('tmux kill refuses a request with no target', async () => {
  const p = make(TmuxProvider, []);
  const r = await p.kill({ key: '', name: '' });
  assert.equal(r.ok, false);
  assert.match(r.reason, /no tmux session name given/);
});

test('tmux kill uses the exact-name =target syntax', async () => {
  const p = make(TmuxProvider, [ok()]);
  const r = await p.kill({ key: 'work', name: 'work' });
  assert.deepEqual(r, { ok: true });
  assert.deepEqual(p.run.calls[0].args, ['kill-session', '-t', '=work']);
});

test('tmux kill treats a failed kill as success when the session is already gone', async () => {
  const p = make(TmuxProvider, [fail('no server running'), ok('')]);
  const r = await p.kill({ key: 'work', name: 'work' });
  assert.deepEqual(r, { ok: true });
});

test('tmux kill reports failure and stderr when the target still exists', async () => {
  const p = make(TmuxProvider, [fail('can not kill a linked session'), ok('work\n')]);
  const r = await p.kill({ key: 'work', name: 'work' });
  assert.equal(r.ok, false);
  assert.match(r.reason, /can not kill a linked session/);
  assert.match(r.reason, /"work"/);
});

// --- screen ------------------------------------------------------------------

const SCREEN_LS = [
  'There are screens on:',
  '\t12345.work\t(Detached)',
  '\t11111._internal\t(Detached)',
  '\t22222.pts\t(Detached)',
  '',
].join('\n');

test('screen list parses pids and names from screen -ls output', async () => {
  const p = make(ScreenProvider, [ok(SCREEN_LS)]);
  const sessions = await p.list();
  // Internal ('_' names) and terminal ('pts') entries are excluded.
  assert.deepEqual(sessions.map((s) => s.name), ['work']);
  // The pid is both the identity and the attach target.
  assert.equal(sessions[0].ref, '12345');
  assert.deepEqual(sessions[0].cmd, ['/usr/bin/screen', '-r', '12345']);
});

test('screen create throws with stderr when creation fails', async () => {
  const p = make(ScreenProvider, [fail('socket directory permissions')]);
  await assert.rejects(() => p.create('work'), /socket directory permissions/);
});

test('screen create prefers the newly discovered pid', async () => {
  const p = make(ScreenProvider, [ok(), ok(SCREEN_LS)]);
  const d = await p.create('work');
  assert.equal(d.ref, '12345');
  assert.deepEqual(d.cmd, ['/usr/bin/screen', '-r', '12345']);
});

test('screen create falls back to the requested name when discovery has not caught up', async () => {
  const p = make(ScreenProvider, [ok(), ok('')]); // created, but not listed yet
  const d = await p.create('work');
  assert.deepEqual(d, {
    ref: 'work', name: 'work', provider: 'screen',
    cmd: ['/usr/bin/screen', '-r', 'work'],
  });
});

test('screen kill uses -S <native-ref> -X quit', async () => {
  const p = make(ScreenProvider, [ok()]);
  const r = await p.kill({ key: '12345', name: 'work' });
  assert.deepEqual(r, { ok: true });
  assert.deepEqual(p.run.calls[0].args, ['-S', '12345', '-X', 'quit']);
});

test('screen kill distinguishes an already-gone session from a genuine failure', async () => {
  const gone = make(ScreenProvider, [fail('no screen found'), ok('')]);
  assert.deepEqual(await gone.kill({ key: '12345', name: 'work' }), { ok: true });

  const stuck = make(ScreenProvider, [fail('permission denied'), ok(SCREEN_LS)]);
  const r = await stuck.kill({ key: '12345', name: 'work' });
  assert.equal(r.ok, false);
  assert.match(r.reason, /permission denied/);
});

// --- zellij ------------------------------------------------------------------

test('zellij list parses list-sessions --short without suffixes or blanks', async () => {
  const p = make(ZellijProvider, [ok('work\n\n   side  \n')]);
  const sessions = await p.list();
  assert.deepEqual(sessions.map((s) => s.name), ['work', 'side']);
  assert.deepEqual(sessions[0].cmd, ['/usr/bin/zellij', 'attach', 'work']);
});

test('zellij create tries attach --create-background first', async () => {
  const p = make(ZellijProvider, [ok(), ok('work\n')]);
  const d = await p.create('work');
  assert.deepEqual(p.run.calls[0].args, ['attach', '--create-background', 'work']);
  // The attach command closes the registration race with attach -c.
  assert.deepEqual(d.cmd, ['/usr/bin/zellij', 'attach', '-c', 'work']);
});

test('zellij create falls back to the legacy --session NAME --detach form', async () => {
  const p = make(ZellijProvider, [fail('unexpected argument'), ok(), ok('work\n')]);
  const d = await p.create('work');
  assert.deepEqual(p.run.calls[0].args, ['attach', '--create-background', 'work']);
  assert.deepEqual(p.run.calls[1].args, ['--session', 'work', '--detach']);
  assert.deepEqual(d.cmd, ['/usr/bin/zellij', 'attach', '-c', 'work']);
});

test('zellij create throws with stderr when both creation forms fail', async () => {
  const p = make(ZellijProvider, [fail('unexpected argument'), fail('unknown flag')]);
  await assert.rejects(() => p.create('work'), /unknown flag/);
});

test('zellij waitReady reports ready when the session appears during polling', async () => {
  const p = make(ZellijProvider, [ok(''), ok('work\n')]);
  assert.equal(await p.waitReady('work', 4000), true);
});

test('zellij waitReady times out without throwing', async () => {
  // A persistent empty listing (not a queue) — with an instant delay the poll
  // loop spins hot until the tiny deadline passes, which would exhaust a
  // scripted runner.
  const p = new ZellijProvider({ run: async () => ok(''), findBin: fakeFindBin, delay: instantDelay });
  assert.equal(await p.waitReady('work', 1), false);
});

test('zellij kill tries delete-session --force first and succeeds', async () => {
  const p = make(ZellijProvider, [ok()]);
  const r = await p.kill({ key: 'work', name: 'work' });
  assert.deepEqual(r, { ok: true });
  assert.deepEqual(p.run.calls[0].args, ['delete-session', '--force', 'work']);
});

test('zellij kill treats a non-zero delete as success when the session disappeared', async () => {
  const p = make(ZellijProvider, [fail('session has attached clients'), ok('')]);
  const r = await p.kill({ key: 'work', name: 'work' });
  assert.deepEqual(r, { ok: true });
});

test('zellij kill retries both kill forms and reports the final useful error', async () => {
  const p = make(ZellijProvider, [
    fail('delete refused'), ok('work\n'),   // attempt 1: delete, still there
    fail('kill refused-1'), ok('work\n'),   // attempt 1: kill, still there
    fail('delete refused-2'), ok('work\n'), // attempt 2: delete, still there
    fail('kill refused-final'), ok('work\n'), // attempt 2: kill, still there
  ]);
  const r = await p.kill({ key: 'work', name: 'work' });
  assert.equal(r.ok, false);
  assert.match(r.reason, /kill refused-final/);
  assert.match(r.reason, /"work"/);
  // The full retry ladder ran: delete + kill per attempt.
  assert.deepEqual(p.run.calls.map((c) => c.args[0]), [
    'delete-session', 'list-sessions', 'kill-session', 'list-sessions',
    'delete-session', 'list-sessions', 'kill-session', 'list-sessions',
  ]);
});

// --- herdr -------------------------------------------------------------------

test('herdr list parses JSON session output including the running state', async () => {
  const p = make(HerdrProvider, [ok(JSON.stringify({
    sessions: [
      { name: 'alpha', running: true },
      { name: 'beta', running: false },
      { name: '   ' },
    ],
  }))]);
  const sessions = await p.list();
  assert.deepEqual(sessions.map((s) => [s.name, s.running]), [['alpha', true], ['beta', false]]);
  assert.deepEqual(sessions[0].cmd, ['/usr/bin/herdr', '--session', 'alpha']);
});

test('herdr list ignores malformed or nameless JSON entries', async () => {
  const p = make(HerdrProvider, [ok(JSON.stringify({ sessions: [{ nope: 1 }, { name: 'ok' }] }))]);
  const sessions = await p.list();
  assert.deepEqual(sessions.map((s) => s.name), ['ok']);
});

test('herdr list falls back to the plain table when JSON is invalid', async () => {
  const p = make(HerdrProvider, [
    ok('{ not json'),
    ok('NAME     STATE\nalpha    running\n\nbeta     stopped'),
  ]);
  const sessions = await p.list();
  // Header and blank lines are ignored; the first column is the name.
  assert.deepEqual(sessions.map((s) => s.name), ['alpha', 'beta']);
});

test('herdr create returns the materialising attach command', async () => {
  const p = make(HerdrProvider, []);
  const d = await p.create('work');
  assert.deepEqual(d, {
    ref: 'work', name: 'work', provider: 'herdr',
    cmd: ['/usr/bin/herdr', '--session', 'work'],
  });
  // Creating is attaching for herdr — nothing is executed.
  assert.deepEqual(p.run.calls, []);
});

test('herdr kill stops a session using its provider-native identity', async () => {
  const p = make(HerdrProvider, [ok()]);
  const r = await p.kill({ key: 'work', name: 'work' });
  assert.deepEqual(r, { ok: true });
  assert.deepEqual(p.run.calls[0].args, ['session', 'stop', 'work']);
});

test('herdr kill treats a failed stop as success when the session is gone', async () => {
  const p = make(HerdrProvider, [
    fail('stop refused'),
    ok(JSON.stringify({ sessions: [{ name: 'other', running: true }] })),
  ]);
  assert.deepEqual(await p.kill({ key: 'work', name: 'work' }), { ok: true });
});

test('herdr kill treats a failed stop as success when the session is no longer running', async () => {
  const p = make(HerdrProvider, [
    fail('stop refused'),
    ok(JSON.stringify({ sessions: [{ name: 'work', running: false }] })),
  ]);
  assert.deepEqual(await p.kill({ key: 'work', name: 'work' }), { ok: true });
});

test('herdr kill reports stderr when a failed stop leaves the session running', async () => {
  const p = make(HerdrProvider, [
    fail('stop refused with detail'),
    ok(JSON.stringify({ sessions: [{ name: 'work', running: true }] })),
  ]);
  const r = await p.kill({ key: 'work', name: 'work' });
  assert.equal(r.ok, false);
  assert.match(r.reason, /stop refused with detail/);
});

// --- agent-of-empires ----------------------------------------------------------

test('aoe list parses both an array response and a { sessions: [] } response', async () => {
  const arr = make(AoeProvider, [ok(JSON.stringify([{ id: 'i1', title: 'one', state: 'live' }]))]);
  assert.deepEqual((await arr.list()).map((s) => s.name), ['one']);

  const wrapped = make(AoeProvider, [ok(JSON.stringify({ sessions: [{ id: 'i1', title: 'one', state: 'live' }] }))]);
  assert.deepEqual((await wrapped.list()).map((s) => s.name), ['one']);
});

test('aoe list excludes trashed and nameless sessions', async () => {
  const p = make(AoeProvider, [ok(JSON.stringify([
    { id: 'i1', title: 'live-one', state: 'live' },
    { id: 'i2', title: 'gone', state: 'trashed' },
    { state: 'live' },
  ]))]);
  const sessions = await p.list();
  assert.deepEqual(sessions.map((s) => s.name), ['live-one']);
});

test('aoe list prefers title, then name, then id for the identity', async () => {
  const p = make(AoeProvider, [ok(JSON.stringify([
    { id: 'i1', name: 'n1', title: 't1', state: 'live' },
    { id: 'i2', name: 'n2', state: 'live' },
    { id: 'i3', state: 'live' },
  ]))]);
  assert.deepEqual((await p.list()).map((s) => s.name), ['t1', 'n2', 'i3']);
});

test('aoe create runs add --scratch -t NAME and then starts the session', async () => {
  const p = make(AoeProvider, [ok(), ok()]);
  const d = await p.create('work');
  assert.deepEqual(p.run.calls[0].args, ['add', '--scratch', '-t', 'work']);
  assert.deepEqual(p.run.calls[1].args, ['session', 'start', 'work']);
  assert.deepEqual(d, {
    ref: 'work', name: 'work', provider: 'aoe',
    cmd: ['/usr/bin/aoe', 'session', 'attach', 'work'],
  });
});

test('aoe create throws with stderr when the add step fails', async () => {
  const p = make(AoeProvider, [fail('aoe: unrecognized flag')]);
  await assert.rejects(() => p.create('work'), /unrecognized flag/);
  assert.equal(p.run.calls.length, 1); // no start attempt after a failed add
});

test('aoe create removes the retained record when the start step fails', async () => {
  const p = make(AoeProvider, [ok(), fail('start refused'), ok()]);
  await assert.rejects(() => p.create('work'), /start refused/);
  assert.deepEqual(p.run.calls[2].args, ['remove', 'work']);
});

test('aoe create returns the hook-approval guidance when applicable', async () => {
  const p = make(AoeProvider, [ok(), fail('Error: agent hook paths have not been acknowledged')]);
  await assert.rejects(
    () => p.create('work'),
    /agent hook paths need approval.*Agent of Empires TUI/s,
  );
});
