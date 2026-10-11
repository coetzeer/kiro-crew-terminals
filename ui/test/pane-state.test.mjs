import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  loadPanes, savePanes, loadActive, saveActive,
  addPane, removePane, nextActive, prunePanes, flattenDiscovered,
} from '../src/pane-state.mjs';

function fakeStorage(initial = new Map()) {
  return {
    getItem: (k) => (initial.has(k) ? initial.get(k) : null),
    setItem: (k, v) => { initial.set(k, String(v)); },
    throwOnRead: false,
    throwOnWrite: false,
  };
}
const throwingStorage = () => ({
  getItem: () => { throw new Error('quota'); },
  setItem: () => { throw new Error('quota'); },
});

const pane = (ref, name = ref) => ({ ref, providerId: 'tmux', name, cmd: ['tmux', 'attach', '-t', name] });

// --- persistence ---------------------------------------------------------------

test('loadPanes returns valid persisted panes', () => {
  const storage = fakeStorage(new Map([
    ['kiro-herdr-views:panes', JSON.stringify([pane('tmux:work')])],
  ]));
  const panes = loadPanes(storage);
  assert.equal(panes.length, 1);
  assert.equal(panes[0].ref, 'tmux:work');
});

test('loadPanes returns an empty list for malformed JSON or non-array data', () => {
  const broken = fakeStorage(new Map([['kiro-herdr-views:panes', '{ not json']]));
  assert.deepEqual(loadPanes(broken), []);
  const notArray = fakeStorage(new Map([['kiro-herdr-views:panes', '{"panes": []}']]));
  assert.deepEqual(loadPanes(notArray), []);
  assert.deepEqual(loadPanes(fakeStorage()), []); // nothing stored
});

test('loadPanes filters entries without a ref or cmd, and custom sessions', () => {
  const storage = fakeStorage(new Map([['kiro-herdr-views:panes', JSON.stringify([
    pane('tmux:work'),
    { ref: 'no-cmd', providerId: 'tmux' },
    { providerId: 'tmux', cmd: ['tmux'] }, // no ref
    { ref: 'custom:1', providerId: 'custom', cmd: ['sh'] },
    null,
  ])]]));
  const panes = loadPanes(storage);
  assert.deepEqual(panes.map((p) => p.ref), ['tmux:work']);
});

test('loadPanes and loadActive tolerate a throwing or missing storage', () => {
  assert.deepEqual(loadPanes(throwingStorage()), []);
  assert.equal(loadActive(throwingStorage()), '');
  assert.deepEqual(loadPanes(null), []);
  assert.equal(loadActive(null), '');
});

test('savePanes tolerates a throwing storage and round-trips through a real one', () => {
  assert.doesNotThrow(() => savePanes([pane('tmux:work')], throwingStorage()));
  const storage = fakeStorage();
  savePanes([pane('tmux:work'), pane('screen:42', 'side')], storage);
  assert.deepEqual(loadPanes(storage).map((p) => p.ref), ['tmux:work', 'screen:42']);
});

test('the active pane reference round-trips and an empty value is normalised', () => {
  const storage = fakeStorage();
  saveActive('tmux:work', storage);
  assert.equal(loadActive(storage), 'tmux:work');
  saveActive(null, storage);
  assert.equal(loadActive(storage), '');
});

// --- pane transitions ------------------------------------------------------------

test('addPane prevents a second pane for the same mirror reference', () => {
  const panes = [pane('tmux:work')];
  const same = addPane(panes, { ...pane('tmux:work'), cmd: ['tmux', 'attach', '-t', 'other'] });
  assert.equal(same, panes); // identity preserved: no re-render, no duplicate pane
  const grown = addPane(panes, pane('screen:42'));
  assert.deepEqual(grown.map((p) => p.ref), ['tmux:work', 'screen:42']);
  assert.equal(addPane(panes, null), panes); // invalid session is a no-op
});

test('nextActive keeps a valid selection and picks the newest pane when it is gone', () => {
  const panes = [pane('tmux:work'), pane('screen:42', 'side')];
  assert.equal(nextActive(panes, 'tmux:work'), 'tmux:work'); // still exists
  assert.equal(nextActive([pane('tmux:work')], pane('tmux:work').ref), 'tmux:work'); // newly opened
  assert.equal(nextActive(panes, 'tmux:gone'), 'screen:42'); // closed: fall back to the last
  assert.equal(nextActive([], 'tmux:work'), ''); // final pane closed
});

test('removePane detaches purely client-side: state only, no requests involved', () => {
  const panes = [pane('tmux:work'), pane('screen:42', 'side')];
  const next = removePane(panes, 'tmux:work');
  assert.deepEqual(next.map((p) => p.ref), ['screen:42']);
});

test('prunePanes drops a pane only when the backend forgot it and it never ended', () => {
  const panes = [pane('tmux:live'), pane('tmux:ended'), pane('tmux:forgotten')];
  const alive = new Set(['tmux:live', 'tmux:ended-known']);
  const ended = { 'tmux:ended': true };

  const next = prunePanes(panes, alive, ended);
  // 'tmux:forgotten' is absent from live∪known and never ended: dropped.
  // 'tmux:ended' is not alive but explicitly ended: kept for restart.
  assert.deepEqual(next.map((p) => p.ref), ['tmux:live', 'tmux:ended']);

  // Nothing to prune: the same array object comes back (React identity).
  const intact = prunePanes(next, new Set(['tmux:live', 'tmux:ended']), ended);
  assert.equal(intact, next);

  // An array (not a Set) of alive refs is accepted too.
  assert.deepEqual(prunePanes(panes, ['tmux:live', 'tmux:ended-known'], ended).map((p) => p.ref), ['tmux:live', 'tmux:ended']);
});

test('flattenDiscovered flattens provider groups deterministically and honours the filter', () => {
  const providers = [
    { id: 'tmux', sessions: [{ ref: 'work', name: 'work' }, { ref: 'side', name: 'side' }] },
    { id: 'screen', sessions: [{ ref: '42', name: 'old' }] },
    { id: 'aoe', sessions: null },
  ];
  const all = flattenDiscovered(providers, '');
  assert.deepEqual(all.map((s) => [s.providerId, s.ref]), [
    ['tmux', 'work'], ['tmux', 'side'], ['screen', '42'],
  ]);
  assert.deepEqual(all.map((s) => s.name), ['work', 'side', 'old']);

  const onlyScreen = flattenDiscovered(providers, 'screen');
  assert.deepEqual(onlyScreen.map((s) => [s.providerId, s.ref]), [['screen', '42']]);

  assert.deepEqual(flattenDiscovered(null, ''), []);
});
