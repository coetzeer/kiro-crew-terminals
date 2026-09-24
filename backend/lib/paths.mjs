import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

export function isWindows() {
  return process.platform === 'win32';
}

export function dashEcho() {
  return isWindows() ? ['ping', '-n', '1', '127.0.0.1'] : ['echo', 'ok'];
}

// Called once per provider on every /providers poll. A synchronous spawn there
// blocks the event loop, so memoise the answer for a short window: a tool
// installed while the app is running still shows up within the TTL.
const BIN_TTL_MS = 30000;
const binCache = new Map();

export function haveBin(bin) {
  const now = Date.now();
  const hit = binCache.get(bin);
  if (hit && now - hit.at < BIN_TTL_MS) return hit.ok;
  let ok = false;
  try {
    execFileSync(isWindows() ? 'where' : 'which', [bin], { stdio: 'ignore' });
    ok = true;
  } catch {
    ok = false;
  }
  binCache.set(bin, { at: now, ok });
  return ok;
}

export function findBin(bin) {
  const c = isWindows() ? 'where' : 'which';
  try {
    const out = execFileSync(c, [bin], { encoding: 'utf8' });
    return out.split(/\r?\n/).map((s) => s.trim()).find(Boolean) || bin;
  } catch {
    return bin;
  }
}

export function appDataDir(appName) {
  const base = process.env.KIRO_HERRD_DATA_DIR
    || (process.env.KIROCREW_APP_DATA
      ? path.join(process.env.KIROCREW_APP_DATA, appName)
      : path.join(os.homedir(), '.kiro', 'crew', 'apps', appName, '.herdr-views'));
  if (!existsSync(base)) mkdirSync(base, { recursive: true });
  return base;
}
