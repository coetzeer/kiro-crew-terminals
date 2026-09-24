import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { SessionManager } from '../lib/session-manager.mjs';

let dir;
beforeEach(() => {
  dir = mkdtempSync(path.join(os.tmpdir(), 'herdr-sm-'));
  process.env.KIRO_HERRD_DATA_DIR = dir;
});
afterEach(() => {
  delete process.env.KIRO_HERRD_DATA_DIR;
  rmSync(dir, { recursive: true, force: true });
});

test('describe/knownList/list are consistent with the session map', () => {
  const sm = new SessionManager();
  sm.known = [
    { ref: 'tmux:work', providerId: 'tmux', name: 'work', key: 'work', cmd: ['tmux', 'attach', '-t', 'work'], cwd: '/tmp' },
  ];
  assert.equal(sm.has('tmux:work'), false); // maps only live PTYs, not known list
  assert.deepEqual(sm.list(), []);
  const known = sm.knownList();
  assert.equal(known.length, 1);
  assert.equal(known[0].ref, 'tmux:work');
  assert.equal(known[0].name, 'work');
  assert.deepEqual(known[0].cmd, ['tmux', 'attach', '-t', 'work']);
});

test('persist/loadKnown round-trip survives a fresh instance (the restart story)', () => {
  const one = new SessionManager();
  one.known = [
    { ref: 'screen:123', providerId: 'screen', name: 'work', key: '123', cmd: ['screen', '-r', '123'], cwd: dir },
  ];
  one.persist();

  const two = new SessionManager();
  const loaded = two.loadKnown();
  assert.equal(loaded.length, 1);
  assert.equal(loaded[0].ref, 'screen:123');
  assert.equal(loaded[0].providerId, 'screen');
  assert.deepEqual(loaded[0].cmd, ['screen', '-r', '123']);
});

test('loadKnown filters malformed/garbage entries instead of crashing', () => {
  const sm = new SessionManager();
  sm.known = [
    { ref: 'ok', providerId: 'tmux', name: 'ok', key: 'ok', cmd: ['tmux', 'attach'], cwd: dir },
    { ref: 'bad-no-cmd', providerId: 'tmux', name: 'b', key: 'b' }, // invalid: cmd missing
    { ref: 'bad-cmd-type', providerId: 'tmux', name: 'c', key: 'c', cmd: 'nope' }, // cmd not an array
    null,
    42,
  ];
  sm.persist();
  const two = new SessionManager();
  const loaded = two.loadKnown();
  assert.equal(loaded.length, 1);
  assert.equal(loaded[0].ref, 'ok');
});

test('an unparsable state file yields an empty known list', () => {
  const sm = new SessionManager();
  sm.ensureDir();
  writeFileSync(sm.stateFile, '{ not json', 'utf8');
  const two = new SessionManager();
  assert.deepEqual(two.loadKnown(), []);
});

test('describe maps a descriptor onto the canonical shape', () => {
  const sm = new SessionManager();
  const d = sm.describe({ ref: 't:w', providerId: 'tmux', name: 'w', key: 'w', cmd: ['tmux'], cwd: undefined });
  assert.deepEqual(d, { ref: 't:w', providerId: 'tmux', name: 'w', key: 'w', cmd: ['tmux'], cwd: undefined });
});

test('close/write on an unknown ref are non-events', () => {
  const sm = new SessionManager();
  assert.equal(sm.close('no-such-ref'), false);
  assert.equal(sm.write('no-such-ref', 'data'), false);
});