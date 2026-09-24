import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createToastBus, reduceToasts } from '../src/toast-bus.mjs';

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