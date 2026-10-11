// SSE and WebSocket transport behavior against the real HTTP server: replay
// ordering, live streaming, exit handling, and cleanup of viewers/listeners/
// keepalive timers. Shares the fake session manager + stub registry seams from
// the route tests, so no transport test ever touches a real PTY (plan §4).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import WebSocket from 'ws';
import { startTestServer, createFakeSessionManager } from './helpers.mjs';

function makeSession(fake, ref = 'tmux:work', key = 'work') {
  const [providerId, name] = ref.split(':');
  fake.sm.createSession({ providerId, name, key, cmd: ['tmux', 'attach', '-t', name] });
  return fake.sm.get(ref);
}

async function waitUntil(fn, timeoutMs = 1000, everyMs = 10) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (fn()) return true;
    await new Promise((resolve) => setTimeout(resolve, everyMs));
  }
  return fn();
}

// A streaming reader for one SSE response. Owns the single body reader so a
// test can pull events across phases (replay, then live, then end).
function openSse(res) {
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = '';
  // Reads until `count` events (data messages or comments) have arrived, the
  // stream ends, or the timeout hits. Never throws on timeout.
  async function read(count, timeoutMs = 1500) {
    const events = [];
    const deadline = Date.now() + timeoutMs;
    while (events.length < count && Date.now() < deadline) {
      const remaining = deadline - Date.now();
      const step = await Promise.race([
        reader.read(),
        new Promise((resolve) => setTimeout(() => resolve({ timeout: true }), remaining)),
      ]);
      if (step.timeout) break;
      if (step.value) buf += decoder.decode(step.value, { stream: true });
      let idx;
      while ((idx = buf.indexOf('\n\n')) !== -1) {
        const block = buf.slice(0, idx);
        buf = buf.slice(idx + 2);
        const dataLine = block.split('\n').find((line) => line.startsWith('data: '));
        events.push(dataLine ? JSON.parse(dataLine.slice(6)) : { comment: block.replace(/^:\s?/, '') });
      }
      if (step.done) break;
    }
    return events;
  }
  return { read, reader };
}

// --- Server-Sent Events ------------------------------------------------------

test('sse returns 404 when the requested session does not exist', async () => {
  const s = await startTestServer();
  try {
    const res = await fetch(s.base + '/api/sse?ref=tmux:nope');
    assert.equal(res.status, 404);
    assert.deepEqual(await res.json(), { error: 'no such session' });
  } finally { await s.cleanup(); }
});

test('sse sets the event-stream and no-buffering headers', async () => {
  const fake = createFakeSessionManager();
  makeSession(fake);
  const s = await startTestServer({ sessionManager: fake.sm });
  const controller = new AbortController();
  try {
    const res = await fetch(s.base + '/api/sse?ref=tmux:work', { signal: controller.signal });
    assert.equal(res.status, 200);
    assert.equal(res.headers.get('content-type'), 'text/event-stream');
    assert.equal(res.headers.get('cache-control'), 'no-cache, no-transform');
    assert.equal(res.headers.get('x-accel-buffering'), 'no');
    await res.body.cancel().catch(() => {});
  } finally {
    controller.abort();
    await s.cleanup(); fake.cleanup();
  }
});

test('sse replays buffered chunks in order and then streams new output', async () => {
  const fake = createFakeSessionManager();
  makeSession(fake);
  fake.fakePty.emit(0, 'first');
  fake.fakePty.emit(0, 'second');
  const s = await startTestServer({ sessionManager: fake.sm });
  const controller = new AbortController();
  try {
    const res = await fetch(s.base + '/api/sse?ref=tmux:work', { signal: controller.signal });
    const sse = openSse(res);
    // Replay arrives as the first two events, in emit order.
    assert.deepEqual(await sse.read(2), [
      { type: 'chunk', data: 'first' },
      { type: 'chunk', data: 'second' },
    ]);
    // A chunk emitted after the viewer connected is streamed, not lost.
    await new Promise((resolve) => setTimeout(resolve, 20));
    fake.fakePty.emit(0, 'live');
    assert.deepEqual(await sse.read(1), [{ type: 'chunk', data: 'live' }]);
  } finally {
    controller.abort();
    await s.cleanup(); fake.cleanup();
  }
});

test('sse ends the stream when the session exits', async () => {
  const fake = createFakeSessionManager();
  makeSession(fake);
  const s = await startTestServer({ sessionManager: fake.sm });
  const controller = new AbortController();
  try {
    const res = await fetch(s.base + '/api/sse?ref=tmux:work', { signal: controller.signal });
    const sse = openSse(res);
    await new Promise((resolve) => setTimeout(resolve, 20));
    fake.fakePty.emit(0, 'bye');
    assert.deepEqual(await sse.read(1), [{ type: 'chunk', data: 'bye' }]);

    // The exit listener ends the response: the same reader now reaches done.
    fake.fakePty.exit(0);
    const step = await Promise.race([
      sse.reader.read(),
      new Promise((resolve) => setTimeout(() => resolve({ timeout: true }), 1000)),
    ]);
    assert.ok(!step.timeout, 'stream ended after exit');
    assert.equal(step.done, true);
  } finally {
    controller.abort();
    await s.cleanup(); fake.cleanup();
  }
});

test('sse cleanup removes the viewer and the exit listener when the request closes', async () => {
  const fake = createFakeSessionManager();
  const mirror = makeSession(fake);
  const s = await startTestServer({ sessionManager: fake.sm });
  const controller = new AbortController();
  try {
    assert.equal(mirror.viewers.size, 0);
    const baselineListeners = fake.sm.listenerCount('exit');
    // The viewer is registered before the response headers flush, so a
    // resolved fetch means the subscription is in place.
    await fetch(s.base + '/api/sse?ref=tmux:work', { signal: controller.signal });
    assert.equal(mirror.viewers.size, 1);
    assert.equal(fake.sm.listenerCount('exit'), baselineListeners + 1);

    controller.abort();
    assert.ok(await waitUntil(() => mirror.viewers.size === 0), 'viewer removed after close');
    assert.ok(await waitUntil(() => fake.sm.listenerCount('exit') === baselineListeners), 'exit listener removed');
  } finally {
    await s.cleanup(); fake.cleanup();
  }
});

test('sse clears the keepalive interval during cleanup', async () => {
  const fake = createFakeSessionManager();
  makeSession(fake);
  const s = await startTestServer({ sessionManager: fake.sm });

  // Track exactly the 15s keepalive interval (the only interval the SSE route
  // schedules), so unrelated timer noise cannot skew the assertion.
  const keepalives = new Map();
  const origSet = globalThis.setInterval;
  const origClear = globalThis.clearInterval;
  globalThis.setInterval = function (fn, ms, ...rest) {
    const id = origSet.call(globalThis, fn, ms, ...rest);
    if (ms === 15000) keepalives.set(id, false);
    return id;
  };
  globalThis.clearInterval = function (id) {
    if (keepalives.has(id)) keepalives.set(id, true);
    return origClear.call(globalThis, id);
  };
  const controller = new AbortController();
  try {
    await fetch(s.base + '/api/sse?ref=tmux:work', { signal: controller.signal });
    assert.equal(keepalives.size, 1, 'one keepalive scheduled');

    controller.abort();
    assert.ok(
      await waitUntil(() => [...keepalives.values()].every((cleared) => cleared)),
      'keepalive interval cleared after close',
    );
  } finally {
    globalThis.setInterval = origSet;
    globalThis.clearInterval = origClear;
    await s.cleanup(); fake.cleanup();
  }
});

// --- WebSocket ---------------------------------------------------------------

// Connect a ws client with every listener attached up front: the server sends
// the error/replay messages synchronously inside the upgrade callback, so a
// collector attached after `open` resolves can miss them entirely.
function wsConnect(s, path, timeoutMs = 2000) {
  const ws = new WebSocket('ws://127.0.0.1:' + s.port + path);
  const got = wsCollector(ws);
  const closed = wsClosed(ws);
  const opened = new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      ws.terminate();
      reject(new Error('ws open timed out for ' + path));
    }, timeoutMs);
    ws.on('open', () => { clearTimeout(timer); resolve(ws); });
    ws.on('error', (err) => { clearTimeout(timer); reject(err); });
    ws.on('unexpected-response', (req, res) => {
      clearTimeout(timer);
      reject(new Error('unexpected response ' + res.statusCode));
    });
  });
  return { ws, got, closed, opened };
}

// Collect parsed server messages until a predicate matches (or timeout).
function wsCollector(ws) {
  const messages = [];
  let notify = null;
  ws.on('message', (raw) => {
    try {
      const msg = JSON.parse(raw.toString());
      messages.push(msg);
      if (notify) { const n = notify; notify = null; n(); }
    } catch { /* not JSON from the server — ignore */ }
  });
  return {
    messages,
    async until(pred, timeoutMs = 1500) {
      const existing = () => messages.some(pred);
      if (existing()) return;
      const deadline = Date.now() + timeoutMs;
      while (Date.now() < deadline && !existing()) {
        await new Promise((resolve) => {
          notify = resolve;
          setTimeout(resolve, 50);
        });
      }
      if (!existing()) throw new Error('expected message not received; got: ' + JSON.stringify(messages));
    },
  };
}

function wsClosed(ws) {
  return new Promise((resolve) => ws.on('close', resolve));
}

test('upgrades for paths outside /api/ws are destroyed', async () => {
  const s = await startTestServer();
  try {
    const outcome = await new Promise((resolve) => {
      const ws = new WebSocket('ws://127.0.0.1:' + s.port + '/api/other?ref=tmux:work');
      ws.on('open', () => resolve('opened'));
      ws.on('error', () => resolve('error'));
      ws.on('close', () => resolve('closed'));
      ws.on('unexpected-response', (req, res) => resolve('response:' + res.statusCode));
    });
    assert.notEqual(outcome, 'opened');
  } finally { await s.cleanup(); }
});

test('a websocket for a missing session gets an error message and is closed', async () => {
  const s = await startTestServer();
  try {
    const c = wsConnect(s, '/api/ws?ref=tmux:nope');
    await c.opened;
    await c.got.until((m) => m.type === 'error');
    assert.deepEqual(c.got.messages, [{ type: 'error', message: 'no such session' }]);
    await c.closed; // closed by the server right after the error
  } finally { await s.cleanup(); }
});

test('a websocket replays the buffer in order, then streams live output', async () => {
  const fake = createFakeSessionManager();
  makeSession(fake);
  fake.fakePty.emit(0, 'first');
  fake.fakePty.emit(0, 'second');
  const s = await startTestServer({ sessionManager: fake.sm });
  try {
    const c = wsConnect(s, '/api/ws?ref=tmux:work');
    await c.opened;
    await c.got.until((m) => m.type === 'chunk' && m.data === 'second');
    assert.deepEqual(c.got.messages, [
      { type: 'chunk', data: 'first' },
      { type: 'chunk', data: 'second' },
    ]);

    fake.fakePty.emit(0, 'live');
    await c.got.until((m) => m.type === 'chunk' && m.data === 'live');
    c.ws.close();
    await c.closed;
  } finally { await s.cleanup(); fake.cleanup(); }
});

test('input and resize messages are forwarded to the session manager', async () => {
  const fake = createFakeSessionManager();
  makeSession(fake);
  const s = await startTestServer({ sessionManager: fake.sm });
  try {
    const c = wsConnect(s, '/api/ws?ref=tmux:work');
    await c.opened;
    // A first chunk proves the viewer pipeline is live before input is sent.
    fake.fakePty.emit(0, 'hi');
    await c.got.until((m) => m.type === 'chunk' && m.data === 'hi');

    c.ws.send(JSON.stringify({ type: 'input', data: 'ls\r' }));
    c.ws.send(JSON.stringify({ type: 'resize', cols: 90, rows: 25 }));
    assert.ok(await waitUntil(() => fake.fakePty.spawned[0].writes.length === 1));
    assert.deepEqual(fake.fakePty.spawned[0].writes, ['ls\r']);
    assert.ok(await waitUntil(() => fake.fakePty.spawned[0].resizes.length === 1));
    assert.deepEqual(fake.fakePty.spawned[0].resizes, [[90, 25]]);
    c.ws.close();
    await c.closed;
  } finally { await s.cleanup(); fake.cleanup(); }
});

test('malformed JSON and unsupported message types are ignored without disconnecting', async () => {
  const fake = createFakeSessionManager();
  makeSession(fake);
  const s = await startTestServer({ sessionManager: fake.sm });
  try {
    const c = wsConnect(s, '/api/ws?ref=tmux:work');
    await c.opened;
    fake.fakePty.emit(0, 'hi');
    await c.got.until((m) => m.type === 'chunk' && m.data === 'hi');

    c.ws.send('this is not json');
    c.ws.send(JSON.stringify({ type: 'mystery' }));
    c.ws.send(JSON.stringify(null));
    c.ws.send(JSON.stringify({ type: 'input', data: 42 })); // non-string data: ignored
    await new Promise((resolve) => setTimeout(resolve, 80));
    assert.deepEqual(fake.fakePty.spawned[0].writes, []);
    // Still connected and still functional afterwards.
    c.ws.send(JSON.stringify({ type: 'input', data: 'ok' }));
    assert.ok(await waitUntil(() => fake.fakePty.spawned[0].writes.length === 1));
    assert.deepEqual(fake.fakePty.spawned[0].writes, ['ok']);
    c.ws.close();
    await c.closed;
  } finally { await s.cleanup(); fake.cleanup(); }
});

test('an exit message is sent and the socket closed when the session exits', async () => {
  const fake = createFakeSessionManager();
  makeSession(fake);
  const s = await startTestServer({ sessionManager: fake.sm });
  try {
    const c = wsConnect(s, '/api/ws?ref=tmux:work');
    await c.opened;
    fake.fakePty.emit(0, 'hi');
    await c.got.until((m) => m.type === 'chunk' && m.data === 'hi');
    fake.fakePty.exit(0);
    await c.got.until((m) => m.type === 'exit');
    await c.closed;
  } finally { await s.cleanup(); fake.cleanup(); }
});

test('socket close removes viewers, listeners and the client entry', async () => {
  const fake = createFakeSessionManager();
  const mirror = makeSession(fake);
  const s = await startTestServer({ sessionManager: fake.sm });
  try {
    const baselineListeners = fake.sm.listenerCount('exit');
    const c = wsConnect(s, '/api/ws?ref=tmux:work');
    await c.opened;
    fake.fakePty.emit(0, 'hi');
    await c.got.until((m) => m.type === 'chunk' && m.data === 'hi');
    assert.equal(mirror.viewers.size, 1);
    assert.equal(fake.sm.listenerCount('exit'), baselineListeners + 1);

    c.ws.close();
    await c.closed;
    assert.ok(await waitUntil(() => mirror.viewers.size === 0), 'viewer removed');
    assert.ok(await waitUntil(() => fake.sm.listenerCount('exit') === baselineListeners), 'exit listener removed');
    // The server-side client set entry is dropped once the last socket goes.
    assert.ok(await waitUntil(() => s.wss.clients.size === 0), 'ws client entry removed');
  } finally { await s.cleanup(); fake.cleanup(); }
});
