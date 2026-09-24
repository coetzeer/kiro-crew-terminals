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