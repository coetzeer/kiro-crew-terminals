// Route-level behavior of createServer(): authentication, provider metadata
// and naming, session create/attach, the detach-vs-kill safety contract, and
// REST input/resize. Runs against a real HTTP server on an ephemeral loopback
// port with stub providers and the fake session manager — no route can reach a
// real multiplexer, and every kill goes to a stub whose calls are recorded.
import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import WebSocket from 'ws';
import { computeProxySignature } from '../lib/proxy-verify.mjs';
import { nextFreeName } from '../server.mjs';
import { startTestServer, stubRegistry, createFakeSessionManager } from './helpers.mjs';

// Environment mutated by the auth tests is snapshotted and restored around
// every test so nothing leaks between files or tests (plan §7).
const ENV_KEYS = ['KIROCREW_PROXY_SECRET', 'KIRO_HERRD_APP_SECRET', 'KIRO_HERRD_ALLOW_UNSIGNED'];
beforeEach(() => { for (const k of ENV_KEYS) delete process.env[k]; });
afterEach(() => { for (const k of ENV_KEYS) delete process.env[k]; });

const json = (res) => res.json();

// --- Authentication and health ----------------------------------------------

test('health is served without proxy authentication on both paths', async () => {
  const s = await startTestServer({ allowUnsigned: false });
  try {
    for (const path of ['/health', '/api/health']) {
      const res = await fetch(s.base + path);
      assert.equal(res.status, 200);
      assert.deepEqual(await json(res), { ok: true, name: 'kiro-herdr-views' });
    }
  } finally { await s.cleanup(); }
});

test('an unsigned protected request is rejected with 403 by default', async () => {
  const s = await startTestServer({ allowUnsigned: false });
  try {
    const res = await fetch(s.base + '/api/providers');
    assert.equal(res.status, 403);
    assert.deepEqual(await json(res), { error: 'forbidden' });
  } finally { await s.cleanup(); }
});

test('a correctly signed protected request is permitted', async () => {
  process.env.KIROCREW_PROXY_SECRET = 'route-test-secret';
  const s = await startTestServer({ allowUnsigned: false });
  try {
    const target = '/api/providers';
    const ts = Math.floor(Date.now() / 1000);
    const sig = computeProxySignature('route-test-secret', ts, 'GET', target, Buffer.alloc(0));
    const res = await fetch(s.base + target, { headers: { 'x-kirocrew-proxy': ts + ':' + sig } });
    assert.equal(res.status, 200);
    assert.ok(Array.isArray((await json(res)).providers));
  } finally { await s.cleanup(); }
});

test('an invalid signature is rejected with 403', async () => {
  process.env.KIROCREW_PROXY_SECRET = 'route-test-secret';
  const s = await startTestServer({ allowUnsigned: false });
  try {
    const ts = Math.floor(Date.now() / 1000);
    const res = await fetch(s.base + '/api/providers', {
      headers: { 'x-kirocrew-proxy': ts + ':' + 'f'.repeat(64) },
    });
    assert.equal(res.status, 403);
  } finally { await s.cleanup(); }
});

test('unsigned requests are permitted only when the development flag is enabled', async () => {
  const s = await startTestServer({ allowUnsigned: false });
  try {
    // Flag absent: rejected.
    const off = await fetch(s.base + '/api/providers');
    assert.equal(off.status, 403);

    // Flag present (the documented `make dev` escape hatch): accepted.
    process.env.KIRO_HERRD_ALLOW_UNSIGNED = '1';
    // allowUnsigned was resolved at createServer time, so a fresh server sees it.
    const s2 = await startTestServer({ allowUnsigned: false });
    try {
      const on = await fetch(s2.base + '/api/providers');
      assert.equal(on.status, 200);
    } finally { await s2.cleanup(); }
    delete process.env.KIRO_HERRD_ALLOW_UNSIGNED;
  } finally { await s.cleanup(); }
});

test('an unsigned WebSocket upgrade is rejected with 403', async () => {
  const s = await startTestServer({ allowUnsigned: false });
  try {
    const ws = new WebSocket('ws://127.0.0.1:' + s.port + '/api/ws?ref=tmux:work');
    const status = await new Promise((resolve) => {
      ws.on('unexpected-response', (req, res) => resolve(res.statusCode));
      ws.on('error', () => resolve('error')); // destroyed sockets error before responding
      ws.on('open', () => resolve('opened'));
    });
    ws.terminate();
    assert.equal(status, 403);
  } finally { await s.cleanup(); }
});

// --- Providers and naming ---------------------------------------------------

test('GET /api/providers returns provider metadata, live sessions, and known sessions', async () => {
  const { registry } = stubRegistry({ tmuxSessions: [{ ref: 'work', name: 'work', provider: 'tmux', cmd: ['tmux', 'attach', '-t', 'work'] }] });
  const fake = createFakeSessionManager();
  fake.sm.createSession({ providerId: 'tmux', name: 'live', cmd: ['tmux', 'attach', '-t', 'live'], key: 'live' });
  fake.sm.known = [{ ref: 'tmux:known', providerId: 'tmux', name: 'known', key: 'known', cmd: ['tmux', 'attach'], cwd: '/tmp' }];
  const s = await startTestServer({ registry, sessionManager: fake.sm });
  try {
    const res = await fetch(s.base + '/api/providers');
    assert.equal(res.status, 200);
    const body = await json(res);
    const ids = body.providers.map((p) => p.id);
    assert.ok(ids.includes('tmux'));
    assert.ok(ids.includes('aoe'));
    const tmux = body.providers.find((p) => p.id === 'tmux');
    assert.equal(tmux.killable, true);
    assert.equal(tmux.sessions.length, 1);
    assert.equal(tmux.sessions[0].name, 'work');
    assert.deepEqual(body.sessions.map((x) => x.ref), ['tmux:live']);
    assert.deepEqual(body.known.map((x) => x.ref), ['tmux:known']);
  } finally { await s.cleanup(); fake.cleanup(); }
});

test('create-command returns 404 for an unknown provider', async () => {
  const s = await startTestServer();
  try {
    const res = await fetch(s.base + '/api/providers/nope/create-command');
    assert.equal(res.status, 404);
    assert.deepEqual(await json(res), { error: 'provider not found' });
  } finally { await s.cleanup(); }
});

test('create-command returns the requested name when it is free', async () => {
  const { registry } = stubRegistry();
  const s = await startTestServer({ registry });
  try {
    const res = await fetch(s.base + '/api/providers/tmux/create-command?name=fresh');
    assert.equal(res.status, 200);
    const body = await json(res);
    assert.equal(body.name, 'fresh');
    assert.equal(body.taken, false);
    assert.equal(typeof body.suggested, 'string');
  } finally { await s.cleanup(); }
});

test('create-command marks an existing requested name as taken and suggests a free one', async () => {
  const { registry } = stubRegistry({ tmuxSessions: [{ ref: 'work', name: 'work', provider: 'tmux', cmd: ['tmux', 'attach'] }] });
  const s = await startTestServer({ registry });
  try {
    const res = await fetch(s.base + '/api/providers/tmux/create-command?name=work');
    assert.equal(res.status, 200);
    const body = await json(res);
    assert.equal(body.name, 'work');
    assert.equal(body.taken, true);
    assert.equal(body.suggested, 'tmux-01');
    assert.notEqual(body.suggested, 'work');
  } finally { await s.cleanup(); }
});

test('create-command generates the first available provider-NN name and skips occupied ones', async () => {
  const occupied = (names) => names.map((name) => ({ ref: name, name, provider: 'tmux', cmd: ['tmux', 'attach', '-t', name] }));
  const first = stubRegistry();
  const s1 = await startTestServer({ registry: first.registry });
  const s2Registry = stubRegistry({ tmuxSessions: occupied(['tmux-01', 'tmux-02']) }).registry;
  const s2 = await startTestServer({ registry: s2Registry });
  try {
    const a = await json(await fetch(s1.base + '/api/providers/tmux/create-command'));
    assert.equal(a.name, 'tmux-01');

    const b = await json(await fetch(s2.base + '/api/providers/tmux/create-command'));
    assert.equal(b.name, 'tmux-03');
  } finally { await s1.cleanup(); await s2.cleanup(); }
});

test('nextFreeName falls back to a random suffix once all numbered names are taken', () => {
  const all = new Set(Array.from({ length: 99 }, (_, i) => 'tmux-' + String(i + 1).padStart(2, '0')));
  const deterministic = () => 0.987654321;
  const picked = nextFreeName('tmux', all, deterministic);
  const expectedSuffix = (0.987654321).toString(36).slice(2, 6);
  assert.equal(picked, 'tmux-' + expectedSuffix);
  assert.ok(!all.has(picked));
});

test('create-command exercises the random fallback after all numbered names are occupied', async () => {
  const occupied = Array.from({ length: 99 }, (_, i) => {
    const name = 'tmux-' + String(i + 1).padStart(2, '0');
    return { ref: name, name, provider: 'tmux', cmd: ['tmux', 'attach', '-t', name] };
  });
  const { registry } = stubRegistry({ tmuxSessions: occupied });
  const s = await startTestServer({ registry });
  const origRandom = Math.random;
  try {
    Math.random = () => 0.123456789;
    const body = await json(await fetch(s.base + '/api/providers/tmux/create-command'));
    const expectedSuffix = (0.123456789).toString(36).slice(2, 6);
    assert.equal(body.name, 'tmux-' + expectedSuffix);
  } finally {
    Math.random = origRandom;
    await s.cleanup();
  }
});

test('create-command returns the provider exact create command for the selected name', async () => {
  const { registry, providers } = stubRegistry();
  const s = await startTestServer({ registry });
  try {
    const body = await json(await fetch(s.base + '/api/providers/tmux/create-command?name=work'));
    assert.deepEqual(body.cmd, providers.tmux.createCommand('work'));
    assert.deepEqual(body.cmd, ['tmux', 'make', 'work']);
  } finally { await s.cleanup(); }
});

// --- Creating and attaching sessions -----------------------------------------

test('POST /sessions returns 400 when the provider is missing', async () => {
  const s = await startTestServer();
  try {
    const res = await fetch(s.base + '/api/sessions', post({}));
    assert.equal(res.status, 400);
    assert.deepEqual(await json(res), { error: 'provider required' });
  } finally { await s.cleanup(); }
});

test('POST /sessions returns 400 when a custom command is supplied', async () => {
  const s = await startTestServer();
  try {
    const res = await fetch(s.base + '/api/sessions', post({ provider: 'tmux', cmd: ['evil'] }));
    assert.equal(res.status, 400);
    assert.deepEqual(await json(res), { error: 'custom commands are not supported' });
  } finally { await s.cleanup(); }
});

test('POST /sessions returns 404 for an unknown provider', async () => {
  const s = await startTestServer();
  try {
    const create = await fetch(s.base + '/api/sessions', post({ provider: 'nope' }));
    assert.equal(create.status, 404);
    const attach = await fetch(s.base + '/api/sessions', post({ provider: 'nope', ref: 'x' }));
    assert.equal(attach.status, 404);
  } finally { await s.cleanup(); }
});

test('POST /sessions attaches to a discovered session by provider-native ref', async () => {
  const { registry } = stubRegistry({ tmuxSessions: [{ ref: '4242', name: 'work', provider: 'tmux', cmd: ['tmux', 'attach', '-t', '4242'] }] });
  const fake = createFakeSessionManager();
  const calls = [];
  const orig = fake.sm.createSession.bind(fake.sm);
  fake.sm.createSession = (desc) => { calls.push(desc); return orig(desc); };
  const s = await startTestServer({ registry, sessionManager: fake.sm });
  try {
    const res = await fetch(s.base + '/api/sessions', post({ provider: 'tmux', ref: '4242' }));
    assert.equal(res.status, 200);
    const body = await json(res);
    assert.equal(body.session.ref, 'tmux:4242');
    assert.equal(calls.length, 1);
    assert.deepEqual(calls[0], {
      providerId: 'tmux', name: 'work', key: '4242',
      cmd: ['tmux', 'attach', '-t', '4242'], cwd: undefined,
    });
  } finally { await s.cleanup(); fake.cleanup(); }
});

test('POST /sessions falls back to matching a discovered session by name', async () => {
  const { registry } = stubRegistry({ tmuxSessions: [{ ref: '4242', name: 'work', provider: 'tmux', cmd: ['tmux', 'attach', '-t', '4242'] }] });
  const fake = createFakeSessionManager();
  const s = await startTestServer({ registry, sessionManager: fake.sm });
  try {
    const res = await fetch(s.base + '/api/sessions', post({ provider: 'tmux', ref: 'work' }));
    assert.equal(res.status, 200);
    const body = await json(res);
    // The native identity, not the name, keys the mirror.
    assert.equal(body.session.ref, 'tmux:4242');
  } finally { await s.cleanup(); fake.cleanup(); }
});

test('POST /sessions returns 404 when the discovered session does not exist or has no cmd', async () => {
  const { registry } = stubRegistry({
    tmuxSessions: [
      { ref: 'work', name: 'work', provider: 'tmux', cmd: ['tmux', 'attach'] },
      { ref: 'cmdless', name: 'cmdless', provider: 'tmux' }, // discovered but unattachable
    ],
  });
  const s = await startTestServer({ registry });
  try {
    const missing = await fetch(s.base + '/api/sessions', post({ provider: 'tmux', ref: 'nope' }));
    assert.equal(missing.status, 404);
    const cmdless = await fetch(s.base + '/api/sessions', post({ provider: 'tmux', ref: 'cmdless' }));
    assert.equal(cmdless.status, 404);
    const err = await cmdless.json();
    assert.match(err.error, /no such tmux session/);
  } finally { await s.cleanup(); }
});

test('POST /sessions creates a new provider session with a generated free name', async () => {
  const { registry, providers } = stubRegistry();
  const fake = createFakeSessionManager();
  const s = await startTestServer({ registry, sessionManager: fake.sm });
  try {
    const res = await fetch(s.base + '/api/sessions', post({ provider: 'tmux' }));
    assert.equal(res.status, 200);
    const body = await json(res);
    assert.equal(body.session.name, 'tmux-01');
    assert.equal(body.session.ref, 'tmux:tmux-01');
    assert.deepEqual(providers.tmux.createCalls, ['tmux-01']);
    assert.deepEqual(body.session.cmd, ['tmux', 'attach', 'tmux-01']);
  } finally { await s.cleanup(); fake.cleanup(); }
});

test('POST /sessions returns 409 and a suggestion when the requested name already exists', async () => {
  const { registry } = stubRegistry({ tmuxSessions: [{ ref: 'work', name: 'work', provider: 'tmux', cmd: ['tmux', 'attach'] }] });
  const s = await startTestServer({ registry });
  try {
    const res = await fetch(s.base + '/api/sessions', post({ provider: 'tmux', name: 'work' }));
    assert.equal(res.status, 409);
    const body = await json(res);
    assert.match(body.error, /already exists/);
    assert.equal(body.suggested, 'tmux-01');
  } finally { await s.cleanup(); }
});

test('POST /sessions returns 500 and the provider error when creation throws', async () => {
  const { registry } = stubRegistry({
    tmuxCreate: async () => { throw new Error('tmux refused: duplicate session'); },
  });
  const s = await startTestServer({ registry });
  try {
    const res = await fetch(s.base + '/api/sessions', post({ provider: 'tmux', name: 'work' }));
    assert.equal(res.status, 500);
    const body = await json(res);
    assert.match(body.error, /duplicate session/);
  } finally { await s.cleanup(); }
});

test('POST /sessions returns 500 when a provider reports success without an attach command', async () => {
  const { registry } = stubRegistry({
    tmuxCreate: async () => ({ ref: 'work', name: 'work', provider: 'tmux' }), // no cmd
  });
  const s = await startTestServer({ registry });
  try {
    const res = await fetch(s.base + '/api/sessions', post({ provider: 'tmux' }));
    assert.equal(res.status, 500);
    const body = await json(res);
    assert.match(body.error, /no attach command/);
  } finally { await s.cleanup(); }
});

test('POST /sessions passes identity, native key, command and cwd to createSession', async () => {
  const { registry } = stubRegistry({
    tmuxCreate: async () => ({ ref: 'PID1', name: 'made', provider: 'tmux', cmd: ['tmux', 'attach', '-t', 'PID1'] }),
  });
  const fake = createFakeSessionManager();
  const calls = [];
  const orig = fake.sm.createSession.bind(fake.sm);
  fake.sm.createSession = (desc) => { calls.push(desc); return orig(desc); };
  const s = await startTestServer({ registry, sessionManager: fake.sm });
  try {
    const res = await fetch(s.base + '/api/sessions', post({ provider: 'tmux', cwd: '/home/user/project' }));
    assert.equal(res.status, 200);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].providerId, 'tmux');
    assert.equal(calls[0].name, 'made');
    assert.equal(calls[0].key, 'PID1');
    assert.deepEqual(calls[0].cmd, ['tmux', 'attach', '-t', 'PID1']);
    assert.equal(calls[0].cwd, '/home/user/project');
    // And the PTY spawn really received that command.
    assert.deepEqual(fake.fakePty.spawned[0].args, ['attach', '-t', 'PID1']);
    assert.equal(fake.fakePty.spawned[0].opts.cwd, '/home/user/project');
  } finally { await s.cleanup(); fake.cleanup(); }
});

// --- Detach and kill safety ---------------------------------------------------
// Invariant #1: closing a view never kills the host session. Every branch here
// asserts which of close() vs Provider.kill() ran — spies, not just status.

test('deleting a live mirror without kill detaches only and never calls Provider.kill()', async () => {
  const { registry, providers } = stubRegistry();
  const fake = createFakeSessionManager();
  fake.sm.createSession({ providerId: 'tmux', name: 'work', cmd: ['tmux', 'attach', '-t', 'work'], key: 'work' });
  const closeCalls = [];
  const origClose = fake.sm.close.bind(fake.sm);
  fake.sm.close = (ref) => { closeCalls.push(ref); return origClose(ref); };
  const s = await startTestServer({ registry, sessionManager: fake.sm });
  try {
    const res = await fetch(s.base + '/api/sessions/tmux:work', { method: 'DELETE' });
    assert.equal(res.status, 200);
    assert.deepEqual(await json(res), { ok: true, killed: false });
    // Detach: exactly one close, zero provider kills, one fake-PTY kill.
    assert.deepEqual(closeCalls, ['tmux:work']);
    assert.deepEqual(providers.tmux.killCalls, []);
    assert.equal(fake.fakePty.spawned[0].killCount, 1);
  } finally { await s.cleanup(); fake.cleanup(); }
});

test('deleting an unknown mirror without a kill request returns 404', async () => {
  const { registry, providers } = stubRegistry();
  const s = await startTestServer({ registry });
  try {
    const res = await fetch(s.base + '/api/sessions/tmux:nope', { method: 'DELETE' });
    assert.equal(res.status, 404);
    assert.deepEqual(providers.tmux.killCalls, []);
  } finally { await s.cleanup(); }
});

test('a kill request for a non-killable provider closes the mirror but never kills', async () => {
  const { registry, providers } = stubRegistry();
  const fake = createFakeSessionManager();
  fake.sm.createSession({ providerId: 'aoe', name: 'work', cmd: ['aoe', 'session', 'attach', 'work'], key: 'work' });
  const s = await startTestServer({ registry, sessionManager: fake.sm });
  try {
    const res = await fetch(s.base + '/api/sessions/aoe:work?kill=1', { method: 'DELETE' });
    assert.equal(res.status, 200);
    const body = await json(res);
    assert.equal(body.killed, false);
    assert.match(body.reason, /aoe sessions can only be stopped from aoe itself/);
    assert.deepEqual(providers.aoe.killCalls, []);
    assert.equal(fake.fakePty.spawned[0].killCount, 1);
  } finally { await s.cleanup(); fake.cleanup(); }
});

test('a kill request for a killable provider passes key and name to kill, then closes', async () => {
  const { registry, providers } = stubRegistry({
    tmuxKill: async () => ({ ok: true }),
  });
  const fake = createFakeSessionManager();
  fake.sm.createSession({ providerId: 'tmux', name: 'work', cmd: ['tmux', 'attach', '-t', 'work'], key: 'work' });
  const order = [];
  const origKill = providers.tmux.kill.bind(providers.tmux);
  providers.tmux.kill = async (arg) => { order.push('provider-kill'); return origKill(arg); };
  const origClose = fake.sm.close.bind(fake.sm);
  fake.sm.close = (ref) => { order.push('close'); return origClose(ref); };
  const s = await startTestServer({ registry, sessionManager: fake.sm });
  try {
    const res = await fetch(s.base + '/api/sessions/tmux:work?kill=1', { method: 'DELETE' });
    assert.equal(res.status, 200);
    assert.deepEqual(await json(res), { ok: true, killed: true, reason: '' });
    assert.deepEqual(providers.tmux.killCalls, [{ key: 'work', name: 'work' }]);
    assert.deepEqual(order, ['provider-kill', 'close']); // kill first, then detach
  } finally { await s.cleanup(); fake.cleanup(); }
});

test('a provider kill rejection is reported as killed:false and still closes the mirror', async () => {
  const { registry, providers } = stubRegistry({
    tmuxKill: async () => { throw new Error('tmux server unreachable'); },
  });
  const fake = createFakeSessionManager();
  fake.sm.createSession({ providerId: 'tmux', name: 'work', cmd: ['tmux', 'attach', '-t', 'work'], key: 'work' });
  const s = await startTestServer({ registry, sessionManager: fake.sm });
  try {
    const res = await fetch(s.base + '/api/sessions/tmux:work?kill=1', { method: 'DELETE' });
    assert.equal(res.status, 200);
    const body = await json(res);
    assert.equal(body.killed, false);
    assert.match(body.reason, /tmux server unreachable/);
    assert.equal(providers.tmux.killCalls.length, 1);
    assert.equal(fake.fakePty.spawned[0].killCount, 1);
  } finally { await s.cleanup(); fake.cleanup(); }
});

test('a discovered host session can be killed without first creating a mirror', async () => {
  const { registry, providers } = stubRegistry({
    tmuxSessions: [{ ref: '4242', name: 'work', provider: 'tmux', cmd: ['tmux', 'attach', '-t', '4242'] }],
    tmuxKill: async () => ({ ok: true }),
  });
  const fake = createFakeSessionManager();
  const s = await startTestServer({ registry, sessionManager: fake.sm });
  try {
    const res = await fetch(s.base + '/api/sessions/tmux:4242?kill=1', { method: 'DELETE' });
    assert.equal(res.status, 200);
    assert.deepEqual(await json(res), { ok: true, killed: true, reason: '' });
    // No mirror was ever created: the kill used the native identity directly.
    assert.equal(fake.fakePty.spawned.length, 0);
    assert.deepEqual(providers.tmux.killCalls, [{ key: '4242', name: 'work' }]);
  } finally { await s.cleanup(); fake.cleanup(); }
});

test('a discovered-session kill resolves the provider-native identity before killing', async () => {
  const { registry, providers } = stubRegistry({
    tmuxSessions: [{ ref: '4242', name: 'work', provider: 'tmux', cmd: ['tmux', 'attach', '-t', '4242'] }],
    tmuxKill: async () => ({ ok: true }),
  });
  const fake = createFakeSessionManager();
  const s = await startTestServer({ registry, sessionManager: fake.sm });
  try {
    // Ask by *name*, the kill must resolve to the pid-like native ref.
    const res = await fetch(s.base + '/api/sessions/tmux:work?kill=1', { method: 'DELETE' });
    assert.equal(res.status, 200);
    assert.deepEqual(providers.tmux.killCalls, [{ key: '4242', name: 'work' }]);
  } finally { await s.cleanup(); fake.cleanup(); }
});

test('a discovered-session kill returns 404 when no live provider session matches', async () => {
  const { registry, providers } = stubRegistry({
    tmuxSessions: [{ ref: '4242', name: 'work', provider: 'tmux', cmd: ['tmux', 'attach'] }],
    tmuxKill: async () => ({ ok: true }),
  });
  const s = await startTestServer({ registry });
  try {
    const res = await fetch(s.base + '/api/sessions/tmux:9999?kill=1', { method: 'DELETE' });
    assert.equal(res.status, 404);
    assert.deepEqual(providers.tmux.killCalls, []);
  } finally { await s.cleanup(); }
});

test('malformed references and unknown providers cannot trigger a host kill', async () => {
  const { registry, providers } = stubRegistry({
    tmuxSessions: [{ ref: '4242', name: 'work', provider: 'tmux', cmd: ['tmux', 'attach'] }],
    tmuxKill: async () => ({ ok: true }),
  });
  const s = await startTestServer({ registry });
  try {
    const noColon = await fetch(s.base + '/api/sessions/refwithoutcolon?kill=1', { method: 'DELETE' });
    assert.equal(noColon.status, 404);

    const unknownProv = await fetch(s.base + '/api/sessions/nope:4242?kill=1', { method: 'DELETE' });
    assert.equal(unknownProv.status, 404);

    const emptyNative = await fetch(s.base + '/api/sessions/tmux:?kill=1', { method: 'DELETE' });
    assert.equal(emptyNative.status, 404);

    assert.deepEqual(providers.tmux.killCalls, []);
    assert.deepEqual(providers.aoe.killCalls, []);
  } finally { await s.cleanup(); }
});

// --- REST input and resize -----------------------------------------------------

test('input without both a ref and string data is rejected', async () => {
  const s = await startTestServer();
  try {
    const noRef = await fetch(s.base + '/api/input', post({ data: 'x' }));
    assert.equal(noRef.status, 400);
    const noData = await fetch(s.base + '/api/input', post({ ref: 'tmux:work' }));
    assert.equal(noData.status, 400);
    const wrongType = await fetch(s.base + '/api/input', post({ ref: 'tmux:work', data: 42 }));
    assert.equal(wrongType.status, 400);
  } finally { await s.cleanup(); }
});

test('valid input is forwarded and the manager result returned', async () => {
  const fake = createFakeSessionManager();
  fake.sm.createSession({ providerId: 'tmux', name: 'work', cmd: ['tmux', 'attach', '-t', 'work'], key: 'work' });
  const s = await startTestServer({ sessionManager: fake.sm });
  try {
    const ok = await fetch(s.base + '/api/input', post({ ref: 'tmux:work', data: 'ls\r' }));
    assert.equal(ok.status, 200);
    assert.deepEqual(await json(ok), { ok: true });
    assert.deepEqual(fake.fakePty.spawned[0].writes, ['ls\r']);

    const unknown = await fetch(s.base + '/api/input', post({ ref: 'tmux:nope', data: 'x' }));
    assert.equal(unknown.status, 200);
    assert.deepEqual(await json(unknown), { ok: false });
  } finally { await s.cleanup(); fake.cleanup(); }
});

test('resize without a ref is rejected; valid resize is forwarded', async () => {
  const fake = createFakeSessionManager();
  fake.sm.createSession({ providerId: 'tmux', name: 'work', cmd: ['tmux', 'attach', '-t', 'work'], key: 'work' });
  const s = await startTestServer({ sessionManager: fake.sm });
  try {
    const noRef = await fetch(s.base + '/api/resize', post({ cols: 90, rows: 25 }));
    assert.equal(noRef.status, 400);

    const ok = await fetch(s.base + '/api/resize', post({ ref: 'tmux:work', cols: 90, rows: 25 }));
    assert.equal(ok.status, 200);
    assert.deepEqual(await json(ok), { ok: true });
    assert.deepEqual(fake.fakePty.spawned[0].resizes, [[90, 25]]);
  } finally { await s.cleanup(); fake.cleanup(); }
});

function post(body) {
  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}
