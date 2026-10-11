// Shared fakes for the unit suite. Nothing here touches a real terminal: the
// fake PTY is in-memory, the stub provider never shells out, and the scripted
// runner answers provider commands from a queue. Guards the plan's invariant
// that no test spawns or kills a host session.
import { mkdtempSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { Provider, ProviderRegistry } from '../lib/registry.mjs';
import { SessionManager } from '../lib/session-manager.mjs';
import { createServer } from '../server.mjs';

// ---------------------------------------------------------------------------
// Fake PTY
// ---------------------------------------------------------------------------

// A SessionManager-compatible `spawn` seam. Records every spawn's argv and
// options; tests drive output/exit through the returned handles so PTY
// lifecycle (buffering, viewer fan-out, retirement) is exercised for real.
export function createFakePtyFactory() {
  const spawned = [];
  const spawn = (shell, args, opts) => {
    const rec = {
      shell,
      args,
      opts,
      writes: [],
      resizes: [],
      killCount: 0,
      resizeError: null,
      killError: null,
      dataHandler: null,
      exitHandler: null,
    };
    rec.pty = {
      onData(fn) { rec.dataHandler = fn; },
      onExit(fn) { rec.exitHandler = fn; },
      write(data) { rec.writes.push(data); },
      resize(cols, rows) {
        rec.resizes.push([cols, rows]);
        if (rec.resizeError) throw rec.resizeError;
      },
      kill() {
        rec.killCount++;
        if (rec.killError) throw rec.killError;
      },
    };
    spawned.push(rec);
    return rec.pty;
  };
  return {
    spawn,
    spawned,
    // Emit PTY output / an exit event on the given record (or its index).
    emit(at, data) {
      const rec = typeof at === 'number' ? spawned[at] : at;
      if (rec && rec.dataHandler) rec.dataHandler(data);
    },
    exit(at, exitCode = 0) {
      const rec = typeof at === 'number' ? spawned[at] : at;
      if (rec && rec.exitHandler) rec.exitHandler({ exitCode });
    },
  };
}

// A SessionManager wired to the fake PTY and a throwaway data dir.
export function createFakeSessionManager() {
  const fakePty = createFakePtyFactory();
  const dir = mkdtempSync(path.join(os.tmpdir(), 'herdr-sm-test-'));
  const sm = new SessionManager({ pty: fakePty.spawn, dataDir: dir });
  return { sm, fakePty, dir, cleanup: () => rmSync(dir, { recursive: true, force: true }) };
}

// ---------------------------------------------------------------------------
// Stub provider
// ---------------------------------------------------------------------------

// A provider whose availability, session list and kill are stubs, so server
// route tests never depend on (or act on) installed multiplexer binaries.
export class StubProvider extends Provider {
  constructor(opts = {}) {
    super({
      id: opts.id,
      label: opts.label || opts.id,
      bin: opts.bin || opts.id,
      ...(opts.multi !== undefined ? { multi: opts.multi } : {}),
    });
    this._available = opts.available ?? true;
    this._sessions = opts.sessions || [];
    this._killable = opts.killable ?? false;
    this.killCalls = [];
    this.createCalls = [];
    this._createCommand = opts.createCommand || ((name) => [this.bin, 'make', name]);
    this._createImpl = opts.createImpl;
    this._killImpl = opts.killImpl;
  }
  available() { return this._available; }
  canKill() { return this._killable; }
  async list() { return this._sessions; }
  createCommand(name) { return this._createCommand(name); }
  async create(name) {
    this.createCalls.push(name);
    if (this._createImpl) return this._createImpl(name);
    return { ref: name, name, provider: this.id, cmd: [this.bin, 'attach', name] };
  }
  async kill(arg) {
    this.killCalls.push(arg);
    if (this._killImpl) return this._killImpl(arg);
    return { ok: true };
  }
}

// ---------------------------------------------------------------------------
// Scripted command runner (provider tests)
// ---------------------------------------------------------------------------

// Replaces a provider's `run` seam: every invocation pops the next scripted
// result ({ ok, out, err } or a function of (cmd, args)). An exhausted script
// throws — a provider calling an unexpected command is exactly the kind of
// regression these tests exist to catch.
export function scriptedRunner(steps, opts = {}) {
  const calls = [];
  const queue = [...steps];
  const run = (cmd, args) => {
    calls.push({ cmd, args });
    if (queue.length === 0) {
      return Promise.reject(new Error('unexpected command: ' + cmd + ' ' + args.join(' ')));
    }
    const step = queue.shift();
    const result = typeof step === 'function' ? step(cmd, args) : step;
    return Promise.resolve(result);
  };
  run.calls = calls;
  return run;
}

// Instant delay so retry/poll paths never sleep in tests.
export const instantDelay = () => Promise.resolve();

// A bin resolver that reports a stable fake path instead of consulting PATH.
export const fakeFindBin = (bin) => '/usr/bin/' + bin;

// ---------------------------------------------------------------------------
// Test server
// ---------------------------------------------------------------------------

// Boot createServer on an ephemeral loopback port with stub dependencies.
// `over.registry` / `over.sessionManager` default to stubs, so no route can
// reach a real provider; unsigned access is allowed by injection (the dev-flag
// path has its own dedicated tests in server-routes).
export async function startTestServer(over = {}) {
  const fake = over.sessionManager ? null : createFakeSessionManager();
  const sessionManager = over.sessionManager || fake.sm;
  const registry = over.registry || stubRegistry().registry;
  const created = createServer({
    sessionManager,
    registry,
    allowUnsigned: over.allowUnsigned !== undefined ? over.allowUnsigned : true,
    verify: over.verify,
  });
  await new Promise((resolve, reject) => {
    created.server.once('error', reject);
    created.server.listen(0, '127.0.0.1', resolve);
  });
  const port = created.server.address().port;
  const base = 'http://127.0.0.1:' + port;
  const close = () => new Promise((resolve) => {
    // Upgraded sockets survive http closeAllConnections(), so terminate the
    // ws clients explicitly — otherwise a test that abandons an open socket
    // would hang the teardown forever.
    for (const client of created.wss.clients) client.terminate();
    created.server.close(() => resolve());
    created.server.closeAllConnections && created.server.closeAllConnections();
  });
  return {
    ...created,
    port,
    base,
    close,
    cleanup: async () => {
      await close();
      if (fake) fake.cleanup();
    },
  };
}

// A registry of stub providers in the real ProviderRegistry, so the routes
// exercise real registry behavior with fake provider effects. Two providers —
// one killable, one not — cover every detach/kill branch without touching the
// real provider classes.
export function stubRegistry(overrides = {}) {
  const registry = new ProviderRegistry();
  const providers = {
    tmux: new StubProvider({
      id: 'tmux',
      label: 'tmux',
      killable: true,
      sessions: overrides.tmuxSessions || [],
      createImpl: overrides.tmuxCreate,
      killImpl: overrides.tmuxKill,
    }),
    aoe: new StubProvider({
      id: 'aoe',
      label: 'agent-of-empires',
      killable: false,
      sessions: overrides.aoeSessions || [],
      createImpl: overrides.aoeCreate,
      killImpl: overrides.aoeKill,
    }),
    ...overrides.providers,
  };
  for (const p of Object.values(providers)) registry.register(p);
  return { registry, providers };
}
