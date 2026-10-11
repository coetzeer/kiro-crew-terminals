import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  openDiscoveredSession, restartSession, killDiscoveredSession, killSession,
} from '../src/actions.mjs';
import { killUrl } from '../src/api.mjs';

// Recording API double: every flow gets its own, so a test can prove that a
// declined confirmation or a plain detach issues zero requests.
function recordingApi(behavior = {}) {
  const calls = { post: [], del: [] };
  return {
    calls,
    post: async (path, body) => {
      calls.post.push({ path, body });
      if (behavior.post) return behavior.post(path, body, calls.post.length);
      return { session: { ref: 'tmux:new', name: 'new' } };
    },
    del: async (path) => {
      calls.del.push({ path });
      if (behavior.del) return behavior.del(path, calls.del.length);
      return { ok: true, killed: true, reason: '' };
    },
  };
}

test('openDiscoveredSession attaches by provider-native ref, never by replaying a command', async () => {
  const api = recordingApi();
  const opened = [];
  await openDiscoveredSession(
    { providerId: 'screen', ref: '4242', name: 'work' },
    { api, onSession: (s) => opened.push(s) },
  );
  assert.equal(api.calls.post.length, 1);
  assert.equal(api.calls.post[0].path, '/apps/kiro-herdr-views/api/sessions');
  // The ref, not the command, is the payload.
  assert.deepEqual(api.calls.post[0].body, { provider: 'screen', ref: '4242' });
  assert.deepEqual(opened, [{ ref: 'tmux:new', name: 'new' }]);
});

test('openDiscoveredSession reports the error and refreshes when the attach fails', async () => {
  const api = recordingApi({ post: () => { throw new Error('no such screen session: 4242'); } });
  const errors = [];
  let refreshed = 0;
  await openDiscoveredSession(
    { providerId: 'screen', ref: '4242', name: 'work' },
    { api, onError: (m) => errors.push(m), refresh: () => { refreshed++; } },
  );
  assert.equal(errors.length, 1);
  assert.match(errors[0], /Could not open screen:work/);
  assert.match(errors[0], /no such screen session/);
  assert.equal(refreshed, 1);
});

test('restartSession re-creates by name and swaps the pane', async () => {
  const api = recordingApi();
  const events = [];
  await restartSession(
    { ref: 'tmux:old', providerId: 'tmux', name: 'work', key: 'work' },
    {
      api,
      onClose: (ref) => events.push(['close', ref]),
      onSession: (s) => events.push(['open', s.ref]),
    },
  );
  assert.deepEqual(api.calls.post.map((c) => c.body), [{ provider: 'tmux', name: 'work' }]);
  assert.deepEqual(events, [['close', 'tmux:old'], ['open', 'tmux:new']]);
});

test('restartSession falls back from create-by-name to attach-by-reference on conflict', async () => {
  // First POST (create by name) rejects — e.g. only our mirror died but the
  // host session still exists. The second POST (attach by key) succeeds.
  const api = recordingApi({
    post: (path, body, n) => {
      if (n === 1) throw new Error('already exists');
      return { session: { ref: 'tmux:work', name: 'work' } };
    },
  });
  const errors = [];
  const events = [];
  await restartSession(
    { ref: 'tmux:old', providerId: 'tmux', name: 'work', key: 'work' },
    {
      api,
      onClose: (ref) => events.push(['close', ref]),
      onSession: (s) => events.push(['open', s.ref]),
      onError: (m) => errors.push(m),
    },
  );
  assert.deepEqual(api.calls.post.map((c) => c.body), [
    { provider: 'tmux', name: 'work' },   // try to re-create
    { provider: 'tmux', ref: 'work' },    // fall back to attaching by native key
  ]);
  assert.deepEqual(events, [['close', 'tmux:old'], ['open', 'tmux:work']]);
  assert.deepEqual(errors, []); // the fallback recovered: no error surfaced
});

test('restartSession surfaces the error when both create and attach fail', async () => {
  const api = recordingApi({ post: () => { throw new Error('provider down'); } });
  const errors = [];
  await restartSession(
    { ref: 'tmux:old', providerId: 'tmux', name: 'work', key: 'work' },
    { api, onError: (m) => errors.push(m) },
  );
  assert.equal(errors.length, 1);
  assert.match(errors[0], /Could not restart work/);
});

test('restartSession refuses custom sessions without any request', async () => {
  const api = recordingApi();
  const errors = [];
  await restartSession(
    { ref: 'custom:1', providerId: 'custom', name: 'x' },
    { api, onError: (m) => errors.push(m) },
  );
  assert.deepEqual(api.calls.post, []);
  assert.match(errors[0], /Custom command sessions are no longer supported/);
});

test('a declined kill confirmation never issues a request', async () => {
  for (const flow of [killDiscoveredSession, killSession]) {
    const api = recordingApi();
    const confirmed = [];
    await flow(
      { ref: 'tmux:work', providerId: 'tmux', name: 'work' },
      {
        api,
        confirm: (msg) => { confirmed.push(msg); return false; },
        notify: () => assert.fail('no notification for a declined kill'),
        refresh: () => assert.fail('no refresh for a declined kill'),
      },
    );
    assert.equal(confirmed.length, 1, 'confirmation was asked once');
    assert.match(confirmed[0], /cannot be undone/);
    assert.deepEqual(api.calls.del, [], 'no DELETE issued');
  }
});

test('killDiscoveredSession kills via the encoded provider-native ref and reports success', async () => {
  const api = recordingApi();
  const notes = [];
  let refreshed = 0;
  await killDiscoveredSession(
    { providerId: 'screen', ref: '4242', name: 'work' },
    { api, confirm: () => true, notify: (msg, type) => notes.push([msg, type]), refresh: () => { refreshed++; } },
  );
  assert.deepEqual(api.calls.del, [{ path: killUrl('screen:4242') }]);
  assert.match(api.calls.del[0].path, /screen%3A4242\?kill=1$/);
  assert.deepEqual(notes, [['Killed screen:work', 'info']]);
  assert.equal(refreshed, 1);
});

test('killDiscoveredSession reports the reason when the kill does not succeed', async () => {
  const api = recordingApi({ del: () => ({ ok: true, killed: false, reason: 'screen could not quit' }) });
  const notes = [];
  await killDiscoveredSession(
    { providerId: 'screen', ref: '4242', name: 'work' },
    { api, confirm: () => true, notify: (msg, type) => notes.push([msg, type]) },
  );
  assert.equal(notes.length, 1);
  assert.match(notes[0][0], /Could not kill screen:work/);
  assert.match(notes[0][0], /screen could not quit/);
  assert.equal(notes[0][1], 'error');
});

test('killSession closes the pane either way and distinguishes kill from detach', async () => {
  const api = recordingApi({ del: () => ({ ok: true, killed: false, reason: 'tmux unreachable' }) });
  const notes = [];
  const closed = [];
  let refreshed = 0;
  await killSession(
    { ref: 'tmux:work', providerId: 'tmux', name: 'work' },
    {
      api,
      confirm: () => true,
      notify: (msg, type) => notes.push([msg, type]),
      onClose: (ref) => closed.push(ref),
      refresh: () => { refreshed++; },
    },
  );
  assert.deepEqual(api.calls.del, [{ path: killUrl('tmux:work') }]);
  // killed:false means the mirror was detached but the host session survived —
  // the message says so explicitly instead of claiming success.
  assert.equal(notes.length, 1);
  assert.match(notes[0][0], /Closed the view\./);
  assert.match(notes[0][0], /tmux unreachable/);
  assert.equal(notes[0][1], 'error');
  assert.deepEqual(closed, ['tmux:work']);
  assert.equal(refreshed, 1);
});

test('killSession surfaces a transport failure and still closes the pane', async () => {
  const api = recordingApi({ del: () => { throw new Error('network gone'); } });
  const notes = [];
  const closed = [];
  await killSession(
    { ref: 'tmux:work', providerId: 'tmux', name: 'work' },
    { api, confirm: () => true, notify: (msg, type) => notes.push([msg, type]), onClose: (r) => closed.push(r) },
  );
  assert.equal(notes.length, 1);
  // String(e) keeps the Error prefix — the original component behavior.
  assert.match(notes[0][0], /Kill failed — .*network gone/);
  assert.deepEqual(closed, ['tmux:work']);
});
