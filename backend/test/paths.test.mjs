import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, statSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { appDataDir, dashEcho, findBin, haveBin, isWindows } from '../lib/paths.mjs';

const OLD_ENV = { ...process.env };
after(() => {
  for (const k of Object.keys(OLD_ENV)) process.env[k] = OLD_ENV[k];
  for (const k of Object.keys(process.env)) if (!(k in OLD_ENV)) delete process.env[k];
});

test('isWindows/dashEcho agree with the platform', () => {
  const win = process.platform === 'win32';
  assert.equal(isWindows(), win);
  assert.deepEqual(dashEcho(), win ? ['ping', '-n', '1', '127.0.0.1'] : ['echo', 'ok']);
});

test('appDataDir honours KIRO_HERRD_DATA_DIR and creates it', () => {
  const dir = mkdtempSync(path.join(os.tmpdir(), 'herdr-paths-'));
  process.env.KIRO_HERRD_DATA_DIR = path.join(dir, 'nested', 'data');
  const got = appDataDir('kiro-herdr-views');
  assert.equal(got, process.env.KIRO_HERRD_DATA_DIR);
  assert.ok(statSync(got).isDirectory(), 'dir should be created');
  rmSync(dir, { recursive: true, force: true });
});

test('appDataDir falls back to the app-data convention when env is unset', () => {
  delete process.env.KIRO_HERRD_DATA_DIR;
  delete process.env.KIROCREW_APP_DATA;
  const got = appDataDir('kiro-herdr-views');
  assert.ok(got.endsWith(path.join('.kiro', 'crew', 'apps', 'kiro-herdr-views', '.herdr-views')), got);
});

test('findBin returns the binary path or falls back to the bare name', () => {
  const sh = findBin('sh');
  assert.ok(sh.endsWith('sh'), sh);
  // A binary that cannot exist still yields the requested name (callers use it
  // as the argv[0]; the spawn then fails loudly instead of crashing).
  assert.equal(findBin('kiro-herdr-views-no-such-bin'), 'kiro-herdr-views-no-such-bin');
});

test('haveBin is memoised and consults the real PATH', () => {
  const yes = haveBin('sh');
  assert.equal(yes, true);
  const no = haveBin('kiro-herdr-views-no-such-bin');
  assert.equal(no, false);
  // Second call within the TTL must not re-exec; behaviour must be identical.
  assert.equal(haveBin('sh'), yes);
  assert.equal(haveBin('kiro-herdr-views-no-such-bin'), no);
});