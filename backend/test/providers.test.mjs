import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TmuxProvider } from '../providers/tmux.mjs';
import { ScreenProvider } from '../providers/screen.mjs';
import { ZellijProvider } from '../providers/zellij.mjs';
import { AoeProvider } from '../providers/aoe.mjs';
import { HerdrProvider } from '../providers/herdr.mjs';

// createCommand is pure — no binary interaction — so it is safe to assert the
// exact argv every provider hands to the backend for a new session.
test('tmux createCommand builds a detached named session', () => {
  const p = new TmuxProvider();
  assert.deepEqual(p.createCommand('work'), ['tmux', 'new-session', '-d', '-s', 'work']);
});

test('screen createCommand opens a detached named session in bash -l', () => {
  const p = new ScreenProvider();
  assert.deepEqual(p.createCommand('work'), ['screen', '-d', '-m', '-S', 'work', '/bin/bash', '-l']);
});

test('zellij createCommand uses the background-attach form', () => {
  const p = new ZellijProvider();
  assert.deepEqual(p.createCommand('work'), ['zellij', 'attach', '--create-background', 'work']);
});

test('aoe createCommand is the scratch-tab attach', () => {
  const p = new AoeProvider();
  assert.deepEqual(p.createCommand('work'), ['aoe', 'add', '--scratch', '-t', 'work']);
});

test('herdr createCommand is the --session attach', () => {
  const p = new HerdrProvider();
  assert.deepEqual(p.createCommand('work'), ['herdr', '--session', 'work']);
});

test('killable providers expose canKill, others refuse', () => {
  assert.equal(new TmuxProvider().canKill(), true);
  assert.equal(new ScreenProvider().canKill(), true);
  assert.equal(new ZellijProvider().canKill(), true);
  // aoe and herdr are attach-only wrappers: their sessions live inside the host
  // tool, so killing must be refused (the UI hides Kill where canKill() is false).
  assert.equal(new AoeProvider().canKill(), false);
  assert.equal(new HerdrProvider().canKill(), false);
});