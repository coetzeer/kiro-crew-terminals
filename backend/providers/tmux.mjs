import { execFile } from 'node:child_process';
import { Provider } from '../lib/registry.mjs';
import { findBin } from '../lib/paths.mjs';

const run = (cmd, args) =>
  new Promise((resolve) => {
    execFile(cmd, args, { encoding: 'utf8', env: { ...process.env, TERM: 'xterm-256color' } }, (err, stdout) => {
      resolve(err ? { ok: false, out: '' } : { ok: true, out: stdout });
    });
  });

export class TmuxProvider extends Provider {
  constructor() {
    super({ id: 'tmux', label: 'tmux', bin: 'tmux' });
  }

  async list() {
    const bin = findBin('tmux');
    const r = await run(bin, ['list-sessions', '-F', '#{session_name}:#{session_id}']);
    if (!r.ok) return [];
    return r.out
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [name, id] = line.split(':');
        return { ref: id || name, name, provider: this.id, cmd: [bin, 'attach', '-t', name] };
      });
  }

  async create(name) {
    const bin = findBin('tmux');
    await run(bin, ['new-session', '-d', '-s', name]);
    return { ref: name, name, provider: this.id, cmd: [bin, 'attach', '-t', name] };
  }

  createCommand(name) {
    return [this.bin, 'new-session', '-d', '-s', name];
  }
}
