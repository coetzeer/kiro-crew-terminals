// SessionManager lifecycle coverage: mirror creation, output buffering and
// viewer fan-out, input/resize/close, exit retirement + persistence, and
// restore. Everything runs on the in-memory fake PTY — no node-pty, no real
// terminal (plan §2).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { SessionManager } from '../lib/session-manager.mjs';
import { createFakePtyFactory } from './helpers.mjs';

function fresh() {
  const fakePty = createFakePtyFactory();
  const dir = mkdtempSync(path.join(os.tmpdir(), 'herdr-sm-life-'));
  const sm = new SessionManager({ pty: fakePty.spawn, dataDir: dir });
  return { sm, fakePty, dir };
}

const WORK = { providerId: 'tmux', name: 'work', cmd: ['tmux', 'attach', '-t', 'work'], key: 'work', cwd: '/tmp' };

// --- Mirror creation --------------------------------------------------------

test('createSession rejects an empty or missing attach command', () => {
  const { sm } = fresh();
  assert.throws(() => sm.createSession({ providerId: 'tmux', name: 'x', cmd: [] }), /No attach command/);
  assert.throws(() => sm.createSession({ providerId: 'tmux', name: 'x' }), /No attach command/);
});

test('createSession spawns the requested executable and arguments', () => {
  const { sm, fakePty } = fresh();
  sm.createSession(WORK);
  assert.equal(fakePty.spawned.length, 1);
  assert.equal(fakePty.spawned[0].shell, 'tmux');
  assert.deepEqual(fakePty.spawned[0].args, ['attach', '-t', 'work']);
});

test('createSession passes terminal name, dimensions, cwd and env to the PTY', () => {
  const { sm, fakePty } = fresh();
  sm.createSession(WORK);
  const opts = fakePty.spawned[0].opts;
  assert.equal(opts.name, 'xterm-256color');
  assert.equal(opts.cols, 120);
  assert.equal(opts.rows, 36);
  assert.equal(opts.cwd, '/tmp');
  assert.equal(opts.env.TERM, 'xterm-256color');
  assert.equal(opts.env.COLORTERM, 'truecolor');
  // The rest of the process environment rides along for the attach process.
  assert.ok(opts.env.PATH || opts.env.PATH === '');
});

test('createSession defaults the working directory to the app data dir', () => {
  const { sm, fakePty, dir } = fresh();
  sm.createSession({ ...WORK, cwd: undefined });
  assert.equal(fakePty.spawned[0].opts.cwd, dir);
});

test('the canonical ref uses the provider-native key', () => {
  const { sm } = fresh();
  const d = sm.createSession({ providerId: 'screen', name: 'work', cmd: ['screen', '-r', '4242'], key: '4242' });
  assert.equal(d.ref, 'screen:4242');
});

test('the ref falls back to the session name when no key is supplied', () => {
  const { sm } = fresh();
  const d = sm.createSession({ providerId: 'tmux', name: 'work', cmd: ['tmux', 'attach'] });
  assert.equal(d.ref, 'tmux:work');
});

test('a second createSession for the same ref reuses the mirror without respawning', () => {
  const { sm, fakePty } = fresh();
  const a = sm.createSession(WORK);
  const b = sm.createSession({ ...WORK, cmd: ['tmux', 'attach', '-t', 'other'] });
  assert.equal(fakePty.spawned.length, 1);
  assert.equal(a.ref, b.ref);
  // The reused mirror keeps its original command.
  assert.deepEqual(b.cmd, ['tmux', 'attach', '-t', 'work']);
});

test('a new mirror lands in the live map and known persistence exactly once', () => {
  const { sm, fakePty, dir } = fresh();
  sm.createSession(WORK);
  sm.createSession(WORK); // reuse path must not duplicate bookkeeping
  assert.equal(sm.sessions.size, 1);
  assert.equal(sm.known.length, 1);
  const onDisk = JSON.parse(readFileSync(path.join(dir, 'known-sessions.json'), 'utf8'));
  assert.equal(onDisk.length, 1);
  assert.equal(onDisk[0].ref, 'tmux:work');
});

test('createSession emits one spawn event with the canonical description', () => {
  const { sm } = fresh();
  const events = [];
  sm.on('spawn', (ref, desc) => events.push({ ref, desc }));
  sm.createSession(WORK);
  assert.equal(events.length, 1);
  assert.equal(events[0].ref, 'tmux:work');
  assert.deepEqual(events[0].desc, {
    ref: 'tmux:work', providerId: 'tmux', name: 'work', key: 'work',
    cmd: ['tmux', 'attach', '-t', 'work'], cwd: '/tmp',
  });
});

// --- Output and viewers -----------------------------------------------------

test('PTY output is appended to the replay buffer', () => {
  const { sm, fakePty } = fresh();
  const d = sm.createSession(WORK);
  fakePty.emit(0, 'hello ');
  fakePty.emit(0, 'world');
  assert.deepEqual(sm.get(d.ref).buffer, ['hello ', 'world']);
});

test('the replay buffer retains at most 2000 chunks, discarding the oldest first', () => {
  const { sm, fakePty } = fresh();
  const d = sm.createSession(WORK);
  const total = 2005;
  for (let i = 0; i < total; i++) fakePty.emit(0, 'c' + i);
  const buffer = sm.get(d.ref).buffer;
  assert.equal(buffer.length, 2000);
  assert.equal(buffer[0], 'c5'); // first five chunks were shifted out
  assert.equal(buffer[buffer.length - 1], 'c' + (total - 1));
});

test('each output chunk fans out to every registered viewer callback', () => {
  const { sm, fakePty } = fresh();
  const d = sm.createSession(WORK);
  const mirror = sm.get(d.ref);
  const got = { a: [], b: [], c: [] };
  mirror.viewers.add([(data) => got.a.push(data)]);
  mirror.viewers.add([(data) => got.b.push(data), (data) => got.c.push(data)]);
  fakePty.emit(0, 'chunk-1');
  assert.deepEqual(got.a, ['chunk-1']);
  assert.deepEqual(got.b, ['chunk-1']);
  assert.deepEqual(got.c, ['chunk-1']);
});

test('the manager-level data event carries the ref and the data', () => {
  const { sm, fakePty } = fresh();
  const events = [];
  sm.on('data', (ref, data) => events.push([ref, data]));
  const d = sm.createSession(WORK);
  fakePty.emit(0, 'out');
  assert.deepEqual(events, [[d.ref, 'out']]);
});

test('output with no viewers is a no-op, not an error', () => {
  const { sm, fakePty } = fresh();
  sm.createSession(WORK);
  assert.doesNotThrow(() => fakePty.emit(0, 'nobody listening'));
});

// --- Input, resize, and close ----------------------------------------------

test('input is forwarded to the PTY of the requested ref only', () => {
  const { sm, fakePty } = fresh();
  sm.createSession(WORK);
  sm.createSession({ ...WORK, name: 'other', key: 'other', cmd: ['tmux', 'attach', '-t', 'other'] });
  assert.equal(sm.write('tmux:work', 'ls\r'), true);
  assert.deepEqual(fakePty.spawned[0].writes, ['ls\r']);
  assert.deepEqual(fakePty.spawned[1].writes, []);
});

test('input to an unknown ref returns false and performs no work', () => {
  const { sm, fakePty } = fresh();
  sm.createSession(WORK);
  assert.equal(sm.write('tmux:nope', 'x'), false);
  assert.deepEqual(fakePty.spawned[0].writes, []);
});

test('explicit resize dimensions are forwarded to the PTY', () => {
  const { sm, fakePty } = fresh();
  sm.createSession(WORK);
  assert.equal(sm.write('tmux:work', null, { resize: true, cols: 90, rows: 25 }), true);
  assert.deepEqual(fakePty.spawned[0].resizes, [[90, 25]]);
  assert.deepEqual(fakePty.spawned[0].writes, []); // resize never writes data
});

test('resize without dimensions uses the 120x36 default', () => {
  const { sm, fakePty } = fresh();
  sm.createSession(WORK);
  sm.write('tmux:work', null, { resize: true });
  assert.deepEqual(fakePty.spawned[0].resizes, [[120, 36]]);
});

test('a throwing PTY resize is ignored while still reporting the session as found', () => {
  const { sm, fakePty } = fresh();
  sm.createSession(WORK);
  fakePty.spawned[0].resizeError = new Error('cannot resize');
  assert.equal(sm.write('tmux:work', null, { resize: true, cols: 1, rows: 1 }), true);
});

test('close kills only the mirror PTY of that ref', () => {
  const { sm, fakePty } = fresh();
  sm.createSession(WORK);
  sm.createSession({ ...WORK, name: 'other', key: 'other', cmd: ['tmux', 'attach', '-t', 'other'] });
  assert.equal(sm.close('tmux:work'), true);
  assert.equal(fakePty.spawned[0].killCount, 1);
  assert.equal(fakePty.spawned[1].killCount, 0);
});

test('an exception from pty.kill() is tolerated', () => {
  const { sm, fakePty } = fresh();
  sm.createSession(WORK);
  fakePty.spawned[0].killError = new Error('already dead');
  assert.equal(sm.close('tmux:work'), true);
});

test('close returns false for an unknown or already-retired mirror', () => {
  const { sm, fakePty } = fresh();
  assert.equal(sm.close('no-such-ref'), false);
  sm.createSession(WORK);
  fakePty.exit(0); // mirror retired by its own exit
  assert.equal(sm.close('tmux:work'), false);
});

// --- Exit and persistence ----------------------------------------------------

test('an exited mirror is retired from the live map, the known list, and disk', () => {
  const { sm, fakePty, dir } = fresh();
  sm.createSession(WORK);
  fakePty.exit(0, 3);
  assert.equal(sm.sessions.size, 0);
  assert.equal(sm.known.length, 0);
  const onDisk = JSON.parse(readFileSync(path.join(dir, 'known-sessions.json'), 'utf8'));
  assert.deepEqual(onDisk, []);
});

test('exit emits one exit event with the ref and exit code', () => {
  const { sm, fakePty } = fresh();
  const events = [];
  sm.on('exit', (ref, code) => events.push([ref, code]));
  const d = sm.createSession(WORK);
  fakePty.exit(0, 3);
  assert.deepEqual(events, [[d.ref, 3]]);
});

test('exit clears every viewer callback collection', () => {
  const { sm, fakePty } = fresh();
  const d = sm.createSession(WORK);
  const mirror = sm.get(d.ref);
  const subA = [() => {}];
  const subB = [() => {}, () => {}];
  mirror.viewers.add(subA);
  mirror.viewers.add(subB);
  fakePty.exit(0);
  // The viewer arrays are emptied so a late chunk cannot reach a closed socket.
  for (const arr of mirror.viewers) assert.equal(arr.length, 0);
});

test('one mirror exiting leaves other sessions fully intact', () => {
  const { sm, fakePty } = fresh();
  sm.createSession(WORK);
  const other = sm.createSession({ ...WORK, name: 'other', key: 'other', cmd: ['tmux', 'attach', '-t', 'other'] });
  fakePty.emit(1, 'still alive');
  fakePty.exit(0);
  assert.equal(sm.sessions.size, 1);
  assert.ok(sm.has(other.ref));
  assert.equal(sm.known.length, 1);
  assert.equal(sm.known[0].ref, other.ref);
  fakePty.emit(1, 'more output');
  assert.deepEqual(sm.get(other.ref).buffer, ['still alive', 'more output']);
});

test('a non-array state file is rejected without crashing', () => {
  const { sm, dir } = fresh();
  writeFileSync(path.join(dir, 'known-sessions.json'), '{"sessions": []}', 'utf8');
  assert.deepEqual(sm.loadKnown(), []);
});

test('persistence write and rename failures are non-fatal', () => {
  const fakePty = createFakePtyFactory();

  // Rename failure: a directory sitting where the state file belongs makes the
  // atomic rename fail after the tmp write already succeeded.
  const dir = mkdtempSync(path.join(os.tmpdir(), 'herdr-sm-rename-'));
  const blocker = path.join(dir, 'known-sessions.json');
  writeFileSync(blocker, '', 'utf8');
  const sm = new SessionManager({ pty: fakePty.spawn, dataDir: dir });
  sm.known = [{ ref: 'tmux:x', providerId: 'tmux', name: 'x', key: 'x', cmd: ['tmux'], cwd: dir }];
  assert.doesNotThrow(() => sm.persist());

  // Write failure: the data dir cannot even be created (a file sits in the
  // way), so ensureDir itself throws inside persist's try.
  const filePath = path.join(dir, 'i-am-a-file');
  writeFileSync(filePath, '', 'utf8');
  const sm2 = new SessionManager({ pty: fakePty.spawn, dataDir: path.join(filePath, 'sub') });
  sm2.known = [{ ref: 'tmux:y', providerId: 'tmux', name: 'y', key: 'y', cmd: ['tmux'], cwd: dir }];
  assert.doesNotThrow(() => sm2.persist());
  assert.deepEqual(sm2.loadKnown(), []);

  rmSync(dir, { recursive: true, force: true });
});

// --- Restore -----------------------------------------------------------------

test('restore re-attaches every valid persisted session when no resolver is supplied', async () => {
  // The restart story: a first manager persists its known sessions, a fresh
  // manager over the same data dir restores them all.
  const dir = mkdtempSync(path.join(os.tmpdir(), 'herdr-sm-restore-'));
  const writer = new SessionManager({ pty: createFakePtyFactory().spawn, dataDir: dir });
  writer.known = [
    { ref: 'tmux:work', providerId: 'tmux', name: 'work', key: 'work', cmd: ['tmux', 'attach', '-t', 'work'], cwd: dir },
    { ref: 'screen:42', providerId: 'screen', name: 'side', key: '42', cmd: ['screen', '-r', '42'], cwd: dir },
  ];
  writer.persist();

  const fakePty = createFakePtyFactory();
  const restored = new SessionManager({ pty: fakePty.spawn, dataDir: dir });
  const count = await restored.restore();
  assert.equal(count, 2);
  assert.equal(fakePty.spawned.length, 2);
  assert.deepEqual(fakePty.spawned[0].args, ['attach', '-t', 'work']);
  assert.deepEqual(fakePty.spawned[1].args, ['-r', '42']);
  assert.ok(restored.has('tmux:work'));
  assert.ok(restored.has('screen:42'));
  rmSync(dir, { recursive: true, force: true });
});

test('a resolver returning a command array replaces the persisted command', async () => {
  const { sm, fakePty, dir } = fresh();
  sm.known = [{ ref: 'tmux:work', providerId: 'tmux', name: 'work', key: 'work', cmd: ['tmux', 'attach', '-t', 'stale'], cwd: dir }];
  sm.persist();
  const two = new SessionManager({ pty: fakePty.spawn, dataDir: dir });
  const count = await two.restore({ resolveCmd: async () => ['tmux', 'attach', '-t', 'fresh'] });
  assert.equal(count, 1);
  assert.deepEqual(fakePty.spawned[0].args, ['attach', '-t', 'fresh']);
});

test('a resolver returning { cmd, key } attaches under the fresh native key', async () => {
  const { sm, fakePty, dir } = fresh();
  // A screen pid goes stale across restarts; the resolver hands back the new one.
  sm.known = [{ ref: 'screen:999', providerId: 'screen', name: 'work', key: '999', cmd: ['screen', '-r', '999'], cwd: dir }];
  sm.persist();
  const two = new SessionManager({ pty: fakePty.spawn, dataDir: dir });
  const count = await two.restore({
    resolveCmd: async () => ({ cmd: ['screen', '-r', '1234'], key: '1234' }),
  });
  assert.equal(count, 1);
  assert.ok(two.has('screen:1234'));
  assert.deepEqual(two.known[0].key, '1234');
  assert.deepEqual(fakePty.spawned[0].args, ['-r', '1234']);
});

test('a resolver returning false skips the record without spawning', async () => {
  const { sm, fakePty, dir } = fresh();
  sm.known = [{ ref: 'tmux:work', providerId: 'tmux', name: 'work', key: 'work', cmd: ['tmux', 'attach'], cwd: dir }];
  sm.persist();
  const two = new SessionManager({ pty: fakePty.spawn, dataDir: dir });
  const count = await two.restore({ resolveCmd: async () => false });
  assert.equal(count, 0);
  assert.equal(fakePty.spawned.length, 0);
  // Skipped, not forgotten: the record stays known for a later restore.
  assert.equal(two.known.length, 1);
});

test('a throwing resolver falls back to the persisted command', async () => {
  const { sm, fakePty, dir } = fresh();
  sm.known = [{ ref: 'tmux:work', providerId: 'tmux', name: 'work', key: 'work', cmd: ['tmux', 'attach', '-t', 'persisted'], cwd: dir }];
  sm.persist();
  const two = new SessionManager({ pty: fakePty.spawn, dataDir: dir });
  const count = await two.restore({ resolveCmd: async () => { throw new Error('provider unavailable'); } });
  assert.equal(count, 1);
  assert.deepEqual(fakePty.spawned[0].args, ['attach', '-t', 'persisted']);
});

test('a record whose PTY cannot be spawned is dropped, persisted, and reported', async () => {
  const { sm, dir } = fresh();
  sm.known = [
    { ref: 'tmux:work', providerId: 'tmux', name: 'work', key: 'work', cmd: ['tmux', 'attach'], cwd: dir },
    { ref: 'tmux:side', providerId: 'tmux', name: 'side', key: 'side', cmd: ['tmux', 'attach'], cwd: dir },
  ];
  sm.persist();
  const failing = createFakePtyFactory();
  failing.spawn = () => { throw new Error('spawn refused'); };
  const two = new SessionManager({ pty: failing.spawn, dataDir: dir });
  const failures = [];
  two.on('restore-failed', (ref, err) => failures.push([ref, err]));
  const count = await two.restore();
  assert.equal(count, 0);
  assert.equal(failures.length, 2);
  assert.equal(failures[0][0], 'tmux:work');
  assert.match(failures[0][1], /spawn refused/);
  // Dropped from memory and from disk so the next restart does not retry them.
  assert.equal(two.known.length, 0);
  const onDisk = JSON.parse(readFileSync(path.join(dir, 'known-sessions.json'), 'utf8'));
  assert.deepEqual(onDisk, []);
});

test('restore returns the resulting number of live mirrors', async () => {
  const { sm, fakePty, dir } = fresh();
  sm.known = [
    { ref: 'tmux:work', providerId: 'tmux', name: 'work', key: 'work', cmd: ['tmux', 'attach'], cwd: dir },
    { ref: 'tmux:work2', providerId: 'tmux', name: 'work2', key: 'work2', cmd: ['tmux', 'attach'], cwd: dir },
  ];
  sm.persist();
  const two = new SessionManager({ pty: fakePty.spawn, dataDir: dir });
  // One record is skipped by the resolver, one spawns.
  const count = await two.restore({
    resolveCmd: async (k) => (k.ref === 'tmux:work' ? false : null),
  });
  assert.equal(count, 1);
});
