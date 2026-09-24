import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { computeProxySignature, verifyProxyRequest, loadAppSecret } from '../lib/proxy-verify.mjs';

const SECRET = 'unit-test-secret';
const APP = 'kiro-herdr-views';

beforeEach(() => {
  process.env.KIROCREW_PROXY_SECRET = SECRET;
});
afterEach(() => {
  delete process.env.KIROCREW_PROXY_SECRET;
  delete process.env.KIRO_HERRD_APP_SECRET;
});

// Build a minimal express-style req the same way server.mjs routes present one.
function makeReq({ method = 'GET', rawTarget = '/api/providers', body = '', header, timestamp }) {
  const ts = timestamp ?? Math.floor(Date.now() / 1000);
  const req = {
    method,
    url: rawTarget,
    headers: {},
  };
  if (body) req.rawBody = Buffer.from(body);
  if (header !== false) {
    const sig = computeProxySignature(SECRET, ts, method, rawTarget, req.rawBody);
    req.headers['x-kirocrew-proxy'] = `${ts}:${sig}`;
    if (header) req.headers['x-crew-proxy'] = header;
  }
  return req;
}

test('computeProxySignature is deterministic for identical input', () => {
  const a = computeProxySignature(SECRET, 1700000000, 'POST', '/api/path?x=1', Buffer.from('hello'));
  const b = computeProxySignature(SECRET, 1700000000, 'POST', '/api/path?x=1', Buffer.from('hello'));
  assert.equal(a, b);
  assert.match(a, /^[0-9a-f]{64}$/);
});

test('a correct signature verifies', () => {
  assert.equal(verifyProxyRequest(makeReq({}), APP), true);
  assert.equal(verifyProxyRequest(makeReq({ body: '{"a":1}' }), APP), true);
});

test('a tampered body fails', () => {
  const req = makeReq({ body: '{"a":1}' });
  req.rawBody = Buffer.from('{"a":2}'); // signed for {"a":1}, body now differs
  assert.equal(verifyProxyRequest(req, APP), false);
});

test('a wrong method fails', () => {
  const req = makeReq({ method: 'GET' });
  assert.equal(verifyProxyRequest(req, APP), true); // signed with GET
  req.url = '/api/providers' + '?extra=1';
  req.method = 'POST';
  assert.equal(verifyProxyRequest(req, APP), false);
});

test('an expired timestamp fails (skew beyond the 60s window)', () => {
  const old = Math.floor(Date.now() / 1000) - 600;
  const req = makeReq({ timestamp: old });
  assert.equal(verifyProxyRequest(req, APP), false);
});

test('missing or malformed header fails closed', () => {
  const req = makeReq({});
  delete req.headers['x-kirocrew-proxy'];
  assert.equal(verifyProxyRequest(req, APP), false);

  const colonless = makeReq({});
  colonless.headers['x-kirocrew-proxy'] = 'no-colon-here';
  assert.equal(verifyProxyRequest(req, APP), false);

  const badTs = makeReq({});
  badTs.headers['x-kirocrew-proxy'] = 'notanumber:abcd';
  assert.equal(verifyProxyRequest(req, APP), false);
});

test('the alternate header name is accepted', () => {
  const req = makeReq({});
  const auth = req.headers['x-kirocrew-proxy'];
  delete req.headers['x-kirocrew-proxy'];
  req.headers['x-crew-proxy'] = auth;
  assert.equal(verifyProxyRequest(req, APP), true);
});

test('a wrong secret fails even with a structurally valid signature', () => {
  const req = makeReq({});
  // Sign with a different secret than the one in env, keep everything else same.
  const sig = computeProxySignature('other-secret', Math.floor(Date.now() / 1000), req.method, req.url, req.rawBody);
  req.headers['x-kirocrew-proxy'] = `${Math.floor(Date.now() / 1000)}:${sig}`;
  assert.equal(verifyProxyRequest(req, APP), false);
});

test('no secret configured means every request is refused', () => {
  delete process.env.KIROCREW_PROXY_SECRET;
  delete process.env.KIRO_HERRD_APP_SECRET;
  // Use an app name with no on-disk secret so the env-unset state is total.
  const noApp = 'no-such-app-on-disk';
  assert.equal(loadAppSecret(noApp), '');
  assert.equal(verifyProxyRequest(makeReq({}), noApp), false);
});

test('KIRO_HERRD_ALLOW_UNSIGNED bypasses the gate (dev mode)', () => {
  process.env.KIRO_HERRD_ALLOW_UNSIGNED = '1';
  const req = makeReq({ header: false });
  assert.equal(verifyProxyRequest(req, APP), true);
  delete process.env.KIRO_HERRD_ALLOW_UNSIGNED;
});