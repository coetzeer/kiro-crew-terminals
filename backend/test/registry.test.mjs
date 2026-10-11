import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Provider, ProviderRegistry } from '../lib/registry.mjs';

// A provider whose availability/session list are stubs, so tests never depend
// on which binaries happen to be installed on the machine.
class StubProvider extends Provider {
  constructor(opts) {
    super({ id: opts.id, label: opts.label || opts.id, bin: opts.bin || opts.id, ...(opts.multi !== undefined ? { multi: opts.multi } : {}) });
    this._available = opts.available ?? false;
    this._sessions = opts.sessions || [];
    this._killable = opts.killable ?? false;
  }
  available() { return this._available; }
  canKill() { return this._killable; }
  async list() { return this._sessions; }
}

test('base Provider refuses to kill by default', async () => {
  const p = new StubProvider({ id: 'tmux' });
  assert.equal(p.canKill(), false);
  const r = await p.kill({ key: 'x', name: 'y' });
  assert.equal(r.ok, false);
  assert.match(r.reason, /tmux/);
});

test('provider can opt into kill', () => {
  const p = new StubProvider({ id: 'tmux', killable: true });
  assert.equal(p.canKill(), true);
});

test('toInfo reports availability and killability', () => {
  const p = new StubProvider({ id: 'screen', available: true, killable: true });
  const info = p.toInfo();
  assert.equal(info.id, 'screen');
  assert.equal(info.available, true);
  assert.equal(info.killable, true);
});

test('registry registers, gets and lists providers', () => {
  const r = new ProviderRegistry();
  const a = new StubProvider({ id: 'a' });
  const b = new StubProvider({ id: 'b' });
  r.register(a);
  r.register(b);
  assert.equal(r.get('a'), a);
  assert.equal(r.get('nope'), undefined);
  assert.deepEqual(r.all().map((p) => p.id), ['a', 'b']);
  assert.deepEqual(r.available(), []);
});

test('listAll flattens each provider with its sessions and the provider id', async () => {
  const r = new ProviderRegistry();
  r.register(new StubProvider({
    id: 'tmux',
    available: true,
    sessions: [{ ref: 'work', name: 'work', provider: 'tmux', cmd: ['tmux', 'attach', '-t', 'work'] }],
  }));
  const out = await r.listAll();
  assert.equal(out.length, 1);
  assert.equal(out[0].provider, 'tmux');
  assert.equal(out[0].available, true);
  assert.equal(out[0].sessions.length, 1);
  assert.equal(out[0].sessions[0].name, 'work');
});

test('a provider whose list() throws is reported as empty, listAll does not throw', async () => {
  const r = new ProviderRegistry();
  const bad = new StubProvider({ id: 'bad' });
  bad.list = async () => { throw new Error('boom'); };
  r.register(bad);
  const out = await r.listAll();
  assert.equal(out[0].sessions.length, 0);
});

test('registering an existing provider id replaces it deterministically', () => {
  const r = new ProviderRegistry();
  const a = new StubProvider({ id: 'tmux' });
  const b = new StubProvider({ id: 'tmux', label: 'tmux (v2)', available: true });
  r.register(a);
  r.register(b);
  assert.equal(r.get('tmux'), b); // last registration wins
  assert.equal(r.all().length, 1);
  assert.equal(r.get('tmux').label, 'tmux (v2)');
  assert.deepEqual(r.available(), [b]);
});

test('available() returns only providers whose availability check succeeds', () => {
  const r = new ProviderRegistry();
  const yes = new StubProvider({ id: 'yes', available: true });
  const no = new StubProvider({ id: 'no', available: false });
  r.register(yes);
  r.register(no);
  assert.deepEqual(r.available(), [yes]);
});

test('a rejected list() in one provider does not prevent other provider groups', async () => {
  const r = new ProviderRegistry();
  const rejector = new StubProvider({ id: 'rejector', sessions: [{ ref: 'x', name: 'x' }] });
  rejector.list = async () => Promise.reject(new Error('cli hung'));
  const healthy = new StubProvider({
    id: 'healthy',
    available: true,
    sessions: [{ ref: 'work', name: 'work', provider: 'healthy', cmd: ['healthy', 'attach'] }],
  });
  r.register(rejector);
  r.register(healthy);
  const out = await r.listAll();
  assert.equal(out.length, 2);
  assert.deepEqual(out[0].sessions, []); // failed group degrades to empty
  assert.deepEqual(out[1].sessions.map((s) => s.name), ['work']);
});

test('listAll preserves provider metadata and full session descriptors', async () => {
  const r = new ProviderRegistry();
  r.register(new StubProvider({
    id: 'screen',
    label: 'screen',
    available: true,
    killable: true,
    sessions: [{ ref: '12345', name: 'work', provider: 'screen', cmd: ['screen', '-r', '12345'] }],
  }));
  const [group] = await r.listAll();
  assert.deepEqual(group, {
    id: 'screen',
    label: 'screen',
    available: true,
    killable: true,
    provider: 'screen',
    sessions: [{ ref: '12345', name: 'work', provider: 'screen', cmd: ['screen', '-r', '12345'] }],
  });
});