import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { createToastBus, defaultHostPing, reduceToasts } from '../src/toast-bus.mjs';

// Collect every event a bus emits so tests can assert dedupe/collapse behavior
// exactly as the ToastHost overlay sees it.
function collect(bus, events = []) {
  bus.subscribe((evt) => events.push(evt));
  return events;
}

test('a keyed error collapses repeats onto one overlay toast and pings the host once', () => {
  const pings = [];
  const bus = createToastBus((sev, text) => pings.push([sev, text]));
  const events = collect(bus);

  bus.notify('Could not load sessions — boom', 'error', 'providers');
  bus.notify('Could not load sessions — boom', 'error', 'providers');
  bus.notify('Could not load sessions — boom', 'error', 'providers');

  // One host ping, not one per poll tick.
  assert.equal(pings.length, 1);
  assert.deepEqual(pings[0], ['error', 'Could not load sessions — boom']);
  // Each notify pushes an add, but reduceToasts collapses same-key toasts:
  const list = events.reduce(reduceToasts, []);
  assert.equal(list.length, 1);
  assert.equal(list[0].severity, 'error');
  assert.equal(list[0].dedupeKey, 'providers');
  assert.equal(list[0].text, 'Could not load sessions — boom');
});

test('clearToast releases the key so a recovered-then-refailed source re-pings', () => {
  const pings = [];
  const bus = createToastBus((sev, text) => pings.push([sev, text]));

  bus.notify('poll fails', 'error', 'providers');
  bus.clearToast('providers');
  bus.notify('poll fails again after recovery', 'error', 'providers');

  assert.equal(pings.length, 2);
  assert.equal(bus.keyCount(), 1);
});

test('a manual dismiss releases the dedupe key for future distinct errors', () => {
  const pings = [];
  const bus = createToastBus((sev, text) => pings.push([sev, text]));
  collect(bus);

  bus.notify('first failure', 'error', 'create-session');
  const events = [];
  // Simulate the ToastHost dismiss: it calls clearToast(dedupeKey) then drops
  // the toast by id. Reduce the log down to what dismiss leaves behind.
  void events;
  bus.clearToast('create-session');

  bus.notify('second failure — genuine new error', 'error', 'create-session');
  assert.equal(pings.length, 2);
});

test('info notifications never become persistent overlay toasts', () => {
  const pings = [];
  const bus = createToastBus((sev, text) => pings.push([sev, text]));
  const events = collect(bus);

  bus.notify('Attached: work', 'info');

  assert.equal(events.length, 0);
  assert.equal(pings.length, 1);
  assert.deepEqual(pings[0], ['info', 'Attached: work']);
  assert.equal(bus.keyCount(), 0);
});

test('no dedupe key means every error re-pings the host (no collapse)', () => {
  const pings = [];
  const bus = createToastBus((sev, text) => pings.push([sev, text]));

  bus.notify('one-off error', 'error');
  bus.notify('one-off error', 'error');

  assert.equal(pings.length, 2);
});

test('reduceToasts: same-key add replaces, clear drops by key', () => {
  let list = [];
  list = reduceToasts(list, { op: 'add', toast: { id: 1, text: 'a', severity: 'error', dedupeKey: 'k' } });
  list = reduceToasts(list, { op: 'add', toast: { id: 2, text: 'b', severity: 'error', dedupeKey: 'k' } });
  assert.equal(list.length, 1);
  assert.equal(list[0].id, 2); // newest wins

  list = reduceToasts(list, { op: 'clear', dedupeKey: 'k' });
  assert.equal(list.length, 0);

  // Two distinct keys coexist.
  list = reduceToasts(list, { op: 'add', toast: { id: 3, text: 'x', severity: 'error', dedupeKey: 'a' } });
  list = reduceToasts(list, { op: 'add', toast: { id: 4, text: 'y', severity: 'error', dedupeKey: 'b' } });
  assert.equal(list.length, 2);

  // Unkeyed toasts are never collapsed.
  list = reduceToasts(list, { op: 'add', toast: { id: 5, text: 'z', severity: 'info', dedupeKey: '' } });
  list = reduceToasts(list, { op: 'add', toast: { id: 6, text: 'z2', severity: 'info', dedupeKey: '' } });
  assert.equal(list.length, 4);
});

test('subscribe returns an unsubscribe that stops delivery', () => {
  const bus = createToastBus(() => {});
  const events = [];
  const unsubscribe = bus.subscribe((evt) => events.push(evt));

  bus.pushToast('one', 'info', '');
  unsubscribe();
  bus.pushToast('two', 'info', '');

  assert.equal(events.length, 1);
});

test('clearToast with an empty key is ignored entirely', () => {
  const bus = createToastBus(() => {});
  const events = collect(bus);
  bus.notify('an error', 'error', 'real-key');
  const before = events.length;
  bus.clearToast('');
  bus.clearToast(undefined);
  bus.clearToast(null);
  assert.equal(events.length, before, 'no clear event emitted');
  assert.equal(bus.keyCount(), 1, 'real key still active');
});

test('a throwing subscriber does not prevent other subscribers from being notified', () => {
  const bus = createToastBus(() => {});
  const good = [];
  bus.subscribe(() => { throw new Error('subscriber exploded'); });
  bus.subscribe((evt) => good.push(evt));
  bus.pushToast('survives', 'error', 'k');
  assert.equal(good.length, 1);
  assert.equal(good[0].toast.text, 'survives');
});

// --- the default host ping ----------------------------------------------------

// defaultHostPing touches global `window` and `console`; both are swapped per
// test and restored afterwards so nothing leaks into other files.
const realWindow = globalThis.window;
const realLog = console.log;
afterEach(() => {
  globalThis.window = realWindow;
  console.log = realLog;
});

function withConsoleCaptured(fn) {
  const lines = [];
  console.log = (...args) => { lines.push(args.join(' ')); };
  fn(lines);
  return lines;
}

test('defaultHostPing posts to the host parent window when one exists', () => {
  const posted = [];
  globalThis.window = { parent: { postMessage: (msg, origin) => posted.push([msg, origin]) } };
  withConsoleCaptured(() => {
    defaultHostPing('error', 'something broke');
  });
  assert.equal(posted.length, 1);
  assert.deepEqual(posted[0][0], {
    source: 'kiro-crew-terminals', type: 'notify', text: 'something broke', severity: 'error',
  });
  assert.equal(posted[0][1], '*');
});

test('defaultHostPing logs to the console when there is no host window', () => {
  delete globalThis.window;
  const lines = withConsoleCaptured(() => {
    defaultHostPing('info', 'no host around');
  });
  assert.deepEqual(lines, ['[crew-terminals] no host around']);
});

test('defaultHostPing tolerates a throwing host and still logs', () => {
  globalThis.window = { parent: { postMessage: () => { throw new Error('cross-origin'); } } };
  const lines = withConsoleCaptured(() => {
    defaultHostPing('error', 'host hostile');
  });
  assert.deepEqual(lines, ['[crew-terminals] host hostile']);
});

test('defaultHostPing skips the parent when the window is its own parent (no host)', () => {
  const fake = { parent: null };
  fake.parent = fake; // self-parented: the dashboard host is absent
  globalThis.window = fake;
  const lines = withConsoleCaptured(() => {
    defaultHostPing('info', 'standalone');
  });
  assert.deepEqual(lines, ['[crew-terminals] standalone']);
});