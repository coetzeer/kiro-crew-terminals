import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pickNameToSuggest } from '../src/name-suggest.mjs';

// Bug #1 regression: when the typed name is taken, the create-command response
// returns name = the colliding name and suggested = a free alternative. The
// "Use" affordance must hand back the free one, or it becomes a dead-end no-op.
test('taken name returns the free suggested name', () => {
  assert.equal(pickNameToSuggest({ name: 'screen-01', suggested: 'screen-02', taken: true }), 'screen-02');
});

test('free name returns the typed name unchanged', () => {
  assert.equal(pickNameToSuggest({ name: 'work', suggested: 'screen-01', taken: false }), 'work');
});

test('empty suggestion falls back to empty string, never undefined', () => {
  assert.equal(pickNameToSuggest({ name: 'work', suggested: '', taken: false }), 'work');
  assert.equal(pickNameToSuggest({ name: '', suggested: null, taken: true }), '');
  assert.equal(pickNameToSuggest(null), '');
  assert.equal(pickNameToSuggest(undefined), '');
});