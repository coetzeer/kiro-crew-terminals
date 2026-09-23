import { createHmac, createHash, timingSafeEqual } from 'node:crypto';
import { readFileSync, existsSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

// The gateway signs every request it forwards here:
//
//   X-KiroCrew-Proxy: <ts>:<hmac_sha256(secret, "<ts>:<method>:<target>:<sha256(body)>")>
//
// where <target> is the RAW request-target this backend receives — path and
// query exactly as on the wire (e.g. "/api/sse?ref=abc") — and <secret> is the
// per-app proxy secret: the KIROCREW_PROXY_SECRET env var injected at spawn,
// else <app>/.app_secret.
//
// Source of truth: kiro_crew/apps/proxy_auth.py (verification) and
// kiro_crew/apps/routes.py::handle_app_api_proxy (signing).  Do NOT guess at
// this contract — a wrong header or env name fails closed with a silent 403
// that looks exactly like an auth problem at the gateway.
//
// The gate exists because the backend binds a loopback port: without it any
// other local process (another app, a compromised app, the agent) could reach
// in and drive terminals directly, bypassing the gateway's token auth and
// per-app scope (CWE-306).  Fail closed on anything unexpected.
const PROXY_HEADERS = ['x-kirocrew-proxy', 'x-crew-proxy'];
const MAX_SKEW_SECONDS = 60;

export function loadAppSecret(appName) {
  const candidates = [
    process.env.KIROCREW_PROXY_SECRET,
    process.env.KIRO_HERRD_APP_SECRET,
    readSecret(path.join(os.homedir(), '.kiro', 'crew', 'apps', appName, '.app_secret')),
    readSecret(path.join(os.homedir(), '.kiro', 'crew', 'apps', appName, 'app_secret')),
  ].filter(Boolean);
  return candidates[0] || '';
}

function readSecret(p) {
  try {
    if (!existsSync(p)) return null;
    return readFileSync(p, 'utf8').trim();
  } catch {
    return null;
  }
}

// Raw bytes of the body, exactly as received.  server.mjs captures them on the
// express.json verify hook (req.rawBody); without that the parsed object has
// already replaced the bytes and the hash cannot be reproduced.
function rawBody(req) {
  if (Buffer.isBuffer(req.rawBody)) return req.rawBody;
  if (Buffer.isBuffer(req.body)) return req.body;
  if (typeof req.rawBody === 'string') return Buffer.from(req.rawBody);
  return Buffer.alloc(0);
}

export function computeProxySignature(secret, timestamp, method, rawTarget, bodyBuf) {
  const bodyHash = createHash('sha256').update(bodyBuf || Buffer.alloc(0)).digest('hex');
  const msg = `${timestamp}:${method}:${rawTarget}:${bodyHash}`;
  return createHmac('sha256', secret).update(msg).digest('hex');
}

export function verifyProxyRequest(req, appName) {
  if (process.env.KIRO_HERRD_ALLOW_UNSIGNED === '1') return true;
  const headers = req.headers || {};
  let header = '';
  for (const name of PROXY_HEADERS) {
    if (typeof headers[name] === 'string') { header = headers[name]; break; }
  }
  if (!header) return false;
  const colon = header.indexOf(':');
  if (colon <= 0) return false;
  const timestamp = header.slice(0, colon);
  const provided = header.slice(colon + 1);
  if (!/^\d+$/.test(timestamp) || !provided) return false;
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > MAX_SKEW_SECONDS) return false;
  const secret = loadAppSecret(appName);
  if (!secret) return false;
  // req.url is the raw request-target Node received — the very bytes the
  // gateway signed.  Rebuilding it from a parsed URL re-encodes the query and
  // diverges as soon as a parameter carries a percent-encodable character.
  const target = req.url || '/';
  const expected = computeProxySignature(secret, timestamp, req.method || 'GET', target, rawBody(req));
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
