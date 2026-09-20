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

export function haveBin(bin) {
  try {
    execFileSync(isWindows() ? 'where' : 'which', [bin], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
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
