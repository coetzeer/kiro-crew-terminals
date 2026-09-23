import { execFile } from 'node:child_process';
import { Provider } from '../lib/registry.mjs';
import { findBin } from '../lib/paths.mjs';

const run = (cmd, args) =>
  new Promise((resolve) => {
    execFile(cmd, args, { encoding: 'utf8', env: { ...process.env, TERM: 'xterm-256color' } }, (err, stdout) => {
      resolve(err ? { ok: false, out: '' } : { ok: true, out: stdout });
    });
  });

export class ZellijProvider extends Provider {
  constructor() {
    super({ id: 'zellij', label: 'zellij', bin: 'zellij' });
  }

  async list() {
    const bin = findBin('zellij');
    const r = await run(bin, ['list-sessions', '-n']);
    if (!r.ok) return [];
    return r.out
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((name) => ({ ref: name, name, provider: this.id, cmd: [bin, 'attach', name] }));
  }

  async create(name) {
    const bin = findBin('zellij');
    await run(bin, ['--session', name, '--detach']);
    return { ref: name, name, provider: this.id, cmd: [bin, 'attach', name] };
  }

  createCommand(name) {
    return [this.bin, '--session', name, '--detach'];
  }
}
