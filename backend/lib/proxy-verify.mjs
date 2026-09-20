import { createHmac, createHash, timingSafeEqual } from 'node:crypto';
import { readFileSync, existsSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

// Gateway signs proxied requests with:  X-Crew-Proxy: <timestamp>:<hmac>
// HMAC-SHA256(key=app_secret, "timestamp:method:/api/path[?query]:sha256(body)")
export function loadAppSecret(appName) {
  const candidates = [
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

export function computeProxySignature(secret, timestamp, method, rawPath, bodyBuf) {
  const bodyHash = createHash('sha256').update(bodyBuf || Buffer.alloc(0)).digest('hex');
  const msg = `${timestamp}:${method}:${rawPath}:${bodyHash}`;
  return createHmac('sha256', secret).update(msg).digest('hex');
}

export function verifyProxyRequest(req, appName) {
  if (process.env.KIRO_HERRD_ALLOW_UNSIGNED === '1') return true;
  const header = req.headers['x-crew-proxy'];
  if (!header || typeof header !== 'string') return false;
  const colon = header.indexOf(':');
  if (colon <= 0) return false;
  const timestamp = header.slice(0, colon);
  const provided = header.slice(colon + 1);
  const secret = loadAppSecret(appName);
  if (!secret) return false;
  const url = new URL(req.url || '', 'http://localhost');
  const body = req.body ? Buffer.from(req.body) : Buffer.alloc(0);
  const expected = computeProxySignature(secret, timestamp, req.method || 'GET', url.pathname + (url.search || ''), body);
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}