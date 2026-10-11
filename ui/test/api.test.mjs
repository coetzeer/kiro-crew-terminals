import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { apiGet, apiPost, apiDelete, killUrl, px } from '../src/api.mjs';

// Stub the global fetch: the helpers deliberately use the ambient client (the
// dashboard provides credentials via the browser), so tests intercept it and
// restore it after every case.
let restoreFetch = null;
afterEach(() => { if (restoreFetch) { restoreFetch(); restoreFetch = null; } });

function stubFetch(handler) {
  const calls = [];
  const orig = globalThis.fetch;
  globalThis.fetch = (path, init) => {
    calls.push({ path, init });
    return Promise.resolve(handler(path, init, calls.length));
  };
  restoreFetch = () => { globalThis.fetch = orig; };
  return calls;
}

const jsonResponse = (body, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: () => Promise.resolve(body),
});
const badJsonResponse = (status = 500) => ({
  ok: false,
  status,
  json: () => Promise.reject(new Error('invalid json')),
});

test('apiGet sends same-origin credentials', async () => {
  const calls = stubFetch(() => jsonResponse({ providers: [] }));
  const body = await apiGet(px('/providers'));
  assert.deepEqual(body, { providers: [] });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].path, '/apps/kiro-crew-terminals/api/providers');
  assert.deepEqual(calls[0].init, { credentials: 'same-origin' });
});

test('apiPost serializes the body, sets the JSON content type and credentials', async () => {
  const calls = stubFetch(() => jsonResponse({ session: {} }));
  await apiPost(px('/sessions'), { provider: 'tmux', ref: 'work' });
  assert.equal(calls[0].init.method, 'POST');
  assert.equal(calls[0].init.credentials, 'same-origin');
  assert.equal(calls[0].init.headers['Content-Type'], 'application/json');
  assert.equal(calls[0].init.body, JSON.stringify({ provider: 'tmux', ref: 'work' }));
});

test('apiPost serializes a missing body as an empty object', async () => {
  const calls = stubFetch(() => jsonResponse({}));
  await apiPost(px('/input'));
  assert.equal(calls[0].init.body, '{}');
});

test('apiDelete uses the DELETE method with same-origin credentials', async () => {
  const calls = stubFetch(() => jsonResponse({ ok: true }));
  await apiDelete(px('/sessions/tmux:work'));
  assert.equal(calls[0].init.method, 'DELETE');
  assert.equal(calls[0].init.credentials, 'same-origin');
});

test('errors prefer the server-provided error field', async () => {
  stubFetch(() => jsonResponse({ error: 'a tmux session named "work" already exists' }, 409));
  await assert.rejects(
    () => apiPost(px('/sessions'), { provider: 'tmux', name: 'work' }),
    /already exists/,
  );
});

test('errors fall back to the server-provided reason field', async () => {
  // A failed kill answers non-ok with the provider's own explanation.
  stubFetch(() => jsonResponse({ reason: 'tmux sessions can only be stopped from tmux itself' }, 500));
  await assert.rejects(() => apiDelete(px('/sessions/x?kill=1')), /stopped from tmux itself/);
});

test('errors fall back to method, path and status when the body is not JSON', async () => {
  stubFetch(() => badJsonResponse(500));
  await assert.rejects(() => apiDelete('/apps/kiro-crew-terminals/api/sessions/tmux:work'), /DELETE .* -> 500/);
  stubFetch(() => badJsonResponse(502));
  await assert.rejects(() => apiGet(px('/providers')), /GET .* -> 502/);
});

test('killUrl encodes the reference and always carries the kill marker', () => {
  assert.equal(killUrl('tmux:work'), '/apps/kiro-crew-terminals/api/sessions/tmux%3Awork?kill=1');
  assert.equal(killUrl('screen:12345'), '/apps/kiro-crew-terminals/api/sessions/screen%3A12345?kill=1');
  // A detach never goes through this URL: no kill marker anywhere else.
  assert.ok(!px('/sessions/tmux:work').includes('kill=1'));
});
